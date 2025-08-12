const CACHE='olympiad-v2';
const ASSETS=[
  './',
  './index.html','./search.html','./diagnostic.html','./planning.html','./books.html','./tutor.html','./404.html',
  './assets/site.css','./assets/site.js','./assets/books.json','./assets/search-index.json',
  './assets/skills_graph.json','./assets/practice_bank.json','./assets/aops_map.json','./assets/policy.json',
  './manifest.webmanifest','./favicon.svg'
];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});

self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
});

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const url=new URL(e.request.url);
  if(url.origin===location.origin){
    if(url.pathname.includes('/assets/')){
      e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
        const copy=res.clone();
        caches.open(CACHE).then(c=>c.put(e.request,copy));
        return res;
      })));
    }else{
      e.respondWith(fetch(e.request).then(res=>{
        if(res.status===404) return caches.match('404.html');
        const copy=res.clone();
        caches.open(CACHE).then(c=>c.put(e.request,copy));
        return res;
      }).catch(()=>caches.match(e.request).then(r=>r||caches.match('404.html'))));
    }
  }else{
    e.respondWith(fetch(e.request).catch(()=>caches.match('404.html')));
  }
});

