"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { listingService } from '@/services/listingService';
import { checkBackendHealth } from '@/lib/api';
import { getPublicApiBase } from '@/lib/getPublicApiBase';

export default function FrontendAPITest() {
  const { role, userId, authReady } = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testAPI = async () => {
    if (!authReady || !userId) {
      addResult('❌ Not authenticated');
      return;
    }

    setLoading(true);
    addResult('🔄 Testing API connection...');

    try {
      // Test 1: Get my listings
      const myListings = await listingService.getMyListings();
      addResult(`✅ getMyListings: Found ${myListings.length} listings`);

      // Test 2: Get all listings
      const allListings = await listingService.getAllListings();
      addResult(`✅ getAllListings: Found ${allListings.length} listings`);

      // Test 3: Create a test listing
      if (role === 'farmer') {
        const newListing = await listingService.createListing({
          crop: 'Test Crop',
          variety: 'Test Variety',
          quantity: 50,
          unit: 'kg',
          pricePerUnit: 20,
          qualityGrade: 'A',
          location: {
            state: 'Test State',
            district: 'Test District'
          }
        });
        addResult(`✅ createListing: Created ${newListing.crop} listing`);
      }

      addResult('🎉 All API tests passed!');

    } catch (error: any) {
      const errorMsg = error?.message || 'Unknown error';
      addResult(`❌ API Error: ${errorMsg}`);
      console.error('Frontend API Test Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testDirectBackend = async () => {
    addResult(`🔄 Testing backend at ${getPublicApiBase()}/health ...`);
    const result = await checkBackendHealth();
    if (result.ok) {
      addResult(`✅ ${result.message}`);
    } else {
      addResult(`❌ ${result.message}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Frontend API Test</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-6">
        <h2 className="text-xl font-semibold mb-3">API Configuration</h2>
        <p className="text-sm text-gray-600 mb-4">
          Backend base: <code className="font-mono">{getPublicApiBase()}</code>
        </p>
        <h2 className="text-xl font-semibold mb-3">Authentication Status</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>Auth Ready: {authReady ? '✅' : '❌'}</div>
          <div>Role: {role || 'none'}</div>
          <div>User ID: {userId || 'none'}</div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded mb-6">
        <h2 className="text-xl font-semibold mb-3">API Tests</h2>
        <div className="flex gap-4 mb-4">
          <button
            onClick={testDirectBackend}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Test Backend Connection
          </button>
          <button
            onClick={testAPI}
            disabled={loading || !authReady}
            className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Frontend APIs'}
          </button>
          <button
            onClick={clearResults}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Clear Results
          </button>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded">
        <h2 className="text-xl font-semibold mb-3">Test Results</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {testResults.length === 0 ? (
            <p className="text-gray-500">No tests run yet</p>
          ) : (
            testResults.map((result, index) => (
              <div 
                key={index} 
                className={`p-2 rounded text-sm ${result.includes('✅') ? 'bg-green-100' : result.includes('❌') ? 'bg-red-100' : 'bg-blue-100'}`}
              >
                {result}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
