# Lotto Maker Lab 계획 문서 v1.12

## 1. 서비스 요약

- 서비스명: `Lotto Maker Lab`
- 도메인: `https://lotto-maker.cloud`
- 핵심 포지션: `과거 당첨 데이터 기반 추천 + 회차 조회 + 통계 + 겹침 회피 관점의 번호 선택`
- 운영 원칙: 무료, 로그인 없이 핵심 기능 사용 가능, 추천 결과는 참고용

## 2. 현재 제품 방향

- 사용자가 가장 먼저 궁금해하는 것은 `최신 당첨번호`, `지금 바로 번호 생성`, `자주 보는 핵심 통계`다.
- 홈은 설명형 콘텐츠보다 `행동`, `최신성`, `핵심 요약`을 우선한다.
- 내부 운영 언어는 문서에서만 쓰고, 사용자 화면에는 노출하지 않는다.
  - 예: `검색 유입`, `재방문`, `랜딩`, `전환`, `퍼널`
- `커뮤니티`는 대화 공간이 아니라 `생성 통계` 기능으로 정의한다.

## 2-1. 디자인 방향

- 이 서비스의 디자인 목표는 `가볍게 시작하되, 통계와 겹침 회피 관점으로 더 현명하게 고르게 만드는 로또 도구`다.
- 첫 3초의 우선순위는 `흥미 -> 즉시 행동 -> 신뢰`다.
  - 흥미: 한번 눌러보고 싶게 만드는 문제 제기
  - 즉시 행동: 지금 번호를 바로 뽑거나 흐름을 바로 볼 수 있는 CTA
  - 신뢰: 최신 회차, 통계, 해석, 참고용 원칙이 뒤에서 받쳐주는 구조
- 단, `재미`가 제품 본체가 되면 안 된다.
  - 시작은 가볍게
  - 본체는 통계와 판단 보조
  - 카피와 구조는 항상 실용성을 잃지 않는 선에서 유지
- 시각 스타일은 단순히 고급스러워 보이는 것이 아니라 `즉시 행동`, `통계 탐색`, `살아 있는 최신성`, `합리적 선택`을 먼저 전달해야 한다.
- 첫 화면은 `하나의 장면`이어야 한다.
  - 최신 회차: 서비스가 살아 있다는 증거
  - 번호 생성 CTA: 사용자가 바로 눌러볼 이유
  - 핵심 통계: 왜 이 번호를 봐야 하는지 설명해주는 근거
- 브랜드 경험은 `가벼운 시작`과 `통계형 탐색`이 함께 있어야 한다.
  - 기본 경험: 지금 번호를 하나 뽑아보는 빠른 시작
  - 본체: 장기/최근 흐름, 번호 드릴다운, 회차 해석, 겹침 회피 관점
  - 신뢰 레이어: 최신 회차, 공개 통계, 참고용 원칙
- 이 서비스는 `당첨 확률을 올려준다`고 말하지 않는다.
  - 대신 `남들과 겹칠 가능성을 줄이는 관점`
  - `많이 선택될 법한 번호를 피하는 판단 보조`
  - `당첨 시 분산 리스크를 읽는 통계`
  를 제공하는 방향으로 간다.
- 시각 위계는 아래 순서를 따른다.
  - 홈: 히어로 -> 핵심 요약 -> 보조 이동
  - 생성기: 전략 선택 -> 생성 행동 -> 결과 확인
  - 통계: 요약 -> 핵심 번호 -> 비교 -> 해석
  - 생성 통계: 공개 현황 -> 전략 성과 -> 최근 흐름
- 색은 역할이 분명해야 한다.
  - `amber`: 주요 CTA, 즉시 행동
  - `teal`: 데이터 하이라이트, 링크, 상태
  - `silver`: 큰 제목, 제한된 강조
  - 로또 공 색: 번호 구분용, 브랜드 메인 컬러 역할 금지
- 감성 요소는 제품 전체에 고르게 뿌리지 않는다.
  - 가장 큰 감성 증폭 지점은 `공유 카드`
  - `스토리텔링형 스킨 생성기`는 코어 UX를 흐리지 않는 보조 모드로 제한
- `생성 통계`는 커뮤니티 대체재가 아니라 `공개 실험실` 포지션으로 본다.
  - 사람들이 실제로 어떤 전략으로 뽑는지 관측하는 화면
  - 숫자 자랑이 아니라 흐름을 읽는 화면

## 2-2. 디자인 성공 기준

- 사용자는 첫 화면 3초 안에 아래 3가지를 이해해야 한다.
  - 여기서 한번 눌러보고 싶다는 흥미가 생기는지
  - 어디서 바로 번호를 만들 수 있는지
  - 어떤 통계를 먼저 봐야 하는지
- 첫 화면이 `좋은 정보 구조`이기만 하고 `눌러보고 싶은 장면`이 아니면 실패다.
- 첫 화면이 지나치게 놀이형으로 보여 `근거 없는 랜덤 서비스`처럼 느껴져도 실패다.
- 첫 화면이 `최신 회차 패널`과 `서비스 소개 패널` 두 개의 메인처럼 보이면 실패다.
- 같은 진한 카드 스킨이 연속으로 반복되어 `대시보드 템플릿`처럼 보이면 실패다.
- 보조 텍스트가 읽히지 않아 정보가 장식으로 느껴지면 실패다.
- 헤더가 본문보다 더 눈에 띄어 첫 행동을 늦추면 실패다.

## 3. V1 목표

### 3-1. 핵심 기능

- 최신 당첨번호 확인
- 번호 생성
- 회차 조회
- 회차 상세
- 통계 대시보드
- 생성 통계 허브
- 회차 분석 페이지
- 정책/신뢰 페이지

### 3-2. 추천 전략

- `mixed`
- `frequency`
- `random`
- `filter`

### 3-3. 데이터 및 운영

- Firestore `generated_records`에 생성 결과 저장
- Firestore `lotto_draws`에 공식 당첨번호 저장
- 회차 조회/통계의 공식 읽기 경로는 체크인된 `local-draws.ts` 로컬 아카이브를 기준으로 유지
- 로컬 아카이브는 공식 결과를 직접 가져오는 주간 자동 스크립트로 갱신하고, 변경 시 Git push 후 배포 반영
- Firestore `lotto_draws`는 생성 통계 정산과 운영 보조 용도로만 유지
- 신규 회차 반영 시 해당 회차 생성 통계 자동 마감

### 3-4. 노출 원칙

- 광고는 AdSense 설정 전까지 노출하지 않는다.
- 추천 결과는 참고용이며 당첨을 보장하지 않는다.
- 내부 운영 목적을 드러내는 카피는 사용자 화면에 넣지 않는다.

## 4. 화면 구조 원칙

### 4-1. 홈

- 첫 화면에는 아래 3가지만 우선 노출한다.
  - 최신 당첨번호
  - 바로 번호를 뽑는 행동
  - 지금 봐야 할 통계 진입
- 홈 첫 화면은 `설명형 랜딩`이 아니라 `행동형 무대`여야 한다.
- 홈은 `한 번 눌러보고 싶은 흥미`를 먼저 만들고, 그 다음 `통계와 겹침 회피 관점으로 판단을 붙이는 흐름`으로 이어져야 한다.
- 홈의 차별점은 `번호 생성` 자체가 아니라 아래 질문을 던지는 데 있다.
  - 이 번호는 남들도 많이 고를까?
  - 같이 맞으면 더 많이 나눠 가져야 하는 조합일까?
  - 지금 군중이 몰리는 흐름은 어디일까?
- 홈 섹션 수는 가능한 한 적게 유지한다.
- 설명형 가이드와 정책 링크는 홈 하단이나 별도 페이지로 보낸다.

### 4-2. 생성기

- 전략 선택이 먼저다.
- 생성기는 `설정 화면`처럼 보이면 실패다.
- 생성기 상단은 `무엇을 누르면 어떤 성격의 번호가 나오는지`가 즉시 느껴져야 한다.
- 전략 카드는 단순 설명 카드가 아니라 `눌러보고 싶은 선택지`처럼 보여야 한다.
- 생성기의 차별점은 `번호를 만들어준다`가 아니라 `어떤 조합이 더 대중적일지 덜 대중적일지 생각하게 만든다`는 점이다.
- 생성 결과는 가능하면 아래 관점과 연결돼야 한다.
  - 장기/최근 흐름
  - 많이 선택될 가능성이 높은 번호
  - 상대적으로 덜 겹칠 가능성이 있는 조합
- `filter` 전략을 선택했을 때만 조건 패널을 연다.
- `mixed`, `frequency`, `random`에서는 필터 UI를 숨기고 전략 설명만 보여준다.
- 생성기는 `빠르게 선택하고 바로 생성`하는 흐름을 유지한다.

### 4-3. 통계

- 통계는 `보조 정보`가 아니라 이 서비스의 두 번째 코어 화면으로 본다.
  - 생성기는 바로 행동하는 화면
  - 통계는 번호를 고르기 전에 근거를 만드는 화면
- 통계는 딱딱한 리포트가 아니라 `지금 뜨는 번호와 군중이 몰릴 만한 흐름을 읽는 탐색 화면`처럼 보여야 한다.
- 통계 첫 화면은 `무슨 숫자가 많은지`보다 `어디부터 보면 되는지`를 먼저 알려줘야 한다.
- 통계는 사용자에게 명확히 두 축으로 보이게 분리한다.
  - `과거 1등 데이터`: 공식 당첨 기록 기반 통계
  - `우리 유저 데이터`: 실제 유저 생성 기록 기반 통계
- 통계는 아래 5개의 사용자 질문에 답해야 한다.
  - 어떤 번호가 전체적으로 많이 나왔는가
  - 최근 10회에서 흐름이 어떻게 바뀌고 있는가
  - 특정 번호는 지금 뜨는 번호인가, 쉬는 번호인가
  - 이번 회차는 평균적인 회차였는가, 튄 회차였는가
  - 번호를 고를 때 어떤 기준을 먼저 보면 되는가
- 추가로 아래 질문까지 확장할 수 있어야 한다.
  - 이 번호는 사람들이 좋아할 만한 조합인가
  - 당첨돼도 나눠 가질 가능성이 높은 흐름인가
  - 나는 지금 군중 쪽을 고르고 있는가, 비껴간 쪽을 고르고 있는가
- 한 화면에서 모든 통계를 다 보여주지 않는다.
- 통계 허브는 `요약 -> 탐색 -> 비교 -> 해석 -> 상세 이동` 순서로 읽혀야 한다.
- 사용자가 자주 보는 요약부터 먼저 보여준다.
  - 자주 나온 번호
  - 적게 나온 번호
  - 최근 10회 흐름
  - 홀짝 비율
  - 합계 요약
  - 연속번호 출현 흐름
- 통계는 아래 구조로 분리한다.
  - `/stats`: `과거 1등 데이터` 허브, 공식 당첨 기록 기준 장기 흐름과 최근 흐름 비교의 중심
  - `/generated-stats`: `우리 유저 데이터` 허브, 실제 유저 생성 기록 기준 전략 점유율과 번호 쏠림 관찰의 중심
  - `/stats/numbers/[number]`: 특정 번호 드릴다운, 최근 포함 회차와 장단기 빈도 확인
  - `/hot-numbers`, `/cold-numbers`: 빠르게 보는 핵심 번호 랭킹 허브
  - `/odd-even-pattern`, `/sum-pattern`: 패턴 중심 설명형 통계
  - `/recent-10-draw-analysis`: 단기 흐름 전용 페이지
  - `/draw-analysis`, `/draw-analysis/[round]`: 회차 단위 해석 허브와 상세
- 통계 허브의 상단 KPI는 최소 아래 항목을 고정한다.
  - 비교 기준 회차 수
  - 평균 합계
  - 대표 홀짝 비율
  - 대표 합계 구간
- 통계 허브의 중단 탐색 블록은 최소 아래 항목을 포함한다.
  - 가장 자주 나온 번호
  - 가장 적게 나온 번호
  - 최근 반복 번호
  - 장기 vs 단기 비교
- 통계 허브의 하단 해석 블록은 단순 설명이 아니라 `어떻게 읽어야 하는지`를 알려줘야 한다.
  - 장기 통계와 단기 통계를 함께 봐야 하는 이유
  - 패턴 통계와 번호 통계의 차이
  - 추천과 통계의 관계, 과신 방지 문구

### 4-3-1. 통계 강화 패키지

- 현재 통계는 `요약은 되지만 깊이는 약한 상태`로 판단한다.
- 아래 항목을 통계 강화 우선순위로 묶는다.
  - `번호 드릴다운 강화`
    - 특정 번호의 전체/최근 10회 빈도만이 아니라 마지막 출현 회차, 최근 5개 포함 회차, 관련 이동을 함께 보여준다.
  - `패턴 해석 강화`
    - 홀짝, 합계, 연속번호를 각각 따로 보여주는 수준을 넘어서, 이번 회차가 평균 대비 어떤 위치인지 해석 문장으로 붙인다.
  - `비교 시나리오 강화`
    - 전체 회차 vs 최근 10회 외에도, 최신 회차와 최근 흐름을 바로 이어서 읽을 수 있게 회차 분석 허브와 연결한다.
  - `겹침 회피 관점 추가`
    - 생성 통계와 연결해 사람들이 많이 생성한 번호, 자주 함께 생성된 번호, 상대적으로 덜 보이는 번호를 볼 수 있게 한다.
    - `당첨 확률`이 아니라 `분산 리스크` 관점의 설명 문구를 붙인다.
  - `탐색 진입 강화`
    - 통계 허브에서 `자주 나온 번호`, `적게 나온 번호`, `최근 10회 분석`, `회차 분석`으로 바로 분기되게 한다.
  - `신뢰 문구 강화`
    - 통계는 예측기가 아니라 판단 보조 도구라는 설명을 반복하지 말고, 상단과 해석 블록 한 번씩만 명확히 둔다.
- 통계 강화 이후 사용자가 느껴야 할 변화는 아래와 같다.
  - 단순히 숫자 몇 개를 보는 화면이 아니라 `읽을 거리`가 있는 화면
  - 특정 번호와 특정 회차를 오가며 탐색할 수 있는 화면
  - 생성기와 자연스럽게 왕복하는 화면
  - `과거 1등 데이터`와 `우리 유저 데이터`를 비교해 더 입체적으로 판단하는 화면

### 4-3-2. 통계 성공 기준

- 사용자는 `/stats` 첫 화면에서 5초 안에 아래를 이해해야 한다.
  - 지금 보고 있는 기준이 전체 회차인지 최근 10회인지
  - 가장 먼저 볼 핵심 번호가 무엇인지
  - 다음에 어디로 들어가면 더 깊게 볼 수 있는지
- 사용자가 `/stats`에 들어왔는데 `숫자가 많긴 한데 뭘 봐야 하는지 모르겠다`고 느끼면 실패다.
- 번호 상세 페이지가 단순 빈도 확인에서 끝나고 회차 탐색으로 이어지지 않으면 실패다.
- 패턴 페이지가 설명형 블로그처럼 길기만 하고 실제 생성 행동으로 이어지지 않으면 실패다.
- 회차 분석 허브가 통계 체계와 분리된 별도 콘텐츠처럼 보이면 실패다.

### 4-4. 생성 통계

- 생성 통계는 대화형 커뮤니티가 아니다.
- 아래 항목을 중심으로 공개 현황을 보여준다.
  - 이번 회차 총 생성 수
  - 전략 점유율
  - 전략 성과 보드
  - 적중 분포
  - 최근 생성 번호 일부
- 생성 통계는 `사람들이 실제로 어디에 몰리는지`를 읽는 관점으로 강화한다.
  - 많이 생성된 번호
  - 자주 같이 묶이는 번호
  - 상대적으로 덜 선택되는 번호
  - 특정 전략에서 반복되는 성향

### 4-5. 차후 확장: 스토리형 선택기

- `스토리형 선택기`는 V1 코어가 아니라 차후 확장 항목으로 둔다.
- 목적은 단순 랜덤 추천이 아니라, 사용자가 가볍게 시작할 수 있는 감정형 진입 모드를 만드는 것이다.
- 예시 방향:
  - 오늘의 감 선택기
  - 분위기/성향 선택기
  - 간단한 질문 기반 선택기
- 중요한 원칙은 아래와 같다.
  - 본체는 계속 `통계 + 겹침 회피 + 판단 보조`
  - 스토리형 선택기는 입구 역할만 한다
  - 결과는 반드시 기존 생성기 전략 또는 통계 화면과 연결된다
  - 예측, 운세, 당첨 보장처럼 읽히는 표현은 금지한다
- 즉, `재미를 위한 별도 모드`는 가능하지만 `서비스 본체를 감성형으로 바꾸는 것`은 하지 않는다.

## 5. 최근 반영된 UX 결정

- 홈은 `최신 번호 + 빠른 이동 + 핵심 통계` 중심으로 단순화한다.
- 푸터는 브랜드 소개를 위에 두고, 아래에 `서비스`, `정책` 링크를 나란히 둔다.
- 번호 표기에서 보너스 번호는 `+`로 연결해 한 줄 흐름으로 보여준다.
- 작은 텍스트는 과도하게 작게 쓰지 않는다.
- 적중 분포 카드처럼 의미 없는 큰 공백이 생기지 않게 레이아웃을 조정한다.

## 5-1. 디자인 리뷰 반영 결정

- 홈 첫 화면은 `단일 히어로` 구조로 재정의한다.
  - 좌측: 브랜드, 핵심 문장, CTA
  - 우측: 최신 회차, 날짜, 번호, 상세 링크
  - mobile: 위아래로 접되 하나의 장면처럼 읽히게 유지
- `빠른 시작`, `핵심 요약`, `가이드/서비스 안내`는 모두 같은 카드 문법으로 처리하지 않는다.
  - 이동 섹션은 더 가볍게
  - 데이터 섹션은 더 밀도 있게
  - 보조 링크 섹션은 시각 강도를 낮춘다
- 다크 모드 보조 텍스트 대비를 올린다.
  - 빈도 수치, 설명, 법적 문구는 `읽히는 보조 정보` 수준으로 유지
- 스티키 헤더는 축소한다.
  - 큰 로고, 긴 설명, 방문자 수, 메뉴가 한 번에 경쟁하지 않게 정리
- 감성은 `공유 카드`에서 가장 강하게 사용하고, 코어 화면은 실용성과 신뢰를 우선한다.

## 6. SEO 및 유입 방향

- 검색용 페이지는 실제 사용자 질문에 답하는 구조로 만든다.
- 대표 경로
  - `/latest-lotto-results`
  - `/lotto-number-generator`
  - `/lotto-statistics`
  - `/hot-numbers`
  - `/cold-numbers`
  - `/odd-even-pattern`
  - `/sum-pattern`
  - `/recent-10-draw-analysis`
  - `/draw-analysis`
  - `/draw-analysis/[round]`
  - `/guides` 및 하위 문서 (`/guides/lotto-number-generator-vs-random` 등)
  - `/faq` (자주 묻는 질문)
  - `/privacy`, `/terms`, `/contact`, `/policies/ads` (운영 및 정책)
- Search Console, sitemap, robots는 운영 필수 항목이다.

## 7. 현재 완료 상태

- 핵심 화면과 추천 전략 4종 구현 완료
- 생성 통계 저장/집계 구현 완료
- `lotto_draws` 초기 적재 완료
- 주간 draw sync Worker 배포 완료
- 정책/신뢰 페이지 구현 완료
- 홈/생성기/통계/생성 통계 허브 단순화 진행 완료

## 8. V1 런칭 확정 태스크 (Selective Expansion)

### 8-1. 성장 및 리텐션 10x 레버리지 (신규 합의)
- **바이럴 공유 카드 (Viral Share Card):** 번호 생성 후 결과 화면을 프리미엄 짙은 블랙 티켓 형태의 이미지(Canvas/OG)로 렌더링 후 캡처해 주변에 자랑할 수 있는 기능.
- **내 당첨 확인기 (QR 스캔/직접 입력):** 구매한 실물 로또의 QR 코드를 찍거나 번호를 직접 입력하면 당첨 여부를 직관적인 V1 UI 테마에 맞게 보여주는 강력한 리텐션 도구.
- **스토리텔링형 스킨 생성기:** 딱딱한 난수 생성이 아닌 '오늘의 운세', '꿈 키워드' 등 감성적인 테마를 입힌 생성기 UX 모드 추가.

### 8-2. 기존 잔여 마감 태스크
- **통계 강화 패키지:** `/stats`를 단순 요약판이 아니라 탐색 허브로 올리고, 번호 상세/패턴 페이지/회차 분석 허브 사이 이동 문법을 강화.
  - 번호 상세에 마지막 출현 회차, 최근 포함 회차, 관련 이동 CTA 보강
  - 통계 허브에 연속번호 흐름과 최근 반복 번호 해석 강화
  - 통계 허브와 `draw-analysis`, `recent-10-draw-analysis` 사이의 상호 링크 구조 정리
- **동적 OpenGraph 이미지:** 링크 공유 시 최신 회차나 생성 결과 공이 그대로 뜨도록 정적 SEO를 넘어선 동적 SEO 도입.
- **초경량 시각화:** `생성 통계 허브`와 `회차 분석` 페이지에 무거운 JS 차트 라이브러리 대신, CSS와 DOM 기반의 최소한의 초경량 히스토그램 시각화 탑재 (Bundle Size 폭증 방어).
- **SEO 및 최적화:** Search Console 등록 및 Sitemap 동적 구성.
- UI/모바일 기기 엣지 케이스 QA 파이널 체크.

### 8-3. 긴급 로직 결함 수정 (Eng Review)
- **생성 확률 편향 버그 픽스:** `generation.ts`의 `createFilterNumbers` 내 정렬 후 슬라이싱 로직으로 인해 혼합/빈도 전략 사용 시 작은 숫자만 추출되는 치명적 확률 붕괴 문제 수정.
- **캐시 영구화 버그 픽스:** `repository.ts`의 `this.drawsPromise` 싱글톤이 Next.js 서버 환경에서 영구 유지되면서 최신 회차가 실시간 반영되지 않는 문제(SPOF 타파 파편화) 해결.
- **클라이언트 DB 직결(과금 폭탄) 버그 픽스:** `plan.md`의 Rate Limit 방어 명시와 달리, `client.ts`에서 Client SDK(`addDoc`)를 통해 Firestore에 직접 쓰는 것이 확인됨. 악의적 트래픽에 무방비이며 `firestore.rules`의 취약점 검증도 미비하므로, Next.js API Route로 프록시하여 서버사이드 Rate Limit 적용 후 Admin SDK로 저장하도록 구조 변경.

## ~9. 엔지니어링 리스크 및 방어 아키텍처 (Technical Debt & Scale)~ [V1 완료]

현재 시스템은 트래픽 스케일업 및 외부 의존성 보호를 위한 아키텍처가 완전히 확보되었습니다.
- **[완료] SPOF 해소:** 외부 정적 JSON에 의존하지 않고, 내부 Firestore 데이터를 6시간 주기로 캐시(unstable_cache)하여 Cloudflare 상에서 0ms 수준으로 제공.
- **[완료] Firestore 남용 방어:** In-Memory Map을 통한 Rate Limiting을 도입하여 분할된 단일 Worker Isolate 당 10분/50회 제한으로 악성 봇 Write 방어 구축.
- **[완료] Zero Defect 검증:** `node:test` 네이티브 런너를 통해 생성기의 불가능한 수학적 예외 및 무한 루프 엣지 케이스 테스트 통과 완료.

## 10. 후속 확장
- 조합 간 궁합 분석, 고급 미출현 마르코프 패턴 통계 등
- 스토리형 선택기
  - 짧은 질문/분위기 선택으로 진입하되 결과는 기존 생성 전략과 통계로 연결

## 2026-04-14 생성 통계 집계 구조 개편안

### 목표
- `사람들 선택`은 `최근 240개 샘플`이 아니라 `이번 회차 전체 생성 흐름`을 반영해야 한다.
- 화면은 `원본 기록 전체 조회` 대신 `회차 집계 문서`를 읽어 비용과 실시간 구독 부담을 낮춘다.
- `현재 회차 군중 흐름`과 `직전 회차 성과 평가`를 데이터 모델 차원에서 분리한다.
- `번호는 생성됐지만 통계 저장은 실패` 같은 부분 성공 상태를 구조적으로 막는다.
- 사용자가 이 페이지를 믿을 수 있도록 `이번 회차 전체 기준`, `마지막 집계 시각`, `참여 세트 수`를 화면의 1급 정보로 노출한다.
- 사용자가 자신의 번호를 군중 흐름과 바로 비교할 수 있도록 `내 번호 vs 사람들 선택` 비교 경험을 추가한다.

### 결정
- `주간 문서` 대신 `회차 문서`를 기준으로 한다.
- 원본 기록은 계속 `generated_records`에 저장한다.
- 집계 문서는 아래 2층 구조로 분리한다.
  - `generated_round_stats/{targetRound}`: 이번 회차 군중 흐름 전용
  - `generated_round_results/{round}`: 당첨 후 성과 평가 전용
- 중복 집계 방지를 위해 `generated_requests/{requestId}` idempotency ledger를 추가한다.
- 생성 통계 write는 `클라이언트 직접 Firestore write 금지`, `서버 전용 write`로 고정한다.

### 왜 240개 샘플 방식이 제품 의미와 안 맞는가
- 사용자가 `사람들 선택`에서 기대하는 것은 `이번 회차 전체 군중 흐름`이지 `최근 일부 공개 기록 추정치`가 아니다.
- 지금 방식은 [generated-stats-dashboard.tsx](/C:/Users/jes27/OneDrive/code/lotto_v2/src/components/generated-stats/generated-stats-dashboard.tsx:20) 와 [admin.ts](/C:/Users/jes27/OneDrive/code/lotto_v2/src/lib/firebase/admin.ts:585) 에서 최근 `240`건만 읽기 때문에, 기록이 누적되면 같은 회차라도 오래된 생성이 통계에서 탈락한다.
- 제품 카피는 전체 의미를 말하고 있는데 구현은 샘플링이라서, 수치가 틀리지 않아도 사용자 기대와 어긋난다.

### 왜 주간 문서가 아니라 회차 문서인가
- 서비스 언어가 `이번 주`보다 `1219회`, `1220회` 기준으로 움직인다.
- 생성 기록도 이미 `targetRound`를 가지고 있다.
- 당첨 결과 정산도 회차 단위로 닫힌다.
- `/generated-stats` 화면의 KPI와 카피도 회차 기준이 더 자연스럽다.

### What Already Exists
- 서버 생성 경로는 이미 있다.
  - `/api/v1/generate`에서 번호 생성 후 raw record 저장을 시도한다.
- `/generated-stats` SSR + 클라이언트 구독 화면도 이미 있다.
  - 현재는 raw record 최근 240건을 가져와 브라우저에서 요약한다.
- 정산 경로도 이미 있다.
  - draw sync가 `generated_records`를 평가해 `matchedRound`, `matchCount`, `bonusMatched`, `settledAt`를 기록한다.
- 즉 이번 설계는 `새 기능을 처음 만드는 것`이 아니라, `기존 raw log 중심 구조 위에 안정적인 aggregate 계층을 얹는 것`이다.

### 데이터 모델
- idempotency ledger:
  - `generated_requests/{requestId}`
  - 역할:
    - 동일 생성 요청 재시도 시 중복 집계 방지
    - 서버 응답 재사용 기준
  - 필수 필드:
    - `requestId`
    - `anonymousId`
    - `targetRound`
    - `setCount`
    - `status` (`pending` | `committed` | `failed`)
    - `recordIds`
    - `createdAt`
    - `committedAt`
- raw log:
  - `generated_records/{recordId}`
  - 역할:
    - 생성된 개별 번호 세트 원본 기록
    - 최근 공개 카드 source
    - 정산 source of truth
    - backfill source
- current round aggregate:
  - `generated_round_stats/{targetRound}`
  - 필수 필드:
    - `schemaVersion`
    - `targetRound`
    - `sourceRecordCount`
    - `totalGenerated`
    - `strategyCounts`
    - `numberCounts`
    - `topNumbers`
    - `updatedAt`
    - `computedAt`
    - `latestGeneratedAt`
    - `lastHealthySnapshotAt`
  - 선택 필드:
    - `oddEvenCounts`
    - `sumRangeCounts`
    - `pairCountsTopN`
    - `allowConsecutiveCounts`
    - `lastCommittedRequestId`
    - `topColdNumbers`
    - `medianOverlapScore`
- evaluated round aggregate:
  - `generated_round_results/{round}`
  - 필수 필드:
    - `schemaVersion`
    - `round`
    - `sourceRecordCount`
    - `computedAt`
    - `settledAt`
    - `totalEvaluated`
    - `matchDistribution`
    - `strategyPerformance`
    - `threePlusHits`
    - `fourPlusHits`
    - `bonusHits`

- local client state:
  - `recentGeneratedComparison`
  - 역할:
    - 로그인 없이도 가장 최근 생성한 세트와 crowd aggregate를 비교
    - `/generate` 결과 화면과 `/generated-stats`에서 동일 카드 재사용
  - 저장 기준:
    - `anonymousId`
    - `requestId`
    - `targetRound`
    - `sets`
    - `savedAt`

### 생성 write 경로
- 클라이언트는 버튼 클릭마다 `requestId`를 한 번 생성해 `/api/v1/generate`로 보낸다.
- 클라이언트는 더 이상 Firestore에 `generated_records`를 직접 쓰지 않는다.
- 서버는 `recordId = ${requestId}:${setIndex}` 규칙으로 안정적인 문서 id를 만든다.
- 서버는 아래 흐름을 `하나의 원자적 commit/transaction`으로 처리한다.

```text
client click
  -> POST /api/v1/generate(requestId)
  -> server validates + generates sets
  -> check generated_requests/{requestId}
     -> exists: return cached result, do not re-aggregate
     -> missing: continue
  -> atomic commit
     -> create generated_requests/{requestId} (pending -> committed)
     -> create generated_records/{requestId}:{index} docs
     -> update generated_round_stats/{targetRound} counters
  -> compute per-set crowd comparison from updated aggregate
  -> response(statsRecorded=true, crowdComparison)
```

- 원자적 commit이 불가능한 구현이라면 rollout하지 않는다.
  - raw log 저장과 round stats 반영이 분리되면 부분 성공으로 다시 깨진다.
- `/api/v1/generated-records`는 공개 경로로 계속 쓰지 않는다.
  - 필요하면 internal backfill/admin 전용으로만 제한한다.
- 생성 응답에는 최소 1개의 비교 payload를 포함한다.
  - 예:
    - `overlapWithTop10`
    - `hotNumberCount`
    - `coldNumberCount`
    - `crowdBiasLabel` (`crowded` | `balanced` | `contrarian`)
    - `comparedAgainstTotalGenerated`

### 읽기 경로
- `/generated-stats` SSR:
  - `generated_round_stats/{currentTargetRound}` 1문서
  - `generated_round_results/{latestDraw.round}` 1문서
  - `generated_records where targetRound == currentTargetRound order by generatedAt desc limit 4~12`
- 클라이언트 실시간 구독:
  - 기본은 `generated_round_stats/{currentTargetRound}` 1문서
  - 최근 카드가 필요하면 raw recent query를 별도로 짧게 구독
- 마이그레이션 중 fallback:
  - aggregate doc이 없으면 `최근 240개 샘플`로 후퇴하지 않는다.
  - 서버가 `이번 회차 전체 raw record`를 읽어 on-demand aggregate를 계산하고 self-heal write를 시도한다.
  - 그마저도 실패하면 `집계 준비 중` 상태를 보여주고 숫자 `0`으로 오해시키지 않는다.
  - 가능하면 마지막 정상 스냅샷 시각을 함께 보여준다.

### 신뢰 계약 UI
- `/generated-stats` 상단 KPI 영역에 아래 3개를 고정 노출한다.
  - `이번 회차 전체 기준`
  - `마지막 집계 시각`
  - `참여 세트 수`
- fallback 상태에서는 문구를 아래처럼 바꾼다.
  - 정상: `1220회 전체 생성 1,284세트 기준`
  - 복구 중: `1220회 집계 복구 중, 마지막 정상 스냅샷 11:37`
- 사용자가 샘플 화면으로 오해하지 않도록 `최근 공개 카드`와 `핵심 KPI`의 정보 출처를 시각적으로 분리한다.

#### 구현 방법
- 서버 데이터 소스:
  - `src/lib/firebase/admin.ts`
    - `getGeneratedRoundStats(targetRound)` 추가
    - 반환 타입에 `totalGenerated`, `computedAt`, `latestGeneratedAt`, `lastHealthySnapshotAt`, `sourceRecordCount` 포함
  - `src/app/generated-stats/page.tsx`
    - 기존 `listGeneratedRecords()` 중심 SSR을 `getGeneratedRoundStats(currentTargetRound)` + recent raw records 조회로 분리
    - aggregate doc이 없을 때만 `buildRoundStatsFromRecords(records)` 같은 server-side fallback helper 호출
- 클라이언트 렌더:
  - `src/components/generated-stats/generated-stats-dashboard.tsx`
    - props에 `roundStats`, `roundResults`, `recentComparison` 추가
    - 상단 첫 패널을 `trust bar + KPI grid` 구조로 재배치
  - 새 표시 규칙:
    - `전체 기준`: `roundStats.targetRound` + `roundStats.totalGenerated`
    - `마지막 집계 시각`: `roundStats.computedAt`
    - `참여 세트 수`: `roundStats.sourceRecordCount`
    - fallback 시 `roundStats === null`이 아니라 `status: "recovering"` 상태를 명시적으로 렌더
- 타입/포맷 helper:
  - `src/lib/generated-stats/shared.ts`
    - `GeneratedRoundStatsSnapshot` 타입 추가
    - `formatAggregateTimestamp()` 같은 표시용 helper 추가
- 복구 중 UX:
  - `status === "recovering"`이면 숫자 칸을 비우지 말고 마지막 정상 스냅샷 시각과 함께 별도 배지 노출
  - `status === "ready"`와 시각적으로 다른 tone을 사용해 “오류”와 “복구 중”을 구분

```text
generated-stats page SSR
  -> read latest draw
  -> read round stats doc
     -> exists: pass trust snapshot to dashboard
     -> missing: recompute from full round raw records
         -> if success: write self-heal doc and pass recovering snapshot
         -> if fail: pass recovering snapshot without fake zeroes
  -> read recent cards
  -> render trust bar + crowd board
```

### 내 번호 vs 사람들 선택
- 생성 직후 `/generate` 결과 화면에서 각 세트에 crowd comparison badge를 붙인다.
  - 예: `사람들이 많이 겹친 조합`, `균형형`, `역배형`
- `/generated-stats`에서도 사용자가 가장 최근 생성한 세트를 다시 불러와 같은 비교 카드를 보여준다.
- 이 비교는 로그인 기능을 추가하지 않고 `anonymousId + recentGeneratedComparison` local state로 처리한다.
- 비교 로직은 현재 회차 aggregate 기준으로 계산한다.
  - `top 10 인기 번호와 겹친 개수`
  - `상위 과열 번호 포함 수`
  - `비인기 번호 포함 수`
  - 필요하면 단순 점수 하나로 요약
- 목표는 예측 정확도 주장이 아니라 `내 세트가 군중과 얼마나 비슷한가`를 바로 이해하게 만드는 것이다.

#### 구현 방법
- 응답 계약:
  - `src/app/api/v1/generate/route.ts`
    - 응답 payload에 `requestId`, `crowdComparison`, `statsSnapshot` 추가
    - `crowdComparison`은 세트별 배열로 반환
  - 세트별 비교 구조 예시:
    - `setId`
    - `overlapWithTop10`
    - `hotNumberCount`
    - `coldNumberCount`
    - `crowdBiasLabel`
    - `comparedAgainstTotalGenerated`
- 서버 계산:
  - `src/lib/generated-stats/shared.ts`
    - `computeCrowdComparison(set, roundStats)` helper 추가
    - 기준 규칙:
      - `overlapWithTop10 >= 4`면 `crowded`
      - `hotNumberCount`와 `coldNumberCount`가 비슷하면 `balanced`
      - `coldNumberCount >= 3` 또는 `overlapWithTop10 <= 1`이면 `contrarian`
    - 비교 로직은 숫자 count 기반의 단순 규칙으로 시작하고, 모델 점수화는 후순위
- 생성 직후 표시:
  - `src/components/lotto/generator-panel.tsx`
    - 현재 `payload.data.sets`만 쓰는 흐름에 `payload.data.crowdComparison` 매핑 추가
    - 각 결과 카드 하단에 comparison badge와 한 줄 설명 추가
    - `recordGeneratedSets` fallback 호출은 제거 대상이므로, comparison 저장도 여기서 함께 처리
- 최근 비교 상태 저장:
  - `src/lib/generated-stats/client.ts`
    - direct Firestore write 로직 대신 `recentGeneratedComparison` localStorage helper로 역할 축소
    - 새 storage key 예시: `lotto-lab-recent-generated-comparison`
    - 저장 payload:
      - `anonymousId`
      - `requestId`
      - `targetRound`
      - `sets`
      - `crowdComparison`
      - `savedAt`
- generated-stats 재사용:
  - `src/app/generated-stats/page.tsx`
    - SSR에서는 비교 카드를 만들지 않고, 클라이언트가 localStorage에서 최근 비교 상태를 읽어 dashboard에 주입
  - `src/components/generated-stats/generated-stats-dashboard.tsx`
    - `recentComparison`이 현재 회차와 같을 때만 `내 번호 vs 사람들 선택` 카드 렌더
    - 회차가 다르면 조용히 숨김

```text
generate flow
  -> POST /api/v1/generate
  -> receive sets + crowdComparison + statsSnapshot
  -> render result cards with comparison badges
  -> persist recentGeneratedComparison to localStorage

generated-stats flow
  -> SSR renders trust snapshot + crowd board
  -> client loads recentGeneratedComparison from localStorage
  -> if targetRound matches current round
       -> render "내 번호 vs 사람들 선택"
     else
       -> hide card
```

#### 파일 단위 작업 범위
- `src/app/api/v1/generate/route.ts`
  - requestId 입력, comparison payload 응답
- `src/lib/firebase/admin.ts`
  - round stats fetch / self-heal read helper
- `src/lib/generated-stats/shared.ts`
  - aggregate snapshot 타입, comparison 계산 helper
- `src/lib/generated-stats/client.ts`
  - recent comparison localStorage helper로 축소
- `src/components/lotto/generator-panel.tsx`
  - 생성 직후 비교 badge 렌더
- `src/app/generated-stats/page.tsx`
  - aggregate-first SSR 데이터 주입
- `src/components/generated-stats/generated-stats-dashboard.tsx`
  - trust bar, recent comparison card 렌더

### 구현 작업 분할

#### Track 1. 쓰기 경로 안전화
- 목표:
  - 생성 기록 저장 경로를 `/api/v1/generate` 단일 경로로 고정
  - `requestId`와 atomic commit 기반으로 중복 집계/부분 성공 제거
- 수정 범위:
  - `src/app/api/v1/generate/route.ts`
  - `src/lib/firebase/admin.ts`
  - `src/lib/generated-stats/client.ts`
  - 관련 API 테스트
- 산출물:
  - `generated_requests/{requestId}` ledger
  - deterministic `recordId`
  - 브라우저 direct Firestore write 제거
- 완료 조건:
  - 같은 `requestId` 재시도 시 raw/aggregate 증가가 1회로 유지
  - write 실패 시 partial state 없음

#### Track 2. aggregate read 전환
- 목표:
  - `/generated-stats`를 raw sample 기반이 아니라 aggregate-first 구조로 전환
  - aggregate doc 미존재 시 `집계 준비 중` 또는 self-heal fallback 적용
- 수정 범위:
  - `src/app/generated-stats/page.tsx`
  - `src/lib/firebase/admin.ts`
  - `src/lib/generated-stats/shared.ts`
  - `src/components/generated-stats/generated-stats-dashboard.tsx`
  - 페이지 렌더 테스트
- 산출물:
  - `getGeneratedRoundStats(targetRound)`
  - server-side fallback recompute helper
  - raw recent cards와 KPI source 분리
- 완료 조건:
  - aggregate doc 존재 시 전체 회차 수치 노출
  - aggregate doc 미존재 시 `0건` 오해 없음

#### Track 3. 신뢰 계약 UI
- 목표:
  - 사용자가 첫 화면에서 “전체 기준인지, 언제 갱신됐는지” 바로 이해
- 수정 범위:
  - `src/components/generated-stats/generated-stats-dashboard.tsx`
  - `src/lib/generated-stats/shared.ts`
  - `src/app/generated-stats/page.tsx`
  - 페이지 렌더 테스트
- 산출물:
  - trust bar
  - `전체 기준 / 마지막 집계 시각 / 참여 세트 수`
  - fallback 시 마지막 정상 스냅샷 표시
- 완료 조건:
  - 첫 화면 3초 이해 기준 충족
  - 정상/복구중 상태 시각 구분 가능

#### Track 4. crowd comparison 계산/응답
- 목표:
  - 생성 직후 각 세트에 crowd comparison 값을 서버가 계산해 내려줌
- 수정 범위:
  - `src/lib/generated-stats/shared.ts`
  - `src/app/api/v1/generate/route.ts`
  - 생성 API 테스트
- 산출물:
  - `computeCrowdComparison(set, roundStats)`
  - `crowdComparison` response contract
  - `crowded / balanced / contrarian` label 규칙
- 완료 조건:
  - 생성 응답에 세트별 비교 payload 포함
  - 비교 규칙이 현재 회차 aggregate 기준으로 고정

#### Track 5. 생성 화면 비교 카드
- 목표:
  - `/generate` 결과 화면에서 내 세트가 군중형인지 바로 보이게 함
- 수정 범위:
  - `src/components/lotto/generator-panel.tsx`
  - 필요 시 결과 카드 관련 컴포넌트
  - UI 렌더 테스트
- 산출물:
  - comparison badge
  - 한 줄 설명
  - `recentGeneratedComparison` localStorage 저장
- 완료 조건:
  - 생성 직후 모든 세트에 비교 결과 표시
  - 새로고침 후에도 최신 비교 상태 복구 가능

#### Track 6. generated-stats 재사용 카드
- 목표:
  - `/generated-stats`에서 최근 내 세트와 crowd board를 다시 비교
- 수정 범위:
  - `src/lib/generated-stats/client.ts`
  - `src/components/generated-stats/generated-stats-dashboard.tsx`
  - `src/app/generated-stats/page.tsx`
  - UI 테스트
- 산출물:
  - localStorage read helper
  - `내 번호 vs 사람들 선택` 카드
  - 회차 mismatch 시 숨김 규칙
- 완료 조건:
  - 현재 회차와 local comparison 회차가 같을 때만 카드 노출
  - 회차가 다르면 조용히 숨김

#### Track 7. 정산/백필 정리
- 목표:
  - 결과 집계를 회차 단위로 순차 재계산하고 운영 복구 경로 확보
- 수정 범위:
  - `src/lib/data/firestore-draw-sync.ts`
  - `src/lib/firebase/admin.ts`
  - backfill script
  - draw sync 테스트
- 산출물:
  - `generated_round_results/{round}` full recompute
  - backfill script
  - single writer 원칙
- 완료 조건:
  - draw sync 후 raw settled count와 results aggregate 총량 일치
  - backfill 이후 화면 수치와 aggregate 일치

### 권장 실행 순서
1. Track 1, 쓰기 경로 안전화
2. Track 2, aggregate read 전환
3. Track 4, crowd comparison 계산/응답
4. Track 3, 신뢰 계약 UI
5. Track 5, 생성 화면 비교 카드
6. Track 6, generated-stats 재사용 카드
7. Track 7, 정산/백필 정리

### PR 단위 제안
- PR 1:
  - Track 1
  - 이유: 가장 위험한 write 경로부터 잠근다
- PR 2:
  - Track 2 + Track 3
  - 이유: aggregate-first read와 trust bar는 같은 화면 변경으로 묶는 편이 자연스럽다
- PR 3:
  - Track 4 + Track 5
  - 이유: crowd comparison 계산과 생성 직후 표시가 한 흐름이다
- PR 4:
  - Track 6 + Track 7
  - 이유: generated-stats 재사용 카드와 장기 운영 복구 경로를 마무리한다

### 병렬화 전략
- Lane A:
  - Track 1 -> Track 2 -> Track 7
  - 공통으로 `src/lib/firebase/admin.ts`를 만지므로 순차 진행
- Lane B:
  - Track 4 -> Track 5
  - `shared.ts`, `generate/route.ts`, `generator-panel.tsx` 중심
- Lane C:
  - Track 3 -> Track 6
  - `generated-stats` UI 중심
- 실행 순서:
  - Lane A를 먼저 시작
  - Track 1 완료 후 Lane B와 Lane C를 병렬 시작
  - 마지막에 Track 7로 운영 정산/백필 정리

### 정산 결과 write 경로
- 일요일 정산 작업은 기존처럼 `lotto_draws`를 갱신한다.
- 정산 시 `targetRound == latestDraw.round`인 `generated_records`를 평가한다.
- 개별 raw record의 `matchedRound`, `matchCount`, `bonusMatched`, `settledAt`는 계속 유지한다.
- 같은 평가 결과를 `generated_round_results/{latestDraw.round}`에 `전체 재계산 후 단일 write`로 저장한다.
- 정산과 results 집계는 회차 단위로 순차 처리한다.
  - backfill, sync, settle이 같은 회차 문서를 동시에 갱신하지 않게 한다.

```text
weekly draw sync
  -> upsert lotto_draws
  -> settle raw records for drawn round
  -> recompute generated_round_results/{round}
  -> store result aggregate
```

### 실패 모드와 방어
- partial write:
  - 방어: raw + aggregate + request ledger를 하나의 atomic commit으로 묶는다.
- duplicate retry:
  - 방어: `generated_requests/{requestId}` + deterministic `recordId`
- aggregate doc missing right after deploy:
  - 방어: server-side full recompute fallback 또는 `집계 준비 중` 상태
- backfill / settle collision:
  - 방어: 회차별 순차 처리, cutover 기간에는 결과 문서 단일 writer 유지
- schema drift:
  - 방어: `schemaVersion`, `sourceRecordCount`, `computedAt` 필수화

### 화면 의미 정리
- `사람들 선택`
  - 이번 회차 전체 생성 흐름
  - 전략 점유율
  - 많이 선택된 번호
  - 이번 회차 전체 기준 / 마지막 집계 시각 / 참여 세트 수
  - 최근 공개 생성 번호
  - 내 최근 세트와 군중 흐름 비교
- `전략 성과`
  - 직전 평가 완료 회차 기준
  - 어떤 전략이 얼마나 맞았는지
  - 적중 분포가 어땠는지
- 즉 `현재 군중 흐름`과 `직전 성과 분석`은 같은 페이지 안에 있어도 원본 데이터 기준은 분리한다.

### 마이그레이션 순서
1. `generated_requests`, `generated_round_stats`, `generated_round_results` 스키마와 `schemaVersion` 정의 추가
2. 클라이언트 direct Firestore write 제거, 생성 기록 저장을 `/api/v1/generate` 단일 경로로 모음
3. `requestId` 계약과 deterministic `recordId` 반영
4. 서버 생성 경로를 raw log + round stats + request ledger atomic commit으로 전환
5. aggregate 문서에 `lastHealthySnapshotAt`, `topColdNumbers`, 비교 계산용 필드 추가
6. 최근 회차에 대해 `generated_records` 기반 full backfill 스크립트 실행
7. 정산 작업이 `generated_round_results/{round}`를 순차 재계산해서 쓰도록 확장
8. `/generated-stats`를 aggregate-first + server fallback read로 전환
9. `/generated-stats` 상단에 신뢰 계약 UI 추가
10. `/generate`와 `/generated-stats`에 `내 번호 vs 사람들 선택` 비교 카드 추가
11. 기존 `recent 240 records` 기반 summary 계산 제거

### 테스트 및 검증
- 생성 API:
  - 같은 `requestId` 재시도 시 raw record 수와 `totalGenerated`가 한 번만 증가하는지 검증
  - atomic commit 실패 시 raw/aggregate/ledger가 부분 저장되지 않는지 검증
  - 생성 응답에 crowd comparison payload가 안정적으로 포함되는지 검증
- generated-stats page:
  - aggregate doc 존재 시 raw 240 sample과 무관하게 전체 회차 수치가 보이는지 검증
  - aggregate doc 미존재 시 `0` 대신 self-heal 또는 `집계 준비 중`이 노출되는지 검증
  - 상단에 `전체 기준`, `마지막 집계 시각`, `참여 세트 수`가 노출되는지 검증
  - 최근 로컬 세트가 있으면 `내 번호 vs 사람들 선택` 카드가 다시 렌더되는지 검증
- settle path:
  - 같은 회차 정산을 다시 돌려도 `generated_round_results/{round}`가 안정적으로 같은 값으로 유지되는지 검증
- backfill:
  - 기존 raw records로 round stats/results를 복구한 뒤 화면 수치와 일치하는지 검증

### 성공 기준
- `사람들 선택`의 상단 KPI와 전략 점유율이 이번 회차 전체 기록과 일치한다.
- 원본 기록이 수천 건 이상 쌓여도 `/generated-stats` 첫 화면 read 수와 렌더 비용이 크게 늘지 않는다.
- 동일 `requestId` 재시도 시 집계가 두 번 올라가지 않는다.
- aggregate doc이 아직 없거나 재생성 중이어도 화면이 `0건`으로 오해되지 않는다.
- draw sync 이후 `generated_round_results/{round}`와 raw settled records의 총량이 일치한다.
- 사용자가 `/generated-stats` 첫 화면에서 `이 숫자가 전체 기준인지, 언제 갱신됐는지`를 3초 안에 이해할 수 있다.
- 사용자가 생성 직후 자신의 세트가 군중형인지 역배형인지 바로 이해할 수 있다.

### NOT in scope
- 전체 역사 기반 장기 랭킹/리더보드
- 로그인 사용자 프로필 기반 개인화 분석
- abuse 탐지 고도화
- 군중 데이터 서사 카드 자동 생성

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 1 | PLAN UPDATED | 3 scope proposals 중 2개 수용, 신뢰 계약 UI와 `내 번호 vs 사람들 선택` 비교를 계획에 반영함. |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | NOT RUN | - |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 1 | PLAN UPDATED | 원자적 write, requestId 계약, migration fallback, schemaVersion, failure mode를 계획에 반영함. |
| Design Review | `/plan-design-review` | UI/UX gaps | 0 | NOT RUN | - |

- **UNRESOLVED:** 1
- **VERDICT:** ENG + CEO 주요 제안 반영 완료, 군중 서사 카드 1건만 후순위 보류

## 11. 구글 애드센스 승인 대비 체크리스트 (Site Behavior: Navigation)

애드센스 피드백 영상(lZUG0XGlZZY)은 주로 **"사이트 탐색(네비게이션) 및 필수 요건"** 정책 위반 시 발송됩니다. 툴 형태의 사이트(로또 생성기 등)에서 흔히 발생하는 거절 사유를 방어하기 위한 체크리스트입니다.

- [ ] **빈 링크 및 깨진 링크 제거**: 헤더, 푸터, 본문 내에 클릭해도 아무 동작을 하지 않는 더미 링크(`#` 등)나 404 에러를 내는 데드 링크가 없는지 전수 검사합니다.
- [ ] **필수 신뢰성 페이지(About Us) 확인 및 추가**: `/privacy`, `/terms`, `/contact` 외에도 사이트의 정체성과 운영 목적을 명확히 밝히는 **소개 페이지(About Us)** 가 있으면 승인 확률이 높아집니다.
- [ ] **준비 중(Under Construction) / 빈 페이지 접근 차단**: `/community` 처럼 리다이렉트만 되거나 콘텐츠가 텅 빈 페이지가 메뉴나 검색 엔진에 노출되고 있는지 확인합니다. 미완성 페이지는 완전히 숨겨야 합니다.
- [ ] **가치 있는 텍스트 콘텐츠(Valuable Inventory) 보강**: 도구 위주의 사이트는 "콘텐츠 부족"으로 인식될 수 있습니다. 각 생성기 페이지나 통계 페이지 하단에 도구 사용법, 통계적 해석, 로또 확률에 대한 가이드 텍스트를 충분히 추가합니다.
- [ ] **모바일 및 드롭다운 메뉴 QA**: 모바일 기기에서 네비게이션 메뉴가 오작동하여 다른 페이지로 정상적인 이동이 불가능한 구조적 결함이 없는지 확인합니다.
