importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.6.0/workbox-sw.js');

workbox.routing.registerRoute(
  ({ request }) => request.mode === 'navigate',
  new workbox.strategies.NetworkFirst({
    cacheName: 'pages',
    plugins: [
      {
        cacheDidUpdate: async ({ response }) => response,
        fetchDidFail: async () => {
          return caches.match('/offline');
        },
      },
    ],
  })
);

// Precache the offline page
workbox.precaching.precacheAndRoute([
  { url: '/offline', revision: null },
]);