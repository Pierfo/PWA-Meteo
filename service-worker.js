const cacheNames = ["PWA-Meteo_v3", "PWA-Meteo_time-cached_v1"];

self.addEventListener("install", (e) => {
    e.waitUntil(() => caches.open(cacheNames));
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
            caches.open(cacheNames[0]).then((cache) => {
                cache.match(e.request).then(cached => {
                    if(cached === undefined) {
                        resolve(fetchFromWebWrapper(e.request))
                    }

                    else {
                        console.log("Fetching from cache");

                        resolve(cached);
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
            console.log("Fetching from the web");
            
            const resClone = res.clone();

            caches.open(cacheNames[0]).then((cache) => {cache.put(request, res)});
            
            if(request.url.includes("https://api.open-meteo.com/v1/forecast")) {
                caches.open(cacheNames[1]).then((cache) => {cache.put(request, new Response(Date.now().toString()))
                    .then(() => {cache.match(request).then((res) => {
                        const reader = res.body.getReader();

                        let number;

                        reader.read().then(function readStream({done, value}) {
                            if(!done) {
                                number += value;

                                reader.read().then(readStream);
                            }
                        })
                    })})});
            }

            resolve(resClone);
        })
    })
}