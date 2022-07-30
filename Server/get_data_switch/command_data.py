from pathlib import Path
import subprocess

import data_extraction

def get_data_from_logfile(logs_file_path):
    # logs_file_path = Path(__file__).parent / 'logs.txt'
    unique_identifier = 'unique.................................................................................unique'

    logs = logs_file_path.read_text()

    # lOGS CAN BE OBTAINED FROM EXECUTING EASYPY COMMAND

    # easypy_cmd = 'easypy sample2.job -testbed_file sample2.yaml'
    # logs = subprocess.check_output(easypy_cmd.split())


    required_logs = logs.split(unique_identifier)[1]
    del logs
    # with open('test.txt', 'w') as t:
    #     print(required_logs, file=t)


    def get_between(logs):
        results = []
        record = False
        data_between = ''
        for line in logs.split('\n'):
            if "Metaluna with via 'a': executing command" in line:
                record = True
            elif line == 'Switch#':
                record = False
                results.append(data_between)
                data_between = ''
            elif record:
                data_between += line + '\n'

        return results


    def get_commands_and_output(command_logs):
        data = get_between(command_logs)
        dct = {}
        for x in data:
            [cmd, output] = x.split('\n', maxsplit=1)
            dct[cmd] = output
        return dct

    # with open('test2.json', 'w') as t:
    #     print(get_commands_and_output(required_logs), file=t)


    commands_and_output = get_commands_and_output(required_logs)
    commands_executed = list(commands_and_output.keys())

    status = data_extraction.extract_status(
        commands_and_output[commands_executed[0]])
    d = {} # Required
    d['status'] = int(status)

    d1 = list(filter(lambda x: 'SigDetect' in x,
            commands_and_output[commands_executed[1]].split('\n')))
    d2 = list(filter(lambda x: 'CurrTxFault' in x,
            commands_and_output[commands_executed[2]].split('\n')))
    keys_required = [
        'hCurrTxFault', 'hCurrRxFault',
        'lCurrTxFault', 'lCurrRxFault',
        'hSigDetect', 'hDspLock',
        'lSigDetect', 'lDspLock',
    ]
    _d = data_extraction.extract_all_key_value_pairs('\n'.join(d1+d2))
    d.update(data_extraction.get_specific_data_from_dict(keys_required, _d))

    diagnostic_data = commands_and_output[commands_executed[3]]
    d.update(data_extraction.extract_all_key_value_pairs(
        diagnostic_data, '\n', ': '))

    # RX_FW_LOCK etc.
    npu_slot_output = ""
    for cmd in commands_executed[4:]:
        npu_slot_output += commands_and_output[cmd]
    npu_slot_output = npu_slot_output.replace(" ", "")
    npu_slot_output = npu_slot_output.replace('"', "")
    npu_slot_output = npu_slot_output.replace(',', '')
    d.update(data_extraction.extract_all_key_value_pairs(
        npu_slot_output, "\n", ":"))

    return d



def write_headers(d, filepath='test.csv'):
    with open(filepath, 'w') as t:
        # Writing Headers
        s = ""
        for k, v in d.items():
            if type(v) == list:
                for i in range(len(v)):
                    s += (k + f'_{i}' + ',')
            else:
                s += (k + ',')
        t.write(s[:-1])
        t.write('\n')


def write_values(d, filepath='test.csv'):
    with open(filepath, 'a') as t:
        s = ""
        for _, v in d.items():
            if type(v) == list:
                for x in v:
                    s += (str(x) + ',')
            else:
                s += (str(v) + ',')
        t.write(s[:-1])
        t.write('\n')

# write_headers(d)
# write_values(d)

output_dir_path = Path(__file__).parent / "outputs"
wrote_headers = False
for p in output_dir_path.iterdir():
    d = get_data_from_logfile(p)
    if not wrote_headers:
        write_headers(d)
        wrote_headers = True
    write_values(d)
