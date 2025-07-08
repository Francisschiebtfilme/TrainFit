
const cacheName='trainfit-v3';
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(cacheName).then(cache=>cache.addAll([
    './index.html','./style.css','./script.js','./manifest.json','./icon-192.png','./icon-512.png'
  ])))
});
self.addEventListener('fetch',e=>{
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))
});
