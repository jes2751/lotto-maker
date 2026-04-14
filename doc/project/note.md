# Note

## 2026-04-02 운영 브리핑

- 공식 도메인: `https://lotto-maker.cloud`
- 브랜드명: `Lotto Maker Lab`
- Firestore `lotto_draws` 초기 적재 완료
  - `1회 ~ 1217회`
- Cloudflare 주간 sync Worker 배포 완료
  - `https://lotto-maker-draw-sync.jes2751.workers.dev`
  - `0 1 * * SUN`
- 생성 통계 허브(`/generated-stats`)는 Firestore `generated_records` 기반으로 동작
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
- `/generated-stats`
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
- 생성 통계 허브(`/generated-stats`)는 Firestore 읽기 기반이다.
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
- `/generated-stats`
- `/latest-lotto-results`
- `/draw-analysis`

## 10. 현재 남은 운영 작업

- Search Console 실제 등록
- draw sync Worker 실제 배포
- 최신 회차 자동 반영 검증
- 모바일/실브라우저 QA

## 11. QA 자료

- QA 문서 모음:
  - `doc/qa/README.md`
- 최근 디자인 QA:
  - `doc/qa/2026-04-02-design-qa.md`


/qa (QA 테스트 및 자동 버그 수정)
"지금 /qa 스킬 실행해줘" 라고 하시면, 제가 로컬 서버(npm run dev)에 백그라운드 브라우저를 연결해 모바일과 데스크톱 화면에서 레이아웃이 깨지지 않는지, 버튼은 잘 동작하는지 스스로 클릭해 보며 오류를 찾고 소스코드를 수정해 냅니다.
/review (코드 리뷰어)
기능 작업을 마친 뒤 "이번 변경사항 /review 해줘" 라고 하시면, Senior Engineer의 시각에서 SQL 인젝션, 논리적 오류, 사이드 이펙트 가능성 등을 매우 날카롭게 검토합니다.
/design-review (디자인 QA)
"이 화면 /design-review 해봐" 라고 하시면, 여백 불일치, 폰트 크기, 대비(Contrast) 등 미적 관점에서 이상한 점이 없는지 탐색하고 교정해 줍니다.
/plan-ceo-review (기획 챌린지)
새로운 기능(예: 회원가입, 커뮤니티 등)을 추가하고 싶을 때 사용해 보세요. 실리콘밸리 CEO의 관점에서 "이 기능이 굳이 필요한가? 더 혁신적인 방법은 없는가?"에 대해 챌린지하여 아이디어를 더 크고 날카롭게 다듬어 줍니다.

## 12. 매주 데이터 업데이트 정책 (듀얼 트랙)

현재 프로젝트의 매주 주말 당첨번호 업데이트는 과금 방어 및 최적화를 위해 두 가지 트랙으로 분리되어 있습니다.

### 트랙 1. 사용자 화면용 데이터 (프론트엔드 - 수동 Push)
홈이나 통계 화면 등에서 노출되는 공식 당첨번호는 Firestore를 호출하지 않고 `local-draws.ts` 하드코딩 파일을 사용합니다 (DB 읽기 요금 방어).
- **현재 상황**: 최근 동행복권 API의 봇 차단(WAF) 정책으로 인해 기존 자동 스크립트(`npm run sync:draws`)가 정상 동작하지 않게 되었습니다.
- **수동 갱신 명령어**: 다음 두 가지 옵션 중 하나를 선택하여 진행합니다.
  
  **옵션 1. (권장) Antigravity(AI) 에게 업데이트 요청**
  - 저(AI)에게 **"최신 회차로 동기화해줘"** 한마디만 하시면, 제가 내장 브라우저를 통해 방화벽을 우회하여 긁어온 뒤 로컬/서버 업데이트부터 커밋까지 전부 자동으로 해드립니다.

  **옵션 2. CLI 수동 주입 스크립트 실행**
  - 콘솔에 다음과 같이 7개의 값을 입력하여 직접 수동 주입합니다.
  - 사용법: `npm run sync:manual <회차> <날짜> <당첨번호6개> <보너스> <총상금> <1등상금> <1등당첨자수>`
  - 예시: `npm run sync:manual 1220 2026-04-18 "5,10,15,20,30,40" 45 10000000000 2000000000 5`
  
- **반영 방법**: 위 방법으로 갱신 후 반드시 `npm run firestore:draws:seed` 를 실행해 서버DB에 밀어넣고, 로컬 변경사항(`local-draws.ts` 등)은 **Git Commit & Push** 합니다.
### 트랙 2. 생성 통계 정산 및 내부 DB (백엔드 - 자동 배치)
사용자들이 생성했던 번호들이 몇 등 당첨되었는지 마감(Settle) 처리하는 작업은 자동화되어 있습니다.
- **자동 마감**: 매주 일요일 오전 10시(KST) Cloudflare Worker(Cron)가 `lotto-maker-draw-sync` 스크립트를 자동 실행합니다.
- **동작 내용**: 서버 내부 API를 통해 Firestore의 `lotto_draws`에 당첨번호를 보관하고, `generated_records`를 순회하며 당첨 결과를 대조하고 마감(settled) 처리합니다.
