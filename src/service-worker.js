self.addEventListener('push', function (event) {
  const data = event.data.json();
  console.log('📬 Push nhận được:', data);

  const options = {
    body: data.body,
    icon: '/logo192.png', // Hoặc icon khác
    badge: '/logo192.png',
    data: { url: data.url || '/' },
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(clients.openWindow(url));
});
