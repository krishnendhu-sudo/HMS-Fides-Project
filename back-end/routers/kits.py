from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(prefix="/kits", tags=["Kits"])

# Create new kit
@router.post("/", response_model=schemas.KitResponse)
def create_kit(kit: schemas.KitCreate, db: Session = Depends(get_db)):
    db_kit = models.Kit(
        company_id=kit.company_id,
        kitId=kit.kitId,
        kitName=kit.kitName,
        reason=kit.reason,
        medicines=[m.dict() for m in kit.medicines] if kit.medicines else [],
    )
    db.add(db_kit)
    db.commit()
    db.refresh(db_kit)
    return db_kit

# Get all kits
@router.get("/", response_model=list[schemas.KitResponse])
def get_kits(db: Session = Depends(get_db)):
    return db.query(models.Kit).all()

# Get kit by ID (view)
@router.get("/{kit_id}", response_model=schemas.KitResponse)
def get_kit(kit_id: int, db: Session = Depends(get_db)):
    kit = db.query(models.Kit).filter(models.Kit.id == kit_id).first()
    if not kit:
        raise HTTPException(status_code=404, detail="Kit not found")
    return kit


# Update kit (edit)
@router.put("/{kit_id}", response_model=schemas.KitResponse)
def update_kit(kit_id: int, kit_update: schemas.KitCreate, db: Session = Depends(get_db)):
    kit = db.query(models.Kit).filter(models.Kit.id == kit_id).first()
    if not kit:
        raise HTTPException(status_code=404, detail="Kit not found")

    kit.kitId = kit_update.kitId
    kit.kitName = kit_update.kitName
    kit.reason = kit_update.reason
    kit.medicines = [m.dict() for m in kit_update.medicines] if kit_update.medicines else []
    db.commit()
    db.refresh(kit)
    return kit


# Delete kit
@router.delete("/{kit_id}")
def delete_kit(kit_id: int, db: Session = Depends(get_db)):
    kit = db.query(models.Kit).filter(models.Kit.id == kit_id).first()
    if not kit:
        raise HTTPException(status_code=404, detail="Kit not found")
    db.delete(kit)
    db.commit()
    return {"message": "Kit deleted successfully"}
