const CACHE_NAME = "my-cache";
const urlsToCache = ["/"];

// Instalar o service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache aberto");
      return cache.addAll(urlsToCache);
    })
  );
});

// Recuperar o token armazenado no cache
async function getToken() {
  const cache = await caches.open(CACHE_NAME);
  const response = await cache.match("/token");
  const data = await response.text();
  return data;
}

// Salvar o token no cache
async function setToken(token) {
  const cache = await caches.open(CACHE_NAME);
  const response = new Response(token);
  return cache.put("/token", response);
}

// Intercepta as requisições e verifica se existe no cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
