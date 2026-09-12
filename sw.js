/* Service Worker — Formulierungsbausteine VT
   Strategie: App-Shell beim Installieren vorladen, danach Cache zuerst.
   Bei jeder inhaltlichen Änderung VERSION erhöhen, sonst bleibt die alte Fassung aktiv. */

var VERSION = "v1";
var CACHE = "bausteine-vt-" + VERSION;
var SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){ return c.addAll(SHELL); }).then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(namen){
      return Promise.all(namen.map(function(n){ if(n !== CACHE) return caches.delete(n); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function(e){
  var anfrage = e.request;
  if(anfrage.method !== "GET") return;
  if(new URL(anfrage.url).origin !== self.location.origin) return;

  e.respondWith(
    caches.match(anfrage).then(function(treffer){
      if(treffer){
        /* im Hintergrund auffrischen, damit die nächste Öffnung aktuell ist */
        fetch(anfrage).then(function(a){
          if(a && a.status === 200) caches.open(CACHE).then(function(c){ c.put(anfrage, a.clone()); });
        }).catch(function(){});
        return treffer;
      }
      return fetch(anfrage).then(function(a){
        if(a && a.status === 200 && a.type === "basic"){
          var kopie = a.clone();
          caches.open(CACHE).then(function(c){ c.put(anfrage, kopie); });
        }
        return a;
      }).catch(function(){
        if(anfrage.mode === "navigate") return caches.match("./index.html");
      });
    })
  );
});
