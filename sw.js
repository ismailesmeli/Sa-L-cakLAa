self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open('saglicakla-v1').then((cache) => cache.addAll([
            './',
            './index.html',
            './manifest.json',
            './style.css',
            './data.js',
            './charts.js',
            './ai.js',
            './app.js'
        ])),
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => response || fetch(e.request)),
    );
});