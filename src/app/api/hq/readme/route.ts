import { NextRequest, NextResponse } from 'next/server';
import { env, hqConfig, validateHQConfig } from '@/lib/env';

/**
 * HQ Rentals Integration Documentation API
 * 
 * Provides a simple JSON guide for non-technical staff to understand
 * how to implement HQ Rentals widgets on their website
 */

interface ReadmeResponse {
  title: string;
  lastUpdated: string;
  configuration: {
    tenant: string;
    reservationPageUrl: string;
    webhooksEnabled: boolean;
    pollingEnabled: boolean;
    isConfigured: boolean;
    configurationErrors: string[];
  };
  quickStart: {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
  };
  widgets: {
    reservationEngine: WidgetGuide;
    homepageForm: WidgetGuide;
    findYourBooking: WidgetGuide;
    bookingEngine: WidgetGuide;
    myReservations: WidgetGuide;
    quotes: WidgetGuide;
    packageQuotes: WidgetGuide;
    paymentRequests: WidgetGuide;
    calendar: WidgetGuide;
    calendarPerClass: WidgetGuide;
  };
  technicalNotes: {
    sessionContinuity: string;
    security: string;
    support: string;
  };
  links: {
    snippets: string;
    hqDashboard: string;
    webhookStatus: string;
  };
}

interface WidgetGuide {
  name: string;
  description: string;
  whereToPlace: string;
  requirements: string[];
  configuration: string;
  troubleshooting: string[];
}

/**
 * GET /api/hq/readme
 * 
 * Returns comprehensive integration documentation in JSON format
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const baseUrl = new URL(request.url).origin;
    
    // Check HQ configuration status
    const configValidation = validateHQConfig();
    const isConfigured = configValidation.isValid;
    
    const response: ReadmeResponse = {
      title: 'HQ Rentals Widget Integration Guide',
      lastUpdated: new Date().toISOString(),
      
      configuration: {
        tenant: hqConfig.getTenantName(),
        reservationPageUrl: env.PUBLIC_RESERVATION_PAGE_URL,
        webhooksEnabled: hqConfig.isWebhooksEnabled(),
        pollingEnabled: hqConfig.isPollingEnabled(),
        isConfigured: isConfigured,
        configurationErrors: isConfigured ? [] : configValidation.errors,
      },
      
      quickStart: {
        step1: `Log into your HQ Rentals dashboard at ${env.HQ_TENANT_BASE_URL}`,
        step2: 'Navigate to Settings → Fleet → Branches → Website Integration',
        step3: `Get your HTML snippets from ${baseUrl}/api/hq/snippets`,
        step4: 'Paste the snippets into your website pages as indicated in the comments'
      },
      
      widgets: {
        reservationEngine: {
          name: 'Reservation Engine',
          description: 'Full-featured booking system where customers complete their rental reservations',
          whereToPlace: `Must be placed on your reservation page: ${env.PUBLIC_RESERVATION_PAGE_URL}`,
          requirements: [
            'Dedicated page for reservations',
            'HTTPS enabled on your website',
            'Replace {BRANCH_ID} placeholder with your actual branch ID from HQ dashboard'
          ],
          configuration: 'Update the {BRANCH_ID} placeholder in the iframe src URL with your branch ID from HQ Rentals dashboard',
          troubleshooting: [
            'If iframe doesn\'t load: Check your branch ID is correct',
            'If bookings don\'t work: Verify your reservation page URL matches PUBLIC_RESERVATION_PAGE_URL',
            'If styling looks wrong: Iframe inherits no CSS from your site - this is normal'
          ]
        },
        
        homepageForm: {
          name: 'Homepage Form',
          description: 'Compact search form that redirects to your full reservation engine',
          whereToPlace: 'Homepage, landing pages, or anywhere you want a quick booking form',
          requirements: [
            'data-reservation_page attribute must point to your reservation page',
            'Reservation Engine must be properly set up first',
            'Allow popups for redirect functionality'
          ],
          configuration: `The data-reservation_page="${env.PUBLIC_RESERVATION_PAGE_URL}" attribute is automatically configured`,
          troubleshooting: [
            'If form doesn\'t redirect: Check data-reservation_page URL is correct',
            'If search doesn\'t work: Ensure Reservation Engine is working first',
            'If popup blocked: Ask users to allow popups or use direct links'
          ]
        },
        
        findYourBooking: {
          name: 'Find Your Booking',
          description: 'Customer service widget for looking up existing reservations',
          whereToPlace: 'Customer service pages, contact pages, or footer areas',
          requirements: [
            'No configuration needed',
            'Works independently of other widgets'
          ],
          configuration: 'No configuration required - works out of the box',
          troubleshooting: [
            'If lookup fails: Check customer is entering correct information',
            'If widget doesn\'t load: Verify CSP headers allow HQ Rentals iframes',
            'For customer support: Direct customers to HQ Rentals directly'
          ]
        },

        bookingEngine: {
          name: 'Booking Engine',
          description: 'Advanced booking interface with enhanced features and capabilities',
          whereToPlace: 'Main booking pages, dedicated reservation sections',
          requirements: [
            'HTTPS enabled on your website',
            'Replace {BRANCH_ID} placeholder with your actual branch ID',
            'Allow payment processing and geolocation if needed'
          ],
          configuration: 'Update the {BRANCH_ID} placeholder in the iframe src URL',
          troubleshooting: [
            'If booking fails: Verify branch ID is correct',
            'If payment doesn\'t work: Ensure payment permissions are allowed',
            'If location features fail: Check geolocation permissions'
          ]
        },

        myReservations: {
          name: 'My Reservations',
          description: 'Customer portal for viewing and managing existing reservations',
          whereToPlace: 'Customer account pages, user dashboard, reservation management areas',
          requirements: [
            'Customer authentication may be required',
            'Payment processing permissions for modifications'
          ],
          configuration: 'No configuration required - works out of the box',
          troubleshooting: [
            'If reservations don\'t load: Customer may need to log in',
            'If modifications fail: Check payment permissions',
            'For login issues: Direct customers to main HQ portal'
          ]
        },

        quotes: {
          name: 'Quotes',
          description: 'Quote request interface for pricing inquiries and estimates',
          whereToPlace: 'Quotes pages, pricing sections, contact forms area',
          requirements: [
            'Form submission capabilities',
            'No payment processing needed'
          ],
          configuration: 'No configuration required - works out of the box',
          troubleshooting: [
            'If form doesn\'t submit: Check form validation requirements',
            'If quotes don\'t generate: Verify all required fields are filled',
            'For pricing questions: Direct to sales team'
          ]
        },

        packageQuotes: {
          name: 'Package Quotes',
          description: 'Specialized quote requests for package deals and bulk rentals',
          whereToPlace: 'Package pages, bulk rental sections, corporate booking areas',
          requirements: [
            'Enhanced form capabilities for complex requests',
            'File upload support may be needed'
          ],
          configuration: 'No configuration required - works out of the box',
          troubleshooting: [
            'If package options don\'t load: Check internet connection',
            'If bulk pricing fails: Contact sales for manual processing',
            'For complex requests: Use regular quotes widget as fallback'
          ]
        },

        paymentRequests: {
          name: 'Payment Requests',
          description: 'Payment processing center for invoices and outstanding balances',
          whereToPlace: 'Billing pages, payment sections, customer account areas',
          requirements: [
            'Payment processing permissions required',
            'Secure connection (HTTPS) mandatory',
            'Customer authentication recommended'
          ],
          configuration: 'No configuration required - works out of the box',
          troubleshooting: [
            'If payments fail: Check payment method and permissions',
            'If invoices don\'t load: Customer may need to authenticate',
            'For payment disputes: Contact billing support directly'
          ]
        },

        calendar: {
          name: 'Calendar',
          description: 'Availability calendar showing scheduling and booking slots',
          whereToPlace: 'Availability pages, scheduling sections, booking flow',
          requirements: [
            'Replace {BRANCH_ID} placeholder if branch-specific',
            'Calendar display capabilities'
          ],
          configuration: 'Update {BRANCH_ID} placeholder if using branch-specific calendar',
          troubleshooting: [
            'If calendar doesn\'t load: Check branch ID configuration',
            'If dates don\'t update: Refresh browser cache',
            'For availability questions: Contact reservations team'
          ]
        },

        calendarPerClass: {
          name: 'Calendar per Class',
          description: 'Class-specific availability calendar for vehicle categories',
          whereToPlace: 'Vehicle category pages, class-specific sections',
          requirements: [
            'Replace {BRANCH_ID} and {CLASS_ID} placeholders',
            'Category-specific configuration from HQ dashboard'
          ],
          configuration: 'Update both {BRANCH_ID} and {CLASS_ID} placeholders with actual values',
          troubleshooting: [
            'If class calendar doesn\'t load: Verify both branch ID and class ID',
            'If wrong vehicles show: Check class ID matches vehicle category',
            'For class configuration: Check HQ dashboard vehicle categories'
          ]
        }
      },
      
      technicalNotes: {
        sessionContinuity: 'The ?ssid parameter in URLs is normal and required for HQ Rentals session persistence. Do not remove or modify these parameters.',
        security: `Your website is configured with Content Security Policy headers that allow iframes from ${hqConfig.getAllowedIframeHosts().join(', ')}. This is secure and prevents unauthorized iframe embedding.`,
        support: 'For technical issues with widgets, first check the troubleshooting steps above. For HQ Rentals platform issues, contact HQ Rentals support directly.'
      },
      
      links: {
        snippets: `${baseUrl}/api/hq/snippets`,
        hqDashboard: env.HQ_TENANT_BASE_URL,
        webhookStatus: `${baseUrl}/api/webhooks/hq`
      }
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=1800', // Cache for 30 minutes
      }
    });

  } catch (error) {
    console.error('HQ Readme API Error:', error);
    
    return NextResponse.json({
      error: 'Failed to generate documentation',
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
