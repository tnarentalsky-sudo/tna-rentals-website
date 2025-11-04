import { NextRequest, NextResponse } from 'next/server';
import { env, hqConfig, validateHQConfig } from '@/lib/env';

/**
 * HQ Rentals HTML Snippet Generator API
 * 
 * Returns ready-to-paste HTML iframe snippets for HQ Rentals widgets
 * This is a server-only, read-only endpoint with no authentication required
 * 
 * TODO: Add admin authentication when implementing user management
 */

interface SnippetResponse {
  meta: {
    tenant: string;
    reservationPageUrl: string;
    lastGenerated: string;
  };
  snippets: {
    reservationEngine: string;
    homepageForm: string;
    findYourBooking: string;
    bookingEngine: string;
    myReservations: string;
    quotes: string;
    packageQuotes: string;
    paymentRequests: string;
    calendar: string;
    calendarPerClass: string;
  };
}

/**
 * Generates HTML snippet for the Reservation Engine (Booking Engine)
 * This is the main booking interface that handles the full rental process
 */
function generateReservationEngineSnippet(): string {
  return `<!-- HQ Rentals Booking Engine -->
<!-- PASTE THIS: On your main reservation/booking page -->
<!-- NO CONFIGURATION NEEDED: Uses your actual HQ Rentals settings -->
<script src="${env.HQ_SCRIPT_URL}"></script>
<div class="hq-rental-software-integration"
     data-integrator_link="${env.HQ_INTEGRATOR_URL}"
     data-brand="${env.HQ_BRAND_ID}"
     data-snippet="reservations"
     data-skip_language=""
     data-rate_type_uuid=""
     data-referral=""
     data-enable_auto_language_update="">
</div>`;
}

/**
 * Generates HTML snippet for the Homepage Form
 * This is a compact form that redirects to the full reservation engine
 */
function generateHomepageFormSnippet(): string {
  return `<!-- HQ Rentals Homepage Form -->
<!-- PASTE THIS: On your homepage or any page where you want a quick booking form -->
<!-- NO CONFIGURATION NEEDED: Uses your actual HQ Rentals settings -->
<script src="${env.HQ_SCRIPT_URL}"></script>
<div class="hq-rental-software-integration"
     data-integrator_link="${env.HQ_INTEGRATOR_URL}"
     data-brand="${env.HQ_BRAND_ID}"
     data-snippet="reservation-form"
     data-skip_language=""
     data-skip_redirect="1"
     data-reservation_page=""
     data-layout="vertical"
     data-currency=""
     data-rate_type_uuid=""
     data-referral=""
     data-enable_auto_language_update="">
</div>`;
}

/**
 * Generates HTML snippet for Find Your Booking
 * This allows customers to look up existing reservations
 */
function generateFindBookingSnippet(): string {
  return `<!-- HQ Rentals Find Your Booking -->
<!-- PASTE THIS: On a customer service page or footer for booking lookup -->
<!-- NO CONFIGURATION NEEDED: This widget works as-is -->
<script src="${env.HQ_SCRIPT_URL}"></script>
<div class="hq-rental-software-integration"
     data-integrator_link="${env.HQ_INTEGRATOR_URL}"
     data-brand="${env.HQ_BRAND_ID}"
     data-snippet="find-booking"
     data-skip_language=""
     data-referral=""
     data-enable_auto_language_update="">
</div>`;
}

/**
 * Generates HTML snippet for the Booking Engine
 * Enhanced booking interface with advanced features
 */
function generateBookingEngineSnippet(): string {
  return `<!-- HQ Rentals Booking Engine -->
<!-- PASTE THIS: On your main booking page for advanced booking features -->
<!-- NO CONFIGURATION NEEDED: Uses your actual HQ Rentals settings -->
<script src="${env.HQ_SCRIPT_URL}"></script>
<div class="hq-rental-software-integration"
     data-integrator_link="${env.HQ_INTEGRATOR_URL}"
     data-brand="${env.HQ_BRAND_ID}"
     data-snippet="reservations"
     data-skip_language=""
     data-rate_type_uuid=""
     data-referral=""
     data-enable_auto_language_update="">
</div>`;
}

/**
 * Generates HTML snippet for My Reservations
 * Customer portal for managing existing reservations
 */
function generateMyReservationsSnippet(): string {
  return `<!-- HQ Rentals My Reservations -->
<!-- PASTE THIS: On a customer account page or reservation management section -->
<!-- NO CONFIGURATION NEEDED: This widget works as-is -->
<script src="${env.HQ_SCRIPT_URL}"></script>
<div class="hq-rental-software-integration"
     data-integrator_link="${env.HQ_INTEGRATOR_URL}"
     data-brand="${env.HQ_BRAND_ID}"
     data-snippet="my-reservations"
     data-skip_language=""
     data-referral=""
     data-enable_auto_language_update="">
</div>`;
}

/**
 * Generates HTML snippet for Quotes
 * Quote request and management interface
 */
function generateQuotesSnippet(): string {
  return `<!-- HQ Rentals Quotes -->
<!-- PASTE THIS: On a quotes page or where customers can request pricing -->
<!-- NO CONFIGURATION NEEDED: This widget works as-is -->
<script src="${env.HQ_SCRIPT_URL}"></script>
<div class="hq-rental-software-integration"
     data-integrator_link="${env.HQ_INTEGRATOR_URL}"
     data-brand="${env.HQ_BRAND_ID}"
     data-snippet="quotes"
     data-skip_language=""
     data-referral=""
     data-enable_auto_language_update="">
</div>`;
}

/**
 * Generates HTML snippet for Package Quotes
 * Specialized quotes for package deals and bulk rentals
 */
function generatePackageQuotesSnippet(): string {
  return `<!-- HQ Rentals Package Quotes -->
<!-- PASTE THIS: On a packages page or bulk rental section -->
<!-- NO CONFIGURATION NEEDED: This widget works as-is -->
<script src="${env.HQ_SCRIPT_URL}"></script>
<div class="hq-rental-software-integration"
     data-integrator_link="${env.HQ_INTEGRATOR_URL}"
     data-brand="${env.HQ_BRAND_ID}"
     data-snippet="package-quotes"
     data-skip_language=""
     data-referral=""
     data-enable_auto_language_update="">
</div>`;
}

/**
 * Generates HTML snippet for Payment Requests
 * Payment processing and invoice management
 */
function generatePaymentRequestsSnippet(): string {
  return `<!-- HQ Rentals Payment Requests -->
<!-- PASTE THIS: On a billing page or payment section -->
<!-- NO CONFIGURATION NEEDED: This widget works as-is -->
<script src="${env.HQ_SCRIPT_URL}"></script>
<div class="hq-rental-software-integration"
     data-integrator_link="${env.HQ_INTEGRATOR_URL}"
     data-brand="${env.HQ_BRAND_ID}"
     data-snippet="payment-requests"
     data-skip_language=""
     data-referral=""
     data-enable_auto_language_update="">
</div>`;
}

/**
 * Generates HTML snippet for Calendar
 * Availability calendar and scheduling interface
 */
function generateCalendarSnippet(): string {
  return `<!-- HQ Rentals Calendar -->
<!-- PASTE THIS: On availability page or where customers check scheduling -->
<!-- NO CONFIGURATION NEEDED: This widget works as-is -->
<script src="${env.HQ_SCRIPT_URL}"></script>
<div class="hq-rental-software-integration"
     data-integrator_link="${env.HQ_INTEGRATOR_URL}"
     data-brand="${env.HQ_BRAND_ID}"
     data-snippet="calendar"
     data-skip_language=""
     data-referral=""
     data-enable_auto_language_update="">
</div>`;
}

/**
 * Generates HTML snippet for Calendar per Class
 * Class-specific scheduling and availability
 */
function generateCalendarPerClassSnippet(): string {
  return `<!-- HQ Rentals Calendar per Class -->
<!-- PASTE THIS: On class-specific pages or vehicle category sections -->
<!-- OPTIONAL: Add data-class attribute with your class ID for specific vehicle categories -->
<script src="${env.HQ_SCRIPT_URL}"></script>
<div class="hq-rental-software-integration"
     data-integrator_link="${env.HQ_INTEGRATOR_URL}"
     data-class=""
     data-snippet="class-calendar"
     data-skip_language=""
     data-referral=""
     data-enable_auto_language_update="">
</div>`;
}

/**
 * GET /api/hq/snippets
 * 
 * Returns all available HQ Rentals widget snippets with configuration
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Validate HQ configuration
    const configValidation = validateHQConfig();
    if (!configValidation.isValid) {
      return NextResponse.json({
        error: 'HQ Rentals configuration incomplete',
        message: 'Please set the required environment variables',
        missingConfig: configValidation.errors,
        timestamp: new Date().toISOString()
      }, { 
        status: 400 
      });
    }

    const response: SnippetResponse = {
      meta: {
        tenant: hqConfig.getTenantName(),
        reservationPageUrl: env.PUBLIC_RESERVATION_PAGE_URL,
        lastGenerated: new Date().toISOString(),
      },
      snippets: {
        reservationEngine: generateReservationEngineSnippet(),
        homepageForm: generateHomepageFormSnippet(),
        findYourBooking: generateFindBookingSnippet(),
        bookingEngine: generateBookingEngineSnippet(),
        myReservations: generateMyReservationsSnippet(),
        quotes: generateQuotesSnippet(),
        packageQuotes: generatePackageQuotesSnippet(),
        paymentRequests: generatePaymentRequestsSnippet(),
        calendar: generateCalendarSnippet(),
        calendarPerClass: generateCalendarPerClassSnippet(),
      }
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour since this rarely changes
      }
    });

  } catch (error) {
    console.error('HQ Snippets API Error:', error);
    
    return NextResponse.json({
      error: 'Failed to generate snippets',
      message: 'Please check your HQ Rentals environment configuration',
      timestamp: new Date().toISOString()
    }, { 
      status: 500 
    });
  }
}

/**
 * Handle preflight CORS requests
 */
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
