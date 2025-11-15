from datetime import date, datetime, timedelta
from database import engine, SessionLocal
import models

# Use the Base defined in models (avoid mismatch with database.Base if any)
Base = models.Base

# local aliases for model classes/enums for convenience
Company = models.Company
User = models.User
Doctor = models.Doctor
Patient = models.Patient
Appointment = models.Appointment
Optometry = models.Optometry
Opticals = models.Opticals
Offers = models.Offers
Consultation = models.Consultation
GenderEnum = models.GenderEnum
BloodGroupEnum = models.BloodGroupEnum
PatientTypeEnum = models.PatientTypeEnum
UserType = models.UserType


def seed():
    # Create tables if missing
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Company
        company = db.query(Company).filter(Company.name == "Seed Hospital").first()
        if not company:
            company = Company(
                name="Seed Hospital",
                abbreviation="SH",
                address="1 Seed St",
                phone="1112223333",
                email="contact@seedhospital.example.com",
                website="https://seedhospital.example.com",
                gstnumber="GSTTEST1234",
                admin="seed-admin",
            )
            db.add(company)
            db.commit()
            db.refresh(company)

        # (skipping Department seeding — `Department` model not present in models.py)

        # Users (staff)
        staff_data = [
            {
                "name": "Alice Admin",
                "email": "alice.admin@example.com",
                "user_type": UserType.admin,
            },
            {
                "name": "Reception Rep",
                "email": "reception@example.com",
                "user_type": UserType.receptionist,
            },
            {
                "name": "Pharma Person",
                "email": "pharma@example.com",
                "user_type": UserType.pharmacist,
            },
        ]
        users = []
        for idx, s in enumerate(staff_data, start=1):
            u = db.query(User).filter(User.email == s["email"]).first()
            if not u:
                # generate a unique phone per staff using idx
                phone = f"90000000{idx:02d}"
                u = User(
                    name=s["name"],
                    gender=GenderEnum.Female if "Alice" in s["name"] else GenderEnum.Male,
                    dob=date(1990, 1, 1),
                    blood_group=BloodGroupEnum.O_POS,
                    age=35,
                    email=s["email"],
                    phone=phone,
                    address="Staff address",
                    education="Diploma",
                    certificates="",
                    photo="",
                    password="pass",
                    staticIP="",
                    user_type=s["user_type"],
                    is_active=True,
                    company_id=company.id,
                )
                db.add(u)
                db.commit()
                db.refresh(u)
            users.append(u)

        # Doctors (create separate users for each doctor)
        doctors_info = [
            ("Dr Seed One", "seed.one@example.com", GenderEnum.Male, date(1980, 5, 20), "Ophthalmology"),
            ("Dr Seed Two", "seed.two@example.com", GenderEnum.Female, date(1985, 7, 15), "Pediatrics"),
            ("Dr Seed Three", "seed.three@example.com", GenderEnum.Male, date(1975, 3, 8), "General"),
        ]
        doctors = []
        for idx, (name, email, gender, dob_val, spec) in enumerate(doctors_info, start=1):
            # create a linked user for each doctor
            user = db.query(User).filter(User.email == email).first()
            if not user:
                # unique phone per doctor
                phone = f"9100000{idx:03d}"
                user = User(
                    name=name,
                    gender=gender,
                    dob=dob_val,
                    blood_group=BloodGroupEnum.A_POS,
                    age=(date.today().year - dob_val.year),
                    email=email,
                    phone=phone,
                    address="Doctor address",
                    education="MBBS",
                    certificates="",
                    photo="",
                    password="pass",
                    staticIP="",
                    user_type=UserType.doctor,
                    is_active=True,
                    company_id=company.id,
                )
                db.add(user)
                db.commit()
                db.refresh(user)

            doc = db.query(Doctor).filter(Doctor.email == email).first()
            if not doc:
                doc = Doctor(
                    user_id=user.id,
                    name=name,
                    gender=gender,
                    dob=dob_val,
                    registration_no=f"REG-{email.split('@')[0]}",
                    blood_group=BloodGroupEnum.A_POS,
                    age=(date.today().year - dob_val.year),
                    phone=f"9200000{idx:03d}",
                    email=email,
                    address="Clinic address",
                    education="MBBS, MD",
                    password="pass",
                    staticIP="",
                    is_active=True,
                    specialization=spec,
                    license_no=f"LIC-{email.split('@')[0]}",
                    issuing_council="Medical Council",
                    consultation_fee=500,
                    languages=["English"],
                    company_id=company.id,
                    years_of_experience="10",
                    previous_employer="Seed Clinic",
                    designation="Consultant",
                    duration="Full Time",
                )
                db.add(doc)
                db.commit()
                db.refresh(doc)
            doctors.append(doc)

        # Patients
        patients = []
        patient_infos = [
            ("Patient One", "patient.one@example.com", date(1990,1,1), GenderEnum.Male),
            ("Patient Two", "patient.two@example.com", date(1988,6,5), GenderEnum.Female),
            ("Patient Three", "patient.three@example.com", date(2000,3,3), GenderEnum.Male),
            ("Patient Four", "patient.four@example.com", date(2010,8,8), GenderEnum.Female),
            ("Patient Five", "patient.five@example.com", date(1975,12,12), GenderEnum.Male),
        ]
        for idx, (name, email, dob_val, gender) in enumerate(patient_infos, start=1):
            p = db.query(Patient).filter(Patient.email_id == email).first()
            if not p:
                p = Patient(
                    name=name,
                    gender=gender,
                    dob=dob_val,
                    age=(date.today().year - dob_val.year),
                    blood_group=BloodGroupEnum.O_POS,
                    phone_number=f"800000{idx:03d}",
                    email_id=email,
                    address="Patient address",
                    city="Seed City",
                    state="Seed State",
                    pincode="123456",
                    reference_doctor=doctors[0].name if doctors else None,
                )
                db.add(p)
                db.commit()
                db.refresh(p)
            patients.append(p)

        # Appointments (link patients and doctors)
        appointments = []
        for i, pat in enumerate(patients):
            doc = doctors[i % len(doctors)]
            mobile = f"70000{100+i:03d}"
            appt = db.query(Appointment).filter(Appointment.mobile == mobile).first()
            if not appt:
                visit = date.today() - timedelta(days=i)
                appt = Appointment(
                    patient_id=pat.id,
                    doctor_id=doc.id,
                    patient_type=PatientTypeEnum.general,
                    fullName=pat.name,
                    gender=pat.gender,
                    dob=pat.dob,
                    age=pat.age or (date.today().year - pat.dob.year),
                    bloodGroup=pat.blood_group,
                    mobile=mobile,
                    alternateNumber="",
                    email=pat.email_id,
                    address1=pat.address,
                    city=pat.city,
                    state=pat.state,
                    pin=pat.pincode,
                    registrationDate=date.today(),
                    visitDate=visit,
                    patientCategory="OP",
                    aadhar=f"Aadhar{i}",
                    reference="Referral",
                    valid="",
                    billingType="Cash",
                    registrationFee="100",
                    consultationFee="200",
                    Discount="0",
                    totalAmount="300",
                    paymentStatus="Paid",
                    paymentMethod="Cash",
                    amountPaid="300",
                    returnAmount="0",
                    transactionId=f"TXN{i}",
                    transactionDate=str(date.today()),
                )
                db.add(appt)
                db.commit()
                db.refresh(appt)
            appointments.append(appt)

        # Optometry records for first appointment
        if appointments:
            ap = appointments[0]
            opt = db.query(Optometry).filter(Optometry.appointment_id == ap.id).first()
            if not opt:
                opt = Optometry(appointment_id=ap.id, ar_od_sph="-1.00", ar_os_sph="-0.75")
                db.add(opt)
                db.commit()
                db.refresh(opt)

        # Optical order record
        op = db.query(Opticals).first()
        if not op:
            op = Opticals(op_uhid="UHID123", op_name="Opt Order", op_age="30", op_gender="Male", op_product="Glasses", op_price="1200", op_amount="1200")
            db.add(op)
            db.commit()

        # Offers
        off = db.query(Offers).filter(Offers.offer_name == "Seed Offer").first()
        if not off:
            off = Offers(offer_id=1, offer_name="Seed Offer", offer_type="Discount", offer_validfrom=date.today(), offer_validto=date.today()+timedelta(days=30), offer_discount="10%", offer_eligibile_items="All", offer_max_eligible=10, offer_min_eligible=1, offer_gender=GenderEnum.Male, offer_remarks="Sample")
            db.add(off)
            db.commit()

        # Consultation placeholder
        cons = db.query(Consultation).first()
        if not cons:
            cons = Consultation(optometry_id=opt.id if 'opt' in locals() else None, fu_date=str(date.today()), fu_nextvisit=str(date.today()+timedelta(days=30)))
            db.add(cons)
            db.commit()

        print("Seeding all data complete.")

    finally:
        db.close()


if __name__ == "__main__":
    seed()
