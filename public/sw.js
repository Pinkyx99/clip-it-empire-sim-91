const CACHE_NAME = 'clip-it-tycoon-v1.0.0';
const urlsToCache = [
  '/',
  '/src/main.tsx',
  '/src/index.css',
  '/src/App.tsx',
  '/src/pages/Index.tsx',
  '/src/hooks/useGameData.ts',
  '/src/data/streamers.ts',
  '/src/components/PlayerStats.tsx',
  '/src/components/AppNavigation.tsx',
  '/src/components/apps/HomeApp.tsx',
  '/src/components/apps/TwitchApp.tsx',
  '/src/components/apps/CapCutApp.tsx',
  '/src/components/apps/TikTokApp.tsx',
  '/src/components/apps/WhopApp.tsx',
  '/src/assets/ishowspeed.jpg',
  '/src/assets/xqc.jpg',
  '/src/assets/kaicenat.jpg',
  '/src/assets/pokimane.jpg',
  '/src/assets/ninja.jpg',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('Cache install failed:', error);
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request).catch(() => {
          // If both cache and network fail, return offline page
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});