"""
REWE Crawler — scrapes product data from shop.rewe.de.

REWE's shop uses a REST/JSON API that the browser calls when browsing categories.
We initialise a session (to pick up cookies), then request product pages.
"""

import logging
import re

from bs4 import BeautifulSoup

from crawlers.base import BaseCrawler

logger = logging.getLogger(__name__)

CATEGORY_URLS = [
    ("Milchprodukte",    "https://www.rewe.de/produkte/kuehlung-molkerei/milch-und-trinkmilch/"),
    ("Milchprodukte",    "https://www.rewe.de/produkte/kuehlung-molkerei/joghurt-quark-dessert/"),
    ("Käse",             "https://www.rewe.de/produkte/kuehlung-molkerei/kaese/"),
    ("Eier",             "https://www.rewe.de/produkte/kuehlung-molkerei/eier/"),
    ("Fleisch",          "https://www.rewe.de/produkte/fleisch-geflugel-wurst/rind-kalbfleisch/"),
    ("Fleisch",          "https://www.rewe.de/produkte/fleisch-geflugel-wurst/schweinefleisch/"),
    ("Fleisch",          "https://www.rewe.de/produkte/fleisch-geflugel-wurst/geflugel/"),
    ("Fisch",            "https://www.rewe.de/produkte/fisch-meeresfruchte/"),
    ("Gemüse",           "https://www.rewe.de/produkte/obst-gemuese/gemuese/"),
    ("Obst",             "https://www.rewe.de/produkte/obst-gemuese/obst/"),
    ("Nudeln & Reis",    "https://www.rewe.de/produkte/nudeln-reis-huelsenfruechte/nudeln/"),
    ("Nudeln & Reis",    "https://www.rewe.de/produkte/nudeln-reis-huelsenfruechte/reis/"),
    ("Konserven",        "https://www.rewe.de/produkte/konserven-fertiggerichte/"),
    ("Öle & Saucen",     "https://www.rewe.de/produkte/oel-essig-gewuerze/speiseoele/"),
    ("Backen & Gewürze", "https://www.rewe.de/produkte/oel-essig-gewuerze/gewuerze/"),
    ("Backwaren",        "https://www.rewe.de/produkte/brot-gebeck/brot/"),
    ("Getränke",         "https://www.rewe.de/produkte/getraenke/wasser/"),
]


class ReweCrawler(BaseCrawler):
    catalog_id = "rewe"

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
                logger.info("[rewe] %s → %d products", category_name, len(page_products))
            except Exception as exc:
                logger.warning("[rewe] Failed %s: %s", url, exc)

        return products

    def _parse_page(self, html: str, category: str) -> list[dict]:
        soup = BeautifulSoup(html, "lxml")
        products = []

        # REWE product cards use data attributes or structured divs
        # Try JSON-LD first (richest data)
        for script in soup.find_all("script", type="application/ld+json"):
            try:
                import json
                data = json.loads(script.string or "")
                if isinstance(data, list):
                    items = data
                elif data.get("@type") == "ItemList":
                    items = data.get("itemListElement", [])
                else:
                    items = [data]
                for item in items:
                    prod = item.get("item", item)
                    if prod.get("@type") == "Product":
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
                                "image_url": (prod.get("image") or [None])[0]
                                if isinstance(prod.get("image"), list)
                                else prod.get("image"),
                                "brand": prod.get("brand", {}).get("name") if isinstance(prod.get("brand"), dict) else None,
                                "is_sale": False,
                            })
            except Exception:
                pass

        # Fallback: scrape product card elements
        if not products:
            for card in soup.select("[class*='ProductCard'], [class*='product-card'], article[class*='product']"):
                try:
                    name_el = card.select_one("[class*='ProductCard__title'], [class*='product-name'], h3, h2")
                    price_el = card.select_one("[class*='ProductCard__price'], [class*='price__selling'], [class*='product-price']")
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
