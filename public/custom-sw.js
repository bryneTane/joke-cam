self.addEventListener('push', event => {
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: './logo192.png',
        vibrate: [200, 200],
        tag: 'vibration-sample'
    }
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
})

self.addEventListener('notificationclick', function (event) {
    let url = 'https://joke-cam.friedrich-tane.tech/';
    event.notification.close(); // Android needs explicit close.
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                // If so, just focus it.
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, then open the target URL in a new window/tab.
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});

self.addEventListener('install', function (event) {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function (event) {
    event.waitUntil(self.clients.claim());
});

