from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import schemas, crud, models
from database import get_db
from auth import get_current_user

router = APIRouter(prefix="/appointments", tags=["Appointments"])


# ✅ Create Appointment
@router.post("/", response_model=schemas.Appointment)
def create_appointment_api(
    appointment: schemas.AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # attach company_id to appointment (super important)
    if not appointment.company_id:
        appointment.company_id = current_user.company_id
    return crud.create_appointment(db, appointment)


# ✅ Get All Appointments with Role-Based Filtering
@router.get("/")
def list_appointments(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Get appointments based on user role:
    - super_admin: sees ALL appointments from ALL companies
    - doctor: sees only THEIR appointments
    - others (admin, staff): sees their COMPANY's appointments
    """
    
    if current_user.user_type == "super_admin":
        # Super admin sees everything
        return crud.get_appointments(db, skip=skip, limit=limit)
    
    elif current_user.user_type == "doctor":
        # ✅ Doctor sees only their own appointments
        # First, find the doctor record for this user
        doctor = db.query(models.Doctor).filter(
            models.Doctor.user_id == current_user.id
        ).first()
        
        if not doctor:
            return []  # No doctor record found, return empty
        
        # Get appointments assigned to this doctor
        return crud.get_appointments_by_doctor(db, doctor_id=doctor.id, skip=skip, limit=limit)
    
    else:
        # All other users see their company's appointments
        return crud.get_appointments_by_company(
            db, company_id=current_user.company_id, skip=skip, limit=limit
        )


# ✅ Get Single Appointment
@router.get("/{appointment_id}")
def get_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    appointment = crud.get_appointment_by_id(db, appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    # ✅ Authorization checks
    if current_user.user_type == "super_admin":
        # Super admin can see everything
        pass
    elif current_user.user_type == "doctor":
        # Doctor can only see their own appointments
        doctor = db.query(models.Doctor).filter(
            models.Doctor.user_id == current_user.id
        ).first()
        if not doctor or appointment.doctor_id != doctor.id:
            raise HTTPException(status_code=403, detail="Not authorized to access this appointment")
    else:
        # Others can only see their company's appointments
        if appointment.company_id != current_user.company_id:
            raise HTTPException(status_code=403, detail="Not authorized to access this appointment")

    return appointment


# ✅ Update Appointment
@router.put("/{appointment_id}")
def edit_appointment(
    appointment_id: int,
    appointment_update: schemas.AppointmentUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Get existing appointment for authorization check
    appointment = crud.get_appointment_by_id(db, appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # ✅ Authorization checks
    if current_user.user_type == "super_admin":
        # Super admin can update everything
        pass
    elif current_user.user_type == "doctor":
        # Doctor can only update their own appointments
        doctor = db.query(models.Doctor).filter(
            models.Doctor.user_id == current_user.id
        ).first()
        if not doctor or appointment.doctor_id != doctor.id:
            raise HTTPException(status_code=403, detail="Not authorized to update this appointment")
    else:
        # Others can only update their company's appointments
        if appointment.company_id != current_user.company_id:
            raise HTTPException(status_code=403, detail="Not authorized to update this appointment")
    
    return crud.update_appointment(db, appointment_id, appointment_update)


# ✅ Delete Appointment
@router.delete("/{appointment_id}", response_model=dict)
def delete_appointment_api(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Get existing appointment for authorization check
    appointment = crud.get_appointment_by_id(db, appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # ✅ Authorization checks
    if current_user.user_type == "super_admin":
        # Super admin can delete everything
        pass
    elif current_user.user_type == "doctor":
        # Doctor can only delete their own appointments
        doctor = db.query(models.Doctor).filter(
            models.Doctor.user_id == current_user.id
        ).first()
        if not doctor or appointment.doctor_id != doctor.id:
            raise HTTPException(status_code=403, detail="Not authorized to delete this appointment")
    else:
        # Others can only delete their company's appointments
        if appointment.company_id != current_user.company_id:
            raise HTTPException(status_code=403, detail="Not authorized to delete this appointment")
    
    return crud.delete_appointment(db, appointment_id)


@router.get("/debug")
def debug_appointments(db: Session = Depends(get_db)):
    return {"message": "works"}
