# show interfaces hundredGigE 2/0/2 - first line
# HundredGigE2/0/2 is up - link-status - up: 1 and down: 0

# show platform  hardware iomd 2/0 ethernet_controllers phy 2 link-status
# hSigDetect:1 hDspLock:1
# lSigDetect:1 lDspLock:1

# show platform  hardware iomd 2/0 ethernet_controllers phy 2 pcs-status
# hCurrTxFault:0 hCurrRxFault:0
# lCurrTxFault:0 lCurrRxFault:0
# show platform  hardware iomd 2/0 ethernet_controllers phy 2 diagnostic-registers | i CAP
# CTLE C112GX4_CTLE_CAP1_SEL: 0x3
# CTLE C112GX4_CTLE_CAP2_SEL: 0x3
# CTLE C112GX4_CTLE_CAP1_SEL: 0x0
# CTLE C112GX4_CTLE_CAP2_SEL: 0x0
# show interfaces transceiver module 2
# Take temperature column for port-2
#
# Hu2/0/2      34.1     75.0       70.0        0.0       -5.0


# Still Need to Try after connection
# Switch#$rm hardware fed active npu slot 2 port 2 dsc_dump | i RX_FW_LOCK
# "RX_FW_LOCK": 1
# "RX_FW_LOCK": 1

# Switch#$rm hardware fed active npu slot 2 port 2 dsc_dump | i TX_FW_LOCK
# "TX_FW_LOCK": 1,
# "TX_FW_LOCK": 1,

# Switch#$rm hardware fed active npu slot 2 port 2 dsc_dump | i RX_SIG_DET
# "RX_SIG_DET": 1,
# "RX_SIG_DET": 1,

# show platform hardware fed active npu slot 2 port 2 dsc_dump | i RX_FW_LOCK
# For each RX_FW_LOCK append _0, _1.. so on
# show platform hardware fed active npu slot 2 port 2 dsc_dump | i TX_FW_LOCK
# For each TX_FW_LOCK append _0, _1.. so on
# show platform hardware fed active npu slot 2 port 2 dsc_dump | i RX_SIG_DET
# For each RX_SIG_DET  append _0, _1.. so on


def extract_status(data: str) -> bool:
    return 'line protocol is up' in data


def extract_all_key_value_pairs(data: str, split1=None, split2=":"):
    space_seperated_data = []
    if split1 is not None:
        space_seperated_data = data.split(split1)
    else:
        space_seperated_data = data.split()

    key_value_data = {}
    for kv in space_seperated_data:
        # [k, v] = ['lSigDetect', '1']
        if(not kv):
            continue
        [k, v] = kv.split(split2)
        if k in key_value_data:
            if type(key_value_data[k]) != list:
                key_value_data[k] = [key_value_data[k]]
            key_value_data[k].append(v)
        else:
            key_value_data[k] = v

    return key_value_data


def get_specific_data_from_dict(keys: list, dct: dict):
    return {k: dct.get(k) for k in keys}


def extract_temprature(temprature_output: str, port=2):
    if port < 2:
        raise Exception('Port Can\'t be less than 2')

    return temprature_output.split('\n')[port + 1].split()[1]


# status_output = 'HundredGigE2/0/2 is up'
# print(extract_status(status_output))

# data_1 = """
# hMdio:2 hLane:0 hCurr:1 hLatch:1 hSigDetect:1 hDspLock:1 h_OpMode:69
# lMdio:0 lLane:0 lCurr:0 lLatch:0 lSigDetect:1 lDspLock:0 l_OpMode:63
# """

# data_2 = """
# hMdio:2 hLane:0 hCurrTxFault:1 hCurrRxFault:0 hLatchTxFault:1 hLatchRxFault:1
# lMdio:0 lLane:0 lCurrTxFault:0 lCurrRxFault:1 lLatchTxFault:1 lLatchRxFault:1
# """
# all_key_value_data = extract_all_key_value_pairs(data_1+data_2)
# print(get_specific_data_from_dict(keys_required, all_key_value_data))


# diagnostic_data = """
# CTLE C112GX4_CTLE_CAP1_SEL: 0x3
# CTLE C112GX4_CTLE_CAP2_SEL: 0x3
# CTLE C112GX4_CTLE_CAP1_SEL: 0x0
# CTLE C112GX4_CTLE_CAP2_SEL: 0x0
# """
# print(extract_all_key_value_pairs(diagnostic_data, '\n', ': '))

# temprature_output = """...
# ...
# ...
# Hu2/0/2      34.1     75.0       70.0        0.0       -5.0
# ...
# ..."""
# print(extract_temprature(temprature_output))

# npu_slot_output = """"RX_FW_LOCK": 1
# "RX_FW_LOCK": 1
# "TX_FW_LOCK": 1,
# "TX_FW_LOCK": 1,
# "RX_SIG_DET": 1,
# "RX_SIG_DET": 1,"""
# npu_slot_output = npu_slot_output.replace(" ", "")
# npu_slot_output = npu_slot_output.replace('"', "")
# npu_slot_output = npu_slot_output.replace(',', '')
# data = extract_all_key_value_pairs(npu_slot_output, "\n", ":")

# for k, v in data.items():
#     if type(v) == list:
#         for i in range(len(v)):
#             print(k + f'_{i}')
