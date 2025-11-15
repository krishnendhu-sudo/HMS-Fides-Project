import requests, json
for path in ['/doctors/','/appointments/']:
    try:
        r=requests.get('http://127.0.0.1:8000'+path, timeout=5)
        print(path, r.status_code)
        try:
            data=r.json()
            print('len/list?:', type(data), len(data) if isinstance(data, list) else list(data.keys())[:5])
            if isinstance(data, list) and data:
                print('sample keys:', list(data[0].keys())[:10])
        except Exception as ex:
            print('json parse failed:', ex)
    except Exception as e:
        print(path, 'error', e)
