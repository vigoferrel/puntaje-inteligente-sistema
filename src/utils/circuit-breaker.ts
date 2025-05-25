
/**
 * Circuit Breaker Neurológico QUIRÚRGICAMENTE REPARADO
 * Previene bucles infinitos con límites ultra-optimizados
 */
interface EmergencyCircuitBreakerOptions {
  maxSignalsPerSecond: number;
  cooldownPeriod: number;
  emergencyThreshold: number;
  autoRecoveryTime: number;
  cleanupInterval: number;
}

enum EmergencyState {
  STABLE,
  DEGRADED,
  EMERGENCY_LOCKDOWN
}

export class EmergencyCircuitBreaker {
  private state: EmergencyState = EmergencyState.STABLE;
  private signalHistory: number[] = [];
  private lastSignalTime: number = 0;
  private consecutiveViolations: number = 0;
  private lockdownStartTime: number = 0;
  private registeredModules: Set<string> = new Set();
  private cleanupTimer: number | null = null;
  private readonly options: EmergencyCircuitBreakerOptions;

  constructor(options: Partial<EmergencyCircuitBreakerOptions> = {}) {
    this.options = {
      maxSignalsPerSecond: 1,          // Ultra estricto
      cooldownPeriod: 5000,            // 5 segundos cooldown
      emergencyThreshold: 2,           // 2 violaciones = lockdown
      autoRecoveryTime: 10000,         // 10 segundos recovery
      cleanupInterval: 30000,          // Cleanup cada 30 segundos
      ...options
    };

    this.startCleanupTimer();
  }

  private startCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    
    this.cleanupTimer = window.setInterval(() => {
      this.performMaintenance();
    }, this.options.cleanupInterval);
  }

  private performMaintenance(): void {
    const now = Date.now();
    
    // Limpiar historial muy agresivamente
    this.signalHistory = this.signalHistory.filter(time => now - time < 2000);
    
    // Limpiar módulos duplicados
    const moduleArray = Array.from(this.registeredModules);
    const uniqueModules = new Set();
    
    moduleArray.forEach(moduleId => {
      const baseId = moduleId.split('_')[0];
      if (!uniqueModules.has(baseId)) {
        uniqueModules.add(baseId);
      } else {
        this.registeredModules.delete(moduleId);
      }
    });
    
    // Auto-recovery si estamos degradados por mucho tiempo
    if (this.state === EmergencyState.DEGRADED && 
        this.consecutiveViolations === 0) {
      this.state = EmergencyState.STABLE;
    }
    
    console.log(`🔧 Mantenimiento: ${this.registeredModules.size} módulos activos`);
  }

  public canProcess(): boolean {
    const now = Date.now();
    
    // Auto-recovery optimizado
    if (this.state === EmergencyState.EMERGENCY_LOCKDOWN) {
      if (now - this.lockdownStartTime > this.options.autoRecoveryTime) {
        this.emergencyRecovery();
        return true;
      }
      return false;
    }

    // Limpiar historial más agresivamente
    this.signalHistory = this.signalHistory.filter(time => now - time < 2000);

    // Verificar límite ultra-estricto
    if (this.signalHistory.length >= this.options.maxSignalsPerSecond) {
      this.consecutiveViolations++;
      
      if (this.consecutiveViolations >= this.options.emergencyThreshold) {
        this.enterEmergencyLockdown();
        return false;
      }
      
      this.state = EmergencyState.DEGRADED;
      return false;
    }

    // Verificar cooldown mínimo ultra-optimizado
    if (now - this.lastSignalTime < this.options.cooldownPeriod) {
      return false;
    }

    return true;
  }

  public recordSignal(): void {
    if (!this.canProcess()) return;
    
    const now = Date.now();
    this.signalHistory.push(now);
    this.lastSignalTime = now;
    
    // Recuperación gradual más rápida
    if (this.state === EmergencyState.DEGRADED && this.consecutiveViolations > 0) {
      this.consecutiveViolations = Math.max(0, this.consecutiveViolations - 1);
      if (this.consecutiveViolations === 0) {
        this.state = EmergencyState.STABLE;
      }
    }
  }

  public registerModule(moduleId: string): boolean {
    if (this.registeredModules.has(moduleId)) {
      console.warn(`🚫 Módulo duplicado bloqueado: ${moduleId}`);
      return false;
    }
    
    this.registeredModules.add(moduleId);
    console.log(`🧠 Módulo neuronal registrado: ${moduleId}`);
    return true;
  }

  private enterEmergencyLockdown(): void {
    this.state = EmergencyState.EMERGENCY_LOCKDOWN;
    this.lockdownStartTime = Date.now();
    console.error('🚨 EMERGENCY LOCKDOWN: Sistema neural completamente desobstruido');
  }

  private emergencyRecovery(): void {
    this.state = EmergencyState.STABLE;
    this.consecutiveViolations = 0;
    this.signalHistory = [];
    this.registeredModules.clear();
    console.log('✅ RECOVERY: Sistema neural quirúrgicamente reparado');
  }

  public getState(): string {
    return `${EmergencyState[this.state].toLowerCase()}_${this.registeredModules.size}_modules`;
  }

  public forceRecovery(): void {
    this.emergencyRecovery();
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
