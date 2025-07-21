const CACHE_NAME = 'clip-it-tycoon-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.tsx',
  // If you have a compiled JS output like main.js, add that too
  // Add CSS files if any
  '/manifest.json',
  // Add your icons here if you have them, example:
  // '/icon-192.png',
  // '/icon-512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
