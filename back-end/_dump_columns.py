import sqlite3, json
conn=sqlite3.connect('back-end/hospital.db')
cur=conn.cursor()
cur.execute("PRAGMA table_info('appointments')")
cols=cur.fetchall()
print(json.dumps(cols, indent=2, default=str))
conn.close()
