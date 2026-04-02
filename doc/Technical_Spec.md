# Technical Spec v1.4

## 2026-04-02 운영 반영 상태

- Firestore `generated_records`
  - 생성기에서 익명 생성 결과를 저장한다.
  - 생성 통계 허브(`/community`)는 이 컬렉션을 읽어 전략 성과와 적중 분포를 집계한다.
- Firestore `lotto_draws`
  - 공식 당첨번호 저장 컬렉션이다.
  - 현재 `1회 ~ 1217회`까지 초기 적재를 마쳤다.
- 내부 동기화 API
  - `POST /api/internal/draws/sync`
  - 인증 방식은 `Authorization: Bearer ${DRAW_SYNC_SECRET}`
- Cloudflare Cron Worker
  - 주 1회 `0 1 * * SUN`에 위 sync API를 호출한다.
  - Worker URL: `https://lotto-maker-draw-sync.jes2751.workers.dev`
- 주간 생성 통계 마감
  - 새 당첨번호가 반영되면 해당 회차의 `generated_records`를 자동 마감한다.
  - 저장 필드: `matchedRound`, `matchCount`, `bonusMatched`, `settledAt`

## 1. 기술 스택

- Next.js App Router
- TypeScript
- Tailwind CSS
- Firebase Analytics
- Firebase Firestore
- Cloudflare Workers / OpenNext

## 2. 핵심 데이터 모델

### 2-1. Draw

- `id`
- `round`
- `drawDate`
- `numbers[6]`
- `bonus`
- `winnerCount?`
- `firstPrize?`
- `totalPrize?`

### 2-2. GeneratedSet

- `id`
- `strategy`
- `numbers`
- `bonus?`
- `reason`
- `generatedAt`

### 2-3. GeneratedRecord

- `anonymousId`
- `strategy`
- `numbers`
- `bonus`
- `reason`
- `generatedAt`
- `createdAt`
- `createdSource`
- `targetRound`
- `filters`
- `matchedRound`
- `matchCount`
- `bonusMatched`

### 2-4. LottoDrawRecord

- `id`
- `round`
- `drawDate`
- `numbers`
- `bonus`
- `winnerCount`
- `firstPrize`
- `totalPrize`
- `source`
- `syncedAt`

## 3. 추천 로직

### 3-1. random

- 1~45 중복 없이 6개 추출
- 오름차순 정렬

### 3-2. frequency

- 과거 당첨 데이터 기반 빈도 가중치 적용
- 출현 빈도가 높은 번호가 선택될 확률이 상대적으로 높다

### 3-3. mixed

- `frequency`와 `random`을 혼합한 기본 전략

### 3-4. filter

- 고정수
- 제외수
- 홀짝 조건
- 합계 범위
- 연속번호 허용 여부

## 4. 회차 데이터 소스

- 원격 전체 회차 데이터셋
- 공식 회차 API
- 로컬 seed fallback

현재는 조회 쪽에서 원격 데이터 + seed fallback을 사용하고, 운영 쪽에서는 Firestore `lotto_draws` 적재 경로를 추가했다.

## 5. 생성 통계

- 저장 컬렉션: `generated_records`
- 익명 ID 기준으로 생성 결과 저장
- 클라이언트 생성 후 Firestore에 write
- 통계 허브(`/community`)에서 읽기 전용 집계

요약 항목:
- 현재 회차 생성 수
- 전략 점유율
- 전략 성과 보드
- 적중 분포
- 많이 생성된 번호
- 최근 생성 번호

## 6. Firestore Draw Sync

### 6-1. 컬렉션

- `lotto_draws`
- 문서 ID: 회차 번호 문자열

### 6-2. 필드

- `id`
- `round`
- `drawDate`
- `numbers`
- `bonus`
- `winnerCount`
- `firstPrize`
- `totalPrize`
- `source`
- `syncedAt`

### 6-3. 서버 쓰기 경로

- `src/lib/firebase/admin.ts`
  - 서비스 계정 JWT 서명
  - Google OAuth access token 발급
  - Firestore REST commit / query 호출
- `src/lib/data/firestore-draw-sync.ts`
  - 전체 seed
  - 신규 sync

### 6-4. 실행 경로

- 전체 적재
  - `npm run firestore:draws:seed`
- 신규 회차 동기화
  - `npm run firestore:draws:sync`
- 보호된 내부 API
  - `POST /api/internal/draws/sync`
- Cloudflare Cron Worker
  - `workers/draw-sync-cron.ts`
  - `wrangler.draw-sync.jsonc`

### 6-5. 환경변수

- `FIREBASE_ADMIN_PROJECT_ID`
- `FIREBASE_SERVICE_ACCOUNT_EMAIL`
- `FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY`
- `DRAW_SYNC_SECRET`

## 7. API

- `GET /api/health`
- `GET /api/v1/draws`
- `GET /api/v1/draws/[round]`
- `POST /api/v1/generate`
- `GET /api/v1/stats/frequency`
- `POST /api/internal/draws/sync`

## 8. Firestore Rules

- `generated_records`: public read, create only, update/delete 금지
- `lotto_draws`: public read, write 금지

서버 쓰기는 Firestore REST API + 서비스 계정 경로만 사용한다.

## 9. 배포

- 메인 앱: Cloudflare Workers / OpenNext
- draw sync 자동화: 별도 Cloudflare Cron Worker
- Analytics: Firebase Analytics
- 광고: Google AdSense 준비 구조, 미설정 시 비노출

## 10. 검증 기준

- `npm test`
- `npm run build`
- Firestore rules/indexes 배포 확인
- 실브라우저 QA
- Search Console 색인 점검
