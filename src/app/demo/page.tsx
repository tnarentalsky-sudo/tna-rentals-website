'use client';

import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FleetCardEnhanced from '@/components/FleetCardEnhanced';
import FAQ from '@/components/FAQ';
import { useVehicles } from '@/lib/hooks/useVehicles';
import { FLEET } from '@/lib/booqable';

export default function DemoPage() {
  // Use the new API hook to fetch vehicles dynamically
  const { vehicles, loading, error } = useVehicles();
  
  // Fallback to static data if API fails
  const displayVehicles = vehicles.length > 0 ? vehicles : FLEET;

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <main className="pt-16 md:pt-20">
        <section className="relative bg-white overflow-hidden">
          <div className="container mx-auto px-4 py-8 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left order-2 lg:order-1">
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
                  Enhanced Backend Demo
                </h1>
                <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-700 mb-4 md:mb-6 px-2 sm:px-0">
                  Dynamic vehicle data with Booqable integration and enhanced features.
                </h2>
                <p className="text-base sm:text-lg text-gray-600 mb-6 md:mb-8 leading-relaxed px-2 sm:px-0">
                  Real-time availability • Dynamic pricing • Enhanced booking flow
                </p>
                
                <div className="flex flex-col gap-3 mb-6 md:mb-8 px-4 sm:px-0">
                  <a 
                    href="#fleet"
                    className="bg-red-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center min-h-[52px] flex items-center justify-center"
                  >
                    Browse Enhanced Fleet →
                  </a>
                </div>

                {/* API Status Indicator */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h3 className="text-sm font-semibold text-blue-800 mb-2">Backend Status</h3>
                  {loading && (
                    <p className="text-sm text-blue-600">Loading vehicle data from API...</p>
                  )}
                  {error && (
                    <p className="text-sm text-blue-600">Using fallback data - {error}</p>
                  )}
                  {!loading && !error && vehicles.length > 0 && (
                    <p className="text-sm text-green-600">✓ Successfully loaded {vehicles.length} vehicles from enhanced API</p>
                  )}
                  {!loading && !error && vehicles.length === 0 && (
                    <p className="text-sm text-blue-600">Using static fleet data as fallback</p>
                  )}
                </div>
              </div>

              {/* Right Content - Hero Image */}
              <div className="relative order-1 lg:order-2 mb-6 lg:mb-0">
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl mx-4 sm:mx-0">
                    <div className="aspect-w-4 aspect-h-3 bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                      <Image 
                        src="/Homepage.jpg" 
                        alt="Enhanced rental experience with dynamic backend"
                        className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
                        width={600}
                        height={400}
                        priority
                      />
                    </div>
                  </div>
                </div>
                
                {/* Background decorative elements */}
                <div className="hidden sm:block absolute top-10 -left-10 w-20 h-20 bg-blue-100 rounded-full opacity-50"></div>
                <div className="hidden sm:block absolute bottom-10 -right-10 w-32 h-32 bg-gray-100 rounded-full opacity-30"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Fleet Section */}
        <section className="pt-16 md:pt-32 pb-16 bg-white" id="fleet">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
                <span className="wave">🚗</span> ENHANCED FLEET
              </h2>
              <h3 className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 px-4 sm:px-0">
                Dynamic vehicle data with enhanced booking features
              </h3>
              
              {/* Feature Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-1">Dynamic API</h4>
                  <p className="text-sm text-green-600">Real-time vehicle data from Booqable</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-1">Availability Check</h4>
                  <p className="text-sm text-blue-600">Live availability and pricing</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-1">Enhanced Booking</h4>
                  <p className="text-sm text-purple-600">Streamlined reservation flow</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
              {displayVehicles.map((car) => (
                <FleetCardEnhanced 
                  key={car.id} 
                  car={car}
                  showAvailabilityCheck={true}
                  showQuickBooking={false}
                />
              ))}
            </div>
          </div>
        </section>

        {/* API Endpoints Documentation */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">New API Endpoints</h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4 sm:px-0">Enhanced backend capabilities for your rental business</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold mb-3 text-green-600">GET /api/vehicles</h3>
                <p className="text-sm text-gray-600 mb-3">Fetch all available vehicles with dynamic pricing and availability status.</p>
                <div className="bg-gray-50 rounded p-2 text-xs font-mono">
                  {`{"success": true, "data": [...vehicles]}`}
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold mb-3 text-blue-600">GET /api/vehicles/[id]</h3>
                <p className="text-sm text-gray-600 mb-3">Get detailed information about a specific vehicle including specifications.</p>
                <div className="bg-gray-50 rounded p-2 text-xs font-mono">
                  {`{"success": true, "data": {vehicle_details}}`}
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold mb-3 text-purple-600">POST /api/vehicles/[id]/availability</h3>
                <p className="text-sm text-gray-600 mb-3">Check real-time availability and pricing for specific dates.</p>
                <div className="bg-gray-50 rounded p-2 text-xs font-mono">
                  {`{"startDate": "2024-01-01", "endDate": "2024-01-07"}`}
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold mb-3 text-red-600">POST /api/bookings</h3>
                <p className="text-sm text-gray-600 mb-3">Create new bookings with customer information and vehicle details.</p>
                <div className="bg-gray-50 rounded p-2 text-xs font-mono">
                  {`{"vehicleId": "...", "customer": {...}, "dates": {...}}`}
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold mb-3 text-orange-600">Environment Setup</h3>
                <p className="text-sm text-gray-600 mb-3">Optional Booqable API credentials for full integration.</p>
                <div className="bg-gray-50 rounded p-2 text-xs font-mono">
                  BOOQABLE_API_KEY<br/>
                  BOOQABLE_SHOP_ID
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold mb-3 text-teal-600">Fallback System</h3>
                <p className="text-sm text-gray-600 mb-3">Graceful degradation to static data when API is unavailable.</p>
                <div className="bg-gray-50 rounded p-2 text-xs font-mono">
                  Static FLEET data<br/>
                  No API required
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}
