from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models import Item, Price, Supermarket, Category
from schemas import ItemOut, SupermarketOut, CategoryOut

router = APIRouter(prefix="/api/items", tags=["items"])


def _attach_current_price(item: Item) -> ItemOut:
    latest = (
        item.prices[0] if item.prices else None
    )
    out = ItemOut.model_validate(item)
    if latest:
        out.current_price = latest.price
        out.is_sale = latest.is_sale
        out.sale_label = latest.sale_label
    return out


@router.get("", response_model=dict)
def list_items(
    db: Session = Depends(get_db),
    search: str = Query("", alias="q"),
    supermarket: str = Query(""),
    category: str = Query(""),
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=200),
):
    q = db.query(Item)

    if search:
        q = q.filter(Item.name.ilike(f"%{search}%"))
    if supermarket:
        q = q.join(Supermarket).filter(Supermarket.catalog_id == supermarket)
    if category:
        q = q.join(Category).filter(Category.name.ilike(f"%{category}%"))

    total = q.count()
    items = q.offset((page - 1) * per_page).limit(per_page).all()

    return {
        "items": [_attach_current_price(i) for i in items],
        "total": total,
        "page": page,
        "per_page": per_page,
    }


@router.get("/supermarkets", response_model=list[SupermarketOut])
def list_supermarkets(db: Session = Depends(get_db)):
    return db.query(Supermarket).all()


@router.get("/categories", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()
