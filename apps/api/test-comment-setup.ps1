# 댓글 API 테스트를 위한 계정 및 게시글 생성

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "테스트 환경 설정" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# 1. 회원가입
Write-Host "`n[1] 테스트 계정 생성..." -ForegroundColor Yellow
$signupBody = @{
    memberType = "NORMAL"
    email = "commenttest@example.com"
    password = "Comment1234!"
    nickname = "댓글테스터"
    phone = "01012345678"
} | ConvertTo-Json

try {
    $signupResponse = Invoke-WebRequest -Uri "http://localhost:4000/api/auth/signup" `
        -Method POST `
        -Body $signupBody `
        -ContentType "application/json" `
        -UseBasicParsing

    Write-Host "✅ 회원가입 성공!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ 회원가입 실패 (이미 존재할 수 있음)" -ForegroundColor Yellow
}

# 2. 로그인
Write-Host "`n[2] 로그인..." -ForegroundColor Yellow
$loginBody = @{
    email = "commenttest@example.com"
    password = "Comment1234!"
} | ConvertTo-Json

$loginResponse = Invoke-WebRequest -Uri "http://localhost:4000/api/auth/login" `
    -Method POST `
    -Body $loginBody `
    -ContentType "application/json" `
    -UseBasicParsing

$loginData = $loginResponse.Content | ConvertFrom-Json
$token = $loginData.data.accessToken

Write-Host "✅ 로그인 성공!" -ForegroundColor Green
Write-Host "Token: $($token.Substring(0, 30))..." -ForegroundColor Gray

# 3. 게시글 작성
Write-Host "`n[3] 테스트 게시글 생성..." -ForegroundColor Yellow
$postBody = @{
    boardType = "FREE"
    title = "댓글 테스트용 게시글"
    content = "이 게시글은 댓글 API 테스트를 위한 게시글입니다."
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$postResponse = Invoke-WebRequest -Uri "http://localhost:4000/api/posts" `
    -Method POST `
    -Headers $headers `
    -Body $postBody `
    -UseBasicParsing

$postData = $postResponse.Content | ConvertFrom-Json
$postId = $postData.data.postId

Write-Host "✅ 게시글 생성 성공!" -ForegroundColor Green
Write-Host "PostID: $postId" -ForegroundColor Gray

Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "테스트 환경 설정 완료!" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Email: commenttest@example.com" -ForegroundColor White
Write-Host "Password: Comment1234!" -ForegroundColor White
Write-Host "PostID: $postId" -ForegroundColor White
Write-Host "Token: $token" -ForegroundColor Gray
