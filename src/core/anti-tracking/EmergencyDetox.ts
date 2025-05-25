
/**
 * SISTEMA DE DESINTOXICACIÓN DE EMERGENCIA v1.0
 * Detoxificación quirúrgica para prevenir auto-destrucción
 */

interface DetoxConfig {
  safeMode: boolean;
  whitelistInternal: string[];
  throttleInterval: number;
  maxRetries: number;
}

export class EmergencyDetox {
  private static instance: EmergencyDetox;
  private isDetoxing: boolean = false;
  private emergencyMode: boolean = false;
  private originalLocalStorage: Storage;
  private internalWhitelist: Set<string>;
  private config: DetoxConfig;

  private constructor() {
    this.originalLocalStorage = window.localStorage;
    this.internalWhitelist = new Set([
      'paes-',
      'auth-',
      'user-',
      'neural-',
      'intersectional-',
      'lectoguia-',
      'plan-',
      'diagnostic-',
      'theme',
      'settings',
      'lovable-'
    ]);
    
    this.config = {
      safeMode: false,
      whitelistInternal: Array.from(this.internalWhitelist),
      throttleInterval: 1000,
      maxRetries: 3
    };
  }

  public static getInstance(): EmergencyDetox {
    if (!EmergencyDetox.instance) {
      EmergencyDetox.instance = new EmergencyDetox();
    }
    return EmergencyDetox.instance;
  }

  public activateEmergencyMode(): void {
    if (this.emergencyMode) return;
    
    console.log('🚨 ACTIVANDO MODO DE EMERGENCIA - Desintoxicación iniciada');
    this.emergencyMode = true;
    this.isDetoxing = true;

    // Restaurar localStorage original inmediatamente
    this.restoreOriginalStorage();
    
    // Detener todos los intervalos anti-tracking
    this.clearAllIntervals();
    
    // Modo seguro por 10 segundos
    setTimeout(() => {
      this.startControlledRestart();
    }, 10000);
  }

  private restoreOriginalStorage(): void {
    try {
      // Restaurar localStorage sin proxies
      Object.defineProperty(window, 'localStorage', {
        value: this.originalLocalStorage,
        writable: true,
        configurable: true
      });
      
      console.log('✅ Storage original restaurado');
    } catch (error) {
      console.error('Error restaurando storage:', error);
    }
  }

  private clearAllIntervals(): void {
    // Limpiar todos los intervalos posibles
    for (let i = 1; i < 99999; i++) {
      clearInterval(i);
      clearTimeout(i);
    }
    console.log('✅ Intervalos limpiados');
  }

  private startControlledRestart(): void {
    console.log('🔄 Iniciando reinicio controlado...');
    
    this.config.safeMode = true;
    this.isDetoxing = false;
    
    // Reiniciar con parámetros seguros
    setTimeout(() => {
      this.restartAntiTrackingSystem();
    }, 5000);
  }

  private restartAntiTrackingSystem(): void {
    try {
      // Solo bloquear tracking real, no funcionalidad interna
      this.setupSafeTracking();
      
      this.emergencyMode = false;
      console.log('✅ Sistema anti-tracking reiniciado en modo seguro');
    } catch (error) {
      console.error('Error en reinicio:', error);
      // Mantener modo seguro si hay problemas
      this.config.safeMode = true;
    }
  }

  private setupSafeTracking(): void {
    const self = this;
    
    // Override solo para URLs externas de tracking
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      const url = args[0] as string;
      
      // Solo bloquear URLs externas conocidas de tracking
      if (self.isExternalTrackingUrl(url)) {
        console.log(`🚫 Blocked external tracking: ${url}`);
        return Promise.reject(new Error('Blocked external tracking'));
      }
      
      return originalFetch.apply(this, args);
    };
  }

  private isExternalTrackingUrl(url: string): boolean {
    const externalTrackers = [
      'google-analytics.com',
      'facebook.com',
      'doubleclick.net',
      'googlesyndication.com',
      'amazon-adsystem.com'
    ];
    
    return externalTrackers.some(tracker => url.includes(tracker));
  }

  public isInternalKey(key: string): boolean {
    return Array.from(this.internalWhitelist).some(prefix => 
      key.toLowerCase().startsWith(prefix.toLowerCase())
    );
  }

  public isSafeMode(): boolean {
    return this.config.safeMode || this.emergencyMode;
  }

  public getDetoxStatus() {
    return {
      isDetoxing: this.isDetoxing,
      emergencyMode: this.emergencyMode,
      safeMode: this.config.safeMode,
      whitelistSize: this.internalWhitelist.size
    };
  }

  public forceReset(): void {
    this.emergencyMode = false;
    this.isDetoxing = false;
    this.config.safeMode = false;
    this.restoreOriginalStorage();
    console.log('🔄 Reset forzado completado');
  }
}

export const emergencyDetox = EmergencyDetox.getInstance();
