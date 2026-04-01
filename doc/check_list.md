# Check List

## 1. 현재 달성률

- 초기 V1 MVP: `90~94%`
- `plan.md` 기준 퍼블리시 전 목표: `88~91%`
- 후속 확장까지 포함한 전체 로드맵: `65~70%`

## 2. 현재 완료된 핵심 기능

### 2-1. 화면

- [x] 홈
- [x] 번호 추천기
- [x] 회차 조회
- [x] 회차 상세
- [x] 번호 상세 통계
- [x] 종합 통계 대시보드
- [x] 회차 분석 페이지
- [x] 회차 분석 허브
- [x] 설명형 가이드 허브
- [x] 정책 / 신뢰 페이지

### 2-2. 추천 전략

- [x] `random`
- [x] `frequency`
- [x] `mixed`
- [x] `filter`

### 2-3. API

- [x] `GET /api/health`
- [x] `GET /api/v1/draws`
- [x] `GET /api/v1/draws/[round]`
- [x] `POST /api/v1/generate`
- [x] `GET /api/v1/stats/frequency`

### 2-4. SEO / 유입 준비

- [x] `robots.txt`
- [x] `sitemap.xml`
- [x] 공식 도메인 메타데이터 정리
- [x] 랜딩 페이지 허브
- [x] 회차 분석 페이지
- [x] Google Analytics
- [x] Search Console 제출용 문서와 검증 메타 기준

### 2-5. 운영 / 광고 준비

- [x] AdSense 비노출 가드
- [x] `ads.txt` 자리 준비
- [x] Cloudflare Workers 배포 설정
- [x] 로컬 우선 워크플로우 반영
- [x] UTF-8 문서 복구

## 3. 퍼블리시 전 남은 핵심 작업

### 3-1. Search Console / 색인

- [ ] Search Console 실제 등록
- [ ] `sitemap.xml` 제출
- [ ] 주요 랜딩 페이지 색인 요청
- [ ] 회차 분석 페이지 색인 요청

### 3-2. 퍼블리시 QA

- [ ] 모바일 QA
- [ ] 홈/추천기/통계/가이드 실제 동선 점검
- [ ] 광고 영역과 CTA 충돌 여부 확인
- [ ] 배포 URL 기준 최종 확인

### 3-3. 후속 기능 우선순위

- [ ] 번호 궁합 통계
- [ ] 고급 패턴 통계
- [ ] 오늘의 운세 기반 추천
- [ ] 그룹 추첨기

## 4. 지금 바로 할 일

1. Search Console에 `https://lotto-maker.cloud` 등록
2. `sitemap.xml` 제출
3. 홈, 최신 결과, 통계, 회차 분석 허브 색인 요청
4. 모바일/실브라우저 QA
5. 필요 시 퍼블리시용 커밋 후보 정리

## 5. 검증 기준

### 자동 검증

- [x] `npm test`
- [x] `npm run build`

### 수동 검증

- [ ] 홈 첫 화면 CTA와 최신 회차 카드 확인
- [ ] 추천기 필터 조건 생성 결과 확인
- [ ] 회차 조회, 회차 상세, 회차 분석 흐름 확인
- [ ] 통계 대시보드와 번호 상세 이동 확인
- [ ] 정책 페이지 링크와 Analytics 동작 확인

## 6. 상태 요약

- 지금 상태는 `기본판 완성 + 퍼블리시 직전 마감 단계`에 가깝다.
- 남은 핵심은 기능 구현보다 `색인 확보`와 `실브라우저 QA`다.
- 다음 큰 기능 확장은 Search Console 제출이 끝난 뒤 시작하는 편이 안전하다.
