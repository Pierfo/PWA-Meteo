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
        new Promise ((resolve, reject) => {
            caches.match(e.request).then(cached => {
                if(cached === undefined) {
                    resolve(fetchFromWebWrapper(e.request))
                }

                else {
                    console.log("Fetching from cache");
                    resolve(cached);
                }
            })
        })
    )
})

async function fetchFromWebWrapper(request) {
    return await fetchFromWeb(request);
}

function fetchFromWeb(request) {
    return new Promise((resolve, reject) => {
        fetch(e.request).then((res) => {
            console.log("Fetching from the web");
            const resClone = res.clone();

            caches.open(cacheName).then((cache) => {cache.put(e.request, res)});

            resolve(response = resClone);
        })
    })
}