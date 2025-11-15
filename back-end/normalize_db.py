import os
import re
import json

backend = os.path.dirname(__file__)
import sys
if backend not in sys.path:
    sys.path.insert(0, backend)

from database import SessionLocal, engine
import models

def normalize():
    db = SessionLocal()
    try:
        # 1) Convert empty-string alternateNumber to NULL
        from sqlalchemy import text
        db.execute(text("UPDATE appointments SET \"alternateNumber\" = NULL WHERE \"alternateNumber\" = ''"))
        # 2) Optionally coerce mobile strings that are pure digits to integers (store as text still but numeric)
        rows = db.execute(text("SELECT id, mobile FROM appointments")).fetchall()
        for r in rows:
            aid, mobile = r
            if mobile is None:
                continue
            if isinstance(mobile, str) and re.fullmatch(r"\d+", mobile):
                # numeric-only strings are fine
                continue
            else:
                # if mobile is empty string, set to NULL
                if mobile == '':
                    db.execute(text("UPDATE appointments SET mobile = NULL WHERE id = :id"), {'id': aid})

        db.commit()
        print('Normalization complete')
    finally:
        db.close()

def test_endpoints():
    # run FastAPI app in-process and call endpoints using TestClient
    import importlib
    import time
    from fastapi.testclient import TestClient

    root = os.path.dirname(backend)
    if backend not in sys.path:
        sys.path.insert(0, backend)

    mod = importlib.import_module('main')
    app = mod.app
    client = TestClient(app)

    results = {}
    for ep in ['/appointments/', '/patients/']:
        try:
            r = client.get(ep)
            results[ep] = {'status': r.status_code}
            try:
                results[ep]['body'] = r.json()
            except Exception:
                results[ep]['body'] = r.text
        except Exception as e:
            results[ep] = {'error': str(e)}

    # write results for inspection
    with open(os.path.join(backend, 'normalize_test_results.json'), 'w', encoding='utf-8') as f:
        json.dump(results, f, default=str, indent=2)

    print('Endpoint test results written to normalize_test_results.json')


if __name__ == '__main__':
    normalize()
    test_endpoints()
