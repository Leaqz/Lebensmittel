"""
BaseCrawler — shared logic for all supermarket crawlers.

Run-once logic:
  - crawl_config.run_once = TRUE  → crawl only if no prior 'success' entry exists
  - crawl_config.run_once = FALSE → crawl every time trigger is called

To re-enable a store after a one-time crawl:
    UPDATE crawl_config SET run_once = FALSE WHERE supermarket_id = X;
Or via API: PUT /api/crawl/config/{id}  {"run_once": false}
"""

import logging
import time
from datetime import datetime
from typing import Optional

import requests
from sqlalchemy.orm import Session

from database import SessionLocal
from models import (
    Category, CrawlConfig, CrawlHistory, Item, Price, Supermarket
)

logger = logging.getLogger(__name__)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "de-DE,de;q=0.9,en;q=0.8",
    "Accept": "text/html,application/xhtml+xml,application/json,*/*;q=0.8",
}


class BaseCrawler:
    catalog_id: str = ""   # must match supermarkets.catalog_id

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
                logger.info("[%s] Skipping crawl (run_once or disabled).", self.catalog_id)
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
        """
        Return a list of dicts:
          {
            name: str,
            detail: str | None,   e.g. '500-g-Packung'
            price: float,
            unit: str | None,     e.g. 'g', 'kg', 'ml', 'L', 'Stück'
            unit_size: float | None,
            category: str | None, matches categories.name
            brand: str | None,
            is_sale: bool,
            sale_label: str | None,
            image_url: str | None,
            external_id: str | None,
          }
        """
        raise NotImplementedError

    # ── helpers ─────────────────────────────────────────────────────────────

    def _get(self, url: str, **kwargs) -> requests.Response:
        delay = (self.config.delay_ms if self.config else 1200) / 1000
        time.sleep(delay)
        resp = self.session.get(url, timeout=20, **kwargs)
        resp.raise_for_status()
        return resp

    def _load_supermarket(self):
        self.supermarket = (
            self.db.query(Supermarket)
            .filter(Supermarket.catalog_id == self.catalog_id)
            .first()
        )
        if not self.supermarket:
            raise RuntimeError(f"Supermarket '{self.catalog_id}' not found in DB.")
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
        self.history = CrawlHistory(
            supermarket_id=self.supermarket.id,
            status=status,
        )
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

    def _get_or_create_category(self, name: str | None) -> Optional[Category]:
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
        max_items = self.config.max_items if self.config else 500
        for raw in products[:max_items]:
            try:
                category = self._get_or_create_category(raw.get("category"))
                # Upsert by external_id or (supermarket_id + name)
                item = None
                if raw.get("external_id"):
                    item = (
                        self.db.query(Item)
                        .filter(
                            Item.supermarket_id == self.supermarket.id,
                            Item.external_id == raw["external_id"],
                        )
                        .first()
                    )
                if item is None:
                    item = (
                        self.db.query(Item)
                        .filter(
                            Item.supermarket_id == self.supermarket.id,
                            Item.name == raw["name"],
                        )
                        .first()
                    )
                if item is None:
                    item = Item(
                        supermarket_id=self.supermarket.id,
                        name=raw["name"],
                    )
                    self.db.add(item)

                item.detail      = raw.get("detail")
                item.brand       = raw.get("brand")
                item.unit        = raw.get("unit")
                item.unit_size   = raw.get("unit_size")
                item.image_url   = raw.get("image_url")
                item.external_id = raw.get("external_id")
                item.category_id = category.id if category else None
                self.db.flush()

                price = Price(
                    item_id    = item.id,
                    price      = raw["price"],
                    price_per_kg = raw.get("price_per_kg"),
                    is_sale    = raw.get("is_sale", False),
                    sale_label = raw.get("sale_label"),
                )
                self.db.add(price)
            except Exception as exc:
                logger.warning("[%s] Skipping product '%s': %s", self.catalog_id, raw.get("name"), exc)
                self.db.rollback()
                continue

        self.db.commit()
