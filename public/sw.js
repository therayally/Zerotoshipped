// Lets phones install TinyAppCode as an app (Add to Home Screen / Install). It caches nothing on purpose,
// so lessons and progress are always the latest version: every request goes straight to the network.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
