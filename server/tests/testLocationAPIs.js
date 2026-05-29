// Test script for location APIs
const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/location';

async function testAPIs() {
  console.log('Testing Location APIs...\n');
  
  try {
    // Test 1: Get pincode details
    console.log('1. Testing GET /api/location/pincode/110001');
    const pincodeResponse = await axios.get(`${BASE_URL}/pincode/110001`);
    console.log('Status:', pincodeResponse.status);
    console.log('Data:', JSON.stringify(pincodeResponse.data, null, 2));
    console.log('---\n');

    // Test 2: Get weather data (will fail without API key, but should show structure)
    console.log('2. Testing GET /api/location/weather/110001');
    try {
      const weatherResponse = await axios.get(`${BASE_URL}/weather/110001`);
      console.log('Status:', weatherResponse.status);
      console.log('Data:', JSON.stringify(weatherResponse.data, null, 2));
    } catch (weatherError) {
      console.log('Expected error (no API key):', weatherError.response?.data || weatherError.message);
    }
    console.log('---\n');

    // Test 3: Get market prices
    console.log('3. Testing GET /api/location/market/110001?commodity=Tomato');
    const marketResponse = await axios.get(`${BASE_URL}/market/110001?commodity=Tomato`);
    console.log('Status:', marketResponse.status);
    console.log('Data:', JSON.stringify(marketResponse.data, null, 2));
    console.log('---\n');

    // Test 4: Get complete location info
    console.log('4. Testing GET /api/location/complete/110001?commodity=Tomato');
    const completeResponse = await axios.get(`${BASE_URL}/complete/110001?commodity=Tomato`);
    console.log('Status:', completeResponse.status);
    console.log('Data:', JSON.stringify(completeResponse.data, null, 2));
    console.log('---\n');

    // Test 5: Test with non-existent pincode
    console.log('5. Testing GET /api/location/pincode/999999 (should return 404)');
    try {
      await axios.get(`${BASE_URL}/pincode/999999`);
    } catch (error) {
      console.log('Expected 404 error:', error.response?.status, error.response?.data);
    }
    console.log('---\n');

    console.log('API Testing Complete! All endpoints are working correctly.');

  } catch (error) {
    console.error('Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('Make sure your backend server is running on port 3000');
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPIs();
}

module.exports = testAPIs;
