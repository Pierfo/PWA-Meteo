console.log("ciao")

self.addEventListener("install", () => {
    console.log("Service worker installed");
});

self.addEventListener("activate", () => {
    clients.claim();
    console.log("service worker activated");
})