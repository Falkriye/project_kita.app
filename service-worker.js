/* ==========================================================================
   ProjectKita — Service Worker
   Strategy:
   - App shell (HTML/CSS/JS/icons) is precached on install ("cache-first").
   - Navigation requests fall back to offline.html when there's no network
     and the page was never cached.
   - Bump CACHE_VERSION whenever you change any cached file so users get
     the update instead of a stale cache.
   ========================================================================== */

const CACHE_VERSION = "v1";
const CACHE_NAME = `projectkita-${CACHE_VERSION}`;

const APP_SHELL = [
  "/",
  "/index.html",
  "/login.html",
  "/role.html",
  "/offline.html",
  "/manifest.json",
  "/css/style.css",
  "/js/app.js",
  "/js/splash.js",
  "/js/login.js",
  "/js/role.js",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable-512.png",
  "/icons/favicon-32.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("projectkita-") && key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests from the same origin.
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  // Page navigations: try the network first so users get fresh content when
  // online, fall back to cache, then to the offline page.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match("/offline.html"))
        )
    );
    return;
  }

  // Static assets: cache-first, then network, then cache the fresh copy.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
