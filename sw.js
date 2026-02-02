const CACHE_NAME = 'csl-blood-v4'; // മാറ്റങ്ങൾ വരുത്തുമ്പോൾ ഇത് v3, v4 എന്നിങ്ങനെ മാറ്റുക
const assets = [
  './',
  './index.html',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'
];

// ഇൻസ്റ്റാൾ ചെയ്യുമ്പോൾ പുതിയ ഫയലുകൾ ഉടൻ എടുക്കാൻ
self.addEventListener('install', event => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// ആക്റ്റീവ് ആകുമ്പോൾ പഴയ കേച്ച് ഫയലുകൾ നീക്കം ചെയ്യാൻ
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); 
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
