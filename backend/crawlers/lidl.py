"""Lidl crawler — uses Open Food Facts API, Lidl price index (~8 % below REWE)."""

import logging
from crawlers.base import BaseCrawler

logger = logging.getLogger(__name__)

CATEGORIES = [
    ("Milchprodukte",    "milch"),
    ("Käse",             "käse"),
    ("Eier",             "eier"),
    ("Fleisch",          "hähnchen"),
    ("Fisch",            "lachs"),
    ("Gemüse",           "karotten"),
    ("Obst",             "äpfel"),
    ("Nudeln & Reis",    "spaghetti"),
    ("Konserven",        "tomaten dose"),
    ("Öle & Saucen",     "olivenöl"),
    ("Backen & Gewürze", "weizenmehl"),
    ("Backwaren",        "toast"),
    ("Getränke",         "wasser"),
]


class LidlCrawler(BaseCrawler):
    catalog_id = "lidl"
    price_multiplier = 0.92  # Lidl is typically ~8 % cheaper than REWE

    def crawl_products(self) -> list[dict]:
        products: list[dict] = []
        seen: set[str] = set()

        for category_name, search_term in CATEGORIES:
            page_products = self._fetch_off(search_term, category_name, page_size=30)
            for p in page_products:
                if p["name"] not in seen:
                    seen.add(p["name"])
                    products.append(p)
            logger.info("[lidl] %s → %d products", category_name, len(page_products))

        return products
