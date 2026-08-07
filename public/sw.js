// Daleelak AlJamaei (دليلك الجامعي) - Advanced Service Worker
const CACHE_VERSION = 'v2.0.0';
const STATIC_CACHE_NAME = `daleelak-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = `daleelak-dynamic-${CACHE_VERSION}`;
const FONT_CACHE_NAME = `daleelak-fonts-${CACHE_VERSION}`;

// Core static assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png',
  '/apple-touch-icon.png',
  '/pwa-72x72.png',
  '/pwa-96x96.png',
  '/pwa-128x128.png',
  '/pwa-144x144.png',
  '/pwa-152x152.png',
  '/pwa-180x180.png',
  '/pwa-192x192.png',
  '/pwa-384x384.png',
  '/pwa-512x512.png',
  '/pwa-maskable-512x512.png'
];

// Install Event - Pre-cache critical static shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching static app shell');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => {
      // Force the waiting service worker to become active
      return self.skipWaiting();
    })
  );
});

// Activate Event - Clean up stale old caches and claim clients immediately
self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME, FONT_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!currentCaches.includes(cacheName)) {
            console.log('[SW] Deleting legacy cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Message Event - Handle client update trigger (e.g. "Update App" button click)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Fetch Event - Smart Routing & Caching Strategies
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Ignore non-GET requests or chrome-extension schemes
  if (request.method !== 'GET' || url.protocol.startsWith('chrome-extension')) {
    return;
  }

  // Strategy 1: Google Fonts / Fonts Cache (Stale-While-Revalidate)
  if (url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com') {
    event.respondWith(
      caches.open(FONT_CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cachedResponse);

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Strategy 2: Navigation Requests (SPA Route Fallback)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Cache fresh copy of index.html
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(STATIC_CACHE_NAME).then((cache) => cache.put('/index.html', responseToCache));
          }
          return networkResponse;
        })
        .catch(() => {
          // Return cached index.html when offline
          return caches.match('/index.html') || caches.match('/');
        })
    );
    return;
  }

  // Strategy 3: Static Assets (JS, CSS, Images, Media) - Stale-While-Revalidate / Cache-First
  const isStaticAsset = PRECACHE_ASSETS.includes(url.pathname) ||
                        request.destination === 'script' ||
                        request.destination === 'style' ||
                        request.destination === 'image' ||
                        request.destination === 'font';

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(DYNAMIC_CACHE_NAME).then((cache) => cache.put(request, responseToCache));
          }
          return networkResponse;
        }).catch(() => {/* Ignore network errors offline */});

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Strategy 4: Default Network First with Cache Fallback
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => cache.put(request, responseToCache));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Push Notifications Listener
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { body: event.data.text() };
    }
  }

  const title = data.title || 'دليلك الجامعي 🎓';
  const options = {
    body: data.body || 'تنبيه جديد من تطبيق دليلك الجامعي',
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    image: data.image || null,
    dir: 'rtl',
    lang: 'ar',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    },
    actions: [
      { action: 'open', title: 'فتح التطبيق' },
      { action: 'close', title: 'إغلاق' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification Click Listener
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') return;

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
