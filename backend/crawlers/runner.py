"""
Runner — executes all crawlers in sequence.

Called by the API's POST /api/crawl/run endpoint (in a background thread)
or can be run directly:  python -m crawlers.runner
"""

import logging
import sys
import os

# Allow running as __main__ from the backend/ directory
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from crawlers.rewe import ReweCrawler
from crawlers.edeka import EdekaCrawler
from crawlers.lidl import LidlCrawler
from crawlers.aldi import AldiCrawler

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
)
logger = logging.getLogger(__name__)

CRAWLERS = [AldiCrawler, LidlCrawler, ReweCrawler, EdekaCrawler]


def run_all():
    logger.info("=== Starting crawl run ===")
    for CrawlerClass in CRAWLERS:
        name = CrawlerClass.catalog_id
        logger.info("--- Crawling %s ---", name)
        try:
            crawler = CrawlerClass()
            crawler.run()
        except Exception as exc:
            logger.exception("Crawler %s raised an unexpected error: %s", name, exc)
    logger.info("=== Crawl run complete ===")


if __name__ == "__main__":
    run_all()
