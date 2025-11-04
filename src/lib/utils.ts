/**
 * Utility functions for the application
 */

/**
 * Get the current site URL for production use
 * Handles both client-side and server-side rendering
 */
export function getSiteUrl(): string {
  // Client-side: use window.location.origin
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Server-side: check environment variables
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  
  // Fallback for development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  
  // Production fallback - you should set NEXT_PUBLIC_SITE_URL
  console.warn('⚠️ No site URL configured. Add NEXT_PUBLIC_SITE_URL to your environment variables.');
  return 'https://www.tnarentalsllc.com'; // Your actual domain
}

/**
 * Get the reservation page URL for HQ Rentals widget integration
 */
export function getReservationPageUrl(): string {
  return `${getSiteUrl()}/book`;
}
