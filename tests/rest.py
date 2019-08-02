import requests
import json
from config import ip
from source import username, password

header = {'Content-Type': 'application/json', 'Vary': 'accept'}
authentification = (username, password)
api_url = f"http://{ip}/api/v2.0"


def get(testpath):
    getit = requests.get(
        api_url + testpath,
        headers=header,
        auth=authentification
    )
    return getit


def post(testpath, payload=None):
    postit = requests.post(
        api_url + testpath,
        headers=header,
        auth=authentification,
        data=json.dumps(payload)
    )
    return postit


def put(testpath, payload):
    putit = requests.put(
        api_url + testpath,
        headers=header,
        auth=authentification,
        data=json.dumps(payload)
    )
    return putit


def delete(testpath, payload=None):
    deleteit = requests.delete(
        api_url + testpath,
        headers=header,
        auth=authentification,
        data=json.dumps(payload) if payload else None
    )
    return deleteit
