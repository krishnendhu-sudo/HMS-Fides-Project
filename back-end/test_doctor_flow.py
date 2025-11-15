from fastapi.testclient import TestClient
import main
import uuid

client = TestClient(main.app)

# 1) Ensure there's at least one company
company_payload = {
    "name": "Test Company Inc",
    "abbreviation": "TC",
    "address": "123 Test Lane",
    "logo": "",
    "phone": "9998887776",
    "website": "",
    "email": "testcompany@example.com",
    "status": True,
    "admin": "admin",
    "gstnumber": ""
}

resp = client.post("/companies/", json=company_payload)
print('create company', resp.status_code, resp.json())
if resp.status_code in (200, 201):
    company = resp.json()
else:
    # try listing companies to pick first
    r2 = client.get('/companies/')
    print('list companies', r2.status_code, r2.text)
    company = r2.json()[0] if r2.json() else None

if not company:
    raise SystemExit('No company available')

company_id = company.get('id') or company.get('ID') or company.get('company_id')

# 2) Create a user
user_payload = {
    "name": "Dr Test",
    "gender": "Male",
    "dob": "1980-01-01",
    "email": f"drtest+{uuid.uuid4().hex[:6]}@example.com",
    "company_id": company_id,
    "blood_group": "A+",
    "age": 45,
    "phone": f"999888{uuid.uuid4().hex[:6]}",
    "address": "",
    "education": "MBBS",
    "certificates": "",
    "photo": "",
    "password": "pass",
    "staticIP": "",
    "user_type": "doctor",
    "is_active": True
}

r = client.post('/users/', json=user_payload)
print('create user', r.status_code, r.text)
if r.status_code not in (200, 201):
    raise SystemExit('User creation failed')
user = r.json()
user_id = user.get('id') or user.get('ID')

# 3) Create doctor with user_id
doctor_payload = {
    "user_id": user_id,
    "registration_no": "REG-TEST-001",
    "consultation_fee": 500,
    "license_no": "LIC123",
    "languages": ["English"],
}

r2 = client.post('/doctors/', json=doctor_payload)
print('create doctor', r2.status_code, r2.text)
if r2.status_code not in (200, 201):
    raise SystemExit('Doctor creation failed')

print('doctor created:', r2.json())
