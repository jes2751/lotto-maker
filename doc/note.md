# 실행 방법 노트

## 1. 로컬 실행

프로젝트 루트에서 아래 순서대로 실행한다.

```bash
npm install
npm run dev
```

개발 서버가 뜨면 브라우저에서 아래 주소로 접속한다.

```text
http://localhost:3000
```

포트가 이미 사용 중이면 Next.js가 다른 포트로 실행될 수 있으니 터미널에 표시된 주소를 확인한다.

## 2. 주요 화면 주소

* 홈: `http://localhost:3000/`
* 추천기: `http://localhost:3000/generate`
* 회차 조회: `http://localhost:3000/draws`
* 회차 상세 예시: `http://localhost:3000/draws/1169`
* 통계: `http://localhost:3000/stats`

## 3. 실행 전 확인

아래 항목이 준비되어 있어야 한다.

* Node.js 설치
* `npm` 사용 가능
* 프로젝트 루트 위치: `c:\Users\jes27\OneDrive\code\lotto_v2`

## 4. 기본 검증

실행 전에 아래 명령으로 테스트와 빌드를 확인할 수 있다.

```bash
npm test
npm run build
```

## 5. 자주 막히는 경우

### `npm` 명령이 안 될 때

* Node.js가 설치되어 있는지 확인한다.
* 새 터미널을 다시 열어 PATH 반영 상태를 확인한다.

### 페이지가 안 열릴 때

* `npm run dev`가 실제로 실행 중인지 확인한다.
* 터미널에 표시된 포트 번호를 확인한다.

### 빌드가 실패할 때

`.next` 캐시 문제일 수 있으므로 아래처럼 한 번 지우고 다시 시도한다.

```powershell
Remove-Item -LiteralPath .next -Recurse -Force
npm run build
```

## 6. 배포 초입

현재 v1은 정적 시드 데이터 기반이라 환경변수 없이도 기본 배포가 가능하다.

권장 순서:

1. GitHub 저장소 최신 상태 확인
2. Vercel에서 저장소 연결
3. Next.js 프로젝트로 배포
4. 발급된 URL에서 홈, 추천기, 회차 조회, 통계 화면 확인

## 7. AdSense 준비

광고를 붙일 때는 아래 환경변수를 추가한다.

```bash
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_ADSENSE_SLOT_INLINE=1234567890
```

주의:

* 환경변수가 없으면 광고 대신 플레이스홀더 카드만 보인다.
* 배포 전에는 실제 퍼블리셔 ID 기준으로 `ads.txt`도 준비해야 한다.
