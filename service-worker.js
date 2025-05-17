const cacheName = "PWA-Meteo_v2"

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

                    let original_time;

                    

                    console.log(`${original_time}, ${Date.now()}`);

                    if(Date.now() - original_time > 30000)
                        alert("Very old data");

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
        fetch(request).then((res) => {
            console.log("Fetching from the web");
            
            const resClone = res.clone();

            for(const h in res.headers) {
                        console.log(h[0]);
                    }

            caches.open(cacheName).then((cache) => {cache.put(request, res)});

            resolve(response = resClone);
        })
    })
}