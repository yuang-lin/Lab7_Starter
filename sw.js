// sw.js - This file needs to be in the root of the directory to work,
//         so do not move it next to the other scripts

const CACHE_NAME = 'lab-7-starter';
var urlsToCache = [
  '/Lab7_Starter/index.html',
  '/Lab7_Starter/favicon.ico',
  '/Lab7_Starter/assets/images/icons/0-star.svg',
  '/Lab7_Starter/assets/images/icons/1-star.svg',
  '/Lab7_Starter/assets/images/icons/2-star.svg',
  '/Lab7_Starter/assets/images/icons/3-star.svg',
  '/Lab7_Starter/assets/images/icons/4-star.svg',
  '/Lab7_Starter/assets/images/icons/5-star.svg',
  '/Lab7_Starter/assets/images/icons/arrow-down.png',
  '/Lab7_Starter/assets/styles/main.css',
  '/Lab7_Starter/assets/scripts/main.js',
  '/Lab7_Starter/assets/scripts/Router.js',
  '/Lab7_Starter/assets/components/RecipeCard.js',
  '/Lab7_Starter/assets/components/RecipeExpand.js'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});


/**
 * Once the service worker 'activates', this makes it so clients loaded
 * in the same scope do not need to be reloaded before their fetches will
 * go through this service worker
 */
self.addEventListener('activate', function (event) {
  /**
   * TODO - Part 2 Step 3
   * Create a function as outlined above, it should be one line
   */
  event.waitUntil(clients.claim());
});

// Intercept fetch requests and store them in the cache
self.addEventListener('fetch', function (event) {
  /**
   * TODO - Part 2 Step 4
   * Create a function as outlined above
   */
   event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});
