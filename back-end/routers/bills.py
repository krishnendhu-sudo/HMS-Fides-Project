from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import schemas, crud
from database import get_db
import traceback
import sys

router = APIRouter(prefix="/bills", tags=["Bills"])


@router.get("/", response_model=list[schemas.BillResponse])
def list_bills(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        res = crud.list_bills(db, skip=skip, limit=limit)
        try:
            print(f"DEBUG: list_bills found {len(res)} rows", file=sys.stderr)
        except Exception:
            pass
        return res
    except Exception as e:
        # surface the error for debugging purposes
        tb = traceback.format_exc()
        print('ERROR in list_bills:', str(e), file=sys.stderr)
        print(tb, file=sys.stderr)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get('/raw')
def list_bills_raw(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Debug endpoint: return raw bill records as dicts (no Pydantic serialization).
    Use for debugging only; remove once issue is resolved.
    """
    res = crud.list_bills(db, skip=skip, limit=limit)
    out = []
    for b in res:
        out.append({
            'id': getattr(b, 'id', None),
            'bill_id': getattr(b, 'bill_id', None),
            'created_from': getattr(b, 'created_from', None),
            'reference_id': getattr(b, 'reference_id', None),
            'date': getattr(b, 'date', None),
            'bill_type': getattr(b, 'bill_type', None),
            'amount': getattr(b, 'amount', None),
            'payment_method': getattr(b, 'payment_method', None),
            'transaction_id': getattr(b, 'transaction_id', None),
            'paid_date': getattr(b, 'paid_date', None),
            'discount': getattr(b, 'discount', None),
            'balance': getattr(b, 'balance', None),
            'status': getattr(b, 'status', None),
        })
    return out


@router.post("/", response_model=schemas.BillResponse)
def create_bill(bill: schemas.BillCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_bill(db, bill)
    except Exception as e:
        # return full traceback in 500 response for debugging; remove in production
        tb = traceback.format_exc()
        print('ERROR in create_bill:', str(e))
        print(tb)
        raise HTTPException(status_code=500, detail={"error": str(e), "trace": tb})


@router.get("/{bill_id}", response_model=schemas.BillResponse)
def get_bill(bill_id: int, db: Session = Depends(get_db)):
    bill = crud.get_bill(db, bill_id)
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    return bill
