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
            let original_date;
            for(const pair of res.headers.entries()) {
                if(pair[0] === "date") {
                    original_date = Date.parse(pair[1])
                    console.log(original_date);
                }
            }
            
            const resClone = res.clone();

            caches.open(cacheName).then((cache) => {cache.put(e.request, resClone)});

            return res;
        })
    )
})