"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useListings } from '@/hooks/useListings';
import { listingService } from '@/services/listingService';

export default function ListingTest() {
  const { role, userId, authReady } = useAuth();
  const { listings, loading, error, refetch } = useListings();
  const [testResult, setTestResult] = useState<string>('');

  const testDirectAPI = async () => {
    setTestResult('Testing direct API call...');
    try {
      const result = await listingService.getMyListings();
      setTestResult(`✅ Success! Found ${result.length} listings`);
    } catch (err: any) {
      setTestResult(`❌ Error: ${err.message}`);
    }
  };

  if (!authReady) {
    return <div>Loading authentication...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Listing API Test</h2>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h3 className="font-semibold mb-2">Auth Status:</h3>
        <p>Role: {role || 'none'}</p>
        <p>User ID: {userId || 'none'}</p>
        <p>Auth Ready: {authReady ? '✅' : '❌'}</p>
      </div>

      <div className="bg-blue-50 p-4 rounded mb-4">
        <h3 className="font-semibold mb-2">Hook Status:</h3>
        <p>Loading: {loading ? '✅' : '❌'}</p>
        <p>Error: {error || 'none'}</p>
        <p>Listings Count: {listings.length}</p>
      </div>

      <div className="bg-green-50 p-4 rounded mb-4">
        <h3 className="font-semibold mb-2">Direct API Test:</h3>
        <button 
          onClick={testDirectAPI}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Test getMyListings()
        </button>
        <button 
          onClick={refetch}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Refetch Hook
        </button>
        {testResult && (
          <p className="mt-2 p-2 bg-white rounded">{testResult}</p>
        )}
      </div>

      {listings.length > 0 && (
        <div className="bg-yellow-50 p-4 rounded">
          <h3 className="font-semibold mb-2">Listings Data:</h3>
          <pre className="text-xs overflow-auto max-h-40">
            {JSON.stringify(listings, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
