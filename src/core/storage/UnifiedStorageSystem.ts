
/**
 * UNIFIED STORAGE SYSTEM v8.0 - CIRCUIT BREAKER RELAJADO
 * Sistema con circuit breaker tolerante y modo graceful degradation
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
  gracefulDegradation: boolean;
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
  private gracefulDegradation = false;
  
  // Circuit breaker RELAJADO v8.0 - Mayor tolerancia
  private readonly MAX_ALERTS = 5; // Aumentado de 1 a 5
  private readonly ALERT_WINDOW = 10000; // 10 segundos (más tolerante)
  private readonly CIRCUIT_BREAKER_DURATION = 600000; // 10 minutos (reducido)
  private readonly GRACEFUL_DEGRADATION_THRESHOLD = 3;

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
      // Test TOLERANTE v8.0
      const testKey = '__graceful_test_v8__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      
      this.storageAvailable = true;
      this.trackingBlocked = false;
      console.log('✅ Storage v8.0 - modo tolerante');
      
    } catch (error) {
      // ACTIVAR DEGRADACIÓN GRACEFUL primero
      this.activateGracefulDegradation('Primera detección - modo graceful');
    }
    
    this.isReady = true;
  }

  private activateGracefulDegradation(reason: string) {
    this.gracefulDegradation = true;
    this.storageAvailable = false;
    this.trackingBlocked = true;
    
    console.log(`⚠️ DEGRADACIÓN GRACEFUL: ${reason}`);
    console.log('📱 Modo memoria con recovery automático');
    
    // Auto-recovery después de 10 minutos
    setTimeout(() => {
      this.attemptRecovery();
    }, 600000);
  }

  private activateCircuitBreakerRelajado(reason: string) {
    this.circuitBreakerActive = true;
    this.storageAvailable = false;
    this.trackingBlocked = true;
    this.alertCount = this.MAX_ALERTS;
    
    console.log(`🔄 CIRCUIT BREAKER RELAJADO: ${reason}`);
    
    // Auto-recovery después de 10 minutos
    setTimeout(() => {
      this.attemptRecovery();
    }, this.CIRCUIT_BREAKER_DURATION);
  }

  private attemptRecovery() {
    console.log('🔄 Intentando recovery automático...');
    
    try {
      const testKey = '__recovery_test_v8__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      
      // Recovery exitoso
      this.circuitBreakerActive = false;
      this.gracefulDegradation = false;
      this.storageAvailable = true;
      this.trackingBlocked = false;
      this.alertCount = 0;
      this.lastAlertTime = 0;
      
      console.log('✅ Recovery automático exitoso');
    } catch (error) {
      // Recovery fallido - mantener degradación graceful
      console.log('⚠️ Recovery fallido - manteniendo modo graceful');
      this.gracefulDegradation = true;
    }
  }

  private handleStorageError(operation: string) {
    const now = Date.now();
    
    // Rate limiting tolerante
    if (now - this.lastAlertTime < 5000) { // 5 segundos
      return;
    }
    
    this.alertCount++;
    this.lastAlertTime = now;
    
    // Degradación graceful en umbral 3
    if (this.alertCount >= this.GRACEFUL_DEGRADATION_THRESHOLD && !this.gracefulDegradation) {
      this.activateGracefulDegradation(`Error en ${operation} - alerta #${this.alertCount}`);
    }
    
    // Circuit breaker solo en máximo (5 alertas)
    if (this.alertCount >= this.MAX_ALERTS && !this.circuitBreakerActive) {
      this.activateCircuitBreakerRelajado(`Múltiples errores en ${operation}`);
    }
  }

  async waitForReady(): Promise<void> {
    let attempts = 0;
    while (!this.isReady && attempts < 50) { // 5 segundos máximo
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
  }

  getItem<K extends CacheKey>(key: K): CacheDataTypes[K] | null {
    const keyStr = String(key);
    
    // SIEMPRE usar cache L1 primero
    const cached = this.memoryCache.get(keyStr);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      cached.accessCount++;
      return cached.data as CacheDataTypes[K];
    }

    // Si hay degradación graceful O circuit breaker, solo memoria
    if (this.gracefulDegradation || this.circuitBreakerActive) {
      return null;
    }

    // Intentar localStorage solo si está disponible
    if (this.storageAvailable) {
      try {
        const item = localStorage.getItem(keyStr);
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
    const keyStr = String(key);
    
    // SIEMPRE actualizar cache L1
    this.setToCache(key, value, options.ttl);

    // Si hay degradación o circuit breaker, solo memoria
    if (this.gracefulDegradation || this.circuitBreakerActive) {
      return true; // Éxito en memoria
    }

    // Intentar localStorage
    if (this.storageAvailable) {
      try {
        localStorage.setItem(keyStr, JSON.stringify(value));
        return true;
      } catch (error) {
        if (!options.silentErrors) {
          this.handleStorageError('setItem');
        }
        return false;
      }
    }

    return true;
  }

  private setToCache<K extends CacheKey>(
    key: K,
    data: CacheDataTypes[K],
    ttl = 1800000 // 30 minutos
  ) {
    const keyStr = String(key);
    this.memoryCache.set(keyStr, {
      data,
      timestamp: Date.now(),
      ttl,
      accessCount: 0
    });

    // Limpieza tolerante (máximo 50 items)
    if (this.memoryCache.size > 50) {
      this.cleanupCache();
    }
  }

  private cleanupCache() {
    const entries = Array.from(this.memoryCache.entries());
    const now = Date.now();
    
    // Remover solo entradas muy antiguas
    entries
      .filter(([, entry]) => now - entry.timestamp > entry.ttl * 2)
      .slice(0, 10)
      .forEach(([key]) => this.memoryCache.delete(key));
  }

  removeItem(key: string): boolean {
    this.memoryCache.delete(key);
    
    if (this.storageAvailable && !this.gracefulDegradation && !this.circuitBreakerActive) {
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
      circuitBreakerActive: this.circuitBreakerActive,
      gracefulDegradation: this.gracefulDegradation
    };
  }

  getPerformanceMetrics() {
    return {
      cacheSize: this.memoryCache.size,
      queueLength: 0,
      alertCount: this.alertCount,
      trackingBlocked: this.trackingBlocked,
      circuitBreakerActive: this.circuitBreakerActive,
      gracefulDegradation: this.gracefulDegradation,
      syncQueueSize: 0,
      memoryUsage: this.memoryCache.size * 1024,
      recoveryMode: this.gracefulDegradation || this.circuitBreakerActive
    };
  }

  // Reset manual para testing
  forceReset(): void {
    this.circuitBreakerActive = false;
    this.gracefulDegradation = false;
    this.storageAvailable = true;
    this.trackingBlocked = false;
    this.alertCount = 0;
    this.lastAlertTime = 0;
    console.log('🔄 Storage system reseteado - modo tolerante v8.0');
  }

  clear(): void {
    this.memoryCache.clear();
    this.alertCount = 0;
    this.lastAlertTime = 0;
    this.gracefulDegradation = false;
  }
}

export const unifiedStorageSystem = UnifiedStorageSystemCore.getInstance();
