# Note

## 1. 로컬 실행

프로젝트 루트에서 아래 순서로 실행합니다.

```bash
npm install
npm run dev
```

브라우저 접속 주소:

```text
http://localhost:3000
```

## 2. 주요 화면

- 홈: `http://localhost:3000/`
- 추천기: `http://localhost:3000/generate`
- 회차 조회: `http://localhost:3000/draws`
- 회차 상세 예시: `http://localhost:3000/draws/1169`
- 회차 분석 예시: `http://localhost:3000/draw-analysis/1169`
- 통계 대시보드: `http://localhost:3000/stats`
- 최신 결과 랜딩: `http://localhost:3000/latest-lotto-results`
- 최근 10회 분석: `http://localhost:3000/recent-10-draw-analysis`
- 개인정보처리방침: `http://localhost:3000/privacy`
- 이용약관: `http://localhost:3000/terms`
- FAQ: `http://localhost:3000/faq`
- 문의 / 운영 안내: `http://localhost:3000/contact`

## 3. 기본 검증

```bash
npm test
npm run build
```

## 4. 자주 막히는 경우

- `npm` 명령이 안 되면 Node.js 설치와 PATH를 먼저 확인합니다.
- `npm run dev` 실행 후 포트가 바뀌면 터미널에 표시된 실제 주소로 접속합니다.
- Windows + OneDrive 환경에서는 `.next` 캐시 때문에 빌드가 꼬일 수 있습니다. 이 경우 `.next`를 지우고 다시 빌드합니다.

```powershell
Remove-Item -LiteralPath .next -Recurse -Force
npm run build
```

## 5. AdSense 준비

광고를 실제로 노출하려면 `.env`에 아래 값을 넣습니다.

```bash
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_ADSENSE_SLOT_INLINE=1234567890
```

값이 없으면 광고 컴포넌트는 자동으로 숨김 처리됩니다.

## 6. Search Console 제출 준비

공식 도메인:

```text
https://lotto-maker.cloud
```

먼저 확인할 주소:

- `https://lotto-maker.cloud/robots.txt`
- `https://lotto-maker.cloud/sitemap.xml`
- `https://lotto-maker.cloud/latest-lotto-results`
- `https://lotto-maker.cloud/lotto-number-generator`
- `https://lotto-maker.cloud/lotto-statistics`
- `https://lotto-maker.cloud/hot-numbers`
- `https://lotto-maker.cloud/cold-numbers`
- `https://lotto-maker.cloud/odd-even-pattern`
- `https://lotto-maker.cloud/sum-pattern`
- `https://lotto-maker.cloud/recent-10-draw-analysis`
- `https://lotto-maker.cloud/draw-analysis/1169`
- `https://lotto-maker.cloud/privacy`
- `https://lotto-maker.cloud/terms`
- `https://lotto-maker.cloud/faq`
- `https://lotto-maker.cloud/contact`

Search Console 소유권 확인 메타를 쓰려면 `.env`에 아래 값을 넣습니다.

```bash
GOOGLE_SITE_VERIFICATION=your_verification_token
```

제출 순서:

1. Search Console에서 `https://lotto-maker.cloud`를 URL prefix 속성으로 등록
2. 소유권 확인
3. `sitemap.xml` 제출
4. 주요 랜딩 페이지 색인 요청
5. 회차 분석 페이지와 정책 페이지 색인 상태 확인

## 7. Cloudflare Workers 배포 메모

현재 프로젝트는 `Cloudflare Workers + OpenNext` 기준입니다.

- `pages.dev`가 아니라 Workers 배포 URL 또는 연결한 공식 도메인을 확인합니다.
- 배포 전에는 `npm test`, `npm run build`를 먼저 통과시킵니다.
- `wrangler.jsonc`의 `compatibility_date`는 미래 날짜로 두지 않습니다.
