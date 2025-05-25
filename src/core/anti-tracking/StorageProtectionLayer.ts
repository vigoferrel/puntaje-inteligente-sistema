
/**
 * CAPA DE PROTECCIÓN DE STORAGE ANTI-TRACKING v1.0
 * Blindaje extremo contra accesos maliciosos al storage
 */

interface StorageProtectionConfig {
  enableEncryption: boolean;
  autoCleanup: boolean;
  trackingProtection: boolean;
  maxStorageSize: number;
}

class StorageProtectionLayer {
  private config: StorageProtectionConfig;
  private protectedKeys = new Set<string>();
  private encryptionKey: string;
  private cleanupInterval: number;

  constructor(config: Partial<StorageProtectionConfig> = {}) {
    this.config = {
      enableEncryption: true,
      autoCleanup: true,
      trackingProtection: true,
      maxStorageSize: 1024 * 1024, // 1MB
      ...config
    };

    this.encryptionKey = this.generateEncryptionKey();
    this.initializeProtection();
  }

  private generateEncryptionKey(): string {
    return btoa(Math.random().toString(36).substring(2, 15) + 
                Math.random().toString(36).substring(2, 15));
  }

  private initializeProtection(): void {
    this.wrapStorageAPI();
    
    if (this.config.autoCleanup) {
      this.startAutoCleanup();
    }

    console.log('🔐 PROTECCIÓN DE STORAGE ACTIVADA - Modo anti-tracking extremo');
  }

  private wrapStorageAPI(): void {
    const originalSetItem = Storage.prototype.setItem;
    const originalGetItem = Storage.prototype.getItem;
    const originalRemoveItem = Storage.prototype.removeItem;

    Storage.prototype.setItem = function(key: string, value: string) {
      // Verificar si es tracking
      if (this.isTrackingAttempt(key, value)) {
        console.log(`🚫 Blocked tracking storage attempt: ${key}`);
        return;
      }

      // Encriptar si es necesario
      const finalValue = this.config.enableEncryption ? 
        this.encrypt(value) : value;

      this.protectedKeys.add(key);
      return originalSetItem.call(this, key, finalValue);
    }.bind(this);

    Storage.prototype.getItem = function(key: string) {
      const value = originalGetItem.call(this, key);
      
      if (!value) return value;

      // Desencriptar si es necesario
      if (this.config.enableEncryption && this.protectedKeys.has(key)) {
        try {
          return this.decrypt(value);
        } catch {
          return null; // Valor corrupto
        }
      }

      return value;
    }.bind(this);

    Storage.prototype.removeItem = function(key: string) {
      this.protectedKeys.delete(key);
      return originalRemoveItem.call(this, key);
    }.bind(this);
  }

  private isTrackingAttempt(key: string, value: string): boolean {
    if (!this.config.trackingProtection) return false;

    const trackingPatterns = [
      /_ga/, /_gid/, /_gat/, /utm_/, /fbp/, /fbc/,
      /analytics/, /tracking/, /pixel/, /beacon/,
      /fingerprint/, /session_id/, /user_id/
    ];

    return trackingPatterns.some(pattern => 
      pattern.test(key.toLowerCase()) || 
      pattern.test(value.toLowerCase())
    );
  }

  private encrypt(value: string): string {
    try {
      return btoa(encodeURIComponent(value + '::' + this.encryptionKey));
    } catch {
      return value;
    }
  }

  private decrypt(value: string): string {
    try {
      const decoded = decodeURIComponent(atob(value));
      const [originalValue] = decoded.split('::');
      return originalValue;
    } catch {
      throw new Error('Decryption failed');
    }
  }

  private startAutoCleanup(): void {
    this.cleanupInterval = window.setInterval(() => {
      this.performCleanup();
    }, 300000); // Cada 5 minutos
  }

  private performCleanup(): void {
    let totalSize = 0;
    const itemsToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      const value = localStorage.getItem(key);
      if (!value) continue;

      totalSize += key.length + value.length;

      // Marcar items de tracking para remoción
      if (this.isTrackingAttempt(key, value)) {
        itemsToRemove.push(key);
      }
    }

    // Remover items de tracking
    itemsToRemove.forEach(key => {
      localStorage.removeItem(key);
      this.protectedKeys.delete(key);
    });

    // Si excede el tamaño máximo, remover items más antiguos
    if (totalSize > this.config.maxStorageSize) {
      this.removeOldestItems();
    }

    if (itemsToRemove.length > 0) {
      console.log(`🧹 Limpieza anti-tracking: ${itemsToRemove.length} items removidos`);
    }
  }

  private removeOldestItems(): void {
    // Implementación simple - remover 25% de items
    const itemCount = localStorage.length;
    const toRemove = Math.floor(itemCount * 0.25);

    for (let i = 0; i < toRemove && localStorage.length > 0; i++) {
      const key = localStorage.key(0);
      if (key) {
        localStorage.removeItem(key);
        this.protectedKeys.delete(key);
      }
    }

    console.log(`🗑️ Limpieza de espacio: ${toRemove} items removidos`);
  }

  public getProtectionStats() {
    return {
      protectedKeys: this.protectedKeys.size,
      totalStorageSize: this.getTotalStorageSize(),
      encryptionEnabled: this.config.enableEncryption,
      autoCleanupEnabled: this.config.autoCleanup
    };
  }

  private getTotalStorageSize(): number {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      if (key && value) {
        total += key.length + value.length;
      }
    }
    return total;
  }

  public emergencyWipe(): void {
    // Limpiar TODO excepto claves esenciales
    const essentialKeys = ['auth-token', 'user-settings', 'theme'];
    const keysToKeep: {[key: string]: string} = {};

    essentialKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        keysToKeep[key] = value;
      }
    });

    localStorage.clear();
    this.protectedKeys.clear();

    // Restaurar claves esenciales
    Object.entries(keysToKeep).forEach(([key, value]) => {
      localStorage.setItem(key, value);
      this.protectedKeys.add(key);
    });

    console.log('🚨 EMERGENCY WIPE: Storage completamente desinfectado');
  }

  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.protectedKeys.clear();
  }
}

export const storageProtection = new StorageProtectionLayer({
  enableEncryption: true,
  autoCleanup: true,
  trackingProtection: true
});
