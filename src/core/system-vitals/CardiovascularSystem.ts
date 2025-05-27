
/**
 * SISTEMA CARDIOVASCULAR v9.0 - MODO SILENCIOSO DEFINITIVO
 * Configuración mínima sin anti-tracking agresivo
 * Compatibilidad total con navegadores modernos
 */

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

export class CardiovascularSystem {
  private static instance: CardiovascularSystem | null = null;
  private static isInitializing = false;
  
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
  private silentMode = true; // ACTIVADO POR DEFECTO
  
  private config: Required<CardiovascularConfig> = {
    maxBeatsPerSecond: 2, // MUY CONSERVADOR
    restingPeriod: 8000, // 8 segundos de descanso
    recoveryTime: 15000, // 15 segundos de recovery
    emergencyThreshold: 5, // Más tolerante
    purificationLevel: 'minimal', // NIVEL MÍNIMO
    oxygenThreshold: 60, // Más tolerante
    silentMode: true // SILENCIOSO POR DEFECTO
  };

  private constructor(config?: CardiovascularConfig) {
    if (config) {
      this.config = { ...this.config, ...config };
      this.silentMode = this.config.silentMode;
    }
    
    // NO INTERCEPTAR STORAGE - Delegar al navegador
    this.initializeMinimalMode();
  }

  private initializeMinimalMode(): void {
    // Log único de inicialización
    if (!this.silentMode) {
      console.log('🫀 Sistema Cardiovascular v9.0 - Modo Silencioso Activo');
    }
    
    // NO implementar anti-tracking personalizado
    // NO interceptar storage APIs
    // Delegar completamente al navegador
  }

  static getInstance(config?: CardiovascularConfig): CardiovascularSystem {
    if (CardiovascularSystem.instance) {
      return CardiovascularSystem.instance;
    }

    if (CardiovascularSystem.isInitializing) {
      // Espera simple sin recursión
      return new CardiovascularSystem(config);
    }

    CardiovascularSystem.isInitializing = true;
    CardiovascularSystem.instance = new CardiovascularSystem(config);
    CardiovascularSystem.isInitializing = false;

    return CardiovascularSystem.instance;
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

    // Control de frecuencia MUY conservador
    if (this.beatsInSecond >= this.config.maxBeatsPerSecond) {
      this.restingUntil = now + this.config.restingPeriod;
      return false;
    }

    this.beatsInSecond++;
    this.lastBeat = now;
    this.heartRate = Math.min(100, 60 + this.beatsInSecond * 5);

    // Log extremadamente reducido (1 vez por hora)
    if (!this.silentMode && (now - this.lastLogTime) > 3600000) {
      console.log('🫀 Cardiovascular v9.0 funcionando silenciosamente');
      this.lastLogTime = now;
    }

    this.notifyListeners({
      type: 'heartbeat',
      source: 'heart',
      data: { heartRate: this.heartRate, silentMode: this.silentMode },
      timestamp: now
    });

    return true;
  }

  breatheIn(signal: any): boolean {
    if (!this.canPump()) {
      return false;
    }

    // Procesamiento mínimo sin logging
    this.oxygenLevel = Math.min(100, this.oxygenLevel + 2);
    return true;
  }

  breatheOut(signal: any): void {
    // Funcionalidad mínima sin side effects
    this.oxygenLevel = Math.max(70, this.oxygenLevel - 1);
  }

  processSignal(signal: any): boolean {
    if (!this.canPump()) {
      return false;
    }

    const pumped = this.pump();
    if (!pumped) return false;

    const processed = this.breatheIn(signal);
    if (processed) {
      this.breatheOut(signal);
    }

    return processed;
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

  isSafeMode(): boolean {
    return this.detoxLevel !== 'minimal' || this.isEmergencyMode;
  }

  activateIntegratedEmergencyMode(): void {
    this.isEmergencyMode = true;
    this.emergencyActivations++;
    this.detoxLevel = 'moderate'; // NO agresivo
    this.restingUntil = Date.now() + this.config.recoveryTime;
    
    // Log solo en emergencias reales
    console.warn('🫀 Modo de emergencia cardiovascular activado (silencioso)');
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
    
    if (!this.silentMode) {
      console.log('🫀 Sistema cardiovascular reiniciado en modo silencioso');
    }
  }

  getIntegratedSystemStatus(): IntegratedSystemStatus {
    return {
      cardiovascular: {
        heartRate: this.heartRate,
        bloodPressure: this.isEmergencyMode ? 'emergency' : 'optimal',
        circulation: Math.max(60, 100 - this.beatsInSecond * 10),
        oxygenation: this.oxygenLevel
      },
      detox: {
        isSafeMode: this.isSafeMode(),
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

  private notifyListeners(event: any): void {
    // Notificaciones muy reducidas
    if (this.listeners.length > 0 && !this.silentMode) {
      this.listeners.forEach(listener => {
        try {
          listener(event);
        } catch (error) {
          // Error silencioso
        }
      });
    }
  }

  destroy(): void {
    // NO destruir el singleton
    this.listeners = [];
    if (!this.silentMode) {
      console.log('🫀 Sistema cardiovascular v9.0 limpiado (singleton preservado)');
    }
  }

  // Métodos de compatibilidad
  static enableSilentMode(): void {
    if (CardiovascularSystem.instance) {
      CardiovascularSystem.instance.silentMode = true;
    }
  }

  static disableSilentMode(): void {
    if (CardiovascularSystem.instance) {
      CardiovascularSystem.instance.silentMode = false;
    }
  }
}
