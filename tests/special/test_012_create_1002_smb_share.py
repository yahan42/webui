
import pytest
import sys
import os
cwd = str(os.getcwd())
sys.path.append(cwd)
from rest import post, put
from source import pool1

dataset_list = [f'dataset {x}' for x in range(1002)]


def test_01_setting_auxilary_parameters_for_mount_smbfs():
    toload = "lanman auth = yes\nntlm auth = yes \nraw NTLMv2 auth = yes"
    payload = {"smb_options": toload}
    results = put("/smb/", payload)
    assert results.status_code == 200, results.text


@pytest.mark.parametrize('dataset', dataset_list)
def test_02_creating_a_smb_share_with_(dataset):
    payload = {"comment": "My Test SMB Share",
               "path": f'/tmp/{pool1}/{dataset}',
               "name": f'smb share {dataset.split()[1]}',
               "guestok": True,
               "vfsobjects": ["streams_xattr"]}
    results = post("/sharing/smb/", payload)
    assert results.status_code == 200, results.text
