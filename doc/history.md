# History

## 2026-04-01 20:00 KST

- 작업: 필터 추첨기 구현
- 변경: `filter` 전략에 고정수, 제외수, 홀짝 조건, 합계 범위, 연속번호 허용 여부를 추가하고 UI와 API를 함께 연결함
- 검증: `npm test`, `npm run build` 통과
- 다음: 종합 통계 대시보드 고도화

## 2026-04-01 20:45 KST

- 작업: 홈 화면 정리
- 변경: 홈을 히어로, 최신 회차, 빠른 이동, 핵심 요약 중심으로 단순화함
- 검증: `npm test`, `npm run build` 통과
- 다음: 통계 화면 고도화

## 2026-04-01 21:10 KST

- 작업: 문서 구조 상향
- 변경: `Product_Spec.md`, `Technical_Spec.md`, `WORKFLOW.md`, `check_list.md`를 실행 문서 수준으로 재정리함
- 검증: 문서 기준과 실제 구현 방향 대조 완료
- 다음: 브랜드/메타데이터 정리

## 2026-04-01 21:35 KST

- 작업: 브랜드 통일
- 변경: 서비스명을 `Lotto Maker Lab` 기준으로 맞추고 메타데이터와 주요 표기를 통일함
- 검증: `npm test`, `npm run build` 통과
- 다음: 깨진 문서와 카피 복구

## 2026-04-01 22:25 KST

- 작업: 핵심 문서 UTF-8 복구
- 변경: `plan.md`, `Product_Spec.md`, `Technical_Spec.md`, `WORKFLOW.md`, `history.md`, `check_list.md`를 정상 한글로 재작성함
- 검증: IDE 기준 한글 표시 확인
- 다음: 종합 통계 대시보드 구현

## 2026-04-01 23:10 KST

- 작업: 종합 통계 대시보드 구현
- 변경: `/stats`를 요약 카드, 패턴 비교, 최근 반복 번호, 차트와 상위 번호 목록 중심으로 재구성함
- 검증: `npm test`, `npm run build` 통과
- 다음: 정책/신뢰 페이지 구현

## 2026-04-01 23:40 KST

- 작업: 정책/신뢰 페이지 추가
- 변경: `privacy`, `terms`, `faq`, `contact`, `policies/ads` 페이지와 푸터 링크를 정리함
- 검증: `npm test`, `npm run build` 통과
- 다음: 홈 하단 설명 섹션 추가

## 2026-04-01 23:55 KST

- 작업: 홈 하단 설명 섹션 구현
- 변경: 서비스 소개, 이용 방법, FAQ 요약, 확률 안내 섹션과 신뢰 링크를 홈에 추가함
- 검증: `.next` 캐시 정리 후 `npm test`, `npm run build` 통과
- 다음: Search Console 제출 준비 마감

## 2026-04-02 00:10 KST

- 작업: Search Console 제출 준비
- 변경: `note.md`에 제출 절차를 정리하고 sitemap/robots/검증 환경변수 기준을 문서화함
- 검증: `npm test`, `npm run build` 통과
- 다음: 회차 분석 페이지 확장

## 2026-04-02 00:35 KST

- 작업: 회차 분석 허브와 주요 랜딩 정리
- 변경: `/draw-analysis` 허브를 추가하고 홈, 최신 결과, 회차 상세를 정상 한글 카피와 분석 링크 중심으로 재작성함
- 검증: `npm test`, `npm run build` 통과
- 다음: Search Console 실제 제출과 색인 확인

## 2026-04-02 00:45 KST

- 작업: Google Analytics 측정 ID 변경
- 변경: 기본 GA 측정 ID와 `.env.example` 값을 `G-H6Z8MLCSYK`로 교체함
- 검증: 설정 변경만 반영
- 다음: 필요 시 배포 후 GA Realtime 확인
