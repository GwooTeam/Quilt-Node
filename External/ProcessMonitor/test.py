# CPU를 많이 사용하는 간단한 예시 코드
import math

def calculate_pi(num_iterations):
    pi = 0.0
    for i in range(num_iterations):
        sign = (-1) ** i
        term = 1 / (2 * i + 1)
        pi += sign * term

    return pi * 4

# CPU 사용량을 높이기 위해 반복 횟수 크게 설정
num_iterations = 100000000

# calculate_pi 함수를 호출하여 파이 값 계산
result = calculate_pi(num_iterations)
print(f"계산된 파이 값: {result}")
