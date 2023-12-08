# Quilt-Node
그리드 컴퓨팅 보안 인프라 구축

## 개발관련
[CONTRIBUTING.md](/CONTRIBUTING.md)
## 폴더구조
.  
├── crypto _`←암호모듈 관련`_  
│   ├── [dmodule](/crypto/dmodule/README.md)  
│   └── [kmodule](/crypto/kmodule/README.md)  
├── docs _`←문서관련`_  
├── resource _`←GUI(html, css 등 단, js는 electron/renderer에 있어야함)`_  
├── src _`←소스코드`_  
│   ├── communication _`←노드간 데이터통신관련 모듈들`_  
│   │   ├── [dataDeliver](/src/communication/dataDeliver/README.md)  
│   │   └── tgrid  
│   ├── electron _`←GUI 및 메인플로우담당`_  
│   │   ├── renderer _`←GUI(js) 및 GUI 렌더러`_  
│   ├── manage _`←노드 관리 및 인증관련 모듈들`_  
│   │   ├── [interNodeAuth](/src/manage/interNodeAuth/README.md)  
│   │   ├── [nodeAuth](/src/manage/nodeAuth/README.md)  
│   │   └── [resouceLogging](/src/manage/resouceLogging/README.md)  
│   └── sandbox _`←샌드박스 관련 모듈들`_  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── [Runner](/src/sandbox/Runner/README.md)  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── [monitor](/src/sandbox/monitor/README.md)  
└── template _`←그리드컴퓨팅 지원 템플릿`_  