from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import schemas, crud, models
from database import get_db


router = APIRouter(prefix="/consultations", tags=["Consultations"])

# ✅ Create consultation
@router.post("/", response_model=schemas.ConsultationResponse)
def create_consultation(consultation: schemas.ConsultationCreate, db: Session = Depends(get_db)):
    return crud.create_consultation(db, consultation)

# ✅ Get all consultations
@router.get("/", response_model=list[schemas.ConsultationResponse])
def read_consultations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_consultations(db, skip, limit)

# ✅ Get consultations for a patient
@router.get("/patient/{patient_id}", response_model=list[schemas.ConsultationResponse])
def read_patient_consultations(patient_id: int, db: Session = Depends(get_db)):
    consultations = crud.get_consultation_by_patient(db, patient_id)
    if not consultations:
        raise HTTPException(status_code=404, detail="Consultations not found")
    return consultations

# ✅ Update consultation
@router.put("/{consultation_id}", response_model=schemas.ConsultationResponse)
def update_consultation(consultation_id: int, consultation_update: schemas.ConsultationUpdate, db: Session = Depends(get_db)):
    updated = crud.update_consultation(db, consultation_id, consultation_update)
    if not updated:
        raise HTTPException(status_code=404, detail="Consultation not found")
    return updated

# Delete consultation
@router.delete("/{consultation_id}")
def delete_consultation(consultation_id: int, db: Session = Depends(get_db)):
    consultation = db.query(models.Consultation).filter(models.Consultation.id == consultation_id).first()
    if not consultation:
        raise HTTPException(status_code=404, detail="Consultation not found")
    db.delete(consultation)
    db.commit()
    return {"message": "Consultation deleted successfully"}