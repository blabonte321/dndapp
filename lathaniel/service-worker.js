// service-worker.js
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('app-cache').then(cache => {
            console.log('Caching app shell');
            return cache.addAll([
                '../favicon.ico',
                '../d20-192x192.png',
                '../d20-512x512.png',
                './manifest.json',
                './lathaniel.html'
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(        
        caches.match(event.request).then(response => {
            console.log('Fetching resource: ' + event.request.url);
            return response || fetch(event.request);
        })
    );
});
