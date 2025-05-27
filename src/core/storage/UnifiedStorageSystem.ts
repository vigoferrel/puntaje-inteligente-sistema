
/**
 * UNIFIED STORAGE SYSTEM v4.0 - CIRCUIT BREAKER REAL
 * Sistema con protección total contra tracking prevention
 */

import { CacheDataTypes, CacheKey } from './types';

interface StorageEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
}

interface StorageStatus {
  isReady: boolean;
  storageAvailable: boolean;
  trackingBlocked: boolean;
  cacheSize: number;
  queueLength: number;
  alertCount: number;
  circuitBreakerActive: boolean;
}

class UnifiedStorageSystemCore {
  private static instance: UnifiedStorageSystemCore;
  private isReady = false;
  private storageAvailable = false;
  private trackingBlocked = false;
  private memoryCache = new Map<string, StorageEntry>();
  private alertCount = 0;
  private circuitBreakerActive = false;
  private lastAlertTime = 0;
  
  // Circuit breaker configuración AGRESIVA
  private readonly MAX_ALERTS = 3; // Solo 3 alertas antes de circuit breaker
  private readonly ALERT_WINDOW = 5000; // 5 segundos
  private readonly CIRCUIT_BREAKER_DURATION = 60000; // 1 minuto

  static getInstance(): UnifiedStorageSystemCore {
    if (!UnifiedStorageSystemCore.instance) {
      UnifiedStorageSystemCore.instance = new UnifiedStorageSystemCore();
    }
    return UnifiedStorageSystemCore.instance;
  }

  private constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      // Test ÚNICO y silencioso
      const testKey = '__silent_test__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      
      this.storageAvailable = true;
      this.trackingBlocked = false;
      console.log('✅ Storage available');
      
    } catch (error) {
      // ACTIVAR CIRCUIT BREAKER INMEDIATAMENTE
      this.activateCircuitBreaker('Storage blocked by tracking prevention');
    }
    
    this.isReady = true;
  }

  private activateCircuitBreaker(reason: string) {
    if (this.circuitBreakerActive) return;
    
    this.circuitBreakerActive = true;
    this.storageAvailable = false;
    this.trackingBlocked = true;
    
    console.log(`🚨 CIRCUIT BREAKER ACTIVADO: ${reason}`);
    console.log('📱 Funcionando solo con memoria cache');
    
    // Auto-reset después del tiempo configurado
    setTimeout(() => {
      this.resetCircuitBreaker();
    }, this.CIRCUIT_BREAKER_DURATION);
  }

  private resetCircuitBreaker() {
    console.log('🔄 Intentando reset de circuit breaker...');
    
    try {
      // Test silencioso para ver si storage está disponible
      const testKey = '__reset_test__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      
      // Si llegamos aquí, storage funciona
      this.circuitBreakerActive = false;
      this.storageAvailable = true;
      this.trackingBlocked = false;
      this.alertCount = 0;
      
      console.log('✅ Circuit breaker reseteado - storage disponible');
      
    } catch (error) {
      // Sigue bloqueado, extender el circuit breaker
      console.log('⚠️ Storage aún bloqueado, extendiendo circuit breaker');
      setTimeout(() => this.resetCircuitBreaker(), this.CIRCUIT_BREAKER_DURATION);
    }
  }

  async waitForReady(): Promise<void> {
    while (!this.isReady) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  getItem<K extends CacheKey>(key: K): CacheDataTypes[K] | null {
    // SIEMPRE usar cache primero (L1 cache)
    const cached = this.memoryCache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      cached.accessCount++;
      return cached.data as CacheDataTypes[K];
    }

    // Si circuit breaker activo, SOLO memoria
    if (this.circuitBreakerActive) {
      return null;
    }

    // Si storage disponible, intentar cargar
    if (this.storageAvailable) {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item) as CacheDataTypes[K];
          this.setToCache(key, parsed);
          return parsed;
        }
      } catch (error) {
        this.handleStorageError('getItem');
        return null;
      }
    }

    return null;
  }

  setItem<K extends CacheKey>(
    key: K,
    value: CacheDataTypes[K],
    options: { silentErrors?: boolean; ttl?: number } = {}
  ): boolean {
    // SIEMPRE actualizar cache L1
    this.setToCache(key, value, options.ttl);

    // Si circuit breaker activo, NO intentar localStorage
    if (this.circuitBreakerActive) {
      return true; // Éxito en memoria
    }

    // Intentar localStorage solo si está disponible
    if (this.storageAvailable) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        if (!options.silentErrors) {
          this.handleStorageError('setItem');
        }
        return false;
      }
    }

    return true; // Éxito en memoria aunque no se persista
  }

  private handleStorageError(operation: string) {
    const now = Date.now();
    
    // Rate limiting de alertas
    if (now - this.lastAlertTime < 1000) {
      return; // Ignorar si hubo alerta hace menos de 1 segundo
    }
    
    this.alertCount++;
    this.lastAlertTime = now;
    
    // Activar circuit breaker si muchas alertas
    if (this.alertCount >= this.MAX_ALERTS) {
      this.activateCircuitBreaker(`Too many ${operation} errors: ${this.alertCount}`);
    }
  }

  private setToCache<K extends CacheKey>(
    key: K,
    data: CacheDataTypes[K],
    ttl = 300000
  ) {
    this.memoryCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      accessCount: 0
    });

    // Limpieza automática (máximo 50 items en cache)
    if (this.memoryCache.size > 50) {
      this.cleanupCache();
    }
  }

  private cleanupCache() {
    const entries = Array.from(this.memoryCache.entries());
    const now = Date.now();
    
    // Remover entradas expiradas y menos usadas
    entries
      .filter(([, entry]) => now - entry.timestamp > entry.ttl || entry.accessCount < 2)
      .forEach(([key]) => this.memoryCache.delete(key));
  }

  removeItem(key: string): boolean {
    this.memoryCache.delete(key);
    
    if (this.storageAvailable && !this.circuitBreakerActive) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        this.handleStorageError('removeItem');
      }
    }
    return true;
  }

  getStatus(): StorageStatus {
    return {
      isReady: this.isReady,
      storageAvailable: this.storageAvailable,
      trackingBlocked: this.trackingBlocked,
      cacheSize: this.memoryCache.size,
      queueLength: 0,
      alertCount: this.alertCount,
      circuitBreakerActive: this.circuitBreakerActive
    };
  }

  getPerformanceMetrics() {
    return {
      cacheSize: this.memoryCache.size,
      queueLength: 0,
      alertCount: this.alertCount,
      trackingBlocked: this.trackingBlocked,
      circuitBreakerActive: this.circuitBreakerActive,
      syncQueueSize: 0,
      memoryUsage: this.memoryCache.size * 1024
    };
  }

  clear(): void {
    this.memoryCache.clear();
    this.alertCount = 0;
    this.lastAlertTime = 0;
  }
}

export const unifiedStorageSystem = UnifiedStorageSystemCore.getInstance();
