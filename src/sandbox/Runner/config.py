TIME = 40
SANDBOX_GATEWAY_DIRNAME = "sandbox_gateway"

# 샌드박스를 docker형식으로 돌릴때 wsl 배포판 이름
SANDBOX_GATEWAY = "quilt-sandbox-gateway"

PULL_MODE = False
"""
샌드박스 이미지를 게이트웨이에 가져오는 방법\n
`True` : 인터넷을 이용해서 dockerhub에서 가져옴(권장되지않음. 게이트웨이에 docker로그인을 해놓아야하기때문)\n
`False` : WSL배포판 이미지파일 내부에 포함
"""

#샌드박스 이미지 이름
SANDBOX_IMAGE_NAME = "ubuntu"
#샌드박스 컨테이너상 이름
SANDBOX_NAME = "sandbox"
#샌드박스(도커 컨테이너) 실행 cmd
SANDBOX_RUN_CMD = f"docker run --runtime=runsc -itd -p 8080:80 --rm --name {SANDBOX_NAME} -d {SANDBOX_IMAGE_NAME}"

#ERROR MESSEGE
TIMEOUT_MSG = "환경세팅이 지정된 시간이상 걸려서 취소했습니다"
SETTINGERROR_MSG = "환경세팅에 실패했습니다"
RUNNINGSANDBOX_MSG = "샌드박스 run을 실패했습니다"