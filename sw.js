// sw.js — Service Worker básico

const CACHE_NAME = 'laison12-cache-v1';
const OFFLINE_URL = 'offline.html';

// Cria uma página offline simples
const offlinePage = `
<!doctype html><html><head><meta charset="utf-8"><title>Offline</title>
<style>body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;
height:100vh;background:#071021;color:#e6eef6;text-align:center}
</style></head><body><div><h2>Você está offline</h2>
<p>Tente novamente quando a internet voltar.</p></div></body></html>`;

// Instala e guarda a página offline
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(OFFLINE_URL, new Response(offlinePage, { headers: { 'Content-Type': 'text/html' } }));
  })());
  self.skipWaiting();
});

// Ativa e limpa caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => { if (k !== CACHE_NAME) caches.delete(k); }));
    self.clients.claim();
  })());
});

// Estratégia: network first, fallback para cache
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith((async () => {
    try {
      return await fetch(event.request);
    } catch {
      const cache = await caches.open(CACHE_NAME);
      return await cache.match(event.request) || await cache.match(OFFLINE_URL);
    }
  })());
});
