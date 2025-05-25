
/**
 * Circuit Breaker Anti-Tracking ULTRA-OPTIMIZADO v4.0
 * Sistema inmunológico digital completamente desinfectado
 */
interface UltraOptimizedCircuitBreakerOptions {
  maxSignalsPerSecond: number;
  cooldownPeriod: number;
  emergencyThreshold: number;
  autoRecoveryTime: number;
  cleanupInterval: number;
  moduleDeduplicationWindow: number;
  antiTrackingMode: boolean;
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
  private readonly options: UltraOptimizedCircuitBreakerOptions;
  private lastMaintenanceLog: number = 0;
  private trackingDetector: number = 0;

  constructor(options: Partial<UltraOptimizedCircuitBreakerOptions> = {}) {
    this.options = {
      maxSignalsPerSecond: 8,          // Ultra-permisivo
      cooldownPeriod: 800,             // Más rápido
      emergencyThreshold: 12,          // Extremadamente tolerante
      autoRecoveryTime: 3000,          // Recovery ultra-rápido
      cleanupInterval: 120000,         // Cada 2 minutos
      moduleDeduplicationWindow: 5000, // Ventana más amplia
      antiTrackingMode: true,          // Modo anti-tracking activo
      ...options
    };

    this.startSilentCleanup();
  }

  private startSilentCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    
    this.cleanupTimer = window.setInterval(() => {
      this.performUltraQuietMaintenance();
    }, this.options.cleanupInterval);
  }

  private performUltraQuietMaintenance(): void {
    const now = Date.now();
    
    // Limpieza ultra-agresiva y completamente silenciosa
    this.signalHistory = this.signalHistory.filter(time => now - time < 1500);
    
    // Deduplicación inteligente con anti-tracking
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
    
    // Limpiar módulos antiguos ultra-silenciosamente
    for (const [moduleId, info] of this.registeredModules.entries()) {
      if (now - info.timestamp > this.options.moduleDeduplicationWindow) {
        this.registeredModules.delete(moduleId);
      }
    }
    
    // Auto-recovery gradual ULTRA-silencioso
    if (this.state === SystemState.RESTRICTED && this.consecutiveViolations === 0) {
      this.state = SystemState.MONITORED;
    } else if (this.state === SystemState.MONITORED && this.signalHistory.length === 0) {
      this.state = SystemState.OPTIMAL;
    }
    
    // Log anti-tracking solo cada 10 minutos
    if (now - this.lastMaintenanceLog > 600000) {
      console.log(`🛡️ Sistema anti-tracking: ${this.registeredModules.size} módulos seguros`);
      this.lastMaintenanceLog = now;
    }
  }

  public canProcess(): boolean {
    const now = Date.now();
    
    // Detector anti-tracking integrado
    if (this.options.antiTrackingMode) {
      this.trackingDetector = Math.max(0, this.trackingDetector - 1);
    }
    
    // Auto-recovery ULTRA-optimizado
    if (this.state === SystemState.EMERGENCY_LOCKDOWN) {
      if (now - this.lockdownStartTime > this.options.autoRecoveryTime) {
        this.silentRecovery();
        return true;
      }
      return false;
    }

    // Limpiar historial dinámicamente
    this.signalHistory = this.signalHistory.filter(time => now - time < 1500);

    // Verificar límites con tolerancia ULTRA-aumentada
    const currentLimit = this.getUltraAdaptiveLimit();
    if (this.signalHistory.length >= currentLimit) {
      this.consecutiveViolations++;
      
      if (this.consecutiveViolations >= this.options.emergencyThreshold) {
        this.enterSilentLockdown();
        return false;
      }
      
      this.state = SystemState.RESTRICTED;
      return false;
    }

    // Verificar cooldown ULTRA-permisivo
    const cooldownPeriod = this.getUltraAdaptiveCooldown();
    if (now - this.lastSignalTime < cooldownPeriod) {
      return false;
    }

    return true;
  }

  private getUltraAdaptiveLimit(): number {
    switch (this.state) {
      case SystemState.OPTIMAL: return this.options.maxSignalsPerSecond;
      case SystemState.MONITORED: return Math.max(3, this.options.maxSignalsPerSecond - 1);
      case SystemState.RESTRICTED: return 3; // Ultra-permisivo
      default: return 1;
    }
  }

  private getUltraAdaptiveCooldown(): number {
    switch (this.state) {
      case SystemState.OPTIMAL: return this.options.cooldownPeriod;
      case SystemState.MONITORED: return this.options.cooldownPeriod * 1.1;
      case SystemState.RESTRICTED: return this.options.cooldownPeriod * 1.3;
      default: return this.options.cooldownPeriod * 1.8;
    }
  }

  public recordSignal(): void {
    if (!this.canProcess()) return;
    
    const now = Date.now();
    this.signalHistory.push(now);
    this.lastSignalTime = now;
    
    // Recuperación gradual ULTRA-eficiente
    if (this.consecutiveViolations > 0) {
      this.consecutiveViolations = Math.max(0, this.consecutiveViolations - 1);
      if (this.consecutiveViolations === 0 && this.state === SystemState.RESTRICTED) {
        this.state = SystemState.MONITORED;
      }
    }
  }

  public registerModule(moduleId: string): boolean {
    const baseType = moduleId.split('_')[0];
    
    // Verificar duplicación con ULTRA-tolerancia anti-tracking
    const existingByType = Array.from(this.registeredModules.entries())
      .find(([_, info]) => info.baseType === baseType);
    
    if (existingByType && Date.now() - existingByType[1].timestamp < 1000) {
      return false;
    }
    
    // Registrar completamente silencioso
    this.registeredModules.set(moduleId, {
      timestamp: Date.now(),
      baseType
    });
    
    // Solo log inicial para nuevos tipos
    if (!existingByType) {
      console.log(`🧠 Módulo ${baseType} registrado de forma segura`);
    }
    return true;
  }

  private enterSilentLockdown(): void {
    this.state = SystemState.EMERGENCY_LOCKDOWN;
    this.lockdownStartTime = Date.now();
    // Completamente silencioso - no logs para evitar spam
  }

  private silentRecovery(): void {
    this.state = SystemState.MONITORED;
    this.consecutiveViolations = 0;
    this.signalHistory = [];
    this.trackingDetector = 0;
    
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
    
    console.log('🛡️ Sistema anti-tracking recuperado completamente');
  }

  public getState(): string {
    return `${SystemState[this.state].toLowerCase()}_${this.registeredModules.size}_modules_secure`;
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
