'use client';
import { useEffect, useRef, useState } from 'react';

interface HQWidgetProps {
  snippet: string;
  reservationPageUrl?: string;
  className?: string;
  priority?: boolean;
  [key: string]: any;
}

export default function HQWidget({ snippet, reservationPageUrl, className, priority = false, ...props }: HQWidgetProps) {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hqBase = 'https://tna-rentals-llc.hqrentals.app';
  const hqBrand = '4yfuocht-z6gc-ibnk-spdz-jaod9lfwqifk';
  const scriptUrl = `${hqBase}/public/car-rental/integrations/assets/integrator`;

  useEffect(() => {
    // Check if script already exists
    const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
    if (existingScript) {
      console.log('HQ script already exists');
      setScriptLoaded(true);
      setTimeout(initializeWidget, 100);
      return;
    }

    // Load the script
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    
    script.onload = () => {
      console.log('HQ script loaded successfully');
      setScriptLoaded(true);
      setTimeout(initializeWidget, 100);
    };
    
    script.onerror = () => {
      console.error('Failed to load HQ script');
      setError('Failed to load booking system');
    };

    document.head.appendChild(script);
    console.log('Loading HQ script:', scriptUrl);
  }, []);

  const initializeWidget = () => {
    if (!widgetRef.current) {
      console.warn('Widget ref not available');
      return;
    }

    console.log('Initializing HQ widget with snippet:', snippet);

    // Clear any existing content
    widgetRef.current.innerHTML = '';

    // Create the widget div
    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'hq-rental-software-integration';
    widgetDiv.setAttribute('data-integrator_link', `${hqBase}/public/car-rental/integrations`);
    widgetDiv.setAttribute('data-brand', hqBrand);
    widgetDiv.setAttribute('data-snippet', snippet);
    widgetDiv.setAttribute('data-skip_language', '');
    widgetDiv.setAttribute('data-skip_redirect', '1');
    widgetDiv.setAttribute('data-reservation_page', reservationPageUrl || '');
    widgetDiv.setAttribute('data-layout', 'vertical');
    widgetDiv.setAttribute('data-enable_auto_language_update', '');

    widgetRef.current.appendChild(widgetDiv);

    // Try multiple initialization methods
    setTimeout(() => {
      console.log('Attempting widget initialization...');
      
      if ((window as any).HQIntegrator) {
        console.log('Found HQIntegrator, calling init()');
        (window as any).HQIntegrator.init();
      }
      
      if ((window as any).prepareContainer) {
        console.log('Found prepareContainer, calling it');
        (window as any).prepareContainer();
      }

      document.dispatchEvent(new Event('DOMContentLoaded'));
      document.dispatchEvent(new CustomEvent('hqrs:integrator:trigger'));
      
      setTimeout(() => {
        if ((window as any).HQIntegrator) {
          (window as any).HQIntegrator.init();
        }
      }, 1000);
    }, 200);
  };

  useEffect(() => {
    if (scriptLoaded) {
      initializeWidget();
    }
  }, [scriptLoaded, snippet, reservationPageUrl]);

  if (error) {
    return (
      <div className={`p-8 text-center bg-red-50 border border-red-200 rounded-lg ${className || ''}`}>
        <p className="text-red-600">⚠️ {error}</p>
        <p className="text-sm text-gray-600 mt-2">Please refresh the page or contact support</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {!scriptLoaded && (
        <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Loading booking system...</p>
          </div>
        </div>
      )}
      <div 
        ref={widgetRef} 
        className={scriptLoaded ? 'block' : 'hidden'}
        style={{ minHeight: scriptLoaded ? '400px' : '0' }}
      />
    </div>
  );
}
