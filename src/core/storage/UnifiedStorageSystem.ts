
/**
 * UNIFIED STORAGE SYSTEM v1.0
 * Sistema consolidado que fusiona OptimizedStorageManager e IntelligentStorageManager
 */

import { CacheDataTypes, CacheKey, TypeSafeBatchItem } from './types';

interface StorageOptions {
  fallbackToMemory?: boolean;
  rateLimitMs?: number;
  batchOperations?: boolean;
  silentErrors?: boolean;
}

interface BatchOperation {
  key: string;
  value: any;
  timestamp: number;
}

interface CacheLayer {
  l1: Map<string, { data: any; timestamp: number; ttl: number }>;
  l2: Map<string, any>;
}

interface PerformanceMetrics {
  l1CacheSize: number;
  l2CacheSize: number;
  batchQueueSize: number;
  syncQueueSize: number;
  isOnline: boolean;
  storageAvailable: boolean;
  cacheSize: number;
  queueLength: number;
}

export class UnifiedStorageSystem {
  private static instance: UnifiedStorageSystem;
  
  // Cache layers (from OptimizedStorageManager)
  private cache: CacheLayer;
  private batchQueue: BatchOperation[] = [];
  private batchTimer: NodeJS.Timeout | null = null;
  private syncQueue: Array<() => void> = [];
  
  // Memory cache (from IntelligentStorageManager)
  private memoryCache = new Map<string, any>();
  private lastAccessTime = new Map<string, number>();
  private accessQueue: Array<() => void> = [];
  private isProcessingQueue = false;
  
  // Configuration
  private isOnline = true;
  private storageAvailable = true;
  private rateLimitMs = 100;
  private silentMode = true;

  static getInstance(): UnifiedStorageSystem {
    if (!UnifiedStorageSystem.instance) {
      UnifiedStorageSystem.instance = new UnifiedStorageSystem();
    }
    return UnifiedStorageSystem.instance;
  }

  private constructor() {
    this.cache = {
      l1: new Map(),
      l2: new Map(),
    };
    
    this.setupNetworkMonitoring();
    this.setupPeriodicSync();
    this.checkStorageAvailability();
  }

  private setupNetworkMonitoring() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.processSyncQueue();
      });
      
      window.addEventListener('offline', () => {
        this.isOnline = false;
      });
    }
  }

  private setupPeriodicSync() {
    setInterval(() => {
      this.flushBatchQueue();
      this.cleanupCache();
    }, 5000);
  }

  private checkStorageAvailability(): void {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      this.storageAvailable = true;
    } catch (error) {
      this.storageAvailable = false;
      if (!this.silentMode) {
        console.warn('🔒 Storage no disponible, usando memoria');
      }
    }
  }

  // Cache L1 operations
  private getFromL1Cache<K extends CacheKey>(key: K): CacheDataTypes[K] | null {
    const cached = this.cache.l1.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.l1.delete(key);
      return null;
    }
    
    return cached.data;
  }

  private setToL1Cache<K extends CacheKey>(key: K, data: CacheDataTypes[K], ttl = 300000) {
    this.cache.l1.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  // Rate limiting
  private shouldRateLimit(key: string): boolean {
    const lastAccess = this.lastAccessTime.get(key) || 0;
    const now = Date.now();
    return (now - lastAccess) < this.rateLimitMs;
  }

  private updateAccessTime(key: string): void {
    this.lastAccessTime.set(key, Date.now());
  }

  // Main type-safe methods
  getItem<K extends CacheKey>(key: K): CacheDataTypes[K] | null {
    // L1 Cache first
    const l1Result = this.getFromL1Cache(key);
    if (l1Result !== null) return l1Result;
    
    // Memory cache
    if (this.memoryCache.has(key)) {
      const data = this.memoryCache.get(key);
      this.setToL1Cache(key, data);
      return data;
    }
    
    // L2 Cache
    if (this.cache.l2.has(key)) {
      const data = this.cache.l2.get(key);
      this.setToL1Cache(key, data);
      this.memoryCache.set(key, data);
      return data;
    }
    
    // LocalStorage como último recurso
    if (!this.storageAvailable) return null;
    
    // Rate limiting check
    if (this.shouldRateLimit(key)) {
      return this.memoryCache.get(key) || null;
    }

    try {
      this.updateAccessTime(key);
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.setToL1Cache(key, parsed);
        this.cache.l2.set(key, parsed);
        this.memoryCache.set(key, parsed);
        return parsed;
      }
    } catch (error) {
      if (!this.silentMode) {
        console.warn(`Storage get error for ${key}:`, error);
      }
    }
    
    return null;
  }

  setItem<K extends CacheKey>(
    key: K, 
    value: CacheDataTypes[K], 
    options: StorageOptions = {}
  ): boolean {
    // Actualizar todos los caches inmediatamente
    this.setToL1Cache(key, value);
    this.cache.l2.set(key, value);
    this.memoryCache.set(key, value);
    
    // Si no hay storage, solo memoria
    if (!this.storageAvailable) {
      return true;
    }

    // Rate limiting para escrituras
    if (this.shouldRateLimit(key)) {
      this.addToBatchQueue(key, value);
      return true;
    }

    try {
      this.updateAccessTime(key);
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      if (!options.silentErrors && !this.silentMode) {
        console.warn(`Storage set error for ${key}:`, error);
      }
      // Fallback to batch queue
      this.addToBatchQueue(key, value);
      return false;
    }
  }

  removeItem(key: string): boolean {
    this.cache.l1.delete(key);
    this.cache.l2.delete(key);
    this.memoryCache.delete(key);
    
    if (!this.storageAvailable) return true;

    if (this.shouldRateLimit(key)) {
      this.queueOperation(() => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          // Error silencioso
        }
      });
      return true;
    }

    try {
      this.updateAccessTime(key);
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Batch operations
  private addToBatchQueue(key: string, value: any) {
    this.batchQueue.push({
      key,
      value,
      timestamp: Date.now(),
    });
    
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
    }
    
    this.batchTimer = setTimeout(() => {
      this.flushBatchQueue();
    }, 1000);
  }

  private flushBatchQueue() {
    if (this.batchQueue.length === 0) return;
    
    const operations = [...this.batchQueue];
    this.batchQueue = [];
    
    if (!this.isOnline) {
      this.syncQueue.push(() => this.executeBatchOperations(operations));
      return;
    }
    
    this.executeBatchOperations(operations);
  }

  private executeBatchOperations(operations: BatchOperation[]) {
    try {
      operations.forEach(({ key, value }) => {
        localStorage.setItem(key, JSON.stringify(value));
      });
    } catch (error) {
      console.warn('Batch write failed:', error);
      this.syncQueue.push(() => this.executeBatchOperations(operations));
    }
  }

  // Queue operations
  private queueOperation(operation: () => void): void {
    this.accessQueue.push(operation);
    if (!this.isProcessingQueue) {
      this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    this.isProcessingQueue = true;
    
    while (this.accessQueue.length > 0) {
      const operation = this.accessQueue.shift();
      if (operation) {
        try {
          operation();
          await new Promise(resolve => setTimeout(resolve, this.rateLimitMs));
        } catch (error) {
          // Error silencioso
        }
      }
    }
    
    this.isProcessingQueue = false;
  }

  private processSyncQueue() {
    while (this.syncQueue.length > 0) {
      const operation = this.syncQueue.shift();
      if (operation) {
        try {
          operation();
        } catch (error) {
          console.warn('Sync operation failed:', error);
        }
      }
    }
  }

  // Batch operations type-safe
  batchGet(keys: string[]): Record<string, any> {
    const result: Record<string, any> = {};
    
    keys.forEach(key => {
      const value = this.getItem(key as CacheKey);
      if (value !== null) {
        result[key] = value;
      }
    });
    
    return result;
  }

  batchSet(items: TypeSafeBatchItem[]): void {
    items.forEach(({ key, value }) => {
      this.setItem(key as CacheKey, value);
    });
  }

  // Cleanup and maintenance
  private cleanupCache() {
    const now = Date.now();
    const oneHourAgo = now - 3600000;
    
    // Limpiar L1 cache expirado
    for (const [key, entry] of this.cache.l1.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.l1.delete(key);
      }
    }
    
    // Limpiar L2 cache y memory cache antiguos
    for (const [key, timestamp] of this.lastAccessTime.entries()) {
      if (timestamp < oneHourAgo) {
        this.lastAccessTime.delete(key);
        this.memoryCache.delete(key);
        this.cache.l2.delete(key);
      }
    }
  }

  // Performance metrics
  getPerformanceMetrics(): PerformanceMetrics {
    return {
      l1CacheSize: this.cache.l1.size,
      l2CacheSize: this.cache.l2.size,
      batchQueueSize: this.batchQueue.length,
      syncQueueSize: this.syncQueue.length,
      isOnline: this.isOnline,
      storageAvailable: this.storageAvailable,
      cacheSize: this.memoryCache.size,
      queueLength: this.accessQueue.length,
    };
  }

  // Configuration
  configure(options: {
    rateLimitMs?: number;
    silentMode?: boolean;
  }): void {
    if (options.rateLimitMs !== undefined) {
      this.rateLimitMs = Math.max(50, options.rateLimitMs);
    }
    if (options.silentMode !== undefined) {
      this.silentMode = options.silentMode;
    }
  }

  // Clear all
  clear(): void {
    this.cache.l1.clear();
    this.cache.l2.clear();
    this.memoryCache.clear();
    this.batchQueue = [];
    this.lastAccessTime.clear();
    
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.includes('learning_') || key.includes('user_') || key.includes('paes_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Clear operation failed:', error);
    }
  }

  // Status
  getStatus() {
    return {
      storageAvailable: this.storageAvailable,
      cacheSize: this.memoryCache.size,
      queueLength: this.accessQueue.length,
      isProcessing: this.isProcessingQueue,
      isOnline: this.isOnline,
      l1Size: this.cache.l1.size,
      l2Size: this.cache.l2.size,
    };
  }
}

// Export singleton instance and class
export const unifiedStorageSystem = UnifiedStorageSystem.getInstance();

// Auto-configuración
unifiedStorageSystem.configure({
  rateLimitMs: 200,
  silentMode: true
});

// Limpieza automática cada 30 minutos
setInterval(() => {
  unifiedStorageSystem.getPerformanceMetrics(); // Trigger cleanup
}, 1800000);

// Export aliases for compatibility
export const storageManager = unifiedStorageSystem;
export const optimizedStorageManager = unifiedStorageSystem;
export { UnifiedStorageSystem as StorageManager };
