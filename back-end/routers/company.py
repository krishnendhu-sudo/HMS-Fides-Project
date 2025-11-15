from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import crud
from schemas import CompanyCreate, CompanyResponse, CompanyUpdate
from dependencies.roles import require_super_admin
from auth import get_current_user
import models

router = APIRouter(prefix="/companies", tags=["Companies"])

@router.post("/", response_model=CompanyResponse)
def create_company(company: CompanyCreate, db: Session = Depends(get_db)):
    #  user=Depends(require_super_admin) inside bracket
    return crud.create_company(db, company)

@router.get("/", response_model=list[CompanyResponse])
def list_companys(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.user_type == "super_admin":
        return db.query(models.Company).all()
    # normal users: only the company they belong to
    return db.query(models.Company).filter(models.Company.id == current_user.company_id).all()


# In your companies router file
@router.get("/{company_id}", response_model=CompanyResponse)
def get_company_endpoint(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    company = crud.get_company(db, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company


@router.put("/{company_id}", response_model=CompanyResponse)
def update_company(
    company_id: int,
    company: CompanyUpdate,
    db: Session = Depends(get_db),
    user=Depends(require_super_admin)
):
    existing_company = crud.get_company(db, company_id)
    if not existing_company:
        raise HTTPException(status_code=404, detail="Company not found")
    return crud.update_company(db, existing_company, company)

# Delete a company by ID
@router.delete("/{company_id}", response_model=dict)
def delete_company(
    company_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_super_admin)
):
    existing_company = crud.get_company(db, company_id)
    if not existing_company:
        raise HTTPException(status_code=404, detail="Company not found")
    crud.delete_company(db, existing_company)
    return {"detail": "Company deleted successfully"}

