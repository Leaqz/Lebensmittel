"""
BaseCrawler — shared crawl lifecycle + Open Food Facts product fetcher.

Each store subclass sets `catalog_id` and `price_multiplier`.
Products come from the Open Food Facts API (free, no auth needed),
with realistic store-specific prices assigned by category.
"""

import logging
import random
import re
import time
from datetime import datetime
from typing import Optional

import requests
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Category, CrawlConfig, CrawlHistory, Item, Price, Supermarket

logger = logging.getLogger(__name__)

# Realistic German grocery base prices (€) per category
CATEGORY_BASE_PRICES: dict[str, float] = {
    "Milchprodukte":    1.09,
    "Käse":             2.19,
    "Eier":             2.49,
    "Fleisch":          4.99,
    "Fisch":            3.99,
    "Gemüse":           1.49,
    "Obst":             1.99,
    "Nudeln & Reis":    0.89,
    "Konserven":        1.29,
    "Öle & Saucen":     2.49,
    "Backen & Gewürze": 1.49,
    "Backwaren":        1.99,
    "Getränke":         0.59,
}

OFF_API = "https://world.openfoodfacts.org/cgi/search.pl"

HEADERS = {
    "User-Agent": "GroceryGenius/1.0 (student project; github.com/Leaqz/Lebensmittel)",
    "Accept-Language": "de-DE,de;q=0.9",
}


class BaseCrawler:
    catalog_id: str = ""
    price_multiplier: float = 1.0   # store-level price index vs REWE baseline

    def __init__(self):
        self.db: Session = SessionLocal()
        self.supermarket: Optional[Supermarket] = None
        self.config: Optional[CrawlConfig] = None
        self.history: Optional[CrawlHistory] = None
        self.session = requests.Session()
        self.session.headers.update(HEADERS)

    # ── public entry point ──────────────────────────────────────────────────

    def run(self):
        try:
            self._load_supermarket()
            if not self._should_crawl():
                logger.info("[%s] Skipping (run_once or disabled).", self.catalog_id)
                self._record_history("skipped")
                return
            self._record_history("running")
            products = self.crawl_products()
            self._save_products(products)
            self._finish_history("success", len(products))
            logger.info("[%s] Done — %d products saved.", self.catalog_id, len(products))
        except Exception as exc:
            logger.exception("[%s] Crawl failed: %s", self.catalog_id, exc)
            self._finish_history("failed", 0, str(exc))
        finally:
            self.db.close()

    # ── subclass must implement ─────────────────────────────────────────────

    def crawl_products(self) -> list[dict]:
        raise NotImplementedError

    # ── Open Food Facts helper ──────────────────────────────────────────────

    def _fetch_off(self, search_term: str, category_name: str, page_size: int = 40) -> list[dict]:
        """Fetch real German products from Open Food Facts and assign realistic prices."""
        try:
            resp = self.session.get(
                OFF_API,
                params={
                    "action": "process",
                    "json": "1",
                    "tagtype_0": "countries",
                    "tag_contains_0": "contains",
                    "tag_0": "germany",
                    "search_terms": search_term,
                    "sort_by": "unique_scans_n",
                    "page_size": page_size,
                    "fields": "product_name,brands,quantity,image_url,image_front_url",
                },
                timeout=20,
            )
            resp.raise_for_status()
            raw_products = resp.json().get("products", [])
        except Exception as exc:
            logger.warning("[%s] OFF API error for '%s': %s", self.catalog_id, search_term, exc)
            return []

        base = CATEGORY_BASE_PRICES.get(category_name, 1.49)
        results: list[dict] = []
        seen: set[str] = set()

        for p in raw_products:
            name = re.sub(r"\s+", " ", (p.get("product_name") or "").strip())
            if not name or len(name) < 2 or name in seen:
                continue
            seen.add(name)

            # Realistic price: base × store multiplier × ±10 % random product variance
            variance = random.uniform(0.90, 1.10)
            price = round(max(0.29, base * self.price_multiplier * variance), 2)

            is_sale = random.random() < 0.07
            results.append({
                "name": name[:255],
                "detail": (p.get("quantity") or "")[:255] or None,
                "brand": ((p.get("brands") or "").split(",")[0].strip() or None),
                "image_url": (p.get("image_url") or p.get("image_front_url") or None),
                "price": price,
                "category": category_name,
                "is_sale": is_sale,
                "sale_label": "Angebot" if is_sale else None,
                "external_id": None,
            })

        time.sleep(0.4)  # polite rate-limiting toward OFF
        return results

    # ── DB helpers ──────────────────────────────────────────────────────────

    def _load_supermarket(self):
        self.supermarket = (
            self.db.query(Supermarket)
            .filter(Supermarket.catalog_id == self.catalog_id)
            .first()
        )
        if not self.supermarket:
            raise RuntimeError(f"Supermarket '{self.catalog_id}' not in DB — run startup seed first.")
        self.config = (
            self.db.query(CrawlConfig)
            .filter(CrawlConfig.supermarket_id == self.supermarket.id)
            .first()
        )

    def _should_crawl(self) -> bool:
        if not self.config or not self.config.is_enabled:
            return False
        if self.config.run_once:
            last_ok = (
                self.db.query(CrawlHistory)
                .filter(
                    CrawlHistory.supermarket_id == self.supermarket.id,
                    CrawlHistory.status == "success",
                )
                .order_by(CrawlHistory.finished_at.desc())
                .first()
            )
            return last_ok is None
        return True

    def _record_history(self, status: str):
        self.history = CrawlHistory(supermarket_id=self.supermarket.id, status=status)
        self.db.add(self.history)
        self.db.commit()
        self.db.refresh(self.history)

    def _finish_history(self, status: str, count: int, error: str = None):
        if self.history:
            self.history.finished_at = datetime.utcnow()
            self.history.status = status
            self.history.items_crawled = count
            self.history.error_message = error
            self.db.commit()

    def _get_or_create_category(self, name: str) -> Optional[Category]:
        if not name:
            return None
        cat = self.db.query(Category).filter(Category.name == name).first()
        if not cat:
            cat = Category(name=name)
            self.db.add(cat)
            self.db.commit()
            self.db.refresh(cat)
        return cat

    def _save_products(self, products: list[dict]):
        max_items = self.config.max_items if self.config else 200
        saved = 0
        for raw in products[:max_items]:
            try:
                category = self._get_or_create_category(raw.get("category"))

                # Upsert by name within this supermarket
                item = (
                    self.db.query(Item)
                    .filter(
                        Item.supermarket_id == self.supermarket.id,
                        Item.name == raw["name"],
                    )
                    .first()
                )
                if item is None:
                    item = Item(supermarket_id=self.supermarket.id, name=raw["name"])
                    self.db.add(item)

                item.detail      = raw.get("detail")
                item.brand       = raw.get("brand")
                item.image_url   = raw.get("image_url")
                item.external_id = raw.get("external_id")
                item.category_id = category.id if category else None
                self.db.flush()

                self.db.add(Price(
                    item_id    = item.id,
                    price      = raw["price"],
                    is_sale    = raw.get("is_sale", False),
                    sale_label = raw.get("sale_label"),
                ))
                self.db.commit()
                saved += 1
            except Exception as exc:
                logger.warning("[%s] Skipping '%s': %s", self.catalog_id, raw.get("name"), exc)
                self.db.rollback()

        logger.info("[%s] Persisted %d / %d products.", self.catalog_id, saved, len(products))
