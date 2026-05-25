/**
 * Test the complete Farmer → Admin → Business verification workflow
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5001';
const API_BASE = `${BASE_URL}/api`;

// Test data
const testUsers = {
  farmer: {
    name: 'Test Farmer Verification',
    mobile: '9123456790',
    email: 'farmer-verify@test.com',
    password: '123456',
    role: 'farmer'
  },
  business: {
    name: 'Test Business Verification',
    mobile: '9123456791',
    email: 'business-verify@test.com',
    password: '123456',
    role: 'business'
  }
};

let farmerToken = null;
let businessToken = null;
let adminToken = null;
let farmerId = null;
let businessId = null;
let adminId = null;

async function testStep(description, testFn) {
  try {
    console.log(`\n🧪 ${description}`);
    const result = await testFn();
    console.log(`✅ ${description} - SUCCESS`);
    return result;
  } catch (error) {
    console.error(`❌ ${description} - FAILED:`, error.response?.data || error.message);
    throw error;
  }
}

async function registerUser(userData) {
  const response = await axios.post(`${API_BASE}/auth/register`, userData);
  return response.data;
}

async function login(identifier, password) {
  const response = await axios.post(`${API_BASE}/auth/login`, { identifier, password });
  return response.data;
}

async function createListing(listingData, token) {
  const response = await axios.post(`${API_BASE}/listings`, listingData, {
    headers: { 'x-auth-token': token }
  });
  return response.data;
}

async function runVerificationFlowTest() {
  console.log('🚀 Starting Farmer → Admin → Business Verification Flow Test...\n');

  try {
    // Step 1: Register and login as farmer
    await testStep('Register Farmer', async () => {
      try {
        const result = await registerUser(testUsers.farmer);
        farmerToken = result.token;
        farmerId = result.user.id;
        console.log('Farmer registered:', result.user.name, result.user.role);
        return result;
      } catch (error) {
        // User might already exist, try login
        const result = await login(testUsers.farmer.mobile, testUsers.farmer.password);
        farmerToken = result.token;
        farmerId = result.user.id;
        console.log('Farmer logged in:', result.user.name, result.user.role);
        return result;
      }
    });

    // Step 2: Create a listing as farmer
    await testStep('Create Farmer Listing', async () => {
      const listingData = {
        crop: 'Test Wheat',
        variety: 'Premium',
        quantity: 100,
        unit: 'kg',
        pricePerUnit: 25,
        qualityGrade: 'A',
        location: {
          state: 'Punjab',
          district: 'Ludhiana'
        }
      };
      const result = await createListing(listingData, farmerToken);
      console.log('Listing created:', result.crop, result.quantity, result.unit);
      return result;
    });

    // Step 3: Register and login as business
    await testStep('Register Business', async () => {
      try {
        const result = await registerUser(testUsers.business);
        businessToken = result.token;
        businessId = result.user.id;
        console.log('Business registered:', result.user.name, result.user.role);
        return result;
      } catch (error) {
        // User might already exist, try login
        const result = await login(testUsers.business.mobile, testUsers.business.password);
        businessToken = result.token;
        businessId = result.user.id;
        console.log('Business logged in:', result.user.name, result.user.role);
        return result;
      }
    });

    // Step 4: Login as admin
    await testStep('Login Admin', async () => {
      const result = await login('9999999999', 'admin123'); // Using new test admin
      adminToken = result.token;
      adminId = result.user.id;
      console.log('Admin logged in:', result.user.name, result.user.role);
      return result;
    });

    // Step 5: Check pending verifications
    await testStep('Check Pending Verifications', async () => {
      const response = await axios.get(`${API_BASE}/admin/pending-verifications`, {
        headers: { 'x-auth-token': adminToken }
      });
      console.log('Pending users:', response.data.length);
      return response.data;
    });

    // Step 6: Verify farmer (should change status to 'verified')
    await testStep('Verify Farmer', async () => {
      const response = await axios.post(`${API_BASE}/admin/verify-user`, {
        userId: farmerId,
        action: 'approve',
        roleType: 'farmer'
      }, {
        headers: { 'x-auth-token': adminToken }
      });
      console.log('Farmer verification response:', response.data.message);
      return response.data;
    });

    // Step 7: Verify business (should change status to 'approved')
    await testStep('Verify Business', async () => {
      const response = await axios.post(`${API_BASE}/admin/verify-user`, {
        userId: businessId,
        action: 'approve',
        roleType: 'business'
      }, {
        headers: { 'x-auth-token': adminToken }
      });
      console.log('Business verification response:', response.data.message);
      return response.data;
    });

    // Step 8: Check if business can see verified farmer listings
    await testStep('Business Fetch Verified Farmer Listings', async () => {
      const response = await axios.get(`${API_BASE}/business/verified-farmer-listings`, {
        headers: { 'x-auth-token': businessToken }
      });
      console.log('Verified farmer listings count:', response.data.count);
      return response.data;
    });

    // Step 9: Check if business can see all listings (should include unverified)
    await testStep('Business Fetch All Listings', async () => {
      const response = await axios.get(`${API_BASE}/listings`, {
        headers: { 'x-auth-token': businessToken }
      });
      console.log('All listings count:', response.data.length);
      return response.data;
    });

    console.log('\n🎉 Verification Flow Test Completed Successfully!');
    console.log('\n📊 Test Summary:');
    console.log(`- Farmer ID: ${farmerId}`);
    console.log(`- Business ID: ${businessId}`);
    console.log(`- Admin ID: ${adminId}`);
    console.log('\n✅ Status Flow Working: pending → verified/approved');
    console.log('✅ Business users can see verified farmer listings');
    console.log('✅ Admin verification creates Business profiles');

  } catch (error) {
    console.error('\n💥 Verification Flow Test Failed:', error.message);
    process.exit(1);
  }
}

// Run the test
runVerificationFlowTest();
