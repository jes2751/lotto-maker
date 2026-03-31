# 로또 번호 생성기 v1

Next.js 14 App Router 기반의 로또 번호 생성기 초기 구현이다. 현재 버전은 정적 시드 데이터로 동작하며, 번호 생성기 중심의 최소 MVP를 제공한다.

## 포함 기능

* 홈
* 번호 생성기
* 최근 회차 조회
* 번호별 출현 빈도 통계
* Route Handlers 기반 API
* Prisma/PostgreSQL 전환용 스키마

## 실행

```bash
cmd /c npm install
cmd /c npm run dev
```

## 테스트

```bash
cmd /c npm test
```

## 저장소 운영 규칙

* 작업 규칙 문서: `WORKFLOW.md`
* 작업 기록 파일: `history.md`
* 범위 기준 문서: `plan.md`
* 제품 기획 문서: `Product_Spec.md`
* 디자인 기준 문서: `Design_Guide.md`
* 기술 기준 문서: `Technical_Spec.md`

기본 흐름은 다음과 같다.

1. 범위 변경이 있으면 먼저 `plan.md`를 갱신한다.
2. 코드 작업 후 `history.md`에 변경 내역과 검증 결과를 기록한다.
3. 관련 테스트 또는 최소 실행 확인을 수행한다.
4. 검증이 통과하면 커밋 후 `main` 브랜치에 푸시한다.

## 주요 경로

* `src/app`: App Router 페이지와 API
* `src/components`: 화면 컴포넌트
* `src/lib`: 시드 데이터, 저장소, 생성 로직, 통계 계산
* `src/types`: 도메인 타입
* `prisma`: 스키마
* `tests`: 단위 및 API 테스트

## 문서 구조

* `plan.md`: 최상위 범위와 우선순위
* `Product_Spec.md`: 사용자, 기능, 화면, 상태 기획
* `Design_Guide.md`: UI, 반응형, 상태 표현 기준
* `Technical_Spec.md`: 생성 로직, API, 데이터, 테스트 기준
* `WORKFLOW.md`: 역할, 작업 순서, 기록, 커밋/푸시 규칙
* `history.md`: 실제 작업 로그
* `archive/`: 통합 전 상세 문서 보관
