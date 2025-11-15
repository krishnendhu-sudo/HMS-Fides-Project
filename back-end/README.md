# Back-end developer guide

This README explains how to run database migrations, seed the development database, normalize existing data, and run simple smoke tests for the FastAPI back-end located in this folder.

Target audience: developers working locally on Windows (PowerShell) who need to reproduce or reset the local SQLite database used by the project.

Paths and assumptions
- Project back-end root: this `back-end/` folder
- SQLite DB file (default): `hospital.db` in the project root (one level above this folder). If your DB is elsewhere, set the `DATABASE_URL` environment variable accordingly.
- Python: assumes a working Python environment with dependencies from `requirements.txt` installed.

Quick safety checklist
- Make a copy of the SQLite DB before running migrations or normalization. Example:

```powershell
# from project root (one level above back-end)
copy-item -Path .\hospital.db -Destination .\hospital.db.bak
```

Dependencies

Install dependencies (prefer a virtual environment):

```powershell
# create venv (optional)
python -m venv .venv; .\.venv\Scripts\Activate.ps1
# install
python -m pip install -r back-end\requirements.txt
```

1) Migrations

Two approaches are supported in the repo: Alembic (recommended) and a small manual migration script for quick fixes.

a) Alembic (recommended for ongoing development)

- If Alembic is not set up, install and initialise it once:

```powershell
python -m pip install alembic
cd back-end
alembic init alembic
```

- Configure `alembic/env.py` to import the project's SQLAlchemy metadata (the `Base` object) and use `DATABASE_URL` from env. Typical changes: import `database` and `models`, set `target_metadata = database.Base.metadata`.

- Generate an autogenerate revision (run from `back-end`):

```powershell
# set DATABASE_URL if not default (sqlite file at repo root)
$env:DATABASE_URL = "sqlite:///../hospital.db"
alembic revision --autogenerate -m "describe changes"
alembic upgrade head
```

Note: Alembic's autogenerate for SQLite has limitations (no support for dropping columns). Inspect the generated revision file and edit it when necessary.

b) Manual quick migration script

This repo contains `migrate_fix_db.py` for small one-off schema changes (adds columns, updates values). To run it from the project root run:

```powershell
python back-end\migrate_fix_db.py
```

2) Seeding (idempotent)

The repo includes seed scripts:
- `back-end/seed_doctors.py` – seeds sample company, user, and a few doctors
- `back-end/seed_all.py` – comprehensive seeding across companies, users, doctors, patients, appointments, and related tables

Run a seeder (from project root):

```powershell
# seed doctors only
python back-end\seed_doctors.py
# or seed everything (idempotent, will skip existing rows by email/mobile)
python back-end\seed_all.py
```

If you see UNIQUE constraint failures, re-check the generated values, or restore from the backup and re-run the seeder. The seed scripts try to avoid duplicates by checking existing emails/mobiles, but collisions are possible if the DB already contains similar values.

3) Normalization (cleaning existing data)

There are scripts to normalize DB rows so that Pydantic response validation will pass (convert empty-string numerics to NULL, normalize phone formats, etc.):

```powershell
python back-end\normalize_db.py
```

This script will print what it changed and then run a small in-process test client to call a few endpoints and write the results to `back-end/normalize_test_results.json`.

4) Smoke tests (quick checks of endpoints)

There are two approaches to smoke testing:

- In-process TestClient (safe, recommended): scripts like `normalize_db.py` and `dump_smoke.py` run the FastAPI app in-process and call endpoints. These are fast and avoid uvicorn/reloader port issues.

- External uvicorn (to emulate production run): start uvicorn in the foreground (no --reload) to get stable logs, then run curl or PowerShell Invoke-WebRequest to hit endpoints.

Start uvicorn (from project root) on a non-conflicting port (example: 8001):

```powershell
# from project root
# run in foreground to see logs in the terminal
python -m uvicorn back-end.main:app --host 127.0.0.1 --port 8001
```

Then in another terminal run smoke requests:

```powershell
# get doctors
Invoke-RestMethod -Uri http://127.0.0.1:8001/doctors/ -Method GET | ConvertTo-Json -Depth 5
# get appointments
Invoke-RestMethod -Uri http://127.0.0.1:8001/appointments/ -Method GET | ConvertTo-Json -Depth 5
# get patients
Invoke-RestMethod -Uri http://127.0.0.1:8001/patients/ -Method GET | ConvertTo-Json -Depth 5
```

If you need to run uvicorn in background, start it using Start-Process and capture its PID so you can stop it later:

```powershell
$proc = Start-Process -FilePath python -ArgumentList '-m uvicorn back-end.main:app --host 127.0.0.1 --port 8001' -PassThru
$proc.Id
# when done
Stop-Process -Id $proc.Id
```

5) Troubleshooting notes

- If endpoints return 500 or ResponseValidationError:
  - Run `back-end/normalize_db.py` to convert empty strings to NULL for numeric fields.
  - Inspect `back-end/schemas.py` for response model expectations and align schemas if necessary.

- If you get OperationalError about missing columns:
  - Run the manual migration script `python back-end\migrate_fix_db.py` or apply the corresponding Alembic revision.

- If you see UNIQUE constraint failures during seeding:
  - Restore from your DB backup and re-run the seeder.
  - Or edit the seeder to produce different unique values (emails/phones).

6) Common commands summary

```powershell
# backup
copy-item -Path .\hospital.db -Destination .\hospital.db.bak

# run migrations (alembic)
$env:DATABASE_URL = "sqlite:///../hospital.db"
alembic upgrade head

# or run manual migration
python back-end\migrate_fix_db.py

# seed
python back-end\seed_all.py

# normalize
python back-end\normalize_db.py

# smoke tests (in-process scripts)
python back-end\dump_smoke.py
python back-end\normalize_db.py  # writes normalize_test_results.json

# run server (foreground)
python -m uvicorn back-end.main:app --host 127.0.0.1 --port 8001
```

7) Next steps / recommended improvements

- Adopt Alembic for migrations long-term and keep migration revisions under version control.
- Add a small CI job that runs the seeders and in-process smoke tests against a fresh SQLite DB to catch regressions early.
- Add unit tests for CRUD operations so changes to models/schemas are validated automatically.

If you want, I can add a short README in the front-end project explaining the RegistrationForm changes and the payload shape expected by the backend.

---
Generated on: 2025-10-19
