# Note

## 1. 로컬 실행

프로젝트 루트에서 아래 순서로 실행합니다.

```bash
npm install
npm run dev
```

브라우저 주소:

```text
http://localhost:3000
```

## 2. 주요 화면

* 홈: `http://localhost:3000/`
* 번호 생성기: `http://localhost:3000/generate`
* 회차 조회: `http://localhost:3000/draws`
* 회차 상세 예시: `http://localhost:3000/draws/1169`
* 회차 분석 예시: `http://localhost:3000/draw-analysis/1169`
* 통계: `http://localhost:3000/stats`
* 최신 결과 랜딩: `http://localhost:3000/latest-lotto-results`
* 최근 10회 분석: `http://localhost:3000/recent-10-draw-analysis`

## 3. 기본 검증

```bash
npm test
npm run build
```

## 4. 자주 막히는 경우

* `npm`이 안 되면 Node.js 설치와 PATH를 확인
* `npm run dev` 후 포트가 바뀌면 터미널에 표시된 실제 주소 확인
* `.next` 캐시가 꼬이면 아래 실행

```powershell
Remove-Item -LiteralPath .next -Recurse -Force
npm run build
```

## 5. AdSense 준비

실제 광고를 붙일 때만 `.env`에 아래 값을 넣습니다.

```bash
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_ADSENSE_SLOT_INLINE=1234567890
```

광고를 아직 설정하지 않으면 광고 슬롯은 화면에 노출되지 않습니다.

## 6. Search Console 제출 체크

배포 도메인:

```text
https://lotto-maker.cloud
```

먼저 확인할 주소:

* `https://lotto-maker.cloud/robots.txt`
* `https://lotto-maker.cloud/sitemap.xml`
* `https://lotto-maker.cloud/latest-lotto-results`
* `https://lotto-maker.cloud/lotto-number-generator`
* `https://lotto-maker.cloud/lotto-statistics`
* `https://lotto-maker.cloud/hot-numbers`
* `https://lotto-maker.cloud/cold-numbers`
* `https://lotto-maker.cloud/odd-even-pattern`
* `https://lotto-maker.cloud/sum-pattern`
* `https://lotto-maker.cloud/recent-10-draw-analysis`
* `https://lotto-maker.cloud/draw-analysis/1169`

Search Console 메타 검증 코드를 쓸 경우 `.env`에 아래 값을 추가합니다.

```bash
GOOGLE_SITE_VERIFICATION=your_verification_token
```

제출 순서:

1. Search Console에 도메인 또는 URL prefix 속성 추가
2. `sitemap.xml` 제출
3. 홈과 주요 랜딩 페이지 색인 요청
4. 커버리지와 색인 상태 확인

## 7. Cloudflare 배포 메모

현재 프로젝트는 `Cloudflare Workers + OpenNext` 기준입니다.

* `pages.dev`가 아니라 Workers 배포 URL 기준으로 확인
* `wrangler.jsonc`의 `compatibility_date`는 미래 날짜로 두면 안 됨
* 배포 전 로컬에서 `npm test`, `npm run build` 확인 권장
