from datetime import date
import os, sys

backend = os.path.dirname(__file__)
if backend not in sys.path:
    sys.path.insert(0, backend)

from database import SessionLocal
import models

def fix():
    db = SessionLocal()
    try:
        company = db.query(models.Company).filter(models.Company.name == 'Seed Hospital').first()
        if not company:
            company = models.Company(name='Seed Hospital', abbreviation='SH', gstnumber='GSTFIX')
            db.add(company)
            db.commit()
            db.refresh(company)

        doctors = db.query(models.Doctor).all()
        users = db.query(models.User).all()
        patients = db.query(models.Patient).all()
        appointments = db.query(models.Appointment).all()

        user_by_email = {u.email: u for u in users if u.email}
        doctor_by_email = {d.email: d for d in doctors if d.email}

        fixed_users = 0
        fixed_doctors = 0
        fixed_appts = 0
        fixed_patients = 0

        # Ensure each doctor has a linked user and company
        for d in doctors:
            changed = False
            if not d.company_id:
                d.company_id = company.id
                changed = True

            user = None
            if d.user_id:
                user = db.query(models.User).filter(models.User.id == d.user_id).first()

            if not user:
                # try match by email
                if d.email and d.email in user_by_email:
                    user = user_by_email[d.email]
                else:
                    # create a user for this doctor
                    email = d.email or f"doc{d.id}@example.com"
                    phone = d.phone or f"9100000{d.id:03d}"
                    user = models.User(
                        name=d.name or f"Doctor {d.id}",
                        gender=d.gender or models.GenderEnum.Male,
                        dob=d.dob or date(1980,1,1),
                        blood_group=d.blood_group or models.BloodGroupEnum.A_POS,
                        age=d.age or 40,
                        email=email,
                        phone=phone,
                        address=d.address or '',
                        education=d.education or 'MBBS',
                        certificates=d.education or '',
                        photo='',
                        password='pass',
                        staticIP='',
                        user_type=models.UserType.doctor,
                        is_active=True,
                        company_id=company.id,
                    )
                    db.add(user)
                    db.commit()
                    db.refresh(user)
                    user_by_email[user.email] = user
                    fixed_users += 1
                    changed = True

            if user and (not d.user_id or d.user_id != user.id):
                d.user_id = user.id
                changed = True

            if changed:
                db.add(d)
                db.commit()
                fixed_doctors += 1

        # Ensure appointments reference existing doctor_id and patient_id
        all_doctors = db.query(models.Doctor).all()
        all_patients = db.query(models.Patient).all()
        first_doc_id = all_doctors[0].id if all_doctors else None
        first_pat_id = all_patients[0].id if all_patients else None

        for a in appointments:
            changed = False
            # fix doctor
            if not a.doctor_id or not db.query(models.Doctor).filter(models.Doctor.id == a.doctor_id).first():
                # try match by email to a doctor
                if a.email and a.email in doctor_by_email:
                    a.doctor_id = doctor_by_email[a.email].id
                else:
                    a.doctor_id = first_doc_id
                changed = True

            # fix patient
            if not a.patient_id or not db.query(models.Patient).filter(models.Patient.id == a.patient_id).first():
                # try find by mobile
                if a.mobile:
                    pat = db.query(models.Patient).filter(models.Patient.phone_number == a.mobile).first()
                    if pat:
                        a.patient_id = pat.id
                    else:
                        a.patient_id = first_pat_id
                else:
                    a.patient_id = first_pat_id
                changed = True

            if changed:
                db.add(a)
                db.commit()
                fixed_appts += 1

        # Ensure patients have a reference_doctor name if missing
        for p in all_patients:
            if not p.reference_doctor and all_doctors:
                p.reference_doctor = all_doctors[0].name
                db.add(p)
                db.commit()
                fixed_patients += 1

        print(f"fixed_users={fixed_users}, fixed_doctors={fixed_doctors}, fixed_appts={fixed_appts}, fixed_patients={fixed_patients}")

    finally:
        db.close()


if __name__ == '__main__':
    fix()
