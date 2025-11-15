from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import timedelta
import models, schemas
from database import get_db
from auth import verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login")
def login_user(credentials: schemas.LoginRequest, db: Session = Depends(get_db)):
    # Try to find user first
    user = db.query(models.User).filter(models.User.email == credentials.email).first()
    
    # If not found, check SuperAdmin
    if not user:
        user = db.query(models.SuperAdmin).filter(models.SuperAdmin.email == credentials.email).first()
        if user:
            user.user_type = "super_admin"
            user.company_id = None  # dynamic field for token
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verify password
    if not verify_password(credentials.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # Initialize doctor_id to None
    doctor_id = None

    # If user is a doctor, fetch corresponding doctor_id
    if user.user_type == "doctor":
        doctor = db.query(models.Doctor).filter(models.Doctor.user_id == user.id).first()
        if doctor:
            doctor_id = doctor.id

    # Create JWT token including doctor_id
    access_token_expires = timedelta(minutes=60)
    access_token = create_access_token(
        data={
            "sub": user.email,
            "role": user.user_type,
            "company_id": user.company_id,
            "doctor_id": doctor_id
        },
        expires_delta=access_token_expires,
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "doctor_id": doctor_id,  # Include doctor_id in response
        "role": user.user_type,
        "company_id": user.company_id,
        "name": user.name
    }
