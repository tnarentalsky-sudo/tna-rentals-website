'use client';

import { useEffect, useRef, useState } from 'react';

interface HQWidgetProps {
  snippet: 'reservation-form' | 'reservations' | 'my-reservations' | 'quotes' | 'package-quotes' | 'payment-requests' | 'calendar' | 'class-calendar' | 'find-booking';
  layout?: 'vertical' | 'horizontal';
  skipRedirect?: boolean;
  reservationPage?: string;
  currency?: string;
  rateTypeUuid?: string;
  referral?: string;
  className?: string;
  dataClass?: string;
}

/**
 * Enhanced HQ Rentals Widget Component with better error handling and debugging
 */
export default function HQWidgetFixed({
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
  const [loadingState, setLoadingState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // HQ Rentals configuration
  const HQ_SCRIPT_URL = 'https://tna-rentals-llc.hqrentals.app/public/car-rental/integrations/assets/integrator';
  const HQ_INTEGRATOR_URL = 'https://tna-rentals-llc.hqrentals.app/public/car-rental/integrations';
  const HQ_BRAND_ID = '4yfuocht-z6gc-ibnk-spdz-jaod9lfwqifk';

  useEffect(() => {
    console.log('HQWidget: Starting initialization for snippet:', snippet);
    
    const initializeWidget = () => {
      if (!containerRef.current) {
        console.error('HQWidget: Container ref not available');
        return;
      }

      console.log('HQWidget: Initializing widget container');
      
      // Safely clear existing content
      try {
        while (containerRef.current.firstChild) {
          containerRef.current.removeChild(containerRef.current.firstChild);
        }
      } catch (error) {
        console.warn('HQWidget: Error clearing container:', error);
        containerRef.current.innerHTML = '';
      }
      
      // Create the HQ widget div
      const widgetDiv = document.createElement('div');
      widgetDiv.className = 'hq-rental-software-integration';
      
      // Set data attributes
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

      // Add some debugging attributes
      widgetDiv.setAttribute('data-debug', 'true');
      widgetDiv.setAttribute('data-timestamp', Date.now().toString());

      console.log('HQWidget: Widget div created with attributes:', widgetDiv.outerHTML);
      
      containerRef.current.appendChild(widgetDiv);

      // Set loaded state
      setLoadingState('loaded');
      
      // Check if HQ integrator is available and try to initialize
      setTimeout(() => {
        if (typeof (window as any).HQRentalsIntegrator !== 'undefined') {
          console.log('HQWidget: HQ Integrator found, initializing...');
          try {
            (window as any).HQRentalsIntegrator.init();
            console.log('HQWidget: HQ Integrator initialized successfully');
          } catch (error) {
            console.error('HQWidget: Error initializing HQ Integrator:', error);
            setErrorMessage('Failed to initialize HQ Integrator');
            setLoadingState('error');
          }
        } else {
          console.warn('HQWidget: HQ Integrator not found on window object');
          // Try to manually trigger any initialization
          const event = new CustomEvent('hq-widget-ready', { detail: { snippet } });
          window.dispatchEvent(event);
        }
      }, 1000);
    };

    // Load HQ script
    const existingScript = document.querySelector(`script[src="${HQ_SCRIPT_URL}"]`);
    
    if (!existingScript) {
      console.log('HQWidget: Loading HQ script:', HQ_SCRIPT_URL);
      const script = document.createElement('script');
      script.src = HQ_SCRIPT_URL;
      script.async = true;
      
      script.onload = () => {
        console.log('HQWidget: Script loaded successfully');
        setTimeout(initializeWidget, 500); // Give script time to initialize
      };
      
      script.onerror = (error) => {
        console.error('HQWidget: Failed to load script:', error);
        setErrorMessage('Failed to load HQ Rentals script');
        setLoadingState('error');
      };
      
      document.head.appendChild(script);
    } else {
      console.log('HQWidget: Script already exists, initializing widget');
      setTimeout(initializeWidget, 100);
    }

    // Cleanup function
    return () => {
      if (containerRef.current) {
        try {
          // Safely clear the container
          while (containerRef.current.firstChild) {
            containerRef.current.removeChild(containerRef.current.firstChild);
          }
        } catch (error) {
          console.warn('HQWidget: Cleanup error (non-critical):', error);
          // Fallback to innerHTML if removeChild fails
          try {
            containerRef.current.innerHTML = '';
          } catch (innerError) {
            console.warn('HQWidget: Fallback cleanup also failed:', innerError);
          }
        }
      }
    };
  }, [snippet, layout, skipRedirect, reservationPage, currency, rateTypeUuid, referral, dataClass]);

  // Debug: Log current state
  useEffect(() => {
    console.log('HQWidget state:', { loadingState, errorMessage, snippet });
  }, [loadingState, errorMessage, snippet]);

  if (loadingState === 'error') {
    return (
      <div className={`hq-widget-container ${className}`} style={{ minHeight: '200px' }}>
        <div className="p-8 text-center border-2 border-red-200 bg-red-50 rounded-lg">
          <div className="text-red-600 mb-2">⚠️ Widget Loading Error</div>
          <div className="text-sm text-red-500 mb-4">{errorMessage}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`hq-widget-container ${className}`} style={{ minHeight: '200px' }}>
      <div 
        ref={containerRef}
        className="hq-widget-content"
      >
        {loadingState === 'loading' && (
          <div className="hq-widget-loading text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <div className="text-gray-500">Loading HQ Rentals widget...</div>
            <div className="text-xs text-gray-400 mt-2">Snippet: {snippet}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Pre-configured widget components using the fixed implementation
 */

export function HQHomepageFormFixed({ className = '', layout = 'vertical' }: { 
  className?: string; 
  layout?: 'vertical' | 'horizontal';
}) {
  return (
    <HQWidgetFixed 
      snippet="reservation-form"
      layout={layout}
      skipRedirect={true}
      className={className}
    />
  );
}

export function HQBookingEngineFixed({ className = '' }: { className?: string }) {
  return (
    <HQWidgetFixed 
      snippet="reservations"
      className={className}
    />
  );
}
