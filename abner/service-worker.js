// service-worker.js
const CACHE_NAME = 'appCache1794171224337';

const ASSETS_TO_CACHE = [
  '/dndapp/favicon.ico',
  '/dndapp/d20-192x192.png',
  '/dndapp/d20-512x512.png',
  '/dndapp/abner/manifest.json',
  '/dndapp/abner/abner.html'
];

// 1. Install Event: Cache app shell and force immediate activation
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching app shell');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Activate Event: Clean up old versions of the cache and claim clients
self.addEventListener('activate', event => {
  event.waitUntil(
    deleteOldCaches().then(() => self.clients.claim())
  );
});

// 3. Fetch Event Router
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  if (isHtmlRequest(event.request)) {
    event.respondWith(handleHtmlRequest(event.request));
  } else {
    event.respondWith(handleAssetRequest(event.request));
  }
});

// --- Helper Functions (Max 3 levels of indentation) ---

async function deleteOldCaches() {
  const cacheNames = await caches.keys();
  const deletions = cacheNames.map(cache => {
    if (cache !== CACHE_NAME) {
      console.log('Deleting old cache:', cache);
      return caches.delete(cache);
    }
  });
  return Promise.all(deletions);
}

function isHtmlRequest(request) {
  const acceptHeader = request.headers.get('accept');
  return acceptHeader && acceptHeader.includes('text/html');
}

async function handleHtmlRequest(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    return caches.match(request);
  }
}

async function handleAssetRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  const networkResponse = await fetch(request);
  const cache = await caches.open(CACHE_NAME);
  cache.put(request, networkResponse.clone());
  return networkResponse;
}