import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "hospital.db"


def has_column(conn, table: str, column: str) -> bool:
    cur = conn.execute(f"PRAGMA table_info({table})")
    cols = [r[1] for r in cur.fetchall()]
    return column in cols


def main():
    print("DB:", DB_PATH)
    conn = sqlite3.connect(DB_PATH)
    changed = []

    # Ensure super_admins has address, phone columns
    if not has_column(conn, 'super_admins', 'address'):
        try:
            conn.execute("ALTER TABLE super_admins ADD COLUMN address TEXT")
            changed.append('super_admins.address')
        except Exception as e:
            print('Could not add super_admins.address:', e)

    if not has_column(conn, 'super_admins', 'phone'):
        try:
            conn.execute("ALTER TABLE super_admins ADD COLUMN phone TEXT")
            changed.append('super_admins.phone')
        except Exception as e:
            print('Could not add super_admins.phone:', e)

    # Ensure super_admins has status column
    if not has_column(conn, 'super_admins', 'status'):
        try:
            # SQLite doesn't have a native BOOLEAN type; use INTEGER
            conn.execute("ALTER TABLE super_admins ADD COLUMN status INTEGER DEFAULT 1")
            changed.append('super_admins.status')
        except Exception as e:
            print('Could not add super_admins.status:', e)

    # Ensure companies has superadmin_id
    if not has_column(conn, 'companies', 'superadmin_id'):
        try:
            conn.execute("ALTER TABLE companies ADD COLUMN superadmin_id INTEGER")
            changed.append('companies.superadmin_id')
        except Exception as e:
            print('Could not add companies.superadmin_id:', e)

    conn.commit()
    print('Changes applied:', changed)

    # Print final schema
    for t in ('super_admins', 'companies'):
        try:
            cols = [r[1] for r in conn.execute(f"PRAGMA table_info({t})").fetchall()]
            print(f"{t}:", cols)
        except Exception as e:
            print(f"{t}: missing or error: {e}")

    conn.close()


if __name__ == '__main__':
    main()
