const CACHE='olympiad-v1';
const ASSETS=['./','./index.html','./planning.html','./books.html','./tutor.html','./assets/site.css','./assets/site.js','./assets/books.json','./manifest.webmanifest','./favicon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));});
