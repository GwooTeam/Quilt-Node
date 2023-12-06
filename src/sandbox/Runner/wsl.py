from config import *
import subprocess
def excute_at_WSL_and_return(cmd:str, distro=SANDBOX_GATEWAY)->str:
    cmd_full = ["wsl", "-d", distro] + cmd.split()
    output_byte = subprocess.check_output(cmd_full, shell=True, timeout=TIME)
    return output_byte.decode(encoding="ascii")