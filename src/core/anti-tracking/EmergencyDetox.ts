
/**
 * SISTEMA DE DESINTOXICACIÓN DE EMERGENCIA v2.0
 * Con circuit breaker y debouncing integrado
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
  private lastActivation: number = 0;
  private activationCount: number = 0;
  private readonly COOLDOWN_PERIOD = 30000; // 30 segundos
  private readonly MAX_ACTIVATIONS = 2; // Máximo 2 activaciones
  private circuitBreakerOpen: boolean = false;

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

  public activateEmergencyMode(): boolean {
    const now = Date.now();
    
    // Circuit breaker: si está abierto, no hacer nada
    if (this.circuitBreakerOpen) {
      console.log('🚫 Emergency circuit breaker abierto - Activación bloqueada');
      return false;
    }

    // Debouncing: evitar activaciones muy frecuentes
    if (now - this.lastActivation < this.COOLDOWN_PERIOD) {
      console.log('🕐 Emergencia en cooldown - Ignorando activación');
      return false;
    }

    // Contador de activaciones
    this.activationCount++;
    this.lastActivation = now;

    // Si hay demasiadas activaciones, abrir circuit breaker
    if (this.activationCount >= this.MAX_ACTIVATIONS) {
      this.circuitBreakerOpen = true;
      console.log('🚨 EMERGENCY CIRCUIT BREAKER ABIERTO');
      
      // Cerrar circuit breaker después de 5 minutos y resetear
      setTimeout(() => {
        this.circuitBreakerOpen = false;
        this.activationCount = 0;
        this.emergencyMode = false;
        this.isDetoxing = false;
        this.config.safeMode = false;
        console.log('✅ Emergency circuit breaker cerrado - Sistema restaurado');
      }, 300000);
      
      return false;
    }

    if (this.emergencyMode) return false;
    
    console.log('🚨 ACTIVANDO MODO DE EMERGENCIA CONTROLADO');
    this.emergencyMode = true;
    this.isDetoxing = true;
    this.config.safeMode = true;

    // Restaurar localStorage original
    this.restoreOriginalStorage();
    
    // Modo seguro por tiempo limitado
    setTimeout(() => {
      this.startControlledRestart();
    }, 5000); // 5 segundos

    return true;
  }

  private restoreOriginalStorage(): void {
    try {
      Object.defineProperty(window, 'localStorage', {
        value: this.originalLocalStorage,
        writable: true,
        configurable: true
      });
      
      console.log('✅ Storage original restaurado con circuit breaker');
    } catch (error) {
      console.error('Error restaurando storage:', error);
    }
  }

  private startControlledRestart(): void {
    console.log('🔄 Iniciando reinicio controlado con circuit breaker...');
    
    this.isDetoxing = false;
    
    // Reiniciar con parámetros ultra-seguros
    setTimeout(() => {
      this.restartAntiTrackingSystem();
    }, 3000);
  }

  private restartAntiTrackingSystem(): void {
    try {
      // Solo monitoreo pasivo después de emergencia
      this.setupPassiveMonitoring();
      
      this.emergencyMode = false;
      console.log('✅ Sistema anti-tracking reiniciado en modo pasivo');
    } catch (error) {
      console.error('Error en reinicio:', error);
      this.config.safeMode = true;
    }
  }

  private setupPassiveMonitoring(): void {
    // Solo logging, sin bloqueos
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      const url = args[0] as string;
      
      if (url && typeof url === 'string') {
        const externalTrackers = ['google-analytics.com', 'facebook.com'];
        const isTracking = externalTrackers.some(tracker => url.includes(tracker));
        
        if (isTracking) {
          console.log(`📊 Tracking detectado (no bloqueado): ${url}`);
        }
      }
      
      return originalFetch.apply(this, args);
    };
  }

  public isInternalKey(key: string): boolean {
    return Array.from(this.internalWhitelist).some(prefix => 
      key.toLowerCase().startsWith(prefix.toLowerCase())
    );
  }

  public isSafeMode(): boolean {
    return this.config.safeMode || this.emergencyMode || this.circuitBreakerOpen;
  }

  public getDetoxStatus() {
    return {
      isDetoxing: this.isDetoxing,
      emergencyMode: this.emergencyMode,
      safeMode: this.config.safeMode,
      circuitBreakerOpen: this.circuitBreakerOpen,
      activationCount: this.activationCount,
      lastActivation: this.lastActivation,
      whitelistSize: this.internalWhitelist.size
    };
  }

  public forceReset(): void {
    this.emergencyMode = false;
    this.isDetoxing = false;
    this.config.safeMode = false;
    this.circuitBreakerOpen = false;
    this.activationCount = 0;
    this.restoreOriginalStorage();
    console.log('🔄 Reset forzado con circuit breaker completado');
  }
}

export const emergencyDetox = EmergencyDetox.getInstance();
