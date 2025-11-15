from fastapi import FastAPI
from database import Base, engine,SessionLocal
from sqlalchemy.orm import Session
from routers import patients, appointments, doctors, optometrys, company, user, offer,auth, kits, medicines, consultations
from routers import bills
from typing import List
from fastapi.staticfiles import StaticFiles


from fastapi.middleware.cors import CORSMiddleware


# Create DB tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()
db.close()


app = FastAPI(title="Hospital Management API")


# origins = [
#     "http://localhost:5173",
#     "http://127.0.0.1:5173"
# ]


@app.get("/")
def root():
    return {"message": "Hospital Management .API is running!"}

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(patients.router)
app.include_router(appointments.router)
app.include_router(doctors.router)
app.include_router(optometrys.router)
app.include_router(company.router)
app.include_router(user.router)
app.include_router(offer.router)
app.include_router(bills.router)
app.include_router(auth.router)
app.include_router(kits.router)
app.include_router(medicines.router)
app.include_router(consultations.router)