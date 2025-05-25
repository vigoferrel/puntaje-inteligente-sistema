/**
 * SISTEMA CARDIOVASCULAR INTEGRISTA v8.2 - CALIBRACIÓN SILENCIOSA
 * Responsabilidad total: Control cardiovascular + Detox + Anti-tracking + Emergencias
 * NUEVA FUNCIONALIDAD v8.2: Logging inteligente y throttling optimizado
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

// SINGLETON GLOBAL INTEGRISTA v8.2
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
  
  // SISTEMA DE LOGGING CALIBRADO v8.2
  private lastLogTime: number = 0;
  private logThrottle: number = 300000; // 5 minutos entre logs normales
  private criticalLogThrottle: number = 60000; // 1 minuto para logs críticos

  // SISTEMA DETOX INTEGRADO v8.2
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
  private detoxLogThrottle = 300000; // 5 minutos para logs de detox

  // SISTEMA ANTI-TRACKING CALIBRADO v8.2
  private trackingPreventionCount = 0;
  private lastTrackingPreventionLog = 0;
  private trackingLogThrottle = 600000; // 10 minutos para tracking prevention

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
      maxBeatsPerSecond: 6,  // Más conservador para v8.2
      restingPeriod: 4000,   // Más espaciado
      recoveryTime: 10000,   // Recovery más largo
      emergencyThreshold: 10, // Más tolerante
      purificationLevel: 'safe_mode',
      oxygenThreshold: 70,
      ...options
    };

    globalCardiovascularInstance = this;
    CardiovascularSystem.instance = this;
    CardiovascularSystem.creationTime = Date.now();

    this.initializeIntegratedSystem();
    
    // Log inicial ÚNICO y silencioso
    console.log('🫀 SISTEMA CARDIOVASCULAR INTEGRISTA v8.2 CALIBRADO (Modo Silencioso)');
    
    instanceCreationLock = false;
  }

  // INICIALIZACIÓN INTEGRADA CALIBRADA
  private initializeIntegratedSystem(): void {
    this.startUnifiedHeartbeat();
    this.setupCalibratedAntiTracking();
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

  // NUEVO MÉTODO: processSignal - REQUERIDO POR SISTEMAS DEPENDIENTES
  public processSignal(signal: any): boolean {
    if (!this.canPump()) {
      return false;
    }

    const pumped = this.pump();
    if (!pumped) return false;

    const processed = this.breatheIn(signal);
    if (!processed) return false;

    this.breatheOut(signal);
    return true;
  }

  // HEARTBEAT CALIBRADO v8.2 (menos frecuente)
  private startUnifiedHeartbeat(): void {
    setInterval(() => {
      this.cleanBeatHistory();
      this.adjustHeartState();
      this.performIntegratedPurification();
      this.performStabilityCheck();
      this.emitCalibratedHeartbeat();
    }, 2000); // Reducido a cada 2 segundos
  }

  // SISTEMA ANTI-TRACKING CALIBRADO v8.2
  private setupCalibratedAntiTracking(): void {
    if (typeof window === 'undefined') return;

    const originalStorageAccess = Storage.prototype.setItem;
    
    Storage.prototype.setItem = function(key: string, value: string) {
      try {
        return originalStorageAccess.call(this, key, value);
      } catch (error) {
        const cardiovascularInstance = CardiovascularSystem.getInstance();
        cardiovascularInstance.handleCalibratedTrackingPrevention();
        throw error;
      }
    };
  }

  // MANEJO CALIBRADO DE TRACKING PREVENTION v8.2
  public handleCalibratedTrackingPrevention(): void {
    this.trackingPreventionCount++;
    
    const now = Date.now();
    const shouldLog = now - this.lastTrackingPreventionLog > this.trackingLogThrottle;
    
    // Solo log cada 50 bloqueos y con throttling temporal
    if (this.trackingPreventionCount > 50 && shouldLog) {
      console.log(`🛡️ Anti-tracking activo v8.2: ${this.trackingPreventionCount} intervenciones`);
      this.lastTrackingPreventionLog = now;
      this.detoxStatus.interventionCount++;
      this.trackingPreventionCount = 0; // Reset contador
    }

    // Activar modo seguro solo si hay muchas intervenciones
    if (this.detoxStatus.interventionCount > 20) {
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

  // MODO DE EMERGENCIA CON LOGGING CALIBRADO
  public activateIntegratedEmergencyMode(): void {
    const now = Date.now();
    
    if (this.safetyLock || (now - this.lastEmergencyActivation < 60000)) {
      return; // Silencioso por defecto
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

    // Log de emergencia SIEMPRE crítico
    console.log('🚨 MODO DE EMERGENCIA CARDIOVASCULAR v8.2 ACTIVADO');
    
    this.performIntegratedEmergencyDetox();

    setTimeout(() => {
      this.safetyLock = false;
    }, 15000); // Aumentado para v8.2
  }

  // DETOX DE EMERGENCIA INTEGRADO
  private performIntegratedEmergencyDetox(): void {
    try {
      this.clearStorageSafely();
      this.resetIntegratedSystems();
      this.optimizeIntegratedMemory();
      
      console.log('✅ Desintoxicación cardiovascular v8.2 completada');
      
    } catch (error) {
      console.error('❌ Error en desintoxicación v8.2:', error);
    }
  }

  // LIMPIEZA SEGURA DE STORAGE INTEGRADA
  private clearStorageSafely(): void {
    // Silencioso en v8.2
  }

  // RESET DE SISTEMAS INTEGRADO
  private resetIntegratedSystems(): void {
    // Silencioso en v8.2
  }

  // OPTIMIZACIÓN DE MEMORIA INTEGRADA
  private optimizeIntegratedMemory(): void {
    // Silencioso en v8.2
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
        version: 'v8.2-calibrado'
      }
    };
  }

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

  private emitCalibratedHeartbeat(): void {
    const now = Date.now();
    const isCritical = this.state === HeartState.EMERGENCY || this.detoxStatus.isEmergencyActive;
    const shouldLog = isCritical ? 
      (now - this.lastLogTime > this.criticalLogThrottle) :
      (now - this.lastLogTime > this.logThrottle && Math.random() > 0.99); // Muy ocasional
    
    if (shouldLog) {
      const emoji = isCritical ? '🚨' : '🫀';
      console.log(`${emoji} Sistema v8.2: ${this.state} | Rate: ${this.heartRate} | O2: ${this.oxygenLevel}%`);
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
      integrista_version: 'v8.2'
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
        integrista_version: 'v8.2',
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
    
    console.log('✅ Modo de emergencia cardiovascular v8.2 desactivado');
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
    
    console.log('🚨 PURGA CARDIOVASCULAR v8.2 COMPLETADA');
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
    
    // Reset de contadores v8.2
    this.trackingPreventionCount = 0;
    this.lastTrackingPreventionLog = 0;
    
    console.log('🫀 RESET CARDIOVASCULAR v8.2 COMPLETADO');
  }

  public destroy(): void {
    this.eventListeners = [];
    this.secureStorage.clear();
    
    console.log('🫀 Cardiovascular v8.2 limpiado (no destruido)');
  }

  public static resetSingleton(): void {
    if (CardiovascularSystem.instance) {
      CardiovascularSystem.instance.emergencyReset();
    }
    console.log('🫀 SINGLETON CARDIOVASCULAR v8.2 RESETEADO');
  }
}
