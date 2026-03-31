# 로또 서비스 v1 릴리스 플랜

## 1. 기준 문서

* 이 문서는 v1 릴리스 범위의 최상위 기준이다.
* `doc/Requirements.md`는 구현 백로그와 세부 요구사항을 다룬다.
* `doc/IA_and_Screens.md`, `doc/API_Spec.md`, `doc/DB_Schema.md`는 이 문서를 따른 파생 문서다.
* 상세 구현 기준은 아래 문서로 고정한다.
  * `Generation_Logic_Spec.md`
  * `API_Contract_Detail.md`
  * `Data_Pipeline_and_Validation.md`
  * `UI_State_Spec.md`
  * `Deployment_and_Operations_Checklist.md`

## 2. 서비스 방향

* 서비스 포지셔닝은 `혼합형`이다.
* 첫 화면과 사용자 흐름의 중심은 `번호 생성기`에 둔다.
* 통계와 회차 조회는 생성 결과를 이해시키는 보조 기능으로 제공한다.
* `당첨 보장`, `무조건 적중` 같은 표현은 금지한다.

## 3. v1 목표

* 외부 수집 자동화 없이도 즉시 실행 가능한 Next.js 14 App Router 골격 구축
* 정적 시드 데이터 기반으로 번호 생성, 회차 조회, 기본 통계 제공
* 이후 Prisma/PostgreSQL 전환이 가능한 구조로 저장소 계층 분리

## 4. v1 범위

### 화면

1. 홈 `/`
2. 번호 생성기 `/generate`
3. 회차 조회 `/draws`
4. 기본 통계 `/stats`

### API

1. `GET /api/health`
2. `GET /api/v1/draws`
3. `GET /api/v1/draws/[round]`
4. `POST /api/v1/generate`
5. `GET /api/v1/stats/frequency`

### 생성 전략

* `random`
* `frequency`
* `mixed`

## 5. v1 제외 범위

* 로그인과 인증
* 생성 결과 저장
* 공유 링크
* 피드백 수집
* 다크 모드 토글
* FAQ, 소개, 운영자 페이지
* 상세 통계, 검색, 자동 수집 스케줄링

## 6. 데이터 전략

* 초기에는 저장소 내부 정적 시드 데이터를 사용한다.
* 도메인 계층은 시드 저장소와 Prisma 저장소를 교체할 수 있게 설계한다.
* Prisma 스키마와 `.env.example`은 함께 제공하되, 앱 실행은 DB 없이 가능해야 한다.

## 7. 성공 조건

* `npm run dev`로 로컬에서 앱이 실행된다.
* 홈, 생성기, 회차 조회, 통계 페이지가 렌더링된다.
* 생성 API가 전략별 번호와 근거를 반환한다.
* 회차 API와 통계 API가 시드 데이터 기준으로 응답한다.
* 생성 로직과 API 응답을 검증하는 테스트가 존재한다.
