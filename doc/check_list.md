# Check List

## 2026-04-02 최신 상태

- 초기 V1 MVP: `95%+`
- 퍼블리시 전 목표: `90% 안팎`
- 전체 로드맵: `80% 안팎`

### 이번에 완료된 것
- [x] Firestore `generated_records` 저장
- [x] 생성 통계 허브(`/community`) 구현
- [x] 전략 성과 보드, 적중 분포, 많이 생성된 번호 요약
- [x] Firestore `lotto_draws` 컬렉션 구조 구현
- [x] `1회 ~ 1217회` 당첨번호 Firestore 초기 적재 완료
- [x] 보호된 내부 sync API 구현
- [x] Cloudflare 주간 sync Worker 배포 완료
- [x] Firestore rules / indexes 재배포 완료

### 현재 남은 핵심 작업
- [ ] Search Console 등록
- [ ] `sitemap.xml` 제출
- [ ] 모바일 실브라우저 QA
- [ ] 생성 통계 허브 모바일 QA
- [ ] 다음 일요일 cron 자동 반영 실제 확인

### 운영 메모
- 당첨번호 전체 seed 결과: `writtenCount = 1217`
- draw sync Worker URL: `https://lotto-maker-draw-sync.jes2751.workers.dev`
- cron schedule: `0 1 * * SUN`

## 1. 현재 달성률

- 초기 V1 MVP: `93~96%`
- 퍼블리시 전 목표: `88~92%`
- 전체 로드맵: `75~80%`

## 2. 완료된 핵심 항목

### 2-1. 서비스 기능
- [x] 홈
- [x] 번호 생성기
- [x] 회차 조회
- [x] 회차 상세
- [x] 통계 대시보드
- [x] 번호 상세 통계
- [x] 최신 결과 페이지
- [x] 회차 분석 허브
- [x] 정책/신뢰 페이지

### 2-2. 추천 전략
- [x] `random`
- [x] `frequency`
- [x] `mixed`
- [x] `filter`

### 2-3. SEO / 운영
- [x] `robots.txt`
- [x] `sitemap.xml`
- [x] 주요 랜딩 메타데이터
- [x] Firebase Analytics
- [x] AdSense 비노출 가드
- [x] Cloudflare Workers 배포 구조

### 2-4. 생성 통계
- [x] Firestore `generated_records`
- [x] 생성 결과 저장
- [x] 생성 통계 허브(`/community`)
- [x] 전략 성과 보드
- [x] 적중 분포
- [x] 많이 생성된 번호 요약

### 2-5. Firestore draw sync
- [x] `lotto_draws` 구조 정의
- [x] 전체 회차 seed 스크립트
- [x] 신규 회차 sync 스크립트
- [x] 보호된 내부 sync API
- [x] Cloudflare Cron Worker 설정 파일
- [x] Firestore rules/indexes 재배포

## 3. 남은 핵심 작업

### 3-1. Search Console
- [ ] `https://lotto-maker.cloud` 등록
- [ ] `sitemap.xml` 제출
- [ ] 주요 랜딩/분석 페이지 색인 요청

### 3-2. Firestore draw sync 운영
- [ ] 서비스 계정 환경변수 연결
- [ ] 전체 seed 실제 실행
- [ ] `lotto-maker-draw-sync` Worker 실제 배포
- [ ] Cron 실행 후 최신 회차 반영 확인

### 3-3. QA
- [ ] 생성 통계 허브 모바일 QA
- [ ] 전체 사이트 모바일 QA
- [ ] 실브라우저 배포 QA
- [ ] Analytics 실측 확인

## 4. 다음 우선순위

1. Firestore draw seed 실제 실행
2. draw sync Worker 배포
3. Search Console 등록 및 sitemap 제출
4. 모바일/실브라우저 QA

## 5. 후속 확장

- 번호 궁합 통계
- 고급 패턴 통계
- 그룹 추첨기
- 오늘의 운세 기반 추천 번호

## 6. 검증 기준

- [x] `npm test`
- [x] `npm run build`
- [ ] 실제 배포 URL QA
- [ ] Search Console 색인 확인
