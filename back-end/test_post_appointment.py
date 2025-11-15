from fastapi.testclient import TestClient
import main
from datetime import date

client = TestClient(main.app)

payload = {
    "patient_type": "Camp",
    "fullName": "gokul",
    "gender": "Male",
    "dob": "1999-09-10",
    "age": 26,
    "bloodGroup": "O+",
    "mobile": "7000001234",
    "alternateNumber": "",
    "email": "gokul@example.com",
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

print('Submitting payload:', payload)
resp = client.post('/appointments/', json=payload)
print('Status:', resp.status_code)
try:
    print('Response:', resp.json())
except Exception as e:
    print('No JSON in response:', resp.text)
    raise
