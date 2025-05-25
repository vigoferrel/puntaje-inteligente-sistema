
// Service Worker para notificaciones push
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  console.log('Push event received:', event);

  if (!event.data) {
    console.log('No data in push event');
    return;
  }

  try {
    const data = event.data.json();
    console.log('Push data:', data);

    const options = {
      body: data.body,
      icon: data.icon || '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [200, 100, 200],
      data: data.event || {},
      actions: [
        {
          action: 'view',
          title: 'Ver evento',
          icon: '/favicon.ico'
        },
        {
          action: 'dismiss',
          title: 'Descartar',
          icon: '/favicon.ico'
        }
      ],
      requireInteraction: data.priority === 'critical',
      silent: false,
      timestamp: Date.now()
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  } catch (error) {
    console.error('Error processing push event:', error);
    
    // Fallback notification
    event.waitUntil(
      self.registration.showNotification('PAES Command', {
        body: 'Tienes una nueva notificación',
        icon: '/favicon.ico'
      })
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);

  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  // Abrir o enfocar la aplicación
  event.waitUntil(
    self.clients.matchAll({ type: 'window' })
      .then((clients) => {
        // Si hay una ventana abierta, enfocarla
        for (const client of clients) {
          if (client.url.includes('paes-command') && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Si no hay ventana abierta, abrir una nueva
        if (self.clients.openWindow) {
          return self.clients.openWindow('/');
        }
      })
  );
});

self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
  // Aquí podrías registrar analytics o realizar otras acciones
});

// Manejar mensajes del cliente
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
