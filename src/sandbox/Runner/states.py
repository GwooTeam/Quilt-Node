import asyncio
import sys
from config import *
import os
from abc import *

def print_status_and_error(self, error_msg):
    print(f"[{self.__class__.__name__}] : {error_msg}", file=sys.stderr)

class State(metaclass=ABCMeta):
    @abstractmethod
    async def run(self):
        pass

class InitialState(State):
    async def run(self, machine):
        from stateMachine import SettingStatus
        machine.status_pre_set = machine.check_pre_set()
        if machine.status_pre_set == SettingStatus.WELL_SETTED:
            machine.state = SettingCompleteState()
        elif machine.status_pre_set == SettingStatus.NOT_SUPPORTED_OS:
            machine.state = ErrorState(ValueError("Not supported OS."))
        elif machine.status_pre_set == SettingStatus.NOT_WSL:
            machine.state = ErrorState(ValueError("WSL is not installed."))
        elif machine.status_pre_set == SettingStatus.NOT_SETTED_SANDBOX_GATEWAY:
            #WSL배포판 커스텀 이미지가 폴더에 없으면 에러
            current_pwd = os.path.dirname(os.path.abspath(__file__))
            if not os.path.exists(os.path.join(current_pwd, SANDBOX_GATEWAY)):
                machine.state = ErrorState(ValueError("WSL image is not found"))
            else:
                machine.state = SettingState()
        elif machine.status_pre_set == SettingStatus.NOT_RUNNING_SANDBOX_GATEWAY:
            machine.state = SettingState()
        else:
            machine.state = ErrorState(ValueError("Unkown Error"))
class SettingState(State):
    async def run(self, machine):
        try:
            setting_task = asyncio.create_task(machine.setting())
            timer_task = asyncio.create_task(asyncio.sleep(machine.timer))
            done, pending = await asyncio.wait(
                {setting_task, timer_task},
                return_when=asyncio.FIRST_COMPLETED
            )
            if setting_task in done:
                if setting_task.result():
                    #세팅 성공
                    machine.state = SettingCompleteState()
                    machine.is_pre_set = True
                else:
                    #세팅 실패
                    print_status_and_error(self, SETTINGERROR_MSG)
                    machine.state = ErrorState()
            elif timer_task in done:
                setting_task.cancel()
                print(TIMEOUT_MSG, file=sys.stderr)
                machine.state = InitialState()
            else:
                raise Exception("Logic bug")
        except Exception as e:
            print_status_and_error(self, e)
            machine.state = InitialState()

class SettingCompleteState(State):
    async def run(self, machine):
        machine.is_sandbox_on = await machine.check_sandbox_on()
        if machine.is_sandbox_on:
            #Sandbox Runner인데 이미 켜져있다는 것은 로직에러라는 말이다
            machine.state = ErrorState(ValueError("Logic Error"))
        else:
            machine.state = RunningSandboxState()

class RunningSandboxState(State):
    async def run(self, machine):
        #샌드박스 실행
        sandbox_run_task = asyncio.create_task(machine.running_sandbox())
        timer_task = asyncio.create_task(asyncio.sleep(TIME))
        done, pending = await asyncio.wait(
            {sandbox_run_task, timer_task},
            return_when=asyncio.FIRST_COMPLETED
        )
        if sandbox_run_task in done:
            if sandbox_run_task.result():
                #샌드박스 실행 성공
                machine.state = EndState()
            else:
                #샌드박스 실행 실패
                print_status_and_error(self, RUNNINGSANDBOX_MSG)
                machine.state = SettingCompleteState()
        elif timer_task in done:
            #타임오버
            print_status_and_error(self, TIMEOUT_MSG)
            machine.state = SettingCompleteState()
        else:
            raise Exception("Logic bug")

class ErrorState(State):
    """
    ErrorState로 가는 Error는 다음과 같다
    1. 샌드박스가 이미 켜져있는데 SandboxRunner가 실행되어있음
    2. WSL설치 안되어있음
    3. 실행환경이 Windows가 아님
    """
    def __init__(self, error:ValueError) -> None:
        super().__init__()
        self.Error = error
    async def run(self, machine):
        print(self.Error)

class EndState(State):
    #성공적으로 끝났음을 시사하는 상태
    async def run(self, machine):
        pass