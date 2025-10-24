# Reaction API 테스트 스크립트
# 반응(좋아요/싫어요) API 엔드포인트 테스트

$baseUrl = "http://localhost:4000/api"
$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Reaction API 테스트 시작" -ForegroundColor Cyan
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

# 2. 게시글에 좋아요 추가
Write-Host "[2] 게시글에 좋아요 추가..." -ForegroundColor Yellow
$likePostBody = @{
    targetType = "POST"
    targetId = "FB000001"
    reactionType = "LIKE"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/reactions" `
        -Method POST `
        -Headers $headers `
        -Body $likePostBody

    Write-Host "✅ 게시글 좋아요 성공!" -ForegroundColor Green
    Write-Host "Action: $($response.action)" -ForegroundColor Gray
    Write-Host "Message: $($response.message)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ 게시글 좋아요 실패: $($_.Exception.Message)`n" -ForegroundColor Red
}

# 3. 같은 게시글에 다시 좋아요 (토글 - 삭제)
Write-Host "[3] 게시글 좋아요 토글 (삭제)..." -ForegroundColor Yellow
Start-Sleep -Seconds 1

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/reactions" `
        -Method POST `
        -Headers $headers `
        -Body $likePostBody

    Write-Host "✅ 게시글 좋아요 토글 성공!" -ForegroundColor Green
    Write-Host "Action: $($response.action)" -ForegroundColor Gray
    Write-Host "Message: $($response.message)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ 게시글 좋아요 토글 실패: $($_.Exception.Message)`n" -ForegroundColor Red
}

# 4. 게시글에 좋아요 다시 추가 (테스트용)
Write-Host "[4] 게시글에 좋아요 다시 추가..." -ForegroundColor Yellow
Start-Sleep -Seconds 1

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/reactions" `
        -Method POST `
        -Headers $headers `
        -Body $likePostBody

    $reactionId = $response.reaction.id
    Write-Host "✅ 게시글 좋아요 재추가 성공!" -ForegroundColor Green
    Write-Host "Reaction ID: $reactionId`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ 게시글 좋아요 재추가 실패: $($_.Exception.Message)`n" -ForegroundColor Red
}

# 5. 좋아요를 싫어요로 변경
Write-Host "[5] 좋아요를 싫어요로 변경..." -ForegroundColor Yellow
$dislikePostBody = @{
    targetType = "POST"
    targetId = "FB000001"
    reactionType = "DISLIKE"
} | ConvertTo-Json

Start-Sleep -Seconds 1

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/reactions" `
        -Method POST `
        -Headers $headers `
        -Body $dislikePostBody

    Write-Host "✅ 반응 변경 성공 (LIKE → DISLIKE)!" -ForegroundColor Green
    Write-Host "Action: $($response.action)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ 반응 변경 실패: $($_.Exception.Message)`n" -ForegroundColor Red
}

# 6. 게시글 반응 통계 조회
Write-Host "[6] 게시글 반응 통계 조회..." -ForegroundColor Yellow
try {
    $stats = Invoke-RestMethod -Uri "$baseUrl/reactions/stats/POST/FB000001" `
        -Method GET `
        -Headers @{ "Authorization" = "Bearer $token" }

    Write-Host "✅ 통계 조회 성공!" -ForegroundColor Green
    Write-Host "Like Count: $($stats.likeCount)" -ForegroundColor Gray
    Write-Host "Dislike Count: $($stats.dislikeCount)" -ForegroundColor Gray
    Write-Host "Total Count: $($stats.totalCount)" -ForegroundColor Gray
    Write-Host "User Reaction: $($stats.userReaction)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ 통계 조회 실패: $($_.Exception.Message)`n" -ForegroundColor Red
}

# 7. 게시글 반응 목록 조회
Write-Host "[7] 게시글 반응 목록 조회..." -ForegroundColor Yellow
try {
    $reactions = Invoke-RestMethod -Uri "$baseUrl/posts/FB000001/reactions" `
        -Method GET `
        -Headers @{ "Authorization" = "Bearer $token" }

    Write-Host "✅ 반응 목록 조회 성공!" -ForegroundColor Green
    Write-Host "총 반응 수: $($reactions.pagination.total)" -ForegroundColor Gray
    Write-Host "Like: $($reactions.stats.likeCount) | Dislike: $($reactions.stats.dislikeCount)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ 반응 목록 조회 실패: $($_.Exception.Message)`n" -ForegroundColor Red
}

# 8. 댓글에 좋아요 추가
Write-Host "[8] 댓글에 좋아요 추가..." -ForegroundColor Yellow
$likeCommentBody = @{
    targetType = "COMMENT"
    targetId = "FB000001-CM0001"
    reactionType = "LIKE"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/reactions" `
        -Method POST `
        -Headers $headers `
        -Body $likeCommentBody

    Write-Host "✅ 댓글 좋아요 성공!" -ForegroundColor Green
    Write-Host "Message: $($response.message)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ 댓글 좋아요 실패: $($_.Exception.Message)`n" -ForegroundColor Red
}

# 9. 댓글 반응 목록 조회
Write-Host "[9] 댓글 반응 목록 조회..." -ForegroundColor Yellow
try {
    $reactions = Invoke-RestMethod -Uri "$baseUrl/comments/FB000001-CM0001/reactions" `
        -Method GET `
        -Headers @{ "Authorization" = "Bearer $token" }

    Write-Host "✅ 댓글 반응 목록 조회 성공!" -ForegroundColor Green
    Write-Host "총 반응 수: $($reactions.pagination.total)" -ForegroundColor Gray
    Write-Host "Like: $($reactions.stats.likeCount) | Dislike: $($reactions.stats.dislikeCount)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ 댓글 반응 목록 조회 실패: $($_.Exception.Message)`n" -ForegroundColor Red
}

# 10. 반응 삭제 (마지막에 추가한 반응)
Write-Host "[10] 반응 삭제..." -ForegroundColor Yellow
if ($reactionId) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/reactions/$reactionId" `
            -Method DELETE `
            -Headers $headers

        Write-Host "✅ 반응 삭제 성공!" -ForegroundColor Green
        Write-Host "Message: $($response.message)`n" -ForegroundColor Gray
    } catch {
        Write-Host "❌ 반응 삭제 실패: $($_.Exception.Message)`n" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️  삭제할 반응 ID가 없습니다.`n" -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Reaction API 테스트 완료!" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "📝 테스트 요약:" -ForegroundColor White
Write-Host "- 게시글 좋아요/싫어요 추가" -ForegroundColor Gray
Write-Host "- 반응 토글 (추가/취소)" -ForegroundColor Gray
Write-Host "- 반응 변경 (LIKE ↔ DISLIKE)" -ForegroundColor Gray
Write-Host "- 반응 통계 조회" -ForegroundColor Gray
Write-Host "- 반응 목록 조회 (게시글/댓글)" -ForegroundColor Gray
Write-Host "- 반응 삭제`n" -ForegroundColor Gray
