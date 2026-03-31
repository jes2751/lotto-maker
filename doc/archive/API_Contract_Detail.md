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

## 2. `GET /api/health`

* `status`
* `dataSource`
* `lastDrawUpdate`
* `version`

## 3. `GET /api/v1/draws`

* `limit`: 정수, 1~20, 기본값 `10`
* `offset`: 정수, 0 이상, 기본값 `0`

응답 데이터:

* `draws`
* `total`
* `hasMore`

## 4. `GET /api/v1/draws/[round]`

* `round`: 1 이상의 정수
* 숫자가 아니면 `400 VALIDATION_ERROR`
* 존재하지 않는 회차면 `404 NOT_FOUND`

## 5. `POST /api/v1/generate`

* `strategy`: `random | frequency | mixed`
* `count`: 정수 1~5
* `include_bonus`: boolean

응답 데이터:

* `sets[]`
* 각 세트 필드: `id`, `strategy`, `numbers`, `bonus?`, `reason`, `generatedAt`

## 6. `GET /api/v1/stats/frequency`

* `period`: `all | recent_10`
* `type`: `main`

응답 데이터:

* `period`
* `type`
* `totalDraws`
* `stats[]`
