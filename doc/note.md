# Note

## 2026-04-02 운영 브리핑

- 공식 도메인: `https://lotto-maker.cloud`
- 브랜드명: `Lotto Maker Lab`
- Firestore `lotto_draws` 초기 적재 완료
  - `1회 ~ 1217회`
- Cloudflare 주간 sync Worker 배포 완료
  - `https://lotto-maker-draw-sync.jes2751.workers.dev`
  - `0 1 * * SUN`
- 생성 통계 허브(`/community`)는 Firestore `generated_records` 기반으로 동작
- 남은 운영 작업은 Search Console 등록과 모바일 QA 위주다

## draw seed 최신 결과

```json
{
  "mode": "seed",
  "lastKnownRound": 0,
  "latestRound": 1217,
  "writtenCount": 1217,
  "settledCount": 0
}
```

## 1. 로컬 실행

```bash
npm install
npm run dev
```

기본 주소:

```text
http://localhost:3000
```

## 2. 주요 경로

- `/`
- `/generate`
- `/draws`
- `/draws/1169`
- `/stats`
- `/community`
- `/latest-lotto-results`
- `/draw-analysis`
- `/draw-analysis/1169`
- `/privacy`
- `/terms`
- `/faq`
- `/contact`

## 3. 검증

```bash
npm test
npm run build
```

## 4. Windows / OneDrive 메모

`.next` 캐시가 꼬이면 아래 순서로 정리한다.

```powershell
Remove-Item -LiteralPath .next -Recurse -Force
npm run build
```

## 5. 환경변수

```bash
NEXT_PUBLIC_SITE_URL=https://lotto-maker.cloud
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-H6Z8MLCSYK
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=lotto-maker-lab.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=lotto-maker-lab
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=lotto-maker-lab.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=606623120175
NEXT_PUBLIC_FIREBASE_APP_ID=1:606623120175:web:e9029cd0fbc38ce0a33fda
GOOGLE_SITE_VERIFICATION=
FIREBASE_ADMIN_PROJECT_ID=lotto-maker-lab
FIREBASE_SERVICE_ACCOUNT_EMAIL=
FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY=
DRAW_SYNC_SECRET=
```

## 6. Firestore generated stats

- 생성기는 Firestore `generated_records`에 결과를 저장한다.
- 생성 통계 허브(`/community`)는 Firestore 읽기 기반이다.
- 전략 성과, 적중 분포, 이번 회차 생성 현황을 볼 수 있다.

## 7. Firestore 당첨번호 적재

컬렉션:
- `lotto_draws`

전체 적재:

```bash
npm run firestore:draws:seed
```

신규 회차 동기화:

```bash
npm run firestore:draws:sync
```

보호된 내부 API:

```text
POST /api/internal/draws/sync
```

## 8. Cloudflare Cron Worker

파일:
- `workers/draw-sync-cron.ts`
- `wrangler.draw-sync.jsonc`

배포:

```bash
npm run deploy:draw-sync
```

기본 스케줄:
- `0 1 * * SUN` (UTC)

기본 호출 대상:
- `https://lotto-maker.cloud/api/internal/draws/sync`

## 9. Search Console

제출 대상:

```text
https://lotto-maker.cloud
```

확인 경로:
- `/robots.txt`
- `/sitemap.xml`
- `/`
- `/generate`
- `/stats`
- `/community`
- `/latest-lotto-results`
- `/draw-analysis`

## 10. 현재 남은 운영 작업

- Search Console 실제 등록
- draw sync Worker 실제 배포
- 최신 회차 자동 반영 검증
- 모바일/실브라우저 QA
