from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import schemas, crud
from auth import get_current_user  # assuming your auth.py provides this

router = APIRouter(prefix="/optometrys", tags=["Optometrys"])

# ✅ CREATE
@router.post("/", )
def create_optometry(optometry: schemas.OptometryCreate, 
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)):
    return crud.create_optometry(db, optometry, current_user)

# ✅ READ (all)
@router.get("/", response_model=list[schemas.OptometryResponse])
def list_optometry(db: Session = Depends(get_db)):
    return crud.get_all_optometry(db)

# ✅ READ (single)
@router.get("/{optometry_id}", response_model=schemas.OptometryResponse)
def get_optometry(optometry_id: int, db: Session = Depends(get_db)):
    opt = crud.get_optometry_by_id(db, optometry_id)
    if not opt:
        raise HTTPException(status_code=404, detail="Optometry record not found")
    return opt

# ✅ READ by appointment (for robust frontend Add/Edit/View)
@router.get("/by-appointment/{appointment_id}", response_model=schemas.OptometryResponse)
def get_optometry_by_appointment(appointment_id: int, db: Session = Depends(get_db)):
    opt = crud.get_optometry_by_appointment_id(db, appointment_id)
    if not opt:
        raise HTTPException(status_code=404, detail="Optometry record not found for this appointment")
    return opt

# ✅ UPDATE
@router.put("/{optometry_id}", response_model=schemas.OptometryResponse)
def update_optometry(optometry_id: int, 
                     optometry_data: schemas.OptometryUpdate,
                     db: Session = Depends(get_db),
                     current_user=Depends(get_current_user)):
    return crud.update_optometry(db, optometry_id, optometry_data, current_user)

# ✅ DELETE
@router.delete("/{optometry_id}")
def delete_optometry(optometry_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_optometry(db, optometry_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Optometry record not found")
    return {"message": "Optometry record deleted successfully"}
