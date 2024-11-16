from dotenv import load_dotenv
import os
import requests
import datetime

load_dotenv()   

Nillion_APP_ID =  os.getenv('Nillion_APP_ID')
Nillion_USER_SEED = os.getenv('Nillion_USER_SEED')
Nillion_API_BASE = os.getenv('Nillion_API_BASE')

async def calculate_score(message):
    result_score = score_response(message)
    secret_name=f'{datetime.date.today()}_score'
    storeResult2 = requests.post(
    f'{Nillion_API_BASE}/api/apps/{Nillion_APP_ID}/secrets',
    headers={'Content-Type': 'application/json'},
    json={
        'secret': {
            'nillion_seed': Nillion_USER_SEED,
            'secret_value': result_score,
            'secret_name': secret_name
        },
        'permissions': {
            'retrieve': [],
            'update': [],
            'delete': [],
            'compute': {}
        }
    }
    ).json()
    print('Second secret stored at:', storeResult2)
