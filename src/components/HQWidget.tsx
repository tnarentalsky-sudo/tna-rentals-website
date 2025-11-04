'use client';

import { useEffect, useRef } from 'react';

interface HQWidgetProps {
  snippet: 'reservation-form' | 'reservations' | 'my-reservations' | 'quotes' | 'package-quotes' | 'payment-requests' | 'calendar' | 'class-calendar' | 'find-booking';
  layout?: 'vertical' | 'horizontal';
  skipRedirect?: boolean;
  reservationPage?: string;
  currency?: string;
  rateTypeUuid?: string;
  referral?: string;
  className?: string;
  dataClass?: string; // For class-calendar snippet
}

/**
 * HQ Rentals Widget Component
 * 
 * This component dynamically loads and renders HQ Rentals widgets
 * using the script-based integration system.
 */
export default function HQWidget({
  snippet,
  layout = 'vertical',
  skipRedirect = false,
  reservationPage = '',
  currency = '',
  rateTypeUuid = '',
  referral = '',
  className = '',
  dataClass = '',
}: HQWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  // HQ Rentals configuration - these should match your actual setup
  const HQ_SCRIPT_URL = 'https://tna-rentals-llc.hqrentals.app/public/car-rental/integrations/assets/integrator';
  const HQ_INTEGRATOR_URL = 'https://tna-rentals-llc.hqrentals.app/public/car-rental/integrations';
  const HQ_BRAND_ID = '4yfuocht-z6gc-ibnk-spdz-jaod9lfwqifk';

  useEffect(() => {
    // Load HQ script if not already loaded
    if (!scriptLoadedRef.current) {
      const existingScript = document.querySelector(`script[src="${HQ_SCRIPT_URL}"]`);
      
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = HQ_SCRIPT_URL;
        script.async = true;
        script.onload = () => {
          scriptLoadedRef.current = true;
          // Trigger widget initialization after script loads
          initializeWidget();
        };
        document.head.appendChild(script);
      } else {
        scriptLoadedRef.current = true;
        initializeWidget();
      }
    } else {
      initializeWidget();
    }

    function initializeWidget() {
      if (containerRef.current) {
        // Clear any existing content
        containerRef.current.innerHTML = '';
        
        // Create the HQ widget div
        const widgetDiv = document.createElement('div');
        widgetDiv.className = 'hq-rental-software-integration';
        
        // Set data attributes based on snippet type
        widgetDiv.setAttribute('data-integrator_link', HQ_INTEGRATOR_URL);
        widgetDiv.setAttribute('data-snippet', snippet);
        widgetDiv.setAttribute('data-skip_language', '');
        widgetDiv.setAttribute('data-referral', referral);
        widgetDiv.setAttribute('data-enable_auto_language_update', '');
        
        // Conditional attributes based on snippet type
        if (snippet === 'class-calendar') {
          if (dataClass) {
            widgetDiv.setAttribute('data-class', dataClass);
          }
        } else {
          widgetDiv.setAttribute('data-brand', HQ_BRAND_ID);
        }

        if (snippet === 'reservation-form') {
          widgetDiv.setAttribute('data-skip_redirect', skipRedirect ? '1' : '');
          widgetDiv.setAttribute('data-reservation_page', reservationPage);
          widgetDiv.setAttribute('data-layout', layout);
          widgetDiv.setAttribute('data-currency', currency);
        }

        if (['reservations', 'reservation-form'].includes(snippet)) {
          widgetDiv.setAttribute('data-rate_type_uuid', rateTypeUuid);
        }

        containerRef.current.appendChild(widgetDiv);

        // Trigger HQ integrator if available
        if (typeof (window as any).HQRentalsIntegrator !== 'undefined') {
          (window as any).HQRentalsIntegrator.init();
        }
      }
    }

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [snippet, layout, skipRedirect, reservationPage, currency, rateTypeUuid, referral, dataClass]);

  return (
    <div 
      ref={containerRef} 
      className={`hq-widget-container ${className}`}
      style={{ minHeight: '200px' }} // Prevent layout shift
    >
      {/* Fallback content while loading */}
      <div className="hq-widget-loading text-center py-8 text-gray-500">
        Loading rental widget...
      </div>
    </div>
  );
}

/**
 * Pre-configured widget components for common use cases
 */

export function HQHomepageForm({ className = '', layout = 'vertical' }: { 
  className?: string; 
  layout?: 'vertical' | 'horizontal';
}) {
  return (
    <HQWidget 
      snippet="reservation-form"
      layout={layout}
      skipRedirect={true}
      className={className}
    />
  );
}

export function HQBookingEngine({ className = '' }: { className?: string }) {
  return (
    <HQWidget 
      snippet="reservations"
      className={className}
    />
  );
}

export function HQMyReservations({ className = '' }: { className?: string }) {
  return (
    <HQWidget 
      snippet="my-reservations"
      className={className}
    />
  );
}

export function HQQuotes({ className = '' }: { className?: string }) {
  return (
    <HQWidget 
      snippet="quotes"
      className={className}
    />
  );
}

export function HQPackageQuotes({ className = '' }: { className?: string }) {
  return (
    <HQWidget 
      snippet="package-quotes"
      className={className}
    />
  );
}

export function HQPaymentRequests({ className = '' }: { className?: string }) {
  return (
    <HQWidget 
      snippet="payment-requests"
      className={className}
    />
  );
}

export function HQCalendar({ className = '' }: { className?: string }) {
  return (
    <HQWidget 
      snippet="calendar"
      className={className}
    />
  );
}

export function HQClassCalendar({ 
  className = '', 
  dataClass = '' 
}: { 
  className?: string; 
  dataClass?: string;
}) {
  return (
    <HQWidget 
      snippet="class-calendar"
      dataClass={dataClass}
      className={className}
    />
  );
}
