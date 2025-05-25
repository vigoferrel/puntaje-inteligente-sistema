/**
 * SISTEMA CARDIOVASCULAR INTEGRISTA v8.0 - ARQUITECTURA MONOLÍTICA UNIFICADA
 * Responsabilidad total: Control cardiovascular + Detox + Anti-tracking + Emergencias
 * NUEVA FUNCIONALIDAD: Absorción completa de EmergencyDetox en singleton cardiovascular
 */

import { CardiovascularHealth, CirculatoryEvent, EnhancedModuleIdentity } from './types';

interface HeartbeatOptions {
  maxBeatsPerSecond: number;
  restingPeriod: number;
  recoveryTime: number;
  emergencyThreshold: number;
  purificationLevel: 'basic' | 'advanced' | 'maximum' | 'safe_mode' | 'surgical_recovery';
  oxygenThreshold: number;
}

// ESTADO DE DETOX INTEGRADO
interface IntegratedDetoxStatus {
  isSafeMode: boolean;
  isEmergencyActive: boolean;
  detoxLevel: 'minimal' | 'moderate' | 'aggressive' | 'surgical';
  lastDetoxTime: number;
  interventionCount: number;
  systemStability: 'stable' | 'unstable' | 'critical';
}

enum HeartState {
  RESTING = 'resting',
  NORMAL = 'normal', 
  ELEVATED = 'elevated',
  EMERGENCY = 'emergency',
  PURIFYING = 'purifying',
  DETOXING = 'detoxing'
}

// SINGLETON GLOBAL INTEGRISTA v8.0
let globalCardiovascularInstance: CardiovascularSystem | null = null;
let instanceCreationLock = false;

export class CardiovascularSystem {
  private static instance: CardiovascularSystem | null = null;
  private static creationTime: number = 0;
  
  private state: HeartState = HeartState.NORMAL;
  private heartRate: number = 0;
  private lastBeat: number = 0;
  private beatHistory: number[] = [];
  private emergencyStartTime: number = 0;
  private oxygenLevel: number = 100;
  private purificationActive: boolean = false;
  private readonly options: HeartbeatOptions;
  private eventListeners: ((event: CirculatoryEvent) => void)[] = [];
  private secureStorage = new Map<string, any>();
  private systemStatus: 'active' | 'degraded' | 'emergency' | 'offline' = 'active';
  private emergencyMode: boolean = false;
  private lastLogTime: number = 0;
  private logThrottle: number = 60000; // 1 minuto entre logs

  // SISTEMA DETOX INTEGRADO v8.0
  private detoxStatus: IntegratedDetoxStatus = {
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
  private lastDetoxLogTime = 0;
  private detoxLogThrottle = 60000; // 1 minuto entre logs de detox

  constructor(options: Partial<HeartbeatOptions> = {}) {
    // SINGLETON ENFORCEMENT v8.0
    if (globalCardiovascularInstance) {
      console.log('🫀 Reutilizando instancia cardiovascular integrista v8.0');
      return globalCardiovascularInstance;
    }

    if (instanceCreationLock) {
      console.warn('⚠️ Creación de instancia cardiovascular bloqueada por lock');
      throw new Error('Cardiovascular instance creation locked');
    }

    instanceCreationLock = true;
    
    this.options = {
      maxBeatsPerSecond: 8,
      restingPeriod: 2000,
      recoveryTime: 5000,
      emergencyThreshold: 12,
      purificationLevel: 'safe_mode',
      oxygenThreshold: 60,
      ...options
    };

    globalCardiovascularInstance = this;
    CardiovascularSystem.instance = this;
    CardiovascularSystem.creationTime = Date.now();

    this.initializeIntegratedSystem();
    
    // Log inicial controlado UNIFICADO
    console.log('🫀 SISTEMA CARDIOVASCULAR INTEGRISTA v8.0 INICIADO (Detox + Cardio)');
    
    instanceCreationLock = false;
  }

  // INICIALIZACIÓN INTEGRADA DE TODOS LOS SISTEMAS
  private initializeIntegratedSystem(): void {
    this.startUnifiedHeartbeat();
    this.setupIntegratedAntiTracking();
  }

  // MÉTODO ESTÁTICO SINGLETON
  public static getInstance(options?: Partial<HeartbeatOptions>): CardiovascularSystem {
    if (!CardiovascularSystem.instance || !globalCardiovascularInstance) {
      new CardiovascularSystem(options);
    }
    return CardiovascularSystem.instance!;
  }

  public static hasInstance(): boolean {
    return !!CardiovascularSystem.instance && !!globalCardiovascularInstance;
  }

  // HEARTBEAT UNIFICADO QUE INCLUYE DETOX
  private startUnifiedHeartbeat(): void {
    setInterval(() => {
      this.cleanBeatHistory();
      this.adjustHeartState();
      this.performIntegratedPurification();
      this.performStabilityCheck();
      this.emitUnifiedHeartbeat();
    }, 1000);
  }

  // SISTEMA ANTI-TRACKING INTEGRADO
  private setupIntegratedAntiTracking(): void {
    if (typeof window === 'undefined') return;

    let trackingPreventionCount = 0;
    const originalStorageAccess = Storage.prototype.setItem;
    
    Storage.prototype.setItem = function(key: string, value: string) {
      try {
        return originalStorageAccess.call(this, key, value);
      } catch (error) {
        trackingPreventionCount++;
        
        if (trackingPreventionCount > 20) {
          const cardiovascularInstance = CardiovascularSystem.getInstance();
          cardiovascularInstance.handleIntegratedTrackingPrevention();
          trackingPreventionCount = 0;
        }
        
        throw error;
      }
    };
  }

  // MANEJO INTEGRADO DE TRACKING PREVENTION
  public handleIntegratedTrackingPrevention(): void {
    this.detoxStatus.interventionCount++;
    
    const shouldLog = Date.now() - this.lastDetoxLogTime > this.detoxLogThrottle;
    
    if (this.detoxStatus.interventionCount > 10) {
      if (shouldLog) {
        console.log('🛡️ Múltiples bloqueos detectados, activando modo seguro integrado v8.0');
        this.lastDetoxLogTime = Date.now();
      }
      this.activateIntegratedSafeMode();
      this.detoxStatus.interventionCount = 0;
    }
  }

  // VERIFICACIÓN DE ESTABILIDAD INTEGRADA
  private performStabilityCheck(): void {
    const now = Date.now();
    
    // Evaluar estabilidad del sistema integrado
    if (this.emergencyActivationCount > 5 && now - this.lastEmergencyActivation < 300000) {
      this.detoxStatus.systemStability = 'critical';
    } else if (this.emergencyActivationCount > 2 && now - this.lastEmergencyActivation < 600000) {
      this.detoxStatus.systemStability = 'unstable';
    } else {
      this.detoxStatus.systemStability = 'stable';
    }

    // Auto-recovery si el sistema está estable
    if (this.detoxStatus.systemStability === 'stable' && this.detoxStatus.isSafeMode) {
      const shouldLog = Date.now() - this.lastDetoxLogTime > this.detoxLogThrottle;
      if (shouldLog) {
        console.log('🔄 Sistema estable detectado, desactivando modo seguro v8.0');
        this.lastDetoxLogTime = Date.now();
      }
      this.deactivateIntegratedSafeMode();
    }
  }

  // MODO SEGURO INTEGRADO
  private activateIntegratedSafeMode(): void {
    if (this.detoxStatus.isSafeMode) return;
    
    this.detoxStatus.isSafeMode = true;
    this.detoxStatus.detoxLevel = 'moderate';
    this.state = HeartState.PURIFYING;
  }

  private deactivateIntegratedSafeMode(): void {
    this.detoxStatus.isSafeMode = false;
    this.detoxStatus.isEmergencyActive = false;
    this.detoxStatus.detoxLevel = 'minimal';
    this.detoxStatus.interventionCount = 0;
    if (this.state === HeartState.PURIFYING) {
      this.state = HeartState.NORMAL;
    }
  }

  // MODO DE EMERGENCIA INTEGRADO
  public activateIntegratedEmergencyMode(): void {
    const now = Date.now();
    
    if (this.safetyLock || (now - this.lastEmergencyActivation < 30000)) {
      const shouldLog = Date.now() - this.lastDetoxLogTime > this.detoxLogThrottle;
      if (shouldLog) {
        console.log('⚠️ Activación de emergencia bloqueada por safety lock v8.0');
        this.lastDetoxLogTime = Date.now();
      }
      return;
    }

    this.safetyLock = true;
    this.emergencyActivationCount++;
    this.lastEmergencyActivation = now;

    this.detoxStatus.isEmergencyActive = true;
    this.detoxStatus.isSafeMode = true;
    this.detoxStatus.detoxLevel = 'surgical';
    this.detoxStatus.lastDetoxTime = now;
    
    this.emergencyMode = true;
    this.systemStatus = 'emergency';
    this.state = HeartState.EMERGENCY;
    this.emergencyStartTime = Date.now();

    // Log de emergencia SIEMPRE se muestra
    console.log('🚨 MODO DE EMERGENCIA CARDIOVASCULAR INTEGRISTA v8.0 ACTIVADO');
    
    this.performIntegratedEmergencyDetox();

    setTimeout(() => {
      this.safetyLock = false;
    }, 10000);
  }

  // DETOX DE EMERGENCIA INTEGRADO
  private performIntegratedEmergencyDetox(): void {
    try {
      this.clearStorageSafely();
      this.resetIntegratedSystems();
      this.optimizeIntegratedMemory();
      
      console.log('✅ Desintoxicación cardiovascular integrada v8.0 completada');
      
    } catch (error) {
      console.error('❌ Error en desintoxicación integrada v8.0:', error);
    }
  }

  // LIMPIEZA SEGURA DE STORAGE INTEGRADA
  private clearStorageSafely(): void {
    try {
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

      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
        // Storage bloqueado por tracking prevention
      }

      Object.entries(preservedData).forEach(([key, value]) => {
        try {
          localStorage.setItem(key, value);
        } catch (e) {
          // Ignorar si no se puede restaurar
        }
      });

    } catch (error) {
      console.warn('⚠️ Error en limpieza de storage integrada v8.0:', error);
    }
  }

  // RESET DE SISTEMAS INTEGRADO
  private resetIntegratedSystems(): void {
    try {
      // Reset del propio singleton
      if (typeof window !== 'undefined' && (window as any).CardiovascularSystem) {
        (window as any).CardiovascularSystem.resetSingleton();
      }
      
      // Limpiar event listeners
      if (typeof window !== 'undefined') {
        const eventsToClean = ['beforeunload', 'error', 'unload'];
        eventsToClean.forEach(eventType => {
          const existingHandlers = (window as any)[`${eventType}Handlers`] || [];
          existingHandlers.forEach((handler: EventListener) => {
            window.removeEventListener(eventType, handler);
          });
        });
      }
      
    } catch (error) {
      console.warn('⚠️ Error en reset de sistemas integrados v8.0:', error);
    }
  }

  // OPTIMIZACIÓN DE MEMORIA INTEGRADA
  private optimizeIntegratedMemory(): void {
    try {
      if (typeof window !== 'undefined' && (window as any).gc) {
        (window as any).gc();
      }
      
      if (typeof window !== 'undefined') {
        const timersToClean = ['detoxTimer', 'stabilityTimer', 'cardiovascularTimer', 'integrationTimer'];
        timersToClean.forEach(timerName => {
          const timer = (window as any)[timerName];
          if (timer) {
            clearTimeout(timer);
            clearInterval(timer);
            delete (window as any)[timerName];
          }
        });
      }
      
    } catch (error) {
      console.warn('⚠️ Error en optimización de memoria integrada v8.0:', error);
    }
  }

  // GETTERS INTEGRADOS
  public isSafeMode(): boolean {
    return this.detoxStatus.isSafeMode;
  }

  public getIntegratedDetoxStatus(): IntegratedDetoxStatus {
    return { ...this.detoxStatus };
  }

  public getIntegratedSystemStatus(): {
    cardiovascular: CardiovascularHealth;
    detox: IntegratedDetoxStatus;
    status: 'active' | 'degraded' | 'emergency' | 'offline';
    heartRate: number;
    oxygenLevel: number;
    emergencyMode: boolean;
    purificationActive: boolean;
    timestamp: number;
    singletonInfo: {
      isSingleton: boolean;
      creationTime: number;
      instanceId: string;
      version: string;
    };
  } {
    return {
      cardiovascular: this.getHealth(),
      detox: this.detoxStatus,
      status: this.systemStatus,
      heartRate: this.heartRate,
      oxygenLevel: this.oxygenLevel,
      emergencyMode: this.emergencyMode,
      purificationActive: this.purificationActive,
      timestamp: Date.now(),
      singletonInfo: {
        isSingleton: CardiovascularSystem.hasInstance(),
        creationTime: CardiovascularSystem.creationTime,
        instanceId: `integrista_singleton_${CardiovascularSystem.creationTime}`,
        version: 'v8.0-integrista'
      }
    };
  }

  // ... keep existing code (todos los métodos cardiovasculares originales como cleanBeatHistory, adjustHeartState, performIntegratedPurification, emitUnifiedHeartbeat, canPump, pump, breatheIn, breatheOut, oxygenate, getRespiratoryHealth, activateEmergencyMode, deactivateEmergencyMode, surgicalPurge, getRestingPeriod, getMaxRate, getHealth, subscribe, emergencyReset, destroy)

  private cleanBeatHistory(): void {
    const now = Date.now();
    this.beatHistory = this.beatHistory.filter(beat => now - beat < 1000);
    this.heartRate = this.beatHistory.length;
  }

  private adjustHeartState(): void {
    const now = Date.now();
    
    if (this.state === HeartState.EMERGENCY) {
      if (now - this.emergencyStartTime > this.options.recoveryTime) {
        this.state = HeartState.ELEVATED;
      }
      return;
    }

    if (this.heartRate >= this.options.emergencyThreshold) {
      this.state = HeartState.EMERGENCY;
      this.emergencyStartTime = now;
      this.systemStatus = 'emergency';
    } else if (this.heartRate >= this.options.maxBeatsPerSecond) {
      this.state = HeartState.ELEVATED;
      this.systemStatus = 'degraded';
    } else if (this.heartRate === 0) {
      this.state = HeartState.RESTING;
      this.systemStatus = 'active';
    } else {
      this.state = HeartState.NORMAL;
      this.systemStatus = 'active';
    }
  }

  private performIntegratedPurification(): void {
    if (this.purificationActive && this.oxygenLevel < 90) {
      this.oxygenLevel = Math.min(100, this.oxygenLevel + 2);
    }
    
    // Purificación integrada con detox
    if (this.detoxStatus.isSafeMode && this.detoxStatus.detoxLevel !== 'minimal') {
      this.oxygenLevel = Math.min(100, this.oxygenLevel + 1);
      this.purificationActive = true;
    }
  }

  private emitUnifiedHeartbeat(): void {
    const now = Date.now();
    const shouldLog = now - this.lastLogTime > this.logThrottle;
    
    if (shouldLog && (this.state === HeartState.EMERGENCY || this.detoxStatus.isEmergencyActive || Math.random() > 0.98)) {
      console.log(`🫀 Estado integrista v8.0: ${this.state} | Rate: ${this.heartRate} | O2: ${this.oxygenLevel}% | Detox: ${this.detoxStatus.detoxLevel}`);
      this.lastLogTime = now;
    }

    const event: CirculatoryEvent = {
      type: 'heartbeat',
      source: 'heart',
      data: {
        state: this.state,
        rate: this.heartRate,
        oxygenLevel: this.oxygenLevel,
        health: this.getHealth(),
        detox: this.detoxStatus
      },
      timestamp: now
    };

    this.eventListeners.forEach(listener => listener(event));
  }

  public canPump(): boolean {
    const now = Date.now();
    
    if (this.state === HeartState.EMERGENCY) {
      return false;
    }

    if (now - this.lastBeat < this.getRestingPeriod()) {
      return false;
    }

    if (this.heartRate >= this.getMaxRate()) {
      return false;
    }

    return true;
  }

  public pump(): boolean {
    if (!this.canPump()) {
      return false;
    }

    const now = Date.now();
    this.beatHistory.push(now);
    this.lastBeat = now;
    
    return true;
  }

  public breatheIn(data: any): boolean {
    if (this.state === HeartState.EMERGENCY) {
      return false;
    }

    this.oxygenLevel = Math.min(100, this.oxygenLevel + 1);
    this.purificationActive = true;
    
    return true;
  }

  public breatheOut(signal: any): any {
    return {
      ...signal,
      cardiovascular_processed: true,
      oxygen_level: this.oxygenLevel,
      purified: this.purificationActive,
      detox_integrated: true,
      integrista_version: 'v8.0'
    };
  }

  public oxygenate(module: EnhancedModuleIdentity): EnhancedModuleIdentity {
    return {
      ...module,
      security_context: {
        security_mode: 'normal',
        tracking_protected: this.detoxStatus.isSafeMode,
        shield_level: this.detoxStatus.isSafeMode ? 3 : 1,
        encryption_enabled: false,
        firewall_active: false,
        storage_protected: this.detoxStatus.isSafeMode,
        purification_level: this.options.purificationLevel,
        emergency_mode: this.emergencyMode,
        detox_level: this.detoxStatus.detoxLevel,
        integrista_version: 'v8.0',
        ...module.security_context
      }
    };
  }

  public getRespiratoryHealth(): any {
    return {
      breathingRate: this.heartRate,
      oxygenLevel: this.oxygenLevel,
      airQuality: this.detoxStatus.isSafeMode ? 'filtered' : 'pure',
      antiTrackingActive: this.purificationActive,
      detoxActive: this.detoxStatus.isSafeMode,
      integratedSystem: true
    };
  }

  public activateEmergencyMode(): void {
    this.activateIntegratedEmergencyMode();
  }

  public deactivateEmergencyMode(): void {
    this.emergencyMode = false;
    this.systemStatus = 'active';
    this.state = HeartState.NORMAL;
    this.deactivateIntegratedSafeMode();
    
    console.log('✅ Modo de emergencia cardiovascular integrista v8.0 desactivado');
  }

  public surgicalPurge(): void {
    this.secureStorage.clear();
    this.oxygenLevel = 100;
    this.beatHistory = [];
    this.state = HeartState.NORMAL;
    this.purificationActive = false;
    this.detoxStatus = {
      isSafeMode: false,
      isEmergencyActive: false,
      detoxLevel: 'minimal',
      lastDetoxTime: Date.now(),
      interventionCount: 0,
      systemStability: 'stable'
    };
    
    console.log('🚨 PURGA CARDIOVASCULAR INTEGRISTA v8.0 COMPLETADA');
  }

  private getRestingPeriod(): number {
    switch (this.state) {
      case HeartState.RESTING: return this.options.restingPeriod * 0.8;
      case HeartState.NORMAL: return this.options.restingPeriod;
      case HeartState.ELEVATED: return this.options.restingPeriod * 1.5;
      case HeartState.EMERGENCY: return this.options.restingPeriod * 3;
      case HeartState.PURIFYING: return this.options.restingPeriod * 0.9;
      case HeartState.DETOXING: return this.options.restingPeriod * 1.2;
    }
  }

  private getMaxRate(): number {
    switch (this.state) {
      case HeartState.RESTING: return this.options.maxBeatsPerSecond;
      case HeartState.NORMAL: return this.options.maxBeatsPerSecond;
      case HeartState.ELEVATED: return Math.max(3, this.options.maxBeatsPerSecond - 3);
      case HeartState.EMERGENCY: return 1;
      case HeartState.PURIFYING: return this.options.maxBeatsPerSecond;
      case HeartState.DETOXING: return Math.max(2, this.options.maxBeatsPerSecond - 2);
    }
  }

  public getHealth(): CardiovascularHealth {
    return {
      heartRate: this.heartRate,
      bloodPressure: this.state as any,
      circulation: Math.max(0, 100 - (this.heartRate * 5)),
      oxygenation: this.oxygenLevel
    };
  }

  public subscribe(listener: (event: CirculatoryEvent) => void): () => void {
    this.eventListeners.push(listener);
    return () => {
      const index = this.eventListeners.indexOf(listener);
      if (index > -1) {
        this.eventListeners.splice(index, 1);
      }
    };
  }

  public emergencyReset(): void {
    this.state = HeartState.NORMAL;
    this.heartRate = 0;
    this.beatHistory = [];
    this.lastBeat = 0;
    this.emergencyStartTime = 0;
    this.oxygenLevel = 100;
    this.purificationActive = false;
    this.emergencyMode = false;
    this.systemStatus = 'active';
    this.lastLogTime = 0;
    
    // Reset integrado del detox
    this.detoxStatus = {
      isSafeMode: false,
      isEmergencyActive: false,
      detoxLevel: 'minimal',
      lastDetoxTime: Date.now(),
      interventionCount: 0,
      systemStability: 'stable'
    };
    this.emergencyActivationCount = 0;
    this.lastEmergencyActivation = 0;
    this.safetyLock = false;
    this.lastDetoxLogTime = 0;
    
    console.log('🫀 RESET CARDIOVASCULAR INTEGRISTA v8.0 COMPLETADO');
  }

  public destroy(): void {
    this.eventListeners = [];
    this.secureStorage.clear();
    
    console.log('🫀 Cardiovascular integrista v8.0 limpiado (no destruido)');
  }

  public static resetSingleton(): void {
    if (CardiovascularSystem.instance) {
      CardiovascularSystem.instance.emergencyReset();
    }
    console.log('🫀 SINGLETON CARDIOVASCULAR INTEGRISTA v8.0 RESETEADO GLOBALMENTE');
  }
}
