// =======================================================
// MOTOR DE NOTIFICAÇÕES (PUSHALERT) - OBRIGATÓRIO NO TOPO
// =======================================================
importScripts("https://cdn.pushalert.co/sw-89921.js");

// =======================================================
// CACHE DO PWA DA IGREJA (BBNJ)
// =======================================================
const CACHE_NAME = "bbnj-cache-v2"; // Mudamos a versão para forçar o Android a resetar

const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js?v=2.1", // Alinhado com a versão do seu index.html
  "./logo-dourada.png",
  "./favicon.png"
];

// =========================
// INSTALL (Instala o PWA)
// =========================
self.addEventListener("install", event => {
  self.skipWaiting(); // Força o Service Worker novo a chutar o velho na hora
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// =============================================================
// FETCH (ESTRATÉGIA: NETWORK-FIRST - ESSENCIAL PARA NOTIFICAÇÕES)
// =============================================================
self.addEventListener("fetch", event => {
  // Ignora requisições do PushAlert e da API do Google Sheets para não quebrar a integração
  if (
    event.request.url.includes("pushalert.co") || 
    event.request.url.includes("script.google.com")
  ) {
    return; // Deixa passar direto pela internet, sem enfiar no cache
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Se a internet estiver boa, atualiza o cache com a cópia nova e entrega pro usuário
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // SE A INTERNET FALHAR (SÓ EM MODO OFFLINE), ele busca o que tem guardado no cache
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fallback básico caso nem o cache exista
          if (event.request.mode === 'navigate') {
            return caches.match("./index.html");
          }
        });
      })
  );
});

// ==========================================
// ACTIVATE (Deleta o lixo e o cache travado)
// ==========================================
self.addEventListener("activate", event => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(), // Assume o controle do site imediatamente
      caches.keys().then(keys => {
        return Promise.all(
          keys.map(key => {
            if (key !== CACHE_NAME) {
              console.log("Removendo cache antigo travado:", key);
              return caches.delete(key);
            }
          })
        );
      })
    ])
  );
});
