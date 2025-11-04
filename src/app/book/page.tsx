'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HQWidget from '@/components/widgets/HQWidget';
import { getReservationPageUrl } from '@/lib/utils';

function BookingContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const vehicle = searchParams.get('vehicle');

  return (
    <>
      {/* Hero Section */}
      <section className="bg-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Complete Your Reservation
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              {vehicle && category ? (
                <>Find available <strong>{vehicle}</strong> vehicles and complete your booking in just a few steps.</>
              ) : (
                <>Select your vehicle, choose your dates, and complete your booking in just a few steps.</>
              )}
            </p>
          </div>
          
          {/* Pre-selection Info */}
          {(vehicle || category) && (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-800 font-medium">
                    {vehicle ? `Searching for: ${vehicle}` : `Category: ${category}`}
                  </span>
                </div>
                <p className="text-blue-700 text-center text-sm mt-1">
                  Your selection will be pre-filled in the booking form below
                </p>
              </div>
            </div>
          )}
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-sm text-gray-600">Secure Booking</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-sm text-gray-600">Instant Confirmation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Engine Section */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">

            {/* Booking Widget Container */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <HQWidget 
                  snippet="reservations" 
                  reservationPageUrl={getReservationPageUrl()}
                  className="w-full"
                  priority={true}
                />
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Need Help with Your Booking?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    📞
                  </div>
                  <h4 className="font-medium mb-1">Call Us</h4>
                  <p className="text-sm text-gray-600">Speak with our rental experts</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    ✉️
                  </div>
                  <h4 className="font-medium mb-1">Email Support</h4>
                  <p className="text-sm text-gray-600">Send us your questions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Why Book with TNA Rentals?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  🚗
                </div>
                <h4 className="font-semibold mb-2">Quality Fleet</h4>
                <p className="text-sm text-gray-600">Well-maintained, reliable vehicles for every need</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  💰
                </div>
                <h4 className="font-semibold mb-2">Best Rates</h4>
                <p className="text-sm text-gray-600">Competitive pricing with no hidden fees</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  ⭐
                </div>
                <h4 className="font-semibold mb-2">5-Star Service</h4>
                <p className="text-sm text-gray-600">Exceptional customer service every time</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16 md:pt-20">
        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading booking system...</p>
            </div>
          </div>
        }>
          <BookingContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
