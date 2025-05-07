if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/PWA-Meteo/service-worker.js');
    console.log('service worker registered')
}