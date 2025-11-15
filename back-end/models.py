import enum
from sqlalchemy import Column, Integer, String, Date, ForeignKey, Text, Enum, JSON, Boolean, DateTime, func
from sqlalchemy.orm import relationship
from database import Base
import datetime
from uuid import UUID


class PatientTypeEnum(str,enum.Enum):
    general ="General"
    camp = "Camp"

class GenderEnum(str, enum.Enum):
    Male = "Male"
    Female = "Female"
    Others = "Others"
    PreferNotToSay = "PreferNotToSay"

class StatusEnum(enum.Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"

class DoctorEnum(enum.Enum):
    DOC1 = "DOC1"
    DOC2 = "DOC2"
    DOC3 = "DOC3"
    DOC4 = "DOC4"

class UserType(str, enum.Enum):
    doctor = "doctor"
    optometrist = "optometrist"
    receptionist = "receptionist"
    pharmacist = "pharmacist"
    optician = "optician"
    counsellor = "counsellor"
    accountant = "accountant"
    admin = "admin" 
    super_admin= "super_admin"

class SuperAdmin(Base):
    __tablename__ = "super_admins"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    address = Column(Text, nullable=True)
    phone = Column(String, nullable=True)
    password = Column(String, nullable=False)
    user_type = Column(Enum(UserType), nullable=False)
    status = Column(Boolean, default=True)
    company_id = Column(Integer, ForeignKey("companies.id"), default=None)

class Company(Base):
    __tablename__ = "companies"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    superadmin_id = Column(Integer, ForeignKey("super_admins.id"), nullable=True)
    name = Column(String)
    abbreviation = Column(String)
    address = Column(String)
    logo = Column(String)
    phone = Column(String)
    email = Column(String)
    website = Column(String)
    gstnumber = Column(String)
    status = Column(String)
    admin = Column(String)

    patients = relationship("Patient", back_populates="company", cascade="all, delete-orphan")
    doctors = relationship("Doctor", back_populates="company", cascade="all, delete-orphan")
    users = relationship("User", back_populates="company", cascade="all, delete-orphan")
    appointments = relationship("Appointment", back_populates="company", cascade="all, delete-orphan")  
    offers = relationship("Offers", back_populates="company", cascade="all, delete-orphan")
    optometrys = relationship("Optometry", back_populates="company", cascade="all, delete-orphan")

class User(Base):
    __tablename__ = "users"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    gender = Column(Enum(GenderEnum),nullable=True)
    dob = Column(Date,nullable=False)
    blood_group = Column(String,nullable=True)
    age = Column(Integer)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String, unique=True, nullable=True)
    address = Column(Text)
    education = Column(String,nullable=False)
    certificates = Column(JSON, nullable=True,default='[]')
    photo = Column(String)
    password = Column(String)
    staticIP = Column(String)
    user_type = Column(Enum(UserType), nullable=False)
    is_active = Column(Boolean, default=True)

    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)

    company = relationship("Company", back_populates="users")
    doctor = relationship("Doctor", back_populates="user", uselist=False, cascade="all, delete-orphan")
    optometrys = relationship(
        "Optometry",
        back_populates="users",
        foreign_keys="[Optometry.user_id]"   # specify the correct FK here
    )


class Doctor(Base):
    __tablename__ = "doctors"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    gender = Column(Enum(GenderEnum), nullable=False)
    dob = Column(Date, nullable=False)
    registration_no = Column(String, nullable=False)
    blood_group = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    phone = Column(String, nullable=False)
    email = Column(String, nullable=True)
    address = Column(Text)
    education = Column(String)
    password = Column(String, nullable=True)
    staticIP = Column(String, nullable=True)
    is_active = Column(Boolean, default=True) 
    specialization = Column(String, nullable=False)
    license_no = Column(String, nullable=False)
    issuing_council = Column(String, nullable=False)
    consultation_fee = Column(Integer, nullable=True)
    languages = Column(JSON, nullable=True)

    user = relationship("User", back_populates="doctor")
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    company = relationship("Company", back_populates="doctors")
    
    years_of_experience = Column(String, nullable=False)
    previous_employer = Column(String, nullable=False)
    designation = Column(String, nullable=False)
    duration = Column(String, nullable=False)
    awards = Column(String, nullable=True)

    # FIXED: plural to match back_populates in Appointment
    appointments = relationship("Appointment", back_populates="doctor")  


class Patient(Base):
    __tablename__ = "patients"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    custom_id = Column(String, unique=True, index=True)  
    
    name = Column(String, nullable=False)
    gender = Column(Enum(GenderEnum), nullable=False)
    dob = Column(Date, nullable=False)
    age = Column(Integer)  
    blood_group = Column(String,nullable=True)
    phone_number = Column(String,nullable=False)
    
    email_id = Column(String, unique=True)
    aadhaar = Column(String, unique=True, nullable=True)
    address = Column(Text)
    city = Column(String)
    state = Column(String)
    pincode = Column(String)
    status = Column(Enum(StatusEnum),default=StatusEnum.ACTIVE)
    reference_doctor = Column(String)
    image = Column(String, nullable=True) 
    allergies = Column(String, nullable=True) 
    c_illness = Column(String, nullable=True)
    med_history = Column(String, nullable=True)
    e_contact = Column(String, nullable=True)
    e_person =Column(String, nullable=True)
    currentMedications = Column(String, nullable=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)

    company = relationship("Company", back_populates="patients")
    images = relationship("PatientImage", back_populates="patient", cascade="all, delete")
    appointments = relationship("Appointment", back_populates="patient", cascade="all, delete")

class PatientImage(Base):
    __tablename__ = "patient_images"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    file_path = Column(String, nullable=False)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    patient = relationship("Patient", back_populates="images")


class Appointment(Base):
    __tablename__ = "appointments"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=True)
    patient_type = Column(Enum(PatientTypeEnum), default=PatientTypeEnum.general, nullable=False)
    fullName = Column(String, nullable=False)
    gender = Column(Enum(GenderEnum), nullable=False)
    dob = Column(Date, nullable=False)
    age = Column(Integer, nullable=False)
    bloodGroup = Column(String, nullable=True)
    mobile = Column(String, nullable=False )
    alternateNumber = Column(String, nullable=True)
    email = Column(String, unique=True,nullable=True)
    address1 = Column(Text)
    city = Column(String)
    state = Column(String)
    pin = Column(String)
    registrationDate = Column(Date, default=datetime.date.today)
    visitDate = Column(Date, nullable=True)
    patientCategory = Column(String, nullable=True)
    aadhar = Column(String, nullable=True)
    reference = Column(String, nullable=True)
    valid = Column(String, nullable=True)
    billingType = Column(String, nullable=True)
    registrationFee = Column(Integer, nullable=True)
    consultationFee = Column(Integer, nullable=True)
    Discount = Column(Integer, nullable=True)
    totalAmount = Column(Integer, nullable=True)
    paymentStatus = Column(String, nullable=True)
    paymentMethod = Column(String, nullable=True)
    amountPaid = Column(Integer, nullable=True)
    returnAmount = Column(Integer, nullable=True)
    transactionId = Column(String, nullable=True)
    transactionDate = Column(Date, default=datetime.date.today,nullable=True )
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)

    # FIXED: single patient_id column
    company = relationship("Company", back_populates="appointments")
    patient = relationship("Patient", back_populates="appointments", cascade="all, delete")
    doctor = relationship("Doctor", back_populates="appointments", cascade="all, delete")
    optometries = relationship("Optometry", back_populates="appointment")


class Offers(Base):
    __tablename__ = "offers"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    offer_id = Column(Integer)
    offer_name = Column(String,nullable=False)
    offer_type = Column(String,nullable=True)
    offer_validfrom = Column(Date,nullable=False)
    offer_validto = Column(Date,nullable=False)
    offer_discount = Column(String,nullable=False)
    offer_eligibile_items = Column(String)
    offer_max_eligible = Column(Integer,nullable=True)
    offer_min_eligible = Column(Integer,nullable=True)
    offer_gender = Column(Enum(GenderEnum), nullable=False)
    offer_remarks = Column(Text)

    company = relationship("Company", back_populates="offers")


class Bill(Base):
    __tablename__ = "bills"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    bill_id = Column(String, unique=True, index=True)
    created_from = Column(String, nullable=False)  # e.g., 'appointment'
    reference_id = Column(Integer, nullable=True)  # e.g., appointment id
    # Some older DBs had a non-nullable appointment_id column; include it in the model
    # and make it nullable so inserts won't fail. Keep as FK to appointments when available.
    appointment_id = Column(Integer, ForeignKey("appointments.id"), nullable=True)
    # legacy DBs include a 'bill_date' column that is NOT NULL; keep both names and populate both
    date = Column(Date, default=datetime.date.today)
    bill_date = Column(Date, default=datetime.date.today, nullable=False)
    # legacy 'items' JSON column (some DBs expect this to be present)
    items = Column(JSON, nullable=False, default='[]')
    # legacy total_amount/amount_paid columns
    total_amount = Column(Integer, nullable=False, default=0)
    amount_paid = Column(Integer, nullable=False, default=0)
    bill_type = Column(String, nullable=True)
    amount = Column(Integer, nullable=False)
    payment_method = Column(String, nullable=True)
    transaction_id = Column(String, nullable=True)
    paid_date = Column(Date, nullable=True)
    discount = Column(Integer, nullable=True)
    balance = Column(Integer, nullable=True)
    status = Column(String, nullable=True)  # 'PAID' or 'UNPAID'



class Optometry(Base):
    __tablename__="optometrys"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    appointment_id = Column(Integer, ForeignKey("appointments.id"))
    company_id = Column(Integer, ForeignKey("companies.id"))
    patient_id = Column(Integer, ForeignKey("patients.id"))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    tested_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=True)

    # Relationships
    company = relationship("Company", back_populates="optometrys")
    appointment = relationship("Appointment", back_populates="optometries")
    
    tested_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # The "main user" for this Optometry record
    users = relationship("User", foreign_keys=[user_id], back_populates="optometrys")

    # Employee who tested
    tester = relationship("User", foreign_keys=[tested_by], backref="optometry_tests_done")

    # Employee who updated
    updater = relationship("User", foreign_keys=[updated_by], backref="optometry_tests_updated")
    
    presenting_complaints = Column(Text, nullable=True)
    case_history = Column(Text, nullable=True)
    allergies = Column(Text, nullable=True)

    # --AR reading-- OD section---

    ar_od_sph= Column(String,nullable=True)
    ar_od_cyl= Column(String,nullable=True)
    ar_od_axis= Column(String,nullable=True)
    ar_od_nct= Column(String,nullable=True)
    ar_od_at= Column(String,nullable=True)

    # --AR reading-- OS section---

    ar_os_sph= Column(String,nullable=True)
    ar_os_cyl= Column(String,nullable=True)
    ar_os_axis= Column(String,nullable=True)
    ar_os_nct= Column(String,nullable=True)
    ar_os_at= Column(String,nullable=True)

    #--Visual Acuity --OD section---
    
    va_od_distant = Column(String,nullable=True)
    va_od_ph = Column(String,nullable=True)
    va_od_near = Column(String,nullable=True)
    va_od_color = Column(String,nullable=True)

    #--Visual Acuity --OS section---

    va_os_distant = Column(String,nullable=True)
    va_os_ph = Column(String,nullable=True)
    va_os_near = Column(String,nullable=True)
    va_os_color = Column(String,nullable=True)

    #-----POG---
    
    od_Distant_sph= Column(String,nullable=True)
    od_Distant_cyl = Column(String,nullable=True)
    od_Distant_axis = Column(String,nullable=True)
    od_Distant_pg = Column(String,nullable=True)
    od_Near_sph = Column(String,nullable=True)
    od_Near_cyl = Column(String,nullable=True)
    od_Near_axis = Column(String,nullable=True)
    od_Near_pg = Column(String,nullable=True)
    
    os_Distant_sph = Column(String,nullable=True)
    os_Distant_cyl = Column(String,nullable=True)
    os_Distant_axis = Column(String,nullable=True)
    os_Distant_pg = Column(String,nullable=True)
    os_Near_sph = Column(String,nullable=True)
    os_Near_cyl = Column(String,nullable=True)
    os_Near_axis = Column(String,nullable=True)
    os_Near_pg = Column(String,nullable=True)

    remarks = Column(String,nullable=True)
    loadLastPG = Column(String,nullable=True)
    clear = Column(String,nullable=True)
    duration = Column(String,nullable=True)


# --------refraction-----


    ref_od_dist_va = Column(String,nullable=True)
    ref_od_dist_sph = Column(String,nullable=True)
    ref_od_dist_cyl = Column(String,nullable=True)
    ref_od_dist_axis = Column(String,nullable=True)

    ref_od_near_va = Column(String,nullable=True)
    ref_od_near_sph = Column(String,nullable=True)
    ref_od_near_cyl = Column(String,nullable=True)
    ref_od_near_axis = Column(String,nullable=True)

    #---Refraction os---

    ref_os_dist_va = Column(String,nullable=True)
    ref_os_dist_sph = Column(String,nullable=True)
    ref_os_dist_cyl = Column(String,nullable=True)
    ref_os_dist_axis = Column(String,nullable=True)

    ref_os_near_va = Column(String,nullable=True)
    ref_os_near_sph = Column(String,nullable=True)
    ref_os_near_cyl = Column(String,nullable=True)
    ref_os_near_axis = Column(String,nullable=True)


    ref_distance = Column(Text,nullable=True)
    ref_remarks = Column(Text,nullable=True)

    #---retinoscopy----

    ret_od_dry = Column(String,nullable=True)
    ret_od_wet = Column(String,nullable=True)
    ret_os_dry = Column(String,nullable=True)
    ret_os_wet = Column(String,nullable=True)



    #-----dialated---

    dia_od = Column(String,nullable=True)
    dia_os = Column(String,nullable=True)

    #-----keratometry---

    k1_od = Column(String,nullable=True)
    k2_od = Column(String,nullable=True)
    k1_os = Column(String,nullable=True)
    k2_os = Column(String,nullable=True)

    #-----pachymetry

    pachy_od = Column(String,nullable=True)
    pachy_odiop = Column(String,nullable=True)
    pachy_os = Column(String,nullable=True)
    pachy_osiop = Column(String,nullable=True)


    #----last form----

    pupil_od = Column(String,nullable=True)
    cr_od = Column(String,nullable=True)
    cover_od = Column(String,nullable=True)
    om_od= Column(String,nullable=True)
    confrontation_od = Column(String,nullable=True)
    covergence_od =Column(String,nullable=True)


    pupil_os = Column(String,nullable=True)
    cr_os = Column(String,nullable=True)
    cover_os = Column(String,nullable=True)
    om_os= Column(String,nullable=True)
    confrontation_os = Column(String,nullable=True)
    covergence_os =Column(String,nullable=True)


    pmt =Column(String,nullable=True)
    duochrome=Column(String,nullable=True)
    dialated=Column(String,nullable=True)
    wfdt=Column(String,nullable=True)

        #----spectacles---
    lens_type = Column(String,nullable=True)
    lens_material = Column(String,nullable=True)
    lens_coating = Column(String,nullable=True)
    lens_power_le = Column(String,nullable=True)
    lens_power_re = Column(String,nullable=True)
    axis_le = Column(String,nullable=True)
    axis_re = Column(String,nullable=True)
    cylinder_le = Column(String,nullable=True)
    cylinder_re = Column(String,nullable=True)
    addition_near = Column(String,nullable=True)
    remarks = Column(String,nullable=True)
    
# class Diagnosis(Base):
#     __tablename__ = "diagnoses"

#     id = Column(Integer, primary_key=True, index=True)
#     patient_id = Column(Integer, ForeignKey("patients.id"))
#     diagnosis = Column(JSON)  # stores list of {condition, eye}

#     consultation = relationship("Consultation", back_populates="diagnoses")


class Consultation(Base):
    __tablename__="consultations"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=False)
    appointment_id = Column(Integer, ForeignKey("appointments.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    optometry_id = Column(Integer, ForeignKey("optometrys.id"), nullable=False)
    
    #---follow up ---
    nextVisit = Column(String,nullable=True)
    followup_date= Column(Date, nullable=False)
    usagePerDay = Column(String,nullable=True)
    transferOutside= Column(Boolean,nullable=True)
    outsideDetails= Column(String,nullable=True)
    dilatation = Column(Boolean,nullable=True)
    rerefraction= Column(Boolean,nullable=True)
    highRiskPatient = Column(Boolean,nullable=True)
    fileClose = Column(Boolean,nullable=True)
    additionalRemarks = Column(Text,nullable=True)
    highRiskRemarks  = Column(Text,nullable=True)
    
    diagnosis = Column(JSON, nullable=True)
    
    dia_comments_le = Column(Text,nullable=True)
    dia_comments_re = Column(Text,nullable=True)
    
    procedure = Column(JSON, nullable=True)
    
    pro_comments_le = Column(Text,nullable=True)
    pro_comments_re = Column(Text,nullable=True)
    
    ot_counsil = Column(JSON, nullable=True)
    
    #-----medicine--
    
    category = Column(String,nullable=True)
    itemName = Column(String,nullable=True)
    dosage = Column(String,nullable=True)
    frequency = Column(String,nullable=True)
    duration = Column(String,nullable=True)
    route = Column(String,nullable=True)
    quantity = Column(String,nullable=True)
    start_date = Column(Date,nullable=True)
    end_date = Column(Date,nullable=True)
    
    #-------kit------
    
    kit = Column(String,nullable=True)
    #----Special instruction-----
    
    instruction = Column(Text,nullable=True)
    
    
class Medicine(Base):
    __tablename__ = "medicines"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)


    
    
class Kit(Base):
    __tablename__ = "kits"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    companyName = Column(String, nullable=True)
    kitId = Column(String, nullable=True)
    kitName = Column(String, nullable=True)
    reason = Column(String, nullable=True)
    category = Column(String, nullable=True)
    itemName = Column(String, nullable=True)
    medicines = Column(JSON, nullable=True)
    start_date = Column(Date,nullable=True)
    end_date = Column(Date,nullable=True)

    
    
    
    