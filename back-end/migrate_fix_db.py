import os
import sqlite3


def migrate():
    # try project root then back-end folder
    candidates = [
        os.path.join(os.path.dirname(os.path.dirname(__file__)), "hospital.db"),
        os.path.join(os.path.dirname(__file__), "hospital.db"),
        os.path.join(os.getcwd(), "hospital.db"),
    ]
    db_path = None
    for c in candidates:
        if os.path.exists(c):
            db_path = c
            break
    if not db_path:
        print("Database file not found in expected locations:", candidates)
        return
    print('Using DB at', db_path)

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    try:
        # Check columns in appointments
        cur.execute("PRAGMA table_info('appointments')")
        cols = [row[1] for row in cur.fetchall()]
        if 'age' not in cols:
            print("Adding 'age' column to appointments...")
            cur.execute("ALTER TABLE appointments ADD COLUMN age INTEGER NOT NULL DEFAULT 0")
            conn.commit()
            print("Added 'age' column.")
        else:
            print("'age' column already present.")
        # Ensure doctor_id column exists (some older DBs may lack it)
        if 'doctor_id' not in cols:
            print("Adding 'doctor_id' column to appointments...")
            try:
                cur.execute("ALTER TABLE appointments ADD COLUMN doctor_id INTEGER")
                conn.commit()
                print("Added 'doctor_id' column.")
            except Exception as e:
                print("Failed to add doctor_id column:", e)
        else:
            print("'doctor_id' column already present.")

        # Update any .test emails to .example.com for safety (pydantic email validation)
        print("Updating emails with domain @demo.test to @example.com in users and companies...")
        cur.execute("UPDATE users SET email = replace(email, '@demo.test', '@example.com') WHERE email LIKE '%@demo.test'")
        cur.execute("UPDATE companies SET email = replace(email, '@demohospital.test', '@example.com') WHERE email LIKE '%@demohospital.test'")
        conn.commit()
        print("Email updates applied. Total DB changes:", conn.total_changes)
    except Exception as e:
        print("Migration failed:", e)
    finally:
        conn.close()


if __name__ == '__main__':
    migrate()
