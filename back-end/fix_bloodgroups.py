from sqlalchemy import text
from database import SessionLocal

db = SessionLocal()

mapping = {
    "A-": "A_NEG",
    "A+": "A_POS",
    "B-": "B_NEG",
    "B+": "B_POS",
    "O-": "O_NEG",
    "O+": "O_POS",
    "AB-": "AB_NEG",
    "AB+": "AB_POS",
}

for old, new in mapping.items():
    db.execute(
        text("UPDATE users SET blood_group = :new WHERE blood_group = :old"),
        {"new": new, "old": old}
    )

db.commit()
db.close()
print("✅ Blood groups updated.")
