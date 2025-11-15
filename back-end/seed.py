from sqlalchemy.orm import Session
from models import Medicine, Kit, Company
from database import SessionLocal, engine, Base

# Make sure tables exist
Base.metadata.create_all(bind=engine)

def seed_kits(db: Session):
    # Seed companies first
    if db.query(Company).count() == 0:
        companies = [Company(name="Pfizer"), Company(name="Cipla")]
        db.add_all(companies)
        db.commit()

    # Seed medicines
    if db.query(Medicine).count() == 0:
        medicines = [
            Medicine(name="Paracetamol", description="Pain reliever and fever reducer"),
            Medicine(name="Amoxicillin", description="Antibiotic used to treat infections"),
            Medicine(name="Cetirizine", description="Used for allergy relief"),
            Medicine(name="Omeprazole", description="Used to reduce stomach acid"),
            Medicine(name="Ibuprofen", description="Anti-inflammatory and pain relief"),
        ]
        try:
            db.add_all(medicines)
            db.commit()
        except Exception as e:
            db.rollback()
            print("Error seeding medicines:", e)

    meds = db.query(Medicine).all()
    companies = db.query(Company).all()

    # Seed kits
    if db.query(Kit).count() == 0 and meds and companies:
        kits = [
            Kit(
                company_id=companies[0].id,
                medicine_id=meds[0].id,
                kitName="Fever Relief Kit",
                reason="Used for fever and headache",
                category="General",
            ),
            Kit(
                company_id=companies[0].id,
                medicine_id=meds[1].id,
                kitName="Infection Care Kit",
                reason="Bacterial infection treatment",
                category="Antibiotic",
            ),
            Kit(
                company_id=companies[0].id,
                medicine_id=meds[3].id,
                kitName="Stomach Care Kit",
                reason="Acid reflux and indigestion relief",
                category="Gastro",
            ),
        ]
        try:
            db.add_all(kits)
            db.commit()
        except Exception as e:
            db.rollback()
            print("Error seeding kits:", e)

    print("✅ Seed data added successfully!")

if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed_kits(db)
    finally:
        db.close()
