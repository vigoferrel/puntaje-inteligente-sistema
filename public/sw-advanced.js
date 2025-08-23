/**
 * Service Worker Avanzado - Sistema Puntaje Inteligente
 * Implementa caching inteligente, offline support y background sync
 */

const CACHE_NAME = 'paes-intelligent-v3.0.0';
const STATIC_CACHE = 'paes-static-v3.0.0';
const DYNAMIC_CACHE = 'paes-dynamic-v3.0.0';
const API_CACHE = 'paes-api-v3.0.0';

// URLs críticas que deben estar disponibles offline
const CRITICAL_URLS = [
  '/',
  '/manifest.json',
  '/offline.html',
  // Assets críticos serán agregados dinámicamente durante el build
];

// Patrones de URLs para diferentes estrategias de caching
const CACHE_STRATEGIES = {
  // Cache First - Assets estáticos
  CACHE_FIRST: [
    /\.(?:css|js|woff|woff2|ttf|eot)$/,
    /\/assets\//,
    /\/icons\//
  ],
  
  // Network First - APIs y datos dinámicos
  NETWORK_FIRST: [
    /\/api\//,
    /supabase\.co/,
    /openrouter\.ai/
  ],
  
  // Stale While Revalidate - Contenido que puede estar desactualizado
  STALE_WHILE_REVALIDATE: [
    /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
    /\/components\//
  ]
};

// Configuración de tiempos de vida del cache
const CACHE_TTL = {
  STATIC: 24 * 60 * 60 * 1000, // 24 horas
  DYNAMIC: 4 * 60 * 60 * 1000,  // 4 horas
  API: 30 * 60 * 1000,          // 30 minutos
  IMAGES: 7 * 24 * 60 * 60 * 1000 // 7 días
};

/**
 * Instalación del Service Worker
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker v3.0.0');
  
  event.waitUntil(
    (async () => {
      try {
        // Pre-cache de recursos críticos
        const staticCache = await caches.open(STATIC_CACHE);
        await staticCache.addAll(CRITICAL_URLS);
        
        // Skip waiting para activar inmediatamente
        await self.skipWaiting();
        
        console.log('[SW] Installation completed successfully');
      } catch (error) {
        console.error('[SW] Installation failed:', error);
      }
    })()
  );
});

/**
 * Activación del Service Worker
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker v3.0.0');
  
  event.waitUntil(
    (async () => {
      try {
        // Limpiar caches antiguos
        const cacheNames = await caches.keys();
        const deletePromises = cacheNames
          .filter(name => !name.includes('v3.0.0'))
          .map(name => caches.delete(name));
        
        await Promise.all(deletePromises);
        
        // Tomar control de todos los clientes inmediatamente
        await self.clients.claim();
        
        // Inicializar background sync
        await initializeBackgroundSync();
        
        console.log('[SW] Activation completed successfully');
      } catch (error) {
        console.error('[SW] Activation failed:', error);
      }
    })()
  );
});

/**
 * Interceptar y manejar requests
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other protocols
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  event.respondWith(
    handleRequest(request).catch(error => {
      console.error('[SW] Request handling failed:', error);
      return handleOfflineResponse(request);
    })
  );
});

/**
 * Manejo inteligente de requests
 */
async function handleRequest(request) {
  const url = new URL(request.url);
  const requestURL = request.url;
  
  // Determinar estrategia de caching
  let strategy = 'network-first'; // default
  
  for (const [strategyName, patterns] of Object.entries(CACHE_STRATEGIES)) {
    if (patterns.some(pattern => pattern.test(requestURL))) {
      strategy = strategyName.toLowerCase().replace('_', '-');
      break;
    }
  }
  
  // Aplicar estrategia correspondiente
  switch (strategy) {
    case 'cache-first':
      return await cacheFirstStrategy(request);
    case 'network-first':
      return await networkFirstStrategy(request);
    case 'stale-while-revalidate':
      return await staleWhileRevalidateStrategy(request);
    default:
      return await networkFirstStrategy(request);
  }
}

/**
 * Estrategia Cache First
 */
async function cacheFirstStrategy(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Verificar si el cache ha expirado
    const cacheTimestamp = cachedResponse.headers.get('sw-cache-timestamp');
    if (cacheTimestamp && (Date.now() - parseInt(cacheTimestamp)) > CACHE_TTL.STATIC) {
      // Cache expirado, intentar actualizar en background
      updateCacheInBackground(request, cache);
    }
    return cachedResponse;
  }
  
  // No está en cache, ir a la red
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await cacheResponse(cache, request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return handleOfflineResponse(request);
  }
}

/**
 * Estrategia Network First
 */
async function networkFirstStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache response para uso offline
      await cacheResponse(cache, request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      // Add header to indicate cached response
      const headers = new Headers(cachedResponse.headers);
      headers.set('sw-cache-fallback', 'true');
      
      return new Response(cachedResponse.body, {
        status: cachedResponse.status,
        statusText: cachedResponse.statusText,
        headers
      });
    }
    
    return handleOfflineResponse(request);
  }
}

/**
 * Estrategia Stale While Revalidate
 */
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Siempre intentar actualizar en background
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cacheResponse(cache, request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => null);
  
  // Retornar cached response inmediatamente si existe
  return cachedResponse || (await fetchPromise) || handleOfflineResponse(request);
}

/**
 * Cache response con metadata
 */
async function cacheResponse(cache, request, response) {
  // Add timestamp header
  const headers = new Headers(response.headers);
  headers.set('sw-cache-timestamp', Date.now().toString());
  
  const modifiedResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
  
  await cache.put(request, modifiedResponse);
}

/**
 * Actualizar cache en background
 */
async function updateCacheInBackground(request, cache) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await cacheResponse(cache, request, networkResponse);
    }
  } catch (error) {
    // Silent fail para background updates
    console.log('[SW] Background cache update failed:', error.message);
  }
}

/**
 * Manejo de respuestas offline
 */
async function handleOfflineResponse(request) {
  const url = new URL(request.url);
  
  // Para navegación, retornar página offline
  if (request.mode === 'navigate') {
    const cache = await caches.open(STATIC_CACHE);
    const offlinePage = await cache.match('/offline.html');
    if (offlinePage) {
      return offlinePage;
    }
  }
  
  // Para APIs, retornar respuesta JSON con error
  if (url.pathname.startsWith('/api/')) {
    return new Response(
      JSON.stringify({
        error: 'Sin conexión',
        message: 'Esta funcionalidad requiere conexión a internet',
        offline: true
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  
  // Para imágenes, retornar placeholder
  if (request.destination === 'image') {
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" fill="#9ca3af">Sin conexión</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
  
  // Respuesta genérica de error
  return new Response('Sin conexión', { status: 503 });
}

/**
 * Background Sync para operaciones críticas
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'neural-metrics-sync') {
    event.waitUntil(syncNeuralMetrics());
  } else if (event.tag === 'progress-sync') {
    event.waitUntil(syncUserProgress());
  } else if (event.tag === 'exercise-answers-sync') {
    event.waitUntil(syncExerciseAnswers());
  }
});

/**
 * Sincronización de métricas neurales
 */
async function syncNeuralMetrics() {
  try {
    const db = await openIndexedDB();
    const metrics = await getUnsyncedData(db, 'neural-metrics');
    
    for (const metric of metrics) {
      try {
        await fetch('/api/neural-metrics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(metric.data)
        });
        
        // Marcar como sincronizado
        await markAsSynced(db, 'neural-metrics', metric.id);
      } catch (error) {
        console.log('[SW] Failed to sync metric:', metric.id, error);
      }
    }
  } catch (error) {
    console.error('[SW] Neural metrics sync failed:', error);
    throw error;
  }
}

/**
 * Sincronización de progreso del usuario
 */
async function syncUserProgress() {
  try {
    const db = await openIndexedDB();
    const progressData = await getUnsyncedData(db, 'user-progress');
    
    for (const progress of progressData) {
      try {
        await fetch('/api/user-progress', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(progress.data)
        });
        
        await markAsSynced(db, 'user-progress', progress.id);
      } catch (error) {
        console.log('[SW] Failed to sync progress:', progress.id, error);
      }
    }
  } catch (error) {
    console.error('[SW] User progress sync failed:', error);
    throw error;
  }
}

/**
 * Sincronización de respuestas de ejercicios
 */
async function syncExerciseAnswers() {
  try {
    const db = await openIndexedDB();
    const answers = await getUnsyncedData(db, 'exercise-answers');
    
    for (const answer of answers) {
      try {
        await fetch('/api/exercise-answers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(answer.data)
        });
        
        await markAsSynced(db, 'exercise-answers', answer.id);
      } catch (error) {
        console.log('[SW] Failed to sync answer:', answer.id, error);
      }
    }
  } catch (error) {
    console.error('[SW] Exercise answers sync failed:', error);
    throw error;
  }
}

/**
 * Inicializar sistema de background sync
 */
async function initializeBackgroundSync() {
  if ('serviceWorker' in self && 'sync' in self.ServiceWorkerRegistration.prototype) {
    console.log('[SW] Background Sync initialized');
    
    // Configurar sync periódico cada 5 minutos
    setInterval(() => {
      if (navigator.onLine) {
        self.registration.sync.register('neural-metrics-sync');
        self.registration.sync.register('progress-sync');
        self.registration.sync.register('exercise-answers-sync');
      }
    }, 5 * 60 * 1000);
  }
}

/**
 * Manejo de mensajes desde el cliente
 */
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      event.ports[0].postMessage({ success: true });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      }).catch(error => {
        event.ports[0].postMessage({ success: false, error: error.message });
      });
      break;
      
    case 'CACHE_URLS':
      cacheSpecificUrls(data.urls).then(() => {
        event.ports[0].postMessage({ success: true });
      }).catch(error => {
        event.ports[0].postMessage({ success: false, error: error.message });
      });
      break;
      
    case 'GET_CACHE_STATUS':
      getCacheStatus().then(status => {
        event.ports[0].postMessage({ success: true, data: status });
      }).catch(error => {
        event.ports[0].postMessage({ success: false, error: error.message });
      });
      break;
  }
});

/**
 * Limpiar todos los caches
 */
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
}

/**
 * Cache URLs específicas
 */
async function cacheSpecificUrls(urls) {
  const cache = await caches.open(DYNAMIC_CACHE);
  await cache.addAll(urls);
}

/**
 * Obtener estado del cache
 */
async function getCacheStatus() {
  const cacheNames = await caches.keys();
  const status = {};
  
  for (const name of cacheNames) {
    const cache = await caches.open(name);
    const keys = await cache.keys();
    status[name] = {
      size: keys.length,
      lastModified: Date.now() // Simplificado
    };
  }
  
  return status;
}

/**
 * Utilidades para IndexedDB
 */
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('paes-offline-data', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Crear stores si no existen
      if (!db.objectStoreNames.contains('neural-metrics')) {
        db.createObjectStore('neural-metrics', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('user-progress')) {
        db.createObjectStore('user-progress', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('exercise-answers')) {
        db.createObjectStore('exercise-answers', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

async function getUnsyncedData(db, storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    
    request.onsuccess = () => {
      const data = request.result.filter(item => !item.synced);
      resolve(data);
    };
    request.onerror = () => reject(request.error);
  });
}

async function markAsSynced(db, storeName, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const getRequest = store.get(id);
    
    getRequest.onsuccess = () => {
      const data = getRequest.result;
      data.synced = true;
      data.syncedAt = new Date().toISOString();
      
      const putRequest = store.put(data);
      putRequest.onsuccess = () => resolve();
      putRequest.onerror = () => reject(putRequest.error);
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
}

console.log('[SW] Advanced Service Worker loaded successfully');
