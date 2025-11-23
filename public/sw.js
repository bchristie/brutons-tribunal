// Service Worker for Brutons Tribunal PWA
const CACHE_NAME = 'bt-pwa-v1';
const DATA_CACHE_NAME = 'bt-pwa-data-v1';

// Static resources to cache
const urlsToCache = [
  '/pwa',
  '/manifest.json',
  '/_next/static/css/app/globals.css'
];
  '/mobile',
  '/mobile/manifest.json',
  '/_next/static/css/app/globals.css'
];

// Critical data endpoints to cache
const criticalApiEndpoints = [
  '/api/user/profile',
  '/api/dashboard/summary',
  '/api/settings'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  
  // Handle API routes differently
  if (requestUrl.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(event.request));
    return;
  }

  // Only handle PWA page requests for static caching
  if (!requestUrl.pathname.startsWith('/pwa')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  const cache = await caches.open(DATA_CACHE_NAME);
  const url = new URL(request.url);
  
  // Check if this is a critical endpoint that should be cached aggressively
  const isCritical = criticalApiEndpoints.some(endpoint => 
    url.pathname.startsWith(endpoint)
  );
  
  try {
    // Try network first for fresh data
    const networkResponse = await fetch(request);
    
    // Cache successful GET requests
    if (networkResponse.ok && request.method === 'GET') {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed - try cache as fallback for GET requests
    if (request.method === 'GET') {
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        // Add a header to indicate this is cached data
        const response = cachedResponse.clone();
        response.headers.set('X-Served-From', 'cache');
        return response;
      }
    }
    
    // For critical endpoints, return a more helpful offline response
    if (isCritical) {
      return new Response(
        JSON.stringify({ 
          error: 'offline',
          message: 'Showing cached data may be available',
          offline: true
        }),
        {
          status: 200, // Return 200 so app can handle gracefully
          statusText: 'OK',
          headers: { 
            'Content-Type': 'application/json',
            'X-Served-From': 'offline-fallback'
          }
        }
      );
    }
    
    // Return a meaningful offline response for failed API calls
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'This feature requires an internet connection',
        offline: true
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME, DATA_CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!currentCaches.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});