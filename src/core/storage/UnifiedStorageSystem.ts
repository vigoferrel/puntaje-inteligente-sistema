
/**
 * UNIFIED STORAGE SYSTEM v6.0 - CIRCUIT BREAKER ULTRA-AGRESIVO
 * Sistema con activación inmediata en primera alerta de tracking prevention
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
  
  // Circuit breaker ULTRA-AGRESIVO - activación en primera alerta
  private readonly MAX_ALERTS = 1; // UNA SOLA alerta activa circuit breaker
  private readonly ALERT_WINDOW = 1000; // 1 segundo
  private readonly CIRCUIT_BREAKER_DURATION = 300000; // 5 minutos permanente
  private readonly EXPONENTIAL_BACKOFF_BASE = 3;
  private circuitBreakerRetries = 0;

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
      // Test ÚNICO ultra-silencioso
      const testKey = '__ultra_silent_test_v6__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      
      this.storageAvailable = true;
      this.trackingBlocked = false;
      console.log('✅ Storage disponible - modo normal');
      
    } catch (error) {
      // ACTIVAR CIRCUIT BREAKER INMEDIATAMENTE
      this.activateCircuitBreakerInstant('Primera detección de tracking prevention');
    }
    
    this.isReady = true;
  }

  private activateCircuitBreakerInstant(reason: string) {
    this.circuitBreakerActive = true;
    this.storageAvailable = false;
    this.trackingBlocked = true;
    this.alertCount = 1;
    
    console.log(`🚨 CIRCUIT BREAKER ACTIVADO INSTANTÁNEAMENTE: ${reason}`);
    console.log('📱 Modo memoria permanente activado');
    
    // NO reintentos automáticos - permanece en modo memoria
    // Solo se puede resetear manualmente
  }

  private handleStorageError(operation: string) {
    const now = Date.now();
    
    // Rate limiting ultra-agresivo
    if (now - this.lastAlertTime < 100) {
      return; // Ignorar si hubo alerta hace menos de 100ms
    }
    
    this.alertCount++;
    this.lastAlertTime = now;
    
    // Activar circuit breaker en PRIMERA alerta
    if (this.alertCount >= this.MAX_ALERTS) {
      this.activateCircuitBreakerInstant(`Error en ${operation} - alerta #${this.alertCount}`);
    }
  }

  async waitForReady(): Promise<void> {
    while (!this.isReady) {
      await new Promise(resolve => setTimeout(resolve, 5));
    }
  }

  getItem<K extends CacheKey>(key: K): CacheDataTypes[K] | null {
    // SIEMPRE usar cache L1 primero (máxima prioridad)
    const cached = this.memoryCache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      cached.accessCount++;
      return cached.data as CacheDataTypes[K];
    }

    // Si circuit breaker activo, JAMÁS intentar localStorage
    if (this.circuitBreakerActive) {
      return null;
    }

    // Solo si storage está disponible Y no hay circuit breaker
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
    // SIEMPRE actualizar cache L1 (prioridad máxima)
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

  private setToCache<K extends CacheKey>(
    key: K,
    data: CacheDataTypes[K],
    ttl = 1800000 // 30 minutos
  ) {
    this.memoryCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      accessCount: 0
    });

    // Limpieza automática más agresiva (máximo 20 items)
    if (this.memoryCache.size > 20) {
      this.cleanupCache();
    }
  }

  private cleanupCache() {
    const entries = Array.from(this.memoryCache.entries());
    const now = Date.now();
    
    // Remover entradas expiradas y menos usadas
    entries
      .filter(([, entry]) => now - entry.timestamp > entry.ttl || entry.accessCount < 2)
      .slice(0, 10) // Remover máximo 10 por vez
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

  // Reset manual para testing
  forceReset(): void {
    this.circuitBreakerActive = false;
    this.storageAvailable = true;
    this.trackingBlocked = false;
    this.alertCount = 0;
    this.lastAlertTime = 0;
    console.log('🔄 Circuit breaker reseteado manualmente');
  }

  clear(): void {
    this.memoryCache.clear();
    this.alertCount = 0;
    this.lastAlertTime = 0;
    this.circuitBreakerRetries = 0;
  }
}

export const unifiedStorageSystem = UnifiedStorageSystemCore.getInstance();
