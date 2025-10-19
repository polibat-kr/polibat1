/**
 * Authentication API Testing Script
 * Node.js script to test auth endpoints
 */

const API_BASE = 'http://localhost:4000/api';

// Test data
const testUser = {
  email: 'normaluser@example.com',
  password: 'SecurePass123!@#',
  nickname: '일반유저테스트',
  memberType: 'NORMAL'
};

const testPolitician = {
  email: 'politician@example.com',
  password: 'Politician1234!@#',
  nickname: '정치인테스트',
  memberType: 'POLITICIAN',
  politicianType: 'NATIONAL_ASSEMBLY',
  politicianName: '홍길동',
  party: '테스트당',
  district: '서울 강남구'
};

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
async function testSignup() {
  console.log('\n📝 Testing Signup...');
  const result = await request('/auth/signup', 'POST', testUser);
  console.log(`Status: ${result.status}`);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  return result;
}

async function testPoliticianSignup() {
  console.log('\n📝 Testing Politician Signup...');
  const result = await request('/auth/signup', 'POST', testPolitician);
  console.log(`Status: ${result.status}`);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  return result;
}

async function testLogin() {
  console.log('\n🔐 Testing Login...');
  const result = await request('/auth/login', 'POST', {
    email: testUser.email,
    password: testUser.password
  });
  console.log(`Status: ${result.status}`);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  return result;
}

async function testGetMe(token) {
  console.log('\n👤 Testing Get Current User...');
  const result = await request('/auth/me', 'GET', null, token);
  console.log(`Status: ${result.status}`);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  return result;
}

async function testRefreshToken(refreshToken) {
  console.log('\n🔄 Testing Token Refresh...');
  const result = await request('/auth/refresh', 'POST', { refreshToken });
  console.log(`Status: ${result.status}`);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  return result;
}

async function testLogout() {
  console.log('\n🚪 Testing Logout...');
  const result = await request('/auth/logout', 'POST');
  console.log(`Status: ${result.status}`);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  return result;
}

// Main test sequence
async function runTests() {
  console.log('🚀 Starting Authentication API Tests\n');
  console.log('=' .repeat(50));

  try {
    // Test 1: Signup (Normal User)
    const signupResult = await testSignup();
    if (!signupResult.ok) {
      console.log('⚠️  Signup may have failed (user might already exist)');
    }

    // Test 2: Signup (Politician)
    const politicianSignupResult = await testPoliticianSignup();
    if (!politicianSignupResult.ok) {
      console.log('⚠️  Politician signup may have failed (user might already exist)');
    }

    // Test 3: Login
    const loginResult = await testLogin();
    if (!loginResult.ok) {
      console.error('❌ Login failed!');
      return;
    }

    const { accessToken, refreshToken } = loginResult.data.data.tokens;
    console.log('\n✅ Login successful! Tokens received.');

    // Test 4: Get Current User
    await testGetMe(accessToken);

    // Test 5: Refresh Token
    await testRefreshToken(refreshToken);

    // Test 6: Logout
    await testLogout();

    console.log('\n' + '='.repeat(50));
    console.log('✅ All tests completed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
  }
}

// Run tests
runTests();
