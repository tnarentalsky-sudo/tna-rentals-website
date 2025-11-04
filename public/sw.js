// Simple service worker for caching HQ Rentals assets
const CACHE_NAME = 'hq-rentals-cache-v1';
const HQ_ASSETS = [
  'https://tna-rentals-llc.hqrentals.app/public/car-rental/integrations/assets/integrator'
];

// Install event - cache HQ assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching HQ Rentals assets');
        return cache.addAll(HQ_ASSETS);
      })
      .catch((error) => {
        console.warn('Failed to cache HQ assets:', error);
      })
  );
  self.skipWaiting();
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  // Only handle HQ Rentals requests
  if (event.request.url.includes('hqrentals.app')) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Return cached version or fetch from network
          return response || fetch(event.request).then((fetchResponse) => {
            // Cache successful responses
            if (fetchResponse.ok) {
              const responseClone = fetchResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseClone);
                });
            }
            return fetchResponse;
          });
        })
        .catch(() => {
          // Return a basic error response if both cache and network fail
          return new Response('HQ Rentals temporarily unavailable', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        })
    );
  }
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName.startsWith('hq-rentals-cache-')) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
