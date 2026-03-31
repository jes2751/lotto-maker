# API 명세 v1

## 1. 공통

* 기본 경로: `/api/v1`
* 성공 응답: `{ "success": true, "data": ... }`
* 실패 응답: `{ "success": false, "error": { "code": "...", "message": "..." } }`

## 2. 엔드포인트

### `GET /api/health`

서비스 상태와 마지막 시드 회차 날짜를 반환한다.

### `GET /api/v1/draws`

최근 회차 목록 조회

쿼리 파라미터:

* `limit`: 기본 10, 최대 20
* `offset`: 기본 0

### `GET /api/v1/draws/[round]`

특정 회차 조회

### `POST /api/v1/generate`

번호 생성

요청 예시:

```json
{
  "strategy": "mixed",
  "count": 2,
  "include_bonus": true
}
```

### `GET /api/v1/stats/frequency`

번호별 출현 빈도 조회

쿼리 파라미터:

* `period`: `all` 또는 `recent_10`
* `type`: `main`

## 3. 에러 코드

* `VALIDATION_ERROR`
* `NOT_FOUND`
* `INTERNAL_ERROR`
