from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from datetime import date,datetime
import models, schemas, json
from typing import List
# from models import DoctorCertificate,DoctorImage
from fastapi import HTTPException,status
from auth import pwd_context


def calculate_age(dob: date) -> int:
    if not dob:
        return None
    today = date.today()
    return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))


def generate_custom_id(db: Session) -> str:
    last_patient = db.query(models.Patient).order_by(models.Patient.id.desc()).first()
    if last_patient:
        if last_patient.custom_id:
            try:
                last_num = int(last_patient.custom_id.replace("ASSI", ""))
            except Exception:
                last_num = 0
        else:
            last_num = 0
        new_num = last_num + 1
    else:
        new_num = 1
    return f"ASSI{new_num:04d}"

def generate_appointment_id(db: Session) -> str:
    last_patient = db.query(models.Appointment).order_by(models.Appointment.id.desc()).first()
    if last_patient:
        last_num = int(last_patient.custom_id.replace("ASSI", ""))
        new_num = last_num + 1
    else:
        new_num = 1
    return f"ASSI{new_num:04d}"


def create_company(db: Session, company: schemas.CompanyCreate):

    existing_phone = db.query(models.Company).filter(models.Company.phone == company.phone).first()
    if existing_phone:
        raise HTTPException(status_code=400, detail=f"Phone number {company.phone} is already registered")
    
    if company.email:
        existing_email = db.query(models.Company).filter(models.Company.email == company.email).first()
        if existing_email:
            raise HTTPException(status_code=400, detail=f"Email {company.email} is already registered")


    try:
        db_company = models.Company(
            name = company.name,
            abbreviation = company.abbreviation,
            address = company.address,
            logo = company.logo,
            phone = company.phone,
            website = company.website,
            email = company.email,
            status = company.status,
            admin = company.admin,
            gstnumber =company.gstnumber,
        )
        db.add(db_company)
        db.commit()
        db.refresh(db_company)
        return db_company
    except IntegrityError as e:
        db.rollback()
        if "phone" in str(e):
            raise HTTPException(status_code=400, detail="Phone number is already registered")
        elif "email" in str(e):
            raise HTTPException(status_code=400, detail="Email is already registered")
        else:
            raise HTTPException(status_code=400, detail="Data conflict: unable to create patient")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Internal server error e: {str(e)}")
    

def update_company(db: Session, db_company: models.Company, company_update: schemas.CompanyUpdate):
    # Check for phone/email conflicts
    if company_update.phone and company_update.phone != db_company.phone:
        existing_phone = db.query(models.Company).filter(models.Company.phone == company_update.phone).first()
        if existing_phone:
            raise HTTPException(status_code=400, detail=f"Phone number {company_update.phone} is already registered")

    if company_update.email and company_update.email != db_company.email:
        existing_email = db.query(models.Company).filter(models.Company.email == company_update.email).first()
        if existing_email:
            raise HTTPException(status_code=400, detail=f"Email {company_update.email} is already registered")

    try:
        # Update fields only if provided
        for field, value in company_update.dict(exclude_unset=True).items():
            setattr(db_company, field, value)
        db.commit()
        db.refresh(db_company)
        return db_company
    except IntegrityError as e:
        db.rollback()
        if "phone" in str(e):
            raise HTTPException(status_code=400, detail="Phone number is already registered")
        elif "email" in str(e):
            raise HTTPException(status_code=400, detail="Email is already registered")
        else:
            raise HTTPException(status_code=400, detail="Data conflict: unable to update company")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")



def list_companys(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Company).offset(skip).limit(limit).all()


def get_company(db: Session, company_id: int):
    return db.query(models.Company).filter(models.Company.id == company_id).first()

def delete_company(db: Session, db_company):
    db.delete(db_company)
    db.commit()

def create_user(db: Session, user: schemas.UserCreate, photo=None, certificates=None):
    company = db.query(models.Company).filter(models.Company.id == user.company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found he")
    # Convert optional enums only when provided

    gender_enum = None
    if getattr(user, 'gender', None) is not None:
        try:
            gender_enum = models.GenderEnum(user.gender)
        except Exception:
            gender_enum = None

    cert_data = certificates or getattr(user, 'certificates', None)

    age = calculate_age(user.dob)
    hashed_password = pwd_context.hash(user.password)

    db_user = models.User(
        name=user.name,
        gender=gender_enum or user.gender,
        dob=user.dob,
        email=user.email,
        company_id=user.company_id,
        blood_group = user.blood_group,
        age= age,
        phone= user.phone,
        address= user.address,
        education= user.education,
        certificates= cert_data or [],
        photo= photo or user.photo,
        password = hashed_password,
        staticIP= user.staticIP,
        user_type= user.user_type,
        is_active= user.is_active,

    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# ✅ Get a single user by ID
def get_user(db: Session, user_id: int) -> models.User:
    return db.query(models.User).filter(models.User.id == user_id).first()


# ✅ Get all users (optionally filter by company)
def list_users(db: Session, company_id: int | None = None) -> List[models.User]:
    query = db.query(models.User).options(joinedload(models.User.company))
    if company_id:
        query = query.filter(models.User.company_id == company_id)
    users = query.all()

    # Add company_name dynamically
    for user in users:
        user.company_name = user.company.name if user.company else None
    return users


# ✅ Update user
def update_user(db: Session, db_user: models.User, user_update: schemas.UserUpdate) -> models.User:
    for key, value in user_update.dict(exclude_unset=True).items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user


# ✅ Delete user
def delete_user(db: Session, db_user: models.User):
    db.delete(db_user)
    db.commit()
    return {"detail": "User deleted successfully"}



def create_doctor(db: Session, doctor: schemas.DoctorCreate, photo=None, certificates=None):
    cert_data = certificates or getattr(doctor, 'certificates', None)
    try:
        # ✅ Create User first
        user_data = doctor.user
        company = db.query(models.Company).filter(models.Company.id == user_data.company_id).first()
        if not company:
            raise HTTPException(status_code=404, detail="Company not found")

        db_user = models.User(
            name=user_data.name,
            gender=user_data.gender,
            dob=user_data.dob,
            blood_group=user_data.blood_group,
            age=user_data.age,
            email=user_data.email,
            phone=user_data.phone,
            address=user_data.address,
            education=user_data.education,
            certificates=cert_data or [],
            photo=user_data.photo,
            staticIP=user_data.staticIP,
            password=pwd_context.hash(user_data.password),
            user_type=user_data.user_type,
            is_active=user_data.is_active,
            company_id=user_data.company_id,
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        # ✅ Create Doctor record
        db_doctor = models.Doctor(
            user_id=db_user.id,
            name=db_user.name,
            gender=db_user.gender,
            dob=db_user.dob,
            registration_no=doctor.registration_no,
            consultation_fee=doctor.consultation_fee,
            license_no=doctor.license_no,
            issuing_council=doctor.issuing_council,
            languages=doctor.languages,
            specialization=doctor.specialization,
            years_of_experience=doctor.years_of_experience,
            previous_employer=doctor.previous_employer,
            designation=doctor.designation,
            duration=doctor.duration,
            awards=doctor.awards,
            is_active=doctor.status,
            phone=db_user.phone,
            email=db_user.email,
            company_id=db_user.company_id
        )
        db.add(db_doctor)
        db.commit()
        db.refresh(db_doctor)

        # ✅ Load user relationship before returning
        db.refresh(db_doctor)
        _ = db_doctor.user  # ensure lazy load

        return db_doctor

    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database Integrity Error: {str(e.orig)}")

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Internal server error while creating doctor: {str(e)}")

# Add this to your crud.py file - Updated doctor functions

# ✅ Fetch single doctor with user
def get_doctor(db: Session, doctor_id: int):
    return (
        db.query(models.Doctor)
        .options(
            joinedload(models.Doctor.user),
            joinedload(models.Doctor.company)
        )
        .filter(models.Doctor.id == doctor_id)
        .first()
    )
    
    


# ✅ Fetch all doctors with user relationship
def list_doctors(db: Session, company_id: int | None = None):
    """
    Fetch all doctors with user and company relationships.
    If company_id is provided, filter by that company.
    Returns doctors with properly loaded relationships.
    """
    query = (
        db.query(models.Doctor)
        .options(
            joinedload(models.Doctor.user),
            joinedload(models.Doctor.company)
        )
    )
    
    # ✅ Apply company filter if provided
    if company_id:
        query = query.filter(models.Doctor.company_id == company_id)
    
    doctors = query.all()
    
    # ✅ Ensure relationships are loaded and add computed fields
    for doctor in doctors:
        # Force load the relationships if not already loaded
        if doctor.user:
            _ = doctor.user.name  # Access to force load
        if doctor.company:
            _ = doctor.company.name  # Access to force load
    
    return doctors

# ----- UPDATE DOCTOR -----
def update_doctor(db: Session, doctor_id: int, doctor_update: schemas.DoctorCreate):
    doctor = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    update_data = doctor_update.dict(exclude_unset=True)

    # Update doctor fields
    for key, value in update_data.items():
        if key != "user":
            setattr(doctor, key, value)

    # Update nested user fields if present
    user_data = update_data.get("user")
    if user_data:
        for key, value in user_data.items():
            setattr(doctor.user, key, value)

    db.commit()
    db.refresh(doctor)
    return doctor



# ----- DELETE DOCTOR -----
def delete_doctor(db: Session, doctor_id: int):
    doctor = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    db.delete(doctor)
    db.commit()
    return {"detail": "Doctor deleted successfully"}


def create_doctor_from_payload(db: Session, payload: dict):
    """
    Create a doctor from a payload that either contains:
      - 'user': nested user data (creates a new user)
      - 'user_id': existing user ID
    """

    # Case 1: Nested user data provided
    user_data = payload.get("user")
    if user_data:
    # Check if user already exists
        existing_user = db.query(models.User).filter(
        (models.User.phone == user_data.get("phone")) |
        (models.User.email == user_data.get("email"))
    ).first()
    
    if existing_user:
        # Link to the existing user instead of creating a new one
        payload["user_id"] = existing_user.id
        payload.pop("user", None)
    else:
        # Create new user normally
        try:
            doctor_create = schemas.DoctorCreate(**payload)
            return create_doctor(db, doctor_create)
        except Exception as e:
            raise HTTPException(
                status_code=422,
                detail=f"Invalid doctor payload with nested user: {str(e)}"
            )


    # Case 2: Existing user ID provided
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(
            status_code=422,
            detail="Invalid payload: expected 'user' or 'user_id'"
        )

    user = db.query(models.User).filter(models.User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Helper to pick value from multiple keys
    def pick(*keys):
        for k in keys:
            if k in payload and payload[k] is not None:
                return payload[k]
        return None

    # Normalize and extract doctor fields
    dob_val = pick("dob") or user.dob
    if isinstance(dob_val, str):
        try:
            dob_val = date.fromisoformat(dob_val)
        except Exception:
            dob_val = user.dob

    gender_val = pick("gender") or user.gender
    if isinstance(gender_val, str):
        try:
            gender_val = models.GenderEnum(gender_val)
        except Exception:
            gender_val = user.gender

    consultation_fee = pick("consultation_fee", "consultationFee")
    if consultation_fee is not None:
        try:
            consultation_fee = int(consultation_fee)
        except Exception:
            pass

    languages = pick("languages") or []
    if isinstance(languages, str):
        languages = [s.strip() for s in languages.split(",") if s.strip()]

    # Create doctor record
    try:
        db_doctor = models.Doctor(
            user_id=user.id,
            name=pick("name", "full_name") or user.name,
            gender=gender_val,
            dob=dob_val,
            registration_no=pick("registration_no", "registrationNo") or "",
            consultation_fee=consultation_fee,
            license_no=pick("license_no", "licenseNo") or "",
            issuing_council=pick("issuing_council", "issuingCouncil") or "",
            languages=languages,
            specialization=pick("specialization") or "",
            years_of_experience=pick("years_of_experience", "years", "yearsOfExperience") or "",
            previous_employer=pick("previous_employer", "previous") or "",
            designation=pick("designation", "Designation") or "",
            duration=pick("duration", "Duration") or "",
            awards=pick("awards"),
            is_active=pick("is_active", "status") if pick("is_active", "status") is not None else True,
            phone=pick("phone", "contact_number", "contactNumber", "contact") or user.phone,
            email=pick("email", "email_id") or user.email,
            company_id=user.company_id,
        )
        db.add(db_doctor)
        db.commit()
        db.refresh(db_doctor)
        return db_doctor
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database Integrity Error: {str(e.orig)}")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Internal server error while creating doctor: {str(e)}")

#-------------PATIENT--------------


def create_patient(db: Session, patient: schemas.PatientCreate):
    # Convert Pydantic enum values to SQLAlchemy enum names
    try:
        gender_enum = models.GenderEnum(patient.gender)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid gender value: {str(e)}")
    
    # ✅ Check for existing phone number with better error message
    existing_phone = db.query(models.Patient).filter(
        models.Patient.phone_number == patient.phone_number
    ).first()
    if existing_phone:
        raise HTTPException(
            status_code=400, 
            detail=f"Phone number {patient.phone_number} is already registered to patient: {existing_phone.name} (ID: {existing_phone.custom_id})"
        )
    
    # Check for existing email if provided
    if patient.email_id:
        existing_email = db.query(models.Patient).filter(
            models.Patient.email_id == patient.email_id
        ).first()
        if existing_email:
            raise HTTPException(
                status_code=400, 
                detail=f"Email {patient.email_id} is already registered to patient: {existing_email.name} (ID: {existing_email.custom_id})"
            )
    
    # Check for existing Aadhaar if provided
    if patient.aadhaar:
        existing_aadhaar = db.query(models.Patient).filter(
            models.Patient.aadhaar == patient.aadhaar
        ).first()
        if existing_aadhaar:
            raise HTTPException(
                status_code=400, 
                detail=f"Aadhaar {patient.aadhaar} is already registered"
            )
    
    custom_id = generate_custom_id(db)
    age = calculate_age(patient.dob)

    try:
        db_patient = models.Patient(
            custom_id=custom_id,
            name=patient.name,
            gender=gender_enum,
            dob=patient.dob,
            blood_group=patient.blood_group,
            age=age,
            phone_number=patient.phone_number,
            image=getattr(patient, 'image', None),
            aadhaar=patient.aadhaar,
            email_id=patient.email_id,
            address=patient.address,
            city=patient.city,
            state=patient.state,
            pincode=patient.pincode,
            company_id=patient.company_id,
            allergies=getattr(patient, "allergies", None),
            c_illness=getattr(patient, "c_illness", None),
            reference_doctor=patient.reference_doctor,
            med_history=getattr(patient, "med_history", None),
            e_contact=getattr(patient, "e_contact", None),
            e_person=getattr(patient, "e_person", None),
            currentMedications=getattr(patient, "currentMedications", None),  
        )
        db.add(db_patient)
        db.commit()
        db.refresh(db_patient)
        return db_patient
    except IntegrityError as e:
        db.rollback()
        if "phone_number" in str(e):
            raise HTTPException(status_code=400, detail="Phone number is already registered")
        elif "email_id" in str(e):
            raise HTTPException(status_code=400, detail="Email is already registered")
        elif "aadhaar" in str(e):
            raise HTTPException(status_code=400, detail="Aadhaar is already registered")
        else:
            raise HTTPException(status_code=400, detail=f"Data conflict: {str(e)}")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

def get_patients(db: Session, skip: int = 0, limit: int = 10):
    return (
        db.query(models.Patient)
        .options(joinedload(models.Patient.company))  # load company relationship
        .offset(skip)
        .limit(limit)
        .all()
    )


#--------APPOINTMENT-------

def generate_appointment_id(db: Session):
    last_appointment = db.query(models.Appointment).order_by(models.Appointment.id.desc()).first()
    if last_appointment and last_appointment.custom_id:
        last_number = int(last_appointment.custom_id.replace("AP", ""))
        new_number = last_number + 1
    else:
        new_number = 1
    return f"AP{new_number:04d}"


# ✅ Create Appointment
def create_appointment(db: Session, appointment: schemas.AppointmentCreate):
    from datetime import date

    # Helper to coerce date-like fields
    def to_date_val(v):
        if v is None:
            return None
        if isinstance(v, date):
            return v
        if isinstance(v, str):
            try:
                return date.fromisoformat(v.split("T")[0])
            except Exception:
                return None
        return None

    # Coerce date fields
    appointment.dob = to_date_val(getattr(appointment, 'dob', None))
    reg_date = to_date_val(getattr(appointment, 'registrationDate', None) or getattr(appointment, 'registration_date', None))
    visit_date = to_date_val(getattr(appointment, 'visitDate', None) or getattr(appointment, 'visit_date', None)) or date.today()
    txn_date = to_date_val(getattr(appointment, 'transactionDate', None) or getattr(appointment, 'transaction_date', None))

    # Convert enums
    try:
        patient_type_enum = models.PatientTypeEnum(appointment.patient_type)
        gender_enum = models.GenderEnum(appointment.gender)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid enum value: {str(e)}")

    # If patient_id not provided, try to find patient by phone/email
    if not appointment.patient_id:
        existing_patient = None
        if appointment.mobile:
            existing_patient = db.query(models.Patient).filter(models.Patient.phone_number == appointment.mobile).first()

        if not existing_patient and getattr(appointment, 'email', None):
            existing_patient = db.query(models.Patient).filter(
                models.Patient.email_id == appointment.email
            ).first()

        if existing_patient:
            patient_id_val = existing_patient.id
        else:
            # Create new patient
            patient_payload = schemas.PatientCreate(
                name=appointment.fullName,
                gender=appointment.gender,
                dob=appointment.dob,
                age=getattr(appointment, 'age', None),
                blood_group=getattr(appointment, 'bloodGroup', None),
                phone_number=str(appointment.mobile) if getattr(appointment, 'mobile', None) else None,
                email_id=getattr(appointment, 'email', None),
                address=getattr(appointment, 'address1', None),
                city=getattr(appointment, 'city', None),
                state=getattr(appointment, 'state', None),
                pincode=getattr(appointment, 'pin', None),
                reference_doctor=getattr(appointment, 'reference', None),
                aadhar=getattr(appointment, 'aadhar', None),
                company_id= appointment.company_id,
            )
            db_patient = create_patient(db, patient_payload)
            patient_id_val = db_patient.id

        appointment.patient_id = patient_id_val

    # Ensure age is set
    age_val = appointment.age if getattr(appointment, 'age', None) is not None else calculate_age(appointment.dob)

    # Create appointment DB object
    db_appointment = models.Appointment(
        patient_id=appointment.patient_id,
        doctor_id=getattr(appointment, 'doctor_id', None),
        company_id = appointment.company_id,
        patient_type=patient_type_enum,
        fullName=appointment.fullName,
        gender=gender_enum,
        dob=appointment.dob,
        age=age_val,
        bloodGroup=getattr(appointment, 'bloodGroup', None),
        mobile=appointment.mobile,
        alternateNumber=getattr(appointment, 'alternateNumber', None),
        email=None,  # DO NOT store email per appointment to avoid UNIQUE constraint
        address1=getattr(appointment, 'address1', None),
        city=getattr(appointment, 'city', None),
        state=getattr(appointment, 'state', None),
        pin=getattr(appointment, 'pin', None),
        patientCategory=getattr(appointment, 'patientCategory', None),
        aadhar=getattr(appointment, 'aadhar', None),
        reference=getattr(appointment, 'reference', None),
        valid=getattr(appointment, 'valid', None),
        billingType=getattr(appointment, 'billingType', None),
        registrationDate=reg_date,
        visitDate=visit_date,
        registrationFee=getattr(appointment, 'registrationFee', None),
        consultationFee=getattr(appointment, 'consultationFee', None),
        Discount=getattr(appointment, 'Discount', None),
        totalAmount=getattr(appointment, 'totalAmount', None),
        paymentStatus=getattr(appointment, 'paymentStatus', None),
        paymentMethod=getattr(appointment, 'paymentMethod', None),
        amountPaid=getattr(appointment, 'amountPaid', None),
        returnAmount=getattr(appointment, 'returnAmount', None),
        transactionId=getattr(appointment, 'transactionId', None),
        transactionDate=txn_date,
    )

    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)


    # Auto-create bill if totalAmount > 0
    if db_appointment.totalAmount > 0:
        bill_payload = schemas.BillCreate(
            created_from="appointment",
            reference_id=db_appointment.id,
            date=db_appointment.registrationDate or date.today(),
            bill_type=db_appointment.billingType or "appointment",
            amount=db_appointment.totalAmount,
            payment_method=db_appointment.paymentMethod,
            transaction_id=db_appointment.transactionId,
            paid_date=db_appointment.transactionDate,
            discount=db_appointment.Discount or 0,
            balance=(db_appointment.totalAmount - (db_appointment.Discount or 0)),
            status="PAID" if db_appointment.paymentStatus and db_appointment.paymentStatus.lower() == 'paid' else "UNPAID",
        )
        create_bill(db, bill_payload)

    return db_appointment




# Replace your get_appointments function in crud.py with this:

def get_appointments(db: Session, skip=0, limit=100):
    """Get all appointments with doctor.user and company relationships"""
    appointments = (
        db.query(models.Appointment)
        .options(
            joinedload(models.Appointment.doctor).joinedload(models.Doctor.user),
            joinedload(models.Appointment.company)
        )
        .offset(skip)
        .limit(limit)
        .all()
    )
    
    result = []
    for appt in appointments:
        # Get doctor's user_id properly
        doctor_user_id = None
        if appt.doctor and appt.doctor.user:
            doctor_user_id = appt.doctor.user.id
        
        # Build result dict with all fields
        appt_dict = {k: v for k, v in appt.__dict__.items() if not k.startswith("_")}
        appt_dict["doctor_user_id"] = doctor_user_id
        appt_dict["company"] = {
            "id": appt.company.id if appt.company else None,
            "name": appt.company.name if appt.company else None,
        }
        
        result.append(appt_dict)
    
    return result



# ✅ Get Single Appointment by ID
def get_appointment_by_id(db: Session, appointment_id: int):
    appointment = db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment


def get_appointments_by_company(db: Session, company_id: int, skip: int = 0, limit: int = 20):
    return (
        db.query(models.Appointment)
        .filter(models.Appointment.company_id == company_id)
        .options(joinedload(models.Appointment.company))
        .offset(skip)
        .limit(limit)
        .all()
    )
    
# Add this function to crud.py

def get_appointments_by_doctor(db: Session, doctor_id: int, skip: int = 0, limit: int = 100):
    """
    Get appointments filtered by doctor_id
    Returns appointments with nested doctor.user and company relationships
    """
    appointments = (
        db.query(models.Appointment)
        .options(
            joinedload(models.Appointment.doctor).joinedload(models.Doctor.user),
            joinedload(models.Appointment.company)
        )
        .filter(models.Appointment.doctor_id == doctor_id)
        .offset(skip)
        .limit(limit)
        .all()
    )

    result = []
    for appt in appointments:
        doctor_user_id = (
            appt.doctor.user.id if appt.doctor and appt.doctor.user else None
        )

        result.append({
            **{k: v for k, v in appt.__dict__.items() if not k.startswith("_")},
            "doctor_user_id": doctor_user_id,
            "company": {
                "id": appt.company.id if appt.company else None,
                "name": appt.company.name if appt.company else None,
            },
        })
    return result

def update_appointment(db: Session, appointment_id: int, updates: schemas.AppointmentUpdate):
    appointment = db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    # Convert enums if provided
    if updates.patient_type is not None:
        appointment.patient_type = models.PatientTypeEnum(updates.patient_type)
    if updates.gender is not None:
        appointment.gender = models.GenderEnum(updates.gender)

    # Update all other fields that are not None
    for field, value in updates.dict(exclude={"patient_type", "gender"}, exclude_unset=True).items():
        setattr(appointment, field, value)

    db.commit()
    db.refresh(appointment)
    return appointment


# ✅ Delete Appointment
def delete_appointment(db: Session, appointment_id: int):
    appointment = db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    db.delete(appointment)
    db.commit()
    return {"message": "Appointment deleted successfully"}
# ----- Bills -----
def generate_bill_id(db: Session) -> str:
    last = db.query(models.Bill).order_by(models.Bill.id.desc()).first()
    if last and last.bill_id:
        try:
            num = int(last.bill_id.replace('BIL', ''))
        except Exception:
            num = last.id
        new_num = num + 1
    else:
        new_num = 1
    return f"BIL{new_num:06d}"


def create_bill(db: Session, bill: schemas.BillCreate, bill_id: str | None = None):
    try:
        amount = int(bill.amount)
    except Exception:
        amount = 0
    try:
        discount = int(getattr(bill, 'discount', 0) or 0)
    except Exception:
        discount = 0
    try:
        balance = int(getattr(bill, 'balance', amount - discount) or (amount - discount))
    except Exception:
        balance = amount - discount

    db_bill = models.Bill(
        bill_id=bill_id or generate_bill_id(db),
        created_from=bill.created_from,
        reference_id=bill.reference_id,
        # Some existing DBs have appointment_id as NOT NULL; populate it from reference_id (or 0)
        appointment_id=(bill.reference_id if getattr(bill, 'reference_id', None) is not None else 0),
        date=getattr(bill, 'date', None) or date.today(),
        # legacy column mappings
        bill_date=(getattr(bill, 'date', None) or date.today()),
        items='[]',
        total_amount=amount,
        amount_paid=0,
        bill_type=bill.bill_type,
        amount=amount,
        payment_method=bill.payment_method,
        transaction_id=bill.transaction_id,
        paid_date=getattr(bill, 'paid_date', None),
        discount=discount,
        balance=balance,
        status=getattr(bill, 'status', 'UNPAID')
    )
    db.add(db_bill)
    db.commit()
    db.refresh(db_bill)
    return db_bill


def list_bills(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Bill).order_by(models.Bill.id.desc()).offset(skip).limit(limit).all()


def get_bill(db: Session, bill_id: int):
    return db.query(models.Bill).filter(models.Bill.id == bill_id).first()
# -----doctor crud operations-----


def create_offer(db: Session, offer: schemas.OfferCreate):
    db_offer = models.Offers(

    offer_id = offer.offer_id,
    offer_name = offer.offer_name,
    offer_type = offer.offer_type,
    offer_validfrom = offer.offer_validfrom,
    offer_validto = offer.offer_validto,
    offer_discount = offer.offer_discount,
    offer_eligibile_items = offer.offer_eligibile_items,
    offer_max_eligible = offer.offer_max_eligible,
    offer_min_eligible = offer.offer_min_eligible,
    offer_gender = offer.offer_gender,
    offer_remarks = offer.offer_remarks,
    company_id= offer.company_id,

    )
    db.add(db_offer)
    db.commit()
    db.refresh(db_offer)
    return db_offer


def get_offer(db: Session, offer_id: int) -> models.Offers:
    return db.query(models.Offers).filter(models.Offers.id == offer_id).first()


# crud.py
def list_offers(db: Session):
    return db.query(models.Offers).all()  # `company` relationship is included automatically



def update_offer(db: Session, db_offer: models.Offers, offer_update: schemas.OfferUpdate) -> models.Offers:
    for key, value in offer_update.dict(exclude_unset=True).items():
        setattr(db_offer, key, value)
    db.commit()
    db.refresh(db_offer)
    return db_offer


def delete_offer(db: Session, db_offer: models.Offers):
    db.delete(db_offer)
    db.commit()
    return {"detail": "Offer deleted successfully"}





# Add these functions to your crud.py file (replace existing optometry functions)

def create_optometry(db: Session, data: schemas.OptometryCreate, current_user):
    """Create a new optometry record"""
    try:
        # Use dict() for Pydantic v1 or model_dump() for v2
        try:
            optometry_data = data.model_dump(exclude_unset=True, exclude={"tested_by"})
        except AttributeError:
            # Fallback for Pydantic v1
            optometry_data = data.dict(exclude_unset=True, exclude={"tested_by"})
        
        # Add metadata
        optometry_data['tested_by'] = current_user.id
        optometry_data['user_id'] = current_user.id
        optometry_data['company_id'] = current_user.company_id
        optometry_data['tested_at'] = datetime.utcnow()
        
        # Create the optometry record
        new_opt = models.Optometry(**optometry_data)
        db.add(new_opt)
        db.commit()
        db.refresh(new_opt)
        
        # Update the appointment with optometry_id
        if data.appointment_id:
            appointment = db.query(models.Appointment).filter(
                models.Appointment.id == data.appointment_id
            ).first()
            if appointment:
                appointment.optometryId = new_opt.id
                db.commit()
        
        return new_opt
    
    except Exception as e:
        db.rollback()
        print(f"Error creating optometry: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create optometry: {str(e)}"
        )


def get_all_optometry(db: Session):
    """Get all optometry records"""
    return db.query(models.Optometry).all()


def get_optometry_by_id(db: Session, optometry_id: int):
    """Get a single optometry record by ID"""
    return db.query(models.Optometry).filter(models.Optometry.id == optometry_id).first()


def get_optometry_by_appointment_id(db: Session, appointment_id: int):
    """Get optometry record by appointment ID with relationships"""
    opt = (
        db.query(models.Optometry)
        .options(
            joinedload(models.Optometry.appointment_id)
            .joinedload(models.Appointment.doctor)
            .joinedload(models.Doctor.user),
            joinedload(models.Optometry.user),
        )
        .filter(models.Optometry.appointment_id == appointment_id)
        .first()
    )
    return opt


def update_optometry(db: Session, optometry_id: int, data: schemas.OptometryUpdate, current_user):
    """Update an existing optometry record"""
    try:
        # Get existing record
        opt = db.query(models.Optometry).filter(models.Optometry.id == optometry_id).first()
        
        if not opt:
            raise HTTPException(status_code=404, detail="Optometry record not found")

        # Get update data (handle both Pydantic v1 and v2)
        try:
            update_data = data.model_dump(exclude_unset=True)
        except AttributeError:
            update_data = data.dict(exclude_unset=True)

        # Update fields
        for key, value in update_data.items():
            if hasattr(opt, key):
                setattr(opt, key, value)

        # Update metadata
        opt.updated_by = current_user.id
        opt.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(opt)
        
        return opt
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error updating optometry: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update optometry: {str(e)}"
        )


def delete_optometry(db: Session, optometry_id: int):
    """Delete an optometry record"""
    try:
        opt = db.query(models.Optometry).filter(models.Optometry.id == optometry_id).first()
        
        if not opt:
            return False

        # Also clear the optometryId from the appointment if it exists
        if opt.appointment_id:
            appointment = db.query(models.Appointment).filter(
                models.Appointment.id == opt.appointment_id
            ).first()
            if appointment:
                appointment.optometryId = None
                db.commit()

        db.delete(opt)
        db.commit()
        return True
    
    except Exception as e:
        db.rollback()
        print(f"Error deleting optometry: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete optometry: {str(e)}"
        )
        

# Create consultation
def create_consultation(db: Session, consultation: schemas.ConsultationCreate):
    db_consult = models.Consultation(
        doctor_id=consultation.doctor_id,
        appointment_id=consultation.appointment_id,
        company_id=consultation.company_id,
        patient_id=consultation.patient_id,
        user_id=consultation.user_id,
        optometry_id=consultation.optometry_id,
        followup_date=consultation.followup_date,
        nextVisit=consultation.nextVisit,
        usagePerDay=consultation.usagePerDay,
        transferOutside=consultation.transferOutside,
        outsideDetails=consultation.outsideDetails,
        dilatation=consultation.dilatation,
        rerefraction=consultation.rerefraction,
        highRiskPatient=consultation.highRiskPatient,
        fileClose=consultation.fileClose,
        additionalRemarks=consultation.additionalRemarks,
        highRiskRemarks=consultation.highRiskRemarks,
        diagnosis=[d.dict() for d in consultation.diagnosis] if consultation.diagnosis else None,
        dia_comments_le=consultation.dia_comments_le,
        dia_comments_re=consultation.dia_comments_re,
        procedure=[p.dict() for p in consultation.procedure] if consultation.procedure else None,
        pro_comments_le=consultation.pro_comments_le,
        pro_comments_re=consultation.pro_comments_re,
        ot_counsil=[o.dict() for o in consultation.ot_counsil] if consultation.ot_counsil else None,
        category=consultation.category,
        itemName=consultation.itemName,
        dosage=consultation.dosage,
        frequency=consultation.frequency,
        duration=consultation.duration,
        route=consultation.route,
        quantity=consultation.quantity,
        start_date=consultation.start_date,
        end_date=consultation.end_date,
        kit=consultation.kit,
        instruction=consultation.instruction,
    )
    db.add(db_consult)
    db.commit()
    db.refresh(db_consult)
    return db_consult


# Get all consultations
def get_consultations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Consultation).offset(skip).limit(limit).all()


# Get consultation by patient_id
def get_consultation_by_patient(db: Session, patient_id: int):
    return db.query(models.Consultation).filter(models.Consultation.patient_id == patient_id).all()


# Update consultation
def update_consultation(db: Session, consultation_id: int, consultation_update: schemas.ConsultationUpdate):
    db_consult = db.query(models.Consultation).filter(models.Consultation.id == consultation_id).first()
    if not db_consult:
        return None
    for key, value in consultation_update.dict(exclude_unset=True).items():
        if key in ["diagnosis", "procedure", "ot_counsil"] and value is not None:
            setattr(db_consult, key, [v.dict() for v in value])
        else:
            setattr(db_consult, key, value)
    db.commit()
    db.refresh(db_consult)
    return db_consult

