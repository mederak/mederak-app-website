// Retain the old registration so existing installations reach the new URL.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.mode === 'navigate' && url.origin === self.location.origin && url.pathname.startsWith('/chess-coach/')) {
    event.respondWith(Promise.resolve(Response.redirect(new URL('/roki/' + url.search + url.hash, self.location.origin).href, 302)));
  }
});
