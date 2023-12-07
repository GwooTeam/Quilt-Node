#모듈 개발 규칙
1. 각 모듈의 엔트리지점이 담긴 파일 이름을 가능하면 `main.*`로 짓는다.
   * 만약 다른이름으로 한다면 꼭 2.i에 기입한다.
2. 일렉트론 개발자가 해당 모듈을 운용할 수 있도록 다음 사항을 모듈 최상단 폴더의 `TO_ELECTRON.md`에 기입한다.
    1. 엔트리파일 및 엔트리함수
    2. 모듈 운용방법
    3. Input
    4. Output
    5. 생명주기(별도프로세스? 클래스? 일회용?)
3. 만약 모듈의 컴파일이 필요하다면 해당 모듈 폴더의 `build/`에 넣는다.

[상위파일로](/CONTRIBUTING.md)