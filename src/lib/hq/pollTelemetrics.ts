import { env, hqConfig } from '../env';

/**
 * HQ Rentals Telematics Polling Service
 * 
 * This module provides functionality to poll HQ Rentals for vehicle telematics data
 * such as GPS location, fuel level, mileage, engine status, etc.
 * 
 * Currently scaffolded for future implementation.
 * Set HQ_POLLING_ENABLED=true to enable polling functionality.
 * 
 * TODO: Implement actual scheduling via Vercel Cron or Cloud Scheduler
 * TODO: Replace in-memory cache with Redis or database
 * TODO: Add retry logic with exponential backoff
 * TODO: Implement proper error handling and alerting
 */

interface TelematicsData {
  vehicleId: string;
  timestamp: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  engine?: {
    status: 'running' | 'stopped' | 'idle';
    temperature?: number;
    rpm?: number;
  };
  fuel?: {
    level: number; // Percentage 0-100
    range?: number; // Miles remaining
  };
  odometer?: {
    miles: number;
    tripMiles?: number;
  };
  battery?: {
    voltage: number;
    level?: number; // For EVs, percentage 0-100
  };
  alerts?: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    timestamp: string;
  }>;
}

interface VehicleCache {
  vehicleId: string;
  lastUpdate: number;
  data: TelematicsData;
  ttl: number;
}

/**
 * In-memory cache for telematics data
 * TODO: Replace with Redis for production use
 */
const telematicsCache = new Map<string, VehicleCache>();

/**
 * Cache TTL in milliseconds (default: 5 minutes)
 */
const CACHE_TTL = 5 * 60 * 1000;

/**
 * Default polling interval from environment
 */
const POLLING_INTERVAL = env.HQ_POLLING_INTERVAL_MS || 300000; // 5 minutes default

/**
 * Fetches telematics data for a specific vehicle from HQ Rentals API
 * 
 * @param vehicleId - The vehicle identifier in HQ Rentals system
 * @returns Promise<TelematicsData | null>
 */
async function fetchVehicleTelemetrics(vehicleId: string): Promise<TelematicsData | null> {
  if (!hqConfig.isPollingEnabled()) {
    console.log('Telematics polling is disabled');
    return null;
  }

  try {
    // TODO: Replace with actual HQ Rentals API endpoint
    const apiUrl = `${env.HQ_TENANT_BASE_URL}/api/vehicles/${vehicleId}/telematics`;
    
    console.log(`📡 Fetching telematics for vehicle ${vehicleId}`);
    
    // TODO: Add proper authentication headers when HQ provides API keys
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${process.env.HQ_API_TOKEN}`, // TODO: Add when available
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: TelematicsData = await response.json();
    
    // Validate required fields
    if (!data.vehicleId || !data.timestamp) {
      throw new Error('Invalid telematics data: missing required fields');
    }

    console.log(`✅ Telematics fetched for vehicle ${vehicleId}`);
    return data;

  } catch (error) {
    console.error(`❌ Failed to fetch telematics for vehicle ${vehicleId}:`, error);
    return null;
  }
}

/**
 * Fetches telematics data for all vehicles in the fleet
 * 
 * @returns Promise<TelematicsData[]>
 */
async function fetchAllVehicleTelemetrics(): Promise<TelematicsData[]> {
  if (!hqConfig.isPollingEnabled()) {
    console.log('Telematics polling is disabled');
    return [];
  }

  try {
    // TODO: Replace with actual HQ Rentals fleet API endpoint
    const apiUrl = `${env.HQ_TENANT_BASE_URL}/api/fleet/telematics`;
    
    console.log('📡 Fetching telematics for all vehicles');
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${process.env.HQ_API_TOKEN}`, // TODO: Add when available
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: TelematicsData[] = await response.json();
    
    console.log(`✅ Telematics fetched for ${data.length} vehicles`);
    return data;

  } catch (error) {
    console.error('❌ Failed to fetch fleet telematics:', error);
    return [];
  }
}

/**
 * Updates the cache with fresh telematics data
 * 
 * @param data - Telematics data to cache
 */
function updateCache(data: TelematicsData): void {
  const now = Date.now();
  
  telematicsCache.set(data.vehicleId, {
    vehicleId: data.vehicleId,
    lastUpdate: now,
    data: data,
    ttl: now + CACHE_TTL,
  });
}

/**
 * Retrieves cached telematics data for a vehicle
 * 
 * @param vehicleId - Vehicle identifier
 * @returns TelematicsData | null
 */
export function getCachedTelemetrics(vehicleId: string): TelematicsData | null {
  const cached = telematicsCache.get(vehicleId);
  
  if (!cached) {
    return null;
  }
  
  // Check if cache has expired
  if (Date.now() > cached.ttl) {
    telematicsCache.delete(vehicleId);
    return null;
  }
  
  return cached.data;
}

/**
 * Gets all cached telematics data
 * 
 * @returns TelematicsData[]
 */
export function getAllCachedTelemetrics(): TelematicsData[] {
  const now = Date.now();
  const result: TelematicsData[] = [];
  
  // Clean up expired entries and collect valid data
  const keysToDelete: string[] = [];
  telematicsCache.forEach((cached, vehicleId) => {
    if (now > cached.ttl) {
      keysToDelete.push(vehicleId);
    } else {
      result.push(cached.data);
    }
  });
  
  keysToDelete.forEach(key => {
    telematicsCache.delete(key);
  });
  
  return result;
}

/**
 * Polls telematics data for a specific vehicle and updates cache
 * 
 * @param vehicleId - Vehicle identifier
 * @returns Promise<TelematicsData | null>
 */
export async function pollVehicleTelemetrics(vehicleId: string): Promise<TelematicsData | null> {
  if (!hqConfig.isPollingEnabled()) {
    return null;
  }

  const data = await fetchVehicleTelemetrics(vehicleId);
  
  if (data) {
    updateCache(data);
  }
  
  return data;
}

/**
 * Polls telematics data for all vehicles and updates cache
 * 
 * @returns Promise<TelematicsData[]>
 */
export async function pollAllVehicleTelemetrics(): Promise<TelematicsData[]> {
  if (!hqConfig.isPollingEnabled()) {
    return [];
  }

  const allData = await fetchAllVehicleTelemetrics();
  
  // Update cache for each vehicle
  allData.forEach(data => {
    updateCache(data);
  });
  
  return allData;
}

/**
 * Cleans up expired cache entries
 * Should be called periodically to prevent memory leaks
 */
export function cleanupCache(): void {
  const now = Date.now();
  let cleanedCount = 0;
  
  const keysToDelete: string[] = [];
  telematicsCache.forEach((cached, vehicleId) => {
    if (now > cached.ttl) {
      keysToDelete.push(vehicleId);
      cleanedCount++;
    }
  });
  
  keysToDelete.forEach(key => {
    telematicsCache.delete(key);
  });
  
  if (cleanedCount > 0) {
    console.log(`🧹 Cleaned up ${cleanedCount} expired telematics cache entries`);
  }
}

/**
 * Gets cache statistics
 * 
 * @returns Object with cache statistics
 */
export function getCacheStats(): {
  totalEntries: number;
  expiredEntries: number;
  oldestEntry: string | null;
  newestEntry: string | null;
} {
  const now = Date.now();
  let expiredCount = 0;
  let oldestTime = Infinity;
  let newestTime = 0;
  let oldestVehicle: string | null = null;
  let newestVehicle: string | null = null;
  
  telematicsCache.forEach((cached, vehicleId) => {
    if (now > cached.ttl) {
      expiredCount++;
    }
    
    if (cached.lastUpdate < oldestTime) {
      oldestTime = cached.lastUpdate;
      oldestVehicle = vehicleId;
    }
    
    if (cached.lastUpdate > newestTime) {
      newestTime = cached.lastUpdate;
      newestVehicle = vehicleId;
    }
  });
  
  return {
    totalEntries: telematicsCache.size,
    expiredEntries: expiredCount,
    oldestEntry: oldestVehicle,
    newestEntry: newestVehicle,
  };
}

/**
 * TODO: Implement scheduled polling job
 * 
 * This function should be called by a scheduler (Vercel Cron, Cloud Scheduler, etc.)
 * to periodically poll telematics data for all vehicles.
 * 
 * Example Vercel Cron configuration (vercel.json):
 * {
 *   "crons": [
 *     {
 *       "path": "/api/cron/poll-telematics",
 *       "schedule": "* /5 * * * *"
 *     }
 *   ]
 * }
 */
export async function scheduledTelematicsJob(): Promise<void> {
  if (!hqConfig.isPollingEnabled()) {
    console.log('⏸️  Scheduled telematics polling is disabled');
    return;
  }

  console.log('🕐 Starting scheduled telematics polling job');
  
  try {
    const startTime = Date.now();
    
    // Poll all vehicle telematics
    const data = await pollAllVehicleTelemetrics();
    
    // Clean up expired cache entries
    cleanupCache();
    
    const duration = Date.now() - startTime;
    const stats = getCacheStats();
    
    console.log(`✅ Telematics polling job completed in ${duration}ms`);
    console.log(`   - Vehicles polled: ${data.length}`);
    console.log(`   - Cache entries: ${stats.totalEntries}`);
    console.log(`   - Expired entries: ${stats.expiredEntries}`);
    
  } catch (error) {
    console.error('❌ Scheduled telematics polling job failed:', error);
  }
}

// Log configuration on module load
if (typeof window === 'undefined') { // Server-side only
  if (hqConfig.isPollingEnabled()) {
    console.log('📡 HQ Telematics Polling Enabled');
    console.log(`   Polling interval: ${POLLING_INTERVAL}ms`);
    console.log(`   Cache TTL: ${CACHE_TTL}ms`);
  } else {
    console.log('⏸️  HQ Telematics Polling Disabled');
    console.log('   Set HQ_POLLING_ENABLED=true to enable');
  }
}
