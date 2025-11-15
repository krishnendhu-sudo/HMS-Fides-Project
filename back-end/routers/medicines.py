# routers/medicines.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Medicine
from schemas import MedicineBase, MedicineResponse

router = APIRouter(prefix="/medicines", tags=["Medicines"])

# GET all medicines
@router.get("/", response_model=list[MedicineResponse])
def get_medicines(db: Session = Depends(get_db)):
    return db.query(Medicine).all()

# POST a new medicine
@router.post("/", response_model=MedicineResponse)
def create_medicine(medicine: MedicineBase, db: Session = Depends(get_db)):
    new_medicine = Medicine(
        name=medicine.name,
        description=medicine.description,
        dosage=medicine.dosage,
        frequency=medicine.frequency,
        duration=medicine.duration,
        route=medicine.route,
        medQuantity=medicine.medQuantity,
    )
    db.add(new_medicine)
    db.commit()
    db.refresh(new_medicine)
    return new_medicine

# DELETE medicine
@router.delete("/{medicine_id}")
def delete_medicine(medicine_id: int, db: Session = Depends(get_db)):
    medicine = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    db.delete(medicine)
    db.commit()
    return {"message": "Medicine deleted successfully"}
