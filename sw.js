// =======================================================
// MOTOR DE NOTIFICAÇÕES (PUSHALERT) - OBRIGATÓRIO NO TOPO
// =======================================================
importScripts("https://cdn.pushalert.co/sw-89921.js");

// =======================================================
// CACHE DO PWA DA IGREJA (BBNJ) - VERSÃO ULTRA OFFLINE
// =======================================================
const CACHE_NAME = "bbnj-cache-v4"; // Avançamos a versão para limpar os arquivos velhos

const urlsToCache = [
  "./",
  "./index.html",
  "./projetos.html",
  "./style.css",
  "./script.js?v=2.4", // Alinhado com a versão atual do seu index.html
  "./logo-dourada.png",
  "./favicon.png"
];

// ==========================================
// INSTALL - Guarda a estrutura no dispositivo
// ==========================================
self.addEventListener("install", event => {
  self.skipWaiting(); // Força o Service Worker novo a chutar o velho na hora
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("PWA: Guardando estrutura essencial para uso offline...");
      return cache.addAll(urlsToCache);
    })
  );
});

// ==========================================
// ACTIVATE - Limpa caches velhos da memória
// ==========================================
self.addEventListener("activate", event => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(), // Assume o controle do site imediatamente
      caches.keys().then(keys => {
        return Promise.all(
          keys.map(key => {
            if (key !== CACHE_NAME) {
              console.log("Removendo cache antigo:", key);
              return caches.delete(key);
            }
          })
        );
      })
    ])
  );
});

// =======================================================================
// FETCH - ESTRATÉGIA STALE-WHILE-REVALIDATE (PERFEITA PARA MODO OFFLINE)
// =======================================================================
self.addEventListener("fetch", event => {
  // Ignora requisições do PushAlert e da API do Google Sheets para não quebrar a integração
  if (
    event.request.url.includes("pushalert.co") || 
    event.request.url.includes("script.google.com")
  ) {
    return; // Deixa passar direto pela internet, sem enfiar no cache
  }

  // Para os arquivos estruturais do site, entrega o cache na hora e atualiza depois
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      
      // Cria a busca na rede em segundo plano para atualizar o app silenciosamente
      const fetchPromise = fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Falha silenciosa se estiver totalmente sem rede
        console.log("PWA funcionando em modo offline.");
      });

      // Retorna o arquivo do cache imediatamente (se existir). Se não existir, espera a rede.
      return cachedResponse || fetchPromise;
    })
  );
});
