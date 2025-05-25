
/**
 * ADMINISTRADOR SINGLETON GLOBAL v1.0
 * Control absoluto de instancias del sistema respiratorio
 */

import { RespiratorySystem } from './RespiratorySystem';

interface RespiratoryConfig {
  breathsPerMinute: number;
  oxygenThreshold: number;
  purificationLevel: 'basic' | 'advanced' | 'maximum' | 'safe_mode' | 'observation';
  antiTrackingMode: boolean;
  emergencyMode: boolean;
}

class RespiratorySystemManager {
  private static globalInstance: RespiratorySystem | null = null;
  private static isInitializing: boolean = false;
  private static initializationPromise: Promise<RespiratorySystem> | null = null;
  private static lastEmergencyActivation: number = 0;
  private static emergencyActivationCount: number = 0;
  private static readonly EMERGENCY_COOLDOWN = 30000; // 30 segundos
  private static readonly MAX_EMERGENCY_ACTIVATIONS = 3;
  private static circuitBreakerOpen: boolean = false;

  // Validación de React Strict Mode
  private static isStrictMode(): boolean {
    return process.env.NODE_ENV === 'development' && 
           typeof window !== 'undefined' && 
           (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
  }

  // Factory method estático principal
  public static async getInstance(config?: Partial<RespiratoryConfig>): Promise<RespiratorySystem> {
    // Si ya hay una instancia válida, retornarla
    if (RespiratorySystemManager.globalInstance && 
        !RespiratorySystemManager.globalInstance.isDestroyed()) {
      return RespiratorySystemManager.globalInstance;
    }

    // Si ya se está inicializando, esperar la promesa
    if (RespiratorySystemManager.isInitializing && RespiratorySystemManager.initializationPromise) {
      return RespiratorySystemManager.initializationPromise;
    }

    // Inicializar nueva instancia
    RespiratorySystemManager.isInitializing = true;
    RespiratorySystemManager.initializationPromise = RespiratorySystemManager.createInstance(config);

    try {
      const instance = await RespiratorySystemManager.initializationPromise;
      RespiratorySystemManager.globalInstance = instance;
      return instance;
    } finally {
      RespiratorySystemManager.isInitializing = false;
      RespiratorySystemManager.initializationPromise = null;
    }
  }

  private static async createInstance(config?: Partial<RespiratoryConfig>): Promise<RespiratorySystem> {
    // Destruir cualquier instancia previa
    if (RespiratorySystemManager.globalInstance) {
      RespiratorySystemManager.globalInstance.destroy();
      RespiratorySystemManager.globalInstance = null;
    }

    // Configuración ultra-conservadora
    const safeConfig: RespiratoryConfig = {
      breathsPerMinute: 6, // Muy lento
      oxygenThreshold: 50, // Umbral bajo
      purificationLevel: 'observation', // Solo observar
      antiTrackingMode: false, // Deshabilitado
      emergencyMode: false,
      ...config
    };

    // Crear nueva instancia con delay para evitar race conditions
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const instance = new RespiratorySystem(safeConfig);
    console.log('🫁 SINGLETON GLOBAL: Nueva instancia creada con control absoluto');
    
    return instance;
  }

  // Modo de emergencia con circuit breaker
  public static activateEmergencyMode(): boolean {
    const now = Date.now();
    
    // Circuit breaker: si está abierto, no hacer nada
    if (RespiratorySystemManager.circuitBreakerOpen) {
      console.log('🚫 Circuit breaker abierto - Emergencia bloqueada');
      return false;
    }

    // Debouncing: evitar activaciones muy frecuentes
    if (now - RespiratorySystemManager.lastEmergencyActivation < RespiratorySystemManager.EMERGENCY_COOLDOWN) {
      console.log('🕐 Emergencia en cooldown - Ignorando activación');
      return false;
    }

    // Contador de activaciones
    RespiratorySystemManager.emergencyActivationCount++;
    RespiratorySystemManager.lastEmergencyActivation = now;

    // Si hay demasiadas activaciones, abrir circuit breaker
    if (RespiratorySystemManager.emergencyActivationCount >= RespiratorySystemManager.MAX_EMERGENCY_ACTIVATIONS) {
      RespiratorySystemManager.circuitBreakerOpen = true;
      console.log('🚨 CIRCUIT BREAKER ABIERTO - Demasiadas emergencias');
      
      // Cerrar circuit breaker después de 5 minutos
      setTimeout(() => {
        RespiratorySystemManager.circuitBreakerOpen = false;
        RespiratorySystemManager.emergencyActivationCount = 0;
        console.log('✅ Circuit breaker cerrado - Sistema restaurado');
      }, 300000);
      
      return false;
    }

    console.log('🚨 MODO DE EMERGENCIA ACTIVADO - Con control de cascada');
    
    // Destruir instancia actual y recrear en modo seguro
    setTimeout(async () => {
      try {
        await RespiratorySystemManager.destroyAllInstances();
        await RespiratorySystemManager.getInstance({
          purificationLevel: 'safe_mode',
          antiTrackingMode: false,
          emergencyMode: true
        });
      } catch (error) {
        console.error('Error en modo de emergencia:', error);
      }
    }, 1000);

    return true;
  }

  // Destrucción controlada
  public static async destroyAllInstances(): Promise<void> {
    RespiratorySystemManager.isInitializing = false;
    RespiratorySystemManager.initializationPromise = null;

    if (RespiratorySystemManager.globalInstance) {
      RespiratorySystemManager.globalInstance.destroy();
      RespiratorySystemManager.globalInstance = null;
    }

    // Limpiar cualquier instancia fantasma
    if (typeof window !== 'undefined') {
      (window as any).__RESPIRATORY_SYSTEM_GLOBAL__ = null;
    }

    console.log('🫁 SINGLETON GLOBAL: Todas las instancias destruidas');
  }

  // Obtener instancia actual sin crear nueva
  public static getCurrentInstance(): RespiratorySystem | null {
    return RespiratorySystemManager.globalInstance;
  }

  // Estado del sistema
  public static getSystemStatus() {
    return {
      hasInstance: !!RespiratorySystemManager.globalInstance,
      isInitializing: RespiratorySystemManager.isInitializing,
      circuitBreakerOpen: RespiratorySystemManager.circuitBreakerOpen,
      emergencyActivationCount: RespiratorySystemManager.emergencyActivationCount,
      lastEmergencyActivation: RespiratorySystemManager.lastEmergencyActivation,
      isStrictMode: RespiratorySystemManager.isStrictMode()
    };
  }
}

export { RespiratorySystemManager };
