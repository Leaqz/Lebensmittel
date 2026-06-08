"""
EDEKA Crawler — scrapes product data from edeka.de.

EDEKA's website uses server-rendered pages and JSON-LD product markup.
"""

import json
import logging
import re

from bs4 import BeautifulSoup

from crawlers.base import BaseCrawler

logger = logging.getLogger(__name__)

CATEGORY_URLS = [
    ("Milchprodukte",    "https://www.edeka.de/produkte/kuehlregal/milch-und-molkereiprodukte/"),
    ("Käse",             "https://www.edeka.de/produkte/kuehlregal/kaese/"),
    ("Eier",             "https://www.edeka.de/produkte/kuehlregal/eier/"),
    ("Fleisch",          "https://www.edeka.de/produkte/kuehlregal/fleisch-und-wurst/"),
    ("Fisch",            "https://www.edeka.de/produkte/kuehlregal/fisch-und-meeresfruchte/"),
    ("Gemüse",           "https://www.edeka.de/produkte/obst-und-gemuese/gemuese/"),
    ("Obst",             "https://www.edeka.de/produkte/obst-und-gemuese/obst/"),
    ("Nudeln & Reis",    "https://www.edeka.de/produkte/grundnahrungsmittel/nudeln-und-reis/"),
    ("Konserven",        "https://www.edeka.de/produkte/grundnahrungsmittel/konserven/"),
    ("Öle & Saucen",     "https://www.edeka.de/produkte/grundnahrungsmittel/oele-und-essig/"),
    ("Backen & Gewürze", "https://www.edeka.de/produkte/grundnahrungsmittel/gewuerze/"),
    ("Backwaren",        "https://www.edeka.de/produkte/brot-und-backwaren/"),
    ("Getränke",         "https://www.edeka.de/produkte/getraenke/wasser/"),
]


class EdekaCrawler(BaseCrawler):
    catalog_id = "edeka"

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
                logger.info("[edeka] %s → %d products", category_name, len(page_products))
            except Exception as exc:
                logger.warning("[edeka] Failed %s: %s", url, exc)

        return products

    def _parse_page(self, html: str, category: str) -> list[dict]:
        soup = BeautifulSoup(html, "lxml")
        products = []

        # JSON-LD structured data
        for script in soup.find_all("script", type="application/ld+json"):
            try:
                data = json.loads(script.string or "")
                item_list = []
                if isinstance(data, list):
                    item_list = data
                elif data.get("@type") == "ItemList":
                    item_list = data.get("itemListElement", [])
                elif data.get("@type") == "Product":
                    item_list = [data]

                for entry in item_list:
                    prod = entry.get("item", entry)
                    if prod.get("@type") != "Product":
                        continue
                    name = prod.get("name", "").strip()
                    offers = prod.get("offers", {})
                    if isinstance(offers, list):
                        offers = offers[0] if offers else {}
                    price_str = str(offers.get("price", "0")).replace(",", ".")
                    try:
                        price = float(price_str)
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

        # Fallback: generic product card scraping
        if not products:
            for card in soup.select(
                "[class*='product-tile'], [class*='ProductTile'], "
                "[class*='product-item'], article[class*='product']"
            ):
                try:
                    name_el = card.select_one("h2, h3, [class*='title'], [class*='name']")
                    price_el = card.select_one("[class*='price']")
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
                            "is_sale": bool(card.select_one("[class*='sale'], [class*='angebot']")),
                        })
                except Exception:
                    pass

        return products
