
/**
 * UNIFIED STORAGE SYSTEM v2.0 - SOLUCIÓN INTEGRAL
 * Elimina todos los conflictos de storage y "Tracking Prevention" alerts
 */

interface StorageOptions {
  fallbackToMemory?: boolean;
  rateLimitMs?: number;
  batchOperations?: boolean;
  silentErrors?: boolean;
  ttl?: number;
}

interface BatchOperation {
  key: string;
  value: any;
  timestamp: number;
  retries: number;
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
  trackingBlocked: boolean;
}

export class UnifiedStorageSystem {
  private static instance: UnifiedStorageSystem;
  
  // Cache layers optimizados
  private cache: CacheLayer;
  private batchQueue: BatchOperation[] = [];
  private batchTimer: NodeJS.Timeout | null = null;
  private syncQueue: Array<() => void> = [];
  
  // Memory fallback
  private memoryCache = new Map<string, any>();
  private lastAccessTime = new Map<string, number>();
  private accessQueue: Array<() => void> = [];
  private isProcessingQueue = false;
  
  // Estado del sistema
  private isOnline = true;
  private storageAvailable = false;
  private trackingBlocked = false;
  private rateLimitMs = 200;
  private silentMode = true;
  private isReady = false;

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
    
    this.initializeSystem();
  }

  private async initializeSystem(): Promise<void> {
    try {
      // Esperar a que el DOM esté completamente cargado
      if (typeof window === 'undefined') {
        this.isReady = true;
        return;
      }

      // Verificar disponibilidad de storage de forma segura
      await this.safeStorageCheck();
      
      // Configurar monitoreo
      this.setupNetworkMonitoring();
      this.setupPeriodicSync();
      
      this.isReady = true;
      
      if (!this.silentMode) {
        console.log('🚀 UnifiedStorageSystem v2.0 inicializado:', {
          storageAvailable: this.storageAvailable,
          trackingBlocked: this.trackingBlocked
        });
      }
      
    } catch (error) {
      this.isReady = true;
      this.storageAvailable = false;
      if (!this.silentMode) {
        console.warn('⚠️ Storage initialization failed, using memory only');
      }
    }
  }

  private async safeStorageCheck(): Promise<void> {
    try {
      const testKey = `__storage_test_${Date.now()}__`;
      
      // Test con timeout para evitar bloqueos
      const testPromise = new Promise<void>((resolve, reject) => {
        try {
          localStorage.setItem(testKey, 'test');
          const retrieved = localStorage.getItem(testKey);
          localStorage.removeItem(testKey);
          
          if (retrieved === 'test') {
            this.storageAvailable = true;
            this.trackingBlocked = false;
            resolve();
          } else {
            throw new Error('Storage test failed');
          }
        } catch (error: any) {
          if (error.message?.includes('Access is denied') || 
              error.message?.includes('QuotaExceededError') ||
              error.name === 'SecurityError') {
            this.trackingBlocked = true;
          }
          this.storageAvailable = false;
          reject(error);
        }
      });

      const timeoutPromise = new Promise<void>((_, reject) => {
        setTimeout(() => reject(new Error('Storage test timeout')), 1000);
      });

      await Promise.race([testPromise, timeoutPromise]);
      
    } catch (error) {
      this.storageAvailable = false;
      this.trackingBlocked = true;
    }
  }

  private setupNetworkMonitoring(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.processSyncQueue();
      });
      
      window.addEventListener('offline', () => {
        this.isOnline = false;
      });

      // Detectar cambios en storage availability
      window.addEventListener('storage', () => {
        this.safeStorageCheck();
      });
    }
  }

  private setupPeriodicSync(): void {
    setInterval(() => {
      if (this.isReady) {
        this.flushBatchQueue();
        this.cleanupCache();
      }
    }, 5000);
  }

  // Métodos principales con verificación de readiness
  async waitForReady(): Promise<void> {
    if (this.isReady) return;
    
    return new Promise(resolve => {
      const checkReady = () => {
        if (this.isReady) {
          resolve();
        } else {
          setTimeout(checkReady, 50);
        }
      };
      checkReady();
    });
  }

  getItem<T = any>(key: string): T | null {
    // L1 Cache first (siempre disponible)
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
    
    // LocalStorage solo si está disponible
    if (!this.storageAvailable || this.trackingBlocked) {
      return null;
    }
    
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
      // Marcar tracking bloqueado si falla
      if (error instanceof Error && error.message.includes('Access is denied')) {
        this.trackingBlocked = true;
      }
    }
    
    return null;
  }

  setItem<T = any>(key: string, value: T, options: StorageOptions = {}): boolean {
    // Actualizar todos los caches inmediatamente
    this.setToL1Cache(key, value, options.ttl);
    this.cache.l2.set(key, value);
    this.memoryCache.set(key, value);
    
    // Si storage no está disponible, solo memoria
    if (!this.storageAvailable || this.trackingBlocked) {
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
      if (error instanceof Error && error.message.includes('Access is denied')) {
        this.trackingBlocked = true;
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
    
    if (!this.storageAvailable || this.trackingBlocked) {
      return true;
    }

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

  // Cache operations optimizadas
  private getFromL1Cache<T>(key: string): T | null {
    const cached = this.cache.l1.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.l1.delete(key);
      return null;
    }
    
    return cached.data;
  }

  private setToL1Cache<T>(key: string, data: T, ttl = 300000): void {
    this.cache.l1.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  // Rate limiting mejorado
  private shouldRateLimit(key: string): boolean {
    const lastAccess = this.lastAccessTime.get(key) || 0;
    const now = Date.now();
    return (now - lastAccess) < this.rateLimitMs;
  }

  private updateAccessTime(key: string): void {
    this.lastAccessTime.set(key, Date.now());
  }

  // Batch operations mejoradas
  private addToBatchQueue(key: string, value: any): void {
    // Verificar si ya existe en queue
    const existingIndex = this.batchQueue.findIndex(op => op.key === key);
    if (existingIndex >= 0) {
      this.batchQueue[existingIndex] = {
        key,
        value,
        timestamp: Date.now(),
        retries: this.batchQueue[existingIndex].retries
      };
    } else {
      this.batchQueue.push({
        key,
        value,
        timestamp: Date.now(),
        retries: 0
      });
    }
    
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
    }
    
    this.batchTimer = setTimeout(() => {
      this.flushBatchQueue();
    }, 1000);
  }

  private flushBatchQueue(): void {
    if (this.batchQueue.length === 0) return;
    
    const operations = [...this.batchQueue];
    this.batchQueue = [];
    
    if (!this.isOnline || !this.storageAvailable || this.trackingBlocked) {
      // Solo guardar operaciones con pocas retries
      const retryableOps = operations.filter(op => op.retries < 3);
      if (retryableOps.length > 0) {
        this.syncQueue.push(() => this.executeBatchOperations(retryableOps));
      }
      return;
    }
    
    this.executeBatchOperations(operations);
  }

  private executeBatchOperations(operations: BatchOperation[]): void {
    const successfulOps: string[] = [];
    const failedOps: BatchOperation[] = [];

    operations.forEach(({ key, value, retries }) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        successfulOps.push(key);
      } catch (error) {
        if (retries < 3) {
          failedOps.push({ key, value, timestamp: Date.now(), retries: retries + 1 });
        }
      }
    });

    // Re-queue failed operations
    if (failedOps.length > 0) {
      this.batchQueue.unshift(...failedOps);
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

  private processSyncQueue(): void {
    while (this.syncQueue.length > 0) {
      const operation = this.syncQueue.shift();
      if (operation) {
        try {
          operation();
        } catch (error) {
          // Error silencioso
        }
      }
    }
  }

  // Batch operations type-safe
  batchGet(keys: string[]): Record<string, any> {
    const result: Record<string, any> = {};
    
    keys.forEach(key => {
      const value = this.getItem(key);
      if (value !== null) {
        result[key] = value;
      }
    });
    
    return result;
  }

  batchSet(items: Array<{key: string; value: any}>): void {
    items.forEach(({ key, value }) => {
      this.setItem(key, value);
    });
  }

  // Cleanup y mantenimiento
  private cleanupCache(): void {
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
      trackingBlocked: this.trackingBlocked,
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
    
    if (this.storageAvailable && !this.trackingBlocked) {
      try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.includes('learning_') || 
              key.includes('user_') || 
              key.includes('paes_') ||
              key.includes('lectoguia_') ||
              key.includes('diagnostic_')) {
            localStorage.removeItem(key);
          }
        });
      } catch (error) {
        // Error silencioso
      }
    }
  }

  // Status
  getStatus() {
    return {
      isReady: this.isReady,
      storageAvailable: this.storageAvailable,
      trackingBlocked: this.trackingBlocked,
      cacheSize: this.memoryCache.size,
      queueLength: this.accessQueue.length,
      isProcessing: this.isProcessingQueue,
      isOnline: this.isOnline,
      l1Size: this.cache.l1.size,
      l2Size: this.cache.l2.size,
    };
  }
}

// Export singleton instance
export const unifiedStorageSystem = UnifiedStorageSystem.getInstance();

// Compatibilidad con imports existentes
export const storageManager = unifiedStorageSystem;
export const optimizedStorageManager = unifiedStorageSystem;
export { UnifiedStorageSystem as StorageManager };

// Auto-configuración optimizada
unifiedStorageSystem.configure({
  rateLimitMs: 300,
  silentMode: true
});
