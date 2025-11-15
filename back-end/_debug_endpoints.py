import traceback
from database import SessionLocal
import crud


def run():
    db = SessionLocal()
    try:
        print('Calling list_doctors...')
        try:
            docs = crud.list_doctors(db)
            print('list_doctors returned', len(docs))
            if docs:
                print('sample doctor keys:', [k for k in docs[0].__dict__.keys() if not k.startswith('_')][:10])
        except Exception:
            print('Exception in list_doctors:')
            traceback.print_exc()

        print('\nCalling get_appointments...')
        try:
            appts = crud.get_appointments(db)
            print('get_appointments returned', len(appts))
            if appts:
                print('sample appointment keys:', [k for k in appts[0].__dict__.keys() if not k.startswith('_')][:20])
        except Exception:
            print('Exception in get_appointments:')
            traceback.print_exc()

    finally:
        db.close()

if __name__ == '__main__':
    run()
