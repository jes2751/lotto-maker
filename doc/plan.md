# Lotto Maker Lab 프로젝트 플랜 v1.4

## 1. 프로젝트 목표

- 과거 당첨 데이터 기반의 로또 추천과 통계를 제공한다.
- 사용자가 추천 번호를 생성하고, 회차/통계/생성 통계를 함께 탐색할 수 있게 한다.
- 검색 유입과 재방문을 고려한 랜딩 구조를 운영한다.
- 광고 수익화는 Google AdSense를 기준으로 하되, 광고보다 유입과 신뢰를 우선한다.

## 2. 서비스 방향

- 핵심 포지션은 `과거 당첨 데이터 기반 추천 + 통계 해석`이다.
- `무조건 당첨`, `당첨 보장` 같은 표현은 사용하지 않는다.
- 모든 추천은 참고용이며, 확률 게임이라는 점을 분명히 한다.
- 브랜드명은 `Lotto Maker Lab`, 공식 도메인은 `https://lotto-maker.cloud`를 사용한다.

## 3. 현재 V1 범위

### 3-1. 사용자 기능

- 홈
- 번호 생성기
- 회차 조회
- 회차 상세
- 통계 대시보드
- 번호 상세 통계
- 최신 결과 페이지
- 회차 분석 허브 및 회차 분석 상세
- 생성 통계 허브
- SEO 랜딩 페이지
- 정책/신뢰 페이지

### 3-2. 추천 전략

- `random`
- `frequency`
- `mixed`
- `filter`

### 3-3. 운영 기능

- Firebase Analytics
- Firebase Firestore 기반 생성 결과 저장
- Firestore 기반 당첨번호 저장 구조
- Cloudflare Workers/OpenNext 배포
- Search Console 제출 준비

## 4. 생성 통계 방향

- 사용자 간 소통형 커뮤니티를 만들지 않는다.
- 대신 사이트에서 생성된 번호를 익명 저장하고 공개 통계로 보여준다.
- 생성 통계 허브에서 아래를 보여준다.
  - 이번 회차 공개 생성 수
  - 전략 점유율
  - 전략 성과 보드
  - 적중 분포
  - 많이 생성된 번호
  - 최근 생성 번호 목록

## 5. Firestore 당첨번호 저장

### 5-1. 목표

- Firestore `lotto_draws` 컬렉션에 1회부터 최신 회차까지 공식 당첨번호를 저장한다.
- 생성 통계와 회차 데이터 기준을 Firebase에도 유지한다.
- 이후 적중 평가와 전략 성과 집계의 기준 원본으로 사용한다.

### 5-2. 구현 범위

- 전체 회차 seed 스크립트
- 신규 회차 sync 스크립트
- 보호된 내부 sync API
- Cloudflare Cron Worker 기반 주간 자동 실행

### 5-3. 운영 원칙

- `lotto_draws`는 서버 전용 쓰기 경로로만 관리한다.
- 클라이언트에서 Firestore draw 문서를 직접 수정하지 않는다.
- 기본 주간 스케줄은 `Asia/Seoul` 일요일 기준 운영을 목표로 하고, Cron은 UTC 스케줄로 관리한다.

## 6. 유입과 재방문 전략

### 6-1. SEO

- `robots.txt`, `sitemap.xml` 유지
- 주요 랜딩 페이지 개별 메타데이터 유지
- 회차 분석 페이지와 가이드 페이지를 내부 링크로 연결
- Search Console 등록 및 색인 요청 진행

### 6-2. 랜딩 페이지

- `/lotto-number-generator`
- `/lotto-statistics`
- `/latest-lotto-results`
- `/hot-numbers`
- `/cold-numbers`
- `/odd-even-pattern`
- `/sum-pattern`
- `/recent-10-draw-analysis`
- `/draw-analysis`
- `/draw-analysis/[round]`

### 6-3. 가이드/콘텐츠

- 생성기 vs 랜덤 차이
- 최근 20회 자주 나온 번호
- 홀짝 패턴 설명
- 회차 분석 요약

## 7. 퍼블리시 전 우선순위

1. Search Console 등록 및 sitemap 제출
2. Firestore draw sync 운영 연결
3. 생성 통계 허브 모바일 QA
4. 전체 사이트 모바일/실브라우저 QA

## 8. 후속 확장

- 번호 궁합 통계
- 고급 패턴 통계
- 그룹 추첨기
- 오늘의 운세 기반 추천 번호
- 전략 성과의 장기 누적 통계

## 9. 배포 원칙

- `main`은 배포 브랜치다.
- 로컬 검증 후 사용자 승인 시에만 커밋/푸시한다.
- 배포 대상은 Cloudflare Workers/OpenNext다.
## 2026-04-02 진행 브리핑

- 핵심 V1 기능은 대부분 구현 완료 상태다.
- 생성 통계 기능은 Firestore 저장과 공개 대시보드까지 반영됐다.
- 당첨번호 DB는 Firestore `lotto_draws` 기준으로 `1회 ~ 1217회` 적재 완료 상태다.
- 매주 일요일 자동 갱신을 위한 Cloudflare Worker도 배포 완료 상태다.
- 현재 남은 우선순위는 Search Console 등록, 모바일 QA, 실서비스 운영 안정화다.
