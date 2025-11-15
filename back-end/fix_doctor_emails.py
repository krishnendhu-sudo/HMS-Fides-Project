import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), 'hospital.db')
if not os.path.exists(db_path):
    print('DB not found at', db_path)
    raise SystemExit(1)

conn = sqlite3.connect(db_path)
cur = conn.cursor()
try:
    cur.execute("UPDATE doctors SET email = replace(email, '@demo.test', '@example.com') WHERE email LIKE '%@demo.test'")
    conn.commit()
    print('Updated doctor emails, changes:', conn.total_changes)
except Exception as e:
    print('Error updating:', e)
finally:
    conn.close()
