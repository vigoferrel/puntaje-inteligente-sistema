
/**
 * SISTEMA RESPIRATORIO - Pulmón Digital Limpio v1.0  
 * Responsabilidad única: Intercambio de datos y purificación anti-tracking
 */

import { RespiratoryHealth, CirculatoryEvent, EnhancedModuleIdentity } from './types';

interface BreathingOptions {
  breathsPerMinute: number;
  oxygenThreshold: number;
  purificationLevel: 'basic' | 'advanced' | 'maximum';
  antiTrackingMode: boolean;
}

enum LungState {
  INHALING = 'inhaling',
  EXHALING = 'exhaling', 
  HOLDING = 'holding',
  PURIFYING = 'purifying'
}

export class RespiratorySystem {
  private state: LungState = LungState.HOLDING;
  private oxygenLevel: number = 100;
  private breathingRate: number = 0;
  private lastBreath: number = 0;
  private breathHistory: number[] = [];
  private secureStorage = new Map<string, any>();
  private purificationActive: boolean = false;
  private readonly options: BreathingOptions;
  private eventListeners: ((event: CirculatoryEvent) => void)[] = [];

  constructor(options: Partial<BreathingOptions> = {}) {
    this.options = {
      breathsPerMinute: 20,
      oxygenThreshold: 80,
      purificationLevel: 'maximum',
      antiTrackingMode: true,
      ...options
    };

    this.startBreathing();
  }

  private startBreathing(): void {
    setInterval(() => {
      this.cleanBreathHistory();
      this.adjustBreathingState();
      this.purifyAir();
      this.emitBreath();
    }, 3000); // Respiración cada 3 segundos
  }

  private cleanBreathHistory(): void {
    const now = Date.now();
    this.breathHistory = this.breathHistory.filter(breath => now - breath < 60000);
    this.breathingRate = this.breathHistory.length;
  }

  private adjustBreathingState(): void {
    if (this.oxygenLevel < this.options.oxygenThreshold) {
      this.state = LungState.INHALING;
    } else if (this.secureStorage.size > 10) {
      this.state = LungState.EXHALING;
    } else if (this.options.antiTrackingMode && !this.purificationActive) {
      this.state = LungState.PURIFYING;
    } else {
      this.state = LungState.HOLDING;
    }
  }

  private purifyAir(): void {
    if (this.state === LungState.PURIFYING) {
      this.purificationActive = true;
      
      // Limpiar datos obsoletos
      const now = Date.now();
      for (const [key, value] of this.secureStorage.entries()) {
        if (value.timestamp && now - value.timestamp > 300000) { // 5 minutos
          this.secureStorage.delete(key);
        }
      }

      // Incrementar nivel de oxígeno después de purificación
      this.oxygenLevel = Math.min(100, this.oxygenLevel + 5);
      
      setTimeout(() => {
        this.purificationActive = false;
      }, 1000);
    }
  }

  private emitBreath(): void {
    const event: CirculatoryEvent = {
      type: 'breath',
      source: 'lungs',
      data: {
        state: this.state,
        rate: this.breathingRate,
        health: this.getHealth(),
        storageSize: this.secureStorage.size
      },
      timestamp: Date.now()
    };

    this.eventListeners.forEach(listener => listener(event));
  }

  public breatheIn(data: any): boolean {
    if (this.state === LungState.PURIFYING) {
      return false; // No aceptar datos durante purificación
    }

    const now = Date.now();
    this.breathHistory.push(now);
    this.lastBreath = now;

    // Procesar y almacenar datos de forma segura
    if (this.options.antiTrackingMode) {
      const secureKey = `secure_${now}_${Math.random().toString(36).substr(2, 5)}`;
      this.secureStorage.set(secureKey, {
        data: this.encryptData(data),
        timestamp: now,
        processed: false
      });
    }

    // Reducir oxígeno con el esfuerzo
    this.oxygenLevel = Math.max(50, this.oxygenLevel - 2);
    
    return true;
  }

  public breatheOut(signal: any): any {
    if (this.state === LungState.INHALING) {
      return null; // No emitir durante inhalación
    }

    // Procesar y emitir señal purificada
    const purifiedSignal = this.options.antiTrackingMode 
      ? this.purifySignal(signal)
      : signal;

    // Incrementar oxígeno al exhalar
    this.oxygenLevel = Math.min(100, this.oxygenLevel + 1);

    return purifiedSignal;
  }

  public oxygenate(module: EnhancedModuleIdentity): EnhancedModuleIdentity {
    // Oxigenar módulo con contexto de seguridad
    const oxygenatedModule: EnhancedModuleIdentity = {
      ...module,
      security_context: {
        security_mode: 'anti_tracking_active',
        tracking_protected: true,
        shield_level: Math.floor(this.oxygenLevel / 10),
        encryption_enabled: this.options.antiTrackingMode,
        ...module.security_context
      }
    };

    return oxygenatedModule;
  }

  private encryptData(data: any): any {
    if (!this.options.antiTrackingMode) return data;
    
    try {
      return {
        encrypted: true,
        payload: btoa(JSON.stringify(data)),
        checksum: this.generateChecksum(data),
        timestamp: Date.now()
      };
    } catch {
      return data; // Fallback si encryption falla
    }
  }

  private purifySignal(signal: any): any {
    // Remover propiedades de tracking
    const purified = { ...signal };
    delete purified.tracking_id;
    delete purified.analytics_data;
    delete purified.user_fingerprint;
    
    return {
      ...purified,
      purified: true,
      purification_level: this.options.purificationLevel
    };
  }

  private generateChecksum(data: any): string {
    try {
      return btoa(JSON.stringify(data)).slice(0, 8);
    } catch {
      return 'fallback';
    }
  }

  public getHealth(): RespiratoryHealth {
    return {
      breathingRate: this.breathingRate,
      oxygenLevel: this.oxygenLevel,
      airQuality: this.oxygenLevel > 90 ? 'pure' : this.oxygenLevel > 70 ? 'filtered' : 'contaminated',
      antiTrackingActive: this.options.antiTrackingMode && this.purificationActive
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

  public emergencyPurge(): void {
    this.secureStorage.clear();
    this.oxygenLevel = 100;
    this.breathHistory = [];
    this.state = LungState.HOLDING;
    this.purificationActive = false;
  }

  public destroy(): void {
    this.eventListeners = [];
    this.secureStorage.clear();
  }
}
