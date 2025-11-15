# doctors.py - Updated endpoints with authentication and company filtering

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Body
from sqlalchemy.orm import Session
from database import get_db
import schemas, crud
import os
from uuid import uuid4
from auth import get_current_user  # ✅ Import authentication dependency
import models

router = APIRouter(prefix="/doctors", tags=["Doctors"])


@router.post("/", response_model=schemas.DoctorResponse)
def create_doctor(
    payload: dict = Body(...), 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)  # ✅ Add auth
):
    """Create a new doctor - must belong to the same company as the logged-in user"""
    
    # ✅ Ensure doctor belongs to the same company
    user_data = payload.get("user", {})
    if user_data:
        # If creating with nested user, enforce company_id
        user_data["company_id"] = current_user.company_id
        payload["user"] = user_data
    
    return crud.create_doctor_from_payload(db, payload)


@router.get("/", response_model=list[schemas.DoctorResponse])
def list_doctors(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)  # ✅ Add auth
):
    """Get all doctors - filtered by company for regular users"""
    
    # ✅ Filter by company_id based on user role
    return crud.list_doctors(db, company_id=current_user.company_id)


@router.get("/{doctor_id}", response_model=schemas.DoctorResponse)
def get_doctor(
    doctor_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)  # ✅ Add auth
):
    """Get a single doctor - must belong to the same company"""
    
    doctor = crud.get_doctor(db, doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    # ✅ Verify doctor belongs to same company
    if doctor.company_id != current_user.company_id:
        raise HTTPException(status_code=403, detail="Access denied: Doctor belongs to different company")
    
    return doctor

@router.get("/me", response_model=schemas.DoctorResponse)
def get_current_doctor(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    doctor = crud.get_doctor_by_user_id(db, current_user.id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor

@router.put("/{doctor_id}", response_model=schemas.DoctorResponse)
def update_doctor(
    doctor_id: int, 
    payload: schemas.DoctorCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)  # ✅ Add auth
):
    """Update a doctor - must belong to the same company"""
    
    # ✅ First check if doctor exists and belongs to same company
    existing_doctor = crud.get_doctor(db, doctor_id)
    if not existing_doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    if existing_doctor.company_id != current_user.company_id:
        raise HTTPException(status_code=403, detail="Access denied: Doctor belongs to different company")
    
    doctor = crud.update_doctor(db, doctor_id, payload)
    return doctor


@router.delete("/{doctor_id}")
def delete_doctor(
    doctor_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)  # ✅ Add auth
):
    """Delete a doctor - must belong to the same company"""
    
    # ✅ First check if doctor exists and belongs to same company
    existing_doctor = crud.get_doctor(db, doctor_id)
    if not existing_doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    if existing_doctor.company_id != current_user.company_id:
        raise HTTPException(status_code=403, detail="Access denied: Doctor belongs to different company")
    
    crud.delete_doctor(db, doctor_id)
    return {"message": "Doctor deleted successfully"}


UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload/")
async def upload_patient_image(
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_user)  # ✅ Add auth
):
    """Upload doctor files - requires authentication"""
    # generate unique filename
    ext = file.filename.split(".")[-1]
    file_name = f"{uuid4()}.{ext}"
    file_path = os.path.join("uploads", file_name)
    # save file
    with open(file_path, "wb") as f:
        f.write(await file.read())
    return {"filename": file.filename, "file_path": file_path}