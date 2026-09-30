/*
 * Aroma Gelato — service worker
 * Affiche la carte instantanément dès la deuxième visite (et même hors connexion),
 * puis vérifie en arrière-plan s'il existe une version plus récente.
 */
'use strict';

var PAGES = 'aroma-pages-v1';
var ASSETS = 'aroma-assets-v1';
var CORE_ASSETS = [
  "/fonts/playfair.5cca0c34d1.woff2",
  "/fonts/playfair-italic.55de7fa52d.woff2",
  "/fonts/poppins-400.dd1db7dd67.woff2",
  "/fonts/poppins-500.6adf947a89.woff2",
  "/fonts/poppins-600.6a7f28c5a6.woff2",
  "/art/gelato.41ec3570cc.svg"
];

self.addEventListener('install', function (event) {
  event.waitUntil(Promise.all([
    caches.open(PAGES).then(function (cache) { return cache.add(new Request('/', { cache: 'reload' })); }),
    caches.open(ASSETS).then(function (cache) { return cache.addAll(CORE_ASSETS); })
  ]).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (key) {
      return key !== PAGES && key !== ASSETS;
    }).map(function (key) { return caches.delete(key); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (request.method !== 'GET') return;
  var url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // La page : réponse immédiate depuis le cache, mise à jour en arrière-plan.
  if (request.mode === 'navigate') {
    var network = fetch(request).then(function (response) {
      if (!response || !response.ok || response.redirected) return response;
      var copy = response.clone();
      return caches.open(PAGES).then(function (cache) {
        return cache.match('/').then(function (previous) {
          var before = previous && previous.headers.get('etag');
          var after = response.headers.get('etag');
          return cache.put('/', copy).then(function () {
            if (before && after && before !== after) notifyUpdate();
            return response;
          });
        });
      });
    });
    event.waitUntil(network.catch(function () { /* hors connexion */ }));
    event.respondWith(caches.open(PAGES).then(function (cache) {
      return cache.match('/').then(function (cached) { return cached || network; });
    }).catch(function () { return network; }));
    return;
  }

  // Polices et illustrations : fichiers versionnés, servis depuis le cache.
  if (url.pathname.indexOf('/fonts/') === 0 || url.pathname.indexOf('/art/') === 0) {
    event.respondWith(caches.open(ASSETS).then(function (cache) {
      return cache.match(request).then(function (hit) {
        return hit || fetch(request).then(function (response) {
          if (response.ok) cache.put(request, response.clone());
          return response;
        });
      });
    }));
  }
});

function notifyUpdate() {
  self.clients.matchAll({ type: 'window' }).then(function (clients) {
    clients.forEach(function (client) { client.postMessage({ type: 'menu-updated' }); });
  });
}
