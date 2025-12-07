import requests

try:
    res = requests.get('http://127.0.0.1:5000/api/menu')
    print(res.status_code)
    print(res.json())
except Exception as e:
    print(e)
