/**
 * Member Management API Testing Script
 * Node.js script to test member endpoints
 */

const API_BASE = 'http://localhost:4000/api';

// Test credentials
let adminToken = '';
let adminUserId = '';
let normalUserToken = '';
let normalUserId = '';
let politicianUserId = '';

// Helper function for HTTP requests
async function request(endpoint, method = 'GET', body = null, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const data = await response.json();
    return {
      status: response.status,
      ok: response.ok,
      data
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message
    };
  }
}

// Test functions
async function setupTestUsers() {
  console.log('\n🔧 Setting up test users...');

  // Login as admin
  const adminLoginResult = await request('/auth/login', 'POST', {
    email: 'admin@polibat.com',
    password: 'AdminPass123!@#'
  });

  if (adminLoginResult.ok) {
    adminToken = adminLoginResult.data.data.tokens.accessToken;
    adminUserId = adminLoginResult.data.data.user.userId;
    console.log('✅ Admin logged in');
  } else {
    console.log('⚠️  Admin login failed:', JSON.stringify(adminLoginResult.data, null, 2));
  }

  // Login as normal user
  const normalLoginResult = await request('/auth/login', 'POST', {
    email: 'normaluser@example.com',
    password: 'SecurePass123!@#'
  });

  if (normalLoginResult.ok) {
    normalUserToken = normalLoginResult.data.data.tokens.accessToken;
    normalUserId = normalLoginResult.data.data.user.userId;
    console.log('✅ Normal user logged in');
  } else {
    console.log('⚠️  Normal user login failed (user might not exist)');
  }
}

async function testGetMembers() {
  console.log('\n📋 Testing GET /api/members...');
  const result = await request('/members', 'GET', null, normalUserToken);
  console.log(`Status: ${result.status}`);
  if (result.ok) {
    console.log(`Found ${result.data.data.members.length} members`);
    console.log(`Pagination: Page ${result.data.data.pagination.currentPage} of ${result.data.data.pagination.totalPages}`);
  } else {
    console.log('Response:', JSON.stringify(result.data, null, 2));
  }
  return result;
}

async function testGetMembersWithFilters() {
  console.log('\n🔍 Testing GET /api/members with filters...');
  const result = await request('/members?memberType=NORMAL&status=APPROVED&limit=10', 'GET', null, normalUserToken);
  console.log(`Status: ${result.status}`);
  if (result.ok) {
    console.log(`Found ${result.data.data.members.length} filtered members`);
  } else {
    console.log('Response:', JSON.stringify(result.data, null, 2));
  }
  return result;
}

async function testGetMemberById() {
  console.log('\n👤 Testing GET /api/members/:id...');
  if (!normalUserId) {
    console.log('⚠️  Skipping: No user ID available');
    return;
  }

  const result = await request(`/members/${normalUserId}`, 'GET', null, normalUserToken);
  console.log(`Status: ${result.status}`);
  if (result.ok) {
    console.log('Member details:', JSON.stringify(result.data.data, null, 2));
  } else {
    console.log('Response:', JSON.stringify(result.data, null, 2));
  }
  return result;
}

async function testUpdateMember() {
  console.log('\n✏️ Testing PATCH /api/members/:id...');
  if (!normalUserId) {
    console.log('⚠️  Skipping: No user ID available');
    return;
  }

  const result = await request(`/members/${normalUserId}`, 'PATCH', {
    nickname: '업데이트된유저'
  }, normalUserToken);

  console.log(`Status: ${result.status}`);
  if (result.ok) {
    console.log('Updated member:', JSON.stringify(result.data.data, null, 2));
  } else {
    console.log('Response:', JSON.stringify(result.data, null, 2));
  }
  return result;
}

async function testUpdateMemberStatusAsAdmin() {
  console.log('\n🔐 Testing PATCH /api/members/admin/:id/status...');
  if (!normalUserId) {
    console.log('⚠️  Skipping: No user ID available');
    return;
  }

  const result = await request(`/members/admin/${normalUserId}/status`, 'PATCH', {
    status: 'APPROVED',
    reason: 'Test status update'
  }, adminToken);

  console.log(`Status: ${result.status}`);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  return result;
}

async function testApproveMember() {
  console.log('\n✅ Testing POST /api/members/admin/:id/approve...');

  // First, create a pending politician for approval
  const signupResult = await request('/auth/signup', 'POST', {
    email: `politician-${Date.now()}@example.com`,
    password: 'PoliticianPass123!@#',
    nickname: `정치인${Date.now()}`,
    memberType: 'POLITICIAN',
    politicianType: 'NATIONAL_ASSEMBLY',
    politicianName: '테스트정치인',
    party: '테스트당',
    district: '서울 종로구'
  });

  if (signupResult.ok) {
    const pendingUserId = signupResult.data.data.userId;
    console.log(`Created pending politician: ${pendingUserId}`);

    const approveResult = await request(`/members/admin/${pendingUserId}/approve`, 'POST', {
      reason: 'Test approval'
    }, adminToken);

    console.log(`Approve Status: ${approveResult.status}`);
    console.log('Response:', JSON.stringify(approveResult.data, null, 2));
    return approveResult;
  } else {
    console.log('⚠️  Failed to create pending politician for test');
    return signupResult;
  }
}

async function testRejectMember() {
  console.log('\n❌ Testing POST /api/members/admin/:id/reject...');

  // First, create a pending politician for rejection
  const signupResult = await request('/auth/signup', 'POST', {
    email: `politician-reject-${Date.now()}@example.com`,
    password: 'PoliticianPass123!@#',
    nickname: `거절대상${Date.now()}`,
    memberType: 'POLITICIAN',
    politicianType: 'LOCAL_GOVERNMENT',
    politicianName: '거절테스트',
    party: '테스트당',
    district: '부산 해운대구'
  });

  if (signupResult.ok) {
    const pendingUserId = signupResult.data.data.userId;
    console.log(`Created pending politician: ${pendingUserId}`);

    const rejectResult = await request(`/members/admin/${pendingUserId}/reject`, 'POST', {
      reason: '정치인 인증 서류 불충분'
    }, adminToken);

    console.log(`Reject Status: ${rejectResult.status}`);
    console.log('Response:', JSON.stringify(rejectResult.data, null, 2));
    return rejectResult;
  } else {
    console.log('⚠️  Failed to create pending politician for test');
    return signupResult;
  }
}

async function testGetMemberStatusHistory() {
  console.log('\n📜 Testing GET /api/members/admin/:id/history...');
  if (!normalUserId) {
    console.log('⚠️  Skipping: No user ID available');
    return;
  }

  const result = await request(`/members/admin/${normalUserId}/history`, 'GET', null, adminToken);
  console.log(`Status: ${result.status}`);
  if (result.ok) {
    console.log('Status history:', JSON.stringify(result.data.data, null, 2));
  } else {
    console.log('Response:', JSON.stringify(result.data, null, 2));
  }
  return result;
}

// Main test sequence
async function runTests() {
  console.log('🚀 Starting Member Management API Tests\n');
  console.log('=' .repeat(60));

  try {
    // Setup
    await setupTestUsers();

    if (!normalUserToken) {
      console.log('\n❌ Cannot proceed without authentication. Please run test-auth.js first.');
      return;
    }

    // Test 1: Get members list
    await testGetMembers();

    // Test 2: Get members with filters
    await testGetMembersWithFilters();

    // Test 3: Get member by ID
    await testGetMemberById();

    // Test 4: Update member
    await testUpdateMember();

    // Test 5: Admin - Update member status
    await testUpdateMemberStatusAsAdmin();

    // Test 6: Admin - Approve member
    await testApproveMember();

    // Test 7: Admin - Reject member
    await testRejectMember();

    // Test 8: Admin - Get status history
    await testGetMemberStatusHistory();

    console.log('\n' + '='.repeat(60));
    console.log('✅ All member management tests completed!');
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
  }
}

// Run tests
runTests();
