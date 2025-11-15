from pydantic import BaseModel, EmailStr,field_serializer
from datetime import date, datetime
from typing import List, Optional,Literal
from enum import Enum
from models import UserType, GenderEnum, PatientTypeEnum


class PatientImageBase(BaseModel):
    file_path: str

class PatientImageCreate(PatientImageBase):
    pass


class PatientImage(PatientImageBase):
    id: int

    class Config:
        from_attributes = True


class CompanyBase(BaseModel):
    name: str
    abbreviation: Optional[str] = None
    address: Optional[str] = None
    logo: Optional[str] = None
    phone: Optional[str] = None
    website:Optional[str]= None
    email: Optional[EmailStr] = None
    status: Optional[str] = "ACTIVE"
    admin:Optional[str]
    gstnumber:Optional[str] = None

class CompanyCreate(CompanyBase):
    pass

class CompanyResponse(CompanyBase):
    id: int

    class Config:
        from_attributes = True

class CompanyUpdate(BaseModel):

    name: str
    abbreviation: str
    address: Optional[str] = None
    logo: Optional[str] = None
    phone: Optional[str] = None
    website:Optional[str]= None
    email: Optional[EmailStr] = None
    status: Optional[str] = "ACTIVE"
    admin:Optional[str]
    gstnumber:str
    

class UserBase(BaseModel):

    name: str
    gender: Optional[GenderEnum] = None
    dob: date | None = None 
    blood_group: Optional[str] = None
    age: Optional[int] = None
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None
    education: Optional[str] = None
    certificates: Optional[List] = None
    photo: Optional[str] = None
    staticIP: Optional[str] = None
    password:Optional[str]
    user_type: UserType
    is_active: Optional[bool] = True
    company_name : Optional[str] = None
    company_id: Optional[int] = None

# ---- For creating a new user ----
class UserCreate(UserBase):
    password: str
    company_id:int

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

# ---- For updating user ----
class UserUpdate(BaseModel):

    name: Optional[str]
    gender: Optional[GenderEnum]
    dob: Optional[date]
    bloodGroup: Optional[str] = None
    age: Optional[int]
    email: Optional[EmailStr]
    phone: Optional[str]
    address: Optional[str]
    education: Optional[str]
    certificates: Optional[List[str]] = None
    photo: Optional[str]
    staticIP: Optional[str]
    user_type: Optional[UserType]
    is_active: Optional[bool]
    company_id: Optional[int]
    password: Optional[str]


class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    company_id: Optional[int] = None
    user_type: Optional[str] = None

# ---- Appointment Schemas ----

class AppointmentBase(BaseModel):

    patient_type: PatientTypeEnum
    fullName: str
    gender: GenderEnum
    dob: date
    age: Optional[int] = None
    bloodGroup: Optional[str] = None
    mobile: Optional[str] = None
    alternateNumber: Optional[str] = None
    email: Optional[EmailStr] = None
    address1: Optional[str] = None 
    city: Optional[str] = None 
    state: Optional[str] = None 
    pin: Optional[str] = None 
    patientCategory: Optional[str] = None 
    aadhar: Optional[str] = None 
    reference: Optional[str] = None 
    valid: Optional[str] = None 
    billingType: Optional[str] = None 
    registrationFee: Optional[int] = None 
    consultationFee: Optional[int] = None 
    Discount: Optional[int] = None 
    totalAmount: Optional[int] = None 
    paymentStatus: Optional[str] = None 
    paymentMethod: Optional[str] = None 
    amountPaid: Optional[int] = None 
    returnAmount: Optional[int] = None 
    transactionId: Optional[str] = None 
    transactionDate: Optional[date] = None 
    visit_date: Optional[date] = None
    registrationDate: Optional[date] = None 
    company_id: int
    company:Optional[CompanyBase] = None
    

class AppointmentCreate(AppointmentBase):
    patient_id:Optional[int]= None
    doctor_id:Optional[int]= None
    company_name:Optional[str] = None

class AppointmentUpdate(BaseModel):
    patient_type: PatientTypeEnum
    fullName: str
    gender: GenderEnum
    dob: date
    age: Optional[int] = None
    bloodGroup: Optional[str] = None
    mobile: Optional[str] = None
    alternateNumber: Optional[str] = None
    email: Optional[EmailStr] = None
    address1: Optional[str] = None 
    city: Optional[str] = None 
    state: Optional[str] = None 
    pin: Optional[str] = None 
    patientCategory: Optional[str] = None 
    aadhar: Optional[str] = None 
    reference: Optional[str] = None 
    valid: Optional[str] = None 
    billingType: Optional[str] = None 
    registrationFee: Optional[int] = None 
    consultationFee: Optional[int] = None 
    Discount: Optional[int] = None 
    totalAmount: Optional[int] = None 
    paymentStatus: Optional[str] = None 
    paymentMethod: Optional[str] = None 
    amountPaid: Optional[int] = None 
    returnAmount: Optional[int] = None 
    transactionId: Optional[str] = None 
    transactionDate: Optional[date] = None 
    visit_date: Optional[date] = None
    registrationDate: Optional[date] = None 
    company_id: int
    company_name: Optional[str] = None


class Appointment(AppointmentBase):
    id: int
    custom_id: Optional[str] = None
    patient_id: Optional[int] = None
    doctor_id: Optional[int] = None
    

    class Config:
        orm_mode = True

class PatientBase(BaseModel):
    name: str
    gender: GenderEnum
    dob: date
    aadhaar: Optional[str] = None
    age: Optional[int] = None
    blood_group: Optional[str] = None
    phone_number: Optional[str] = None
    email_id: Optional[EmailStr] = None
    image: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    reference_doctor: Optional[str] = None
    allergies: Optional[str] = None
    c_illness: Optional[str] = None
    med_history: Optional[str] = None
    e_contact: Optional[str] = None
    e_person: Optional[str] = None
    currentMedications:Optional[str] = None
    custom_id: Optional[str] = None
    company_id: int


class PatientCreate(PatientBase):
    pass

class PatientUpdate(BaseModel):
    name: Optional[str]
    gender: Optional[GenderEnum]
    dob: Optional[date]
    aadhaar: Optional[str]=None
    age: Optional[int]
    blood_group: Optional[str]
    phone_number: Optional[str]
    email_id: Optional[EmailStr]=None
    address: Optional[str]
    city: Optional[str]
    state: Optional[str]
    pincode: Optional[str]
    reference_doctor: Optional[str]= None
    allergies: Optional[str] = None
    c_illness: Optional[str] = None
    med_history: Optional[str] = None
    e_contact: Optional[str] = None
    e_person: Optional[str] = None
    currentMedications:Optional[str] = None  
    custom_id: Optional[str] = None  
    company_id: int

    class Config:
        orm_mode = True


class PatientResponse(PatientBase):
    id: int
    custom_id : str
    company_id: int
    company_name: Optional[str] = None
    class Config:
        from_attributes = True
    

# ----doctor----



class DoctorImageBase(BaseModel):
    file_path:str

class DoctorImageCreate(DoctorImageBase):
    pass 

class DoctorImage(DoctorImageBase):
    id:int

    class Config:
        from_attributes = True


# ----doctor certificates----

class DoctorCertificateBase(BaseModel):
    file_path:str

class DoctorCertificateCreate(DoctorCertificateBase):
    pass 

class DoctorCertificate(DoctorCertificateBase):
    id:int

    class Config:
        from_attributes =True

# -----doctor experience certificates----

class DoctorExpCertificateBase(BaseModel):
    file_path:str

class DoctorExpCertificateCreate(DoctorCertificateBase):
    pass 

class DoctorExpCertificate(DoctorCertificateBase):
    id:int

    class Config:
        from_attributes =True


class DoctorBase(BaseModel):
    registration_no: str
    consultation_fee: int
    license_no: str
    issuing_council: str
    languages: List[str]
    specialization: str
    years_of_experience: Optional[str] = None
    previous_employer: Optional[str] = None
    designation: Optional[str] = None
    duration: Optional[str] = None
    awards: Optional[str] = None
    certifications: Optional[List[str]] = None
    experience_certificate: Optional[List[str]] = None

    class Config:
        extra = "allow"  # ✅ allow additional fields

class DoctorCreate(DoctorBase):
    user: Optional["UserCreate"] = None
    user_id: Optional[int] = None

class DoctorResponse(DoctorBase):
    id: int
    name: str
    specialization: Optional[str]
    is_active: bool
    company_id:int
    user: Optional[UserBase]
    company: Optional[CompanyBase]

    @field_serializer('languages')
    def serialize_languages(self, languages: List[str], _info):
        """Ensure languages is always a list of strings"""
        if isinstance(languages, str):
            return [languages]
        return languages if languages else []

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True


class BillBase(BaseModel):
    created_from: str
    reference_id: Optional[int] = None
    date: Optional[datetime] = None
    created_at: Optional[datetime] = None
    bill_type: Optional[str] = None
    amount: int
    payment_method: Optional[str] = None
    transaction_id: Optional[str] = None
    paid_date: Optional[datetime] = None
    discount: Optional[int] = 0
    balance: Optional[int] = 0
    status: Optional[str] = "UNPAID"


class BillCreate(BillBase):
    pass


class BillResponse(BillBase):
    id: int
    bill_id: Optional[str]
    company_id :Optional[int] = None

    class Config:
        from_attributes = True


class OfferBase(BaseModel):
    offer_id :int
    offer_name :str
    offer_type :str
    offer_validfrom :date
    offer_validto : date
    offer_discount : str
    offer_eligibile_items : str
    offer_max_eligible : Optional[int]
    offer_min_eligible : Optional[int]
    offer_gender : Optional[GenderEnum]
    offer_remarks : Optional[str]
    company_id: int

class OfferCreate(OfferBase):
    pass

class OfferResponse(OfferBase):
    id: int
    company_id:int
    company: Optional[CompanyResponse]

    class Config:
        from_attributes = True


class OfferUpdate(BaseModel):

    offer_id :int
    offer_name :str
    offer_type :str
    offer_validfrom :date
    offer_validto : date
    offer_discount : str
    offer_eligibile_items : str
    offer_max_eligible : Optional[int]
    offer_min_eligible : Optional[int]
    offer_gender : Optional[GenderEnum]
    offer_remarks : Optional[str]
    company_id: int

#-----login schema----

class LoginRequest(BaseModel):
    email: str
    password: str
    
    
    

class OptometryBase(BaseModel):
    company_id: Optional[int] = None
    appointment_id: Optional[int]
    user_id: Optional[int] = None  # patient or linked user
    patient_id :Optional[int]
    
    presenting_complaints: Optional[str] = None
    case_history: Optional[str] = None
    allergies: Optional[str] = None
    
    # --- AR OD ---
    ar_od_sph: Optional[str] = None
    ar_od_cyl: Optional[str] = None
    ar_od_axis: Optional[str] = None
    ar_od_nct: Optional[str] = None
    ar_od_at: Optional[str] = None

    # --- AR OS ---
    ar_os_sph: Optional[str] = None
    ar_os_cyl: Optional[str] = None
    ar_os_axis: Optional[str] = None
    ar_os_nct: Optional[str] = None
    ar_os_at: Optional[str] = None

    # --- Visual Acuity ---
    va_od_distant: Optional[str] = None
    va_od_ph: Optional[str] = None
    va_od_near: Optional[str] = None
    va_od_color: Optional[str] = None

    va_os_distant: Optional[str] = None
    va_os_ph: Optional[str] = None
    va_os_near: Optional[str] = None
    va_os_color: Optional[str] = None

    # --- POG ---
    od_Distant_sph: Optional[str] = None
    od_Distant_cyl : Optional[str] = None
    od_Distant_axis : Optional[str] = None
    od_Distant_pg : Optional[str] = None
    od_Near_sph : Optional[str] = None
    od_Near_cyl : Optional[str] = None
    od_Near_axis : Optional[str] = None
    od_Near_pg : Optional[str] = None
    
    os_Distant_sph : Optional[str] = None
    os_Distant_cyl : Optional[str] = None
    os_Distant_axis : Optional[str] = None
    os_Distant_pg : Optional[str] = None
    os_Near_sph : Optional[str] = None
    os_Near_cyl : Optional[str] = None
    os_Near_axis : Optional[str] = None
    os_Near_pg : Optional[str] = None

    remarks : Optional[str] = None
    loadLastPG : Optional[str] = None
    clear : Optional[str] = None
    duration : Optional[str] = None
    
    
    

    # --- Refraction ---
    ref_od_dist_va: Optional[str] = None
    ref_od_dist_sph: Optional[str] = None
    ref_od_dist_cyl: Optional[str] = None
    ref_od_dist_axis: Optional[str] = None

    ref_od_near_va: Optional[str] = None
    ref_od_near_sph: Optional[str] = None
    ref_od_near_cyl: Optional[str] = None
    ref_od_near_axis: Optional[str] = None

    ref_os_dist_va: Optional[str] = None
    ref_os_dist_sph: Optional[str] = None
    ref_os_dist_cyl: Optional[str] = None
    ref_os_dist_axis: Optional[str] = None

    ref_os_near_va: Optional[str] = None
    ref_os_near_sph: Optional[str] = None
    ref_os_near_cyl: Optional[str] = None
    ref_os_near_axis: Optional[str] = None

    ref_distance: Optional[str] = None
    ref_remarks: Optional[str] = None

    # --- Retinoscopy ---
    ret_od_dry: Optional[str] = None
    ret_od_wet: Optional[str] = None
    ret_os_dry: Optional[str] = None
    ret_os_wet: Optional[str] = None

    dia_od: Optional[str] = None
    dia_os: Optional[str] = None

    #-----keratometry---

    k1_od: Optional[str] = None
    k2_od: Optional[str] = None
    k1_os: Optional[str] = None
    k2_os: Optional[str] = None

    #-----pachymetry

    pachy_od: Optional[str] = None
    pachy_odiop: Optional[str] = None
    pachy_os: Optional[str] = None
    pachy_osiop: Optional[str] = None


    #----last form----

    pupil_od: Optional[str] = None
    cr_od: Optional[str] = None
    cover_od: Optional[str] = None
    om_od: Optional[str] = None
    confrontation_od: Optional[str] = None
    covergence_od : Optional[str] = None


    pupil_os: Optional[str] = None
    cr_os: Optional[str] = None
    cover_os: Optional[str] = None
    om_os: Optional[str] = None
    confrontation_os: Optional[str] = None
    covergence_os : Optional[str] = None


    pmt : Optional[str] = None
    duochrome: Optional[str] = None
    dialated: Optional[str] = None
    wfdt: Optional[str] = None

        #----spectacles---
    lens_type: Optional[str] = None
    lens_material: Optional[str] = None
    lens_coating: Optional[str] = None
    lens_power_le: Optional[str] = None
    lens_power_re: Optional[str] = None
    axis_le: Optional[str] = None
    axis_re: Optional[str] = None
    cylinder_le: Optional[str] = None
    cylinder_re: Optional[str] = None
    addition_near: Optional[str] = None
    remarks: Optional[str] = None


# ------------------------
# Create Schema
# ------------------------
class OptometryCreate(OptometryBase):
    tested_at: Optional[datetime] = None
    appointment_id: Optional[int]


# ------------------------
# Update Schema
# ------------------------
class OptometryUpdate(OptometryBase):
    updated_by: Optional[int] = None
    updated_at: Optional[datetime] = None


# ------------------------
# Response Schema
# ------------------------
class OptometryResponse(OptometryBase):
    id: int
    tested_by: Optional[int]
    tested_at: Optional[datetime]
    updated_by: Optional[int]
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True


# -----------------------------
# Nested Schemas
# -----------------------------
class DiagnosisItem(BaseModel):
    condition: str
    eye: Literal["Right", "Left", "Both"]


class ProcedureItem(BaseModel):
    name: str
    eye: Literal["Right", "Left", "Both"]
    remarks: Optional[str] = None


class OtCounsellingItem(BaseModel):
    procedure_name: str
    eye: Literal["Right", "Left", "Both"]
    remarks: Optional[str] = None
    consent: Optional[bool] = None


# -----------------------------
# Main Consultation Schemas
# -----------------------------
class ConsultationBase(BaseModel):
    doctor_id: Optional[int] = None
    appointment_id: Optional[int] = None
    company_id: Optional[int] = None
    patient_id: Optional[int] = None
    user_id: Optional[int] = None
    optometry_id: Optional[int] = None

    nextVisit: Optional[str] = None
    followup_date: Optional[date] = None
    usagePerDay: Optional[str] = None
    transferOutside: Optional[bool] = None
    outsideDetails: Optional[str] = None
    dilatation: Optional[bool] = None
    rerefraction: Optional[bool] = None
    highRiskPatient: Optional[bool] = None
    fileClose: Optional[bool] = None
    additionalRemarks: Optional[str] = None
    highRiskRemarks: Optional[str] = None

    # Diagnosis Section
    diagnosis: Optional[List[DiagnosisItem]] = []
    dia_comments_le: Optional[str] = None
    dia_comments_re: Optional[str] = None

    # Procedure Section
    procedure: Optional[List[ProcedureItem]] = []
    pro_comments_le: Optional[str] = None
    pro_comments_re: Optional[str] = None

    # OT Counselling
    ot_counsil: Optional[List[OtCounsellingItem]] = []

    # Medicine Section
    category: Optional[str] = None
    itemName: Optional[str] = None
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    duration: Optional[str] = None
    route: Optional[str] = None
    quantity: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None

    # Kit & Instruction
    kit: Optional[str] = None
    instruction: Optional[str] = None


# -----------------------------
# Create & Update Schemas
# -----------------------------
class ConsultationCreate(ConsultationBase):
    doctor_id: int
    appointment_id: int
    company_id: int
    patient_id: int
    user_id: int
    optometry_id: int
    followup_date: date


class ConsultationUpdate(ConsultationBase):
    pass


# -----------------------------
# Response Schema
# -----------------------------
class ConsultationResponse(ConsultationBase):
    id: int

    class Config:
        orm_mode = True

# -----------------------------------------------------------
# Medicine Schema (minimal, used in relation)
# -----------------------------------------------------------
class MedicineBase(BaseModel):
    name: str
    description: Optional[str] = None
    description: Optional[str] = None
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    duration: Optional[str] = None
    route: Optional[str] = None
    medQuantity: Optional[str] = None
    start_date: Optional[date] = None
    end_date:Optional[date] = None
    

class MedicineResponse(MedicineBase):
    id: int

    class Config:
        orm_mode = True


# -----------------------------------------------------------
# Kit Schemas
# -----------------------------------------------------------
class KitBase(BaseModel):
    company_id: Optional[int] = None
    kitId: Optional[str] = None
    kitName: Optional[str] = None
    reason: Optional[str] = None
    medicines: List[MedicineBase] = []



# ✅ For Creating a Kit
class KitCreate(KitBase):
    pass


# ✅ For Updating a Kit
class KitUpdate(KitBase):
    pass


# ✅ For Reading / Returning a Kit
class KitResponse(KitBase):
    id: int

    class Config:
        orm_mode = True



