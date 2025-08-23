
import { StateStorage } from 'zustand/middleware';

interface PersistenceConfig {
  name: string;
  ttl?: number; // Time to live en milisegundos
  version?: number;
  compress?: boolean;
}

class AdvancedStatePersistence implements StateStorage {
  private dbName = 'PAESIntersectionalDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains('state')) {
          const store = db.createObjectStore('state', { keyPath: 'key' });
          store.createIndex('timestamp', 'timestamp');
          store.createIndex('ttl', 'ttl');
        }
      };
    });
  }

  async getItem(name: string): Promise<string | null> {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['state'], 'readonly');
      const store = transaction.objectStore('state');
      const request = store.get(name);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result;
        
        // Verificar TTL
        if (result && result.ttl && Date.now() > result.ttl) {
          this.removeItem(name);
          resolve(null);
          return;
        }
        
        resolve(result ? result.value : null);
      };
    });
  }

  async setItem(name: string, value: string): Promise<void> {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['state'], 'readwrite');
      const store = transaction.objectStore('state');
      
      const data = {
        key: name,
        value,
        timestamp: Date.now(),
        ttl: Date.now() + (24 * 60 * 60 * 1000) // 24 horas por defecto
      };
      
      const request = store.put(data);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async removeItem(name: string): Promise<void> {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['state'], 'readwrite');
      const store = transaction.objectStore('state');
      const request = store.delete(name);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  // Limpieza automática de elementos expirados
  async cleanup(): Promise<void> {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['state'], 'readwrite');
      const store = transaction.objectStore('state');
      const index = store.index('ttl');
      const range = IDBKeyRange.upperBound(Date.now());
      const request = index.openCursor(range);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
    });
  }
}

export const advancedStorage = new AdvancedStatePersistence();

// Hook para estado persistente con TTL
export const createPersistentStore = <T>(config: PersistenceConfig) => {
  return {
    name: config.name,
    storage: advancedStorage,
    partialize: (state: T) => state,
    onRehydrateStorage: () => (state?: T) => {
      console.log(`🔄 Estado ${config.name} rehidratado:`, state);
      // Limpieza automática cada vez que se rehidrata
      advancedStorage.cleanup();
    }
  };
};
