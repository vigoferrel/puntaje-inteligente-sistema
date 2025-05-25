
/**
 * CAPA DE PROTECCIÓN DE STORAGE ANTI-TRACKING v2.0 - REPARACIÓN QUIRÚRGICA
 * Blindaje extremo con corrección de contexto y estrategia de proxy
 */

interface StorageProtectionConfig {
  enableEncryption: boolean;
  autoCleanup: boolean;
  trackingProtection: boolean;
  maxStorageSize: number;
  observationMode: boolean;
}

class StorageProtectionLayer {
  private static instance: StorageProtectionLayer | null = null;
  private config: StorageProtectionConfig;
  private protectedKeys = new Set<string>();
  private encryptionKey: string;
  private cleanupInterval: number | null = null;
  private originalStorage: Storage;
  private isActive: boolean = false;

  // Whitelist interna ultra-conservadora
  private readonly INTERNAL_WHITELIST = new Set([
    'paes-', 'auth-', 'user-', 'neural-', 'intersectional-',
    'lectoguia-', 'plan-', 'diagnostic-', 'theme', 'settings',
    'lovable-', 'vite-', 'react-', '__reactInternalInstance',
    '__reactFiber', '__reactInternalMemoizedMaskedChildContext',
    '__reactInternalMemoizedUnmaskedChildContext'
  ]);

  private constructor(config: Partial<StorageProtectionConfig> = {}) {
    this.config = {
      enableEncryption: false, // Deshabilitado por defecto
      autoCleanup: true,
      trackingProtection: true,
      maxStorageSize: 1024 * 1024,
      observationMode: true, // Modo observación por defecto
      ...config
    };

    this.encryptionKey = this.generateEncryptionKey();
    this.originalStorage = window.localStorage;
    
    if (!this.config.observationMode) {
      this.initializeProtection();
    } else {
      this.initializeObservationMode();
    }
  }

  public static getInstance(config?: Partial<StorageProtectionConfig>): StorageProtectionLayer {
    if (!StorageProtectionLayer.instance) {
      StorageProtectionLayer.instance = new StorageProtectionLayer(config);
    }
    return StorageProtectionLayer.instance;
  }

  private generateEncryptionKey(): string {
    return btoa(Math.random().toString(36).substring(2, 15) + 
                Math.random().toString(36).substring(2, 15));
  }

  private initializeObservationMode(): void {
    // Solo observar, no interferir
    this.startPassiveMonitoring();
    console.log('🔍 PROTECCIÓN DE STORAGE - Modo observación activado');
  }

  private initializeProtection(): void {
    if (this.isActive) return;
    
    try {
      this.wrapStorageAPIWithProxy();
      
      if (this.config.autoCleanup) {
        this.startAutoCleanup();
      }

      this.isActive = true;
      console.log('🔐 PROTECCIÓN DE STORAGE ACTIVADA - Modo protección completo');
    } catch (error) {
      console.error('Error inicializando protección de storage:', error);
      this.fallbackToObservation();
    }
  }

  private fallbackToObservation(): void {
    this.config.observationMode = true;
    this.isActive = false;
    this.initializeObservationMode();
  }

  private startPassiveMonitoring(): void {
    // Monitoreo pasivo sin interferir
    const monitorInterval = setInterval(() => {
      this.detectSuspiciousActivity();
    }, 30000); // Cada 30 segundos

    // Cleanup
    setTimeout(() => {
      clearInterval(monitorInterval);
    }, 300000); // 5 minutos máximo
  }

  private detectSuspiciousActivity(): void {
    let suspiciousCount = 0;
    
    try {
      for (let i = 0; i < this.originalStorage.length; i++) {
        const key = this.originalStorage.key(i);
        if (key && this.isObviousTrackingKey(key)) {
          suspiciousCount++;
        }
      }

      if (suspiciousCount > 10) {
        console.log(`⚠️ Actividad sospechosa detectada: ${suspiciousCount} claves de tracking`);
        // Escalación gradual si es necesario
        if (suspiciousCount > 50) {
          this.escalateProtection();
        }
      }
    } catch (error) {
      // Silencioso
    }
  }

  private escalateProtection(): void {
    if (!this.config.observationMode) return;
    
    console.log('🚨 Escalando a modo protección por actividad excesiva');
    this.config.observationMode = false;
    this.initializeProtection();
  }

  private wrapStorageAPIWithProxy(): void {
    const self = this;
    
    // Estrategia de proxy en lugar de sobrescribir prototypes
    const storageProxy = new Proxy(this.originalStorage, {
      get(target: Storage, prop: string | symbol): any {
        const origMethod = (target as any)[prop];
        
        if (prop === 'setItem') {
          return function(key: string, value: string) {
            if (self.shouldBlockStorage(key, value)) {
              console.log(`🚫 Blocked tracking storage: ${key}`);
              return;
            }
            return origMethod.call(target, key, value);
          };
        }
        
        if (prop === 'getItem') {
          return function(key: string) {
            if (self.shouldBlockStorage(key, '')) {
              return null;
            }
            return origMethod.call(target, key);
          };
        }
        
        if (prop === 'removeItem') {
          return function(key: string) {
            self.protectedKeys.delete(key);
            return origMethod.call(target, key);
          };
        }
        
        return typeof origMethod === 'function' ? origMethod.bind(target) : origMethod;
      },
      
      set(target: Storage, prop: string | symbol, value: any): boolean {
        if (typeof prop === 'string' && prop !== 'setItem' && prop !== 'getItem' && prop !== 'removeItem') {
          if (self.shouldBlockStorage(prop, String(value))) {
            console.log(`🚫 Blocked direct storage assignment: ${prop}`);
            return true;
          }
        }
        (target as any)[prop] = value;
        return true;
      }
    });

    // Reemplazar localStorage con el proxy SOLO si no está ya envuelto
    if (!this.isStorageAlreadyWrapped()) {
      try {
        Object.defineProperty(window, 'localStorage', {
          value: storageProxy,
          writable: false,
          configurable: true
        });
      } catch (error) {
        console.warn('No se pudo sobrescribir localStorage, usando modo observación');
        this.fallbackToObservation();
      }
    }
  }

  private isStorageAlreadyWrapped(): boolean {
    // Verificar si localStorage ya fue modificado
    return window.localStorage !== this.originalStorage;
  }

  private shouldBlockStorage(key: string, value: string): boolean {
    if (!this.config.trackingProtection) return false;
    
    // Permitir TODAS las claves internas
    if (this.isInternalKey(key)) {
      return false;
    }
    
    // Solo bloquear tracking obvio y confirmado
    return this.isObviousTrackingKey(key) || this.isObviousTrackingValue(value);
  }

  private isInternalKey(key: string): boolean {
    const keyLower = key.toLowerCase();
    return Array.from(this.INTERNAL_WHITELIST).some(prefix => 
      keyLower.startsWith(prefix.toLowerCase())
    );
  }

  private isObviousTrackingKey(key: string): boolean {
    const obviousTrackers = ['_ga', '_gid', '_gat', 'fbp', 'fbc', 'utm_'];
    return obviousTrackers.some(tracker => key.includes(tracker));
  }

  private isObviousTrackingValue(value: string): boolean {
    if (value.length > 1000) return false; // Skip large values
    
    try {
      const valueLower = value.toLowerCase();
      const trackingIndicators = ['google-analytics', 'facebook.com', 'doubleclick'];
      return trackingIndicators.some(indicator => valueLower.includes(indicator));
    } catch {
      return false;
    }
  }

  private startAutoCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    
    this.cleanupInterval = window.setInterval(() => {
      this.performSafeCleanup();
    }, 300000); // Cada 5 minutos
  }

  private performSafeCleanup(): void {
    if (this.config.observationMode) return;
    
    const itemsToRemove: string[] = [];

    try {
      for (let i = 0; i < this.originalStorage.length; i++) {
        const key = this.originalStorage.key(i);
        if (!key) continue;

        // Solo remover tracking obvio, nunca claves internas
        if (!this.isInternalKey(key) && this.isObviousTrackingKey(key)) {
          itemsToRemove.push(key);
        }
      }

      // Remover solo items confirmados de tracking
      itemsToRemove.forEach(key => {
        try {
          this.originalStorage.removeItem(key);
          this.protectedKeys.delete(key);
        } catch (error) {
          // Silencioso
        }
      });

      if (itemsToRemove.length > 0) {
        console.log(`🧹 Limpieza segura: ${itemsToRemove.length} items de tracking removidos`);
      }
    } catch (error) {
      // Limpieza silenciosa
    }
  }

  public getProtectionStats() {
    return {
      protectedKeys: this.protectedKeys.size,
      totalStorageSize: this.getTotalStorageSize(),
      encryptionEnabled: this.config.enableEncryption,
      autoCleanupEnabled: this.config.autoCleanup,
      observationMode: this.config.observationMode,
      isActive: this.isActive
    };
  }

  private getTotalStorageSize(): number {
    let total = 0;
    try {
      for (let i = 0; i < this.originalStorage.length; i++) {
        const key = this.originalStorage.key(i);
        const value = this.originalStorage.getItem(key || '');
        if (key && value) {
          total += key.length + value.length;
        }
      }
    } catch {
      total = 0;
    }
    return total;
  }

  public emergencyWipe(): void {
    // Wipe ultra-conservador - solo tracking obvio
    const trackingKeys: string[] = [];

    try {
      for (let i = 0; i < this.originalStorage.length; i++) {
        const key = this.originalStorage.key(i);
        if (key && !this.isInternalKey(key) && this.isObviousTrackingKey(key)) {
          trackingKeys.push(key);
        }
      }

      trackingKeys.forEach(key => {
        try {
          this.originalStorage.removeItem(key);
        } catch (error) {
          // Silencioso
        }
      });

      this.protectedKeys.clear();
      console.log(`🚨 EMERGENCY WIPE CONSERVADOR: ${trackingKeys.length} claves de tracking removidas`);
    } catch (error) {
      console.error('Error en emergency wipe:', error);
    }
  }

  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    
    this.protectedKeys.clear();
    this.isActive = false;
    
    // Restaurar localStorage original si es posible
    try {
      Object.defineProperty(window, 'localStorage', {
        value: this.originalStorage,
        writable: true,
        configurable: true
      });
    } catch (error) {
      // Silencioso
    }
    
    StorageProtectionLayer.instance = null;
  }
}

// Instancia global con configuración conservadora
export const storageProtection = StorageProtectionLayer.getInstance({
  enableEncryption: false,
  autoCleanup: true,
  trackingProtection: true,
  observationMode: true // Modo seguro por defecto
});
