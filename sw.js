// ===== ClearSky — service worker (app-shell caching) =====
const CACHE_NAME = "clearsky-v9";
const APP_SHELL = [
  "./",
  "index.html",
  "css/style.css",
  "js/config.js",
  "js/storage.js",
  "js/weather-codes.js",
  "js/country-capitals.js",
  "js/moon.js",
  "js/background.js",
  "js/api.js",
  "js/charts.js",
  "js/map.js",
  "js/voice.js",
  "js/ui.js",
  "js/app.js",
  "manifest.json",
  "assets/og-cover.png",
  "favicon.ico",
  "assets/icons/favicon-16x16.png",
  "assets/icons/favicon-32x32.png",
  "assets/icons/favicon-48x48.png",
  "assets/icons/apple-touch-icon.png",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first for API calls (fresh weather data), cache-first for the app shell.
self.addEventListener("fetch", (event) => {
  const url = event.request.url;
  const isApi = url.includes("open-meteo.com") || url.includes("bigdatacloud.net");

  if (isApi) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
