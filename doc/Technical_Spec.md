# 기술 명세 v1

## 1. 기술 개요

* Next.js 14 App Router
* TypeScript
* Tailwind CSS
* 정적 시드 데이터 기반 런타임
* Prisma/PostgreSQL 전환 가능 구조
* 추천 로직의 기본 입력은 기존 당첨 데이터다.

## 2. 시스템 구조

* 프론트엔드: App Router 페이지
* 백엔드: Route Handlers
* 데이터 계층: 시드 저장소와 DB 저장소를 교체 가능한 구조

## 3. 타입과 인터페이스 기준

### 생성 전략

* `random | frequency | mixed`

권장 사용 기준:

* `frequency`, `mixed`는 데이터 기반 추천 전략
* `random`은 비교용 또는 참고용 전략

### 주요 필드명

* 생성 API 요청: `strategy`, `count`, `include_bonus`
* draw 응답: `round`, `drawDate`, `numbers`, `bonus`
* 생성 결과: `id`, `strategy`, `numbers`, `bonus?`, `reason`, `generatedAt`
* 스키마 메타 필드: `meta_json`

## 4. 생성 로직

### 공통 규칙

* 메인 번호는 1~45 범위의 6개
* 중복 없음
* 반환 전 오름차순 정렬
* 보너스는 메인 번호 제외 후 1개 선택
* 추천 전략의 입력 데이터는 시드에 저장된 기존 당첨 회차다.

### `random`

* 1~45에서 중복 없이 6개 무작위 추출
* 이유 문구: `완전 랜덤 기준으로 중복 없이 조합했습니다.`
* 역할: 데이터 기반 추천 결과와 비교하는 참고용 옵션

### `frequency`

* 시드 전체 회차, 즉 기존 당첨 데이터의 메인 번호 빈도를 기반으로 가중치 계산
* 기본 가중치 `1`, 등장 시 `+1`
* 이유 문구: `시드 회차에서 자주 나온 번호에 가중치를 둬 조합했습니다.`
* 역할: v1의 기본 데이터 기반 추천 전략

### `mixed`

* 3개는 `frequency`, 3개는 `random`
* 합친 뒤 오름차순 정렬
* 이유 문구: `빈도 가중치와 랜덤 조합을 섞어 균형 있게 구성했습니다.`
* 역할: 기존 당첨 데이터 기반 추천에 무작위 요소를 더한 확장 전략

## 5. API 계약

### `GET /api/health`

* 상태, 데이터 소스, 마지막 회차 날짜, 버전 반환

### `GET /api/v1/draws`

* 쿼리:
  * `limit`: 1~20, 기본값 `10`
  * `offset`: 0 이상, 기본값 `0`

### `GET /api/v1/draws/[round]`

* 존재하지 않으면 `404 NOT_FOUND`

### `POST /api/v1/generate`

* 요청:
  * `strategy`: `random | frequency | mixed`
  * `count`: 1~5
  * `include_bonus`: boolean

### `GET /api/v1/stats/frequency`

* 쿼리:
  * `period`: `all | recent_10`
  * `type`: `main`

### 공통 에러 형식

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "..."
  }
}
```

## 6. 데이터 구조

### draws

* `id`
* `round`
* `draw_date`
* `n1 ~ n6`
* `bonus`
* 선택 상금 정보

### generated_sets

* `id`
* `strategy`
* `numbers`
* `bonus`
* `meta_json`
* `created_at`

## 7. 시드 데이터 정책

* 현재 데이터 소스는 `src/lib/data/seed-draws.ts`
* 각 회차는 `round`, `drawDate`, `numbers[6]`, `bonus`를 필수로 가진다
* 시드 변경은 수동 갱신으로 시작한다
* 추천 기능은 이 시드에 저장된 기존 당첨 데이터를 직접 참조한다

## 8. 검증 규칙

* 메인 번호와 보너스 번호는 모두 1~45 범위여야 한다
* 메인 번호는 중복되면 안 된다
* 메인 번호는 오름차순이어야 한다
* `bonus`는 메인 번호와 중복되면 안 된다
* 같은 `round`가 중복되면 안 된다

## 9. 테스트 기준

* 생성 로직 유효성 테스트
* 통계 계산 테스트
* API 응답 테스트
* 최소 페이지 렌더링 스모크 테스트

## 10. 후속 기술 확장

* PostgreSQL 전환
* 자동 수집 파이프라인
* 상세 통계
* 검색과 저장 기능
