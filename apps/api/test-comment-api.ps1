# 댓글 API 테스트 스크립트

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "댓글 API 테스트 시작" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# 1. 로그인
Write-Host "`n[1] 로그인 테스트..." -ForegroundColor Yellow
$loginBody = @{
    email = "test@example.com"
    password = "Test1234!"
} | ConvertTo-Json

$loginResponse = Invoke-WebRequest -Uri "http://localhost:4000/api/auth/login" `
    -Method POST `
    -Body $loginBody `
    -ContentType "application/json" `
    -UseBasicParsing

$loginData = $loginResponse.Content | ConvertFrom-Json
$token = $loginData.data.accessToken

Write-Host "✅ 로그인 성공!" -ForegroundColor Green
Write-Host "Token: $($token.Substring(0, 20))..." -ForegroundColor Gray

# 2. 댓글 작성
Write-Host "`n[2] 댓글 작성 테스트..." -ForegroundColor Yellow
$commentBody = @{
    content = "첫 번째 댓글입니다! 테스트 중입니다."
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $createResponse = Invoke-WebRequest -Uri "http://localhost:4000/api/posts/FB000001/comments" `
        -Method POST `
        -Headers $headers `
        -Body $commentBody `
        -UseBasicParsing

    $createData = $createResponse.Content | ConvertFrom-Json
    Write-Host "✅ 댓글 작성 성공!" -ForegroundColor Green
    Write-Host "CommentID: $($createData.data.commentId)" -ForegroundColor Gray
    Write-Host "내용: $($createData.data.content)" -ForegroundColor Gray

    $commentId = $createData.data.commentId

    # 3. 댓글 목록 조회
    Write-Host "`n[3] 댓글 목록 조회 테스트..." -ForegroundColor Yellow
    $listResponse = Invoke-WebRequest -Uri "http://localhost:4000/api/posts/FB000001/comments" `
        -Method GET `
        -UseBasicParsing

    $listData = $listResponse.Content | ConvertFrom-Json
    Write-Host "✅ 댓글 목록 조회 성공!" -ForegroundColor Green
    Write-Host "총 댓글 수: $($listData.data.pagination.total)" -ForegroundColor Gray

    # 4. 댓글 수정
    Write-Host "`n[4] 댓글 수정 테스트..." -ForegroundColor Yellow
    $updateBody = @{
        content = "댓글을 수정했습니다!"
    } | ConvertTo-Json

    $updateResponse = Invoke-WebRequest -Uri "http://localhost:4000/api/comments/$commentId" `
        -Method PATCH `
        -Headers $headers `
        -Body $updateBody `
        -UseBasicParsing

    $updateData = $updateResponse.Content | ConvertFrom-Json
    Write-Host "✅ 댓글 수정 성공!" -ForegroundColor Green
    Write-Host "수정된 내용: $($updateData.data.content)" -ForegroundColor Gray

    # 5. 댓글 삭제
    Write-Host "`n[5] 댓글 삭제 테스트..." -ForegroundColor Yellow
    $deleteResponse = Invoke-WebRequest -Uri "http://localhost:4000/api/comments/$commentId" `
        -Method DELETE `
        -Headers $headers `
        -UseBasicParsing

    $deleteData = $deleteResponse.Content | ConvertFrom-Json
    Write-Host "✅ 댓글 삭제 성공!" -ForegroundColor Green
    Write-Host "메시지: $($deleteData.data.message)" -ForegroundColor Gray

    # 6. 삭제 후 목록 조회
    Write-Host "`n[6] 삭제 후 댓글 목록 조회..." -ForegroundColor Yellow
    $finalListResponse = Invoke-WebRequest -Uri "http://localhost:4000/api/posts/FB000001/comments" `
        -Method GET `
        -UseBasicParsing

    $finalListData = $finalListResponse.Content | ConvertFrom-Json
    Write-Host "✅ 최종 댓글 목록 조회 성공!" -ForegroundColor Green
    Write-Host "총 댓글 수: $($finalListData.data.pagination.total)" -ForegroundColor Gray

} catch {
    Write-Host "❌ 오류 발생!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error Body: $errorBody" -ForegroundColor Red
    }
}

Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "댓글 API 테스트 완료!" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
