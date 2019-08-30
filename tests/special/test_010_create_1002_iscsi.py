
import pytest
import sys
import os
cwd = str(os.getcwd())
sys.path.append(cwd)
from rest import post
from source import pool1

dataset_list = [f'dataset {x}' for x in range(1002)]

targets = [f'target{x}' for x in range(1002)]

targetextents = [x for x in range(1, 1003)]


def test_01_Add_iSCSI_initiator():
    payload = {
        'tag': 0,
    }
    results = post("/iscsi/initiator/", payload)
    assert isinstance(results.json(), dict), results.text


def test_02_Add_ISCSI_portal():
    payload = {
        'listen': [
            {
                'ip': '0.0.0.0',
                'port': 3620
            }
        ]
    }
    results = post("/iscsi/portal/", payload)
    assert isinstance(results.json(), dict), results.text


@pytest.mark.parametrize('target', targets)
def test_03_Add_ISCSI_target(target):
    payload = {
        'name': target,
        'groups': [
            {'portal': 1}
        ]
    }
    results = post("/iscsi/target/", payload)
    assert results.status_code == 200, results.text
    assert isinstance(results.json(), dict), results.text


@pytest.mark.parametrize('dataset', dataset_list)
def test_04_Add_ISCSI_extent(dataset):
    payload = {
        "type": "FILE",
        'name': f'extent {dataset.split()[1]}',
        'filesize': 53687,
        'path': f'/mnt/{pool1}/{dataset}/test'
    }
    results = post("/iscsi/extent/", payload)
    assert isinstance(results.json(), dict), results.text


@pytest.mark.parametrize('targetextent', targetextents)
def test_05_Associate_ISCSI_target(targetextent):
    payload = {
        'target': targetextent,
        'lunid': targetextent,
        'extent': targetextent
    }
    results = post("/iscsi/targetextent/", payload)
    assert results.status_code == 200, results.text
    assert isinstance(results.json(), dict), results.text
