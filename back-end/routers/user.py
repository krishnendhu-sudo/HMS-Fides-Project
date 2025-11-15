from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from database import get_db
import crud
from schemas import UserCreate, UserUpdate, UserResponse
from dependencies.roles import require_super_admin
from auth import get_current_user,verify_password, get_password_hash
import models
from pydantic import BaseModel

router = APIRouter(prefix="/users", tags=["Users"])

# Create
@router.post("/", response_model=UserResponse)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_super_admin)
    ):
    return crud.create_user(db, user)


# List all users
@router.get("/", response_model=list[UserResponse])
def list_users(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)   # get logged-in user
):
    # If super admin, return all users
    if current_user.user_type == "super_admin":
        users = db.query(models.User).options(joinedload(models.User.company)).all()
    else:
        # Otherwise, return only users from the same company
        if current_user.company_id is None:
            raise HTTPException(status_code=403, detail="No company assigned")
        
        users = db.query(models.User).options(joinedload(models.User.company)).filter(
            models.User.company_id == current_user.company_id
        ).all()
    
    # Add company_name to each user
    for user in users:
        user.company_name = user.company.name if user.company else None
    
    return users

# Get current logged-in user
@router.get("/me", response_model=UserResponse)
def get_current_logged_in_user(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    company_name = None
    if current_user.company_id:
        company = db.query(models.Company).filter(models.Company.id == current_user.company_id).first()
        company_name = company.name if company else None
    return {**current_user.__dict__, "company_name": company_name}



# Get user by ID
@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# Update user
@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_super_admin)
):
    db_user = crud.get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.update_user(db, db_user, user_update)


# Delete user
@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_super_admin)
):
    db_user = crud.get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.delete_user(db, db_user)


class PasswordChangeSchema(BaseModel):
    current_password: str
    new_password: str

@router.put("/me/password")
def change_password(
    payload: PasswordChangeSchema,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Ensure we fetch the user via the session
    db_user = db.query(models.User).filter(models.User.id == current_user.id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(payload.current_password, db_user.password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    # Update password
    db_user.password = get_password_hash(payload.new_password)
    db.commit()
    db.refresh(db_user)  # optional, refresh to get latest from DB

    return {"message": "Password changed successfully"}