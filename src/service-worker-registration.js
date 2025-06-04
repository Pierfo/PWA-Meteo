/**
 * Registra il service worker
 */

if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/PWA-Meteo/service-worker.js');
}