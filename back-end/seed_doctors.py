from datetime import date
from database import engine, SessionLocal, Base
from models import Company, User, Doctor, GenderEnum, BloodGroupEnum, UserType


def seed():
    # Create tables
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Create a company if not exists
        company = db.query(Company).filter(Company.name == "Demo Hospital").first()
        if not company:
            company = Company(
                name="Demo Hospital",
                abbreviation="DH",
                address="123 Demo St",
                phone="1234567890",
                email="info@demohospital@example.com",
                website="https://demohospital.example.com",
                gstnumber="GSTIN12345",
                admin="admin",
            )
            db.add(company)
            db.commit()
            db.refresh(company)

        # Create a user to link to doctors
        user = db.query(User).filter(User.email == "dr.john@example.com").first()
        if not user:
            user = User(
                name="Dr John Seed",
                gender=GenderEnum.Male,
                dob=date(1980, 1, 1),
                blood_group=BloodGroupEnum.O_POS,
                age=45,
                email="dr.john@example.com",
                phone="9998887776",
                address="1 Clinic Lane",
                education="MBBS, MS",
                certificates="",
                photo="",
                password="password",
                staticIP="",
                user_type=UserType.doctor,
                is_active=True,
                company_id=company.id,
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        # Insert sample doctors
        sample_doctors = [
            {
                "name": "Dr. Alice Example",
                "gender": GenderEnum.Female,
                "dob": date(1985, 5, 20),
                "registration_no": "REG-AL-001",
                "blood_group": BloodGroupEnum.A_POS,
                "age": 40,
                "phone": "9000000001",
                "email": "alice@example.com",
                "address": "10 Health Ave",
                "education": "MBBS, DO",
                "password": "pass",
                "staticIP": "",
                "is_active": True,
                "specialization": "Ophthalmology",
                "license_no": "LIC-AL-001",
                "issuing_council": "Medical Council A",
                "consultation_fee": 500,
                "languages": ["English"],
                "company_id": company.id,
                "years_of_experience": "10",
                "previous_employer": "Health Clinic",
                "designation": "Consultant",
                "duration": "Full Time",
            },
            {
                "name": "Dr. Bob Example",
                "gender": GenderEnum.Male,
                "dob": date(1978, 9, 12),
                "registration_no": "REG-BO-002",
                "blood_group": BloodGroupEnum.B_POS,
                "age": 47,
                "phone": "9000000002",
                "email": "bob@example.com",
                "address": "20 Health Ave",
                "education": "MBBS, MS",
                "password": "pass",
                "staticIP": "",
                "is_active": True,
                "specialization": "General Surgery",
                "license_no": "LIC-BO-002",
                "issuing_council": "Medical Council B",
                "consultation_fee": 700,
                "languages": ["English", "Hindi"],
                "company_id": company.id,
                "years_of_experience": "18",
                "previous_employer": "City Hospital",
                "designation": "Senior Surgeon",
                "duration": "Part Time",
            },
            {
                "name": "Dr. Carol Example",
                "gender": GenderEnum.Female,
                "dob": date(1990, 3, 30),
                "registration_no": "REG-CA-003",
                "blood_group": BloodGroupEnum.AB_POS,
                "age": 35,
                "phone": "9000000003",
                "email": "carol@example.com",
                "address": "30 Health Ave",
                "education": "MBBS, MD",
                "password": "pass",
                "staticIP": "",
                "is_active": True,
                "specialization": "Pediatrics",
                "license_no": "LIC-CA-003",
                "issuing_council": "Medical Council C",
                "consultation_fee": 400,
                "languages": ["English"],
                "company_id": company.id,
                "years_of_experience": "8",
                "previous_employer": "Children's Hospital",
                "designation": "Pediatrician",
                "duration": "Full Time",
            },
        ]

        for doc in sample_doctors:
            exists = db.query(Doctor).filter(Doctor.email == doc["email"]).first()
            if exists:
                print(f"Doctor {doc['email']} already exists, skipping")
                continue

            doctor = Doctor(
                user_id=user.id,
                name=doc["name"],
                gender=doc["gender"],
                dob=doc["dob"],
                registration_no=doc["registration_no"],
                blood_group=doc["blood_group"],
                age=doc["age"],
                phone=doc["phone"],
                email=doc["email"],
                address=doc["address"],
                education=doc["education"],
                password=doc["password"],
                staticIP=doc["staticIP"],
                is_active=doc["is_active"],
                specialization=doc["specialization"],
                license_no=doc["license_no"],
                issuing_council=doc["issuing_council"],
                consultation_fee=doc["consultation_fee"],
                languages=doc["languages"],
                company_id=doc["company_id"],
                years_of_experience=doc["years_of_experience"],
                previous_employer=doc["previous_employer"],
                designation=doc["designation"],
                duration=doc["duration"],
                awards=doc.get("awards"),
            )
            db.add(doctor)

        db.commit()
        print("Seeding complete.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
