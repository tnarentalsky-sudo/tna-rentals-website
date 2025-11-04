/**
 * Unit tests for CSP (Content Security Policy) configuration
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

// Mock environment variables for testing
const mockEnv = {
  HQ_TENANT_BASE_URL: 'https://test-tenant.hqrentals.app',
  HQ_ALLOWED_IFRAME_HOSTS: '*.hqrentals.app,maps.googleapis.com',
  PUBLIC_RESERVATION_PAGE_URL: 'https://test-site.com/reserve',
  HQ_WEBHOOKS_ENABLED: 'false',
  HQ_POLLING_ENABLED: 'false',
  NODE_ENV: 'test'
};

// Store original env vars
const originalEnv = process.env;

describe('CSP Configuration', () => {
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

  describe('CSP Directive Building', () => {
    it('should include allowed iframe hosts in frame-src', async () => {
      const { buildCSPDirectives } = await import('../src/lib/csp');
      const directives = buildCSPDirectives();

      expect(directives['frame-src']).toContain("'self'");
      expect(directives['frame-src']).toContain('https://*.hqrentals.app');
      expect(directives['frame-src']).toContain('https://maps.googleapis.com');
    });

    it('should include allowed iframe hosts in child-src', async () => {
      const { buildCSPDirectives } = await import('../src/lib/csp');
      const directives = buildCSPDirectives();

      expect(directives['child-src']).toContain("'self'");
      expect(directives['child-src']).toContain('https://*.hqrentals.app');
      expect(directives['child-src']).toContain('https://maps.googleapis.com');
    });

    it('should include HQ hosts in connect-src', async () => {
      const { buildCSPDirectives } = await import('../src/lib/csp');
      const directives = buildCSPDirectives();

      expect(directives['connect-src']).toContain("'self'");
      expect(directives['connect-src']).toContain('https://*.hqrentals.app');
    });

    it('should maintain security for other directives', async () => {
      const { buildCSPDirectives } = await import('../src/lib/csp');
      const directives = buildCSPDirectives();

      expect(directives['default-src']).toEqual(["'self'"]);
      expect(directives['object-src']).toEqual(["'none'"]);
      expect(directives['base-uri']).toEqual(["'self'"]);
      expect(directives['form-action']).toEqual(["'self'"]);
      expect(directives['frame-ancestors']).toEqual(["'self'"]);
    });
  });

  describe('CSP Header Generation', () => {
    it('should generate valid CSP header string', async () => {
      const { buildCSPHeader } = await import('../src/lib/csp');
      const header = buildCSPHeader();

      expect(header).toContain("default-src 'self'");
      expect(header).toContain("frame-src 'self' https://*.hqrentals.app");
      expect(header).toContain("object-src 'none'");
      expect(header).toMatch(/;\s/); // Should have semicolon separators
    });

    it('should handle development environment', async () => {
      process.env.NODE_ENV = 'development';
      jest.resetModules();

      const { getCSPForEnvironment } = await import('../src/lib/csp');
      const header = getCSPForEnvironment();

      expect(header).toContain('http://localhost:*');
      expect(header).toContain('ws://localhost:*');
    });

    it('should handle production environment', async () => {
      process.env.NODE_ENV = 'production';
      jest.resetModules();

      const { getCSPForEnvironment } = await import('../src/lib/csp');
      const header = getCSPForEnvironment();

      expect(header).not.toContain('http://localhost:*');
      expect(header).toContain("frame-src 'self' https://*.hqrentals.app");
    });
  });

  describe('CSP Validation', () => {
    it('should validate proper HQ configuration', async () => {
      const { validateCSPConfiguration } = await import('../src/lib/csp');
      const validation = validateCSPConfiguration();

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect missing iframe hosts', async () => {
      process.env.HQ_ALLOWED_IFRAME_HOSTS = '';
      jest.resetModules();

      const { validateCSPConfiguration } = await import('../src/lib/csp');
      const validation = validateCSPConfiguration();

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('No iframe hosts configured in HQ_ALLOWED_IFRAME_HOSTS');
    });

    it('should detect invalid host formats', async () => {
      process.env.HQ_ALLOWED_IFRAME_HOSTS = 'invalid-host.com';
      jest.resetModules();

      const { validateCSPConfiguration } = await import('../src/lib/csp');
      const validation = validateCSPConfiguration();

      expect(validation.isValid).toBe(false);
      expect(validation.errors.some(err => err.includes('Invalid host format'))).toBe(true);
    });

    it('should detect tenant URL mismatch', async () => {
      process.env.HQ_TENANT_BASE_URL = 'https://different-tenant.example.com';
      jest.resetModules();

      const { validateCSPConfiguration } = await import('../src/lib/csp');
      const validation = validateCSPConfiguration();

      expect(validation.isValid).toBe(false);
      expect(validation.errors.some(err => err.includes('not covered by HQ_ALLOWED_IFRAME_HOSTS'))).toBe(true);
    });
  });

  describe('Wildcard Host Handling', () => {
    it('should handle wildcard domains correctly', async () => {
      process.env.HQ_ALLOWED_IFRAME_HOSTS = '*.hqrentals.app,*.example.com';
      jest.resetModules();

      const { buildCSPDirectives } = await import('../src/lib/csp');
      const directives = buildCSPDirectives();

      expect(directives['frame-src']).toContain('https://*.hqrentals.app');
      expect(directives['frame-src']).toContain('https://*.example.com');
    });

    it('should validate wildcard patterns', async () => {
      process.env.HQ_ALLOWED_IFRAME_HOSTS = '*.hqrentals.app';
      process.env.HQ_TENANT_BASE_URL = 'https://test-tenant.hqrentals.app';
      jest.resetModules();

      const { validateCSPConfiguration } = await import('../src/lib/csp');
      const validation = validateCSPConfiguration();

      expect(validation.isValid).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed URLs gracefully', async () => {
      process.env.HQ_TENANT_BASE_URL = 'not-a-url';
      jest.resetModules();

      const { validateCSPConfiguration } = await import('../src/lib/csp');
      const validation = validateCSPConfiguration();

      expect(validation.isValid).toBe(false);
      expect(validation.errors.some(err => err.includes('CSP validation error'))).toBe(true);
    });
  });
});

describe('Middleware CSP Integration', () => {
  beforeEach(() => {
    process.env = { ...originalEnv, ...mockEnv };
    jest.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should add CSP headers to responses', async () => {
    const mockRequest = {
      url: 'https://test-site.com/test-page',
      method: 'GET',
      headers: new Map()
    } as any;

    // Mock NextResponse
    const mockHeaders = new Map();
    const mockResponse = {
      headers: {
        set: (key: string, value: string) => mockHeaders.set(key, value),
        get: (key: string) => mockHeaders.get(key)
      }
    };

    // Mock NextResponse.next() to return our mock response
    jest.doMock('next/server', () => ({
      NextResponse: {
        next: () => mockResponse
      }
    }));

    const { middleware } = await import('../src/middleware');
    const response = middleware(mockRequest);

    expect(mockHeaders.has('Content-Security-Policy')).toBe(true);
    expect(mockHeaders.has('X-Frame-Options')).toBe(true);
    expect(mockHeaders.has('X-Content-Type-Options')).toBe(true);
  });

  it('should handle CORS for HQ API endpoints', async () => {
    const mockRequest = {
      url: 'https://test-site.com/api/hq/snippets',
      method: 'GET',
      headers: new Map([['origin', 'https://external-site.com']])
    } as any;

    const mockHeaders = new Map();
    const mockResponse = {
      headers: {
        set: (key: string, value: string) => mockHeaders.set(key, value),
        get: (key: string) => mockHeaders.get(key)
      }
    };

    jest.doMock('next/server', () => ({
      NextResponse: {
        next: () => mockResponse
      }
    }));

    const { middleware } = await import('../src/middleware');
    middleware(mockRequest);

    expect(mockHeaders.get('Access-Control-Allow-Origin')).toBe('*');
    expect(mockHeaders.get('Access-Control-Allow-Methods')).toContain('GET');
  });

  it('should handle preflight OPTIONS requests', async () => {
    const mockRequest = {
      url: 'https://test-site.com/api/hq/snippets',
      method: 'OPTIONS',
      headers: new Map()
    } as any;

    const mockHeaders = new Map();
    
    jest.doMock('next/server', () => ({
      NextResponse: {
        next: () => ({
          headers: {
            set: (key: string, value: string) => mockHeaders.set(key, value),
            get: (key: string) => mockHeaders.get(key)
          }
        })
      }
    }));

    const { middleware } = await import('../src/middleware');
    const response = middleware(mockRequest);

    // Should handle OPTIONS request appropriately
    expect(response).toBeDefined();
  });
});
