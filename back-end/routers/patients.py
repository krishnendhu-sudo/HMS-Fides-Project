from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session,joinedload  # pyright: ignore[reportMissingImports]
import schemas, crud
from database import get_db
import models
from auth import get_current_user
from models import Optometry

router = APIRouter(prefix="/patients", tags=["Patients"])

# ✅ Create Patient
@router.post("/", response_model=schemas.PatientResponse)
def create_patient_endpoint(patient: schemas.PatientCreate, db: Session = Depends(get_db)):
    return crud.create_patient(db, patient)

# ✅ List Patients
@router.get("/", response_model=list[schemas.PatientResponse])
def list_patients(
    skip: int = 0, limit: int = 10,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    query = db.query(models.Patient).options(joinedload(models.Patient.company))

    # If normal user, filter by company
    if current_user.user_type != "super_admin":
        query = query.filter(models.Patient.company_id == current_user.company_id)

    patients = query.offset(skip).limit(limit).all()
    
    result = []
    for p in patients:
        result.append({
            **p.__dict__,
            "company_name": p.company.name if p.company else None
        })
    return result


# ✅ Get single patient by ID
@router.get("/{patient_id}", response_model=schemas.PatientResponse)
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(crud.models.Patient).filter(crud.models.Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


@router.get("/{patient_id}/previous_visits")
def get_previous_visits(patient_id: int, current_visit_id: int = None, db: Session = Depends(get_db)):
    """
    Fetch all previous optometry visits for a patient, excluding the current visit.
    """
    query = db.query(Optometry).filter(Optometry.patient_id == patient_id)
    
    if current_visit_id:
        query = query.filter(Optometry.id != current_visit_id)
    
    visits = query.order_by(Optometry.tested_at.desc()).all()
    
    return visits

# ✅ Update Patient
@router.put("/{patient_id}", response_model=schemas.PatientResponse)
def update_patient(patient_id: int, update_data: schemas.PatientUpdate, db: Session = Depends(get_db)):
    db_patient = db.query(crud.models.Patient).filter(crud.models.Patient.id == patient_id).first()
    if not db_patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Update fields dynamically
    for field, value in update_data.dict(exclude_unset=True).items():
        setattr(db_patient, field, value)
    
    db.commit()
    db.refresh(db_patient)
    return db_patient

# ✅ Delete Patient
@router.delete("/{patient_id}")
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    db_patient = db.query(crud.models.Patient).filter(crud.models.Patient.id == patient_id).first()
    if not db_patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    db.delete(db_patient)
    db.commit()
    return {"message": "Patient deleted successfully"}

# Get patient by UHID
@router.get("/uhid/{uhid}", response_model=schemas.PatientResponse)
def get_patient_by_uhid(uhid: str, db: Session = Depends(get_db)):
    patient = db.query(crud.models.Patient).filter(crud.models.Patient.custom_id == uhid).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient






from fastapi import UploadFile, File,HTTPException
import os
import uuid

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Create a unique filename
        file_ext = os.path.splitext(file.filename)[1]
        unique_name = f"{uuid.uuid4()}{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_name)

        # Save the uploaded file
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)

        return {"file_path": file_path.replace("\\", "/")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

