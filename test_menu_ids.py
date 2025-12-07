import requests

try:
    res = requests.get('http://127.0.0.1:5000/api/menu')
    items = res.json()
    ids = [i['id'] for i in items]
    print(f"Total items: {len(items)}")
    print(f"IDs: {ids}")
    if len(ids) != len(set(ids)):
        print("DUPLICATE IDS FOUND!")
    else:
        print("IDs are unique.")
except Exception as e:
    print(e)
