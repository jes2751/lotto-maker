# History

## 2026-04-02 23:40 KST
- 작업: 홈과 핵심 페이지 정보 밀도 축소
- 변경:
  - 홈을 `최신 결과 + 번호 생성 + 핵심 통계` 중심으로 재구성
  - 생성기, 통계, 생성 통계 허브 상단 카피와 구조 정리
  - 공통 사이트 설명, 푸터, 차트/번호 세트 문자열 정상화
  - `Design_Guide`, `Product_Spec`, `check_list` 문서를 현재 구조에 맞게 재작성
- 검증:
  - `npm test`
  - `npm run build`
- 다음:
  - Search Console 등록
  - 모바일 QA

## 2026-04-02 22:10 KST
- 작업: 생성 통계와 당첨번호 동기화 상태 정리
- 변경:
  - `lotto_draws` 전체 적재 완료
  - 주간 draw sync Worker 배포 완료
  - 관련 운영 문서 업데이트
- 검증:
  - `npm test`
  - `npm run build`
  - `npm run firestore:draws:seed`
- 다음:
  - Search Console 등록
  - cron 실제 동작 확인

## 2026-04-02 20:25 KST
- 작업: 로컬 운영 환경 정리
- 변경:
  - `.env.local` 정리
  - Firestore admin / draw sync 환경변수 구조 정리
- 검증:
  - seed 실행 준비 확인
- 다음:
  - Firestore draw seed 실행
