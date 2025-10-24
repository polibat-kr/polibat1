# Admin Comment API 테스트 스크립트
# PowerShell 7 (pwsh.exe) 사용

# 환경 설정
$BaseUrl = "http://localhost:4000"
$AdminEmail = "admin@polibat.com"
$AdminPassword = "polibat_admin_password"

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Admin Comment API 테스트 시작" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# 1. 관리자 로그인
Write-Host "[1] 관리자 로그인..." -ForegroundColor Yellow
$loginResponse = Invoke-RestMethod -Uri "$BaseUrl/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body (@{
    email = $AdminEmail
    password = $AdminPassword
  } | ConvertTo-Json)

$AccessToken = $loginResponse.data.accessToken
Write-Host "✅ 로그인 성공!" -ForegroundColor Green
Write-Host "Access Token: $($AccessToken.Substring(0, 20))..." -ForegroundColor Gray
Write-Host ""

# 인증 헤더 설정
$Headers = @{
  "Authorization" = "Bearer $AccessToken"
  "Content-Type" = "application/json"
}

# 2. 댓글 목록 조회 (기본)
Write-Host "[2] 댓글 목록 조회 (기본)..." -ForegroundColor Yellow
try {
  $response = Invoke-RestMethod -Uri "$BaseUrl/api/admin/comments" `
    -Method GET `
    -Headers $Headers
  Write-Host "✅ 댓글 목록 조회 성공!" -ForegroundColor Green
  Write-Host "Total: $($response.data.pagination.total)" -ForegroundColor Gray
  Write-Host "Page: $($response.data.pagination.page)/$($response.data.pagination.totalPages)" -ForegroundColor Gray
  Write-Host ""
} catch {
  Write-Host "❌ 댓글 목록 조회 실패: $($_.Exception.Message)" -ForegroundColor Red
  Write-Host ""
}

# 3. 댓글 목록 조회 (페이지네이션)
Write-Host "[3] 댓글 목록 조회 (페이지 2, 5개씩)..." -ForegroundColor Yellow
try {
  $response = Invoke-RestMethod -Uri "$BaseUrl/api/admin/comments?page=2&limit=5" `
    -Method GET `
    -Headers $Headers
  Write-Host "✅ 페이지네이션 조회 성공!" -ForegroundColor Green
  Write-Host "Count: $($response.data.comments.Count)" -ForegroundColor Gray
  Write-Host ""
} catch {
  Write-Host "❌ 페이지네이션 조회 실패: $($_.Exception.Message)" -ForegroundColor Red
  Write-Host ""
}

# 4. 댓글 목록 조회 (검색)
Write-Host "[4] 댓글 목록 조회 (검색: '테스트')..." -ForegroundColor Yellow
try {
  $searchQuery = [System.Web.HttpUtility]::UrlEncode("테스트")
  $response = Invoke-RestMethod -Uri "$BaseUrl/api/admin/comments?search=$searchQuery" `
    -Method GET `
    -Headers $Headers
  Write-Host "✅ 검색 조회 성공!" -ForegroundColor Green
  Write-Host "Results: $($response.data.comments.Count)" -ForegroundColor Gray
  Write-Host ""
} catch {
  Write-Host "❌ 검색 조회 실패: $($_.Exception.Message)" -ForegroundColor Red
  Write-Host ""
}

# 5. 댓글 목록 조회 (상태 필터)
Write-Host "[5] 댓글 목록 조회 (상태: PUBLISHED)..." -ForegroundColor Yellow
try {
  $response = Invoke-RestMethod -Uri "$BaseUrl/api/admin/comments?status=PUBLISHED" `
    -Method GET `
    -Headers $Headers
  Write-Host "✅ 상태 필터 조회 성공!" -ForegroundColor Green
  Write-Host "Published Count: $($response.data.comments.Count)" -ForegroundColor Gray

  # 첫 번째 댓글 저장 (테스트용)
  if ($response.data.comments.Count -gt 0) {
    $TestCommentId = $response.data.comments[0].commentId
    Write-Host "Test Comment ID: $TestCommentId" -ForegroundColor Gray
  }
  Write-Host ""
} catch {
  Write-Host "❌ 상태 필터 조회 실패: $($_.Exception.Message)" -ForegroundColor Red
  Write-Host ""
}

# 6. 댓글 목록 조회 (정렬: 좋아요 수)
Write-Host "[6] 댓글 목록 조회 (정렬: likeCount DESC)..." -ForegroundColor Yellow
try {
  $response = Invoke-RestMethod -Uri "$BaseUrl/api/admin/comments?sortBy=likeCount&sortOrder=desc&limit=5" `
    -Method GET `
    -Headers $Headers
  Write-Host "✅ 정렬 조회 성공!" -ForegroundColor Green
  foreach ($comment in $response.data.comments) {
    Write-Host "  - $($comment.commentId): 좋아요 $($comment.likeCount)개" -ForegroundColor Gray
  }
  Write-Host ""
} catch {
  Write-Host "❌ 정렬 조회 실패: $($_.Exception.Message)" -ForegroundColor Red
  Write-Host ""
}

# 7. 댓글 상태 변경 (HIDDEN)
if ($TestCommentId) {
  Write-Host "[7] 댓글 상태 변경 (HIDDEN)..." -ForegroundColor Yellow
  try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/api/admin/comments/$TestCommentId/status" `
      -Method PATCH `
      -Headers $Headers `
      -Body (@{
        status = "HIDDEN"
        reason = "부적절한 내용 포함"
      } | ConvertTo-Json)
    Write-Host "✅ 댓글 상태 변경 성공!" -ForegroundColor Green
    Write-Host "Previous: $($response.data.previousStatus) → Current: $($response.data.currentStatus)" -ForegroundColor Gray
    Write-Host "Reason: $($response.data.reason)" -ForegroundColor Gray
    Write-Host ""
  } catch {
    Write-Host "❌ 댓글 상태 변경 실패: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
  }

  # 8. 댓글 상태 변경 복구 (PUBLISHED)
  Write-Host "[8] 댓글 상태 복구 (PUBLISHED)..." -ForegroundColor Yellow
  try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/api/admin/comments/$TestCommentId/status" `
      -Method PATCH `
      -Headers $Headers `
      -Body (@{
        status = "PUBLISHED"
        reason = "검토 후 복구"
      } | ConvertTo-Json)
    Write-Host "✅ 댓글 상태 복구 성공!" -ForegroundColor Green
    Write-Host "Previous: $($response.data.previousStatus) → Current: $($response.data.currentStatus)" -ForegroundColor Gray
    Write-Host ""
  } catch {
    Write-Host "❌ 댓글 상태 복구 실패: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
  }
}

# 9. 존재하지 않는 댓글 조회 (404 테스트)
Write-Host "[9] 존재하지 않는 댓글 상태 변경 (404 테스트)..." -ForegroundColor Yellow
try {
  $response = Invoke-RestMethod -Uri "$BaseUrl/api/admin/comments/INVALID_ID/status" `
    -Method PATCH `
    -Headers $Headers `
    -Body (@{
      status = "HIDDEN"
    } | ConvertTo-Json)
  Write-Host "❌ 404 에러가 발생해야 합니다!" -ForegroundColor Red
  Write-Host ""
} catch {
  if ($_.Exception.Response.StatusCode -eq 404) {
    Write-Host "✅ 404 에러 처리 정상!" -ForegroundColor Green
  } else {
    Write-Host "❌ 예상치 못한 에러: $($_.Exception.Message)" -ForegroundColor Red
  }
  Write-Host ""
}

# 10. 날짜 필터 테스트
Write-Host "[10] 댓글 목록 조회 (날짜 필터: 최근 7일)..." -ForegroundColor Yellow
try {
  $endDate = (Get-Date).ToString("yyyy-MM-dd")
  $startDate = (Get-Date).AddDays(-7).ToString("yyyy-MM-dd")
  $response = Invoke-RestMethod -Uri "$BaseUrl/api/admin/comments?startDate=$startDate&endDate=$endDate" `
    -Method GET `
    -Headers $Headers
  Write-Host "✅ 날짜 필터 조회 성공!" -ForegroundColor Green
  Write-Host "Period: $startDate ~ $endDate" -ForegroundColor Gray
  Write-Host "Count: $($response.data.comments.Count)" -ForegroundColor Gray
  Write-Host ""
} catch {
  Write-Host "❌ 날짜 필터 조회 실패: $($_.Exception.Message)" -ForegroundColor Red
  Write-Host ""
}

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "테스트 완료!" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
