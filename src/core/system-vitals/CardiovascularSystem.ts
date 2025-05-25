
/**
 * SISTEMA CARDIOVASCULAR UNIFICADO v7.0 - POST-CIRUGÍA RADICAL
 * Responsabilidad ampliada: Control de flujo, purificación y oxigenación
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

export class CardiovascularSystem {
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

  constructor(options: Partial<HeartbeatOptions> = {}) {
    this.options = {
      maxBeatsPerSecond: 10,
      restingPeriod: 1000,
      recoveryTime: 3000,
      emergencyThreshold: 15,
      purificationLevel: 'safe_mode',
      oxygenThreshold: 60,
      ...options
    };

    this.startHeartbeat();
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
    } else if (this.heartRate >= this.options.maxBeatsPerSecond) {
      this.state = HeartState.ELEVATED;
    } else if (this.heartRate === 0) {
      this.state = HeartState.RESTING;
    } else {
      this.state = HeartState.NORMAL;
    }
  }

  private performPurification(): void {
    if (this.purificationActive && this.oxygenLevel < 90) {
      this.oxygenLevel = Math.min(100, this.oxygenLevel + 2);
    }
  }

  private emitHeartbeat(): void {
    const event: CirculatoryEvent = {
      type: 'heartbeat',
      source: 'heart',
      data: {
        state: this.state,
        rate: this.heartRate,
        oxygenLevel: this.oxygenLevel,
        health: this.getHealth()
      },
      timestamp: Date.now()
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

  // NUEVA FUNCIONALIDAD RESPIRATORIA INTEGRADA
  public breatheIn(data: any): boolean {
    if (this.state === HeartState.EMERGENCY) {
      return false;
    }

    // Procesar datos de entrada y mejorar oxigenación
    this.oxygenLevel = Math.min(100, this.oxygenLevel + 1);
    this.purificationActive = true;
    
    return true;
  }

  public breatheOut(signal: any): any {
    // Retornar señal purificada
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
        emergency_mode: this.state === HeartState.EMERGENCY,
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

  public surgicalPurge(): void {
    this.secureStorage.clear();
    this.oxygenLevel = 100;
    this.beatHistory = [];
    this.state = HeartState.NORMAL;
    this.purificationActive = false;
    
    console.log('🚨 PURGA CARDIOVASCULAR COMPLETADA v7.0');
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
  }

  public destroy(): void {
    this.eventListeners = [];
    this.secureStorage.clear();
  }
}
