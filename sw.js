/* KG ผู้จัดการทีม — Service Worker (ทำให้ติดตั้งเป็นแอปได้ + เปิดเร็ว) */
const V='kgfm-v3';
const CORE=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./icon-180.png'];
const CDN=['fonts.googleapis.com','fonts.gstatic.com','unpkg.com'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(r.mode==='navigate'){ // หน้าเกม: ใช้ของใหม่จากเน็ตก่อน ถ้าไม่มีเน็ตใช้ของในเครื่อง
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put('./index.html',c));return res}).catch(()=>caches.match('./index.html')));return}
  if(u.origin===location.origin||CDN.includes(u.hostname)){
    e.respondWith(caches.match(r).then(hit=>{const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque')){const c=res.clone();caches.open(V).then(x=>x.put(r,c))}return res}).catch(()=>hit);return hit||net}));
  }
  // อย่างอื่น (เช่นเซิร์ฟเวอร์เชื่อมต่อห้อง PeerJS) ปล่อยผ่านตามปกติ
});
