
/**
 * ADMINISTRADOR QUIRÚRGICO SINGLETON v6.1
 * Control absoluto post-cirugía de emergencia - REPARADO
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

  // Factory method post-quirúrgico
  public static async getInstance(config?: Partial<RespiratoryConfig>): Promise<RespiratorySystem> {
    // Si ya hay una instancia válida post-cirugía, retornarla
    if (RespiratorySystemManager.globalInstance && 
        !RespiratorySystemManager.globalInstance.isDestroyed()) {
      return RespiratorySystemManager.globalInstance;
    }

    // Si ya se está inicializando, esperar la promesa
    if (RespiratorySystemManager.isInitializing && RespiratorySystemManager.initializationPromise) {
      return RespiratorySystemManager.initializationPromise;
    }

    // Inicializar nueva instancia post-quirúrgica
    RespiratorySystemManager.isInitializing = true;
    RespiratorySystemManager.initializationPromise = RespiratorySystemManager.createSurgicalInstance(config);

    try {
      const instance = await RespiratorySystemManager.initializationPromise;
      RespiratorySystemManager.globalInstance = instance;
      return instance;
    } finally {
      RespiratorySystemManager.isInitializing = false;
      RespiratorySystemManager.initializationPromise = null;
    }
  }

  private static async createSurgicalInstance(config?: Partial<RespiratoryConfig>): Promise<RespiratorySystem> {
    // Destruir cualquier instancia previa quirúrgicamente
    if (RespiratorySystemManager.globalInstance) {
      RespiratorySystemManager.globalInstance.destroy();
      RespiratorySystemManager.globalInstance = null;
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
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const instance = new RespiratorySystem(surgicalConfig);
    console.log('🫁 SISTEMA RESPIRATORIO POST-CIRUGÍA v6.1: Instancia estabilizada');
    
    return instance;
  }

  // Activación quirúrgica controlada
  public static activateSurgicalMode(): boolean {
    const now = Date.now();
    
    // Prevenir cirugías muy frecuentes
    if (now - RespiratorySystemManager.lastSurgery < RespiratorySystemManager.SURGERY_COOLDOWN) {
      console.log('🕐 Cirugía en cooldown - Esperando estabilización');
      return false;
    }

    RespiratorySystemManager.surgicalMode = true;
    RespiratorySystemManager.lastSurgery = now;

    console.log('🚨 MODO QUIRÚRGICO v6.1 ACTIVADO');
    
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
        console.error('Error en modo quirúrgico:', error);
      }
    }, 500);

    return true;
  }

  // REPARACIÓN v6.1: Activación de emergencia correcta
  public static activateEmergencyMode(): boolean {
    const now = Date.now();
    RespiratorySystemManager.emergencyActivationCount++;
    RespiratorySystemManager.lastEmergencyActivation = now;
    
    console.log('🚨 MODO DE EMERGENCIA ACTIVADO v6.1');
    
    // Activar modo quirúrgico inmediatamente
    return RespiratorySystemManager.activateSurgicalMode();
  }

  // Destrucción quirúrgica controlada
  public static async destroyAllInstances(): Promise<void> {
    RespiratorySystemManager.isInitializing = false;
    RespiratorySystemManager.initializationPromise = null;

    if (RespiratorySystemManager.globalInstance) {
      RespiratorySystemManager.globalInstance.destroy();
      RespiratorySystemManager.globalInstance = null;
    }

    // Limpiar memoria quirúrgicamente
    if (typeof window !== 'undefined') {
      (window as any).__RESPIRATORY_SYSTEM_GLOBAL__ = null;
    }

    console.log('🫁 LIMPIEZA QUIRÚRGICA COMPLETADA v6.1');
  }

  // Estado post-quirúrgico
  public static getSurgicalStatus() {
    return {
      hasInstance: !!RespiratorySystemManager.globalInstance,
      isInitializing: RespiratorySystemManager.isInitializing,
      surgicalMode: RespiratorySystemManager.surgicalMode,
      lastSurgery: RespiratorySystemManager.lastSurgery,
      isInRecovery: (Date.now() - RespiratorySystemManager.lastSurgery) < RespiratorySystemManager.SURGERY_COOLDOWN
    };
  }

  // REPARACIÓN v6.1: Método getSystemStatus correctamente exportado
  public static getSystemStatus(): SystemStatus {
    const surgical = RespiratorySystemManager.getSurgicalStatus();
    return {
      ...surgical,
      emergencyActivationCount: RespiratorySystemManager.emergencyActivationCount,
      lastEmergencyActivation: RespiratorySystemManager.lastEmergencyActivation
    };
  }
}

export { RespiratorySystemManager };
