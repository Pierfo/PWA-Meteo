const cacheNames = ["PWA-Meteo_v38", "PWA-Meteo_time-cached_v36"];
const expirationMinutes = 60;

//C'è forse bisogno di inserire già degli elementi in cache
self.addEventListener("install", (e) => {
    e.waitUntil(caches.open(cacheNames));
});

self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then((otherCaches) => {
            return Promise.all(
                otherCaches.map(cache => {
                    if(!(cache in cacheNames)) {
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
            caches.open(cacheNames[1]).then((timeCache) => {
                timeCache.match(e.request).then((res) => {
                    let expired = false;
                    
                    if(res != undefined) {
                        const time_cached = parseInt(res.statusText);

                        if((Date.now() - time_cached) > (expirationMinutes * 60 * 1000)) {
                            console.log("Timeout");
                            expired = true;
                            resolve(fetchFromWebWrapper(e.request));
                        }
                    }

                    if(!expired) {
                        caches.open(cacheNames[0]).then((cache) => {
                            cache.match(e.request).then(cached => {
                                if(cached === undefined) {
                                    resolve(fetchFromWebWrapper(e.request))
                                }
                            
                                else {
                                    console.log(`Fetching from cache ${e.request.url}`);
                                
                                    resolve(cached);
                                }
                            })
                        })
                    }
                })
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
            console.log(`Fetching from the web ${request.url}`);
            
            const resClone = res.clone();

            caches.open(cacheNames[0]).then((cache) => {cache.put(request, res)});
            
            if(request.url.includes("https://api.open-meteo.com/v1/forecast")) {
                caches.open(cacheNames[1]).then((cache) => {
                    cache.put(request, new Response(null, {status: 200, statusText: Date.now().toString()}));
                })
            }

            resolve(resClone);
        }).catch((err) => {
            console.log(`Fetching error, returning void response`);

            resolve(new Response(null, {status: "404", statusText: "Offline"}))
        })
    })
}