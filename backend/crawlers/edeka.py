"""EDEKA crawler — uses Open Food Facts API, EDEKA price index (~5 % above REWE)."""

import logging
from crawlers.base import BaseCrawler

logger = logging.getLogger(__name__)

CATEGORIES = [
    ("Milchprodukte",    "butter"),
    ("Milchprodukte",    "sahne"),
    ("Käse",             "camembert"),
    ("Eier",             "bio eier"),
    ("Fleisch",          "hackfleisch"),
    ("Fisch",            "forelle"),
    ("Gemüse",           "zucchini"),
    ("Obst",             "erdbeeren"),
    ("Nudeln & Reis",    "tagliatelle"),
    ("Konserven",        "erbsen dose"),
    ("Öle & Saucen",     "essig"),
    ("Backen & Gewürze", "zimt"),
    ("Backwaren",        "croissant"),
    ("Getränke",         "orangensaft"),
]


class EdekaCrawler(BaseCrawler):
    catalog_id = "edeka"
    price_multiplier = 1.05  # EDEKA typically ~5 % above REWE

    def crawl_products(self) -> list[dict]:
        products: list[dict] = []
        seen: set[str] = set()

        for category_name, search_term in CATEGORIES:
            page_products = self._fetch_off(search_term, category_name, page_size=25)
            for p in page_products:
                if p["name"] not in seen:
                    seen.add(p["name"])
                    products.append(p)
            logger.info("[edeka] %s → %d products", category_name, len(page_products))

        return products
