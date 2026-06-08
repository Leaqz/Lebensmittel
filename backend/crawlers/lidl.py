"""
Lidl Crawler — scrapes product data from lidl.de.

Lidl renders product pages server-side and uses JSON-LD markup plus
custom data attributes. We scrape category landing pages.
"""

import json
import logging
import re

from bs4 import BeautifulSoup

from crawlers.base import BaseCrawler

logger = logging.getLogger(__name__)

CATEGORY_URLS = [
    ("Milchprodukte",    "https://www.lidl.de/de/milch-molkereiprodukte/c-2506"),
    ("Käse",             "https://www.lidl.de/de/kaese/c-2513"),
    ("Eier",             "https://www.lidl.de/de/eier/c-2514"),
    ("Fleisch",          "https://www.lidl.de/de/fleisch-geflugel-wurst/c-2516"),
    ("Fisch",            "https://www.lidl.de/de/fisch-meeresfruchte/c-2519"),
    ("Gemüse",           "https://www.lidl.de/de/gemuese/c-2525"),
    ("Obst",             "https://www.lidl.de/de/obst/c-2524"),
    ("Nudeln & Reis",    "https://www.lidl.de/de/nudeln-reis/c-2532"),
    ("Konserven",        "https://www.lidl.de/de/konserven/c-2537"),
    ("Öle & Saucen",     "https://www.lidl.de/de/oel-essig-saucen/c-2541"),
    ("Backen & Gewürze", "https://www.lidl.de/de/backen-gewuerze/c-2545"),
    ("Backwaren",        "https://www.lidl.de/de/brot-gebeck/c-2527"),
    ("Getränke",         "https://www.lidl.de/de/wasser/c-2552"),
]


class LidlCrawler(BaseCrawler):
    catalog_id = "lidl"

    def crawl_products(self) -> list[dict]:
        products = []
        seen_names: set[str] = set()

        for category_name, url in CATEGORY_URLS:
            try:
                resp = self._get(url)
                page_products = self._parse_page(resp.text, category_name)
                for p in page_products:
                    if p["name"] not in seen_names:
                        seen_names.add(p["name"])
                        products.append(p)
                logger.info("[lidl] %s → %d products", category_name, len(page_products))
            except Exception as exc:
                logger.warning("[lidl] Failed %s: %s", url, exc)

        return products

    def _parse_page(self, html: str, category: str) -> list[dict]:
        soup = BeautifulSoup(html, "lxml")
        products = []

        # JSON-LD
        for script in soup.find_all("script", type="application/ld+json"):
            try:
                data = json.loads(script.string or "")
                items = []
                if isinstance(data, list):
                    items = data
                elif data.get("@type") == "ItemList":
                    items = [e.get("item", e) for e in data.get("itemListElement", [])]
                elif data.get("@type") == "Product":
                    items = [data]

                for prod in items:
                    if prod.get("@type") != "Product":
                        continue
                    name = prod.get("name", "").strip()
                    offers = prod.get("offers", {})
                    if isinstance(offers, list):
                        offers = offers[0] if offers else {}
                    try:
                        price = float(str(offers.get("price", 0)).replace(",", "."))
                    except ValueError:
                        continue
                    if name and price > 0:
                        products.append({
                            "name": name,
                            "price": price,
                            "category": category,
                            "image_url": prod.get("image"),
                            "brand": prod.get("brand", {}).get("name") if isinstance(prod.get("brand"), dict) else None,
                            "is_sale": False,
                        })
            except Exception:
                pass

        # Fallback: scrape product grid
        if not products:
            for card in soup.select(
                "[class*='product-grid-item'], [class*='ProductCard'], "
                "[data-testid*='product']"
            ):
                try:
                    name_el = card.select_one("[class*='product-title'], [class*='title'], h3")
                    price_el = card.select_one("[class*='pricebox__price'], [class*='price']")
                    if not name_el or not price_el:
                        continue
                    name = name_el.get_text(strip=True)
                    price_raw = re.sub(r"[^\d,.]", "", price_el.get_text())
                    price = float(price_raw.replace(",", ".")) if price_raw else 0
                    if name and price > 0:
                        products.append({
                            "name": name,
                            "price": price,
                            "category": category,
                            "is_sale": bool(card.select_one("[class*='sale'], [class*='rabatt']")),
                        })
                except Exception:
                    pass

        return products
