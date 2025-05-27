/**
 * SISTEMA CARDIOVASCULAR v10.0 - COMPATIBLE CON TRACKING PREVENTION
 * Acceso mínimo a storage, máxima compatibilidad con navegadores
 */

import { storageManager } from '@/core/storage/StorageManager';

interface CardiovascularConfig {
  maxBeatsPerSecond?: number;
  restingPeriod?: number;
  recoveryTime?: number;
  emergencyThreshold?: number;
  purificationLevel?: 'minimal' | 'safe_mode' | 'maximum';
  oxygenThreshold?: number;
  silentMode?: boolean;
}

interface CardiovascularHealth {
  heartRate: number;
  bloodPressure: 'optimal' | 'monitored' | 'restricted' | 'emergency' | 'resting';
  circulation: number;
  oxygenation: number;
}

interface DetoxStatus {
  isSafeMode: boolean;
  isEmergencyActive: boolean;
  detoxLevel: 'minimal' | 'moderate' | 'aggressive';
  lastDetoxTime: number;
  interventionCount: number;
  systemStability: 'stable' | 'monitoring' | 'intervention_required';
}

interface IntegratedSystemStatus {
  cardiovascular: CardiovascularHealth;
  detox: DetoxStatus;
  timestamp: number;
  silentMode: boolean;
}

export class OptimizedCardiovascularSystem {
  private static instance: OptimizedCardiovascularSystem | null = null;
  
  // Estado completamente en memoria - NO storage
  private heartRate = 60;
  private lastBeat = 0;
  private beatsInSecond = 0;
  private secondStart = 0;
  private isEmergencyMode = false;
  private emergencyActivations = 0;
  private restingUntil = 0;
  private oxygenLevel = 95;
  private detoxLevel: 'minimal' | 'moderate' | 'aggressive' = 'minimal';
  private lastDetoxTime = Date.now();
  private interventionCount = 0;
  private systemStability: 'stable' | 'monitoring' | 'intervention_required' = 'stable';
  private listeners: ((event: any) => void)[] = [];
  private lastLogTime = 0;
  private silentMode = true;
  private lastStorageWrite = 0;
  private storageWriteInterval = 300000; // Solo escribir cada 5 minutos
  
  private config: Required<CardiovascularConfig> = {
    maxBeatsPerSecond: 1, // MUY conservador
    restingPeriod: 10000, // 10 segundos
    recoveryTime: 20000, // 20 segundos
    emergencyThreshold: 3, // Muy tolerante
    purificationLevel: 'minimal',
    oxygenThreshold: 70,
    silentMode: true
  };

  private constructor(config?: CardiovascularConfig) {
    if (config) {
      this.config = { ...this.config, ...config };
      this.silentMode = this.config.silentMode;
    }
    
    // Solo cargar estado crítico al inicializar
    this.loadCriticalState();
  }

  static getInstance(config?: CardiovascularConfig): OptimizedCardiovascularSystem {
    if (!OptimizedCardiovascularSystem.instance) {
      OptimizedCardiovascularSystem.instance = new OptimizedCardiovascularSystem(config);
    }
    return OptimizedCardiovascularSystem.instance;
  }

  private loadCriticalState(): void {
    // Solo cargar estado de emergencia si existe
    const emergencyState = storageManager.getItem('cv_emergency_state');
    if (emergencyState) {
      this.isEmergencyMode = emergencyState.isEmergencyMode || false;
      this.emergencyActivations = emergencyState.activations || 0;
    }
  }

  private saveCriticalState(): void {
    const now = Date.now();
    // Solo guardar si han pasado 5 minutos Y hay una emergencia activa
    if (now - this.lastStorageWrite > this.storageWriteInterval && this.isEmergencyMode) {
      storageManager.setItem('cv_emergency_state', {
        isEmergencyMode: this.isEmergencyMode,
        activations: this.emergencyActivations,
        timestamp: now
      }, { silentErrors: true });
      this.lastStorageWrite = now;
    }
  }

  canPump(): boolean {
    const now = Date.now();
    
    if (now < this.restingUntil) {
      return false;
    }

    if (this.isEmergencyMode && this.emergencyActivations >= this.config.emergencyThreshold) {
      return false;
    }

    return true;
  }

  pump(): boolean {
    if (!this.canPump()) {
      return false;
    }

    const now = Date.now();

    // Reset contador por segundo
    if (now - this.secondStart > 1000) {
      this.beatsInSecond = 0;
      this.secondStart = now;
    }

    // Control de frecuencia ULTRA conservador
    if (this.beatsInSecond >= this.config.maxBeatsPerSecond) {
      this.restingUntil = now + this.config.restingPeriod;
      return false;
    }

    this.beatsInSecond++;
    this.lastBeat = now;
    this.heartRate = Math.min(80, 60 + this.beatsInSecond * 3);

    // Log ULTRA reducido (1 vez cada 2 horas)
    if (!this.silentMode && (now - this.lastLogTime) > 7200000) {
      console.log('🫀 Sistema cardiovascular v10.0 optimizado');
      this.lastLogTime = now;
    }

    // Solo notificar si hay listeners (muy raro)
    if (this.listeners.length > 0) {
      this.notifyListeners({
        type: 'heartbeat',
        timestamp: now,
        silent: true
      });
    }

    return true;
  }

  processSignal(signal: any): boolean {
    if (!this.canPump()) {
      return false;
    }

    // Procesamiento mínimo sin side effects
    const pumped = this.pump();
    if (pumped) {
      this.oxygenLevel = Math.min(100, this.oxygenLevel + 1);
    }

    return pumped;
  }

  activateIntegratedEmergencyMode(): void {
    this.isEmergencyMode = true;
    this.emergencyActivations++;
    this.detoxLevel = 'moderate';
    this.restingUntil = Date.now() + this.config.recoveryTime;
    
    // Solo guardar en emergencias críticas
    this.saveCriticalState();
    
    console.warn('🫀 Emergencia cardiovascular v10.0 (almacenamiento mínimo)');
  }

  emergencyReset(): void {
    this.isEmergencyMode = false;
    this.emergencyActivations = 0;
    this.detoxLevel = 'minimal';
    this.restingUntil = 0;
    this.beatsInSecond = 0;
    this.interventionCount = 0;
    this.systemStability = 'stable';
    this.lastLogTime = 0;
    
    // Limpiar storage de emergencia
    storageManager.removeItem('cv_emergency_state');
    
    if (!this.silentMode) {
      console.log('🫀 Sistema cardiovascular v10.0 reiniciado (sin storage)');
    }
  }

  getIntegratedSystemStatus(): IntegratedSystemStatus {
    return {
      cardiovascular: {
        heartRate: this.heartRate,
        bloodPressure: this.isEmergencyMode ? 'emergency' : 'optimal',
        circulation: Math.max(70, 100 - this.beatsInSecond * 5),
        oxygenation: this.oxygenLevel
      },
      detox: {
        isSafeMode: this.detoxLevel !== 'minimal',
        isEmergencyActive: this.isEmergencyMode,
        detoxLevel: this.detoxLevel,
        lastDetoxTime: this.lastDetoxTime,
        interventionCount: this.interventionCount,
        systemStability: this.systemStability
      },
      timestamp: Date.now(),
      silentMode: this.silentMode
    };
  }

  getIntegratedDetoxStatus(): DetoxStatus {
    return {
      isSafeMode: this.isSafeMode(),
      isEmergencyActive: this.isEmergencyMode,
      detoxLevel: this.detoxLevel,
      lastDetoxTime: this.lastDetoxTime,
      interventionCount: this.interventionCount,
      systemStability: this.systemStability
    };
  }

  getRespiratoryHealth() {
    return {
      breathingRate: this.silentMode ? 12 : 15, // Más lento en modo silencioso
      oxygenLevel: this.oxygenLevel,
      airQuality: 'pure' as const,
      antiTrackingActive: false // NO ACTIVO - delegar al navegador
    };
  }

  subscribe(callback: (event: any) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  isSafeMode(): boolean {
    return this.detoxLevel !== 'minimal' || this.isEmergencyMode;
  }

  oxygenate(module: any): any {
    if (!this.canPump()) {
      return module;
    }

    // Procesamiento mínimo que no interfiera con el navegador
    return {
      ...module,
      oxygenated: true,
      cardiovascular_v9: 'silent_mode',
      timestamp: Date.now()
    };
  }

  private notifyListeners(event: any): void {
    // Notificaciones muy reducidas y sin storage
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        // Error silencioso sin storage
      }
    });
  }

  destroy(): void {
    this.listeners = [];
    // NO destruir singleton, solo limpiar
    if (!this.silentMode) {
      console.log('🫀 Sistema cardiovascular v10.0 limpiado (singleton preservado)');
    }
  }

  // Métodos de compatibilidad
  static enableSilentMode(): void {
    if (OptimizedCardiovascularSystem.instance) {
      OptimizedCardiovascularSystem.instance.silentMode = true;
    }
  }

  static disableSilentMode(): void {
    if (OptimizedCardiovascularSystem.instance) {
      OptimizedCardiovascularSystem.instance.silentMode = false;
    }
  }
}

// Exportar singleton para compatibilidad
export const CardiovascularSystem = OptimizedCardiovascularSystem;
