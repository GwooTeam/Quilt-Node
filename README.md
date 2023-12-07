# Quilt-Node
그리드 컴퓨팅 보안 인프라 구축

## 개발관련
[CONTRIBUTING.md](/CONTRIBUTING.md)
## 폴더구조
.  
├── crypto _←암호모듈 관련_  
│   ├── [dmodule](/crypto/dmodule/README.md)  
│   └── [kmodule](/crypto/kmodule/README.md)  
├── docs _←문서관련_  
├── src _←소스코드_  
│   ├── communication _←노드간 데이터통신관련 모듈들_  
│   │   ├── [dataDeliver](/src/communication/dataDeliver/README.md)  
│   │   └── tgrid  
│   ├── electron _←GUI 및 메인플로우담당_  
│   │   ├── renderer _←GUI(html, css, js)_  
│   ├── manage _←노드 관리 및 인증관련 모듈들_  
│   │   ├── [interNodeAuth](/src/manage/interNodeAuth/README.md)  
│   │   ├── [nodeAuth](/src/manage/nodeAuth/README.md)  
│   │   └── [resouceLogging](/src/manage/resouceLogging/README.md)  
│   └── sandbox _←샌드박스 관련 모듈들_  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── [Runner](/src/sandbox/Runner/README.md)  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── [monitor](/src/sandbox/monitor/README.md)  
└── template _←그리드컴퓨팅 지원 템플릿_  