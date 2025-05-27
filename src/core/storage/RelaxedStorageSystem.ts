
/**
 * RELAXED STORAGE SYSTEM v9.0 - ULTRA TOLERANTE
 * Sistema con tolerancia máxima y recovery inteligente
 */

import { CacheDataTypes, CacheKey } from './types';

interface RelaxedStorageEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
}

interface RelaxedStorageStatus {
  isReady: boolean;
  storageAvailable: boolean;
  trackingBlocked: boolean;
  cacheSize: number;
  alertCount: number;
  gracefulMode: boolean;
  recoveryAttempts: number;
}

class RelaxedStorageSystemCore {
  private static instance: RelaxedStorageSystemCore;
  private isReady = false;
  private storageAvailable = false;
  private trackingBlocked = false;
  private memoryCache = new Map<string, RelaxedStorageEntry>();
  private alertCount = 0;
  private gracefulMode = false;
  private recoveryAttempts = 0;
  private lastRecoveryTime = 0;
  
  // Ultra tolerante - configuración relajada
  private readonly MAX_ALERTS = 10; // Aumentado de 5 a 10
  private readonly ALERT_RESET_TIME = 30000; // 30 segundos
  private readonly RECOVERY_INTERVAL = 300000; // 5 minutos
  private readonly MAX_RECOVERY_ATTEMPTS = 3;

  static getInstance(): RelaxedStorageSystemCore {
    if (!RelaxedStorageSystemCore.instance) {
      RelaxedStorageSystemCore.instance = new RelaxedStorageSystemCore();
    }
    return RelaxedStorageSystemCore.instance;
  }

  private constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      const testKey = '__relaxed_test_v9__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      
      this.storageAvailable = true;
      this.trackingBlocked = false;
      this.gracefulMode = false;
      console.log('✅ Relaxed Storage v9.0 - modo ultra tolerante');
      
    } catch (error) {
      this.activateGracefulMode('Inicialización - modo tolerante activo');
    }
    
    this.isReady = true;
    this.startPeriodicRecovery();
  }

  private activateGracefulMode(reason: string) {
    this.gracefulMode = true;
    this.storageAvailable = false;
    this.trackingBlocked = true;
    
    console.log(`🟡 MODO GRACEFUL ACTIVADO: ${reason}`);
    console.log('📱 Funcionando completamente en memoria - experiencia completa garantizada');
  }

  private startPeriodicRecovery() {
    setInterval(() => {
      if (this.gracefulMode && this.recoveryAttempts < this.MAX_RECOVERY_ATTEMPTS) {
        this.attemptRecovery();
      }
      
      // Reset alerts periódicamente
      if (Date.now() - this.lastRecoveryTime > this.ALERT_RESET_TIME) {
        this.alertCount = Math.max(0, this.alertCount - 1);
      }
    }, this.RECOVERY_INTERVAL);
  }

  private attemptRecovery() {
    if (Date.now() - this.lastRecoveryTime < this.RECOVERY_INTERVAL) {
      return; // Evitar recovery muy frecuente
    }

    console.log('🔄 Intento de recovery automático...');
    this.recoveryAttempts++;
    this.lastRecoveryTime = Date.now();
    
    try {
      const testKey = '__recovery_test_v9__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      
      // Recovery exitoso
      this.gracefulMode = false;
      this.storageAvailable = true;
      this.trackingBlocked = false;
      this.alertCount = 0;
      this.recoveryAttempts = 0;
      
      console.log('✅ Recovery automático exitoso - storage restaurado');
    } catch (error) {
      console.log(`⚠️ Recovery intento ${this.recoveryAttempts} fallido - continuando en modo graceful`);
    }
  }

  private handleStorageError(operation: string) {
    this.alertCount++;
    
    // Solo activar modo graceful después de MUCHOS errores
    if (this.alertCount >= this.MAX_ALERTS && !this.gracefulMode) {
      this.activateGracefulMode(`${this.MAX_ALERTS} errores en ${operation}`);
    }
  }

  async waitForReady(): Promise<void> {
    let attempts = 0;
    while (!this.isReady && attempts < 30) { // Reducido de 50 a 30
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
  }

  getItem<K extends CacheKey>(key: K): CacheDataTypes[K] | null {
    const keyStr = String(key);
    
    // Siempre probar cache L1 primero
    const cached = this.memoryCache.get(keyStr);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      cached.accessCount++;
      return cached.data as CacheDataTypes[K];
    }

    // Si modo graceful está activo, solo memoria
    if (this.gracefulMode) {
      return null;
    }

    // Intentar localStorage solo si disponible
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
    
    // SIEMPRE actualizar cache L1 - nunca falla
    this.setToCache(key, value, options.ttl);

    // Si modo graceful, solo memoria (éxito garantizado)
    if (this.gracefulMode) {
      return true;
    }

    // Intentar localStorage si disponible
    if (this.storageAvailable) {
      try {
        localStorage.setItem(keyStr, JSON.stringify(value));
        return true;
      } catch (error) {
        if (!options.silentErrors) {
          this.handleStorageError('setItem');
        }
        // Incluso si localStorage falla, tenemos memoria cache
        return true;
      }
    }

    return true; // Siempre éxito con memoria cache
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

    // Limpieza tolerante (máximo 100 items)
    if (this.memoryCache.size > 100) {
      this.cleanupCache();
    }
  }

  private cleanupCache() {
    const entries = Array.from(this.memoryCache.entries());
    const now = Date.now();
    
    // Solo remover entradas muy antiguas (más tolerante)
    entries
      .filter(([, entry]) => now - entry.timestamp > entry.ttl * 3)
      .slice(0, 20) // Máximo 20 por limpieza
      .forEach(([key]) => this.memoryCache.delete(key));
  }

  removeItem(key: string): boolean {
    this.memoryCache.delete(key);
    
    if (this.storageAvailable && !this.gracefulMode) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        this.handleStorageError('removeItem');
      }
    }
    return true;
  }

  getStatus(): RelaxedStorageStatus {
    return {
      isReady: this.isReady,
      storageAvailable: this.storageAvailable,
      trackingBlocked: this.trackingBlocked,
      cacheSize: this.memoryCache.size,
      alertCount: this.alertCount,
      gracefulMode: this.gracefulMode,
      recoveryAttempts: this.recoveryAttempts
    };
  }

  getPerformanceMetrics() {
    return {
      cacheSize: this.memoryCache.size,
      alertCount: this.alertCount,
      trackingBlocked: this.trackingBlocked,
      gracefulMode: this.gracefulMode,
      recoveryAttempts: this.recoveryAttempts,
      memoryUsage: this.memoryCache.size * 1024,
      ultraTolerantMode: true
    };
  }

  clear(): void {
    this.memoryCache.clear();
    this.alertCount = 0;
    this.gracefulMode = false;
    this.recoveryAttempts = 0;
  }
}

export const relaxedStorageSystem = RelaxedStorageSystemCore.getInstance();
