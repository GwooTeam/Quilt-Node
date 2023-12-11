### 엔트리 파일 및 엔트리 함수
- main.js

### 모듈 운용방법
- 실행하기 위해선 같은 폴더에 config.json이 필요하다. 구조는 아래와 같다. 위의 두 변수만 바꿔주면 된다.
<pre>{
    "SERVER_DOMAIN" : <서버 도메인>,
    "SERVER_PORT" : <서버 포트>,
    "SERVER_URL_PATH": {
        "requestMacKey" : "/node/{id}/requestMacKey",
        "getServerPubKey" : "/node/requestSvrPubK",
        "enrollNonce": "/node/{id}/generateNonce",
        "verify": "/node/{id}/verify"
    }</pre>
- main.js를 spawn하면 된다


### Input
- $node main.js <node_id> <node_public_ip>
- 단, <node_id>을 안적으면 `1`로, <node_public_ip>를 안적으면 `1.2.3.4`로 자동 설정되고 실행된다

### Output
-  exit code 0 : 정상 실행(해당 노드는 검증)
-  exit code 1 : wsl상의 암호모듈 에러
-  exit code 2 : 메인서버와의 통신오류

### 생명주기
- 서버와의 인증을 주고받고 끝나므로 바로 길어봤자 5초만에 끝남

---
- [모듈README가기](./README.md)
- [TO_ELECTRON 작성참고](/docs/MODULE_CONVENTION.md)