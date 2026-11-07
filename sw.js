// Store walk — retired 2026-11-08. This service worker replaces the old one on the next open:
// it deletes every cached copy of the old app, takes over the open page, reloads it (so the "moved" page shows)
// and then unregisters itself. Nothing is cached any more.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const ks = await caches.keys(); await Promise.all(ks.map(k => caches.delete(k)));
    await self.clients.claim();
    const cs = await self.clients.matchAll({ type: "window" });
    cs.forEach(c => { try { c.navigate(c.url); } catch (x) {} });
    await self.registration.unregister();
  })());
});
self.addEventListener("fetch", () => {});   // network only
