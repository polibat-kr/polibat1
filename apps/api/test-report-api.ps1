# Report API 테스트 스크립트
# 신고 API 엔드포인트 테스트

$baseUrl = "http://localhost:4000/api"
$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Report API 테스트 시작" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# 1. 로그인 (토큰 획득)
Write-Host "[1] 로그인 테스트..." -ForegroundColor Yellow
$loginBody = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody

    $token = $loginResponse.accessToken
    Write-Host "✅ 로그인 성공!" -ForegroundColor Green
    Write-Host "Token: $($token.Substring(0, 20))...`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ 로그인 실패: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "회원가입을 먼저 진행해주세요.`n" -ForegroundColor Yellow
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# 2. 게시글 신고
Write-Host "[2] 게시글 신고..." -ForegroundColor Yellow
$reportPostBody = @{
    targetType = "POST"
    targetId = "FB000001"
    reason = "이 게시글은 부적절한 내용을 포함하고 있습니다. 커뮤니티 가이드라인을 위반하는 것으로 판단됩니다."
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/reports" `
        -Method POST `
        -Headers $headers `
        -Body $reportPostBody

    $reportId = $response.report.reportId
    Write-Host "✅ 게시글 신고 성공!" -ForegroundColor Green
    Write-Host "Report ID: $reportId`n" -ForegroundColor Gray
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 409) {
        Write-Host "⚠️  이미 신고한 게시글입니다.`n" -ForegroundColor Yellow
    } else {
        Write-Host "❌ 게시글 신고 실패: $($_.Exception.Message)`n" -ForegroundColor Red
    }
}

# 3. 댓글 신고
Write-Host "[3] 댓글 신고..." -ForegroundColor Yellow
$reportCommentBody = @{
    targetType = "COMMENT"
    targetId = "FB000001-CM0001"
    reason = "이 댓글은 욕설 및 비방을 포함하고 있어 신고합니다."
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/reports" `
        -Method POST `
        -Headers $headers `
        -Body $reportCommentBody

    $commentReportId = $response.report.reportId
    Write-Host "✅ 댓글 신고 성공!" -ForegroundColor Green
    Write-Host "Report ID: $commentReportId`n" -ForegroundColor Gray
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 409) {
        Write-Host "⚠️  이미 신고한 댓글입니다.`n" -ForegroundColor Yellow
    } else {
        Write-Host "❌ 댓글 신고 실패: $($_.Exception.Message)`n" -ForegroundColor Red
    }
}

# 4. 내가 신고한 목록 조회
Write-Host "[4] 내가 신고한 목록 조회..." -ForegroundColor Yellow
try {
    $myReports = Invoke-RestMethod -Uri "$baseUrl/reports/my" `
        -Method GET `
        -Headers $headers

    Write-Host "✅ 내 신고 목록 조회 성공!" -ForegroundColor Green
    Write-Host "총 신고 수: $($myReports.pagination.total)" -ForegroundColor Gray
    Write-Host "PENDING: $($myReports.summary.pending)" -ForegroundColor Gray
    Write-Host "REVIEWING: $($myReports.summary.reviewing)" -ForegroundColor Gray
    Write-Host "RESOLVED: $($myReports.summary.resolved)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ 내 신고 목록 조회 실패: $($_.Exception.Message)`n" -ForegroundColor Red
}

# 5. 신고 상세 조회
if ($reportId) {
    Write-Host "[5] 신고 상세 조회..." -ForegroundColor Yellow
    try {
        $report = Invoke-RestMethod -Uri "$baseUrl/reports/$reportId" `
            -Method GET `
            -Headers $headers

        Write-Host "✅ 신고 상세 조회 성공!" -ForegroundColor Green
        Write-Host "신고 ID: $($report.reportId)" -ForegroundColor Gray
        Write-Host "대상: $($report.targetType) - $($report.targetId)" -ForegroundColor Gray
        Write-Host "상태: $($report.status)`n" -ForegroundColor Gray
    } catch {
        Write-Host "❌ 신고 상세 조회 실패: $($_.Exception.Message)`n" -ForegroundColor Red
    }
}

# 6. 신고 목록 조회 (관리자)
Write-Host "[6] 전체 신고 목록 조회..." -ForegroundColor Yellow
try {
    $allReports = Invoke-RestMethod -Uri "$baseUrl/reports?limit=10" `
        -Method GET `
        -Headers $headers

    Write-Host "✅ 전체 신고 목록 조회 성공!" -ForegroundColor Green
    Write-Host "총 신고 수: $($allReports.pagination.total)" -ForegroundColor Gray
    Write-Host "PENDING: $($allReports.summary.pending)" -ForegroundColor Gray
    Write-Host "REVIEWING: $($allReports.summary.reviewing)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ 전체 신고 목록 조회 실패: $($_.Exception.Message)`n" -ForegroundColor Red
}

# 7. 신고 처리 (관리자) - 검토 중으로 변경
if ($reportId) {
    Write-Host "[7] 신고 상태 변경 (REVIEWING)..." -ForegroundColor Yellow
    $processBody = @{
        status = "REVIEWING"
        adminNote = "신고 내용을 검토 중입니다."
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/reports/$reportId/process" `
            -Method PATCH `
            -Headers $headers `
            -Body $processBody

        Write-Host "✅ 신고 처리 성공 (REVIEWING)!" -ForegroundColor Green
        Write-Host "상태: $($response.report.status)`n" -ForegroundColor Gray
    } catch {
        Write-Host "❌ 신고 처리 실패: $($_.Exception.Message)`n" -ForegroundColor Red
    }
}

# 8. 신고 처리 완료 (HIDE)
if ($reportId) {
    Write-Host "[8] 신고 처리 완료 (RESOLVED + HIDE)..." -ForegroundColor Yellow
    $resolveBody = @{
        status = "RESOLVED"
        adminNote = "부적절한 내용으로 확인되어 숨김 처리했습니다."
        actionType = "HIDE"
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/reports/$reportId/process" `
            -Method PATCH `
            -Headers $headers `
            -Body $resolveBody

        Write-Host "✅ 신고 처리 완료 (RESOLVED + HIDE)!" -ForegroundColor Green
        Write-Host "상태: $($response.report.status)" -ForegroundColor Gray
        Write-Host "액션: $($response.report.actionType)`n" -ForegroundColor Gray
    } catch {
        Write-Host "❌ 신고 처리 실패: $($_.Exception.Message)`n" -ForegroundColor Red
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Report API 테스트 완료!" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "📝 테스트 요약:" -ForegroundColor White
Write-Host "- 게시글/댓글 신고" -ForegroundColor Gray
Write-Host "- 내 신고 목록 조회" -ForegroundColor Gray
Write-Host "- 신고 상세 조회" -ForegroundColor Gray
Write-Host "- 전체 신고 목록 조회 (관리자)" -ForegroundColor Gray
Write-Host "- 신고 처리 (REVIEWING, RESOLVED)" -ForegroundColor Gray
Write-Host "- 신고 액션 (HIDE)`n" -ForegroundColor Gray
