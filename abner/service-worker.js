// service-worker.js
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('app-cache').then(cache => {
            console.log('Caching app shell');
            return cache.addAll([
                '../d20.png',
                './manifest.json',
                './abner.html'
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
