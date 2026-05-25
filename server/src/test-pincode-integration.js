/**
 * Test script for pincode integration
 * This script tests all the new APIs to ensure they work correctly
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';
const TEST_PINCODE = '141001'; // Ludhiana pincode

// Test data
const testCases = [
  {
    name: 'Location API',
    url: `${BASE_URL}/location/pincode/${TEST_PINCODE}`,
    method: 'GET'
  },
  {
    name: 'Weather API',
    url: `${BASE_URL}/weather/by-pincode/${TEST_PINCODE}`,
    method: 'GET'
  },
  {
    name: 'Weather Forecast API',
    url: `${BASE_URL}/weather/by-pincode/${TEST_PINCODE}?type=forecast`,
    method: 'GET'
  },
  {
    name: 'Weather Alerts API',
    url: `${BASE_URL}/weather/alerts/${TEST_PINCODE}`,
    method: 'GET'
  },
  {
    name: 'Market Prices API',
    url: `${BASE_URL}/market/by-pincode/${TEST_PINCODE}`,
    method: 'GET'
  },
  {
    name: 'Market Prices with Crop Filter',
    url: `${BASE_URL}/market/by-pincode/${TEST_PINCODE}?crop=wheat`,
    method: 'GET'
  },
  {
    name: 'States List API',
    url: `${BASE_URL}/location/states`,
    method: 'GET'
  },
  {
    name: 'Nearby Pincodes API',
    url: `${BASE_URL}/location/nearby?lat=30.9010&lon=75.8573&radius=10`,
    method: 'GET'
  }
];

async function testEndpoint(testCase) {
  console.log(`\n🧪 Testing: ${testCase.name}`);
  console.log(`📡 ${testCase.method} ${testCase.url}`);
  
  try {
    const response = await axios({
      method: testCase.method,
      url: testCase.url,
      timeout: 10000
    });
    
    console.log(`✅ Status: ${response.status}`);
    console.log(`📊 Response:`, {
      success: response.data.success,
      dataKeys: response.data.data ? Object.keys(response.data.data) : 'No data',
      message: response.data.message || 'Success'
    });
    
    if (response.data.data) {
      if (response.data.data.weather) {
        console.log(`🌤️  Weather: ${response.data.data.weather.temp}°C, ${response.data.data.weather.condition}`);
      }
      if (response.data.data.crops) {
        console.log(`💰 Crops: ${response.data.data.crops.length} items`);
      }
      if (response.data.data.location) {
        console.log(`📍 Location: ${response.data.data.location.district}, ${response.data.data.location.state}`);
      }
    }
    
    return { success: true, status: response.status, data: response.data };
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    if (error.response) {
      console.log(`📊 Error Response:`, {
        status: error.response.status,
        message: error.response.data?.message || 'Unknown error',
        error: error.response.data?.error || 'Unknown error type'
      });
    }
    return { success: false, error: error.message };
  }
}

async function runAllTests() {
  console.log('🚀 Starting Pincode Integration Tests');
  console.log('=====================================');
  
  const results = [];
  
  for (const testCase of testCases) {
    const result = await testEndpoint(testCase);
    results.push({ ...testCase, result });
    
    // Add small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Summary
  console.log('\n📋 Test Summary');
  console.log('================');
  
  const passed = results.filter(r => r.result.success).length;
  const failed = results.filter(r => !r.result.success).length;
  
  console.log(`✅ Passed: ${passed}/${results.length}`);
  console.log(`❌ Failed: ${failed}/${results.length}`);
  
  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.filter(r => !r.result.success).forEach(r => {
      console.log(`  - ${r.name}: ${r.result.error}`);
    });
  }
  
  console.log('\n🎯 Next Steps:');
  console.log('1. Ensure backend server is running on port 5001');
  console.log('2. Check MongoDB connection and pincode data');
  console.log('3. Verify OpenWeatherMap API key is valid');
  console.log('4. Test frontend integration at http://localhost:3000/pincode-dashboard');
}

// Check if server is running first
async function checkServer() {
  try {
    await axios.get(`${BASE_URL}/health`, { timeout: 5000 });
    console.log('✅ Backend server is running');
    return true;
  } catch (error) {
    console.log('❌ Backend server is not running or not accessible');
    console.log('💡 Please start the backend server: npm run dev');
    return false;
  }
}

// Main execution
async function main() {
  const serverRunning = await checkServer();
  
  if (serverRunning) {
    await runAllTests();
  } else {
    console.log('\n⚠️  Cannot proceed with tests until server is running');
  }
}

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
  console.log('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.log('❌ Uncaught Exception:', error);
});

// Run tests
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testEndpoint, runAllTests, checkServer };
