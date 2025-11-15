# create_tables.py
from database import Base, engine
import models  # Make sure this imports all your models (Doctor, User, etc.)

def create_all_tables():
    """Create all tables defined in models.py in the database."""
    Base.metadata.create_all(bind=engine)
    print("All tables have been created successfully.")

if __name__ == "__main__":
    create_all_tables()
