/**
 * SISTEMA CARDIOVASCULAR UNIFICADO v7.2 - SINGLETON ESTRICTO POST-CIRUGÍA
 * Responsabilidad ampliada: Control de flujo, purificación, oxigenación y monitoreo completo
 * NUEVA FUNCIONALIDAD: Singleton estricto para prevenir múltiples instancias
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

enum HeartState {
  RESTING = 'resting',
  NORMAL = 'normal', 
  ELEVATED = 'elevated',
  EMERGENCY = 'emergency',
  PURIFYING = 'purifying'
}

// SINGLETON GLOBAL ESTRICTO v7.2
let globalCardiovascularInstance: CardiovascularSystem | null = null;
let instanceCreationLock = false;
const INSTANCE_CREATION_TIMEOUT = 5000;

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
  private logThrottle: number = 30000; // 30 segundos entre logs

  constructor(options: Partial<HeartbeatOptions> = {}) {
    // SINGLETON ENFORCEMENT v7.2
    if (globalCardiovascularInstance) {
      console.log('🫀 Reutilizando instancia cardiovascular existente v7.2');
      return globalCardiovascularInstance;
    }

    if (instanceCreationLock) {
      console.warn('⚠️ Creación de instancia cardiovascular bloqueada por lock');
      throw new Error('Cardiovascular instance creation locked');
    }

    instanceCreationLock = true;
    
    this.options = {
      maxBeatsPerSecond: 8, // Más permisivo
      restingPeriod: 2000,   // Más espaciado
      recoveryTime: 5000,
      emergencyThreshold: 12, // Más tolerante
      purificationLevel: 'safe_mode',
      oxygenThreshold: 60,
      ...options
    };

    globalCardiovascularInstance = this;
    CardiovascularSystem.instance = this;
    CardiovascularSystem.creationTime = Date.now();

    this.startHeartbeat();
    
    // Log inicial controlado
    console.log('🫀 SISTEMA CARDIOVASCULAR SINGLETON v7.2 INICIADO');
    
    instanceCreationLock = false;
  }

  // MÉTODO ESTÁTICO PARA OBTENER INSTANCIA SINGLETON
  public static getInstance(options?: Partial<HeartbeatOptions>): CardiovascularSystem {
    if (!CardiovascularSystem.instance || !globalCardiovascularInstance) {
      new CardiovascularSystem(options);
    }
    return CardiovascularSystem.instance!;
  }

  // MÉTODO ESTÁTICO PARA VERIFICAR EXISTENCIA
  public static hasInstance(): boolean {
    return !!CardiovascularSystem.instance && !!globalCardiovascularInstance;
  }

  private startHeartbeat(): void {
    setInterval(() => {
      this.cleanBeatHistory();
      this.adjustHeartState();
      this.performPurification();
      this.emitHeartbeat();
    }, 1000);
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

  private performPurification(): void {
    if (this.purificationActive && this.oxygenLevel < 90) {
      this.oxygenLevel = Math.min(100, this.oxygenLevel + 2);
    }
  }

  private emitHeartbeat(): void {
    // THROTTLED LOGGING v7.2 - Solo log cada 30 segundos
    const now = Date.now();
    const shouldLog = now - this.lastLogTime > this.logThrottle;
    
    if (shouldLog && (this.state === HeartState.EMERGENCY || Math.random() > 0.95)) {
      console.log(`🫀 Estado cardiovascular v7.2: ${this.state} | Rate: ${this.heartRate} | O2: ${this.oxygenLevel}%`);
      this.lastLogTime = now;
    }

    const event: CirculatoryEvent = {
      type: 'heartbeat',
      source: 'heart',
      data: {
        state: this.state,
        rate: this.heartRate,
        oxygenLevel: this.oxygenLevel,
        health: this.getHealth()
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

  // FUNCIONALIDAD RESPIRATORIA INTEGRADA
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
      purified: this.purificationActive
    };
  }

  public oxygenate(module: EnhancedModuleIdentity): EnhancedModuleIdentity {
    return {
      ...module,
      security_context: {
        security_mode: 'normal',
        tracking_protected: false,
        shield_level: 1,
        encryption_enabled: false,
        firewall_active: false,
        storage_protected: false,
        purification_level: this.options.purificationLevel,
        emergency_mode: this.emergencyMode,
        ...module.security_context
      }
    };
  }

  public getRespiratoryHealth(): any {
    return {
      breathingRate: this.heartRate,
      oxygenLevel: this.oxygenLevel,
      airQuality: 'pure',
      antiTrackingActive: this.purificationActive
    };
  }

  // NUEVOS MÉTODOS REQUERIDOS v7.1
  public getSystemStatus(): {
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
    };
  } {
    return {
      status: this.systemStatus,
      heartRate: this.heartRate,
      oxygenLevel: this.oxygenLevel,
      emergencyMode: this.emergencyMode,
      purificationActive: this.purificationActive,
      timestamp: Date.now(),
      singletonInfo: {
        isSingleton: CardiovascularSystem.hasInstance(),
        creationTime: CardiovascularSystem.creationTime,
        instanceId: `singleton_${CardiovascularSystem.creationTime}`
      }
    };
  }

  public activateEmergencyMode(): void {
    this.emergencyMode = true;
    this.systemStatus = 'emergency';
    this.state = HeartState.EMERGENCY;
    this.emergencyStartTime = Date.now();
    
    // Log de emergencia SIEMPRE se muestra
    console.log('🚨 MODO DE EMERGENCIA CARDIOVASCULAR SINGLETON v7.2 ACTIVADO');
    
    this.surgicalPurge();
  }

  public deactivateEmergencyMode(): void {
    this.emergencyMode = false;
    this.systemStatus = 'active';
    this.state = HeartState.NORMAL;
    
    console.log('✅ Modo de emergencia cardiovascular singleton v7.2 desactivado');
  }

  public surgicalPurge(): void {
    this.secureStorage.clear();
    this.oxygenLevel = 100;
    this.beatHistory = [];
    this.state = HeartState.NORMAL;
    this.purificationActive = false;
    
    console.log('🚨 PURGA CARDIOVASCULAR SINGLETON v7.2 COMPLETADA');
  }

  private getRestingPeriod(): number {
    switch (this.state) {
      case HeartState.RESTING: return this.options.restingPeriod * 0.8;
      case HeartState.NORMAL: return this.options.restingPeriod;
      case HeartState.ELEVATED: return this.options.restingPeriod * 1.5;
      case HeartState.EMERGENCY: return this.options.restingPeriod * 3;
      case HeartState.PURIFYING: return this.options.restingPeriod * 0.9;
    }
  }

  private getMaxRate(): number {
    switch (this.state) {
      case HeartState.RESTING: return this.options.maxBeatsPerSecond;
      case HeartState.NORMAL: return this.options.maxBeatsPerSecond;
      case HeartState.ELEVATED: return Math.max(3, this.options.maxBeatsPerSecond - 3);
      case HeartState.EMERGENCY: return 1;
      case HeartState.PURIFYING: return this.options.maxBeatsPerSecond;
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
    
    console.log('🫀 RESET CARDIOVASCULAR SINGLETON v7.2 COMPLETADO');
  }

  public destroy(): void {
    this.eventListeners = [];
    this.secureStorage.clear();
    
    // NO DESTRUIR EL SINGLETON - Solo limpiar
    console.log('🫀 Cardiovascular singleton v7.2 limpiado (no destruido)');
  }

  // MÉTODO ESTÁTICO PARA RESET GLOBAL
  public static resetSingleton(): void {
    if (CardiovascularSystem.instance) {
      CardiovascularSystem.instance.emergencyReset();
    }
    // NO resetear las referencias singleton para mantener estabilidad
    console.log('🫀 SINGLETON CARDIOVASCULAR v7.2 RESETEADO GLOBALMENTE');
  }
}
