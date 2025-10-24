# Vote API 테스트 스크립트
# 투표 API 엔드포인트 테스트

$baseUrl = "http://localhost:4000/api"
$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Vote API 테스트 시작" -ForegroundColor Cyan
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

# 2. 투표용 게시글 생성
Write-Host "[2] 투표용 게시글 생성..." -ForegroundColor Yellow
$createPostBody = @{
    boardType = "VOTE"
    title = "API 테스트 투표 - 좋아하는 프로그래밍 언어는?"
    content = "여러분이 가장 좋아하는 프로그래밍 언어를 선택해주세요."
} | ConvertTo-Json

try {
    $postResponse = Invoke-RestMethod -Uri "$baseUrl/posts" `
        -Method POST `
        -Headers $headers `
        -Body $createPostBody

    $postId = $postResponse.postId
    Write-Host "✅ 게시글 생성 성공!" -ForegroundColor Green
    Write-Host "Post ID: $postId`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ 게시글 생성 실패: $($_.Exception.Message)`n" -ForegroundColor Red
    exit 1
}

# 3. 투표 생성
Write-Host "[3] 투표 생성..." -ForegroundColor Yellow
$now = Get-Date
$startDate = $now.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
$endDate = $now.AddDays(7).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")

$createVoteBody = @{
    postId = $postId
    startDate = $startDate
    endDate = $endDate
    allowMultiple = $false
    options = @(
        @{
            content = "Python"
            displayOrder = 0
        },
        @{
            content = "JavaScript"
            displayOrder = 1
        },
        @{
            content = "TypeScript"
            displayOrder = 2
        },
        @{
            content = "Go"
            displayOrder = 3
        },
        @{
            content = "Rust"
            displayOrder = 4
        }
    )
} | ConvertTo-Json -Depth 10

try {
    $voteResponse = Invoke-RestMethod -Uri "$baseUrl/votes" `
        -Method POST `
        -Headers $headers `
        -Body $createVoteBody

    $voteId = $voteResponse.id
    Write-Host "✅ 투표 생성 성공!" -ForegroundColor Green
    Write-Host "Vote ID: $voteId" -ForegroundColor Gray
    Write-Host "옵션 수: $($voteResponse.options.Count)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ 투표 생성 실패: $($_.Exception.Message)`n" -ForegroundColor Red
    exit 1
}

# 4. 투표 상세 조회
Write-Host "[4] 투표 상세 조회..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/votes/$voteId" `
        -Method GET `
        -Headers $headers

    Write-Host "✅ 투표 조회 성공!" -ForegroundColor Green
    Write-Host "Status: $($response.status)" -ForegroundColor Gray
    Write-Host "Allow Multiple: $($response.allowMultiple)" -ForegroundColor Gray
    Write-Host "Total Voters: $($response.totalVoters)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ 투표 조회 실패: $($_.Exception.Message)`n" -ForegroundColor Red
}

# 5. 게시글 ID로 투표 조회
Write-Host "[5] 게시글 ID로 투표 조회..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/posts/$postId/vote" `
        -Method GET `
        -Headers $headers

    Write-Host "✅ 투표 조회 성공!" -ForegroundColor Green
    Write-Host "Vote ID: $($response.id)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ 투표 조회 실패: $($_.Exception.Message)`n" -ForegroundColor Red
}

# 6. 투표 참여 (첫 번째 옵션 선택)
Write-Host "[6] 투표 참여 (Python 선택)..." -ForegroundColor Yellow
$optionId = $voteResponse.options[0].optionId

$participateBody = @{
    optionIds = @($optionId)
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/votes/$voteId/participate" `
        -Method POST `
        -Headers $headers `
        -Body $participateBody

    Write-Host "✅ 투표 참여 성공!" -ForegroundColor Green
    Write-Host "Total Voters: $($response.totalVoters)" -ForegroundColor Gray
    Write-Host "선택한 옵션: $($response.userParticipation.selectedOptions.Count)개`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ 투표 참여 실패: $($_.Exception.Message)`n" -ForegroundColor Red
}

# 7. 투표 결과 조회
Write-Host "[7] 투표 결과 조회..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/votes/$voteId/results" `
        -Method GET `
        -Headers $headers

    Write-Host "✅ 투표 결과 조회 성공!" -ForegroundColor Green
    Write-Host "Total Voters: $($response.totalVoters)" -ForegroundColor Gray
    foreach ($option in $response.options) {
        $marker = if ($option.isUserChoice) { " ← 내 선택" } else { "" }
        Write-Host "  - $($option.content): $($option.voteCount)표 ($($option.percentage)%)$marker" -ForegroundColor Gray
    }
    Write-Host ""
} catch {
    Write-Host "❌ 투표 결과 조회 실패: $($_.Exception.Message)`n" -ForegroundColor Red
}

# 8. 투표 변경 (다른 옵션 선택)
Write-Host "[8] 투표 변경 (TypeScript로 변경)..." -ForegroundColor Yellow
$newOptionId = $voteResponse.options[2].optionId

$changeVoteBody = @{
    optionIds = @($newOptionId)
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/votes/$voteId/participate" `
        -Method POST `
        -Headers $headers `
        -Body $changeVoteBody

    Write-Host "✅ 투표 변경 성공!" -ForegroundColor Green
    Write-Host "Total Voters: $($response.totalVoters) (변경이므로 동일)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ 투표 변경 실패: $($_.Exception.Message)`n" -ForegroundColor Red
}

# 9. 투표 결과 재조회 (변경 확인)
Write-Host "[9] 투표 결과 재조회 (변경 확인)..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/votes/$voteId/results" `
        -Method GET `
        -Headers $headers

    Write-Host "✅ 투표 결과 조회 성공!" -ForegroundColor Green
    foreach ($option in $response.options) {
        $marker = if ($option.isUserChoice) { " ← 내 선택" } else { "" }
        Write-Host "  - $($option.content): $($option.voteCount)표 ($($option.percentage)%)$marker" -ForegroundColor Gray
    }
    Write-Host ""
} catch {
    Write-Host "❌ 투표 결과 조회 실패: $($_.Exception.Message)`n" -ForegroundColor Red
}

# 10. 투표 참여 취소
Write-Host "[10] 투표 참여 취소..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/votes/$voteId/participate" `
        -Method DELETE `
        -Headers $headers

    Write-Host "✅ 투표 참여 취소 성공!" -ForegroundColor Green
    Write-Host "Message: $($response.message)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ 투표 참여 취소 실패: $($_.Exception.Message)`n" -ForegroundColor Red
}

# 11. 투표 결과 재조회 (취소 확인)
Write-Host "[11] 투표 결과 재조회 (취소 확인)..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/votes/$voteId/results" `
        -Method GET `
        -Headers $headers

    Write-Host "✅ 투표 결과 조회 성공!" -ForegroundColor Green
    Write-Host "Total Voters: $($response.totalVoters) (감소 확인)" -ForegroundColor Gray
    foreach ($option in $response.options) {
        Write-Host "  - $($option.content): $($option.voteCount)표 ($($option.percentage)%)" -ForegroundColor Gray
    }
    Write-Host ""
} catch {
    Write-Host "❌ 투표 결과 조회 실패: $($_.Exception.Message)`n" -ForegroundColor Red
}

# 12. 복수 선택 투표 생성
Write-Host "[12] 복수 선택 투표 생성..." -ForegroundColor Yellow
$createPost2Body = @{
    boardType = "VOTE"
    title = "API 테스트 복수 선택 투표 - 사용해본 프레임워크는?"
    content = "사용해본 프레임워크를 모두 선택해주세요."
} | ConvertTo-Json

try {
    $post2Response = Invoke-RestMethod -Uri "$baseUrl/posts" `
        -Method POST `
        -Headers $headers `
        -Body $createPost2Body

    $post2Id = $post2Response.postId

    $createVote2Body = @{
        postId = $post2Id
        startDate = $startDate
        endDate = $endDate
        allowMultiple = $true
        options = @(
            @{
                content = "React"
                displayOrder = 0
            },
            @{
                content = "Vue"
                displayOrder = 1
            },
            @{
                content = "Angular"
                displayOrder = 2
            }
        )
    } | ConvertTo-Json -Depth 10

    $vote2Response = Invoke-RestMethod -Uri "$baseUrl/votes" `
        -Method POST `
        -Headers $headers `
        -Body $createVote2Body

    $vote2Id = $vote2Response.id
    Write-Host "✅ 복수 선택 투표 생성 성공!" -ForegroundColor Green
    Write-Host "Vote ID: $vote2Id`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ 복수 선택 투표 생성 실패: $($_.Exception.Message)`n" -ForegroundColor Red
}

# 13. 복수 선택 투표 참여 (여러 옵션 선택)
Write-Host "[13] 복수 선택 투표 참여 (React, Vue 선택)..." -ForegroundColor Yellow
$option1Id = $vote2Response.options[0].optionId
$option2Id = $vote2Response.options[1].optionId

$participateMultipleBody = @{
    optionIds = @($option1Id, $option2Id)
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/votes/$vote2Id/participate" `
        -Method POST `
        -Headers $headers `
        -Body $participateMultipleBody

    Write-Host "✅ 복수 선택 투표 참여 성공!" -ForegroundColor Green
    Write-Host "선택한 옵션: $($response.userParticipation.selectedOptions.Count)개`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ 복수 선택 투표 참여 실패: $($_.Exception.Message)`n" -ForegroundColor Red
}

# 14. 투표 통계 조회
Write-Host "[14] 투표 통계 조회..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/votes/stats" `
        -Method GET

    Write-Host "✅ 투표 통계 조회 성공!" -ForegroundColor Green
    Write-Host "Total Votes: $($response.totalVotes)" -ForegroundColor Gray
    Write-Host "Active Votes: $($response.activeVotes)" -ForegroundColor Gray
    Write-Host "Closed Votes: $($response.closedVotes)" -ForegroundColor Gray
    Write-Host "Total Participants: $($response.totalParticipants)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ 투표 통계 조회 실패: $($_.Exception.Message)`n" -ForegroundColor Red
}

# 15. 투표 종료 (관리자)
Write-Host "[15] 투표 종료..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/votes/$voteId/close" `
        -Method PATCH `
        -Headers $headers

    Write-Host "✅ 투표 종료 성공!" -ForegroundColor Green
    Write-Host "Status: $($response.status)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ 투표 종료 실패: $($_.Exception.Message)`n" -ForegroundColor Red
}

# 16. 종료된 투표 참여 시도 (실패 예상)
Write-Host "[16] 종료된 투표 참여 시도 (실패 예상)..." -ForegroundColor Yellow
$closedVoteBody = @{
    optionIds = @($optionId)
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/votes/$voteId/participate" `
        -Method POST `
        -Headers $headers `
        -Body $closedVoteBody

    Write-Host "❌ 예상치 못한 성공 (종료된 투표 참여 가능)`n" -ForegroundColor Red
} catch {
    Write-Host "✅ 예상대로 실패! (종료된 투표 참여 불가)" -ForegroundColor Green
    Write-Host "Error: $($_.Exception.Message)`n" -ForegroundColor Gray
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Vote API 테스트 완료" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
