-- 정치방망이(PoliBAT) Windows PostgreSQL 18 설정 스크립트
-- 실행 방법: psql -U postgres -f setup-windows-db.sql

-- 1. polibat_dev 데이터베이스가 이미 존재하는지 확인 후 생성
SELECT 'Checking if database polibat_dev exists...' as status;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'polibat_dev') THEN
        EXECUTE 'CREATE DATABASE polibat_dev';
        RAISE NOTICE 'Database polibat_dev created successfully';
    ELSE
        RAISE NOTICE 'Database polibat_dev already exists';
    END IF;
END
$$;

-- 2. polibat 사용자가 이미 존재하는지 확인 후 생성
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'polibat') THEN
        CREATE USER polibat WITH PASSWORD 'polibat_dev_password';
        RAISE NOTICE 'User polibat created successfully';
    ELSE
        RAISE NOTICE 'User polibat already exists';
    END IF;
END
$$;

-- 3. polibat_dev 데이터베이스에 대한 권한 부여
GRANT ALL PRIVILEGES ON DATABASE polibat_dev TO polibat;

-- 4. 완료 메시지
SELECT 'Windows PostgreSQL setup completed!' as status;
SELECT 'Database: polibat_dev' as info;
SELECT 'User: polibat' as info;
SELECT 'Password: polibat_dev_password' as info;
