from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import get_db
from models import Meal, MealIngredient
from schemas import MealOut, MealListOut

router = APIRouter(prefix="/api/meals", tags=["meals"])


@router.get("", response_model=list[MealListOut])
def list_meals(db: Session = Depends(get_db)):
    meals = db.query(Meal).all()
    result = []
    for m in meals:
        out = MealListOut.model_validate(m)
        out.ingredient_count = len(m.ingredients)
        result.append(out)
    return result


@router.get("/{meal_id}", response_model=MealOut)
def get_meal(meal_id: int, db: Session = Depends(get_db)):
    meal = db.query(Meal).filter(Meal.id == meal_id).first()
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    return meal


@router.get("/{meal_id}/shopping-list")
def get_shopping_list(
    meal_id: int,
    servings: int = Query(4, ge=1, le=20),
    db: Session = Depends(get_db),
):
    meal = db.query(Meal).filter(Meal.id == meal_id).first()
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")

    ratio = Decimal(servings) / Decimal(meal.default_servings)

    shopping_list = []
    for ing in meal.ingredients:
        scaled_qty = float(Decimal(str(ing.quantity)) * ratio)
        # Round sensibly: whole numbers for pieces, 1 decimal for others
        if ing.unit in ("Stück", "Zehen", "Scheiben", "Kopf", "Stange", "EL", "TL"):
            scaled_qty = max(1, round(scaled_qty))
        else:
            scaled_qty = round(scaled_qty, 1)

        shopping_list.append({
            "name": ing.name,
            "quantity": scaled_qty,
            "unit": ing.unit,
            "notes": ing.notes,
            "catalog_item_ids": [x.strip() for x in ing.catalog_item_ids.split(",")] if ing.catalog_item_ids else [],
            "is_optional": ing.is_optional,
        })

    return {
        "meal": {
            "id": meal.id,
            "name": meal.name,
            "name_de": meal.name_de,
            "description": meal.description,
            "cuisine": meal.cuisine,
            "image_emoji": meal.image_emoji,
            "default_servings": meal.default_servings,
            "requested_servings": servings,
        },
        "shopping_list": shopping_list,
    }
