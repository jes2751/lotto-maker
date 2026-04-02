# History

## 2026-04-02 20:25 KST
- 작업: 로컬 운영 환경변수 파일 추가
- 변경: `.env.local`에 사이트 URL, Firebase 웹 설정, GA 측정 ID, Firestore admin 자리표시자, draw sync secret 반영
- 검증: `.env.local`은 `.gitignore`에 포함되어 로컬 전용으로 유지
- 다음: Firebase 서비스 계정 이메일과 개인키 실제 값을 넣고 `npm run firestore:draws:seed` 실행

## 2026-04-01 20:00 KST
- 작업: 필터 추첨기 구현
- 변경: `filter` 전략에 고정수, 제외수, 홀짝, 합계, 연속번호 조건 추가
- 검증: `npm test`, `npm run build`
- 다음: 종합 통계 대시보드 고도화

## 2026-04-01 20:45 KST
- 작업: 종합 통계 대시보드 고도화
- 변경: 요약 카드, 패턴 요약, 최근 반복 번호, 비교 섹션 추가
- 검증: `npm test`, `npm run build`
- 다음: 정책/신뢰 페이지 구현

## 2026-04-01 21:10 KST
- 작업: 정책/신뢰 페이지 추가
- 변경: `privacy`, `terms`, `faq`, `contact`, `policies/ads` 구현
- 검증: `npm test`, `npm run build`
- 다음: 홈 하단 설명 섹션 추가

## 2026-04-01 21:35 KST
- 작업: 홈 설명 섹션 추가
- 변경: 서비스 소개, 이용 방법, FAQ 요약, 확률 안내 섹션 추가
- 검증: `npm test`, `npm run build`
- 다음: Search Console 준비

## 2026-04-01 21:50 KST
- 작업: Search Console 제출 준비
- 변경: note 문서와 색인 대상 경로 정리
- 검증: `npm test`, `npm run build`
- 다음: 회차 분석 허브 확장

## 2026-04-01 22:10 KST
- 작업: 회차 분석 허브 확장
- 변경: `/draw-analysis` 허브와 주요 내부 링크 정리
- 검증: `npm test`, `npm run build`
- 다음: 생성 통계 기능 시작

## 2026-04-02 02:15 KST
- 작업: 생성 결과 Firestore 저장
- 변경: 추천기에서 `generated_records` 저장
- 검증: `npm test`, `npm run build`
- 다음: 생성 통계 허브 구현

## 2026-04-02 03:10 KST
- 작업: 생성 통계 허브 구현
- 변경: `/community`를 생성 통계 허브로 전환하고 전략 성과 보드, 공개 생성 현황 추가
- 검증: `npm test`, `npm run build`
- 다음: Firestore rules와 외부 운영 연결

## 2026-04-02 04:00 KST
- 작업: Firestore 외부 배포 정리
- 변경: Firestore 기본 데이터베이스 생성, rules/indexes 배포, 인덱스 설정 정리
- 검증: Firebase CLI 배포 성공
- 다음: 생성 통계 시각화 보강

## 2026-04-02 04:35 KST
- 작업: 생성 통계 시각화 보강
- 변경: 전략 점유율, 적중 분포, 많이 생성된 번호 요약 추가
- 검증: `npm test`, `npm run build`
- 다음: Firestore 당첨번호 적재 구조 추가

## 2026-04-02 17:45 KST
- 작업: Firestore 당첨번호 적재 및 주간 sync 구조 추가
- 변경: `lotto_draws` 서버 쓰기 helper, 전체 seed/sync 스크립트, 보호된 sync API, Cloudflare Cron Worker 설정 추가
- 검증: `npm test`, `npm run build`
- 다음: Firestore rules 재배포와 운영 연결

## 2026-04-02 17:52 KST
- 작업: Firestore rules 재배포
- 변경: `lotto_draws` 읽기 규칙을 포함한 최신 `firestore.rules` 반영
- 검증: `firebase deploy --only firestore:rules,firestore:indexes --project lotto-maker-lab --non-interactive`
- 다음: 전체 draw seed 실행과 draw sync Worker 배포
## 2026-04-02 22:10 KST
- 작업: 생성 통계와 당첨번호 운영 상태 브리핑 정리
- 변경: `lotto_draws` 초기 적재 완료, 주간 sync Worker 배포 완료, 남은 운영 작업을 `plan`, `Technical_Spec`, `note`, `check_list` 상단에 반영
- 검증: `npm test` 통과, `npm run build` 통과, `npm run firestore:draws:seed` 성공
- 다음: Search Console 등록, 모바일 QA, 다음 일요일 cron 자동 반영 확인
