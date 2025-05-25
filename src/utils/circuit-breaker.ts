
/**
 * Circuit Breaker Neurológico de Emergencia
 * Previene bucles infinitos con límites estrictos
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
      maxSignalsPerSecond: 3,        // Límite estricto
      cooldownPeriod: 5000,          // 5 segundos cooldown
      emergencyThreshold: 5,         // 5 violaciones = lockdown
      autoRecoveryTime: 30000,       // 30 segundos recovery
      ...options
    };
  }

  public canProcess(): boolean {
    const now = Date.now();
    
    // Auto-recovery desde lockdown
    if (this.state === EmergencyState.EMERGENCY_LOCKDOWN) {
      if (now - this.lockdownStartTime > this.options.autoRecoveryTime) {
        this.emergencyRecovery();
        return true;
      }
      return false;
    }

    // Limpiar historial antiguo (últimos 1000ms)
    this.signalHistory = this.signalHistory.filter(time => now - time < 1000);

    // Verificar límite de señales por segundo
    if (this.signalHistory.length >= this.options.maxSignalsPerSecond) {
      this.consecutiveViolations++;
      
      if (this.consecutiveViolations >= this.options.emergencyThreshold) {
        this.enterEmergencyLockdown();
        return false;
      }
      
      this.state = EmergencyState.DEGRADED;
      return false;
    }

    // Verificar cooldown mínimo entre señales
    if (now - this.lastSignalTime < (1000 / this.options.maxSignalsPerSecond)) {
      return false;
    }

    return true;
  }

  public recordSignal(): void {
    const now = Date.now();
    this.signalHistory.push(now);
    this.lastSignalTime = now;
    
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
    console.error('🚨 EMERGENCY LOCKDOWN: Sistema neurológico en lockdown por bucles infinitos');
  }

  private emergencyRecovery(): void {
    this.state = EmergencyState.STABLE;
    this.consecutiveViolations = 0;
    this.signalHistory = [];
    console.log('🔄 RECOVERY: Sistema neurológico recuperado del lockdown');
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
