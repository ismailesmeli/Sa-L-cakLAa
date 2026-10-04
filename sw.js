const CACHE_NAME = 'saglicakla-v2'; // Önbellek sürümünü v2'ye yükselttik
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './style.css',
    './data.js',
    './charts.js',
    './ai.js',
    './app.js',
    './icon-192x192.png',
    './icon-512x512.png',
    'https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('activate', event => {
    // Eski, kullanılmayan önbellekleri temizle
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => cacheName !== CACHE_NAME)
                .map(cacheName => caches.delete(cacheName))
            );
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => response || fetch(e.request)),
    );
});
