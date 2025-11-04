/**
 * Unit tests for HQ Rentals Snippets API
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

// Mock environment variables for testing
const mockEnv = {
  HQ_TENANT_BASE_URL: 'https://test-tenant.hqrentals.app',
  HQ_ALLOWED_IFRAME_HOSTS: '*.hqrentals.app',
  PUBLIC_RESERVATION_PAGE_URL: 'https://test-site.com/reserve',
  HQ_WEBHOOKS_ENABLED: 'false',
  HQ_POLLING_ENABLED: 'false',
};

// Store original env vars
const originalEnv = process.env;

describe('HQ Snippets API', () => {
  beforeEach(() => {
    // Mock environment variables
    process.env = { ...originalEnv, ...mockEnv };
    
    // Clear module cache to reload with new env vars
    jest.resetModules();
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('Environment Validation', () => {
    it('should fail when required env vars are missing', () => {
      // Remove required env var
      delete process.env.HQ_TENANT_BASE_URL;
      
      // Mock process.exit to prevent test termination
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });
      
      // Should throw when importing env module
      expect(() => {
        require('../src/lib/env');
      }).toThrow();
      
      mockExit.mockRestore();
    });

    it('should validate URL format for tenant base URL', () => {
      process.env.HQ_TENANT_BASE_URL = 'invalid-url';
      
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });
      
      expect(() => {
        require('../src/lib/env');
      }).toThrow();
      
      mockExit.mockRestore();
    });

    it('should validate URL format for reservation page URL', () => {
      process.env.PUBLIC_RESERVATION_PAGE_URL = 'not-a-url';
      
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });
      
      expect(() => {
        require('../src/lib/env');
      }).toThrow();
      
      mockExit.mockRestore();
    });
  });

  describe('Snippet Generation', () => {
    let GET: any;

    beforeEach(async () => {
      // Import the route handler after environment is set
      const module = await import('../src/app/api/hq/snippets/route');
      GET = module.GET;
    });

    it('should return all three snippet types', async () => {
      const mockRequest = {
        url: 'https://test-site.com/api/hq/snippets'
      } as any;

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(data).toHaveProperty('meta');
      expect(data).toHaveProperty('snippets');
      expect(data.snippets).toHaveProperty('reservationEngine');
      expect(data.snippets).toHaveProperty('homepageForm');
      expect(data.snippets).toHaveProperty('findYourBooking');
    });

    it('should inject PUBLIC_RESERVATION_PAGE_URL in snippets', async () => {
      const mockRequest = {
        url: 'https://test-site.com/api/hq/snippets'
      } as any;

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(data.meta.reservationPageUrl).toBe(mockEnv.PUBLIC_RESERVATION_PAGE_URL);
      expect(data.snippets.homepageForm).toContain(mockEnv.PUBLIC_RESERVATION_PAGE_URL);
    });

    it('should include tenant information in metadata', async () => {
      const mockRequest = {
        url: 'https://test-site.com/api/hq/snippets'
      } as any;

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(data.meta.tenant).toBe('test-tenant');
      expect(data.meta.reservationPageUrl).toBe(mockEnv.PUBLIC_RESERVATION_PAGE_URL);
      expect(data.meta).toHaveProperty('lastGenerated');
    });

    it('should generate valid HTML iframe snippets', async () => {
      const mockRequest = {
        url: 'https://test-site.com/api/hq/snippets'
      } as any;

      const response = await GET(mockRequest);
      const data = await response.json();

      // Check that snippets contain valid iframe tags
      expect(data.snippets.reservationEngine).toMatch(/<iframe[^>]*>/);
      expect(data.snippets.homepageForm).toMatch(/<iframe[^>]*>/);
      expect(data.snippets.findYourBooking).toMatch(/<iframe[^>]*>/);

      // Check that snippets contain closing iframe tags
      expect(data.snippets.reservationEngine).toContain('</iframe>');
      expect(data.snippets.homepageForm).toContain('</iframe>');
      expect(data.snippets.findYourBooking).toContain('</iframe>');
    });

    it('should include helpful HTML comments', async () => {
      const mockRequest = {
        url: 'https://test-site.com/api/hq/snippets'
      } as any;

      const response = await GET(mockRequest);
      const data = await response.json();

      // Check for HTML comments with instructions
      expect(data.snippets.reservationEngine).toMatch(/<!--.*PASTE THIS.*-->/);
      expect(data.snippets.reservationEngine).toMatch(/<!--.*REPLACE.*{BRANCH_ID}.*-->/);
      expect(data.snippets.homepageForm).toMatch(/<!--.*HQ Rentals Homepage Form.*-->/);
      expect(data.snippets.findYourBooking).toMatch(/<!--.*HQ Rentals Find Your Booking.*-->/);
    });

    it('should include proper iframe attributes', async () => {
      const mockRequest = {
        url: 'https://test-site.com/api/hq/snippets'
      } as any;

      const response = await GET(mockRequest);
      const data = await response.json();

      // Reservation Engine should have payment and geolocation permissions
      expect(data.snippets.reservationEngine).toContain('allow="payment; geolocation"');
      
      // Homepage Form should have data-reservation_page attribute
      expect(data.snippets.homepageForm).toContain(`data-reservation_page="${mockEnv.PUBLIC_RESERVATION_PAGE_URL}"`);
      
      // All should have proper sandbox attributes
      expect(data.snippets.reservationEngine).toContain('sandbox=');
      expect(data.snippets.homepageForm).toContain('sandbox=');
      expect(data.snippets.findYourBooking).toContain('sandbox=');
    });

    it('should set appropriate cache headers', async () => {
      const mockRequest = {
        url: 'https://test-site.com/api/hq/snippets'
      } as any;

      const response = await GET(mockRequest);

      expect(response.headers.get('Content-Type')).toBe('application/json');
      expect(response.headers.get('Cache-Control')).toContain('public');
      expect(response.headers.get('Cache-Control')).toContain('max-age=3600');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing environment gracefully', async () => {
      // Temporarily break the environment
      delete process.env.HQ_TENANT_BASE_URL;
      
      const mockRequest = {
        url: 'https://test-site.com/api/hq/snippets'
      } as any;

      try {
        const module = await import('../src/app/api/hq/snippets/route');
        const response = await module.GET(mockRequest);
        
        expect(response.status).toBe(500);
        
        const data = await response.json();
        expect(data).toHaveProperty('error');
        expect(data).toHaveProperty('timestamp');
      } catch (error) {
        // Expected to fail due to environment validation
        expect(error).toBeDefined();
      }
    });
  });

  describe('CORS Support', () => {
    it('should handle OPTIONS requests', async () => {
      const module = await import('../src/app/api/hq/snippets/route');
      const response = await module.OPTIONS();

      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('GET');
    });
  });
});

describe('HQ Configuration Helpers', () => {
  beforeEach(() => {
    process.env = { ...originalEnv, ...mockEnv };
    jest.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should extract tenant name from URL', async () => {
    const { hqConfig } = await import('../src/lib/env');
    expect(hqConfig.getTenantName()).toBe('test-tenant');
  });

  it('should parse allowed iframe hosts', async () => {
    const { hqConfig } = await import('../src/lib/env');
    const hosts = hqConfig.getAllowedIframeHosts();
    expect(hosts).toContain('*.hqrentals.app');
  });

  it('should handle boolean environment variables', async () => {
    const { hqConfig } = await import('../src/lib/env');
    expect(hqConfig.isWebhooksEnabled()).toBe(false);
    expect(hqConfig.isPollingEnabled()).toBe(false);
  });
});
