const CACHE_NAME = "trainfit-cache-v2";
const urlsToCache = [
    "index.html",
    "style.css",
    "script.js",
    "verlauf.js",
    "manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});