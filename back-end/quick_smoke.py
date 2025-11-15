import subprocess
import time
import requests
import os
import signal

cwd = os.path.dirname(__file__)
# Start uvicorn in the back-end folder
log_path = os.path.join(cwd, 'uvicorn.log')
logf = open(log_path, 'wb')
proc = subprocess.Popen([
    'python', '-m', 'uvicorn', 'main:app', '--host', '127.0.0.1', '--port', '8000'
], cwd=cwd, stdout=logf, stderr=logf)
print('uvicorn pid', proc.pid)

# Wait for server to start (simple backoff)
for _ in range(10):
    try:
        r = requests.get('http://127.0.0.1:8000/')
        if r.status_code == 200:
            break
    except Exception:
        time.sleep(0.5)
else:
    print('Server did not start in time. Reading stderr:')
    try:
        err = proc.stderr.read().decode('utf-8', errors='ignore')
        print(err)
    except Exception as e:
        print('Could not read stderr:', e)
    proc.terminate()
    proc.wait()
    raise SystemExit(1)

# Hit /doctors/ endpoint
try:
    r = requests.get('http://127.0.0.1:8000/doctors/', timeout=10)
    print('GET /doctors/ ->', r.status_code)
    try:
        print(r.json())
    except Exception:
        print(r.text[:400])
except Exception as e:
    print('Request failed:', e)

# Stop server
proc.terminate()
try:
    proc.wait(timeout=5)
except Exception:
    proc.kill()
print('uvicorn stopped')
try:
    logf.close()
    with open(log_path, 'r', encoding='utf-8', errors='ignore') as f:
        data = f.read()
        print('\n--- uvicorn.log tail ---')
        print(data[-4000:])
except Exception as e:
    print('Could not read log file:', e)
