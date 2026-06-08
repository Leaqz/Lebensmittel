"""REWE crawler — uses Open Food Facts API, REWE is the baseline price index (1.0)."""

import logging
from crawlers.base import BaseCrawler

logger = logging.getLogger(__name__)

CATEGORIES = [
    ("Milchprodukte",    "vollmilch"),
    ("Milchprodukte",    "joghurt"),
    ("Käse",             "gouda"),
    ("Eier",             "eier"),
    ("Fleisch",          "rindfleisch"),
    ("Fleisch",          "schweinefleisch"),
    ("Fisch",            "thunfisch"),
    ("Gemüse",           "paprika"),
    ("Obst",             "bananen"),
    ("Nudeln & Reis",    "penne"),
    ("Nudeln & Reis",    "basmati"),
    ("Konserven",        "kichererbsen"),
    ("Öle & Saucen",     "rapsöl"),
    ("Backen & Gewürze", "backpulver"),
    ("Backwaren",        "vollkornbrot"),
    ("Getränke",         "apfelsaft"),
]


class ReweCrawler(BaseCrawler):
    catalog_id = "rewe"
    price_multiplier = 1.00  # REWE baseline

    def crawl_products(self) -> list[dict]:
        products: list[dict] = []
        seen: set[str] = set()

        for category_name, search_term in CATEGORIES:
            page_products = self._fetch_off(search_term, category_name, page_size=25)
            for p in page_products:
                if p["name"] not in seen:
                    seen.add(p["name"])
                    products.append(p)
            logger.info("[rewe] %s → %d products", category_name, len(page_products))

        return products
