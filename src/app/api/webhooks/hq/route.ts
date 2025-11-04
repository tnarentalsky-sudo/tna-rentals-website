import { NextRequest, NextResponse } from 'next/server';
import { env, hqConfig } from '@/lib/env';
import crypto from 'crypto';

/**
 * HQ Rentals Webhook Endpoint
 * 
 * Handles incoming webhooks from HQ Rentals system
 * Currently disabled by default - set HQ_WEBHOOKS_ENABLED=true to activate
 * 
 * Webhook events may include:
 * - reservation.created
 * - reservation.updated  
 * - reservation.cancelled
 * - vehicle.status_changed
 * - payment.completed
 */

interface WebhookPayload {
  eventId: string;
  eventType: string;
  timestamp: string;
  data: Record<string, any>;
  metadata?: Record<string, any>;
}

/**
 * In-memory cache for idempotency checking
 * TODO: Replace with Redis or database in production
 */
const processedEvents = new Map<string, { timestamp: number; hash: string }>();

/**
 * Cleanup old processed events (keep last 24 hours)
 */
function cleanupProcessedEvents(): void {
  const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
  
  const keysToDelete: string[] = [];
  processedEvents.forEach((value, key) => {
    if (value.timestamp < twentyFourHoursAgo) {
      keysToDelete.push(key);
    }
  });
  
  keysToDelete.forEach(key => {
    processedEvents.delete(key);
  });
}

/**
 * Generate hash for idempotency check
 */
function generateEventHash(payload: WebhookPayload): string {
  const hashString = `${payload.eventId}|${payload.timestamp}|${payload.eventType}`;
  return crypto.createHash('sha256').update(hashString).digest('hex');
}

/**
 * Check if event has already been processed (idempotency)
 */
function isEventProcessed(hash: string): boolean {
  return processedEvents.has(hash);
}

/**
 * Mark event as processed
 */
function markEventProcessed(hash: string, eventId: string): void {
  processedEvents.set(hash, {
    timestamp: Date.now(),
    hash: hash
  });
  
  // Cleanup old events periodically
  if (processedEvents.size > 1000) {
    cleanupProcessedEvents();
  }
}

/**
 * Verify webhook signature (placeholder implementation)
 * TODO: Implement actual signature verification when HQ provides details
 */
function verifyWebhookSignature(payload: string, signature: string, secret?: string): boolean {
  if (!secret || !signature) {
    console.warn('Webhook signature verification skipped - no secret configured');
    return true; // Allow unsigned webhooks in development
  }
  
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    // Compare signatures in constant time to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    console.error('Webhook signature verification error:', error);
    return false;
  }
}

/**
 * Safely log webhook payload with redaction of sensitive data
 */
function logWebhookPayload(payload: WebhookPayload): void {
  const safePayload = {
    eventId: payload.eventId,
    eventType: payload.eventType,
    timestamp: payload.timestamp,
    dataKeys: Object.keys(payload.data || {}),
    // Redact sensitive fields
    data: Object.fromEntries(
      Object.entries(payload.data || {}).map(([key, value]) => {
        const sensitiveFields = ['email', 'phone', 'ssn', 'license', 'payment', 'card'];
        if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
          return [key, '[REDACTED]'];
        }
        return [key, value];
      })
    )
  };
  
  console.log('📨 HQ Webhook Received:', JSON.stringify(safePayload, null, 2));
}

/**
 * Process webhook payload
 * TODO: Implement actual business logic for each event type
 */
async function processWebhook(payload: WebhookPayload): Promise<void> {
  switch (payload.eventType) {
    case 'reservation.created':
      console.log(`🎉 New reservation created: ${payload.data.reservationId}`);
      // TODO: Send confirmation email, update internal systems, etc.
      break;
      
    case 'reservation.updated':
      console.log(`📝 Reservation updated: ${payload.data.reservationId}`);
      // TODO: Update local cache, notify customer if needed
      break;
      
    case 'reservation.cancelled':
      console.log(`❌ Reservation cancelled: ${payload.data.reservationId}`);
      // TODO: Process refund, update availability, send notifications
      break;
      
    case 'vehicle.status_changed':
      console.log(`🚗 Vehicle status changed: ${payload.data.vehicleId} -> ${payload.data.status}`);
      // TODO: Update vehicle availability, maintenance scheduling
      break;
      
    case 'payment.completed':
      console.log(`💳 Payment completed: ${payload.data.paymentId}`);
      // TODO: Update payment status, trigger fulfillment process
      break;
      
    default:
      console.log(`❓ Unknown webhook event type: ${payload.eventType}`);
      // TODO: Log unknown events for investigation
      break;
  }
}

/**
 * POST /api/webhooks/hq
 * 
 * Handles incoming webhooks from HQ Rentals
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  // Check if webhooks are enabled
  if (!hqConfig.isWebhooksEnabled()) {
    return NextResponse.json({
      error: 'Webhooks disabled',
      message: 'Set HQ_WEBHOOKS_ENABLED=true to enable webhook processing',
      timestamp: new Date().toISOString()
    }, { 
      status: 501 // Not Implemented
    });
  }
  
  try {
    // Get raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get('x-hq-signature') || '';
    
    // Verify webhook signature if secret is configured
    const webhookSecret = hqConfig.getWebhookSecret();
    if (!verifyWebhookSignature(body, signature, webhookSecret)) {
      console.warn('⚠️  Invalid webhook signature');
      return NextResponse.json({
        error: 'Invalid signature',
        timestamp: new Date().toISOString()
      }, { 
        status: 401 
      });
    }
    
    // Parse webhook payload
    let payload: WebhookPayload;
    try {
      payload = JSON.parse(body);
    } catch (error) {
      console.error('Invalid webhook JSON:', error);
      return NextResponse.json({
        error: 'Invalid JSON payload',
        timestamp: new Date().toISOString()
      }, { 
        status: 400 
      });
    }
    
    // Validate required fields
    if (!payload.eventId || !payload.eventType || !payload.timestamp) {
      return NextResponse.json({
        error: 'Missing required fields',
        message: 'eventId, eventType, and timestamp are required',
        timestamp: new Date().toISOString()
      }, { 
        status: 400 
      });
    }
    
    // Check for duplicate events (idempotency)
    const eventHash = generateEventHash(payload);
    if (isEventProcessed(eventHash)) {
      console.log(`🔄 Duplicate webhook event ignored: ${payload.eventId}`);
      return NextResponse.json({
        message: 'Event already processed',
        eventId: payload.eventId,
        timestamp: new Date().toISOString()
      }, { 
        status: 200 
      });
    }
    
    // Log the webhook payload (with sensitive data redacted)
    logWebhookPayload(payload);
    
    // Process the webhook
    await processWebhook(payload);
    
    // Mark event as processed
    markEventProcessed(eventHash, payload.eventId);
    
    // Return success response
    return new NextResponse(null, { 
      status: 204 // No Content - webhook processed successfully
    });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    
    return NextResponse.json({
      error: 'Webhook processing failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { 
      status: 500 
    });
  }
}

/**
 * GET /api/webhooks/hq
 * 
 * Returns webhook endpoint status and configuration
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    enabled: hqConfig.isWebhooksEnabled(),
    endpoint: '/api/webhooks/hq',
    methods: ['POST'],
    signatureRequired: !!hqConfig.getWebhookSecret(),
    processedEvents: processedEvents.size,
    status: hqConfig.isWebhooksEnabled() ? 'active' : 'disabled',
    lastCleanup: new Date().toISOString()
  });
}

/**
 * Handle preflight CORS requests
 */
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-HQ-Signature',
    },
  });
}
