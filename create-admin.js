/**
 * Create Admin User Script
 * Creates an admin user in the database for testing
 */

const API_BASE = 'http://localhost:4000/api';

// Admin user data
const adminData = {
  email: 'admin@polibat.com',
  password: 'AdminPass123!@#',
  nickname: '관리자',
  memberType: 'ADMIN'
};

// Helper function for HTTP request
async function request(endpoint, method = 'GET', body = null) {
  const headers = {
    'Content-Type': 'application/json',
  };

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

async function createAdmin() {
  console.log('🔐 Creating admin user...\n');

  // Try to create admin user
  const signupResult = await request('/auth/signup', 'POST', adminData);

  if (signupResult.ok) {
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Password:', adminData.password);
    console.log('\nUser ID:', signupResult.data.data.userId);
    console.log('Member ID:', signupResult.data.data.memberId);
    console.log('Status:', signupResult.data.data.status);
  } else {
    if (signupResult.status === 409) {
      console.log('ℹ️  Admin user already exists');
      console.log('📧 Email:', adminData.email);
      console.log('🔑 Password:', adminData.password);
    } else {
      console.log('❌ Failed to create admin user');
      console.log('Response:', JSON.stringify(signupResult.data, null, 2));
    }
  }

  // Test admin login
  console.log('\n🔐 Testing admin login...');
  const loginResult = await request('/auth/login', 'POST', {
    email: adminData.email,
    password: adminData.password
  });

  if (loginResult.ok) {
    console.log('✅ Admin login successful!');
    console.log('\nAccess Token:', loginResult.data.data.tokens.accessToken.substring(0, 50) + '...');
  } else {
    console.log('❌ Admin login failed');
    console.log('Response:', JSON.stringify(loginResult.data, null, 2));
  }
}

createAdmin();
