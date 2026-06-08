import threading
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db, SessionLocal
from models import Supermarket, CrawlConfig, CrawlHistory
from schemas import CrawlConfigOut, CrawlConfigUpdate, CrawlHistoryOut

router = APIRouter(prefix="/api/crawl", tags=["crawl"])

# Track whether a crawl is currently running
_crawl_running = False


def _run_crawlers_bg():
    global _crawl_running
    from crawlers.runner import run_all
    try:
        run_all()
    finally:
        _crawl_running = False


@router.post("/run")
def trigger_crawl():
    global _crawl_running
    if _crawl_running:
        return {"status": "already_running", "message": "Ein Crawl-Vorgang läuft bereits."}
    _crawl_running = True
    t = threading.Thread(target=_run_crawlers_bg, daemon=True)
    t.start()
    return {"status": "started", "message": "Crawler wurden gestartet."}


@router.get("/status")
def crawl_status(db: Session = Depends(get_db)):
    history = (
        db.query(CrawlHistory)
        .join(Supermarket)
        .order_by(CrawlHistory.started_at.desc())
        .limit(20)
        .all()
    )
    return {
        "is_running": _crawl_running,
        "history": [
            {
                "id": h.id,
                "supermarket": h.supermarket.name,
                "started_at": h.started_at,
                "finished_at": h.finished_at,
                "items_crawled": h.items_crawled,
                "status": h.status,
                "error_message": h.error_message,
            }
            for h in history
        ],
    }


@router.get("/config", response_model=list[CrawlConfigOut])
def get_crawl_configs(db: Session = Depends(get_db)):
    configs = db.query(CrawlConfig).join(Supermarket).all()
    return [
        CrawlConfigOut(
            id=c.id,
            supermarket_id=c.supermarket_id,
            supermarket_name=c.supermarket.name,
            is_enabled=c.is_enabled,
            run_once=c.run_once,
            max_items=c.max_items,
            delay_ms=c.delay_ms,
        )
        for c in configs
    ]


@router.put("/config/{config_id}", response_model=CrawlConfigOut)
def update_crawl_config(
    config_id: int,
    body: CrawlConfigUpdate,
    db: Session = Depends(get_db),
):
    config = db.query(CrawlConfig).filter(CrawlConfig.id == config_id).first()
    if not config:
        raise HTTPException(status_code=404, detail="Config not found")

    if body.is_enabled is not None:
        config.is_enabled = body.is_enabled
    if body.run_once is not None:
        config.run_once = body.run_once
    if body.max_items is not None:
        config.max_items = body.max_items
    if body.delay_ms is not None:
        config.delay_ms = body.delay_ms

    db.commit()
    db.refresh(config)

    return CrawlConfigOut(
        id=config.id,
        supermarket_id=config.supermarket_id,
        supermarket_name=config.supermarket.name,
        is_enabled=config.is_enabled,
        run_once=config.run_once,
        max_items=config.max_items,
        delay_ms=config.delay_ms,
    )
