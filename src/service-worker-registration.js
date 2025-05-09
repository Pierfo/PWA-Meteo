if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/PWA-Meteo/service-worker.js').then(() => console.log('service worker registered'));
}