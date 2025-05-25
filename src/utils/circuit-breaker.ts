
/**
 * Circuit Breaker Neurológico QUIRÚRGICAMENTE OPTIMIZADO v2.0
 * Previene bucles infinitos con límites inteligentes y deduplicación avanzada
 */
interface OptimizedCircuitBreakerOptions {
  maxSignalsPerSecond: number;
  cooldownPeriod: number;
  emergencyThreshold: number;
  autoRecoveryTime: number;
  cleanupInterval: number;
  moduleDeduplicationWindow: number;
}

enum SystemState {
  OPTIMAL,
  MONITORED,
  RESTRICTED,
  EMERGENCY_LOCKDOWN
}

export class EmergencyCircuitBreaker {
  private state: SystemState = SystemState.OPTIMAL;
  private signalHistory: number[] = [];
  private lastSignalTime: number = 0;
  private consecutiveViolations: number = 0;
  private lockdownStartTime: number = 0;
  private registeredModules: Map<string, { timestamp: number; baseType: string }> = new Map();
  private cleanupTimer: number | null = null;
  private readonly options: OptimizedCircuitBreakerOptions;

  constructor(options: Partial<OptimizedCircuitBreakerOptions> = {}) {
    this.options = {
      maxSignalsPerSecond: 3,          // Más permisivo
      cooldownPeriod: 2000,            // Reducido a 2 segundos
      emergencyThreshold: 5,           // Más tolerante
      autoRecoveryTime: 8000,          // Recovery más rápido
      cleanupInterval: 15000,          // Cleanup más frecuente
      moduleDeduplicationWindow: 5000, // Ventana de deduplicación
      ...options
    };

    this.startIntelligentCleanup();
  }

  private startIntelligentCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    
    this.cleanupTimer = window.setInterval(() => {
      this.performIntelligentMaintenance();
    }, this.options.cleanupInterval);
  }

  private performIntelligentMaintenance(): void {
    const now = Date.now();
    
    // Limpiar historial de señales más agresivamente
    this.signalHistory = this.signalHistory.filter(time => now - time < 1000);
    
    // Deduplicación inteligente de módulos por tipo base
    const modulesByBaseType = new Map<string, { moduleId: string; timestamp: number }>();
    
    for (const [moduleId, info] of this.registeredModules.entries()) {
      const existing = modulesByBaseType.get(info.baseType);
      if (!existing || info.timestamp > existing.timestamp) {
        if (existing) {
          this.registeredModules.delete(existing.moduleId);
        }
        modulesByBaseType.set(info.baseType, { moduleId, timestamp: info.timestamp });
      } else {
        this.registeredModules.delete(moduleId);
      }
    }
    
    // Limpiar módulos antiguos
    for (const [moduleId, info] of this.registeredModules.entries()) {
      if (now - info.timestamp > this.options.moduleDeduplicationWindow) {
        this.registeredModules.delete(moduleId);
      }
    }
    
    // Auto-recovery gradual
    if (this.state === SystemState.RESTRICTED && this.consecutiveViolations === 0) {
      this.state = SystemState.MONITORED;
    } else if (this.state === SystemState.MONITORED && this.signalHistory.length === 0) {
      this.state = SystemState.OPTIMAL;
    }
    
    console.log(`🔧 Mantenimiento inteligente: ${this.registeredModules.size} módulos activos`);
  }

  public canProcess(): boolean {
    const now = Date.now();
    
    // Auto-recovery optimizado
    if (this.state === SystemState.EMERGENCY_LOCKDOWN) {
      if (now - this.lockdownStartTime > this.options.autoRecoveryTime) {
        this.intelligentRecovery();
        return true;
      }
      return false;
    }

    // Limpiar historial dinámicamente
    this.signalHistory = this.signalHistory.filter(time => now - time < 1000);

    // Verificar límites con estado adaptativo
    const currentLimit = this.getAdaptiveLimit();
    if (this.signalHistory.length >= currentLimit) {
      this.consecutiveViolations++;
      
      if (this.consecutiveViolations >= this.options.emergencyThreshold) {
        this.enterControlledLockdown();
        return false;
      }
      
      this.state = SystemState.RESTRICTED;
      return false;
    }

    // Verificar cooldown adaptativo
    const cooldownPeriod = this.getAdaptiveCooldown();
    if (now - this.lastSignalTime < cooldownPeriod) {
      return false;
    }

    return true;
  }

  private getAdaptiveLimit(): number {
    switch (this.state) {
      case SystemState.OPTIMAL: return this.options.maxSignalsPerSecond;
      case SystemState.MONITORED: return Math.max(1, this.options.maxSignalsPerSecond - 1);
      case SystemState.RESTRICTED: return 1;
      default: return 0;
    }
  }

  private getAdaptiveCooldown(): number {
    switch (this.state) {
      case SystemState.OPTIMAL: return this.options.cooldownPeriod;
      case SystemState.MONITORED: return this.options.cooldownPeriod * 1.5;
      case SystemState.RESTRICTED: return this.options.cooldownPeriod * 2;
      default: return this.options.cooldownPeriod * 3;
    }
  }

  public recordSignal(): void {
    if (!this.canProcess()) return;
    
    const now = Date.now();
    this.signalHistory.push(now);
    this.lastSignalTime = now;
    
    // Recuperación gradual más eficiente
    if (this.consecutiveViolations > 0) {
      this.consecutiveViolations = Math.max(0, this.consecutiveViolations - 1);
      if (this.consecutiveViolations === 0 && this.state === SystemState.RESTRICTED) {
        this.state = SystemState.MONITORED;
      }
    }
  }

  public registerModule(moduleId: string): boolean {
    const baseType = moduleId.split('_')[0];
    
    // Verificar duplicación por tipo base
    const existingByType = Array.from(this.registeredModules.entries())
      .find(([_, info]) => info.baseType === baseType);
    
    if (existingByType && Date.now() - existingByType[1].timestamp < 3000) {
      console.warn(`🚫 Módulo ${baseType} ya registrado recientemente`);
      return false;
    }
    
    // Registrar con información de tipo
    this.registeredModules.set(moduleId, {
      timestamp: Date.now(),
      baseType
    });
    
    console.log(`🧠 Módulo neuronal registrado: ${baseType}[${moduleId}]`);
    return true;
  }

  private enterControlledLockdown(): void {
    this.state = SystemState.EMERGENCY_LOCKDOWN;
    this.lockdownStartTime = Date.now();
    console.error('🚨 LOCKDOWN CONTROLADO: Sistema neural temporalmente restringido');
  }

  private intelligentRecovery(): void {
    this.state = SystemState.MONITORED;
    this.consecutiveViolations = 0;
    this.signalHistory = [];
    
    // Mantener solo un módulo por tipo
    const modulesByType = new Map<string, string>();
    for (const [moduleId, info] of this.registeredModules.entries()) {
      modulesByType.set(info.baseType, moduleId);
    }
    
    this.registeredModules.clear();
    for (const [baseType, moduleId] of modulesByType.entries()) {
      this.registeredModules.set(moduleId, {
        timestamp: Date.now(),
        baseType
      });
    }
    
    console.log('✅ RECOVERY INTELIGENTE: Sistema neural optimizado y funcional');
  }

  public getState(): string {
    return `${SystemState[this.state].toLowerCase()}_${this.registeredModules.size}_modules`;
  }

  public forceRecovery(): void {
    this.intelligentRecovery();
  }

  public destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.registeredModules.clear();
    this.signalHistory = [];
  }
}
