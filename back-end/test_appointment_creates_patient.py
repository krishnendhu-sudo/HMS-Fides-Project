from fastapi.testclient import TestClient
import main
from datetime import date

client = TestClient(main.app)

payload = {
    "patient_type": "Camp",
    "fullName": "AutoPatient",
    "gender": "Male",
    "dob": "1999-09-10",
    "age": 26,
    "bloodGroup": "O+",
    "mobile": "70000088",
    "alternateNumber": "",
    "email": "autopatient@example.com",
    "address1": "",
    "city": "",
    "state": "",
    "pin": "",
    "aadhar": "",
    "reference": "",
    "valid": "",
    "billingType": "Cash",
    "registrationDate": str(date.today()),
    "visit_date": str(date.today()),
    "doctor_id": None
}

r = client.post('/appointments/', json=payload)
print('status', r.status_code)
print('resp', r.json())

# check patients list
r2 = client.get('/patients/')
print('patients', r2.status_code, r2.json()[:3])
