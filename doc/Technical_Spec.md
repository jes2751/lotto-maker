# Technical Spec v1.1

## 1. 문서 목적

이 문서는 Lotto Maker Lab의 구현 기준서다.  
타입, 로직, API, 데이터, 배포 기준을 한곳에 정리한다.

## 2. 기술 스택

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Route Handlers
- 정적 시드 + 전체 회차 데이터 로딩 구조
- Cloudflare Workers/OpenNext 배포 기준

## 3. 시스템 구조

### 3-1. 프론트엔드

- App Router 기반 페이지 구성
- 서버 컴포넌트 중심
- 필요한 곳만 클라이언트 컴포넌트 사용

### 3-2. 백엔드

- Route Handlers 기반 API
- 추천 로직과 통계 계산은 `src/lib/lotto` 내부 서비스 계층에 둔다

### 3-3. 데이터

- 기본 단위는 `Draw`
- 전체 회차 데이터는 저장소 계층에서 통합 관리한다
- 향후 Prisma/PostgreSQL로 확장 가능한 구조를 유지한다

## 4. 핵심 타입

### 4-1. Draw

- `round`
- `drawDate`
- `numbers[6]`
- `bonus`
- `winnerCount?`
- `firstPrize?`
- `totalPrize?`

### 4-2. GeneratedSet

- `id`
- `strategy`
- `numbers`
- `bonus?`
- `reason`
- `generatedAt`

### 4-3. 전략

- `random`
- `frequency`
- `mixed`
- `filter`

## 5. 추천 로직 기준

### 5-1. random

- 1~45 사이 숫자 6개를 중복 없이 뽑는다
- 오름차순 정렬한다

### 5-2. frequency

- 전체 당첨 데이터 기준 빈도를 참고한다
- 많이 등장한 번호 흐름을 반영한다

### 5-3. mixed

- 랜덤성과 빈도 흐름을 함께 반영한다
- 기본 추천 전략으로 사용한다

### 5-4. filter

- 고정수
- 제외수
- 홀짝 조건
- 합계 범위
- 연속번호 허용 여부

필터 조건을 만족하는 조합만 생성한다.

## 6. 통계 계산 기준

### 6-1. 기본 통계

- 번호별 출현 횟수
- 번호별 출현 비율
- 전체 회차 기준 상위 번호
- 전체 회차 기준 하위 번호

### 6-2. 패턴 통계

- 홀짝 패턴
- 합계 패턴
- 최근 10회 흐름

### 6-3. 번호 상세 통계

- 전체 출현 횟수
- 전체 출현 비율
- 최근 10회 출현 횟수
- 최근 10회 출현 비율
- 최근 포함 회차 목록

## 7. API 기준

### 7-1. `GET /api/v1/draws`

- 회차 목록 반환
- `limit`, `offset` 지원

### 7-2. `GET /api/v1/draws/[round]`

- 특정 회차 상세 반환
- 없으면 `404`

### 7-3. `POST /api/v1/generate`

- 전략과 조합 수를 받아 추천 결과 반환
- `filter` 전략은 조건 필드를 함께 받는다

### 7-4. `GET /api/v1/stats/frequency`

- `all`, `recent_10` 기간 지원
- 번호별 빈도 데이터 반환

## 8. SEO/메타데이터 기준

- 공식 서비스명: `Lotto Maker Lab`
- 로고형 표기: `LOTTO MAKER LAB`
- 공식 도메인: `https://lotto-maker.cloud`
- 메타 제목 형식: `페이지명 | Lotto Maker Lab`
- canonical, Open Graph, Twitter metadata를 공통 helper로 관리한다

## 9. 광고/분석 기술 기준

- Google Analytics 측정 ID는 환경변수로 관리할 수 있어야 한다
- AdSense 설정 전까지 광고 슬롯은 렌더링하지 않는다
- `ads.txt`를 공개 경로에 둔다

## 10. 데이터 반영 기준

- 최신 회차 반영은 `Asia/Seoul` 기준으로 판단한다
- 주간 동기화는 전체 회차 데이터 정합성을 깨지 않도록 검증 후 반영한다
- 원격 소스가 비정상 응답을 주면 기존 데이터를 유지한다

## 11. 테스트 기준

- `npm test` 통과
- `npm run build` 통과
- 홈, 추천기, 회차 조회, 회차 상세, 통계, 랜딩 페이지 렌더 테스트 유지
- 추천 로직과 API 기본 검증 유지

## 12. 배포 기준

- Cloudflare Workers/OpenNext 기준
- 배포 전 테스트/빌드 필수
- `main` 푸시는 사용자 승인 후에만 진행
