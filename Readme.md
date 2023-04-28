**Service Worker como Local Storage**

Este é um exemplo simples de como utilizar um Service Worker para armazenar e recuperar dados como se fosse um Local Storage.

_Como funciona_

O Service Worker é um script que roda em background no navegador e permite que você intercepte e personalize as requisições feitas pelo usuário. Ele pode ser utilizado para criar uma espécie de "cache" de recursos, permitindo que a aplicação continue funcionando mesmo quando o usuário está offline.

Neste exemplo, vamos utilizar um Service Worker para armazenar e recuperar dados como se fosse um Local Storage. O Service Worker será instalado e ativado na página index.html, e será utilizado para armazenar e recuperar um token.

_Como utilizar_

Para utilizar o Service Worker como Local Storage, siga os passos abaixo:

1. Crie o arquivo sw.js com o código do Service Worker:

```bash
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

```

2. Crie a página index.html que irá utilizar o Service Worker:

```bash

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Service Worker como Local Storage</title>
    <script>
      async function saveToken() {
        const token = "meu-token-123";
        await setToken(token);
        console.log("Token salvo no service worker");
      }

      async function loadToken() {
        const token = await getToken();
        console.log("Token recuperado do service worker:", token);
      }
    </script>
  </head>
  <body>
    <button onclick="saveToken()">Salvar Token</button>
    <button onclick="loadToken()">Carregar Token</button>

    <script>
      // Registrar o service worker
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("sw.js")
          .then(() => console.log("Service Worker registrado"));
      }
    </script>
  </body>
</html>

```

Neste exemplo, ao clicar no botão "Salvar Token", a função saveToken é chamada e armazena o token "meu-token-123" no cache do Service Worker utilizando a função setToken. Ao clicar no botão "Carregar Token", a função loadToken é chamada e recupera o token armazenado no cache do Service Worker utilizando a função getToken.

Ao usar um service worker como um local storage, é importante lembrar que o service worker só funciona em navegadores que suportam essa tecnologia, ou seja, em navegadores modernos. Além disso, é necessário que o site esteja sendo servido por HTTPS, para garantir a segurança da informação que está sendo armazenada.

Outra coisa importante a se considerar é que o service worker é um tipo de worker, o que significa que ele é executado em um processo separado do processo principal do navegador. Isso garante que ele possa executar tarefas em segundo plano, sem afetar a experiência do usuário na página. No entanto, como ele é executado em um processo separado, pode haver um pequeno atraso entre a atualização dos dados no service worker e a sua disponibilidade na página.

Além disso, o uso do service worker como um local storage é limitado em tamanho, sendo recomendado para armazenar dados pequenos, como tokens de autenticação e preferências do usuário.

Por fim, é importante lembrar que o uso de um service worker para armazenar informações no lado do cliente não substitui a necessidade de armazenar informações críticas do usuário no lado do servidor, como senhas e informações financeiras.
