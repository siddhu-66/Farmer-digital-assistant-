"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { listingService } from '@/services/listingService';
import { useRouter } from 'next/navigation';
import { getPublicApiBase } from '@/lib/getPublicApiBase';

export default function EndToEndTest() {
  const { role, userId, authReady, setAuth } = useAuth();
  const router = useRouter();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [testData, setTestData] = useState({
    farmerToken: '',
    businessToken: '',
    listingId: '',
    bidId: ''
  });

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const resetTests = () => {
    setTestResults([]);
    setTestData({
      farmerToken: '',
      businessToken: '',
      listingId: '',
      bidId: ''
    });
  };

  const testCompleteFlow = async () => {
    setLoading(true);
    addResult('🚀 Starting Complete End-to-End Test...');

    try {
      // Step 1: Test Farmer Login
      addResult('📝 Step 1: Testing Farmer Login...');
      const farmerLogin = await fetch(`${getPublicApiBase()}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: '9123456789',
          password: '123456'
        })
      });
      
      if (!farmerLogin.ok) {
        throw new Error('Farmer login failed');
      }
      
      const farmerData = await farmerLogin.json();
      setTestData(prev => ({ ...prev, farmerToken: farmerData.token }));
      addResult(`✅ Farmer logged in: ${farmerData.user.name}`);

      // Step 2: Create Listing
      addResult('📦 Step 2: Creating Listing...');
      const listingResponse = await fetch(`${getPublicApiBase()}/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': farmerData.token
        },
        body: JSON.stringify({
          crop: 'Test Wheat',
          variety: 'Premium',
          quantity: 50,
          unit: 'kg',
          pricePerUnit: 25,
          qualityGrade: 'A',
          location: {
            state: 'Punjab',
            district: 'Ludhiana'
          }
        })
      });

      if (!listingResponse.ok) {
        throw new Error('Listing creation failed');
      }

      const listing = await listingResponse.json();
      setTestData(prev => ({ ...prev, listingId: listing._id }));
      addResult(`✅ Listing created: ${listing.crop} - ${listing.quantity}${listing.unit}`);

      // Step 3: Get Farmer's Listings
      addResult('📋 Step 3: Getting Farmer Listings...');
      const myListings = await listingService.getMyListings();
      addResult(`✅ Found ${myListings.length} listings for farmer`);

      // Step 4: Test Business Login
      addResult('👔 Step 4: Testing Business Login...');
      const businessLogin = await fetch(`${getPublicApiBase()}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: '9123456788',
          password: '123456'
        })
      });

      if (!businessLogin.ok) {
        throw new Error('Business login failed');
      }

      const businessData = await businessLogin.json();
      setTestData(prev => ({ ...prev, businessToken: businessData.token }));
      addResult(`✅ Business logged in: ${businessData.user.name}`);

      // Step 5: Get All Listings (Business view)
      addResult('🔍 Step 5: Getting All Listings (Business)...');
      const allListings = await listingService.getAllListings();
      addResult(`✅ Business sees ${allListings.length} total listings`);

      // Step 6: Place Bid (would need business token)
      addResult('💰 Step 6: Testing Bid Placement...');
      // Note: This would require business auth context, so we'll test the endpoint directly
      const bidResponse = await fetch(`${getPublicApiBase()}/bids`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': businessData.token
        },
        body: JSON.stringify({
          listingId: listing._id,
          offeredPrice: 30,
          quantity: 25,
          notes: 'Test bid from end-to-end test'
        })
      });

      if (bidResponse.ok) {
        const bid = await bidResponse.json();
        setTestData(prev => ({ ...prev, bidId: bid._id }));
        addResult(`✅ Bid placed: ₹${bid.offeredPrice} per unit`);
      } else {
        addResult('⚠️ Bid placement failed (might be expected)');
      }

      addResult('🎉 Complete End-to-End Test Finished!');

    } catch (error: any) {
      addResult(`❌ Test Failed: ${error.message}`);
      console.error('End-to-End Test Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testFrontendAuth = async () => {
    addResult('🔐 Testing Frontend Authentication...');
    
    try {
      // Use the apiClient to test login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: '9123456789',
          password: '123456'
        })
      });

      if (response.ok) {
        const data = await response.json();
        addResult(`✅ Frontend auth works: ${data.user?.name || 'Unknown'}`);
      } else {
        addResult('❌ Frontend auth failed');
      }
    } catch (error: any) {
      addResult(`❌ Frontend auth error: ${error.message}`);
    }
  };

  const loginAsFarmer = async () => {
    try {
      const response = await fetch(`${getPublicApiBase()}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: '9123456789',
          password: '123456'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAuth(
          data.user.role,
          data.token,
          data.user.id,
          data.user.name,
          data.user.status,
          data.user.verified
        );
        addResult(`✅ Logged in as farmer: ${data.user.name}`);
        router.push('/dashboard');
      }
    } catch (error: any) {
      addResult(`❌ Login failed: ${error.message}`);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🧪 Complete End-to-End Test</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Test Controls */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          <div className="space-y-3">
            <button
              onClick={testCompleteFlow}
              disabled={loading}
              className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? '🔄 Running Tests...' : '🚀 Run Complete E2E Test'}
            </button>
            
            <button
              onClick={testFrontendAuth}
              disabled={loading}
              className="w-full bg-green-500 text-white px-4 py-3 rounded-lg disabled:opacity-50"
            >
              🔐 Test Frontend Auth
            </button>
            
            <button
              onClick={loginAsFarmer}
              className="w-full bg-purple-500 text-white px-4 py-3 rounded-lg"
            >
              👨‍🌾 Login as Farmer & Go to Dashboard
            </button>
            
            <button
              onClick={resetTests}
              className="w-full bg-gray-500 text-white px-4 py-3 rounded-lg"
            >
              🔄 Reset Results
            </button>
          </div>
        </div>

        {/* Current Status */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Current Status</h2>
          <div className="space-y-2 text-sm">
            <div>Auth Ready: {authReady ? '✅' : '❌'}</div>
            <div>Role: {role || 'none'}</div>
            <div>User ID: {userId || 'none'}</div>
            <div>Farmer Token: {testData.farmerToken ? '✅' : '❌'}</div>
            <div>Business Token: {testData.businessToken ? '✅' : '❌'}</div>
            <div>Listing ID: {testData.listingId || 'none'}</div>
            <div>Bid ID: {testData.bidId || 'none'}</div>
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="bg-yellow-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Test Results</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {testResults.length === 0 ? (
            <p className="text-gray-500">No tests run yet. Click &quot;Run Complete E2E Test&quot; to start.</p>
          ) : (
            testResults.map((result, index) => (
              <div 
                key={index} 
                className={`p-3 rounded text-sm ${result.includes('✅') ? 'bg-green-100' : result.includes('❌') ? 'bg-red-100' : result.includes('⚠️') ? 'bg-yellow-100' : 'bg-blue-100'}`}
              >
                {result}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-6 bg-purple-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <a href="/signin" className="text-blue-600 hover:underline">🔐 Sign In</a>
          <a href="/test-api" className="text-green-600 hover:underline">🔌 API Test</a>
          <a href="/test-auth" className="text-purple-600 hover:underline">👤 Auth Test</a>
          <a href="/dashboard" className="text-orange-600 hover:underline">📊 Dashboard</a>
        </div>
      </div>
    </div>
  );
}
