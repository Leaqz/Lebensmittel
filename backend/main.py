import logging
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import items, meals, crawl

logger = logging.getLogger(__name__)

app = FastAPI(title="GroceryGenius API", version="1.0.0")

origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:3000,http://localhost:8080",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(items.router)
app.include_router(meals.router)
app.include_router(crawl.router)


@app.on_event("startup")
def startup():
    from database import engine, Base
    Base.metadata.create_all(bind=engine)
    _seed_supermarkets()
    logger.info("GroceryGenius backend ready.")


def _seed_supermarkets():
    from database import SessionLocal
    from models import Supermarket, CrawlConfig

    stores = [
        {"catalog_id": "aldi",  "name": "Aldi Süd",  "website": "https://www.aldi-sued.de"},
        {"catalog_id": "lidl",  "name": "Lidl",       "website": "https://www.lidl.de"},
        {"catalog_id": "rewe",  "name": "REWE",       "website": "https://www.rewe.de"},
        {"catalog_id": "edeka", "name": "EDEKA",      "website": "https://www.edeka.de"},
    ]

    db = SessionLocal()
    try:
        for s in stores:
            sm = db.query(Supermarket).filter(Supermarket.catalog_id == s["catalog_id"]).first()
            if not sm:
                sm = Supermarket(**s)
                db.add(sm)
                db.flush()
                db.add(CrawlConfig(
                    supermarket_id=sm.id,
                    is_enabled=True,
                    run_once=True,
                    max_items=200,
                    delay_ms=500,
                ))
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


@app.get("/api/health")
def health():
    return {"status": "ok"}
