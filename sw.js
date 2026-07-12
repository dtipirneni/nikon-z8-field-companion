const CACHE = 'z8-tanzania-v13';
const CORE = [
  "./",
  "./index.html",
  "./trip.html",
  "./shoot.html",
  "./wildlife.html",
  "./more.html",
  "./css/styles.css",
  "./js/app.js",
  "./manifest.webmanifest",
  "./icon.svg",
  "./assets/exposure-triangle-purple.png",
  "./assets/photography-cheat-sheet.jpeg",
  "./assets/exposure-triangle-green.png",
  "./assets/tipping-sheet.png",
  "./assets/as-salaam-flight-confirmation.png",
  "./documents/zanzibar-insurance.pdf"
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const isPageNavigation = event.request.mode === 'navigate';

  if (isPageNavigation) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put('./index.html', copy));
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      const networkFetch = fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});
