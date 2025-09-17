// Nome do cache
const CACHE_NAME = "laison-cache-v1";

// Arquivos essenciais a serem armazenados no cache
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/home.html",
  "/chat.html",
  "/chatboot.html",
  "/filmes.html",
  "/jogo.html", // <-- vai ser o offline também
  "/laison.html",
  "/login.html",
  "/procurar.html",
  "/main.js",
  "/script.js",
  "/home.css",
  "/laison.css",
  "/icon192.png",
  "/icon512.png",
  "/laison.png",
  "/laison2.png",
  "/chat.png",
  "/editar.png",
  "/enviar.png",
  "/mensagem.png",
  "/perfil.png",
  "/search.png",
  "/images6.png",
  "/fundo.mp4"
];

// Instalação do Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Arquivos em cache ✅");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativação e limpeza de caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Cache antigo removido:", cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Estratégia de rede com fallback para cache
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Atualiza cache sempre que possível
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(() => {
        // Se não conseguir pegar online, tenta o cache
        return caches.match(event.request).then((response) => {
          // Se não existir no cache, mostra o jogo como fallback
          return response || caches.match("/jogo.html");
        });
      })
  );
});
