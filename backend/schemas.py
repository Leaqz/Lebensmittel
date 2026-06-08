from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel


class SupermarketOut(BaseModel):
    id: int
    catalog_id: str
    name: str
    website: Optional[str] = None

    model_config = {"from_attributes": True}


class CategoryOut(BaseModel):
    id: int
    name: str
    emoji: str

    model_config = {"from_attributes": True}


class PriceOut(BaseModel):
    price: Decimal
    price_per_kg: Optional[Decimal] = None
    is_sale: bool
    sale_label: Optional[str] = None
    crawled_at: datetime

    model_config = {"from_attributes": True}


class ItemOut(BaseModel):
    id: int
    name: str
    brand: Optional[str] = None
    detail: Optional[str] = None
    unit: Optional[str] = None
    unit_size: Optional[Decimal] = None
    image_url: Optional[str] = None
    supermarket: SupermarketOut
    category: Optional[CategoryOut] = None
    current_price: Optional[Decimal] = None
    is_sale: bool = False
    sale_label: Optional[str] = None

    model_config = {"from_attributes": True}


class MealIngredientOut(BaseModel):
    id: int
    name: str
    quantity: Decimal
    unit: str
    notes: Optional[str] = None
    catalog_item_ids: Optional[str] = None
    is_optional: bool

    model_config = {"from_attributes": True}


class MealOut(BaseModel):
    id: int
    name: str
    name_de: Optional[str] = None
    description: Optional[str] = None
    cuisine: Optional[str] = None
    prep_time_min: Optional[int] = None
    cook_time_min: Optional[int] = None
    default_servings: int
    tags: Optional[str] = None
    image_emoji: str
    ingredients: list[MealIngredientOut] = []

    model_config = {"from_attributes": True}


class MealListOut(BaseModel):
    id: int
    name: str
    name_de: Optional[str] = None
    description: Optional[str] = None
    cuisine: Optional[str] = None
    prep_time_min: Optional[int] = None
    cook_time_min: Optional[int] = None
    default_servings: int
    tags: Optional[str] = None
    image_emoji: str
    ingredient_count: int = 0

    model_config = {"from_attributes": True}


class CrawlConfigOut(BaseModel):
    id: int
    supermarket_id: int
    supermarket_name: str
    is_enabled: bool
    run_once: bool
    max_items: int
    delay_ms: int

    model_config = {"from_attributes": True}


class CrawlConfigUpdate(BaseModel):
    is_enabled: Optional[bool] = None
    run_once: Optional[bool] = None
    max_items: Optional[int] = None
    delay_ms: Optional[int] = None


class CrawlHistoryOut(BaseModel):
    id: int
    supermarket_id: int
    supermarket_name: str
    started_at: datetime
    finished_at: Optional[datetime] = None
    items_crawled: int
    status: str
    error_message: Optional[str] = None

    model_config = {"from_attributes": True}
