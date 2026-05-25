/**
 * Backend API Test Script
 * Tests all routes and functionality end-to-end
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000';
const API_BASE = `${BASE_URL}/api`;

// Test configuration
const testUser = {
  name: 'Test Farmer',
  mobile: '9123456789',
  email: 'farmer2@test.com',
  password: '123456',
  role: 'farmer'
};

const testBusiness = {
  name: 'Test Business',
  mobile: '9123456788',
  email: 'business2@test.com', 
  password: '123456',
  role: 'business'
};

let farmerToken = null;
let businessToken = null;
let farmerId = null;
let businessId = null;
let listingId = null;

// Axios instance with cookies
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

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
  const response = await api.post('/auth/register', userData);
  return response.data;
}

async function login(identifier, password) {
  const response = await api.post('/auth/login', { identifier, password });
  return response.data;
}

async function getCurrentUser(token) {
  const response = await api.get('/auth/me', {
    headers: { 'x-auth-token': token }
  });
  return response.data;
}

async function createListing(listingData, token) {
  const response = await api.post('/listings', listingData, {
    headers: { 'x-auth-token': token }
  });
  return response.data;
}

async function getMyListings(token) {
  const response = await api.get('/listings/my', {
    headers: { 'x-auth-token': token }
  });
  return response.data;
}

async function getAllListings(token) {
  const response = await api.get('/listings', {
    headers: { 'x-auth-token': token }
  });
  return response.data;
}

async function runTests() {
  console.log('🚀 Starting Backend API Tests...\n');

  try {
    // Test 1: Health Check
    await testStep('Health Check', async () => {
      const response = await axios.get(`${BASE_URL}/api/health`);
      console.log('Health:', response.data);
      return response.data;
    });

    // Test 2: Register/Login Users
    try {
      await testStep('Register Farmer', async () => {
        const result = await registerUser(testUser);
        farmerToken = result.token;
        farmerId = result.user.id;
        console.log('Farmer registered:', result.user.name, result.user.role);
        return result;
      });
    } catch (error) {
      // User already exists, just login
      await testStep('Login Existing Farmer', async () => {
        const result = await login(testUser.mobile, testUser.password);
        farmerToken = result.token;
        farmerId = result.user.id;
        console.log('Farmer logged in:', result.user.name, result.user.role);
        return result;
      });
    }

    try {
      await testStep('Register Business', async () => {
        const result = await registerUser(testBusiness);
        businessToken = result.token;
        businessId = result.user.id;
        console.log('Business registered:', result.user.name, result.user.role);
        return result;
      });
    } catch (error) {
      // User already exists, just login
      await testStep('Login Existing Business', async () => {
        const result = await login(testBusiness.mobile, testBusiness.password);
        businessToken = result.token;
        businessId = result.user.id;
        console.log('Business logged in:', result.user.name, result.user.role);
        return result;
      });
    }

    // Test 4: Get Current User
    await testStep('Get Current Farmer User', async () => {
      const result = await getCurrentUser(farmerToken);
      console.log('Current farmer:', result.user.name, result.user.role);
      return result;
    });

    // Test 5: Create Listing
    const testListing = {
      crop: 'Wheat',
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

    await testStep('Create Listing', async () => {
      const result = await createListing(testListing, farmerToken);
      listingId = result._id;
      console.log('Listing created:', result.crop, result.quantity, result.unit);
      return result;
    });

    // Test 6: Get My Listings
    await testStep('Get My Listings (Farmer)', async () => {
      const result = await getMyListings(farmerToken);
      console.log('My listings count:', result.length);
      console.log('First listing:', result[0]?.crop, result[0]?.quantity);
      return result;
    });

    // Test 7: Get All Listings (Business)
    await testStep('Get All Listings (Business)', async () => {
      const result = await getAllListings(businessToken);
      console.log('All listings count:', result.length);
      console.log('First listing:', result[0]?.crop, result[0]?.quantity);
      return result;
    });

    console.log('\n🎉 All Backend Tests Passed!');
    console.log('\n📊 Test Summary:');
    console.log(`- Farmer ID: ${farmerId}`);
    console.log(`- Business ID: ${businessId}`);
    console.log(`- Listing ID: ${listingId}`);
    console.log(`- Farmer Token: ${farmerToken?.substring(0, 20)}...`);
    console.log(`- Business Token: ${businessToken?.substring(0, 20)}...`);

  } catch (error) {
    console.error('\n💥 Test Suite Failed:', error.message);
    process.exit(1);
  }
}

// Run tests
runTests();
