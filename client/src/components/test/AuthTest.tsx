"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/apiClient';

export default function AuthTest() {
  const { role, userId, authReady, setAuth, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testLogin = async () => {
    setIsLoading(true);
    addResult('🔄 Testing login...');

    try {
      // Test login with existing user
      const response = await apiClient.post('/auth/login', {
        identifier: '9123456789', // Test farmer mobile
        password: '123456'
      });

      if (response.success && response.user) {
        const user = response.user as any;
        setAuth(
          user.role,
          (response as any).token,
          user.id,
          user.name,
          user.status,
          user.verified
        );
        addResult(`✅ Login successful: ${user.name} (${user.role})`);
      } else {
        addResult(`❌ Login failed: ${(response as any).message}`);
      }
    } catch (error: any) {
      addResult(`❌ Login error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testAuthStatus = async () => {
    if (!authReady || !userId) {
      addResult('❌ Not authenticated');
      return;
    }

    addResult('🔄 Testing auth status...');
    try {
      const response = await apiClient.get('/auth/me');
      if (response.success && response.user) {
        const user = response.user as any;
        addResult(`✅ Auth valid: ${user.name} (${user.role})`);
      } else {
        addResult(`❌ Auth invalid: ${(response as any).message}`);
      }
    } catch (error: any) {
      addResult(`❌ Auth status error: ${error.message}`);
    }
  };

  const testLogout = async () => {
    addResult('🔄 Testing logout...');
    try {
      await apiClient.post('/auth/logout');
      logout();
      addResult('✅ Logout successful');
    } catch (error: any) {
      addResult(`❌ Logout error: ${error.message}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Authentication Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Status */}
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-3">Current Status</h2>
          <div className="space-y-2">
            <div>Auth Ready: {authReady ? '✅' : '❌'}</div>
            <div>Role: {role || 'none'}</div>
            <div>User ID: {userId || 'none'}</div>
          </div>
        </div>

        {/* Test Actions */}
        <div className="bg-blue-50 p-4 rounded">
          <h2 className="text-xl font-semibold mb-3">Test Actions</h2>
          <div className="space-y-3">
            <button
              onClick={testLogin}
              disabled={isLoading}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Test Login (Farmer)'}
            </button>
            
            <button
              onClick={testAuthStatus}
              disabled={!authReady}
              className="w-full bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Test Auth Status
            </button>
            
            <button
              onClick={testLogout}
              disabled={!authReady}
              className="w-full bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Test Logout
            </button>
            
            <button
              onClick={clearResults}
              className="w-full bg-gray-500 text-white px-4 py-2 rounded"
            >
              Clear Results
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-6 bg-yellow-50 p-4 rounded">
        <h2 className="text-xl font-semibold mb-3">Test Results</h2>
        <div className="space-y-2 max-h-64 overflow-y-auto">
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
