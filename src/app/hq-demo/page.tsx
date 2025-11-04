'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  HQHomepageForm, 
  HQBookingEngine, 
  HQMyReservations, 
  HQQuotes, 
  HQPackageQuotes, 
  HQPaymentRequests, 
  HQCalendar,
  HQClassCalendar
} from '@/components/HQWidget';

export default function HQDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="bg-white py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                HQ Rentals Integration Demo
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Live demonstration of all HQ Rentals widgets integrated into your website. 
                These components are ready to use anywhere on your site.
              </p>
            </div>
            
            {/* Integration Status */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <h2 className="text-lg font-semibold text-green-800">
                  ✅ Integration Active - Using Your Real HQ Rentals Account
                </h2>
              </div>
              <p className="text-green-700 text-center mt-2">
                Brand ID: 4yfuocht-z6gc-ibnk-spdz-jaod9lfwqifk | Tenant: tna-rentals-llc.hqrentals.app
              </p>
            </div>
          </div>
        </section>

        {/* Homepage Form Demo */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Homepage Form
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Quick search form perfect for your homepage or landing pages. 
                Automatically redirects to your booking engine for full reservations.
              </p>
            </div>
            
            <div className="max-w-md mx-auto bg-gray-50 rounded-lg p-6">
              <HQHomepageForm layout="vertical" />
            </div>
            
            <div className="text-center mt-6">
              <details className="inline-block text-left">
                <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                  View Integration Code
                </summary>
                <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-x-auto">
{`import { HQHomepageForm } from '@/components/HQWidget';

<HQHomepageForm layout="vertical" />`}
                </pre>
              </details>
            </div>
          </div>
        </section>

        {/* Booking Engine Demo */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Booking Engine
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Full-featured booking interface for your main reservation page. 
                Handles the complete rental process from search to payment.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6">
              <HQBookingEngine />
            </div>
            
            <div className="text-center mt-6">
              <details className="inline-block text-left">
                <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                  View Integration Code
                </summary>
                <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-x-auto">
{`import { HQBookingEngine } from '@/components/HQWidget';

<HQBookingEngine />`}
                </pre>
              </details>
            </div>
          </div>
        </section>

        {/* Customer Widgets Grid */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Customer Service Widgets
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Essential widgets for customer account management, quotes, and payments.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* My Reservations */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">My Reservations</h3>
                <p className="text-gray-600 mb-4">Customer portal for managing existing bookings</p>
                <HQMyReservations />
                <details className="mt-4">
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-800 text-sm">
                    Integration Code
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
{`<HQMyReservations />`}
                  </pre>
                </details>
              </div>

              {/* Quotes */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Quote Requests</h3>
                <p className="text-gray-600 mb-4">Allow customers to request pricing quotes</p>
                <HQQuotes />
                <details className="mt-4">
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-800 text-sm">
                    Integration Code
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
{`<HQQuotes />`}
                  </pre>
                </details>
              </div>

              {/* Package Quotes */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Package Quotes</h3>
                <p className="text-gray-600 mb-4">Specialized quotes for bulk and package deals</p>
                <HQPackageQuotes />
                <details className="mt-4">
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-800 text-sm">
                    Integration Code
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
{`<HQPackageQuotes />`}
                  </pre>
                </details>
              </div>

              {/* Payment Requests */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment Center</h3>
                <p className="text-gray-600 mb-4">Process payments and manage invoices</p>
                <HQPaymentRequests />
                <details className="mt-4">
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-800 text-sm">
                    Integration Code
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
{`<HQPaymentRequests />`}
                  </pre>
                </details>
              </div>
            </div>
          </div>
        </section>

        {/* Calendar Widgets */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Calendar & Availability
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Show availability and scheduling information to your customers.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* General Calendar */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">General Calendar</h3>
                <p className="text-gray-600 mb-4">Overall availability calendar for all vehicles</p>
                <HQCalendar />
                <details className="mt-4">
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-800 text-sm">
                    Integration Code
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
{`<HQCalendar />`}
                  </pre>
                </details>
              </div>

              {/* Class-Specific Calendar */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Class Calendar</h3>
                <p className="text-gray-600 mb-4">Category-specific availability (SUVs, sedans, etc.)</p>
                <HQClassCalendar dataClass="suv" />
                <details className="mt-4">
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-800 text-sm">
                    Integration Code
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
{`<HQClassCalendar dataClass="suv" />`}
                  </pre>
                </details>
              </div>
            </div>
          </div>
        </section>

        {/* Implementation Guide */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                How to Implement
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Adding HQ Rentals widgets to your existing pages is simple and requires no configuration.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Option 1: React Components */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">
                    Option 1: React Components (Recommended)
                  </h3>
                  <p className="text-blue-800 mb-4">
                    Import and use pre-built React components anywhere in your app:
                  </p>
                  <pre className="bg-white p-4 rounded text-sm overflow-x-auto">
{`// Import the components you need
import { 
  HQHomepageForm, 
  HQBookingEngine,
  HQQuotes 
} from '@/components/HQWidget';

// Use anywhere in your JSX
<HQHomepageForm layout="vertical" />
<HQBookingEngine />
<HQQuotes />`}
                  </pre>
                </div>

                {/* Option 2: Raw HTML */}
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-4">
                    Option 2: Copy-Paste HTML
                  </h3>
                  <p className="text-green-800 mb-4">
                    Get ready-to-paste HTML snippets from the API:
                  </p>
                  <pre className="bg-white p-4 rounded text-sm overflow-x-auto">
{`// Get all widget HTML snippets
GET /api/hq/snippets

// Returns HTML for all 8 widget types
// Just copy and paste into any page!`}
                  </pre>
                  <div className="mt-4">
                    <a 
                      href="/api/hq/snippets" 
                      target="_blank"
                      className="text-green-700 hover:text-green-900 underline"
                    >
                      → View Live API Response
                    </a>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  Why This Integration Works Better
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                      ⚡
                    </div>
                    <h4 className="font-semibold mb-2">Lightning Fast</h4>
                    <p className="text-sm text-gray-600">Script-based widgets load faster than iframes</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                      🎨
                    </div>
                    <h4 className="font-semibold mb-2">Better Styling</h4>
                    <p className="text-sm text-gray-600">Inherits your site&apos;s CSS and theme automatically</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                      📱
                    </div>
                    <h4 className="font-semibold mb-2">Mobile Optimized</h4>
                    <p className="text-sm text-gray-600">Responsive design works perfectly on all devices</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
