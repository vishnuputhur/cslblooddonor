const CACHE_NAME = 'csl-blood-v3'; // മാറ്റങ്ങൾ വരുത്തുമ്പോൾ v3, v4 എന്നിങ്ങനെ മാറ്റുക
const assets = [
  '/',
  '/index.html',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'
];

// 1. ഇൻസ്റ്റാൾ ചെയ്യുമ്പോൾ പുതിയ ഫയലുകൾ ബാക്ക്ഗ്രൗണ്ടിൽ എടുക്കാനും പഴയതിനെ ഉടൻ മാറ്റാനും
self.addEventListener('install', event => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// 2. ആക്റ്റീവ് ആകുമ്പോൾ പഴയ കേച്ച് ഫയലുകൾ ഡിലീറ്റ് ചെയ്യാനും നിയന്ത്രണം ഏറ്റെടുക്കാനും
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Old blood-app cache cleared');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); 
});

// 3. ഫയലുകൾ ആവശ്യപ്പെടുമ്പോൾ കേച്ചിൽ നിന്ന് നൽകാൻ
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
