// Service Worker para ESPELHO AI PWA
// Estratégia: Network-first para conteúdo, SEM cache para downloads/API
const CACHE_NAME = 'espelho-ai-v3';
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

// Fetch event - Network-first strategy com exceções para downloads
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // NUNCA cachear: API, downloads, geração de imagens
  if (
    url.pathname.includes('/api/') ||
    url.pathname.includes('/download') ||
    url.pathname.includes('/generation') ||
    request.method !== 'GET'
  ) {
    // Network-only para API e downloads
    event.respondWith(
      fetch(request)
        .then((response) => response)
        .catch(() => {
          return new Response('Offline - não é possível baixar', { status: 503 });
        })
    );
    return;
  }

  // Para assets estáticos: Network-first com cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request)
          .then((cachedResponse) => {
            return cachedResponse || caches.match('/index.html');
          });
      })
  );
});

// Forçar atualização
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
