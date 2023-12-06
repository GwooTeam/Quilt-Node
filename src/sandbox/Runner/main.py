import asyncio
from stateMachine import StateMachine

# 주문 처리 시작
machine = StateMachine()
asyncio.run(machine.run())
