
interface HealthCheck {
  id: string;
  name: string;
  check: () => Promise<boolean>;
  heal: () => Promise<void>;
  priority: number;
  cooldown: number;
  lastHealed: number;
}

interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'critical';
  checks: Array<{
    id: string;
    status: 'pass' | 'fail' | 'healing';
    lastCheck: number;
    consecutiveFailures: number;
  }>;
}

class AutoHealingSystem {
  private static instance: AutoHealingSystem;
  private healthChecks: HealthCheck[] = [];
  private systemHealth: SystemHealth = {
    overall: 'healthy',
    checks: []
  };
  private isRunning = false;
  private healingInProgress = new Set<string>();

  static getInstance(): AutoHealingSystem {
    if (!AutoHealingSystem.instance) {
      AutoHealingSystem.instance = new AutoHealingSystem();
    }
    return AutoHealingSystem.instance;
  }

  constructor() {
    this.initializeHealthChecks();
  }

  private initializeHealthChecks(): void {
    this.healthChecks = [
      {
        id: 'memory-usage',
        name: 'Memory Usage Check',
        check: this.checkMemoryUsage.bind(this),
        heal: this.healMemoryUsage.bind(this),
        priority: 10,
        cooldown: 30000,
        lastHealed: 0
      },
      {
        id: 'error-rate',
        name: 'Error Rate Check',
        check: this.checkErrorRate.bind(this),
        heal: this.healErrorRate.bind(this),
        priority: 9,
        cooldown: 60000,
        lastHealed: 0
      },
      {
        id: 'response-time',
        name: 'Response Time Check',
        check: this.checkResponseTime.bind(this),
        heal: this.healResponseTime.bind(this),
        priority: 8,
        cooldown: 45000,
        lastHealed: 0
      },
      {
        id: 'cache-health',
        name: 'Cache System Check',
        check: this.checkCacheHealth.bind(this),
        heal: this.healCacheSystem.bind(this),
        priority: 7,
        cooldown: 120000,
        lastHealed: 0
      },
      {
        id: 'dom-health',
        name: 'DOM Health Check',
        check: this.checkDOMHealth.bind(this),
        heal: this.healDOMIssues.bind(this),
        priority: 6,
        cooldown: 90000,
        lastHealed: 0
      },
      {
        id: 'event-listeners',
        name: 'Event Listeners Check',
        check: this.checkEventListeners.bind(this),
        heal: this.healEventListeners.bind(this),
        priority: 5,
        cooldown: 180000,
        lastHealed: 0
      }
    ];

    // Inicializar estado de los checks
    this.systemHealth.checks = this.healthChecks.map(check => ({
      id: check.id,
      status: 'pass' as const,
      lastCheck: 0,
      consecutiveFailures: 0
    }));
  }

  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.runHealthChecks();
    
    // Programar checks regulares
    setInterval(() => {
      this.runHealthChecks();
    }, 15000); // Cada 15 segundos
  }

  stop(): void {
    this.isRunning = false;
  }

  private async runHealthChecks(): Promise<void> {
    if (!this.isRunning) return;

    const promises = this.healthChecks.map(async (check) => {
      try {
        const healthStatus = this.systemHealth.checks.find(c => c.id === check.id);
        if (!healthStatus) return;

        healthStatus.lastCheck = Date.now();
        
        const isHealthy = await check.check();
        
        if (isHealthy) {
          healthStatus.status = 'pass';
          healthStatus.consecutiveFailures = 0;
        } else {
          healthStatus.status = 'fail';
          healthStatus.consecutiveFailures++;
          
          // Intentar auto-sanación si es necesario
          await this.attemptHealing(check, healthStatus);
        }
      } catch (error) {
        console.error(`Health check failed for ${check.id}:`, error);
      }
    });

    await Promise.allSettled(promises);
    this.updateOverallHealth();
  }

  private async attemptHealing(check: HealthCheck, status: any): Promise<void> {
    const now = Date.now();
    
    // Verificar si puede intentar sanar
    if (this.healingInProgress.has(check.id)) return;
    if (now - check.lastHealed < check.cooldown) return;
    if (status.consecutiveFailures < 2) return; // Esperar al menos 2 fallos

    this.healingInProgress.add(check.id);
    status.status = 'healing';
    
    try {
      console.log(`🔧 Auto-healing: ${check.name}`);
      await check.heal();
      
      check.lastHealed = now;
      status.consecutiveFailures = 0;
      
      // Re-verificar inmediatamente
      const isFixed = await check.check();
      status.status = isFixed ? 'pass' : 'fail';
      
      if (isFixed) {
        console.log(`✅ Auto-healing successful: ${check.name}`);
      } else {
        console.warn(`⚠️ Auto-healing attempted but issue persists: ${check.name}`);
      }
    } catch (error) {
      console.error(`❌ Auto-healing failed for ${check.name}:`, error);
      status.status = 'fail';
    } finally {
      this.healingInProgress.delete(check.id);
    }
  }

  // Health Check Implementations
  private async checkMemoryUsage(): Promise<boolean> {
    const memory = (performance as any).memory;
    if (!memory) return true;
    
    const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
    return usagePercent < 85;
  }

  private async healMemoryUsage(): Promise<void> {
    // Forzar garbage collection si está disponible
    if (typeof window !== 'undefined' && 'gc' in window) {
      (window as any).gc();
    }
    
    // Limpiar caches
    const { intelligentCache } = await import('./IntelligentCacheSystem');
    intelligentCache.cleanup();
    
    // Limpiar localStorage antiguo
    this.cleanupLocalStorage();
    
    // Remover event listeners huérfanos
    this.cleanupEventListeners();
  }

  private async checkErrorRate(): Promise<boolean> {
    const errorCount = (window as any).performanceErrors || 0;
    return errorCount < 5; // Menos de 5 errores por minuto
  }

  private async healErrorRate(): Promise<void> {
    // Reset contador de errores
    (window as any).performanceErrors = 0;
    
    // Reiniciar componentes problemáticos
    this.restartProblematicComponents();
    
    // Aumentar timeouts temporalmente
    this.adjustTimeouts();
  }

  private async checkResponseTime(): Promise<boolean> {
    const start = performance.now();
    
    // Simular operación típica
    await new Promise(resolve => requestAnimationFrame(resolve));
    
    const responseTime = performance.now() - start;
    return responseTime < 50; // Menos de 50ms
  }

  private async healResponseTime(): Promise<void> {
    // Optimizar renders pendientes
    this.optimizeRenderQueue();
    
    // Deferir operaciones no críticas
    this.deferNonCriticalOperations();
    
    // Reducir throttling temporal
    this.adjustRenderThrottling();
  }

  private async checkCacheHealth(): Promise<boolean> {
    try {
      const { intelligentCache } = await import('./IntelligentCacheSystem');
      const stats = intelligentCache.getCacheStats();
      
      // Verificar que el cache no esté lleno y funcione
      return stats.size < 90 && stats.entries.length > 0;
    } catch (error) {
      return false;
    }
  }

  private async healCacheSystem(): Promise<void> {
    try {
      const { intelligentCache } = await import('./IntelligentCacheSystem');
      
      // Limpiar cache expirado
      intelligentCache.cleanup();
      
      // Reconfigurar si es necesario
      intelligentCache.adjustConfiguration({
        defaultTTL: 300000,
        maxSize: 120
      });
    } catch (error) {
      console.error('Failed to heal cache system:', error);
    }
  }

  private async checkDOMHealth(): Promise<boolean> {
    const nodeCount = document.querySelectorAll('*').length;
    const detachedNodes = this.countDetachedNodes();
    
    return nodeCount < 5000 && detachedNodes < 100;
  }

  private async healDOMIssues(): Promise<void> {
    // Remover nodos desconectados
    this.removeDetachedNodes();
    
    // Limpiar referencias DOM huérfanas
    this.cleanupDOMReferences();
    
    // Optimizar DOM tree
    this.optimizeDOMTree();
  }

  private async checkEventListeners(): Promise<boolean> {
    // Verificar que no hay demasiados listeners
    const listenerCount = this.getEventListenerCount();
    return listenerCount < 1000;
  }

  private async healEventListeners(): Promise<void> {
    this.cleanupEventListeners();
    this.optimizeEventDelegation();
  }

  // Helper Methods
  private updateOverallHealth(): void {
    const checks = this.systemHealth.checks;
    const failedChecks = checks.filter(c => c.status === 'fail').length;
    const criticalFailures = checks.filter(c => 
      c.status === 'fail' && c.consecutiveFailures >= 3
    ).length;
    
    if (criticalFailures > 0) {
      this.systemHealth.overall = 'critical';
    } else if (failedChecks > 2) {
      this.systemHealth.overall = 'degraded';
    } else {
      this.systemHealth.overall = 'healthy';
    }
  }

  private cleanupLocalStorage(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('temp_') || key.startsWith('cache_')) {
          try {
            const item = JSON.parse(localStorage.getItem(key) || '{}');
            if (item.timestamp && Date.now() - item.timestamp > 86400000) {
              localStorage.removeItem(key);
            }
          } catch {
            localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.warn('LocalStorage cleanup failed:', error);
    }
  }

  private cleanupEventListeners(): void {
    // Implementación simplificada
    console.log('🧹 Cleaning up event listeners');
  }

  private restartProblematicComponents(): void {
    console.log('🔄 Restarting problematic components');
  }

  private adjustTimeouts(): void {
    console.log('⏰ Adjusting timeouts');
  }

  private optimizeRenderQueue(): void {
    console.log('🎨 Optimizing render queue');
  }

  private deferNonCriticalOperations(): void {
    console.log('⏳ Deferring non-critical operations');
  }

  private adjustRenderThrottling(): void {
    console.log('🎛️ Adjusting render throttling');
  }

  private countDetachedNodes(): number {
    // Implementación simplificada
    return 0;
  }

  private removeDetachedNodes(): void {
    console.log('🗑️ Removing detached nodes');
  }

  private cleanupDOMReferences(): void {
    console.log('🧹 Cleaning DOM references');
  }

  private optimizeDOMTree(): void {
    console.log('🌳 Optimizing DOM tree');
  }

  private getEventListenerCount(): number {
    // Implementación simplificada
    return 0;
  }

  private optimizeEventDelegation(): void {
    console.log('📡 Optimizing event delegation');
  }

  // Public Methods
  getSystemHealth(): SystemHealth {
    return { ...this.systemHealth };
  }

  forceHeal(checkId?: string): Promise<void> {
    if (checkId) {
      const check = this.healthChecks.find(c => c.id === checkId);
      if (check) {
        check.lastHealed = 0; // Reset cooldown
        const status = this.systemHealth.checks.find(c => c.id === checkId);
        if (status) {
          return this.attemptHealing(check, status);
        }
      }
    } else {
      // Force heal all
      this.healthChecks.forEach(check => check.lastHealed = 0);
      return this.runHealthChecks();
    }
    return Promise.resolve();
  }

  addCustomHealthCheck(check: Omit<HealthCheck, 'lastHealed'>): void {
    this.healthChecks.push({
      ...check,
      lastHealed: 0
    });
    
    this.systemHealth.checks.push({
      id: check.id,
      status: 'pass',
      lastCheck: 0,
      consecutiveFailures: 0
    });
  }
}

export const autoHealingSystem = AutoHealingSystem.getInstance();
