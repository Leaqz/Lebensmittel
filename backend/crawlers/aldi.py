"""Aldi Süd crawler — uses Open Food Facts API, Aldi price index (~12 % below REWE)."""

import logging
from crawlers.base import BaseCrawler

logger = logging.getLogger(__name__)

CATEGORIES = [
    ("Milchprodukte",    "milch"),
    ("Käse",             "käse"),
    ("Eier",             "eier"),
    ("Fleisch",          "fleisch"),
    ("Fisch",            "fisch"),
    ("Gemüse",           "gemüse"),
    ("Obst",             "obst"),
    ("Nudeln & Reis",    "nudeln"),
    ("Konserven",        "konserven"),
    ("Öle & Saucen",     "speiseöl"),
    ("Backen & Gewürze", "mehl"),
    ("Backwaren",        "brot"),
    ("Getränke",         "mineralwasser"),
]


class AldiCrawler(BaseCrawler):
    catalog_id = "aldi"
    price_multiplier = 0.88  # Aldi is typically ~12 % cheaper than REWE

    def crawl_products(self) -> list[dict]:
        products: list[dict] = []
        seen: set[str] = set()

        for category_name, search_term in CATEGORIES:
            page_products = self._fetch_off(search_term, category_name, page_size=30)
            for p in page_products:
                if p["name"] not in seen:
                    seen.add(p["name"])
                    products.append(p)
            logger.info("[aldi] %s → %d products", category_name, len(page_products))

        return products
