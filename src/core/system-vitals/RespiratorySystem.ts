
/**
 * SISTEMA RESPIRATORIO ANTI-TRACKING v4.0 - REPARACIÓN QUIRÚRGICA
 * Singleton robusto con control de instancias múltiples y modo seguro
 */

import { RespiratoryHealth, CirculatoryEvent, EnhancedModuleIdentity } from './types';
import { emergencyDetox } from '@/core/anti-tracking/EmergencyDetox';

interface BreathingOptions {
  breathsPerMinute: number;
  oxygenThreshold: number;
  purificationLevel: 'basic' | 'advanced' | 'maximum' | 'safe_mode' | 'observation';
  antiTrackingMode: boolean;
  emergencyMode: boolean;
}

enum LungState {
  INHALING = 'inhaling',
  EXHALING = 'exhaling', 
  HOLDING = 'holding',
  PURIFYING = 'purifying',
  SAFE_MODE = 'safe_mode',
  DETOXING = 'detoxing',
  EMERGENCY_CLEANING = 'emergency_cleaning',
  OBSERVATION = 'observation'
}

// Registry global para control de instancias
class RespiratoryRegistry {
  private static instances: Map<string, RespiratorySystem> = new Map();
  private static activeInstance: string | null = null;

  static registerInstance(id: string, instance: RespiratorySystem): boolean {
    if (this.instances.size >= 1 && !this.activeInstance) {
      console.warn(`🚫 Registro de instancia respiratoria rechazado: límite alcanzado`);
      return false;
    }

    this.instances.set(id, instance);
    if (!this.activeInstance) {
      this.activeInstance = id;
    }
    
    console.log(`🫁 Instancia respiratoria registrada: ${id} (Total: ${this.instances.size})`);
    return true;
  }

  static unregisterInstance(id: string): void {
    if (this.instances.delete(id)) {
      if (this.activeInstance === id) {
        this.activeInstance = Array.from(this.instances.keys())[0] || null;
      }
      console.log(`🫁 Instancia respiratoria desregistrada: ${id} (Total: ${this.instances.size})`);
    }
  }

  static getActiveInstance(): RespiratorySystem | null {
    return this.activeInstance ? this.instances.get(this.activeInstance) || null : null;
  }

  static destroyAllInstances(): void {
    this.instances.forEach((instance, id) => {
      try {
        instance.forceDestroy();
      } catch (error) {
        console.error(`Error destruyendo instancia ${id}:`, error);
      }
    });
    this.instances.clear();
    this.activeInstance = null;
    console.log('🫁 Todas las instancias respiratorias destruidas');
  }

  static getInstanceCount(): number {
    return this.instances.size;
  }
}

export class RespiratorySystem {
  private static instanceCount = 0;
  private instanceId: string;
  private state: LungState = LungState.OBSERVATION;
  private oxygenLevel: number = 100;
  private breathingRate: number = 0;
  private lastBreath: number = 0;
  private breathHistory: number[] = [];
  private secureStorage = new Map<string, any>();
  private purificationActive: boolean = false;
  private antiTrackingActive: boolean = false;
  private trackingAttackCount: number = 0;
  private readonly options: BreathingOptions;
  private eventListeners: ((event: CirculatoryEvent) => void)[] = [];
  private breathingInterval: number | null = null;
  private antiTrackingInterval: number | null = null;
  private isDestroyed: boolean = false;
  private isRegistered: boolean = false;

  constructor(options: Partial<BreathingOptions> = {}) {
    RespiratorySystem.instanceCount++;
    this.instanceId = `respiratory-${RespiratorySystem.instanceCount}-${Date.now()}`;
    
    // Control estricto de instancias múltiples
    if (RespiratorySystem.instanceCount > 1) {
      const activeInstance = RespiratoryRegistry.getActiveInstance();
      if (activeInstance) {
        console.warn(`⚠️ Instancia respiratoria duplicada detectada, usando la existente`);
        // Retornar la instancia activa en lugar de crear una nueva
        return activeInstance;
      }
    }

    // Registro en el registry global
    const registered = RespiratoryRegistry.registerInstance(this.instanceId, this);
    if (!registered) {
      console.error('🚫 No se pudo registrar la instancia respiratoria');
      this.isDestroyed = true;
      return;
    }
    this.isRegistered = true;

    this.options = {
      breathsPerMinute: 12, // Más lento y seguro
      oxygenThreshold: 85,
      purificationLevel: emergencyDetox.isSafeMode() ? 'safe_mode' : 'observation',
      antiTrackingMode: false, // Deshabilitado por defecto
      emergencyMode: false,
      ...options
    };

    this.initializeRespiratory();
  }

  private initializeRespiratory(): void {
    if (this.isDestroyed) return;

    // Verificar si estamos en modo de emergencia
    if (emergencyDetox.isSafeMode()) {
      this.state = LungState.SAFE_MODE;
      this.initializeSafeMode();
    } else {
      this.state = LungState.OBSERVATION;
      this.initializeObservationMode();
    }

    console.log(`🫁 SISTEMA RESPIRATORIO v4.0 ACTIVADO [${this.instanceId}] - Modo: ${this.state}`);
  }

  private initializeObservationMode(): void {
    // Modo observación ultraconservador
    this.breathingInterval = window.setInterval(() => {
      if (!this.isDestroyed) {
        this.observationalBreath();
      }
    }, 10000); // 10 segundos
  }

  private initializeSafeMode(): void {
    // Modo seguro sin anti-tracking agresivo
    this.breathingInterval = window.setInterval(() => {
      if (!this.isDestroyed) {
        this.safeBreath();
      }
    }, 8000); // 8 segundos
  }

  private observationalBreath(): void {
    this.state = LungState.OBSERVATION;
    this.oxygenLevel = Math.min(100, this.oxygenLevel + 0.5);
    
    // Solo observar, no interferir
    this.passiveMonitoring();
    this.emitObservationalBreath();
  }

  private passiveMonitoring(): void {
    try {
      // Monitoreo ultra-pasivo sin interferir con localStorage
      const storageSize = this.estimateStorageSize();
      if (storageSize > 1000000) { // 1MB
        console.log('📊 Storage size monitored:', storageSize);
      }
    } catch (error) {
      // Monitoreo silencioso
    }
  }

  private estimateStorageSize(): number {
    try {
      return JSON.stringify(localStorage).length;
    } catch {
      return 0;
    }
  }

  private safeBreath(): void {
    this.state = LungState.SAFE_MODE;
    this.oxygenLevel = Math.min(100, this.oxygenLevel + 1);
    
    // Solo limpiar tracking ULTRAOBVIO
    this.ultraConservativeCleanup();
    this.emitSafeBreath();
  }

  private ultraConservativeCleanup(): void {
    try {
      const obviousTrackers = ['_ga', '_gid', '_gat_gtag'];
      let removedCount = 0;
      
      obviousTrackers.forEach(tracker => {
        if (localStorage.getItem(tracker)) {
          try {
            localStorage.removeItem(tracker);
            removedCount++;
          } catch (error) {
            // Silencioso
          }
        }
      });
      
      if (removedCount > 0) {
        console.log(`🧹 Limpieza ultraconservadora: ${removedCount} elementos obvios removidos`);
      }
    } catch (error) {
      // Respiración silenciosa si hay problemas
    }
  }

  private emitObservationalBreath(): void {
    const event: CirculatoryEvent = {
      type: 'breath',
      source: 'lungs',
      data: {
        state: this.state,
        instanceId: this.instanceId,
        observationMode: true,
        oxygenLevel: this.oxygenLevel,
        registryCount: RespiratoryRegistry.getInstanceCount()
      },
      timestamp: Date.now()
    };

    this.eventListeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        // Listener silencioso
      }
    });
  }

  private emitSafeBreath(): void {
    const event: CirculatoryEvent = {
      type: 'breath',
      source: 'lungs',
      data: {
        state: this.state,
        instanceId: this.instanceId,
        safeMode: true,
        oxygenLevel: this.oxygenLevel,
        detoxStatus: emergencyDetox.getDetoxStatus()
      },
      timestamp: Date.now()
    };

    this.eventListeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        // Listener silencioso
      }
    });
  }

  public breatheIn(data: any): boolean {
    if (this.isDestroyed) return false;

    if (emergencyDetox.isSafeMode() || this.state === LungState.OBSERVATION) {
      // En modo seguro/observación, aceptar todo sin procesamiento
      return true;
    }

    const now = Date.now();
    this.breathHistory.push(now);
    this.lastBreath = now;

    // Procesamiento mínimo y seguro
    this.oxygenLevel = Math.max(70, this.oxygenLevel - 1);
    return true;
  }

  public breatheOut(signal: any): any {
    if (this.isDestroyed) return signal;

    if (this.state === LungState.OBSERVATION || emergencyDetox.isSafeMode()) {
      // Modo observación: retornar señal sin modificaciones
      return signal;
    }

    // Incrementar oxígeno al exhalar
    this.oxygenLevel = Math.min(100, this.oxygenLevel + 0.5);
    return signal;
  }

  public oxygenate(module: EnhancedModuleIdentity): EnhancedModuleIdentity {
    if (this.isDestroyed) return module;

    // Oxigenación mínima y segura
    const oxygenatedModule: EnhancedModuleIdentity = {
      ...module,
      security_context: {
        security_mode: 'normal',
        tracking_protected: false,
        shield_level: 1,
        encryption_enabled: false,
        firewall_active: false,
        storage_protected: false,
        purification_level: this.options.purificationLevel,
        emergency_mode: false,
        ...module.security_context
      }
    };

    return oxygenatedModule;
  }

  public getHealth(): RespiratoryHealth {
    return {
      breathingRate: this.breathingRate,
      oxygenLevel: this.oxygenLevel,
      airQuality: this.state === LungState.OBSERVATION ? 'pure' :
                  emergencyDetox.isSafeMode() ? 'filtered' : 
                  this.oxygenLevel > 90 ? 'pure' : 
                  this.oxygenLevel > 70 ? 'filtered' : 'contaminated',
      antiTrackingActive: this.antiTrackingActive && !emergencyDetox.isSafeMode()
    };
  }

  public subscribe(listener: (event: CirculatoryEvent) => void): () => void {
    if (this.isDestroyed) return () => {};

    this.eventListeners.push(listener);
    return () => {
      const index = this.eventListeners.indexOf(listener);
      if (index > -1) {
        this.eventListeners.splice(index, 1);
      }
    };
  }

  public emergencyPurge(): void {
    if (this.isDestroyed) return;

    // Purga ultra-conservadora
    this.ultraConservativeCleanup();
    
    this.secureStorage.clear();
    this.oxygenLevel = 100;
    this.breathHistory = [];
    this.state = LungState.OBSERVATION;
    this.purificationActive = false;
    this.trackingAttackCount = 0;
    
    console.log(`🚨 PURGA DE EMERGENCIA CONSERVADORA COMPLETADA [${this.instanceId}]`);
  }

  public forceDestroy(): void {
    this.isDestroyed = true;
    
    if (this.breathingInterval) {
      clearInterval(this.breathingInterval);
      this.breathingInterval = null;
    }
    if (this.antiTrackingInterval) {
      clearInterval(this.antiTrackingInterval);
      this.antiTrackingInterval = null;
    }
    
    this.eventListeners = [];
    this.secureStorage.clear();
    
    if (this.isRegistered) {
      RespiratoryRegistry.unregisterInstance(this.instanceId);
    }
    
    console.log(`🫁 Sistema respiratorio destruido [${this.instanceId}]`);
  }

  public destroy(): void {
    this.forceDestroy();
  }

  // Método estático para obtener o crear instancia única
  public static getInstance(options?: Partial<BreathingOptions>): RespiratorySystem {
    const activeInstance = RespiratoryRegistry.getActiveInstance();
    if (activeInstance && !activeInstance.isDestroyed) {
      return activeInstance;
    }
    
    // Si no hay instancia activa, crear una nueva
    return new RespiratorySystem(options);
  }

  // Método estático para limpiar todas las instancias
  public static destroyAllInstances(): void {
    RespiratoryRegistry.destroyAllInstances();
    RespiratorySystem.instanceCount = 0;
  }
}
