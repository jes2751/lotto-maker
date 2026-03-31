# API 상세 계약 v1

## 1. 공통 계약

기본 경로:

* `/api/v1`

성공 응답:

```json
{
  "success": true,
  "data": {}
}
```

실패 응답:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력 값이 올바르지 않습니다."
  }
}
```

에러 코드:

* `VALIDATION_ERROR`
* `NOT_FOUND`
* `INTERNAL_ERROR`

호환성 원칙:

* v1에서는 응답 최상위 키를 변경하지 않는다.
* 기존 필드 제거 대신 후속 버전에서 새 필드를 추가하는 방식으로 확장한다.

## 2. `GET /api/health`

목적:

* 서비스 상태와 마지막 시드 회차 날짜 확인

성공 응답 필드:

* `status`: string
* `dataSource`: `"seed"`
* `lastDrawUpdate`: string | null
* `version`: string

## 3. `GET /api/v1/draws`

쿼리 파라미터:

* `limit`: 정수, 1~20, 기본값 `10`
* `offset`: 정수, 0 이상, 기본값 `0`

성공 응답:

```json
{
  "success": true,
  "data": {
    "draws": [
      {
        "id": 1169,
        "round": 1169,
        "drawDate": "2026-03-28",
        "numbers": [4, 10, 19, 27, 36, 43],
        "bonus": 15,
        "totalPrize": 22600000000,
        "firstPrize": 2260000000,
        "winnerCount": 10
      }
    ],
    "total": 12,
    "hasMore": true
  }
}
```

필드 규칙:

* `draws`는 최신 회차 기준 내림차순 목록이다.
* `total`은 전체 회차 수다.
* `hasMore`는 다음 페이지 존재 여부다.

## 4. `GET /api/v1/draws/[round]`

경로 파라미터:

* `round`: 1 이상의 정수

성공 응답은 draw 객체 1건이다.

실패 규칙:

* 숫자가 아니면 `400 VALIDATION_ERROR`
* 존재하지 않는 회차면 `404 NOT_FOUND`

## 5. `POST /api/v1/generate`

요청 본문:

```json
{
  "strategy": "mixed",
  "count": 2,
  "include_bonus": true
}
```

요청 필드:

* `strategy`: `random | frequency | mixed`
* `count`: 정수 1~5
* `include_bonus`: boolean

성공 응답:

```json
{
  "success": true,
  "data": {
    "sets": [
      {
        "id": "gen_1711870000000_1",
        "strategy": "mixed",
        "numbers": [5, 14, 18, 27, 34, 42],
        "bonus": 7,
        "reason": "빈도 가중치와 랜덤 조합을 섞어 균형 있게 구성했습니다.",
        "generatedAt": "2026-03-31T08:20:00.000Z"
      }
    ]
  }
}
```

필드 규칙:

* `sets` 길이는 요청 `count`와 같다.
* `numbers`는 항상 오름차순이다.
* `bonus`는 `include_bonus=true`일 때만 포함된다.
* `generatedAt`은 ISO 8601 문자열이다.

실패 규칙:

* 지원하지 않는 `strategy`는 `400 VALIDATION_ERROR`
* 범위를 벗어난 `count`는 `400 VALIDATION_ERROR`
* JSON 본문 파싱 실패는 `400 VALIDATION_ERROR`

## 6. `GET /api/v1/stats/frequency`

쿼리 파라미터:

* `period`: `all | recent_10`, 기본값 `all`
* `type`: `main`, 기본값 `main`

성공 응답:

```json
{
  "success": true,
  "data": {
    "period": "recent_10",
    "type": "main",
    "totalDraws": 10,
    "stats": [
      {
        "number": 10,
        "frequency": 2,
        "percentage": 20
      }
    ]
  }
}
```

필드 규칙:

* `stats`는 `frequency` 내림차순, 동률이면 `number` 오름차순이다.
* `percentage`는 `frequency / totalDraws * 100`을 소수점 첫째 자리 기준으로 반올림한 값이다.

실패 규칙:

* 지원하지 않는 `period`는 `400 VALIDATION_ERROR`
* `type !== "main"`이면 `400 VALIDATION_ERROR`
