'use client';

import { useEffect, useRef, useState } from 'react';

interface HQWidgetSimpleProps {
  snippet: 'reservation-form' | 'reservations';
  layout?: 'vertical' | 'horizontal';
  className?: string;
}

/**
 * Simplified HQ Rentals Widget Component
 * Uses direct HTML injection to avoid React DOM manipulation issues
 */
export default function HQWidgetSimple({
  snippet,
  layout = 'vertical',
  className = '',
}: HQWidgetSimpleProps) {
  const [mounted, setMounted] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // HQ Rentals configuration
  const HQ_SCRIPT_URL = 'https://tna-rentals-llc.hqrentals.app/public/car-rental/integrations/assets/integrator';
  const HQ_INTEGRATOR_URL = 'https://tna-rentals-llc.hqrentals.app/public/car-rental/integrations';
  const HQ_BRAND_ID = '4yfuocht-z6gc-ibnk-spdz-jaod9lfwqifk';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Load HQ script if not already loaded
    const existingScript = document.querySelector(`script[src="${HQ_SCRIPT_URL}"]`);
    
    if (!existingScript) {
      console.log('HQWidgetSimple: Loading script...');
      const script = document.createElement('script');
      script.src = HQ_SCRIPT_URL;
      script.async = true;
      
      script.onload = () => {
        console.log('HQWidgetSimple: Script loaded');
        setScriptLoaded(true);
      };
      
      script.onerror = () => {
        console.error('HQWidgetSimple: Script failed to load');
      };
      
      document.head.appendChild(script);
    } else {
      console.log('HQWidgetSimple: Script already loaded');
      setScriptLoaded(true);
    }
  }, [mounted, HQ_SCRIPT_URL]);

  // Generate the widget HTML
  const generateWidgetHTML = () => {
    const attributes = [
      `data-integrator_link="${HQ_INTEGRATOR_URL}"`,
      `data-brand="${HQ_BRAND_ID}"`,
      `data-snippet="${snippet}"`,
      'data-skip_language=""',
      'data-referral=""',
      'data-enable_auto_language_update=""'
    ];

    if (snippet === 'reservation-form') {
      attributes.push(
        'data-skip_redirect="1"',
        'data-reservation_page=""',
        `data-layout="${layout}"`,
        'data-currency=""',
        'data-rate_type_uuid=""'
      );
    }

    if (snippet === 'reservations') {
      attributes.push('data-rate_type_uuid=""');
    }

    return `<div class="hq-rental-software-integration" ${attributes.join(' ')}></div>`;
  };

  if (!mounted) {
    return (
      <div className={`hq-widget-container ${className}`} style={{ minHeight: '200px' }}>
        <div className="text-center py-8 text-gray-500">Initializing...</div>
      </div>
    );
  }

  return (
    <div className={`hq-widget-container ${className}`} style={{ minHeight: '200px' }}>
      {scriptLoaded ? (
        <div 
          dangerouslySetInnerHTML={{ 
            __html: generateWidgetHTML() 
          }}
        />
      ) : (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-gray-500">Loading HQ Rentals widget...</div>
        </div>
      )}
    </div>
  );
}

/**
 * Pre-configured simple widget components
 */
export function HQHomepageFormSimple({ 
  className = '', 
  layout = 'vertical' 
}: { 
  className?: string; 
  layout?: 'vertical' | 'horizontal';
}) {
  return (
    <HQWidgetSimple 
      snippet="reservation-form"
      layout={layout}
      className={className}
    />
  );
}

export function HQBookingEngineSimple({ className = '' }: { className?: string }) {
  return (
    <HQWidgetSimple 
      snippet="reservations"
      className={className}
    />
  );
}
