# Documentation Index

이 폴더는 제품 문서의 기준 위치입니다. 문서는 역할별로 나눠서 관리합니다.

## Structure

- `project/`
  - 현재 진행 중인 기준 문서
  - `plan.md`: 현재 제품/기능 방향과 우선순위
  - `history.md`: 주요 변경 이력
  - `note.md`: 운영 메모, 실행 명령, 임시 메모

- `specs/`
  - 살아 있는 사양 문서
  - `Product_Spec.md`: 제품 범위와 핵심 기능
  - `Technical_Spec.md`: 구현, 데이터, API 기준
  - `Design_Guide.md`: 디자인 규칙과 UI 원칙
  - `Design_Draft_Examples.md`: 시안 예시

- `process/`
  - 작업 절차 문서
  - `WORKFLOW.md`: 작업 전후 규칙, 문서 작성 원칙
  - `check_list.md`: 점검 항목

- `qa/`
  - QA 결과와 리포트

- `archive/`
  - 현재 기준에서 내려온 참고 문서
  - 더 이상 source of truth는 아니지만, 과거 결정과 설계를 추적할 때 사용

## Working Rules

1. 작업 시작 전에는 `doc/project/plan.md`를 먼저 확인합니다.
2. 구현 변경이 있으면 `doc/project/history.md`도 같이 갱신합니다.
3. 새로운 기준 문서는 `project/`, `specs/`, `process/`, `qa/` 중 역할에 맞는 위치에 둡니다.
4. 임시 메모나 개인용 조사 결과는 루트에 두지 말고 `doc/project/note.md` 또는 `.codex-temp/`에 둡니다.
5. 더 이상 기준이 아닌 문서는 `archive/`로 이동합니다.

## Related Folders Outside `doc/`

- `scripts/`
  - 실행 가능한 운영/디버그 스크립트
  - 동기화, 배포 보조, 점검 스크립트는 여기 둡니다.

- `.codex-temp/`
  - 일회성 조사, 로그, 임시 산출물
  - Git 추적 대상이 아닙니다.
