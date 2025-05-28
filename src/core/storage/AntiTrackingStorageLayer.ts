
/**
 * ANTI-TRACKING STORAGE LAYER v1.0
 * Sistema de protección total contra tracking prevention
 */

interface StorageEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
}

interface AntiTrackingConfig {
  enableMemoryFallback: boolean;
  silentMode: boolean;
  autoRecovery: boolean;
  maxRetries: number;
}

class AntiTrackingStorageLayer {
  private static instance: AntiTrackingStorageLayer;
  private memoryStorage = new Map<string, StorageEntry>();
  private trackingBlocked = false;
  private recoveryAttempts = 0;
  private config: AntiTrackingConfig = {
    enableMemoryFallback: true,
    silentMode: true,
    autoRecovery: true,
    maxRetries: 3
  };

  static getInstance(): AntiTrackingStorageLayer {
    if (!AntiTrackingStorageLayer.instance) {
      AntiTrackingStorageLayer.instance = new AntiTrackingStorageLayer();
    }
    return AntiTrackingStorageLayer.instance;
  }

  private constructor() {
    this.detectTrackingStatus();
    this.setupRecoveryMonitoring();
  }

  private detectTrackingStatus(): void {
    try {
      const testKey = '__anti_tracking_test__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      this.trackingBlocked = false;
    } catch (error) {
      this.trackingBlocked = true;
      if (!this.config.silentMode) {
        console.log('🛡️ Tracking Prevention detectado - Activando modo memoria');
      }
    }
  }

  private setupRecoveryMonitoring(): void {
    if (!this.config.autoRecovery) return;

    setInterval(() => {
      if (this.trackingBlocked && this.recoveryAttempts < this.config.maxRetries) {
        this.attemptRecovery();
      }
    }, 30000); // Cada 30 segundos
  }

  private attemptRecovery(): void {
    this.recoveryAttempts++;
    
    try {
      const testKey = '__recovery_test__';
      localStorage.setItem(testKey, 'recovery');
      localStorage.removeItem(testKey);
      
      // Recovery exitoso
      this.trackingBlocked = false;
      this.recoveryAttempts = 0;
      
      if (!this.config.silentMode) {
        console.log('✅ Storage recovery exitoso');
      }
      
      // Sincronizar datos de memoria a localStorage
      this.syncMemoryToStorage();
    } catch (error) {
      // Recovery falló, continuar en modo memoria
    }
  }

  private syncMemoryToStorage(): void {
    if (this.trackingBlocked) return;

    for (const [key, entry] of this.memoryStorage.entries()) {
      try {
        if (Date.now() - entry.timestamp < entry.ttl) {
          localStorage.setItem(key, JSON.stringify(entry.data));
        }
      } catch (error) {
        // Error de sincronización, ignorar
      }
    }
  }

  setItem<T>(key: string, value: T, ttl = 3600000): boolean {
    const entry: StorageEntry<T> = {
      data: value,
      timestamp: Date.now(),
      ttl,
      key
    };

    // Siempre guardar en memoria
    this.memoryStorage.set(key, entry);

    // Intentar guardar en localStorage si disponible
    if (!this.trackingBlocked) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        this.trackingBlocked = true;
      }
    }

    return true; // Éxito garantizado con memoria
  }

  getItem<T>(key: string): T | null {
    // Verificar memoria primero
    const memoryEntry = this.memoryStorage.get(key);
    if (memoryEntry && Date.now() - memoryEntry.timestamp < memoryEntry.ttl) {
      return memoryEntry.data as T;
    }

    // Si no está en memoria y localStorage está disponible
    if (!this.trackingBlocked) {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item) as T;
          // Actualizar memoria
          this.setItem(key, parsed);
          return parsed;
        }
      } catch (error) {
        this.trackingBlocked = true;
      }
    }

    return null;
  }

  removeItem(key: string): boolean {
    this.memoryStorage.delete(key);
    
    if (!this.trackingBlocked) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        this.trackingBlocked = true;
      }
    }
    
    return true;
  }

  clear(): void {
    this.memoryStorage.clear();
    
    if (!this.trackingBlocked) {
      try {
        // Solo limpiar nuestras claves
        const keysToRemove = Object.keys(localStorage).filter(key => 
          key.startsWith('paes_') || key.startsWith('neural_') || key.startsWith('user_')
        );
        keysToRemove.forEach(key => localStorage.removeItem(key));
      } catch (error) {
        this.trackingBlocked = true;
      }
    }
  }

  getStatus() {
    return {
      trackingBlocked: this.trackingBlocked,
      memoryStorageSize: this.memoryStorage.size,
      recoveryAttempts: this.recoveryAttempts,
      hasLocalStorage: !this.trackingBlocked
    };
  }
}

export const antiTrackingStorage = AntiTrackingStorageLayer.getInstance();
