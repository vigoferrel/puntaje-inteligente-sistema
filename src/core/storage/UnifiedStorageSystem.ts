/**
 * UNIFIED STORAGE SYSTEM v5.0 - CIRCUIT BREAKER ULTRA-AGRESIVO
 * Sistema con protección máxima contra tracking prevention
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
  
  // Circuit breaker configuración ULTRA-AGRESIVA
  private readonly MAX_ALERTS = 2; // Solo 2 alertas antes de circuit breaker
  private readonly ALERT_WINDOW = 3000; // 3 segundos
  private readonly CIRCUIT_BREAKER_DURATION = 120000; // 2 minutos
  private readonly EXPONENTIAL_BACKOFF_BASE = 2;
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
      // Test ÚNICO y completamente silencioso
      const testKey = '__ultra_silent_test__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      
      this.storageAvailable = true;
      this.trackingBlocked = false;
      console.log('✅ Storage available');
      
    } catch (error) {
      // ACTIVAR CIRCUIT BREAKER INMEDIATAMENTE sin logs adicionales
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
    console.log('📱 Solo memoria cache activa');
    
    // Exponential backoff para reintentos
    const backoffDelay = this.CIRCUIT_BREAKER_DURATION * Math.pow(this.EXPONENTIAL_BACKOFF_BASE, this.circuitBreakerRetries);
    this.circuitBreakerRetries++;
    
    setTimeout(() => {
      this.resetCircuitBreaker();
    }, Math.min(backoffDelay, 300000)); // Máximo 5 minutos
  }

  private resetCircuitBreaker() {
    console.log('🔄 Intentando reset de circuit breaker...');
    
    try {
      // Test ultra-silencioso
      const testKey = '__reset_test_silent__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      
      // Si llegamos aquí, storage funciona
      this.circuitBreakerActive = false;
      this.storageAvailable = true;
      this.trackingBlocked = false;
      this.alertCount = 0;
      this.circuitBreakerRetries = 0;
      
      console.log('✅ Circuit breaker reseteado - storage disponible');
      
    } catch (error) {
      // Sigue bloqueado, extender con exponential backoff
      console.log('⚠️ Storage aún bloqueado, reintentando con backoff');
      const nextBackoff = this.CIRCUIT_BREAKER_DURATION * Math.pow(this.EXPONENTIAL_BACKOFF_BASE, this.circuitBreakerRetries);
      setTimeout(() => this.resetCircuitBreaker(), Math.min(nextBackoff, 300000));
    }
  }

  async waitForReady(): Promise<void> {
    while (!this.isReady) {
      await new Promise(resolve => setTimeout(resolve, 10));
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

    // Si circuit breaker activo, NO intentar localStorage bajo ninguna circunstancia
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
    
    // Rate limiting ultra-agresivo
    if (now - this.lastAlertTime < 500) {
      return; // Ignorar si hubo alerta hace menos de 500ms
    }
    
    this.alertCount++;
    this.lastAlertTime = now;
    
    // Activar circuit breaker con umbral muy bajo
    if (this.alertCount >= this.MAX_ALERTS) {
      this.activateCircuitBreaker(`Too many ${operation} errors: ${this.alertCount}`);
    }
  }

  private setToCache<K extends CacheKey>(
    key: K,
    data: CacheDataTypes[K],
    ttl = 600000 // 10 minutos por defecto
  ) {
    this.memoryCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      accessCount: 0
    });

    // Limpieza automática más agresiva (máximo 30 items)
    if (this.memoryCache.size > 30) {
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

  clear(): void {
    this.memoryCache.clear();
    this.alertCount = 0;
    this.lastAlertTime = 0;
    this.circuitBreakerRetries = 0;
  }
}

export const unifiedStorageSystem = UnifiedStorageSystemCore.getInstance();
