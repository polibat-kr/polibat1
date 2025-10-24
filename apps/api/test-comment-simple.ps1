# 간단한 댓글 API 테스트

Write-Host "댓글 API 테스트 시작..." -ForegroundColor Cyan

# 1. 로그인
Write-Host "`n[1] 로그인..." -ForegroundColor Yellow
$loginResult = curl.exe -s -X POST http://localhost:4000/api/auth/login `
    -H "Content-Type: application/json" `
    -d '{\"email\":\"commenttest@example.com\",\"password\":\"Comment1234!\"}'

Write-Host "Login Response: $loginResult" -ForegroundColor Gray

$loginJson = $loginResult | ConvertFrom-Json
$token = $loginJson.data.accessToken

Write-Host "✅ Token: $($token.Substring(0, 30))..." -ForegroundColor Green

# 2. 게시글 작성
Write-Host "`n[2] 게시글 작성..." -ForegroundColor Yellow
$postResult = curl.exe -s -X POST http://localhost:4000/api/posts `
    -H "Authorization: Bearer $token" `
    -H "Content-Type: application/json" `
    -d '{\"boardType\":\"FREE\",\"title\":\"댓글 테스트용\",\"content\":\"댓글 테스트를 위한 게시글입니다.\"}'

Write-Host "Post Response: $postResult" -ForegroundColor Gray

$postJson = $postResult | ConvertFrom-Json
$postId = $postJson.data.postId

Write-Host "✅ PostID: $postId" -ForegroundColor Green

# 3. 댓글 작성
Write-Host "`n[3] 댓글 작성..." -ForegroundColor Yellow
$commentResult = curl.exe -s -X POST "http://localhost:4000/api/posts/$postId/comments" `
    -H "Authorization: Bearer $token" `
    -H "Content-Type: application/json" `
    -d '{\"content\":\"첫 번째 댓글입니다!\"}'

Write-Host "Comment Response: $commentResult" -ForegroundColor Gray

$commentJson = $commentResult | ConvertFrom-Json
$commentId = $commentJson.data.commentId

Write-Host "✅ CommentID: $commentId" -ForegroundColor Green

# 4. 댓글 목록 조회
Write-Host "`n[4] 댓글 목록 조회..." -ForegroundColor Yellow
$listResult = curl.exe -s -X GET "http://localhost:4000/api/posts/$postId/comments"

Write-Host "List Response: $listResult" -ForegroundColor Gray

$listJson = $listResult | ConvertFrom-Json
Write-Host "✅ 총 댓글 수: $($listJson.data.pagination.total)" -ForegroundColor Green

# 5. 댓글 수정
Write-Host "`n[5] 댓글 수정..." -ForegroundColor Yellow
$updateResult = curl.exe -s -X PATCH "http://localhost:4000/api/comments/$commentId" `
    -H "Authorization: Bearer $token" `
    -H "Content-Type: application/json" `
    -d '{\"content\":\"댓글을 수정했습니다!\"}'

Write-Host "Update Response: $updateResult" -ForegroundColor Gray
Write-Host "✅ 댓글 수정 완료" -ForegroundColor Green

# 6. 댓글 삭제
Write-Host "`n[6] 댓글 삭제..." -ForegroundColor Yellow
$deleteResult = curl.exe -s -X DELETE "http://localhost:4000/api/comments/$commentId" `
    -H "Authorization: Bearer $token"

Write-Host "Delete Response: $deleteResult" -ForegroundColor Gray
Write-Host "✅ 댓글 삭제 완료" -ForegroundColor Green

Write-Host "`n테스트 완료!" -ForegroundColor Cyan
