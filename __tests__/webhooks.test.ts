/**
 * Unit tests for HQ Rentals Webhook endpoints
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

// Mock environment variables for testing
const mockEnv = {
  HQ_TENANT_BASE_URL: 'https://test-tenant.hqrentals.app',
  HQ_ALLOWED_IFRAME_HOSTS: '*.hqrentals.app',
  PUBLIC_RESERVATION_PAGE_URL: 'https://test-site.com/reserve',
  HQ_WEBHOOKS_ENABLED: 'false',
  HQ_POLLING_ENABLED: 'false',
  HQ_WEBHOOK_SECRET: 'test-secret-key'
};

// Store original env vars
const originalEnv = process.env;

describe('HQ Webhooks API', () => {
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

  describe('Webhook Endpoint - Disabled State', () => {
    it('should return 501 when webhooks are disabled', async () => {
      const module = await import('../src/app/api/webhooks/hq/route');
      
      const mockRequest = {
        text: async () => JSON.stringify({
          eventId: 'test-event-123',
          eventType: 'reservation.created',
          timestamp: new Date().toISOString(),
          data: { reservationId: 'res-123' }
        }),
        headers: new Map()
      } as any;

      const response = await module.POST(mockRequest);
      expect(response.status).toBe(501);

      const data = await response.json();
      expect(data.error).toBe('Webhooks disabled');
      expect(data.message).toContain('HQ_WEBHOOKS_ENABLED=true');
    });
  });

  describe('Webhook Endpoint - Enabled State', () => {
    beforeEach(() => {
      process.env.HQ_WEBHOOKS_ENABLED = 'true';
      jest.resetModules();
    });

    it('should process valid webhook payload', async () => {
      const module = await import('../src/app/api/webhooks/hq/route');
      
      const payload = {
        eventId: 'test-event-123',
        eventType: 'reservation.created',
        timestamp: new Date().toISOString(),
        data: { reservationId: 'res-123' }
      };

      const mockRequest = {
        text: async () => JSON.stringify(payload),
        headers: new Map([['x-hq-signature', 'test-signature']])
      } as any;

      const response = await module.POST(mockRequest);
      expect(response.status).toBe(204); // No Content - success
    });

    it('should reject invalid JSON payload', async () => {
      const module = await import('../src/app/api/webhooks/hq/route');
      
      const mockRequest = {
        text: async () => 'invalid-json{',
        headers: new Map()
      } as any;

      const response = await module.POST(mockRequest);
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toBe('Invalid JSON payload');
    });

    it('should reject payload missing required fields', async () => {
      const module = await import('../src/app/api/webhooks/hq/route');
      
      const invalidPayload = {
        eventType: 'reservation.created',
        // Missing eventId and timestamp
        data: { reservationId: 'res-123' }
      };

      const mockRequest = {
        text: async () => JSON.stringify(invalidPayload),
        headers: new Map()
      } as any;

      const response = await module.POST(mockRequest);
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toBe('Missing required fields');
      expect(data.message).toContain('eventId, eventType, and timestamp are required');
    });

    it('should handle duplicate events (idempotency)', async () => {
      const module = await import('../src/app/api/webhooks/hq/route');
      
      const payload = {
        eventId: 'duplicate-event-123',
        eventType: 'reservation.created',
        timestamp: '2024-01-01T00:00:00Z',
        data: { reservationId: 'res-123' }
      };

      const mockRequest = {
        text: async () => JSON.stringify(payload),
        headers: new Map()
      } as any;

      // First request should succeed
      const response1 = await module.POST(mockRequest);
      expect(response1.status).toBe(204);

      // Second identical request should be detected as duplicate
      const response2 = await module.POST(mockRequest);
      expect(response2.status).toBe(200);

      const data = await response2.json();
      expect(data.message).toBe('Event already processed');
      expect(data.eventId).toBe('duplicate-event-123');
    });

    it('should handle different event types', async () => {
      const module = await import('../src/app/api/webhooks/hq/route');
      
      const eventTypes = [
        'reservation.created',
        'reservation.updated',
        'reservation.cancelled',
        'vehicle.status_changed',
        'payment.completed'
      ];

      for (const eventType of eventTypes) {
        const payload = {
          eventId: `test-${eventType}-${Date.now()}`,
          eventType,
          timestamp: new Date().toISOString(),
          data: { testData: 'value' }
        };

        const mockRequest = {
          text: async () => JSON.stringify(payload),
          headers: new Map()
        } as any;

        const response = await module.POST(mockRequest);
        expect(response.status).toBe(204);
      }
    });

    it('should handle unknown event types', async () => {
      const module = await import('../src/app/api/webhooks/hq/route');
      
      const payload = {
        eventId: 'unknown-event-123',
        eventType: 'unknown.event.type',
        timestamp: new Date().toISOString(),
        data: { testData: 'value' }
      };

      const mockRequest = {
        text: async () => JSON.stringify(payload),
        headers: new Map()
      } as any;

      const response = await module.POST(mockRequest);
      expect(response.status).toBe(204); // Should still process successfully
    });
  });

  describe('Webhook Status Endpoint', () => {
    it('should return webhook status when disabled', async () => {
      const module = await import('../src/app/api/webhooks/hq/route');
      
      const response = await module.GET();
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.enabled).toBe(false);
      expect(data.status).toBe('disabled');
      expect(data.endpoint).toBe('/api/webhooks/hq');
    });

    it('should return webhook status when enabled', async () => {
      process.env.HQ_WEBHOOKS_ENABLED = 'true';
      jest.resetModules();

      const module = await import('../src/app/api/webhooks/hq/route');
      
      const response = await module.GET();
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.enabled).toBe(true);
      expect(data.status).toBe('active');
      expect(data.signatureRequired).toBe(true); // Because HQ_WEBHOOK_SECRET is set
    });
  });

  describe('Signature Verification', () => {
    beforeEach(() => {
      process.env.HQ_WEBHOOKS_ENABLED = 'true';
      jest.resetModules();
    });

    it('should allow webhooks without signature when no secret is configured', async () => {
      delete process.env.HQ_WEBHOOK_SECRET;
      jest.resetModules();

      const module = await import('../src/app/api/webhooks/hq/route');
      
      const payload = {
        eventId: 'no-signature-123',
        eventType: 'reservation.created',
        timestamp: new Date().toISOString(),
        data: { reservationId: 'res-123' }
      };

      const mockRequest = {
        text: async () => JSON.stringify(payload),
        headers: new Map() // No signature header
      } as any;

      const response = await module.POST(mockRequest);
      expect(response.status).toBe(204);
    });

    it('should reject invalid signature when secret is configured', async () => {
      const module = await import('../src/app/api/webhooks/hq/route');
      
      const payload = {
        eventId: 'invalid-signature-123',
        eventType: 'reservation.created',
        timestamp: new Date().toISOString(),
        data: { reservationId: 'res-123' }
      };

      const mockRequest = {
        text: async () => JSON.stringify(payload),
        headers: new Map([['x-hq-signature', 'invalid-signature']])
      } as any;

      const response = await module.POST(mockRequest);
      expect(response.status).toBe(401);

      const data = await response.json();
      expect(data.error).toBe('Invalid signature');
    });
  });

  describe('CORS Support', () => {
    it('should handle OPTIONS requests', async () => {
      const module = await import('../src/app/api/webhooks/hq/route');
      const response = await module.OPTIONS();

      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST');
      expect(response.headers.get('Access-Control-Allow-Headers')).toContain('X-HQ-Signature');
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      process.env.HQ_WEBHOOKS_ENABLED = 'true';
      jest.resetModules();
    });

    it('should handle processing errors gracefully', async () => {
      const module = await import('../src/app/api/webhooks/hq/route');
      
      // Mock a request that will cause an error during processing
      const mockRequest = {
        text: async () => {
          throw new Error('Network error');
        },
        headers: new Map()
      } as any;

      const response = await module.POST(mockRequest);
      expect(response.status).toBe(500);

      const data = await response.json();
      expect(data.error).toBe('Webhook processing failed');
      expect(data.message).toContain('Network error');
    });
  });
});
