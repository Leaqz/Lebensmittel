from datetime import datetime
from sqlalchemy import (
    Boolean, Column, DateTime, Enum, ForeignKey,
    Integer, Numeric, String, Text, Index
)
from sqlalchemy.orm import relationship
from database import Base


class Supermarket(Base):
    __tablename__ = "supermarkets"

    id         = Column(Integer, primary_key=True, index=True)
    catalog_id = Column(String(20), unique=True, nullable=False)
    name       = Column(String(100), nullable=False)
    website    = Column(String(255))
    logo_url   = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)

    items          = relationship("Item", back_populates="supermarket")
    crawl_config   = relationship("CrawlConfig", back_populates="supermarket", uselist=False)
    crawl_history  = relationship("CrawlHistory", back_populates="supermarket")


class Category(Base):
    __tablename__ = "categories"

    id    = Column(Integer, primary_key=True, index=True)
    name  = Column(String(100), unique=True, nullable=False)
    emoji = Column(String(10), default="")

    items = relationship("Item", back_populates="category")


class Item(Base):
    __tablename__ = "items"

    id             = Column(Integer, primary_key=True, index=True)
    supermarket_id = Column(Integer, ForeignKey("supermarkets.id"), nullable=False)
    category_id    = Column(Integer, ForeignKey("categories.id"), nullable=True)
    name           = Column(String(255), nullable=False)
    brand          = Column(String(100))
    detail         = Column(String(255))
    unit           = Column(String(20))
    unit_size      = Column(Numeric(10, 3))
    image_url      = Column(String(500))
    external_id    = Column(String(255))
    created_at     = Column(DateTime, default=datetime.utcnow)
    updated_at     = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    supermarket = relationship("Supermarket", back_populates="items")
    category    = relationship("Category", back_populates="items")
    prices      = relationship("Price", back_populates="item", order_by="Price.crawled_at.desc()")

    __table_args__ = (
        Index("idx_supermarket_name", "supermarket_id", "name"),
        Index("idx_name", "name"),
    )


class Price(Base):
    __tablename__ = "prices"

    id           = Column(Integer, primary_key=True, index=True)
    item_id      = Column(Integer, ForeignKey("items.id", ondelete="CASCADE"), nullable=False)
    price        = Column(Numeric(10, 2), nullable=False)
    price_per_kg = Column(Numeric(10, 4))
    is_sale      = Column(Boolean, default=False)
    sale_label   = Column(String(255))
    crawled_at   = Column(DateTime, default=datetime.utcnow)

    item = relationship("Item", back_populates="prices")


class CrawlConfig(Base):
    __tablename__ = "crawl_config"

    id             = Column(Integer, primary_key=True, index=True)
    supermarket_id = Column(Integer, ForeignKey("supermarkets.id"), unique=True, nullable=False)
    is_enabled     = Column(Boolean, default=True)
    run_once       = Column(Boolean, default=True)
    max_items      = Column(Integer, default=500)
    delay_ms       = Column(Integer, default=1200)

    supermarket = relationship("Supermarket", back_populates="crawl_config")


class CrawlHistory(Base):
    __tablename__ = "crawl_history"

    id             = Column(Integer, primary_key=True, index=True)
    supermarket_id = Column(Integer, ForeignKey("supermarkets.id"), nullable=False)
    started_at     = Column(DateTime, default=datetime.utcnow)
    finished_at    = Column(DateTime)
    items_crawled  = Column(Integer, default=0)
    status         = Column(Enum("running", "success", "failed", "skipped"), default="running")
    error_message  = Column(Text)

    supermarket = relationship("Supermarket", back_populates="crawl_history")


class Meal(Base):
    __tablename__ = "meals"

    id               = Column(Integer, primary_key=True, index=True)
    name             = Column(String(255), nullable=False)
    name_de          = Column(String(255))
    description      = Column(Text)
    cuisine          = Column(String(100))
    prep_time_min    = Column(Integer)
    cook_time_min    = Column(Integer)
    default_servings = Column(Integer, default=4)
    tags             = Column(String(500))
    image_emoji      = Column(String(10), default="🍽️")
    created_at       = Column(DateTime, default=datetime.utcnow)

    ingredients = relationship("MealIngredient", back_populates="meal", cascade="all, delete-orphan")


class MealIngredient(Base):
    __tablename__ = "meal_ingredients"

    id               = Column(Integer, primary_key=True, index=True)
    meal_id          = Column(Integer, ForeignKey("meals.id", ondelete="CASCADE"), nullable=False)
    name             = Column(String(255), nullable=False)
    quantity         = Column(Numeric(10, 3), nullable=False)
    unit             = Column(String(30), nullable=False)
    notes            = Column(String(255))
    catalog_item_ids = Column(String(500))
    is_optional      = Column(Boolean, default=False)

    meal = relationship("Meal", back_populates="ingredients")
