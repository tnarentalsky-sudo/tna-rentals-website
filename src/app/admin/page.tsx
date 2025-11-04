'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';

interface ApiTest {
  name: string;
  endpoint: string;
  method: 'GET' | 'POST';
  payload?: any;
  description: string;
}

interface TestResult {
  success: boolean;
  status: number;
  data: any;
  error?: string;
  duration: number;
}

const API_TESTS: ApiTest[] = [
  {
    name: 'Fetch Vehicles',
    endpoint: '/api/vehicles',
    method: 'GET',
    description: 'Get all available vehicles from the API'
  },
  {
    name: 'Vehicle Details',
    endpoint: '/api/vehicles/2013-chevy-equinox',
    method: 'GET',
    description: 'Get detailed information for a specific vehicle'
  },
  {
    name: 'Check Availability',
    endpoint: '/api/vehicles/2013-chevy-equinox/availability',
    method: 'POST',
    payload: {
      startDate: '2024-12-01',
      endDate: '2024-12-07',
      quantity: 1
    },
    description: 'Check availability and pricing for specific dates'
  },
  {
    name: 'Create Booking',
    endpoint: '/api/bookings',
    method: 'POST',
    payload: {
      vehicleId: '2013-chevy-equinox',
      startDate: '2024-12-01',
      endDate: '2024-12-07',
      quantity: 1,
      customer: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '555-123-4567'
      },
      notes: 'Test booking from admin interface'
    },
    description: 'Create a test booking with sample customer data'
  }
];

export default function AdminPage() {
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [envStatus, setEnvStatus] = useState<any>(null);

  useEffect(() => {
    checkEnvironmentStatus();
  }, []);

  const checkEnvironmentStatus = async () => {
    // This is a simple check - in a real app you'd have a dedicated endpoint
    setEnvStatus({
      booqableApiConfigured: process.env.NEXT_PUBLIC_BOOQABLE_SHOP_URL ? true : false,
      shopUrl: process.env.NEXT_PUBLIC_BOOQABLE_SHOP_URL || 'Not configured'
    });
  };

  const runTest = async (test: ApiTest) => {
    const testKey = test.name;
    setLoading(prev => ({ ...prev, [testKey]: true }));
    
    const startTime = performance.now();
    
    try {
      const options: RequestInit = {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (test.payload) {
        options.body = JSON.stringify(test.payload);
      }

      const response = await fetch(test.endpoint, options);
      const data = await response.json();
      const endTime = performance.now();

      setTestResults(prev => ({
        ...prev,
        [testKey]: {
          success: response.ok,
          status: response.status,
          data,
          duration: Math.round(endTime - startTime)
        }
      }));
    } catch (error) {
      const endTime = performance.now();
      setTestResults(prev => ({
        ...prev,
        [testKey]: {
          success: false,
          status: 0,
          data: null,
          error: error instanceof Error ? error.message : 'Unknown error',
          duration: Math.round(endTime - startTime)
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [testKey]: false }));
    }
  };

  const runAllTests = async () => {
    for (const test of API_TESTS) {
      await runTest(test);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Backend API Testing Dashboard
              </h1>
              <p className="text-lg text-gray-600">
                Test your enhanced Booqable integration and API endpoints
              </p>
            </div>

            {/* Environment Status */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Environment Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Booqable Configuration</h3>
                  <p className="text-sm text-gray-600">
                    Status: <span className={envStatus?.booqableApiConfigured ? 'text-green-600' : 'text-yellow-600'}>
                      {envStatus?.booqableApiConfigured ? 'Configured' : 'Using Fallback Data'}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Shop URL: <span className="font-mono text-xs">{envStatus?.shopUrl}</span>
                  </p>
                </div>
                <div className="bg-gray-50 rounded p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">API Endpoints</h3>
                  <p className="text-sm text-gray-600">
                    Total Endpoints: <span className="font-semibold">{API_TESTS.length}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Tested: <span className="font-semibold">{Object.keys(testResults).length}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Test Controls */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">API Tests</h2>
                <button
                  onClick={runAllTests}
                  disabled={Object.values(loading).some(Boolean)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Run All Tests
                </button>
              </div>

              <div className="space-y-4">
                {API_TESTS.map((test) => {
                  const result = testResults[test.name];
                  const isLoading = loading[test.name];

                  return (
                    <div key={test.name} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-800">{test.name}</h3>
                          <p className="text-sm text-gray-600">{test.description}</p>
                          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                            <span className={`px-2 py-1 rounded font-mono ${
                              test.method === 'GET' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {test.method}
                            </span>
                            <span className="font-mono">{test.endpoint}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => runTest(test)}
                          disabled={isLoading}
                          className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 disabled:opacity-50"
                        >
                          {isLoading ? 'Testing...' : 'Test'}
                        </button>
                      </div>

                      {result && (
                        <div className="mt-3 p-3 bg-gray-50 rounded">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`inline-block w-3 h-3 rounded-full ${
                              result.success ? 'bg-green-500' : 'bg-red-500'
                            }`}></span>
                            <span className="text-sm font-semibold">
                              Status: {result.status} ({result.duration}ms)
                            </span>
                          </div>
                          
                          {result.error && (
                            <div className="text-sm text-red-600 mb-2">
                              Error: {result.error}
                            </div>
                          )}
                          
                          <details className="text-sm">
                            <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                              View Response Data
                            </summary>
                            <pre className="mt-2 p-2 bg-white rounded border text-xs overflow-x-auto">
                              {JSON.stringify(result.data, null, 2)}
                            </pre>
                          </details>
                        </div>
                      )}

                      {test.payload && (
                        <details className="mt-2 text-sm">
                          <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                            View Request Payload
                          </summary>
                          <pre className="mt-2 p-2 bg-gray-50 rounded border text-xs overflow-x-auto">
                            {JSON.stringify(test.payload, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Integration Instructions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">Integration Instructions</h2>
              <div className="prose max-w-none text-sm text-gray-600">
                <p className="mb-4">
                  Your enhanced backend is ready to use! Here&apos;s how to integrate it:
                </p>
                
                <ol className="list-decimal list-inside space-y-2 mb-4">
                  <li>Your current frontend will continue to work as-is using static data</li>
                  <li>To enable dynamic data, set up your Booqable API credentials in <code>.env.local</code></li>
                  <li>Use the new <code>useVehicles</code> hook to fetch dynamic vehicle data</li>
                  <li>Replace <code>FleetCard</code> with <code>FleetCardEnhanced</code> for additional features</li>
                  <li>API endpoints are ready for custom booking flows and third-party integrations</li>
                </ol>

                <div className="bg-blue-50 border border-blue-200 rounded p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Environment Variables (Optional)</h3>
                  <pre className="text-xs bg-white p-2 rounded border">
{`BOOQABLE_API_KEY=your_api_key_here
BOOQABLE_SHOP_ID=your_shop_id_here
BOOQABLE_API_URL=https://api.booqable.com/v1
NEXT_PUBLIC_BOOQABLE_SHOP_URL=https://t-a-rentals-llc.booqableshop.com`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
