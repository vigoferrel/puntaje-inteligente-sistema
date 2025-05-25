
/**
 * Circuit Breaker Neurológico REPARADO
 * Previene bucles infinitos con límites optimizados
 */
interface EmergencyCircuitBreakerOptions {
  maxSignalsPerSecond: number;
  cooldownPeriod: number;
  emergencyThreshold: number;
  autoRecoveryTime: number;
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
  private readonly options: EmergencyCircuitBreakerOptions;

  constructor(options: Partial<EmergencyCircuitBreakerOptions> = {}) {
    this.options = {
      maxSignalsPerSecond: 2,        // Límite más estricto
      cooldownPeriod: 3000,          // 3 segundos cooldown
      emergencyThreshold: 3,         // 3 violaciones = lockdown
      autoRecoveryTime: 15000,       // 15 segundos recovery
      ...options
    };
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

    // Limpiar historial (últimos 1500ms para mayor estabilidad)
    this.signalHistory = this.signalHistory.filter(time => now - time < 1500);

    // Verificar límite estricto
    if (this.signalHistory.length >= this.options.maxSignalsPerSecond) {
      this.consecutiveViolations++;
      
      if (this.consecutiveViolations >= this.options.emergencyThreshold) {
        this.enterEmergencyLockdown();
        return false;
      }
      
      this.state = EmergencyState.DEGRADED;
      return false;
    }

    // Verificar cooldown mínimo optimizado
    if (now - this.lastSignalTime < (1500 / this.options.maxSignalsPerSecond)) {
      return false;
    }

    return true;
  }

  public recordSignal(): void {
    if (!this.canProcess()) return;
    
    const now = Date.now();
    this.signalHistory.push(now);
    this.lastSignalTime = now;
    
    // Recuperación gradual
    if (this.state === EmergencyState.DEGRADED) {
      this.consecutiveViolations = Math.max(0, this.consecutiveViolations - 1);
      if (this.consecutiveViolations === 0) {
        this.state = EmergencyState.STABLE;
      }
    }
  }

  private enterEmergencyLockdown(): void {
    this.state = EmergencyState.EMERGENCY_LOCKDOWN;
    this.lockdownStartTime = Date.now();
    console.error('🚨 EMERGENCY LOCKDOWN: Sistema neural desobstruido');
  }

  private emergencyRecovery(): void {
    this.state = EmergencyState.STABLE;
    this.consecutiveViolations = 0;
    this.signalHistory = [];
    console.log('✅ RECOVERY: Sistema neural completamente reparado');
  }

  public getState(): string {
    switch (this.state) {
      case EmergencyState.STABLE:
        return 'stable';
      case EmergencyState.DEGRADED:
        return 'degraded';
      case EmergencyState.EMERGENCY_LOCKDOWN:
        return 'emergency_lockdown';
    }
  }

  public forceRecovery(): void {
    this.emergencyRecovery();
  }
}
