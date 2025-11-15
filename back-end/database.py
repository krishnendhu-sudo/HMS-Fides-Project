from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from pathlib import Path

# Resolve the DB path relative to this file so the same DB is used regardless of cwd
BASE_DIR = Path(__file__).resolve().parent
DB_FILE = BASE_DIR / "hospital.db"
DATABASE_URL = f"sqlite:///{DB_FILE.as_posix()}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
