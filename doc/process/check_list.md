# Check List

## 1. 현재 달성률

- 초기 V1 MVP: `95%`
- 퍼블리시 전 목표: `90%`
- 전체 로드맵 기준: `80%`

## 2. 완료된 항목

### 핵심 화면
- [x] 홈
- [x] 번호 생성기
- [x] 회차 조회
- [x] 회차 상세
- [x] 통계 대시보드
- [x] 생성 통계 대시보드
- [x] 회차 분석 허브
- [x] 온라인 구매 안내

### 생성 전략
- [x] `mixed`
- [x] `frequency`
- [x] `random`
- [x] `filter`

### 생성 통계
- [x] Firestore `generated_records` 저장
- [x] 전략 성과 보드
- [x] 적중 분포
- [x] 최근 생성 번호 목록
- [x] 많이 생성된 번호 TOP 10

### 당첨번호 동기화
- [x] Firestore `lotto_draws` 저장 구조
- [x] 1회차 ~ 최신 회차 seed 완료
- [x] 내부 draw sync API
- [x] Cloudflare 주간 sync Worker
- [x] Firestore rules / indexes 반영

### SEO / 운영
- [x] `robots.txt`
- [x] `sitemap.xml`
- [x] 정책 페이지
- [x] 온라인 구매 안내 페이지
- [x] Firebase Analytics

### UX / UI
- [x] 홈 첫 화면을 `회차 당첨번호 -> Lotto Maker Lab 소개` 2단 구조로 정리
- [x] 회차 당첨번호 패널을 `회차 정보 / 번호 한 줄 / 상세 링크` 가로 배치로 정리
- [x] 홈 핵심 요약 카드 제목 축약
- [x] 홈 숫자 칩 링크 복구
- [x] 생성기는 버튼을 눌렀을 때만 결과 생성
- [x] 생성기 기본 생성 수 `5세트`
- [x] `filter` 전략일 때만 필터 패널 노출
- [x] 보너스 번호 항상 포함
- [x] 보너스 표기 `+` 방식
- [x] 헤더 메뉴 경로 `/generated-stats` 기준으로 정리
- [x] 가이드 카드 제목 축약
- [x] 구매 안내 링크 단순화
- [x] 헤더 설명/메뉴 크기 재조정
- [x] 생성기 타이포 가독성 보강

## 3. 남은 항목

### 운영 마감
- [ ] Search Console 등록
- [ ] `sitemap.xml` 제출
- [ ] 주요 랜딩 페이지 색인 요청
- [ ] 모바일 실브라우저 QA
- [ ] 생성 통계 대시보드 모바일 QA
- [ ] 다음 주간 cron 실행 결과 확인

### 후속 보강
- [ ] 회차 분석 페이지 문구 추가 고도화
- [ ] 생성 통계 시각화 추가 보강
- [ ] 통계 상세 화면 추가 정리
- [ ] 가이드 페이지 카피 추가 정리

## 4. 운영 기준

- 공식 도메인: `https://lotto-maker.cloud`
- 생성 통계 저장소: Firebase Firestore
- 주간 당첨번호 동기화: Cloudflare Worker cron
- 로컬 검증 기준:
  - `npm test`
  - `npm run build`

## 5. 다음 우선순위

1. Search Console 등록 및 `sitemap.xml` 제출
2. 모바일 / 실브라우저 QA
3. 생성 통계 대시보드 모바일 보강
4. 회차 분석 페이지 품질 보강
