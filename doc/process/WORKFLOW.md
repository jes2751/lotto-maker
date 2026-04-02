# Workflow v1.3

## 1. 기본 원칙

Lotto Maker Lab은 `로컬 작업 -> 검증 -> 문서 반영 -> 사용자 승인 시 커밋/푸시` 순서로 진행한다.

- 작업 중간 상태는 먼저 로컬에서 확인한다.
- `main` 반영은 배포 가능한 수준일 때만 진행한다.
- 사용자 화면에 보이는 변경은 코드와 문서가 함께 맞아야 한다.
- 문서는 참고용이 아니라 실제 작업 규칙으로 사용한다.

## 2. 역할

### 2-1. 기획자
- 범위와 우선순위 결정
- 제외 범위 명시
- `doc/project/plan.md`, `doc/specs/Product_Spec.md` 기준 유지

### 2-2. 웹디자이너
- 화면 구조, CTA, 정보 위계 정리
- 가독성, 밀도, 반응형 기준 유지
- `doc/specs/Design_Guide.md` 기준 유지

### 2-3. 개발자
- 화면, API, 데이터 구조 구현
- 코드 변경에 맞는 문서 업데이트
- 테스트와 빌드 검증 수행

### 2-4. 테스터
- 실제 동작 확인
- 회귀 여부 확인
- 퍼블리시 직전 QA 점검

## 3. 표준 작업 순서

1. 작업 목적 확인
2. 관련 문서 확인
3. 코드 수정
4. 관련 문서 업데이트
5. `npm test`
6. `npm run build`
7. `doc/project/history.md` 기록
8. 사용자 승인 후 커밋/푸시

## 4. 문서 우선순위

1. `doc/project/plan.md`
2. `doc/specs/Product_Spec.md`
3. `doc/specs/Design_Guide.md`
4. `doc/specs/Technical_Spec.md`
5. `doc/process/WORKFLOW.md`
6. `doc/process/check_list.md`
7. `doc/project/history.md`

상위 문서와 충돌하면 상위 문서를 기준으로 코드와 하위 문서를 맞춘다.

## 5. 코드 변경 시 문서 업데이트 규칙

이 규칙은 항상 적용한다. 사용자가 매번 따로 말하지 않아도 진행한다.

### 5-1. 기본 규칙
- 코드가 바뀌면 관련 문서도 같은 턴에 같이 점검한다.
- 사용자 화면 문구, 정보 구조, CTA, 페이지 역할이 바뀌면 문서 업데이트를 생략하지 않는다.
- API, 데이터 구조, 저장 방식, 운영 방식이 바뀌면 기술 문서를 함께 갱신한다.
- 진행 상태가 바뀌면 `doc/process/check_list.md`와 `doc/project/history.md`를 함께 갱신한다.

### 5-2. 어떤 문서를 같이 바꿀지
- 기능 범위, 우선순위, 개념 변경:
  - `doc/project/plan.md`
- 사용자 흐름, 페이지 목적, 기능 정의 변경:
  - `doc/specs/Product_Spec.md`
- 레이아웃, 가독성, 정보 밀도, 버튼 배치, 시각 기준 변경:
  - `doc/specs/Design_Guide.md`
- API, Firestore, Worker, sync, 로직, 환경변수 변경:
  - `doc/specs/Technical_Spec.md`
- 작업 절차, 승인 방식, 커밋/푸시 정책 변경:
  - `doc/process/WORKFLOW.md`
- 완료율, 남은 작업, 우선순위 변경:
  - `doc/process/check_list.md`
- 실제 수행 이력:
  - `doc/project/history.md`

### 5-3. 자동 반영 판단 기준
- 홈이나 핵심 페이지 구조를 다시 짰다:
  - `doc/specs/Product_Spec.md`, `doc/specs/Design_Guide.md`, `doc/process/check_list.md`, `doc/project/history.md`
- 생성기 전략이나 기본값을 바꿨다:
  - `doc/specs/Product_Spec.md`, `doc/specs/Technical_Spec.md`, `doc/process/check_list.md`, `doc/project/history.md`
- Firestore, Firebase, Cloudflare Worker 관련 변경이 있다:
  - `doc/specs/Technical_Spec.md`, `doc/project/note.md`, `doc/process/check_list.md`, `doc/project/history.md`
- 사용자에게 보이는 텍스트 정책이 바뀌었다:
  - `doc/specs/Product_Spec.md`, `doc/specs/Design_Guide.md`, `doc/project/history.md`

## 6. 검증 규칙

### 6-1. 기본 검증
- `npm test`
- `npm run build`

### 6-2. 화면 검증
- 주요 페이지 진입 가능 여부
- CTA 링크 동작 여부
- 모바일에서 줄바꿈과 간격 확인
- 작은 텍스트, 과한 공백, 깨진 카피 확인

## 7. 기록 규칙

`doc/project/history.md`에는 아래 4개를 남긴다.

- 작업
- 변경
- 검증
- 다음

`doc/process/check_list.md`에는 아래를 반영한다.

- 현재 완성도
- 완료된 항목
- 남은 항목
- 다음 우선순위

## 8. 커밋/푸시 규칙

- 로컬 검증 전 커밋하지 않는다.
- 문서 반영 전 커밋하지 않는다.
- 사용자 승인 전 푸시하지 않는다.
- 커밋 메시지는 실제 변경 목적이 드러나게 짧고 명확하게 쓴다.

## 9. Definition of Done

아래를 만족하면 해당 작업은 완료로 본다.

- 코드 반영 완료
- 관련 문서 반영 완료
- `npm test` 통과
- `npm run build` 통과
- `doc/project/history.md` 기록 완료

## 10. 운영 메모

- OneDrive/Windows 환경에서는 `.next` 캐시 문제가 생길 수 있다.
- 문서와 UI 텍스트는 항상 UTF-8 기준으로 유지한다.
- 사용자 화면에는 내부 운영 용어를 노출하지 않는다.
