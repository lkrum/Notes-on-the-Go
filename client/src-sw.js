const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  // Name of the cache storage.
  cacheName: 'page-cache',
  plugins: [
  // This plugin will cache responses with these headers to a maximum-age of 200 days
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// TODO: Implement asset caching
registerRoute( 
  // Here we define the callback function that will filter the requests we want to cache (in this case, JS and CSS files)
  ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
  new offlineFallback({
    // Name of the cache storage
    cacheName: 'asset-cache',
    plugins: [
      // This plugin will cache responses with these headers to a maximum-age of 30 days
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);



// const { warmStrategyCache } = require('workbox-recipes');
// const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies');
// const { registerRoute } = require('workbox-routing');
// const { CacheableResponsePlugin } = require('workbox-cacheable-response');
// const { ExpirationPlugin } = require('workbox-expiration');
// const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');
// // if (process.env.NODE_ENV === 'production') {
// //   precacheAndRoute(self.__WB_MANIFEST);
// // }

// precacheAndRoute(self.__WB_MANIFEST);
// // const manifest = self.__WB_MANIFEST;

// // // Do whatever you want with `manifest`:
// // if (manifest) {
// //   console.log('precached', manifest);
// //   precaching.precacheController.addToCacheList(manifest);
// // }

// // Set up page cache
// const pageCache = new CacheFirst({
//   cacheName: 'page-cache',
//   plugins: [
//     new CacheableResponsePlugin({
//       statuses: [0, 200],
//     }),
//     new ExpirationPlugin({
//       maxAgeSeconds: 30 * 24 * 60 * 60,
//     }),
//   ],
// });
// warmStrategyCache({
//   urls: ['/index.html', '/'],
//   strategy: pageCache,
// });
// registerRoute(({ request }) => request.mode === 'navigate', pageCache);
// // Set up asset cache
// registerRoute(
//   ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
//   new StaleWhileRevalidate({
//     cacheName: 'asset-cache',
//     plugins: [
//       new CacheableResponsePlugin({
//         statuses: [0, 200],
//       }),
//     ],
//   })
// );