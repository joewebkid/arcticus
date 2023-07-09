self.addEventListener('install', event => {
    event.waitUntil(
      caches.open('arctic-cache').then(cache => {
        return cache.addAll([
          'index.html',
          'quest.js',
          'style.css',
          'quest.json',
          // добавьте другие ресурсы вашей игры, которые вы хотите кэшировать
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  });