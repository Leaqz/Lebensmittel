import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from dotenv import load_dotenv

load_dotenv()

DB_HOST     = os.getenv("DB_HOST", "localhost")
DB_PORT     = os.getenv("DB_PORT", "3306")
DB_USER     = os.getenv("DB_USER", "appuser")
DB_PASSWORD = os.getenv("DB_PASSWORD", "apppassword")
DB_NAME     = os.getenv("DB_NAME", "grocerygenius")

# Use SQLite when running locally (DB_HOST is localhost / not a Docker service name).
# Set DB_HOST=db (or any non-localhost value) to switch to MariaDB.
_USE_SQLITE = DB_HOST in ("localhost", "127.0.0.1")

if _USE_SQLITE:
    _db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "grocerygenius.db")
    DATABASE_URL = f"sqlite:///{_db_path}"
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
    )
else:
    DATABASE_URL = (
        f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}"
        f"@{DB_HOST}:{DB_PORT}/{DB_NAME}?charset=utf8mb4"
    )
    engine = create_engine(DATABASE_URL, pool_pre_ping=True, pool_recycle=3600)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
