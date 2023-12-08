# Quilt-Node 개발 규칙
개발자가 알아야할 정보들을 모아놓음.
## 링크
[Git Convention](./docs/GIT_CONVENTION.md)  
[Module Convention](./docs/MODULE_CONVENTION.md)  

## 폴더구조
.  
├── crypto _`←암호모듈 관련`_  
│   ├── **dmodule**  
│   └── **kmodule**  
├── docs _`←문서관련`_  
├── resource _`←GUI(html, css 등 단, js는 electron/renderer에 있어야함)`_  
├── src _`←소스코드`_  
│   ├── communication _`←노드간 데이터통신관련 모듈들`_  
│   │   ├── **dataDeliver**  
│   │   └── tgrid  
│   ├── electron _`←GUI 및 메인플로우담당`_  
│   │   ├── renderer _`←GUI(js) 및 GUI 렌더러`_  
│   ├── manage _`←노드 관리 및 인증관련 모듈들`_  
│   │   ├── **interNodeAuth**  
│   │   ├── **nodeAuth**  
│   │   └── **resouceLogging**  
│   └── sandbox _`←샌드박스 관련 모듈들`_  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── **Runner**  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── **monitor**  
└── template _`←그리드컴퓨팅 지원 템플릿`_  

## 모듈
|이름|설명|Readme|To_electron|
|:--|:--|:--|:--|
|**dmodule**||[클릭](/crypto/dmodule/README.md)|[클릭](/crypto/dmodule/TO_ELECTRON.md)|
|**kmodule**||[클릭](/crypto/kmodule/README.md)|[클릭](/crypto/kmodule/TO_ELECTRON.md)|
|**dataDeliver**|상대노드의 샌드박스(P2P IP)에게 데이터 암호화 후 송신 및 수신 후 데이터 복호화|[클릭](/src/communication/dataDeliver/README.md)|[클릭](/src/communication/dataDeliver/TO_ELECTRON.md)|
|**interNodeAuth**|주어진 P2P IP를 이용해 상대노드가 서비스상 유효한지 검증|[클릭](/src/manage/interNodeAuth/README.md)|[클릭](/src/manage/interNodeAuth/TO_ELECTRON.md)|
|**resouceLogging**|과금요소를 책정하기 위한 데이터(ex. 샌드박스 CPU사용률, 송수신데이터량 등)을 로깅|[클릭](/src/manage/resouceLogging/README.md)|[클릭](/src/manage/resouceLogging/TO_ELECTRON.md)|
|**sandboxRunner**|보안샌드박스를 실행|[클릭](/src/sandbox/Runner/README.md)|[클릭](/src/sandbox/Runner/TO_ELECTRON.md)|
|**sandboxMonitor**|보안샌드박스가 HOSTPC를 접근해는 행위 및 사용자가 샌드박스를 접근하는 행위 감지 및 집행|[클릭](/src/sandbox/monitor/README.md)|[클릭](/src/sandbox/monitor/TO_ELECTRON.md)|

## 참고
* 암호화 모듈 관련 Docs -> https://s-organization-9.gitbook.io/quilt-pqc-module-api-docs/
