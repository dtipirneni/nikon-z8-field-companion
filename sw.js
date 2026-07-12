const CACHE = "tanzania-companion-v23-1-1";
const CORE = [
  "./","./index.html","./trip.html","./shoot.html","./field-guide.html","./zanzibar.html","./more.html",
  "./css/styles.css?v=23.1","./js/app.js?v=23.1","./manifest.webmanifest","./icon.svg","./assets/species/lion.svg","./assets/species/elephant.svg","./assets/species/cheetah.svg","./assets/species/leopard.svg","./assets/species/wildebeest.svg","./assets/species/zebra.svg","./assets/species/giraffe.svg","./assets/species/buffalo.svg","./assets/species/hyena.svg","./assets/species/rhino.svg","./assets/species/hippo.svg","./assets/species/roller.svg","./assets/species/secretary.svg","./assets/species/martial.svg","./assets/species/kori.svg","./assets/species/hornbill.svg","./assets/species/flamingo.svg","./assets/species/fish-eagle.svg","./assets/species/red-colobus.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(async () => (await caches.match(event.request)) || caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      const network = fetch(event.request)
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then(cache => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});