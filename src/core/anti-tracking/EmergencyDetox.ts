
/**
 * SISTEMA DE DESINTOXICACIÓN DE EMERGENCIA v7.2 - OPTIMIZADO Y THROTTLED
 * Protección contra autodestrucción del sistema con logging controlado
 */

interface DetoxStatus {
  isSafeMode: boolean;
  isEmergencyActive: boolean;
  detoxLevel: 'minimal' | 'moderate' | 'aggressive' | 'surgical';
  lastDetoxTime: number;
  interventionCount: number;
  systemStability: 'stable' | 'unstable' | 'critical';
}

class EmergencyDetoxSystem {
  private detoxStatus: DetoxStatus = {
    isSafeMode: false,
    isEmergencyActive: false,
    detoxLevel: 'minimal',
    lastDetoxTime: 0,
    interventionCount: 0,
    systemStability: 'stable'
  };

  private emergencyActivationCount = 0;
  private lastEmergencyActivation = 0;
  private safetyLock = false;
  private lastLogTime = 0;
  private logThrottle = 60000; // 1 minuto entre logs

  constructor() {
    this.initializeDetoxSystem();
  }

  private initializeDetoxSystem(): void {
    // Verificación de estabilidad cada 2 minutos (reducido)
    setInterval(() => {
      this.performStabilityCheck();
    }, 120000);

    // Monitoreo de tracking prevention con throttle
    if (typeof window !== 'undefined') {
      this.setupTrackingPreventionMonitor();
    }
  }

  private logThrottled(message: string, force: boolean = false): void {
    const now = Date.now();
    if (force || now - this.lastLogTime > this.logThrottle) {
      console.log(message);
      this.lastLogTime = now;
    }
  }

  private setupTrackingPreventionMonitor(): void {
    // Monitor throttled para tracking prevention
    let trackingPreventionCount = 0;
    const originalStorageAccess = Storage.prototype.setItem;
    
    Storage.prototype.setItem = function(key: string, value: string) {
      try {
        return originalStorageAccess.call(this, key, value);
      } catch (error) {
        trackingPreventionCount++;
        
        // Solo actuar si hay muchos bloqueos consecutivos
        if (trackingPreventionCount > 20) {
          emergencyDetox.handleTrackingPrevention();
          trackingPreventionCount = 0; // Reset contador
        }
        
        throw error;
      }
    };
  }

  private performStabilityCheck(): void {
    const now = Date.now();
    
    // Evaluar estabilidad del sistema
    if (this.emergencyActivationCount > 5 && now - this.lastEmergencyActivation < 300000) {
      this.detoxStatus.systemStability = 'critical';
    } else if (this.emergencyActivationCount > 2 && now - this.lastEmergencyActivation < 600000) {
      this.detoxStatus.systemStability = 'unstable';
    } else {
      this.detoxStatus.systemStability = 'stable';
    }

    // Auto-recovery si el sistema está estable
    if (this.detoxStatus.systemStability === 'stable' && this.detoxStatus.isSafeMode) {
      this.logThrottled('🔄 Sistema estable detectado, desactivando modo seguro v7.2');
      this.deactivateSafeMode();
    }
  }

  public isSafeMode(): boolean {
    return this.detoxStatus.isSafeMode;
  }

  public activateEmergencyMode(): void {
    const now = Date.now();
    
    // Prevenir activaciones spam
    if (this.safetyLock || (now - this.lastEmergencyActivation < 30000)) {
      this.logThrottled('⚠️ Activación de emergencia bloqueada por safety lock v7.2');
      return;
    }

    this.safetyLock = true;
    this.emergencyActivationCount++;
    this.lastEmergencyActivation = now;

    this.detoxStatus.isEmergencyActive = true;
    this.detoxStatus.isSafeMode = true;
    this.detoxStatus.detoxLevel = 'surgical';
    this.detoxStatus.lastDetoxTime = now;

    // Log de emergencia SIEMPRE se muestra
    console.log('🚨 MODO DE EMERGENCIA DETOX v7.2 ACTIVADO - Intervención quirúrgica');

    this.performEmergencyDetox();

    // Release safety lock después de 10 segundos
    setTimeout(() => {
      this.safetyLock = false;
    }, 10000);
  }

  private performEmergencyDetox(): void {
    try {
      // Limpiar storage de forma controlada
      this.clearStorageSafely();
      
      // Reiniciar sistemas críticos
      this.resetCriticalSystems();
      
      // Optimizar memoria
      this.optimizeMemoryUsage();
      
      this.logThrottled('✅ Desintoxicación de emergencia v7.2 completada', true);
      
    } catch (error) {
      console.error('❌ Error en desintoxicación de emergencia v7.2:', error);
    }
  }

  private clearStorageSafely(): void {
    try {
      // Preservar datos esenciales
      const essentialKeys = ['auth-token', 'user-preferences', 'language-setting'];
      const preservedData: Record<string, string> = {};
      
      essentialKeys.forEach(key => {
        try {
          const value = localStorage.getItem(key);
          if (value) preservedData[key] = value;
        } catch (e) {
          // Ignorar errores de acceso
        }
      });

      // Limpiar storage
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
        // Storage bloqueado por tracking prevention
      }

      // Restaurar datos esenciales
      Object.entries(preservedData).forEach(([key, value]) => {
        try {
          localStorage.setItem(key, value);
        } catch (e) {
          // Ignorar si no se puede restaurar
        }
      });

    } catch (error) {
      console.warn('⚠️ Error en limpieza de storage v7.2:', error);
    }
  }

  private resetCriticalSystems(): void {
    try {
      // Reset del sistema cardiovascular singleton
      if (typeof window !== 'undefined' && (window as any).CardiovascularSystem) {
        (window as any).CardiovascularSystem.resetSingleton();
      }
      
      // Limpiar event listeners
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeunload', this.handlePageUnload);
        window.removeEventListener('error', this.handleGlobalError);
      }
      
    } catch (error) {
      console.warn('⚠️ Error en reset de sistemas críticos v7.2:', error);
    }
  }

  private optimizeMemoryUsage(): void {
    try {
      // Garbage collection hint
      if (typeof window !== 'undefined' && (window as any).gc) {
        (window as any).gc();
      }
      
      // Limpiar timeouts/intervals huérfanos
      const highestTimeoutId = setTimeout(() => {}, 0);
      for (let i = 0; i < highestTimeoutId; i++) {
        clearTimeout(i);
        clearInterval(i);
      }
      
    } catch (error) {
      console.warn('⚠️ Error en optimización de memoria v7.2:', error);
    }
  }

  public handleTrackingPrevention(): void {
    this.detoxStatus.interventionCount++;
    
    // Solo activar emergencia si hay muchas intervenciones
    if (this.detoxStatus.interventionCount > 10) {
      this.logThrottled('🛡️ Múltiples bloqueos de tracking detectados, activando modo seguro v7.2');
      this.activateSafeMode();
      this.detoxStatus.interventionCount = 0; // Reset
    }
  }

  private activateSafeMode(): void {
    if (this.detoxStatus.isSafeMode) return;
    
    this.detoxStatus.isSafeMode = true;
    this.detoxStatus.detoxLevel = 'moderate';
    this.logThrottled('🛡️ MODO SEGURO ACTIVADO v7.2 - Sistema en protección');
  }

  private deactivateSafeMode(): void {
    this.detoxStatus.isSafeMode = false;
    this.detoxStatus.isEmergencyActive = false;
    this.detoxStatus.detoxLevel = 'minimal';
    this.detoxStatus.interventionCount = 0;
  }

  public getDetoxStatus(): DetoxStatus {
    return { ...this.detoxStatus };
  }

  private handlePageUnload = (): void => {
    if (this.detoxStatus.isEmergencyActive) {
      this.performEmergencyDetox();
    }
  };

  private handleGlobalError = (event: ErrorEvent): void => {
    this.detoxStatus.interventionCount++;
    
    if (this.detoxStatus.interventionCount > 5) {
      this.logThrottled('🚨 Múltiples errores detectados, considerando modo de emergencia v7.2');
    }
  };
}

// Singleton global del sistema de detox
export const emergencyDetox = new EmergencyDetoxSystem();

// Clase exportada para compatibilidad
export class EmergencyDetox {
  static getInstance(): EmergencyDetoxSystem {
    return emergencyDetox;
  }
}
