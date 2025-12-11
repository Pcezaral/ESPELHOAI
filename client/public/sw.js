// Service Worker para ESPELHO AI PWA v4
// Estratégia: Network-first com cache inteligente
// CRÍTICO: Nunca cachear downloads, API calls, ou páginas de checkout

const CACHE_NAME = 'espelho-ai-v4';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/pwa-icon-192.png',
  '/pwa-icon-512.png',
  '/index.html'
];

// Install event - cache apenas assets estáticos
self.addEventListener('install', (event) => {
  console.log('[SW v4] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW v4] Caching static assets');
        return cache.addAll(STATIC_ASSETS).catch((err) => {
          console.log('[SW v4] Some assets failed to cache:', err);
          return Promise.resolve();
        });
      })
  );
  self.skipWaiting();
});

// Activate event - limpar caches antigos
self.addEventListener('activate', (event) => {
  console.log('[SW v4] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW v4] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Estratégia inteligente
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Log de requisições importantes
  if (url.pathname.includes('/api/') || url.pathname.includes('/download')) {
    console.log('[SW v4] Fetch:', request.method, url.pathname);
  }

  // NUNCA cachear: API, downloads, checkout, stripe
  const isExcluded = 
    url.pathname.includes('/api/') ||
    url.pathname.includes('/download') ||
    url.pathname.includes('/checkout') ||
    url.pathname.includes('/stripe') ||
    url.pathname.includes('/generation') ||
    url.pathname.includes('/payment') ||
    request.method !== 'GET';

  if (isExcluded) {
    // Network-only para requisições críticas
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Log de sucesso
          console.log('[SW v4] Network success:', request.method, url.pathname, response.status);
          return response;
        })
        .catch((error) => {
          console.error('[SW v4] Network failed:', request.method, url.pathname, error);
          return new Response(
            JSON.stringify({ error: 'Offline - não é possível completar esta ação' }),
            { 
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        })
    );
    return;
  }

  // Para assets estáticos e páginas: Network-first com cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cachear apenas respostas bem-sucedidas
        if (response.ok && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback para cache
        return caches.match(request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              console.log('[SW v4] Serving from cache:', request.url);
              return cachedResponse;
            }
            // Se nada em cache, retornar index.html para SPA
            return caches.match('/index.html');
          });
      })
  );
});

// Mensagens do cliente
self.addEventListener('message', (event) => {
  console.log('[SW v4] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW v4] SKIP_WAITING requested');
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('[SW v4] CLEAR_CACHE requested');
    caches.delete(CACHE_NAME).then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }
});

// Periodic sync para sincronizar downloads em background (opcional)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-downloads') {
    console.log('[SW v4] Background sync: downloads');
    // Implementar lógica de sincronização se necessário
  }
});
