
/**
 * UNIFIED STORAGE SYSTEM v3.0 - DEFINITIVO
 * Sistema de storage con tipos seguros y rate limiting agresivo
 */

import { CacheDataTypes, CacheKey } from './types';

interface StorageEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
}

interface BatchOperation {
  key: string;
  value: any;
  timestamp: number;
}

interface StorageStatus {
  isReady: boolean;
  storageAvailable: boolean;
  trackingBlocked: boolean;
  cacheSize: number;
  queueLength: number;
  alertCount: number;
}

class UnifiedStorageSystemCore {
  private static instance: UnifiedStorageSystemCore;
  private isReady = false;
  private storageAvailable = true;
  private trackingBlocked = false;
  private memoryCache = new Map<string, StorageEntry>();
  private batchQueue: BatchOperation[] = [];
  private alertCount = 0;
  private lastBatchTime = 0;
  private circuitBreakerActive = false;
  
  // Rate limiting agresivo
  private readonly BATCH_INTERVAL = 5000; // 5 segundos
  private readonly MAX_ALERTS = 10;
  private readonly CIRCUIT_BREAKER_THRESHOLD = 15;

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
      // Test silencioso de localStorage
      const testKey = '__storage_test_silent__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      this.storageAvailable = true;
    } catch (error) {
      this.storageAvailable = false;
      this.trackingBlocked = true;
      console.log('🔒 Storage blocked, using memory mode');
    }
    
    this.isReady = true;
    this.startBatchProcessor();
  }

  private startBatchProcessor() {
    setInterval(() => {
      if (this.batchQueue.length > 0 && !this.circuitBreakerActive) {
        this.processBatch();
      }
    }, this.BATCH_INTERVAL);
  }

  private processBatch() {
    if (!this.storageAvailable || this.circuitBreakerActive) return;

    const batch = [...this.batchQueue];
    this.batchQueue = [];

    try {
      batch.forEach(({ key, value }) => {
        localStorage.setItem(key, JSON.stringify(value));
      });
    } catch (error) {
      this.alertCount++;
      if (this.alertCount >= this.CIRCUIT_BREAKER_THRESHOLD) {
        this.activateCircuitBreaker();
      }
    }
  }

  private activateCircuitBreaker() {
    this.circuitBreakerActive = true;
    this.storageAvailable = false;
    console.log('🚨 Circuit breaker activated - storage disabled');
    
    // Auto-reset después de 60 segundos
    setTimeout(() => {
      this.circuitBreakerActive = false;
      this.alertCount = 0;
      console.log('✅ Circuit breaker reset');
    }, 60000);
  }

  async waitForReady(): Promise<void> {
    while (!this.isReady) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  getItem<K extends CacheKey>(key: K): CacheDataTypes[K] | null {
    // Siempre usar cache primero
    const cached = this.memoryCache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      cached.accessCount++;
      return cached.data as CacheDataTypes[K];
    }

    // Si no hay storage o circuit breaker activo, solo memoria
    if (!this.storageAvailable || this.circuitBreakerActive) {
      return null;
    }

    try {
      const item = localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item) as CacheDataTypes[K];
        this.setToCache(key, parsed);
        return parsed;
      }
    } catch (error) {
      this.alertCount++;
      return null;
    }

    return null;
  }

  setItem<K extends CacheKey>(
    key: K,
    value: CacheDataTypes[K],
    options: { silentErrors?: boolean; ttl?: number } = {}
  ): boolean {
    // Siempre actualizar cache
    this.setToCache(key, value, options.ttl);

    // Si circuit breaker activo, solo memoria
    if (this.circuitBreakerActive) return true;

    // Batch write para localStorage
    if (this.storageAvailable) {
      this.batchQueue.push({
        key,
        value,
        timestamp: Date.now()
      });
    }

    return true;
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

    // Limpieza automática si cache muy grande
    if (this.memoryCache.size > 100) {
      this.cleanupCache();
    }
  }

  private cleanupCache() {
    const entries = Array.from(this.memoryCache.entries());
    const now = Date.now();
    
    // Remover entradas expiradas
    entries.forEach(([key, entry]) => {
      if (now - entry.timestamp > entry.ttl) {
        this.memoryCache.delete(key);
      }
    });
  }

  removeItem(key: string): boolean {
    this.memoryCache.delete(key);
    
    if (this.storageAvailable && !this.circuitBreakerActive) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        this.alertCount++;
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
      queueLength: this.batchQueue.length,
      alertCount: this.alertCount
    };
  }

  getPerformanceMetrics() {
    return {
      cacheSize: this.memoryCache.size,
      queueLength: this.batchQueue.length,
      alertCount: this.alertCount,
      trackingBlocked: this.trackingBlocked,
      circuitBreakerActive: this.circuitBreakerActive,
      syncQueueSize: this.batchQueue.length,
      memoryUsage: this.memoryCache.size * 1024 // Estimado
    };
  }

  clear(): void {
    this.memoryCache.clear();
    this.batchQueue = [];
    this.alertCount = 0;
  }
}

export const unifiedStorageSystem = UnifiedStorageSystemCore.getInstance();
