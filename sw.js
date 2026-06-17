// =======================================================
// MOTOR DE NOTIFICAÇÕES (PUSHALERT) - CHAVE CORRETA UNIFICADA
// =======================================================
importScripts("https://cdn.pushalert.co/sw_ea39b5dc249569fab7af26e56b92b8d2.js");

// =======================================================
// CACHE DO PWA DA IGREJA (BBNJ) - VERSÃO ATUALIZADA
// =======================================================
const CACHE_NAME = "bbnj-cache-v2"; // Mudamos para v2 para forçar o reset do cache antigo

const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/logo-dourada.png",
  "/favicon.png"
];

// =========================
// INSTALL (Instala o cache inicial)
// =========================
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Força o novo sw a assumir o controle imediatamente
  );
});

// =========================
// ACTIVATE (Limpa o cache v1 antigo de forma agressiva)
// =========================
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log("Removendo cache antigo:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // Ativa o sw em todas as abas e apps abertos na hora
  );
});

// =========================
// FETCH (Estratégia Network-First: Busca na internet primeiro)
// =========================
self.addEventListener("fetch", event => {
  // Não intercepta requisições do PushAlert nem da API do Google Sheets
  if (event.request.url.includes("pushalert.co") || event.request.url.includes("script.google.com")) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Se a internet respondeu, atualiza o cache com a cópia nova
        if (response && response.status === 200) {
          const responseCopy = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseCopy);
          });
        }
        return response;
      })
      .catch(() => {
        // Se a internet falhar (offline), busca o arquivo no cache
        return caches.match(event.request);
      })
  );
});
