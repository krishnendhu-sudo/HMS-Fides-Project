import os
import json
from datetime import date

backend = os.path.dirname(__file__)
import sys
if backend not in sys.path:
    sys.path.insert(0, backend)

from database import SessionLocal
import models

def serialize(obj):
    # serialize SQLAlchemy model instance to JSON-serializable dict
    out = {}
    for col in obj.__table__.columns:
        name = col.name
        val = getattr(obj, name)
        # coerce empty string for numeric fields to None
        if val == "" and (col.type.python_type == int or col.type.python_type == float):
            val = None
        # dates
        if isinstance(val, date):
            val = val.isoformat()
        # enums
        try:
            import enum as _enum
            if isinstance(val, _enum.Enum):
                val = val.value
        except Exception:
            pass
        out[name] = val
    return out

def dump():
    db = SessionLocal()
    try:
        appts = db.query(models.Appointment).all()
        pats = db.query(models.Patient).all()

        appt_list = [serialize(a) for a in appts]
        pat_list = [serialize(p) for p in pats]

        with open(os.path.join(backend, 'smoke_appointments.json'), 'w', encoding='utf-8') as f:
            json.dump(appt_list, f, default=str, indent=2)
        with open(os.path.join(backend, 'smoke_patients.json'), 'w', encoding='utf-8') as f:
            json.dump(pat_list, f, default=str, indent=2)

        print('Wrote', len(appt_list), 'appointments and', len(pat_list), 'patients')
    finally:
        db.close()

if __name__ == '__main__':
    dump()
