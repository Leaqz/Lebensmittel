"""
Aldi Crawler — scrapes product data from aldi-sued.de.

Aldi Süd uses server-rendered pages with JSON-LD and product card elements.
"""

import json
import logging
import re

from bs4 import BeautifulSoup

from crawlers.base import BaseCrawler

logger = logging.getLogger(__name__)

CATEGORY_URLS = [
    ("Milchprodukte",    "https://www.aldi-sued.de/de/produkte/molkerei-kaeseprodukte/milch-und-milchdrinks.html"),
    ("Käse",             "https://www.aldi-sued.de/de/produkte/molkerei-kaeseprodukte/kaese.html"),
    ("Eier",             "https://www.aldi-sued.de/de/produkte/frische-lebensmittel/eier.html"),
    ("Fleisch",          "https://www.aldi-sued.de/de/produkte/frische-lebensmittel/fleisch-und-geflugel.html"),
    ("Fisch",            "https://www.aldi-sued.de/de/produkte/frische-lebensmittel/fisch.html"),
    ("Gemüse",           "https://www.aldi-sued.de/de/produkte/frische-lebensmittel/obst-und-gemuese/gemuese.html"),
    ("Obst",             "https://www.aldi-sued.de/de/produkte/frische-lebensmittel/obst-und-gemuese/obst.html"),
    ("Nudeln & Reis",    "https://www.aldi-sued.de/de/produkte/trockenwaren/nudeln-reis-und-huelsenfruechte.html"),
    ("Konserven",        "https://www.aldi-sued.de/de/produkte/trockenwaren/konserven-und-fertiggerichte.html"),
    ("Öle & Saucen",     "https://www.aldi-sued.de/de/produkte/trockenwaren/oel-essig-saucen-und-wuerzmittel.html"),
    ("Backen & Gewürze", "https://www.aldi-sued.de/de/produkte/trockenwaren/backen-und-getreidemehl.html"),
    ("Backwaren",        "https://www.aldi-sued.de/de/produkte/brot-und-backwaren.html"),
    ("Getränke",         "https://www.aldi-sued.de/de/produkte/getraenke/wasser.html"),
]


class AldiCrawler(BaseCrawler):
    catalog_id = "aldi"

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
                logger.info("[aldi] %s → %d products", category_name, len(page_products))
            except Exception as exc:
                logger.warning("[aldi] Failed %s: %s", url, exc)

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
                            "is_sale": offers.get("availability", "") == "OnSale",
                        })
            except Exception:
                pass

        # Fallback: generic card scraping
        if not products:
            for card in soup.select(
                "[class*='product-tile'], [class*='mod-article-tile'], "
                "article[class*='product']"
            ):
                try:
                    name_el = card.select_one("[class*='title'], h3, h2")
                    price_el = card.select_one("[class*='price'], [class*='Price']")
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
                            "is_sale": bool(card.select_one("[class*='offer'], [class*='angebot']")),
                        })
                except Exception:
                    pass

        return products
