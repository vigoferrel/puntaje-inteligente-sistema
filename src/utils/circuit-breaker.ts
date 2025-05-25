
/**
 * Circuit Breaker Neurológico DESINFECTADO v3.0
 * Sistema inmunológico digital ultra-optimizado sin spam de logs
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
  private lastMaintenanceLog: number = 0;

  constructor(options: Partial<OptimizedCircuitBreakerOptions> = {}) {
    this.options = {
      maxSignalsPerSecond: 5,          // Más permisivo - aumentado de 3 a 5
      cooldownPeriod: 1500,            // Reducido a 1.5 segundos
      emergencyThreshold: 8,           // Mucho más tolerante - aumentado de 5 a 8
      autoRecoveryTime: 5000,          // Recovery más rápido - reducido de 8s a 5s
      cleanupInterval: 60000,          // Menos frecuente - aumentado de 15s a 60s
      moduleDeduplicationWindow: 3000, // Ventana más corta
      ...options
    };

    this.startSilentCleanup();
  }

  private startSilentCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    
    this.cleanupTimer = window.setInterval(() => {
      this.performSilentMaintenance();
    }, this.options.cleanupInterval);
  }

  private performSilentMaintenance(): void {
    const now = Date.now();
    
    // Limpiar historial más agresivamente pero silenciosamente
    this.signalHistory = this.signalHistory.filter(time => now - time < 2000);
    
    // Deduplicación inteligente ultra-silenciosa
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
    
    // Limpiar módulos antiguos silenciosamente
    for (const [moduleId, info] of this.registeredModules.entries()) {
      if (now - info.timestamp > this.options.moduleDeduplicationWindow) {
        this.registeredModules.delete(moduleId);
      }
    }
    
    // Auto-recovery gradual silencioso
    if (this.state === SystemState.RESTRICTED && this.consecutiveViolations === 0) {
      this.state = SystemState.MONITORED;
    } else if (this.state === SystemState.MONITORED && this.signalHistory.length === 0) {
      this.state = SystemState.OPTIMAL;
    }
    
    // Log de mantenimiento solo cada 5 minutos para reducir spam
    if (now - this.lastMaintenanceLog > 300000) {
      console.log(`🔧 Sistema desinfectado: ${this.registeredModules.size} módulos activos`);
      this.lastMaintenanceLog = now;
    }
  }

  public canProcess(): boolean {
    const now = Date.now();
    
    // Auto-recovery ultra-optimizado
    if (this.state === SystemState.EMERGENCY_LOCKDOWN) {
      if (now - this.lockdownStartTime > this.options.autoRecoveryTime) {
        this.silentRecovery();
        return true;
      }
      return false;
    }

    // Limpiar historial dinámicamente
    this.signalHistory = this.signalHistory.filter(time => now - time < 2000);

    // Verificar límites con tolerancia aumentada
    const currentLimit = this.getAdaptiveLimit();
    if (this.signalHistory.length >= currentLimit) {
      this.consecutiveViolations++;
      
      if (this.consecutiveViolations >= this.options.emergencyThreshold) {
        this.enterSilentLockdown();
        return false;
      }
      
      this.state = SystemState.RESTRICTED;
      return false;
    }

    // Verificar cooldown más permisivo
    const cooldownPeriod = this.getAdaptiveCooldown();
    if (now - this.lastSignalTime < cooldownPeriod) {
      return false;
    }

    return true;
  }

  private getAdaptiveLimit(): number {
    switch (this.state) {
      case SystemState.OPTIMAL: return this.options.maxSignalsPerSecond;
      case SystemState.MONITORED: return Math.max(2, this.options.maxSignalsPerSecond - 1);
      case SystemState.RESTRICTED: return 2; // Más permisivo que antes
      default: return 0;
    }
  }

  private getAdaptiveCooldown(): number {
    switch (this.state) {
      case SystemState.OPTIMAL: return this.options.cooldownPeriod;
      case SystemState.MONITORED: return this.options.cooldownPeriod * 1.2;
      case SystemState.RESTRICTED: return this.options.cooldownPeriod * 1.5;
      default: return this.options.cooldownPeriod * 2;
    }
  }

  public recordSignal(): void {
    if (!this.canProcess()) return;
    
    const now = Date.now();
    this.signalHistory.push(now);
    this.lastSignalTime = now;
    
    // Recuperación gradual ultra-eficiente
    if (this.consecutiveViolations > 0) {
      this.consecutiveViolations = Math.max(0, this.consecutiveViolations - 1);
      if (this.consecutiveViolations === 0 && this.state === SystemState.RESTRICTED) {
        this.state = SystemState.MONITORED;
      }
    }
  }

  public registerModule(moduleId: string): boolean {
    const baseType = moduleId.split('_')[0];
    
    // Verificar duplicación por tipo base con más tolerancia
    const existingByType = Array.from(this.registeredModules.entries())
      .find(([_, info]) => info.baseType === baseType);
    
    if (existingByType && Date.now() - existingByType[1].timestamp < 2000) {
      // Solo log cuando hay verdadera duplicación problemática
      return false;
    }
    
    // Registrar silenciosamente
    this.registeredModules.set(moduleId, {
      timestamp: Date.now(),
      baseType
    });
    
    // Solo log la primera vez que se registra un tipo de módulo
    if (!existingByType) {
      console.log(`🧠 Módulo ${baseType} inicializado correctamente`);
    }
    return true;
  }

  private enterSilentLockdown(): void {
    this.state = SystemState.EMERGENCY_LOCKDOWN;
    this.lockdownStartTime = Date.now();
    console.warn('🚨 Sistema en modo protección temporal');
  }

  private silentRecovery(): void {
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
    
    console.log('✅ Sistema neural recuperado y optimizado');
  }

  public getState(): string {
    return `${SystemState[this.state].toLowerCase()}_${this.registeredModules.size}_modules`;
  }

  public forceRecovery(): void {
    this.silentRecovery();
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
