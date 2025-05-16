const cacheName = "PWA-Meteo_v1"

self.addEventListener("install", (e) => {
    e.waitUntil(() => caches.open(cacheName));
});

self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache != cacheName) {
                        return caches.delete(cache);
                    }
                })
            )
        })
    )
})

self.addEventListener("fetch", (e) => {    
    e.respondWith(
        caches.match(e.request).then(cached => cached)
        .catch((err) => {
            console.log("CIAO");
            fetch(e.request).then((res) => {
                console.log("Reading from the web");
                let original_date;
                for(const pair of res.headers.entries()) {
                    if(pair[0] === "date") {
                        original_date = Date.parse(pair[1])
                    }
                }
                const resClone = res.clone();
                caches.open(cacheName).then((cache) => {cache.put(e.request, resClone)});
                return res;
            }).catch((error) => alert("Sei offline!"));
        })
    )
})