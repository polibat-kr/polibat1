# 정치방망이(PoliBAT) Windows PostgreSQL 18 자동 설정 스크립트
# PowerShell 7 권장

param(
    [string]$PostgresPassword = "",
    [string]$PsqlPath = "C:\Program Files\PostgreSQL\18\bin\psql.exe"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "정치방망이(PoliBAT) Windows PostgreSQL 설정" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# PostgreSQL 경로 확인
if (-not (Test-Path $PsqlPath)) {
    Write-Host "❌ PostgreSQL이 $PsqlPath 경로에 설치되어 있지 않습니다." -ForegroundColor Red
    Write-Host "설치 경로를 확인하고 -PsqlPath 파라미터로 지정해주세요." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ PostgreSQL 경로 확인: $PsqlPath" -ForegroundColor Green

# PostgreSQL postgres 사용자 비밀번호 입력
if ($PostgresPassword -eq "") {
    $SecurePassword = Read-Host "PostgreSQL postgres 사용자 비밀번호를 입력하세요" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecurePassword)
    $PostgresPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
}

$env:PGPASSWORD = $PostgresPassword

Write-Host ""
Write-Host "📊 1단계: polibat 데이터베이스 존재 여부 확인..." -ForegroundColor Yellow

# 데이터베이스 존재 여부 확인
$dbExists = & $PsqlPath -U postgres -lqt 2>&1 | Select-String -Pattern "polibat_dev"

if ($dbExists) {
    Write-Host "ℹ️  polibat_dev 데이터베이스가 이미 존재합니다." -ForegroundColor Cyan
} else {
    Write-Host "📝 polibat_dev 데이터베이스 생성 중..." -ForegroundColor Yellow
    & $PsqlPath -U postgres -c "CREATE DATABASE polibat_dev;" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ polibat_dev 데이터베이스 생성 완료" -ForegroundColor Green
    } else {
        Write-Host "❌ 데이터베이스 생성 실패" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "👤 2단계: polibat 사용자 존재 여부 확인..." -ForegroundColor Yellow

# 사용자 존재 여부 확인
$userCheck = & $PsqlPath -U postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='polibat'" 2>&1

if ($userCheck -eq "1") {
    Write-Host "ℹ️  polibat 사용자가 이미 존재합니다." -ForegroundColor Cyan
} else {
    Write-Host "📝 polibat 사용자 생성 중..." -ForegroundColor Yellow
    & $PsqlPath -U postgres -c "CREATE USER polibat WITH PASSWORD 'polibat_dev_password';" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ polibat 사용자 생성 완료" -ForegroundColor Green
    } else {
        Write-Host "❌ 사용자 생성 실패" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "🔐 3단계: 권한 부여..." -ForegroundColor Yellow

& $PsqlPath -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE polibat_dev TO polibat;" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 권한 부여 완료" -ForegroundColor Green
} else {
    Write-Host "⚠️  권한 부여 실패 (이미 권한이 있을 수 있습니다)" -ForegroundColor Yellow
}

# PostgreSQL 18 추가 권한 설정 (필요한 경우)
& $PsqlPath -U postgres -d polibat_dev -c "GRANT ALL ON SCHEMA public TO polibat;" 2>&1

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ Windows PostgreSQL 설정 완료!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📝 연결 정보:" -ForegroundColor Cyan
Write-Host "  - Host: localhost" -ForegroundColor White
Write-Host "  - Port: 5432" -ForegroundColor White
Write-Host "  - Database: polibat_dev" -ForegroundColor White
Write-Host "  - Username: polibat" -ForegroundColor White
Write-Host "  - Password: polibat_dev_password" -ForegroundColor White
Write-Host ""
Write-Host "🔜 다음 단계:" -ForegroundColor Cyan
Write-Host "  1. cd apps/api" -ForegroundColor White
Write-Host "  2. npx prisma generate" -ForegroundColor White
Write-Host "  3. npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > migration_windows.sql" -ForegroundColor White
Write-Host "  4. Get-Content migration_windows.sql | & 'C:\Program Files\PostgreSQL\18\bin\psql.exe' -U polibat -d polibat_dev" -ForegroundColor White
Write-Host ""

# 환경 변수 정리
Remove-Item Env:\PGPASSWORD
