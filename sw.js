// =======================================================
// MOTOR DE NOTIFICAÇÕES (PUSHALERT)
// =======================================================
importScripts("https://cdn.pushalert.co/sw-89921.js");

// =======================================================
// CACHE DO PWA DA IGREJA (BBNJ)
// =======================================================
const CACHE_NAME = "bbnj-cache-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/logo-dourada.png",
  "/favicon.png"
];

// =========================
// INSTALL (instala o cache)
// =========================
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// =======================================================
// FETCH (INTERCEPTA COM FILTRO PARA NÃO TRAVAR O PUSH)
// =======================================================
self.addEventListener("fetch", event => {
  const url = event.request.url;

  // SE FOR REQUISIÇÃO DO PUSHALERT OU GOOGLE APIS, IGNORE O CACHE E DEIXE PASSAR DIRETO
  if (url.includes("pushalert") || url.includes("google") || url.includes("gstatic")) {
    return; // Não faz nada, deixa o navegador resolver direto com a internet
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

// =========================
// ACTIVATE (limpa cache antigo)
// =========================
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
    })
  );
});
