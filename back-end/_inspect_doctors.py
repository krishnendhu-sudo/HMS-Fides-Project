from database import SessionLocal
import models

db = SessionLocal()
try:
    docs = db.query(models.Doctor).all()
    print('doctors count:', len(docs))
    for d in docs:
        try:
            print('Doctor:', d.id, d.name, 'email:', d.email, 'user_email:', getattr(d, 'user').email if getattr(d, 'user', None) else None)
        except Exception as e:
            print('Error printing doctor', d.id, e)
finally:
    db.close()
