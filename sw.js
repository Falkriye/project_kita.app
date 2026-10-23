const C='projectkita-v8';
const ASSETS=['./','./index.html','./manifest.json','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png','./images/desain-1.jpg','./images/desain-2.jpg','./images/qris.jpg'];
// satu file hilang tidak lagi menggagalkan instalasi service worker
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.allSettled(ASSETS.map(a=>c.add(a)))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const put=(r,res)=>{if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp)).catch(()=>{})}return res};
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);if(u.hostname.endsWith('supabase.co'))return;
  // halaman (HTML): selalu ambil versi terbaru dari server, cache hanya untuk offline
  if(r.mode==='navigate'||u.pathname.endsWith('.html')||u.pathname==='/'){
    e.respondWith(fetch(r).then(res=>put(r,res)).catch(()=>caches.match(r).then(h=>h||caches.match('./index.html'))));return}
  // aset lain: tampil cepat dari cache, diperbarui di belakang layar
  e.respondWith(caches.match(r).then(hit=>{const net=fetch(r).then(res=>put(r,res)).catch(()=>hit);return hit||net}));
});
