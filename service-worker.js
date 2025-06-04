/**
 * Gestisce la logica del service worker.
 * 
 * Il service worker adotta un approccio cache-first: ogni volta che l'app richiede una risorsa, prima si verifica 
 * se è disponibile in cache e poi, in caso negativo, ottiene la risorsa dal web. Questo approccio permette di
 * ottenere massime prestazioni però presenta dei problemi: 
 * 
 * 1) non permette di ricevere dati aggiornati: se l'utente cerca una città allora il relativo JSON è memorizzato in cache;
 *      poi, a qualunque ricerca successiva di quella stessa città, il service worker continuerà a riproporre il JSON
 *      salvato anziché fornire dati aggiornati
 * 2) può causare un'eccessiva occupazione di memoria: a ogni ricerca i dati meteo sono salvati in memoria per poi 
 *      non essere più cancellati
 * 
 * Per risolvere il primo problema si adotta la seguente strategia: ogni volta che un JSON del meteo viene salvato 
 * in cache, si inserisce in una seconda cache l'istante temporale in cui è stato effettuato il salvataggio. Poi, se
 * il JSON viene chiesto nuovamente, si confronta l'istante attuale con l'istante di salvataggio e, se la loro 
 * differenza supera una certa soglia, si considera il JSON come obsoleto e lo si sostituisce con una nuova versione
 * presa dal web.
 * Per risolvere il secondo problema, invece, si effettua una pulizia periodica della cache, in cui sono eliminati
 * tutti i JSON del meteo che verrebbero considerati obsoleti secondo il criteri odescritto prima. Tutte le altre
 * risorse (componenti dell'app e JSON restituiti da openstreetmap) sono mantenuti in quanto non si prevede che 
 * possano cambiare nel tempo.
 */

const cacheNames = ["PWA-Meteo_v40", "PWA-Meteo_time-cached_v38"]; // I nomi delle cache: la prima contiene le risorse e la seconda contiene gli istanti temporali in cui il dato è salvato
const expirationMinutes = 60; // Il numero di minuti oltre il quale il JSON dei dati meteo viene considerato obsoleto e quindi sostituito
let lastUpdate = 0; // Conterrà l'istante temporale in cui la cache è stata ripulita per l'ultima volta

// In fase di installazione, il service worker apre le cache di cui farà utilizzo
self.addEventListener("install", (e) => {
    e.waitUntil(caches.open(cacheNames));
});

// In fase di attivazione, il service worker elimina tutte le cache relative alle versioni precedenti dello stesso
self.addEventListener("activate", (e) => {
    e.waitUntil(
        // Ottengo i nomi di tutte le cache attive al momento
        caches.keys().then((otherCaches) => {
            // La funzione Promise.all() richiede come parametro un array di Promises e restituisce un'unica Promise
            // che si avvera all'avverarsi di tutte le Promise contenute nell'array
            return Promise.all(
                otherCaches.map(cache => {
                    if(!(cache in cacheNames)) {
                        // Elimino qualunque cache il cui nome non è presente in cacheNames
                        return caches.delete(cache);
                    }
                })
            )
        })
    )
})

// 
self.addEventListener("fetch", (e) => {
    // Avvia la pulizia della cache, se è passato sufficiente tempo
    if((Date.now()-lastUpdate) > (expirationMinutes * 60 * 1000)) {
        e.waitUntil(
            updateCache().then(() => {
                console.log("has cleaned cache");
            })
        )
        lastUpdate = Date.now();
    }
    
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

async function isOutdatedWrapper(cache, key) {
    return await isOutdated(cache, key);
}

async function fetchFromWebWrapper(request) {
    return await fetchFromWeb(request);
}

function updateCache() {
    return new Promise((resolve, reject) => {
        caches.open(cacheNames[1]).then((timeCache) => {
            caches.open(cacheNames[0]).then((cache) => {
                timeCache.keys().then((keys) => {
                    resolve(
                        Promise.all(
                            keys.map((key) => {
                                isOutdatedWrapper(timeCache, key).then(() => {
                                    console.log(`REMOVING ${key.url}`)
                                    return Promise.all([cache.delete(key), timeCache.delete(key)]);
                                }).catch(() => {
                                    return new Promise((resolve, reject) => {
                                        resolve();
                                    })
                                })
                            })
                        )
                    )
                })
            })
        })
    })
}

function isOutdated(cache, key) {
    return new Promise((resolve, reject) => {
        cache.match(key).then((time) => {
            if(time === undefined) {
                return;
            }

            const timeInt = parseInt(time.statusText);

            const result = (Date.now() - timeInt) > (expirationMinutes * 60 * 1000)

            if(result) {
                resolve();
            }
            
            else {
                reject();
            }
        })
    })
}

function fetchFromWeb(request) {
    return new Promise((resolve, reject) => {
        fetch(request).then((res) => {
            console.log(`Fetching from the web ${request.url}`);
            
            const resClone = res.clone();

            caches.open(cacheNames[0]).then((cache) => {cache.put(request, res)});
            
            if(request.url.includes("https://api.open-meteo.com/v1/forecast") || request.url.includes("https://pierfo.github.io/Dummy_data/openmeteo")) {
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