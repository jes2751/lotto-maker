# Technical Spec v1.7

## 1. 핵심 기술 구성

- Frontend: Next.js App Router
- Analytics: Firebase Analytics
- Generated stats storage: Firebase Firestore
- Official draw read source: 로컬 아카이브 `src/lib/data/local-draws.ts`
- Draw settlement storage: Firebase Firestore `lotto_draws`
- Weekly local archive update: GitHub Actions cron
- Weekly settlement sync: Cloudflare Worker cron

## 2. 데이터 구조

### 2-1. `generated_records`
- 생성된 번호 기록 저장
- 주요 필드:
  - `strategy`
  - `numbers`
  - `bonus`
  - `generatedAt`
  - `targetRound`
  - `reason`
  - `filters`
  - `matchedRound`
  - `matchCount`
  - `bonusMatched`
  - `settledAt`

### 2-2. `lotto_draws`
- 생성 통계 정산용 당첨 회차 저장
- 사용자 회차 조회의 기준 소스는 아님
- 주간 sync 시 신규 회차만 추가

### 2-3. `local-draws.ts`
- 회차 조회, 통계, 상세 페이지가 직접 읽는 공식 당첨 아카이브
- Git에 체크인된 로컬 데이터 파일
- 최신 회차가 나오면 공식 API 응답을 기준으로 파일을 직접 갱신
- GitHub Actions가 주 1회 갱신 후 커밋/푸시

### 2-4. `site_metrics`
- 사이트 운영 지표 저장
- 현재 사용 필드:
  - `type`
  - `dateKey`
  - `count`
  - `updatedAt`
- 현재 문서:
  - `daily-YYYY-MM-DD`

## 3. 생성기 동작 규칙

- 기본 전략은 `mixed`
- 기본 생성 수는 `5`
- 보너스 번호는 항상 포함
- 첫 진입 시 자동 생성하지 않는다
- `filter` 전략일 때만 필터 입력 UI를 노출한다
- 생성 직후 Firestore `generated_records`에 비동기로 저장한다
- 저장 경로는 `public Firestore create -> API fallback` 순서로 시도한다
  - 기본 저장은 브라우저 Firebase client write
  - 실패 시 `/api/v1/generated-records` admin write fallback
  - `generated_records`는 create-only public rule을 사용하고, 정산 update는 admin 경로가 담당한다

## 4. 생성 통계 계산 규칙

- 대상 회차: 최신 당첨 회차 + 1
- 최근 평가 회차: 최신 당첨 회차
- 전략 성과:
  - 전략별 생성 수
  - 최고 적중 수
  - 3개 이상 적중 수
  - 4개 이상 적중 수
  - 보너스 적중 수
- 적중 분포:
  - 0개~6개 일치

## 5. 당첨번호 동기화

- 로컬 아카이브 갱신:
  - `npm run sync:draws`
  - 현재 `local-draws.ts`의 최신 회차 이후 공식 결과를 직접 조회
  - 새 회차가 있으면 `local-draws.ts`를 바로 갱신
- 로컬 아카이브 자동 실행:
  - GitHub Actions cron
  - 매주 일요일 실행
  - 변경이 있으면 `local-draws.ts` 커밋 후 push
- Firestore 정산 sync:
  - 내부 sync API 호출
  - 신규 회차만 Firestore `lotto_draws`에 저장
  - 같은 회차를 대상으로 생성된 기록을 자동 마감
  - Cloudflare Worker cron이 주간 실행

## 6. 온라인 구매 안내 페이지 구현 기준

### 6-1. 라우트
- `/lotto-buy-guide`

### 6-2. 내용 원칙
- 동행복권 공식 기준 정보만 사용
- 공식 사이트 외 링크는 기본적으로 넣지 않음
- 사용자에게 필요한 정보만 간단히 정리
  - 온라인 구매 가능 여부
  - 구매 한도
  - 판매 시간
  - 추첨 시간
  - 기본 유의사항
  - 동행복권 메인페이지 바로가기

### 6-3. 운영 원칙
- 정책성 정보는 변경 가능성이 있으므로 정기 점검 대상에 포함
- 공식 안내 변경 시 문서와 페이지를 함께 수정
- 사용자 화면에는 `공식 안내 기준` 문구를 명시
- 공식 링크는 에러 가능성이 낮은 안정적인 경로를 우선 사용

## 7. SEO / 사이트맵

- `/lotto-buy-guide`를 `sitemap.xml`에 포함
- 메타데이터:
  - 한국어 제목/설명
- 공식 도메인 canonical 유지

## 8. 검증 규칙

- `npm test`
- `npm run build`
- 새 라우트가 sitemap에 포함되는지 확인
- 사용자 화면에 깨진 한글이나 내부 운영 용어가 없는지 확인
- 사용자 화면에 영어 전환 UI나 영어 카피가 남아 있지 않은지 확인
