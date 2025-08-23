import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personalizado para manejar Service Worker avanzado
 * Proporciona control completo sobre PWA, cache y offline sync
 */

interface ServiceWorkerState {
  isSupported: boolean;
  isInstalled: boolean;
  isWaitingForUpdate: boolean;
  isOnline: boolean;
  cacheStatus: CacheStatus | null;
  syncStatus: SyncStatus;
}

interface CacheStatus {
  [cacheName: string]: {
    size: number;
    lastModified: number;
  };
}

interface SyncStatus {
  neuralMetrics: 'idle' | 'syncing' | 'completed' | 'failed';
  userProgress: 'idle' | 'syncing' | 'completed' | 'failed';
  exerciseAnswers: 'idle' | 'syncing' | 'completed' | 'failed';
}

export const useServiceWorker = () => {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: 'serviceWorker' in navigator,
    isInstalled: false,
    isWaitingForUpdate: false,
    isOnline: navigator.onLine,
    cacheStatus: null,
    syncStatus: {
      neuralMetrics: 'idle',
      userProgress: 'idle',
      exerciseAnswers: 'idle'
    }
  });

  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  /**
   * Registrar Service Worker
   */
  const registerServiceWorker = useCallback(async () => {
    if (!state.isSupported) {
      console.warn('Service Worker no soportado');
      return false;
    }

    try {
      const reg = await navigator.serviceWorker.register('/sw-advanced.js', {
        scope: '/',
        updateViaCache: 'none'
      });

      setRegistration(reg);
      
      setState(prev => ({
        ...prev,
        isInstalled: true
      }));

      // Escuchar actualizaciones
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setState(prev => ({
                ...prev,
                isWaitingForUpdate: true
              }));
            }
          });
        }
      });

      console.log('Service Worker registrado exitosamente');
      return true;
    } catch (error) {
      console.error('Error registrando Service Worker:', error);
      return false;
    }
  }, [state.isSupported]);

  /**
   * Actualizar Service Worker
   */
  const updateServiceWorker = useCallback(async () => {
    if (!registration) return false;

    try {
      if (registration.waiting) {
        const messageChannel = new MessageChannel();
        
        messageChannel.port1.onmessage = (event) => {
          if (event.data.success) {
            setState(prev => ({
              ...prev,
              isWaitingForUpdate: false
            }));
            window.location.reload();
          }
        };

        registration.waiting.postMessage({ type: 'SKIP_WAITING' }, [messageChannel.port2]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error actualizando Service Worker:', error);
      return false;
    }
  }, [registration]);

  /**
   * Limpiar cache
   */
  const clearCache = useCallback(async () => {
    if (!registration || !registration.active) return false;

    try {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        if (event.data.success) {
          console.log('Cache limpiado exitosamente');
          getCacheStatus();
        } else {
          console.error('Error limpiando cache:', event.data.error);
        }
      };

      registration.active.postMessage(
        { type: 'CLEAR_CACHE' },
        [messageChannel.port2]
      );
      
      return true;
    } catch (error) {
      console.error('Error limpiando cache:', error);
      return false;
    }
  }, [registration]);

  /**
   * Obtener estado del cache
   */
  const getCacheStatus = useCallback(async () => {
    if (!registration || !registration.active) return null;

    try {
      const messageChannel = new MessageChannel();
      
      return new Promise<CacheStatus | null>((resolve) => {
        messageChannel.port1.onmessage = (event) => {
          if (event.data.success) {
            const cacheStatus = event.data.data;
            setState(prev => ({
              ...prev,
              cacheStatus
            }));
            resolve(cacheStatus);
          } else {
            resolve(null);
          }
        };

        registration.active!.postMessage(
          { type: 'GET_CACHE_STATUS' },
          [messageChannel.port2]
        );
      });
    } catch (error) {
      console.error('Error obteniendo estado del cache:', error);
      return null;
    }
  }, [registration]);

  /**
   * Cache URLs específicas
   */
  const cacheUrls = useCallback(async (urls: string[]) => {
    if (!registration || !registration.active) return false;

    try {
      const messageChannel = new MessageChannel();
      
      return new Promise<boolean>((resolve) => {
        messageChannel.port1.onmessage = (event) => {
          resolve(event.data.success);
        };

        registration.active!.postMessage(
          { 
            type: 'CACHE_URLS',
            data: { urls }
          },
          [messageChannel.port2]
        );
      });
    } catch (error) {
      console.error('Error cacheando URLs:', error);
      return false;
    }
  }, [registration]);

  /**
   * Forzar sincronización
   */
  const forceSync = useCallback(async (type: 'neural-metrics' | 'progress' | 'exercise-answers' = 'neural-metrics') => {
    if (!registration) return false;

    try {
      setState(prev => ({
        ...prev,
        syncStatus: {
          ...prev.syncStatus,
          [type.replace('-', '')] as keyof SyncStatus: 'syncing'
        }
      }));

      await registration.sync.register(`${type}-sync`);
      
      // Simular completion después de un delay
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          syncStatus: {
            ...prev.syncStatus,
            [type.replace('-', '') as keyof SyncStatus]: Math.random() > 0.2 ? 'completed' : 'failed'
          }
        }));
      }, 2000);

      return true;
    } catch (error) {
      console.error('Error forzando sincronización:', error);
      setState(prev => ({
        ...prev,
        syncStatus: {
          ...prev.syncStatus,
          [type.replace('-', '') as keyof SyncStatus]: 'failed'
        }
      }));
      return false;
    }
  }, [registration]);

  /**
   * Obtener métricas de performance del SW
   */
  const getPerformanceMetrics = useCallback(async () => {
    try {
      const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      const navigationTiming = entries[0];
      
      const metrics = {
        loadTime: navigationTiming.loadEventEnd - navigationTiming.fetchStart,
        domContentLoaded: navigationTiming.domContentLoadedEventEnd - navigationTiming.fetchStart,
        firstPaint: 0,
        firstContentfulPaint: 0,
        cacheHits: 0,
        cacheMisses: 0
      };

      // Obtener Paint Timing
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach(entry => {
        if (entry.name === 'first-paint') {
          metrics.firstPaint = entry.startTime;
        } else if (entry.name === 'first-contentful-paint') {
          metrics.firstContentfulPaint = entry.startTime;
        }
      });

      // Estimar cache hits/misses basado en tiempos de respuesta
      const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      resourceEntries.forEach(entry => {
        if (entry.duration < 50) { // Probablemente del cache
          metrics.cacheHits++;
        } else {
          metrics.cacheMisses++;
        }
      });

      return metrics;
    } catch (error) {
      console.error('Error obteniendo métricas:', error);
      return null;
    }
  }, []);

  /**
   * Verificar si la app puede funcionar offline
   */
  const checkOfflineCapability = useCallback(async () => {
    try {
      const caches = await window.caches.keys();
      const hasRequiredCaches = caches.some(cache => cache.includes('paes-static'));
      
      return {
        hasServiceWorker: state.isInstalled,
        hasCachedContent: hasRequiredCaches,
        isFullyOfflineCapable: state.isInstalled && hasRequiredCaches,
        estimatedOfflineSize: await estimateCacheSize()
      };
    } catch (error) {
      console.error('Error verificando capacidad offline:', error);
      return {
        hasServiceWorker: false,
        hasCachedContent: false,
        isFullyOfflineCapable: false,
        estimatedOfflineSize: 0
      };
    }
  }, [state.isInstalled]);

  /**
   * Estimar tamaño del cache
   */
  const estimateCacheSize = useCallback(async () => {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        return estimate.usage || 0;
      }
      return 0;
    } catch (error) {
      console.error('Error estimando tamaño de cache:', error);
      return 0;
    }
  }, []);

  /**
   * Pre-cache contenido crítico
   */
  const precacheContent = useCallback(async (routes: string[]) => {
    const criticalContent = [
      '/',
      '/lectoguia',
      '/diagnostic',
      '/financial',
      ...routes
    ];

    return await cacheUrls(criticalContent);
  }, [cacheUrls]);

  // Efectos
  useEffect(() => {
    // Registrar automáticamente en producción
    if (process.env.NODE_ENV === 'production') {
      registerServiceWorker();
    }

    // Escuchar cambios de conectividad
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOnline: true }));
      // Intentar sincronizar cuando se restaure la conexión
      forceSync('neural-metrics');
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [registerServiceWorker, forceSync]);

  // Auto-refresh cache status cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.isInstalled) {
        getCacheStatus();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [state.isInstalled, getCacheStatus]);

  return {
    // Estado
    ...state,
    
    // Acciones principales
    registerServiceWorker,
    updateServiceWorker,
    clearCache,
    
    // Cache management
    getCacheStatus,
    cacheUrls,
    precacheContent,
    
    // Sincronización
    forceSync,
    
    // Métricas y diagnósticos
    getPerformanceMetrics,
    checkOfflineCapability,
    estimateCacheSize,
    
    // Utilidades
    isOfflineCapable: state.isInstalled && state.cacheStatus !== null,
    hasPendingUpdates: state.isWaitingForUpdate,
    syncProgress: state.syncStatus
  };
};

export default useServiceWorker;
