from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import crud
from schemas import OfferCreate, OfferUpdate, OfferResponse
from auth import get_current_user
import models

router = APIRouter(prefix="/offers", tags=["Offers"])

@router.post("/", response_model=OfferResponse)
def create_offer(offer: OfferCreate, db: Session = Depends(get_db)):
    return crud.create_offer(db, offer)

@router.get("/", response_model=list[OfferResponse])
def list_offers(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)  # get logged-in user
):
    if current_user.user_type == "super_admin":
        return db.query(models.Offers).all()  # all offers
    # normal users: only offers from their company
    return db.query(models.Offers).filter(models.Offers.company_id == current_user.company_id).all()

@router.get("/{offer_id}", response_model=OfferResponse)
def get_offer(offer_id: int, db: Session = Depends(get_db)):
    db_offer = crud.get_offer(db, offer_id)
    if not db_offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    return db_offer

@router.put("/{offer_id}", response_model=OfferResponse)
def update_offer(offer_id: int, payload: OfferUpdate, db: Session = Depends(get_db)):
    db_offer = crud.get_offer(db, offer_id)
    if not db_offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    return crud.update_offer(db, db_offer, payload)

@router.delete("/{offer_id}")
def delete_offer(offer_id: int, db: Session = Depends(get_db)):
    db_offer = crud.get_offer(db, offer_id)
    if not db_offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    return crud.delete_offer(db, db_offer)
