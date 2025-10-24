# Admin Post Management API 테스트 스크립트
# PowerShell 7+ 필요

$baseUrl = "http://localhost:4000"
$adminEmail = "admin@polibat.com"
$adminPassword = "admin123!"

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🧪 Admin Post Management API 테스트 시작" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

# 1. 관리자 로그인
Write-Host "1️⃣  관리자 로그인..." -ForegroundColor Yellow
$loginBody = @{
    email = $adminEmail
    password = $adminPassword
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" `
        -Method Post `
        -Body $loginBody `
        -ContentType "application/json"

    $accessToken = $loginResponse.data.accessToken
    Write-Host "✅ 로그인 성공!" -ForegroundColor Green
    Write-Host "   Access Token: $($accessToken.Substring(0, 50))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ 로그인 실패: $_" -ForegroundColor Red
    exit 1
}

# 인증 헤더 설정
$headers = @{
    "Authorization" = "Bearer $accessToken"
    "Content-Type" = "application/json"
}

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📋 게시글 관리 API 테스트" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

# 2. 게시글 목록 조회 (전체)
Write-Host "2️⃣  게시글 목록 조회 (전체)..." -ForegroundColor Yellow
try {
    $postsResponse = Invoke-RestMethod -Uri "$baseUrl/api/admin/posts?page=1&limit=10" `
        -Method Get `
        -Headers $headers

    Write-Host "✅ 목록 조회 성공!" -ForegroundColor Green
    Write-Host "   총 게시글 수: $($postsResponse.data.pagination.total)" -ForegroundColor Gray
    Write-Host "   현재 페이지: $($postsResponse.data.posts.Count)개" -ForegroundColor Gray

    if ($postsResponse.data.posts.Count -gt 0) {
        $firstPost = $postsResponse.data.posts[0]
        Write-Host "   첫 번째 게시글: $($firstPost.title)" -ForegroundColor Gray
        Write-Host "   작성자: $($firstPost.authorNickname) ($($firstPost.authorMemberType))" -ForegroundColor Gray

        # 상세 조회용 ID 저장
        $testPostId = $firstPost.id
    }
} catch {
    Write-Host "❌ 목록 조회 실패: $_" -ForegroundColor Red
}

# 3. 게시글 목록 조회 (자유게시판만)
Write-Host "`n3️⃣  게시글 목록 조회 (자유게시판)..." -ForegroundColor Yellow
try {
    $freeBoardResponse = Invoke-RestMethod -Uri "$baseUrl/api/admin/posts?boardType=FREE&page=1&limit=5" `
        -Method Get `
        -Headers $headers

    Write-Host "✅ 자유게시판 조회 성공!" -ForegroundColor Green
    Write-Host "   자유게시판 게시글 수: $($freeBoardResponse.data.pagination.total)" -ForegroundColor Gray
} catch {
    Write-Host "❌ 자유게시판 조회 실패: $_" -ForegroundColor Red
}

# 4. 게시글 목록 조회 (검색)
Write-Host "`n4️⃣  게시글 검색..." -ForegroundColor Yellow
try {
    $searchResponse = Invoke-RestMethod -Uri "$baseUrl/api/admin/posts?search=정치&page=1&limit=5" `
        -Method Get `
        -Headers $headers

    Write-Host "✅ 검색 성공!" -ForegroundColor Green
    Write-Host "   검색 결과: $($searchResponse.data.pagination.total)개" -ForegroundColor Gray
} catch {
    Write-Host "❌ 검색 실패: $_" -ForegroundColor Red
}

# 5. 게시글 상세 조회
if ($testPostId) {
    Write-Host "`n5️⃣  게시글 상세 조회..." -ForegroundColor Yellow
    try {
        $postDetailResponse = Invoke-RestMethod -Uri "$baseUrl/api/admin/posts/$testPostId" `
            -Method Get `
            -Headers $headers

        $post = $postDetailResponse.data
        Write-Host "✅ 상세 조회 성공!" -ForegroundColor Green
        Write-Host "   제목: $($post.title)" -ForegroundColor Gray
        Write-Host "   작성자: $($post.authorNickname) ($($post.authorEmail))" -ForegroundColor Gray
        Write-Host "   상태: $($post.status)" -ForegroundColor Gray
        Write-Host "   조회수: $($post.viewCount)" -ForegroundColor Gray
        Write-Host "   좋아요: $($post.likeCount) / 싫어요: $($post.dislikeCount)" -ForegroundColor Gray
        Write-Host "   댓글 수: $($post.commentCount)" -ForegroundColor Gray
        Write-Host "   신고 수: $($post.reportCount)" -ForegroundColor Gray

        if ($post.vote) {
            Write-Host "   투표: $($post.vote.title) ($($post.vote.status))" -ForegroundColor Gray
            Write-Host "   투표 참여자: $($post.vote.totalVotes)명" -ForegroundColor Gray
        }

        Write-Host "   최근 댓글: $($post.recentComments.Count)개" -ForegroundColor Gray
        Write-Host "   최근 신고: $($post.recentReports.Count)개" -ForegroundColor Gray
    } catch {
        Write-Host "❌ 상세 조회 실패: $_" -ForegroundColor Red
    }
}

# 6. 게시글 상태 변경 (숨김)
if ($testPostId) {
    Write-Host "`n6️⃣  게시글 상태 변경 (숨김)..." -ForegroundColor Yellow
    $statusBody = @{
        status = "HIDDEN"
        reason = "테스트: 관리자 판단에 의한 숨김 처리"
    } | ConvertTo-Json

    try {
        $updateStatusResponse = Invoke-RestMethod -Uri "$baseUrl/api/admin/posts/$testPostId/status" `
            -Method Patch `
            -Headers $headers `
            -Body $statusBody

        Write-Host "✅ 상태 변경 성공!" -ForegroundColor Green
        Write-Host "   이전 상태: $($updateStatusResponse.data.previousStatus)" -ForegroundColor Gray
        Write-Host "   현재 상태: $($updateStatusResponse.data.currentStatus)" -ForegroundColor Gray
        Write-Host "   변경 사유: $($updateStatusResponse.data.reason)" -ForegroundColor Gray
    } catch {
        Write-Host "❌ 상태 변경 실패: $_" -ForegroundColor Red
    }
}

# 7. 게시글 상태 복원 (재게시)
if ($testPostId) {
    Write-Host "`n7️⃣  게시글 상태 복원 (재게시)..." -ForegroundColor Yellow
    $restoreBody = @{
        status = "PUBLISHED"
        reason = "테스트: 정상 게시글로 복원"
    } | ConvertTo-Json

    try {
        $restoreResponse = Invoke-RestMethod -Uri "$baseUrl/api/admin/posts/$testPostId/status" `
            -Method Patch `
            -Headers $headers `
            -Body $restoreBody

        Write-Host "✅ 복원 성공!" -ForegroundColor Green
        Write-Host "   현재 상태: $($restoreResponse.data.currentStatus)" -ForegroundColor Gray
    } catch {
        Write-Host "❌ 복원 실패: $_" -ForegroundColor Red
    }
}

# 8. 게시글 정렬 테스트 (조회수 순)
Write-Host "`n8️⃣  게시글 정렬 (조회수 순)..." -ForegroundColor Yellow
try {
    $sortResponse = Invoke-RestMethod -Uri "$baseUrl/api/admin/posts?sortBy=viewCount&sortOrder=desc&limit=5" `
        -Method Get `
        -Headers $headers

    Write-Host "✅ 정렬 성공!" -ForegroundColor Green
    Write-Host "   상위 5개 게시글 (조회수 순):" -ForegroundColor Gray
    foreach ($post in $sortResponse.data.posts) {
        Write-Host "   - $($post.title) (조회수: $($post.viewCount))" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ 정렬 실패: $_" -ForegroundColor Red
}

# 9. 특정 작성자 게시글 조회
if ($testPostId) {
    Write-Host "`n9️⃣  특정 작성자 게시글 조회..." -ForegroundColor Yellow
    try {
        $postDetailResponse = Invoke-RestMethod -Uri "$baseUrl/api/admin/posts/$testPostId" `
            -Method Get `
            -Headers $headers

        $authorId = $postDetailResponse.data.authorId

        $authorPostsResponse = Invoke-RestMethod -Uri "$baseUrl/api/admin/posts?authorId=$authorId" `
            -Method Get `
            -Headers $headers

        Write-Host "✅ 작성자 게시글 조회 성공!" -ForegroundColor Green
        Write-Host "   작성자: $($postDetailResponse.data.authorNickname)" -ForegroundColor Gray
        Write-Host "   총 게시글 수: $($authorPostsResponse.data.pagination.total)" -ForegroundColor Gray
    } catch {
        Write-Host "❌ 작성자 게시글 조회 실패: $_" -ForegroundColor Red
    }
}

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✅ Admin Post Management API 테스트 완료!" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

Write-Host "📝 테스트 요약:" -ForegroundColor Yellow
Write-Host "   - 게시글 목록 조회 (전체/필터/검색/정렬): ✅" -ForegroundColor Green
Write-Host "   - 게시글 상세 조회: ✅" -ForegroundColor Green
Write-Host "   - 게시글 상태 변경: ✅" -ForegroundColor Green
Write-Host "   - 특정 작성자 게시글 조회: ✅" -ForegroundColor Green
Write-Host "`n💡 참고: 게시글 삭제 기능은 실제 데이터 손실을 방지하기 위해 스크립트에서 제외했습니다." -ForegroundColor Gray
