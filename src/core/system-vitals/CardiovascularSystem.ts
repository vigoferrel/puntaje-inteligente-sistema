/**
 * SISTEMA CARDIOVASCULAR v9.1 - CORRECCIÓN INTEGRAL DEFINITIVA
 * Solución a la raíz del problema: método faltante + optimización completa
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

interface SynthesisParams {
  nexusCoherence: number;
  neuralIntegrationLevel: number;
  systemLoad: number;
  emergencyMode: boolean;
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
    maxBeatsPerSecond: 1, // ULTRA conservador
    restingPeriod: 12000, // 12 segundos
    recoveryTime: 20000, // 20 segundos
    emergencyThreshold: 3, // Muy tolerante
    purificationLevel: 'minimal',
    oxygenThreshold: 70,
    silentMode: true // MODO SILENCIOSO TOTAL
  };

  private constructor(config?: CardiovascularConfig) {
    if (config) {
      this.config = { ...this.config, ...config };
      this.silentMode = this.config.silentMode;
    }
    
    // Inicialización ULTRA-silenciosa
    this.initializeZeroLogMode();
  }

  private initializeZeroLogMode(): void {
    // ZERO LOGS - Solo inicialización silenciosa
    // NO interceptar storage - delegación completa al navegador
    // NO logs de inicialización
  }

  static getInstance(config?: CardiovascularConfig): CardiovascularSystem {
    if (CardiovascularSystem.instance) {
      return CardiovascularSystem.instance;
    }

    if (CardiovascularSystem.isInitializing) {
      // Evitar recursión - retornar instancia temporal
      return new CardiovascularSystem(config);
    }

    CardiovascularSystem.isInitializing = true;
    CardiovascularSystem.instance = new CardiovascularSystem(config);
    CardiovascularSystem.isInitializing = false;

    return CardiovascularSystem.instance;
  }

  // MÉTODO CRÍTICO FALTANTE - RAÍZ DEL PROBLEMA
  performUltraSilentSynthesis(params: SynthesisParams): void {
    if (!this.canPump()) {
      return;
    }

    // Síntesis ULTRA-silenciosa sin logs
    try {
      const synthesisResult = this.pump();
      if (synthesisResult) {
        // Actualizar métricas internas sin logs
        this.oxygenLevel = Math.min(100, this.oxygenLevel + Math.floor(params.nexusCoherence / 10));
        this.heartRate = Math.max(50, Math.min(80, 60 + Math.floor(params.neuralIntegrationLevel / 20)));
        
        // Solo guardar timestamp de última síntesis
        this.lastDetoxTime = Date.now();
      }
    } catch (error) {
      // Error completamente silencioso
      this.activateIntegratedEmergencyMode();
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
    this.heartRate = Math.min(80, 60 + this.beatsInSecond * 2);

    // ZERO LOGS - Sin logging
    
    // Notificación ULTRA-reducida
    if (this.listeners.length > 0) {
      this.notifyListeners({
        type: 'heartbeat',
        timestamp: now,
        silent: true
      });
    }

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

  adaptToUserBehavior(behavior: any): void {
    if (!this.canPump()) {
      return;
    }

    // Adaptación silenciosa sin side effects
    if (behavior && typeof behavior === 'object') {
      // Ajustar oxigenación basado en comportamiento
      if (behavior.interaction_frequency === 'high') {
        this.oxygenLevel = Math.min(100, this.oxygenLevel + 1);
      }
      
      // Ajustar frecuencia cardíaca basado en engagement
      if (behavior.completion_rate > 0.8) {
        this.heartRate = Math.max(50, this.heartRate - 2);
      }
    }
  }

  activateIntegratedEmergencyMode(): void {
    this.isEmergencyMode = true;
    this.emergencyActivations++;
    this.detoxLevel = 'moderate';
    this.restingUntil = Date.now() + this.config.recoveryTime;
    
    // Solo log en emergencias CRÍTICAS
    if (this.emergencyActivations >= this.config.emergencyThreshold) {
      console.warn('🫀 Emergencia cardiovascular crítica (v9.1)');
    }
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
    
    // Log de reset solo si no está en modo silencioso
    if (!this.silentMode) {
      console.log('🫀 Sistema cardiovascular v9.1 reiniciado');
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
      breathingRate: this.silentMode ? 10 : 15,
      oxygenLevel: this.oxygenLevel,
      airQuality: 'pure' as const,
      antiTrackingActive: false // DELEGADO al navegador
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
      console.log('🫀 Sistema cardiovascular v9.1 limpiado (singleton preservado)');
    }
  }

  // Métodos de compatibilidad estática
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
