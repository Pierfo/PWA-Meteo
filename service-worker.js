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
        fetch(e.request).then((res) => {
            for(const pair of res.headers) {
                console.log(pair[0] + ": " + pair[1])
            }
            
            const resClone = res.clone();

            caches.open(cacheName).then((cache) => {cache.put(e.request, resClone)});

            return res;
        })
    )
})