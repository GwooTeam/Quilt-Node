from states import ErrorState, InitialState, EndState
from config import *
import platform
import subprocess
import os
from enum import Enum
from wsl import *

class SettingStatus(Enum):
    WELL_SETTED = 0 #SettingCompleteState
    NOT_SUPPORTED_OS = 1 #ErrorState
    NOT_WSL = 2 #ErrorState
    NOT_SETTED_SANDBOX_GATEWAY = 3 #SettingState
    NOT_RUNNING_SANDBOX_GATEWAY = 4 #SettingState
    UNKNOWN_ERROR = 5 #ErrorState

class StateMachine:
    def __init__(self):
        self.state = InitialState()
        self.status_pre_set = None
        self.is_sandbox_on = None
        self.timer = TIME

    # 샌드박스를 run할수있는 환경이 구성되어있는지 확인하는 함수
    def check_pre_set(self):
        #1. OS확인
        if platform.system() != "Windows":
            #윈도우가 아닐시엔 아직 미지원
            return SettingStatus.NOT_SUPPORTED_OS
        #2. WSL확인
        try:
            result = subprocess.run(["wsl", "--help"], stdout=subprocess.PIPE)
        except Exception as e:
            return SettingStatus.NOT_WSL
        #3. 샌드박스 게이트웨이인 WSL배포판 설치되어있는지 여부
        try:
            result = subprocess.run(["wsl", "-l", "-v"], stdout=subprocess.PIPE)
        except Exception as e:
            return SettingStatus.UNKNOWN_ERROR
        #WSL의 출력은 기본 utf16이다
        output_stdout = result.stdout.decode(encoding="utf-16")
        if SANDBOX_GATEWAY not in output_stdout:
            return SettingStatus.NOT_SETTED_SANDBOX_GATEWAY
        #4. 샌드박스 게이트웨이가 Running중인지에 대한 여부
        for line in output_stdout.splitlines():
            if SANDBOX_GATEWAY in line:
                target_line = line
                break
        if "Running" in target_line.split():
            return SettingStatus.WELL_SETTED
        return SettingStatus.NOT_RUNNING_SANDBOX_GATEWAY
        
    #현재 샌드박스가 열려있는지 확인하고 불리언을 리턴하는 함수
    async def check_sandbox_on(self):
        try:
            output = excute_at_WSL_and_return(f"docker ps -f name=${SANDBOX_NAME}")
            return (SANDBOX_NAME in output)
        except subprocess.CalledProcessError:
            return False

    #샌드박스 초기 환경세팅을 하는 함수
    async def setting(self):
        if self.status_pre_set == SettingStatus.NOT_SETTED_SANDBOX_GATEWAY:
            #WSL 배포판 등록 필요
            pwd = os.path.abspath(os.path.dirname(__file__))
            os.makedirs(os.path.join(pwd, SANDBOX_GATEWAY_DIRNAME), exist_ok=True)
            result = subprocess.run(["wsl", "--import", SANDBOX_GATEWAY, os.path.join(pwd, SANDBOX_GATEWAY_DIRNAME), os.path.join(pwd, SANDBOX_GATEWAY)])
            if result.returncode != 0:
                return False
        #WSL 배포판 run 필요
        result = subprocess.run(["wsl", "-d", SANDBOX_GATEWAY], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
        if result.returncode != 0:
            return False
        return True

    #이 함수는 샌드박스를 run해주는 함수
    async def running_sandbox(self)->bool:
        try:
            output = excute_at_WSL_and_return(SANDBOX_RUN_CMD, SANDBOX_GATEWAY)
            print(output)
        except subprocess.CalledProcessError as e:
            #exit코드가 0이 아니면 이 오류가 나온다
            return False
        return True
    
    async def run(self):
        is_normal_exit = True
        while True:
            print(f"[State] {self.state.__class__.__name__}")
            await self.state.run(self)
            if isinstance(self.state, EndState):
                break
            elif isinstance(self.state, ErrorState):
                is_normal_exit = False
                break
        print(f"[State] {self.state.__class__.__name__}")
        await self.state.run(self)    
        print(f"[LOG] Sandbox Runner is shutdowned.")
        if is_normal_exit:
            os._exit(0)
        else:
            os._exit(1)
