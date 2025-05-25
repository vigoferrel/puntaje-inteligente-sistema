
/**
 * ADMINISTRADOR QUIRÚRGICO SINGLETON v6.2 - ESTABILIZACIÓN COMPLETA
 * Control absoluto post-cirugía de emergencia - SINGLETON ULTRA-ESTABLE
 */

import { RespiratorySystem } from './RespiratorySystem';

interface RespiratoryConfig {
  breathsPerMinute: number;
  oxygenThreshold: number;
  purificationLevel: 'basic' | 'advanced' | 'maximum' | 'safe_mode' | 'surgical_recovery';
  antiTrackingMode: boolean;
  emergencyMode: boolean;
}

interface SystemStatus {
  hasInstance: boolean;
  isInitializing: boolean;
  surgicalMode: boolean;
  lastSurgery: number;
  isInRecovery: boolean;
  emergencyActivationCount: number;
  lastEmergencyActivation: number;
  instanceCount: number;
  lockStatus: string;
}

class RespiratorySystemManager {
  private static globalInstance: RespiratorySystem | null = null;
  private static isInitializing: boolean = false;
  private static initializationPromise: Promise<RespiratorySystem> | null = null;
  private static surgicalMode: boolean = false;
  private static lastSurgery: number = 0;
  private static emergencyActivationCount: number = 0;
  private static lastEmergencyActivation: number = 0;
  private static readonly SURGERY_COOLDOWN = 60000; // 1 minuto post-cirugía
  
  // v6.2: LOCK AGRESIVO PARA PREVENIR INSTANCIAS MÚLTIPLES
  private static singletonLock: boolean = false;
  private static instanceCount: number = 0;
  private static lockTimeout: number | null = null;
  private static heartbeatInterval: number | null = null;

  // v6.2: Heartbeat para monitoreo constante
  private static startHeartbeat(): void {
    if (RespiratorySystemManager.heartbeatInterval) {
      clearInterval(RespiratorySystemManager.heartbeatInterval);
    }
    
    RespiratorySystemManager.heartbeatInterval = window.setInterval(() => {
      if (RespiratorySystemManager.globalInstance && 
          RespiratorySystemManager.globalInstance.isDestroyed()) {
        console.log('💓 HEARTBEAT: Instancia destruida detectada, limpiando...');
        RespiratorySystemManager.globalInstance = null;
        RespiratorySystemManager.instanceCount = 0;
      }
    }, 5000); // Cada 5 segundos
  }

  // v6.2: Factory method ultra-estabilizado
  public static async getInstance(config?: Partial<RespiratoryConfig>): Promise<RespiratorySystem> {
    // LOCK AGRESIVO - Prevenir múltiples instancias
    if (RespiratorySystemManager.singletonLock) {
      console.log('🔒 SINGLETON LOCK ACTIVO - Esperando liberación...');
      return new Promise((resolve) => {
        const waitForUnlock = () => {
          if (!RespiratorySystemManager.singletonLock && RespiratorySystemManager.globalInstance) {
            resolve(RespiratorySystemManager.globalInstance);
          } else {
            setTimeout(waitForUnlock, 100);
          }
        };
        waitForUnlock();
      });
    }

    // Si ya hay una instancia válida, retornarla inmediatamente
    if (RespiratorySystemManager.globalInstance && 
        !RespiratorySystemManager.globalInstance.isDestroyed()) {
      console.log('✅ SINGLETON: Retornando instancia existente');
      return RespiratorySystemManager.globalInstance;
    }

    // Si ya se está inicializando, esperar la promesa
    if (RespiratorySystemManager.isInitializing && RespiratorySystemManager.initializationPromise) {
      console.log('⏳ SINGLETON: Esperando inicialización en curso...');
      return RespiratorySystemManager.initializationPromise;
    }

    // ACTIVAR LOCK AGRESIVO
    RespiratorySystemManager.singletonLock = true;
    RespiratorySystemManager.isInitializing = true;
    
    // Timeout de seguridad para el lock
    RespiratorySystemManager.lockTimeout = window.setTimeout(() => {
      console.warn('⚠️ TIMEOUT DEL LOCK - Liberando forzosamente');
      RespiratorySystemManager.singletonLock = false;
      RespiratorySystemManager.isInitializing = false;
    }, 10000); // 10 segundos máximo

    RespiratorySystemManager.initializationPromise = RespiratorySystemManager.createStabilizedInstance(config);

    try {
      const instance = await RespiratorySystemManager.initializationPromise;
      RespiratorySystemManager.globalInstance = instance;
      RespiratorySystemManager.instanceCount = 1;
      
      // Iniciar heartbeat
      RespiratorySystemManager.startHeartbeat();
      
      console.log('🫁 SINGLETON v6.2: Instancia ultra-estabilizada creada');
      return instance;
    } finally {
      // LIBERAR LOCK
      RespiratorySystemManager.singletonLock = false;
      RespiratorySystemManager.isInitializing = false;
      RespiratorySystemManager.initializationPromise = null;
      
      if (RespiratorySystemManager.lockTimeout) {
        clearTimeout(RespiratorySystemManager.lockTimeout);
        RespiratorySystemManager.lockTimeout = null;
      }
    }
  }

  private static async createStabilizedInstance(config?: Partial<RespiratoryConfig>): Promise<RespiratorySystem> {
    // Destruir cualquier instancia previa quirúrgicamente
    if (RespiratorySystemManager.globalInstance) {
      console.log('🔧 SINGLETON: Destruyendo instancia previa...');
      RespiratorySystemManager.globalInstance.destroy();
      RespiratorySystemManager.globalInstance = null;
      RespiratorySystemManager.instanceCount = 0;
    }

    // Configuración post-quirúrgica ultra-estable
    const surgicalConfig: RespiratoryConfig = {
      breathsPerMinute: 4, // Ultra-lento post-cirugía
      oxygenThreshold: 60, // Umbral conservador
      purificationLevel: 'surgical_recovery', // Modo recuperación
      antiTrackingMode: false, // Deshabilitado durante recuperación
      emergencyMode: false,
      ...config
    };

    // Delay quirúrgico para estabilización
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const instance = new RespiratorySystem(surgicalConfig);
    console.log('🫁 SISTEMA RESPIRATORIO POST-CIRUGÍA v6.2: Instancia ultra-estabilizada');
    
    return instance;
  }

  // v6.2: Activación quirúrgica ultra-controlada
  public static activateSurgicalMode(): boolean {
    const now = Date.now();
    
    // Prevenir cirugías muy frecuentes
    if (now - RespiratorySystemManager.lastSurgery < RespiratorySystemManager.SURGERY_COOLDOWN) {
      console.log('🕐 Cirugía en cooldown - Esperando estabilización');
      return false;
    }

    // Verificar que no hay lock activo
    if (RespiratorySystemManager.singletonLock) {
      console.log('🔒 Cirugía bloqueada - Singleton en uso');
      return false;
    }

    RespiratorySystemManager.surgicalMode = true;
    RespiratorySystemManager.lastSurgery = now;

    console.log('🚨 MODO QUIRÚRGICO v6.2 ACTIVADO - ESTABILIZACIÓN COMPLETA');
    
    // Recrear instancia en modo quirúrgico
    setTimeout(async () => {
      try {
        await RespiratorySystemManager.destroyAllInstances();
        await RespiratorySystemManager.getInstance({
          purificationLevel: 'surgical_recovery',
          antiTrackingMode: false,
          emergencyMode: false
        });
      } catch (error) {
        console.error('Error en modo quirúrgico v6.2:', error);
      }
    }, 500);

    return true;
  }

  // v6.2: Activación de emergencia ultra-estable
  public static activateEmergencyMode(): boolean {
    const now = Date.now();
    RespiratorySystemManager.emergencyActivationCount++;
    RespiratorySystemManager.lastEmergencyActivation = now;
    
    console.log('🚨 MODO DE EMERGENCIA ACTIVADO v6.2 - SINGLETON ESTABILIZADO');
    
    // Activar modo quirúrgico inmediatamente
    return RespiratorySystemManager.activateSurgicalMode();
  }

  // v6.2: Destrucción quirúrgica ultra-controlada
  public static async destroyAllInstances(): Promise<void> {
    // Activar lock durante destrucción
    RespiratorySystemManager.singletonLock = true;
    
    try {
      RespiratorySystemManager.isInitializing = false;
      RespiratorySystemManager.initializationPromise = null;

      if (RespiratorySystemManager.globalInstance) {
        RespiratorySystemManager.globalInstance.destroy();
        RespiratorySystemManager.globalInstance = null;
      }

      RespiratorySystemManager.instanceCount = 0;

      // Limpiar heartbeat
      if (RespiratorySystemManager.heartbeatInterval) {
        clearInterval(RespiratorySystemManager.heartbeatInterval);
        RespiratorySystemManager.heartbeatInterval = null;
      }

      // Limpiar memoria quirúrgicamente
      if (typeof window !== 'undefined') {
        (window as any).__RESPIRATORY_SYSTEM_GLOBAL__ = null;
      }

      console.log('🫁 LIMPIEZA QUIRÚRGICA COMPLETADA v6.2 - SINGLETON ESTABILIZADO');
    } finally {
      // Liberar lock
      RespiratorySystemManager.singletonLock = false;
    }
  }

  // v6.2: Estado post-quirúrgico con debugging detallado
  public static getSurgicalStatus() {
    return {
      hasInstance: !!RespiratorySystemManager.globalInstance,
      isInitializing: RespiratorySystemManager.isInitializing,
      surgicalMode: RespiratorySystemManager.surgicalMode,
      lastSurgery: RespiratorySystemManager.lastSurgery,
      isInRecovery: (Date.now() - RespiratorySystemManager.lastSurgery) < RespiratorySystemManager.SURGERY_COOLDOWN,
      instanceCount: RespiratorySystemManager.instanceCount,
      lockStatus: RespiratorySystemManager.singletonLock ? 'LOCKED' : 'UNLOCKED'
    };
  }

  // v6.2: Método getSystemStatus ultra-estable y correctamente exportado
  public static getSystemStatus(): SystemStatus {
    const surgical = RespiratorySystemManager.getSurgicalStatus();
    return {
      ...surgical,
      emergencyActivationCount: RespiratorySystemManager.emergencyActivationCount,
      lastEmergencyActivation: RespiratorySystemManager.lastEmergencyActivation
    };
  }

  // v6.2: Método de debugging para monitoreo
  public static getDebugInfo() {
    return {
      version: '6.2',
      globalInstance: !!RespiratorySystemManager.globalInstance,
      isDestroyed: RespiratorySystemManager.globalInstance?.isDestroyed() || false,
      lockStatus: RespiratorySystemManager.singletonLock ? 'LOCKED' : 'UNLOCKED',
      instanceCount: RespiratorySystemManager.instanceCount,
      isInitializing: RespiratorySystemManager.isInitializing,
      hasHeartbeat: !!RespiratorySystemManager.heartbeatInterval,
      timestamp: new Date().toISOString()
    };
  }
}

export { RespiratorySystemManager };
