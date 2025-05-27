
/**
 * STORAGE MANAGER v12.0 - TYPE-SAFE & COMPATIBLE CON TRACKING PREVENTION
 * Sistema inteligente que respeta las políticas del navegador con tipos seguros corregidos
 */

import { CacheDataTypes, CacheKey, TypeSafeBatchItem } from './types';

interface StorageOptions {
  fallbackToMemory?: boolean;
  rateLimitMs?: number;
  batchOperations?: boolean;
  silentErrors?: boolean;
}

interface StorageEntry {
  data: any;
  timestamp: number;
  key: string;
}

class IntelligentStorageManager {
  private static instance: IntelligentStorageManager;
  private memoryCache = new Map<string, any>();
  private lastAccessTime = new Map<string, number>();
  private accessQueue: Array<() => void> = [];
  private isProcessingQueue = false;
  private storageAvailable = true;
  private rateLimitMs = 100;
  private silentMode = true;

  static getInstance(): IntelligentStorageManager {
    if (!IntelligentStorageManager.instance) {
      IntelligentStorageManager.instance = new IntelligentStorageManager();
    }
    return IntelligentStorageManager.instance;
  }

  private constructor() {
    this.checkStorageAvailability();
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

  private shouldRateLimit(key: string): boolean {
    const lastAccess = this.lastAccessTime.get(key) || 0;
    const now = Date.now();
    return (now - lastAccess) < this.rateLimitMs;
  }

  private updateAccessTime(key: string): void {
    this.lastAccessTime.set(key, Date.now());
  }

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

  // Métodos type-safe corregidos
  getItem<K extends CacheKey>(key: K): CacheDataTypes[K] | null {
    const keyStr = String(key);
    
    // Siempre intentar cache primero
    if (this.memoryCache.has(keyStr)) {
      return this.memoryCache.get(keyStr);
    }

    // Si no hay storage disponible, solo memoria
    if (!this.storageAvailable) {
      return null;
    }

    // Rate limiting
    if (this.shouldRateLimit(keyStr)) {
      return this.memoryCache.get(keyStr) || null;
    }

    try {
      this.updateAccessTime(keyStr);
      const item = localStorage.getItem(keyStr);
      const parsed = item ? JSON.parse(item) : null;
      
      // Actualizar cache
      if (parsed) {
        this.memoryCache.set(keyStr, parsed);
      }
      
      return parsed;
    } catch (error) {
      if (!this.silentMode) {
        console.warn(`Storage get error for ${keyStr}:`, error);
      }
      return this.memoryCache.get(keyStr) || null;
    }
  }

  setItem<K extends CacheKey>(
    key: K, 
    value: CacheDataTypes[K], 
    options: StorageOptions = {}
  ): boolean {
    const keyStr = String(key);
    
    // Siempre actualizar cache
    this.memoryCache.set(keyStr, value);

    // Si no hay storage, solo memoria
    if (!this.storageAvailable) {
      return true;
    }

    // Rate limiting para escrituras
    if (this.shouldRateLimit(keyStr)) {
      // Encolar la operación para más tarde
      this.queueOperation(() => {
        try {
          localStorage.setItem(keyStr, JSON.stringify(value));
        } catch (error) {
          // Error silencioso
        }
      });
      return true;
    }

    try {
      this.updateAccessTime(keyStr);
      localStorage.setItem(keyStr, JSON.stringify(value));
      return true;
    } catch (error) {
      if (!options.silentErrors && !this.silentMode) {
        console.warn(`Storage set error for ${keyStr}:`, error);
      }
      return false;
    }
  }

  removeItem(key: string): boolean {
    this.memoryCache.delete(key);
    
    if (!this.storageAvailable) {
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

  // Operaciones batch type-safe
  batchSet(items: TypeSafeBatchItem[]): void {
    items.forEach(({ key, value }) => {
      const keyStr = String(key);
      this.memoryCache.set(keyStr, value);
    });

    if (!this.storageAvailable) return;

    this.queueOperation(() => {
      items.forEach(({ key, value }) => {
        try {
          const keyStr = String(key);
          localStorage.setItem(keyStr, JSON.stringify(value));
        } catch (error) {
          // Error silencioso
        }
      });
    });
  }

  // Limpieza periódica
  cleanup(): void {
    const oneHourAgo = Date.now() - 3600000;
    for (const [key, timestamp] of this.lastAccessTime.entries()) {
      if (timestamp < oneHourAgo) {
        this.lastAccessTime.delete(key);
        this.memoryCache.delete(key);
      }
    }
  }

  // Estado del sistema
  getStatus() {
    return {
      storageAvailable: this.storageAvailable,
      cacheSize: this.memoryCache.size,
      queueLength: this.accessQueue.length,
      isProcessing: this.isProcessingQueue
    };
  }

  // Configuración
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
}

export const storageManager = IntelligentStorageManager.getInstance();

// Auto-configuración silenciosa
storageManager.configure({
  rateLimitMs: 200,
  silentMode: true
});

// Limpieza automática cada 30 minutos
setInterval(() => {
  storageManager.cleanup();
}, 1800000);
