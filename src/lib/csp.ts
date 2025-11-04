import { env, hqConfig } from './env';

/**
 * Content Security Policy configuration for HQ Rentals iframe integration
 */

// Base CSP directives (preserve existing security)
const baseCSP = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-eval'", "'unsafe-inline'", "*.hqrentals.app", "*.cloudfront.net"], // Required for Next.js development
  'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"], // Allow Google Fonts
  'img-src': ["'self'", "data:", "https:"], // Allow images from HTTPS sources
  'font-src': ["'self'", "https:", "data:", "https://fonts.gstatic.com"], // Allow Google Fonts
  'connect-src': ["'self'", "*.hqrentals.app", "*.cloudfront.net"],
  'frame-src': ["'self'", "*.hqrentals.app", "*.cloudfront.net"],
  'media-src': ["'self'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'self'"], // Prevent clickjacking
};

/**
 * Builds CSP directives with HQ Rentals iframe support
 */
export function buildCSPDirectives(): Record<string, string[]> {
  const allowedHosts = hqConfig.getAllowedIframeHosts();
  
  // Convert wildcard domains to CSP format
  const cspHosts = allowedHosts.map(host => {
    if (host.startsWith('*.')) {
      return `https://${host}`;
    }
    return `https://${host}`;
  });

  return {
    ...baseCSP,
    // Allow scripts from HQ Rentals for widget integration
    'script-src': [
      ...baseCSP['script-src'],
      ...cspHosts,
      'https://tna-rentals-llc.hqrentals.app', // Allow HQ integrator scripts
      'https://d3920qzvobooy.cloudfront.net', // HQ Rentals CDN
      'https://*.cloudfront.net' // Allow CloudFront CDN
    ],
    // Allow styles from HQ Rentals and external CDNs
    'style-src': [
      ...baseCSP['style-src'],
      ...cspHosts,
      'https://tna-rentals-llc.hqrentals.app',
      'https://d3920qzvobooy.cloudfront.net',
      'https://*.cloudfront.net'
    ],
    // Allow iframes from HQ Rentals and Google Maps
    'frame-src': [
      "'self'",
      ...cspHosts,
      'https://maps.googleapis.com',
      'https://www.google.com' // For reCAPTCHA if needed
    ],
    // Child-src same as frame-src for compatibility
    'child-src': [
      "'self'",
      ...cspHosts,
      'https://maps.googleapis.com',
      'https://www.google.com'
    ],
    // Allow connections to HQ Rentals for widget communication
    'connect-src': [
      ...baseCSP['connect-src'],
      ...cspHosts,
      'https://api.hqrentals.app', // Common API endpoint
      'https://tna-rentals-llc.hqrentals.app', // Widget communication
      'https://d3920qzvobooy.cloudfront.net', // HQ CDN
      'https://*.cloudfront.net' // CloudFront CDN
    ]
  };
}

/**
 * Converts CSP directives object to CSP header string
 */
export function buildCSPHeader(): string {
  const directives = buildCSPDirectives();
  
  return Object.entries(directives)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
}

/**
 * Gets CSP configuration for development vs production
 */
export function getCSPForEnvironment(): string {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    // More relaxed CSP for development
    const devDirectives = buildCSPDirectives();
    
    // Add localhost and webpack dev server for development
    devDirectives['script-src'].push("'unsafe-eval'", 'http://localhost:*', 'ws://localhost:*');
    devDirectives['connect-src'].push('http://localhost:*', 'ws://localhost:*', 'wss://localhost:*');
    
    return Object.entries(devDirectives)
      .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
      .join('; ');
  }
  
  return buildCSPHeader();
}

/**
 * Validates that required iframe hosts are properly configured
 */
export function validateCSPConfiguration(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  try {
    const allowedHosts = hqConfig.getAllowedIframeHosts();
    
    if (allowedHosts.length === 0) {
      errors.push('No iframe hosts configured in HQ_ALLOWED_IFRAME_HOSTS');
    }
    
    // Validate each host format
    allowedHosts.forEach(host => {
      if (!host.includes('hqrentals.app')) {
        errors.push(`Invalid host format: ${host}. Must include 'hqrentals.app'`);
      }
    });
    
    // Ensure tenant URL matches allowed hosts
    const tenantHost = new URL(env.HQ_TENANT_BASE_URL).hostname;
    const isAllowed = allowedHosts.some(host => {
      if (host.startsWith('*.')) {
        const domain = host.substring(2);
        return tenantHost.endsWith(domain);
      }
      return tenantHost === host;
    });
    
    if (!isAllowed) {
      errors.push(`Tenant host ${tenantHost} not covered by HQ_ALLOWED_IFRAME_HOSTS`);
    }
    
  } catch (error) {
    errors.push(`CSP validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Log CSP configuration on server startup
if (typeof window === 'undefined') {
  const validation = validateCSPConfiguration();
  if (validation.isValid) {
    console.log('✅ CSP Configuration Valid');
    console.log(`   Allowed iframe hosts: ${hqConfig.getAllowedIframeHosts().join(', ')}`);
  } else {
    console.warn('⚠️  CSP Configuration Issues:');
    validation.errors.forEach(error => console.warn(`   - ${error}`));
  }
}
