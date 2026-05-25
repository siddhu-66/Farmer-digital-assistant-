import requests
import json

url = "http://localhost:5001/predict"
payload = {
    "cropName": "Wheat",
    "moisture": 14.5,
    "size": "Medium",
    "colorScore": 8,
    "freshnessDays": 3,
    "damagePercent": 2.5,
    "marketDemand": "High",
    "marketPrice": 2200
}

response = requests.post(url, json=payload)
print("Status Code:", response.status_code)
print("Response:", json.dumps(response.json(), indent=2))
