'use client';

import { useEffect, useRef, useState } from 'react';

interface HQWidgetDirectProps {
  snippet: 'reservation-form' | 'reservations' | 'my-reservations' | 'quotes' | 'package-quotes' | 'payment-requests' | 'calendar' | 'class-calendar';
  className?: string;
}

/**
 * Direct HQ Rentals Widget Component
 * Uses the exact integration code provided by HQ Rentals
 */
export default function HQWidgetDirect({ snippet, className = '' }: HQWidgetDirectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [widgetError, setWidgetError] = useState<string | null>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://tna-rentals-llc.hqrentals.app/public/car-rental/integrations/assets/integrator';
    script.async = true;
    
    script.onload = () => {
      console.log('HQ script loaded successfully');
      setScriptLoaded(true);
      
      // Give the script time to initialize
      setTimeout(() => {
        if (containerRef.current) {
          console.log('Attempting to initialize HQ widget');
          // Dispatch a custom event to trigger HQ initialization
          const event = new CustomEvent('hq-widget-init');
          window.dispatchEvent(event);
        }
      }, 1000);
    };
    
    script.onerror = () => {
      console.error('Failed to load HQ Rentals script');
      setWidgetError('Failed to load booking system');
    };

    document.head.appendChild(script);

    return () => {
      // Don't remove script as it might be used by other widgets
    };
  }, []);

  // Generate the widget HTML based on snippet type
  const getWidgetHTML = () => {
    const baseAttributes = {
      'data-integrator_link': 'https://tna-rentals-llc.hqrentals.app/public/car-rental/integrations',
      'data-brand': '4yfuocht-z6gc-ibnk-spdz-jaod9lfwqifk',
      'data-skip_language': '',
      'data-referral': '',
      'data-enable_auto_language_update': ''
    };

    const snippetConfig: Record<string, any> = {
      'reservation-form': {
        ...baseAttributes,
        'data-snippet': 'reservation-form',
        'data-skip_redirect': '1',
        'data-reservation_page': '',
        'data-layout': 'vertical',
        'data-currency': '',
        'data-rate_type_uuid': ''
      },
      'reservations': {
        ...baseAttributes,
        'data-snippet': 'reservations',
        'data-rate_type_uuid': ''
      },
      'my-reservations': {
        ...baseAttributes,
        'data-snippet': 'my-reservations'
      },
      'quotes': {
        ...baseAttributes,
        'data-snippet': 'quotes'
      },
      'package-quotes': {
        ...baseAttributes,
        'data-snippet': 'package-quotes'
      },
      'payment-requests': {
        ...baseAttributes,
        'data-snippet': 'payment-requests'
      },
      'calendar': {
        ...baseAttributes,
        'data-snippet': 'calendar'
      },
      'class-calendar': {
        'data-integrator_link': 'https://tna-rentals-llc.hqrentals.app/public/car-rental/integrations',
        'data-class': '',
        'data-snippet': 'class-calendar',
        'data-skip_language': '',
        'data-referral': '',
        'data-enable_auto_language_update': ''
      }
    };

    const config = snippetConfig[snippet];
    const attributes = Object.entries(config)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');

    return `<div class="hq-rental-software-integration" ${attributes}></div>`;
  };

  if (widgetError) {
    return (
      <div className={`${className} p-8 text-center border border-red-200 bg-red-50 rounded-lg`}>
        <div className="text-red-600 mb-2">❌ Booking System Error</div>
        <div className="text-sm text-red-500">{widgetError}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!scriptLoaded) {
    return (
      <div className={`${className} p-8 text-center`}>
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <div className="text-gray-500">Loading HQ Rentals system...</div>
        <div className="text-xs text-gray-400 mt-2">Connecting to booking platform</div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div 
        ref={containerRef}
        dangerouslySetInnerHTML={{ 
          __html: getWidgetHTML() 
        }}
        style={{ minHeight: '300px' }}
      />
    </div>
  );
}

/**
 * Pre-configured widget components using direct implementation
 */

export function HQHomepageFormDirect({ className = '' }: { className?: string }) {
  return <HQWidgetDirect snippet="reservation-form" className={className} />;
}

export function HQBookingEngineDirect({ className = '' }: { className?: string }) {
  return <HQWidgetDirect snippet="reservations" className={className} />;
}
