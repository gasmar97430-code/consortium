const CACHE_NAME = 'consortium-v11.5';
const ASSETS = [
  './',
  './index.html',
  './app.js',
  './manifest.json',
  'https://cdn.tailwindcss.com'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activate & Cleanup
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// Fetch Strategy: Network First for app files, Cache First for others
self.addEventListener('fetch', (event) => {
  const isCoreFile = event.request.url.includes('app.js') || event.request.url.includes('index.html');
  
  if (isCoreFile) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
