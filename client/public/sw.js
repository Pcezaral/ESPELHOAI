// Service Worker para ESPELHO AI PWA v5
// Estratégia: Network-first com cache inteligente + fallback seguro
// FIX: Evitar página em branco na primeira visita

const CACHE_NAME = 'espelho-ai-v5';
const STATIC_ASSETS = [
  '/manifest.json',
  '/pwa-icon-192.png',
  '/pwa-icon-512.png',
];

// Install event - cache apenas assets estáticos (NÃO index.html)
self.addEventListener('install', (event) => {
  console.log('[SW v5] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW v5] Caching static assets');
        return cache.addAll(STATIC_ASSETS).catch((err) => {
          console.log('[SW v5] Some assets failed to cache:', err);
          return Promise.resolve();
        });
      })
  );
  self.skipWaiting();
});

// Activate event - limpar caches antigos
self.addEventListener('activate', (event) => {
  console.log('[SW v5] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW v5] Deleting old cache:', cacheName);
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
    console.log('[SW v5] Fetch:', request.method, url.pathname);
  }

  // NUNCA cachear: API, downloads, checkout, stripe, HTML pages
  const isExcluded = 
    url.pathname.includes('/api/') ||
    url.pathname.includes('/download') ||
    url.pathname.includes('/checkout') ||
    url.pathname.includes('/stripe') ||
    url.pathname.includes('/generation') ||
    url.pathname.includes('/payment') ||
    url.pathname.endsWith('.html') ||
    url.pathname === '/' ||
    request.method !== 'GET';

  if (isExcluded) {
    // Network-only para requisições críticas
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Log de sucesso
          console.log('[SW v5] Network success:', request.method, url.pathname, response.status);
          return response;
        })
        .catch((error) => {
          console.error('[SW v5] Network failed:', request.method, url.pathname, error);
          
          // Para HTML (páginas), tentar cache como fallback
          if (request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/index.html')
              .then((cachedResponse) => {
                if (cachedResponse) {
                  console.log('[SW v5] Serving cached index.html as fallback');
                  return cachedResponse;
                }
                // Último recurso: retornar erro HTML
                return new Response(
                  '<html><body><h1>Offline</h1><p>Não é possível conectar ao servidor. Tente novamente.</p></body></html>',
                  { 
                    status: 503,
                    headers: { 'Content-Type': 'text/html' }
                  }
                );
              });
          }
          
          // Para JSON (API), retornar erro JSON
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

  // Para assets estáticos (CSS, JS, imagens): Cache-first com network fallback
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('[SW v5] Serving from cache:', request.url);
          // Atualizar cache em background
          fetch(request)
            .then((response) => {
              if (response.ok && response.status === 200) {
                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(request, responseToCache);
                });
              }
            })
            .catch(() => {
              // Silenciosamente falhar se network não disponível
            });
          return cachedResponse;
        }
        
        // Não está em cache, buscar da rede
        return fetch(request)
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
            // Sem cache e sem network - retornar erro
            console.error('[SW v5] Failed to fetch:', request.url);
            return new Response('Offline', { status: 503 });
          });
      })
  );
});

// Mensagens do cliente
self.addEventListener('message', (event) => {
  console.log('[SW v5] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW v5] SKIP_WAITING requested');
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('[SW v5] CLEAR_CACHE requested');
    caches.delete(CACHE_NAME).then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }
});

// Periodic sync para sincronizar downloads em background (opcional)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-downloads') {
    console.log('[SW v5] Background sync: downloads');
    // Implementar lógica de sincronização se necessário
  }
});
