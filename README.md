# Quilt-Node


<details>
<summary>Git Convention</summary>

### Issue
* 이슈 템플릿을 사용하여 작성한다.
* 작업 완료된 이슈는 작업 완료(머지) 후 닫는다.

### Branch
* `main`, `develop`, `hotfix`, `feature` 브랜치를 사용한다
* `main`은 배포를 위한 브랜치이다. main에서는 배포 버전만을 다룬다. `main`에는 `develop`, `Hotfix`만 머지할 수 있다.
* `develop`은 다음 출시 버전을 개발하는 브랜치이다. 일반적인 작업은 `develop`에서 `feature`브랜치를 만들어 개발한다.
* `hotfix`는 `main`의 배포 버전에 문제가 있을 경우 급한 수정을 위해 사용한다.
* `feature`는 새로운 기능 개발 및 버그 수정이 필요할 때마다 `develop` 브랜치로부터 분기한다. 브랜치명은 `feat/{기능요약}` 규칙을 따른다.
  * 예시: feat/dockerfileSpring, bug/pysparkImage
  * 사용한 `feature`브랜치는 머지 후 리모트에서 삭제한다.

### Commit
* `작업태그` `[#이슈번호]` `Commit 내용`
* 예시: Feat[#6] Node 간 통신 개발

|*작업태그*|*내용*|
|:---|:---|
|**Feat**|새로운 기능 추가 / 일부 코드 추가 / 일부 코드 수정(리팩토링과 구분) / 디자인 요소 수정|
|**Fix**|버그 수정|
|**!HOTFIX**|급한 버그 수정|
|**Docs**|문서 수정|
|**Test**|테스트 코드 추가/삭제|
|**Refactor**|코드 리팩토링| 
|**Comment**|주석 추가 및 변경|
|**Style**|코드 의미에 영향을 주지 않는 변경사항(코드 포맷팅, 오타 수정, 변수명 변경, 에셋 추가)|
|**Chore**|빌드 부분 혹은 패키지 매니저 수정사항|
|**Rename**|파일 이름 변경 및 위치 변경|
|**Remove**|파일 삭제|
</details>
