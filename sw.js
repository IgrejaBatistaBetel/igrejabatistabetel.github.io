// =======================================================
// MOTOR DE NOTIFICAÇÕES (PUSHALERT) - LINK OFICIAL NUMÉRICO
// =======================================================
try {
  importScripts("https://cdn.pushalert.co/sw-89921.js");
} catch (e) {
  console.error("Falha ao importar PushAlert:", e);
}

// =======================================================
// CACHE DO PWA DA IGREJA (BBNJ)
// =======================================================
const CACHE_NAME = "bbnj-cache-v4";

const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./logo-dourada.png",
  "./favicon.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.status === 200) {
          const responseCopy = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseCopy);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
