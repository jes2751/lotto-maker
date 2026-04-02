# Check List

## 현재 상태

- 초기 V1 MVP: `95%+`
- 퍼블리시 전 목표: `90% 안팎`
- 전체 로드맵: `80% 안팎`

## 완료된 항목

### 핵심 기능
- [x] 홈
- [x] 번호 생성기
- [x] 회차 조회
- [x] 회차 상세
- [x] 통계 대시보드
- [x] 회차 분석 허브
- [x] 생성 통계 허브

### 추천 전략
- [x] `mixed`
- [x] `frequency`
- [x] `random`
- [x] `filter`

### 생성 통계
- [x] Firestore `generated_records` 저장
- [x] 전략 성과 보드
- [x] 적중 분포
- [x] 많이 생성된 번호 요약
- [x] 최근 생성 번호 목록

### 당첨번호 동기화
- [x] Firestore `lotto_draws` 구조
- [x] 1회 ~ 1217회 초기 적재 완료
- [x] 내부 sync API
- [x] Cloudflare 주간 sync Worker 배포
- [x] Firestore rules / indexes 반영

### SEO / 운영
- [x] `robots.txt`
- [x] `sitemap.xml`
- [x] 정책 / 신뢰 페이지
- [x] Firebase Analytics

## 지금 우선순위

### 퍼블리시 전 남은 작업
- [ ] Search Console 등록
- [ ] `sitemap.xml` 제출
- [ ] 주요 랜딩 페이지 색인 요청
- [ ] 모바일 QA
- [ ] 생성 통계 허브 모바일 QA
- [ ] 다음 주 cron 자동 반영 확인

### 화면 정리
- [x] 홈 정보 밀도 축소
- [x] 생성기 상단 설명 정리
- [x] 통계 대시보드 상단 구조 단순화
- [x] 생성 통계 허브를 게시판형이 아닌 공개 현황형으로 정리
- [x] 푸터 정리

## 운영 메모

- 공식 도메인: `https://lotto-maker.cloud`
- 생성 통계 저장소: Firebase Firestore
- 주간 당첨번호 sync: Cloudflare Workers cron
- 자동 업데이트 기준: 일요일 01:00 UTC cron

## 다음 후보

1. Search Console 등록
2. 모바일 실브라우저 QA
3. 번호 궁합 통계
4. 고급 패턴 통계
