# Technical Spec v1.7

## 2026-04-14 Addendum: 생성 통계 집계 구조 개편안

### 목표
- `/generated-stats`가 `최근 일부 raw record`가 아니라 `이번 회차 전체 집계`를 읽도록 바꾼다.
- 실시간 구독은 집계 문서 위주로 줄이고, raw record는 최근 카드용 최소 조회만 남긴다.
- 정산 완료 회차의 성과 평가는 현재 회차 군중 흐름과 별도 문서로 분리한다.
- 부분 성공 write와 중복 집계를 구조적으로 막는다.

### 신규 Firestore 컬렉션

#### `generated_requests/{requestId}`
- 역할:
  - 생성 요청 idempotency ledger
  - 서버 재시도 시 중복 집계 차단
- 필수 필드:
  - `requestId`
  - `anonymousId`
  - `targetRound`
  - `setCount`
  - `status`
  - `recordIds`
  - `createdAt`
  - `committedAt`

#### `generated_round_stats/{targetRound}`
- 역할:
  - 이번 회차 전체 군중 흐름 집계
- 필수 필드:
  - `schemaVersion`
  - `targetRound`
  - `sourceRecordCount`
  - `totalGenerated`
  - `strategyCounts`
  - `numberCounts`
  - `topNumbers`
  - `updatedAt`
  - `computedAt`
  - `latestGeneratedAt`
- 선택 필드:
  - `oddEvenCounts`
  - `sumRangeCounts`
  - `pairCountsTopN`
  - `allowConsecutiveCounts`
  - `lastCommittedRequestId`

#### `generated_round_results/{round}`
- 역할:
  - 정산 완료 회차 성과 평가 집계
- 필수 필드:
  - `schemaVersion`
  - `round`
  - `sourceRecordCount`
  - `computedAt`
  - `settledAt`
  - `totalEvaluated`
  - `matchDistribution`
  - `strategyPerformance`
  - `threePlusHits`
  - `fourPlusHits`
  - `bonusHits`

### raw record 역할 재정의
- `generated_records`는 계속 원본 저장소로 유지한다.
- `/generated-stats` 상단 핵심 집계 source로는 더 이상 직접 쓰지 않는다.
- 최근 공개 생성 번호 카드, 정산 source of truth, backfill source로 사용한다.

### 쓰기 경로
- 생성 API가 `requestId`를 받는다.
- 클라이언트는 Firestore 직접 write를 하지 않고 `/api/v1/generate`만 호출한다.
- 서버는 세트 index를 포함해 안정적인 `recordId = ${requestId}:${setIndex}`를 만든다.
- 처리 순서:
  1. `generated_requests/{requestId}` 존재 여부 확인
  2. 이미 존재하면 이전 응답을 재사용하고 aggregate는 다시 올리지 않음
  3. 미존재면 `generated_requests`, `generated_records`, `generated_round_stats`를 하나의 atomic commit/transaction으로 처리
- 같은 `requestId`가 재시도되면 같은 `recordId`를 써서 중복 집계를 막는다.
- 집계 반영은 서버 경로에서만 수행한다.
- raw 저장과 aggregate 반영이 분리된 2단계 write는 허용하지 않는다.

```text
POST /api/v1/generate(requestId)
  -> generate sets
  -> check generated_requests/{requestId}
  -> atomic commit
     -> create request ledger
     -> create raw records
     -> update round aggregate
  -> return response
```

### 읽기 경로
- `/generated-stats` SSR:
  - `generated_round_stats/{currentTargetRound}`
  - `generated_round_results/{latestDraw.round}`
  - `generated_records where targetRound == currentTargetRound order by generatedAt desc limit 4~12`
- 클라이언트 실시간 구독:
  - 우선 `generated_round_stats/{currentTargetRound}` 1문서
  - 필요 시 최근 raw record 목록만 제한 조회
- 기존 `recent 240 records` 방식은 제거 대상이다.
- 마이그레이션 fallback:
  - aggregate doc이 없으면 `recent 240 records`로 되돌아가지 않는다.
  - 서버가 현재 회차 전체 raw record를 읽어 on-demand aggregate를 계산하고 self-heal write를 시도한다.
  - fallback조차 실패하면 UI는 `집계 준비 중` 상태를 보여주고 `0건`으로 오해시키지 않는다.

### 정산 경로
- 주간 sync가 `lotto_draws`를 갱신한 뒤 `targetRound == latestDraw.round` raw record를 평가한다.
- 개별 raw record의 `matchedRound`, `matchCount`, `bonusMatched`, `settledAt`를 업데이트한다.
- 같은 평가 결과를 `generated_round_results/{latestDraw.round}` 집계 문서로 저장한다.
- `generated_round_results/{round}`는 부분 증분 업데이트 대신 `회차 전체 재계산 -> 단일 write`를 기본으로 한다.
- backfill, sync, settle이 같은 회차 결과 문서를 동시에 갱신하지 않도록 회차별 순차 처리한다.

### 실패 모드와 방어
- partial write:
  - 방어: request ledger + raw records + round stats atomic commit
- duplicate retry:
  - 방어: `generated_requests/{requestId}` + deterministic `recordId`
- aggregate doc missing:
  - 방어: on-demand full recompute 또는 `집계 준비 중`
- schema drift:
  - 방어: `schemaVersion`, `sourceRecordCount`, `computedAt`
- backfill/settle collision:
  - 방어: 회차별 순차 처리, cutover 기간 single writer

### 마이그레이션
1. `generated_requests`, `generated_round_stats`, `generated_round_results` 스키마 및 `schemaVersion` 추가
2. 클라이언트 direct Firestore write 제거
3. 생성 API에 `requestId` / 안정적 `recordId` / atomic commit 반영
4. 최근 회차 backfill 스크립트 실행
5. 정산 경로에 `generated_round_results/{round}` full recompute 추가
6. `/generated-stats`를 aggregate-first + server fallback read로 전환
7. 기존 `limit 240` 기반 summary 계산 제거

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
