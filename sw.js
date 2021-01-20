const filesToCache = [
  '/',
    'style.css',
    'images/favicon.ico',
    'css/bootstrap.css',
    'css/font-awesome.min.css',
    'css/responsive.css',
    'css/colors.css',
    'css/version/garden.css',
    'js/jquery.min.js',
    'js/tether.min.js',
    'js/bootstrap.min.js',
    'js/custom.js',
    'garden-index.html',
    'pages/offline.html',
    'pages/404.html',
    'images/version/garden-logo.png',
    'image-web/blog-1.jpg',
    'image-web/blog-2.jpg',
    'image-web/blog-3.jpg',
    'image-web/blog-4.jpg',
    'image-web/blog-5.jpg',
    'image-web/blog-6.jpg',
    'image-web/blog-7.jpg',
    'image-web/blog-8.jpg',
    'image-web/blog-9.jpg',
    'image-web/blog-10.jpg',
    'image-web/blog-11.jpg',
    'image-web/blog-12.jpg',
    'image-web/ad.jpg',
    'images/version/garden-footer-logo.png',
    'image-web/abc.jpg',
];

const staticCacheName = 'pages-cache-v2';

self.addEventListener('install', event => {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(staticCacheName)
    .then(cache => {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', event => {
  console.log('Activating new service worker...');

  const cacheWhitelist = [staticCacheName];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  console.log('Fetch event for ', event.request.url);
  event.respondWith(
    caches.match(event.request)
    .then(response => {
      if (response) {
        console.log('Found ', event.request.url, ' in cache');
        return response;
      }
      console.log('Network request for ', event.request.url);
      return fetch(event.request)
      .then(response => {
        if (response.status === 404) {
          return caches.match('pages/404.html');
        }
        return caches.open(staticCacheName)
        .then(cache => {
          cache.put(event.request.url, response.clone());
          return response;
        });
      });
    }).catch(error => {
      console.log('Error, ', error);
      return caches.match('pages/offline.html');
    })
  );
});



