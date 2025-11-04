import { z } from 'zod';

// HQ Rentals environment schema
const hqEnvSchema = z.object({
  // HQ Rentals configuration
  HQ_TENANT_BASE_URL: z.string().url().describe('Base URL for HQ Rentals tenant (e.g., https://tenant.hqrentals.app)'),
  HQ_ALLOWED_IFRAME_HOSTS: z.string().default('*.hqrentals.app').describe('Allowed iframe hosts for CSP'),
  PUBLIC_RESERVATION_PAGE_URL: z.string().url().describe('Public URL where the Reservation Engine will live'),
  
  // HQ Rentals integration configuration
  HQ_INTEGRATOR_URL: z.string().default('https://tna-rentals-llc.hqrentals.app/public/car-rental/integrations').describe('HQ integrator base URL'),
  HQ_BRAND_ID: z.string().default('4yfuocht-z6gc-ibnk-spdz-jaod9lfwqifk').describe('HQ brand identifier'),
  HQ_SCRIPT_URL: z.string().default('https://tna-rentals-llc.hqrentals.app/public/car-rental/integrations/assets/integrator').describe('HQ integrator script URL'),
  
  // Optional webhook configuration
  HQ_WEBHOOK_SECRET: z.string().optional().describe('Secret for webhook signature verification'),
  HQ_WEBHOOKS_ENABLED: z.string().default('false').transform(val => val === 'true').describe('Enable webhook endpoints'),
  
  // Optional polling configuration
  HQ_POLLING_ENABLED: z.string().default('false').transform(val => val === 'true').describe('Enable telematics polling'),
  HQ_POLLING_INTERVAL_MS: z.string().default('300000').transform(val => parseInt(val, 10)).describe('Polling interval in milliseconds'),
});

// Existing environment variables (preserve existing config)
const existingEnvSchema = z.object({
  // Booqable (existing)
  BOOQABLE_API_KEY: z.string().optional(),
  BOOQABLE_SHOP_ID: z.string().optional(),
  BOOQABLE_API_URL: z.string().default('https://api.booqable.com/v1'),
  NEXT_PUBLIC_BOOQABLE_SHOP_URL: z.string().optional(),
  
  // AI Services (existing)
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  REPLICATE_API_TOKEN: z.string().optional(),
  DEEPGRAM_API_KEY: z.string().optional(),
});

// Combined environment schema
const envSchema = hqEnvSchema.merge(existingEnvSchema);

type Env = z.infer<typeof envSchema>;

/**
 * Validates and parses environment variables
 * Returns defaults for missing values to prevent runtime errors
 */
function validateEnv(): Env {
  // Skip validation during build process or testing
  if (process.env.NODE_ENV === 'test' || process.env.SKIP_ENV_VALIDATION === 'true') {
    return {
      HQ_TENANT_BASE_URL: 'https://tna-rentals-llc.hqrentals.app',
      HQ_ALLOWED_IFRAME_HOSTS: '*.hqrentals.app',
      PUBLIC_RESERVATION_PAGE_URL: 'https://example.com/reserve',
      HQ_INTEGRATOR_URL: 'https://tna-rentals-llc.hqrentals.app/public/car-rental/integrations',
      HQ_BRAND_ID: '4yfuocht-z6gc-ibnk-spdz-jaod9lfwqifk',
      HQ_SCRIPT_URL: 'https://tna-rentals-llc.hqrentals.app/public/car-rental/integrations/assets/integrator',
      HQ_WEBHOOK_SECRET: undefined,
      HQ_WEBHOOKS_ENABLED: false,
      HQ_POLLING_ENABLED: false,
      HQ_POLLING_INTERVAL_MS: 300000,
      BOOQABLE_API_KEY: undefined,
      BOOQABLE_SHOP_ID: undefined,
      BOOQABLE_API_URL: 'https://api.booqable.com/v1',
      NEXT_PUBLIC_BOOQABLE_SHOP_URL: undefined,
      OPENAI_API_KEY: undefined,
      ANTHROPIC_API_KEY: undefined,
      REPLICATE_API_TOKEN: undefined,
      DEEPGRAM_API_KEY: undefined,
    };
  }

  // Try to parse environment, but provide defaults for required fields if missing
  const result = envSchema.safeParse(process.env);
  
  if (result.success) {
    return result.data;
  }
  
  // Log validation errors but don't crash the app
  console.warn('⚠️  HQ Rentals environment validation issues:');
  result.error.issues.forEach(issue => {
    if (issue.code === 'invalid_type') {
      const field = issue.path.join('.');
      console.warn(`  Missing: ${field}`);
    }
  });
  
  // Return safe defaults
  return {
    HQ_TENANT_BASE_URL: process.env.HQ_TENANT_BASE_URL || 'https://tna-rentals-llc.hqrentals.app',
    HQ_ALLOWED_IFRAME_HOSTS: process.env.HQ_ALLOWED_IFRAME_HOSTS || '*.hqrentals.app',
    PUBLIC_RESERVATION_PAGE_URL: process.env.PUBLIC_RESERVATION_PAGE_URL || 'https://example.com/reserve',
    HQ_INTEGRATOR_URL: process.env.HQ_INTEGRATOR_URL || 'https://tna-rentals-llc.hqrentals.app/public/car-rental/integrations',
    HQ_BRAND_ID: process.env.HQ_BRAND_ID || '4yfuocht-z6gc-ibnk-spdz-jaod9lfwqifk',
    HQ_SCRIPT_URL: process.env.HQ_SCRIPT_URL || 'https://tna-rentals-llc.hqrentals.app/public/car-rental/integrations/assets/integrator',
    HQ_WEBHOOK_SECRET: process.env.HQ_WEBHOOK_SECRET,
    HQ_WEBHOOKS_ENABLED: process.env.HQ_WEBHOOKS_ENABLED === 'true',
    HQ_POLLING_ENABLED: process.env.HQ_POLLING_ENABLED === 'true',
    HQ_POLLING_INTERVAL_MS: parseInt(process.env.HQ_POLLING_INTERVAL_MS || '300000', 10),
    BOOQABLE_API_KEY: process.env.BOOQABLE_API_KEY,
    BOOQABLE_SHOP_ID: process.env.BOOQABLE_SHOP_ID,
    BOOQABLE_API_URL: process.env.BOOQABLE_API_URL || 'https://api.booqable.com/v1',
    NEXT_PUBLIC_BOOQABLE_SHOP_URL: process.env.NEXT_PUBLIC_BOOQABLE_SHOP_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
    DEEPGRAM_API_KEY: process.env.DEEPGRAM_API_KEY,
  };
}

// Export validated environment
export const env = validateEnv();

/**
 * Validates that required HQ environment variables are properly set
 * Use this in API routes that require HQ configuration
 */
export function validateHQConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // We now have a real HQ tenant URL, so only check if it's completely missing
  if (!env.HQ_TENANT_BASE_URL) {
    errors.push('HQ_TENANT_BASE_URL not configured');
  }
  
  if (!env.PUBLIC_RESERVATION_PAGE_URL || env.PUBLIC_RESERVATION_PAGE_URL === 'https://example.com/reserve') {
    errors.push('PUBLIC_RESERVATION_PAGE_URL not configured');
  }
  
  try {
    new URL(env.HQ_TENANT_BASE_URL);
  } catch {
    errors.push('HQ_TENANT_BASE_URL is not a valid URL');
  }
  
  try {
    new URL(env.PUBLIC_RESERVATION_PAGE_URL);
  } catch {
    errors.push('PUBLIC_RESERVATION_PAGE_URL is not a valid URL');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Export types for use in other files
export type { Env };

// Helper functions for HQ configuration
export const hqConfig = {
  getTenantName: (): string => {
    const url = new URL(env.HQ_TENANT_BASE_URL);
    return url.hostname.split('.')[0];
  },
  
  getAllowedIframeHosts: (): string[] => {
    return env.HQ_ALLOWED_IFRAME_HOSTS.split(',').map(host => host.trim());
  },
  
  isWebhooksEnabled: (): boolean => {
    return env.HQ_WEBHOOKS_ENABLED;
  },
  
  isPollingEnabled: (): boolean => {
    return env.HQ_POLLING_ENABLED;
  },
  
  getWebhookSecret: (): string | undefined => {
    return env.HQ_WEBHOOK_SECRET;
  }
};

// Log configuration status (non-sensitive info only)
if (typeof window === 'undefined') { // Server-side only
  console.log('🚀 HQ Rentals Backend Integration Loaded');
  console.log(`   Tenant: ${hqConfig.getTenantName()}`);
  console.log(`   Reservation Page: ${env.PUBLIC_RESERVATION_PAGE_URL}`);
  console.log(`   Webhooks: ${hqConfig.isWebhooksEnabled() ? 'Enabled' : 'Disabled'}`);
  console.log(`   Polling: ${hqConfig.isPollingEnabled() ? 'Enabled' : 'Disabled'}`);
}
