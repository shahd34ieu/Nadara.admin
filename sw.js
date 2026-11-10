const C="nadara-v4",F=["./","index.html","manifest.json","icon-192.png","icon-512.png","icon-180.png","media/p1.jpg","media/p2.jpg","media/p3.jpg","media/p4.jpg","media/r1.jpg"];
self.addEventListener("install",e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{if(e.request.method!=="GET"||e.request.url.endsWith(".mp4")||e.request.url.includes("admin"))return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match("./"))))});
