from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from routers import items, meals, crawl

app = FastAPI(title="GroceryGenius API", version="1.0.0")

# CORS — allow the Vite dev server and nginx frontend
origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:3000,http://localhost:8080"
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


@app.get("/api/health")
def health():
    return {"status": "ok"}
