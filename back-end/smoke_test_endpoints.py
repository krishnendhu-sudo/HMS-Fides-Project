from fastapi.testclient import TestClient
import main

client = TestClient(main.app)

endpoints = [
    ("/doctors/", "Doctors"),
    ("/patients/", "Patients"),
    ("/appointments/", "Appointments"),
]

for path, name in endpoints:
    try:
        r = client.get(path)
        print(f"{name} {path} -> {r.status_code}")
        try:
            j = r.json()
            print(f"Sample ({len(j) if isinstance(j, list) else 'obj'}):", j[:2] if isinstance(j, list) else j)
        except Exception as e:
            print('  (no JSON or parse failed)', e)
    except Exception as e:
        print(f"Error calling {path}: {e}")
