-- PostgreSQL 초기화 스크립트
-- 정치방망이(PoliBAT) 프로젝트

-- 데이터베이스 인코딩 확인
SELECT pg_encoding_to_char(encoding) AS database_encoding
FROM pg_database
WHERE datname = 'polibat_dev';

-- 확장 기능 설치
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 초기 설정 완료 로그
DO $$
BEGIN
    RAISE NOTICE 'PostgreSQL 초기화 완료';
    RAISE NOTICE '데이터베이스: polibat_dev';
    RAISE NOTICE '인코딩: UTF8';
    RAISE NOTICE 'UUID 확장 기능: 설치됨';
END $$;
