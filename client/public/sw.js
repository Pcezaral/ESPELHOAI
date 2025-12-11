// Service Worker para ESPELHO AI PWA
// Estratégia: Network-first para sempre pegar versão mais recente
const CACHE_NAME = 'espelho-ai-v2';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/pwa-icon-192.png',
  '/pwa-icon-512.png',
  '/index.html'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS).catch((err) => {
          console.log('[SW] Some assets failed to cache:', err);
          // Continuar mesmo se alguns assets falharem
          return Promise.resolve();
        });
      })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Network-first strategy
// Tenta rede primeiro, usa cache como fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Não fazer cache de requisições POST, DELETE, PUT
  if (request.method !== 'GET') {
    return;
  }

  // Não fazer cache de requisições para API
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .catch(() => {
          return new Response(
            JSON.stringify({ error: 'Offline - API não disponível' }),
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'application/json'
              })
            }
          );
        })
    );
    return;
  }

  // Network-first para assets estáticos
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Não cachear respostas de erro
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // Clonar a resposta
        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(request, responseToCache);
          })
          .catch((err) => {
            console.log('[SW] Cache put failed:', err);
          });

        return response;
      })
      .catch(() => {
        // Se falhar a rede, tenta cache
        return caches.match(request)
          .then((response) => {
            if (response) {
              return response;
            }

            // Se não estiver em cache, retornar página offline
            if (request.destination === 'document') {
              return caches.match('/');
            }

            return new Response('Offline - recurso não disponível', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
