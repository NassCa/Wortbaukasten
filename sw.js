/* Wortbaukasten – Service Worker v2 (robust)
   Vor dem Upload in "sw.js" umbenennen und neben die index.html legen.
   Fehlende Einzeldateien führen NICHT mehr zum Totalausfall des Caches. */

const CACHE_NAME = "wortbaukasten-v2";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./wortbaukasten-icon-192.png",
  "./wortbaukasten-icon-512.png",
  "./wortbaukasten-apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.allSettled(
        APP_SHELL.map((url) =>
          cache.add(url).catch((err) => {
            console.warn("[SW] Nicht im Cache gelandet:", url, err);
          })
        )
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true })
      .then((cached) => {
        if (cached) return cached;

        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== "basic") {
              return response;
            }
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
            return response;
          })
          .catch(() => caches.match("./index.html"));
      })
  );
});
