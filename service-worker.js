self.addEventListener("install", () => {
    console.log("Service worker installed");
});

self.addEventListener("activate", () => {
    console.log("service worker activated");
})