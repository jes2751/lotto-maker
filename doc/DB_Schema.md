# 데이터베이스 스키마 v1

이 문서는 DB 구조를 설명하는 요약 문서다. 시드 데이터 운영과 검증 규칙은 `Data_Pipeline_and_Validation.md`를 기준으로 한다.

## 1. 적용 원칙

* v1 런타임은 정적 시드 데이터로 동작한다.
* Prisma/PostgreSQL 스키마는 다음 단계 전환을 위해 함께 관리한다.
* v1 핵심 테이블은 `draws`, `generated_sets` 두 개만 유지한다.

## 2. draws

```sql
CREATE TABLE draws (
    id SERIAL PRIMARY KEY,
    round INTEGER UNIQUE NOT NULL,
    draw_date DATE NOT NULL,
    n1 INTEGER NOT NULL CHECK (n1 BETWEEN 1 AND 45),
    n2 INTEGER NOT NULL CHECK (n2 BETWEEN 1 AND 45),
    n3 INTEGER NOT NULL CHECK (n3 BETWEEN 1 AND 45),
    n4 INTEGER NOT NULL CHECK (n4 BETWEEN 1 AND 45),
    n5 INTEGER NOT NULL CHECK (n5 BETWEEN 1 AND 45),
    n6 INTEGER NOT NULL CHECK (n6 BETWEEN 1 AND 45),
    bonus INTEGER NOT NULL CHECK (bonus BETWEEN 1 AND 45),
    total_prize BIGINT,
    first_prize BIGINT,
    winner_count INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## 3. generated_sets

```sql
CREATE TABLE generated_sets (
    id SERIAL PRIMARY KEY,
    strategy VARCHAR(50) NOT NULL,
    numbers INTEGER[] NOT NULL,
    bonus INTEGER,
    meta_json JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 4. 후속 후보

* 통계 캐시 테이블
* 세션 또는 방문 로그 테이블
* 자동 수집 이력 테이블
