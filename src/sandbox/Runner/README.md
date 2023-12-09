# 모듈 Readme

## 샌드박스 형태
- 샌드박스는 gVisor를 이용한 도커 컨테이너이다
- 아직 윈도우 환경에서만 지원하며 WSL상의 quilt-sandbox-gateway라는 리눅스 배포판이 Running되고, 그 안에 docker로 컨테이너에 위치하게 된다

## 실행방법
1. 드라이브 자료공유용 폴더에 quilt-sandbox-gateway를 찾아 다운(1.77GB)받고 해당 readme의 폴더에 복사한다.
2. 해당 폴더에 main.py를 run하면 된다.

## 개발형태

상태머신; Sandbox runner는 MSA형태로 실행시킬 것이기에, 현재 상태를 반환할수있도록 하기 위해 선택했다.

## 개발내용

main.py가 실행되면, Host의 OS를 판단해 윈도우가 아니면 Error를 뜨게함

윈도우인 경우 WSL이 설치가 안되어있으면 Error를 뜨게함

WSL이 설치가 되어있을 때, 이미 구성되어있는 WSL배포판이미지를 이용해 Host의 WSL에 새로운 배포판이 설치가 된다. (이름은 config.py의 SANDBOX_GATEWAY 기본값은 quilt-sandbox-gateway)

그 안에 샌드박스 이미지(이름은 config.py의 SANDBOX_IMAGE_NAME)를 이용해 Host와의 데이터통신을 위한 포트 및 gVisor런타임을 사용하도록 run, run하는 코드는 config.py의 `SANDBOX_RUN_CMD`에 존재

여러 설정 중 config.py의 TIME의 시간이 지나면 타임초과 Error뜨게 함.

---
[상위README페이지로](/README.md)