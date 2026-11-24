/* Service worker de POHL Taller.
   Estrategia "primero la red": siempre se intenta traer la versión publicada
   y solo si no hay conexión se usa la copia guardada. Así las actualizaciones
   llegan solas y los datos (localStorage / IndexedDB) nunca se tocan. */
const CACHE = 'pohl-taller-cache';
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', './index.html', './seguimiento.html', './img-removebg-preview.png', './manifest.json', './vendor/app.css', './vendor/fa/css/fontawesome.min.css', './vendor/fa/css/solid.min.css', './vendor/fa/css/brands.min.css', './vendor/fa/webfonts/fa-solid-900.woff2', './vendor/fa/webfonts/fa-brands-400.woff2', './vendor/html2pdf.bundle.min.js', './vendor/qrcode.min.js']).catch(() => {})));
});
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (/version\.json|licencia\.json|licencia-clave\.js/.test(req.url)) return; // siempre a la red // siempre directo a la red
  e.respondWith(
    fetch(req).then(res => {
      if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}); }
      return res;
    }).catch(() => caches.match(req, {ignoreSearch: true}).then(r => r || caches.match('./index.html')))
  );
});
