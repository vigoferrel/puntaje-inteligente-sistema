
/**
 * PRODUCTION ERROR RECOVERY SYSTEM v1.0
 * Sistema completo de recuperación para producción
 */

interface ErrorMetrics {
  totalErrors: number;
  trackingErrors: number;
  cspErrors: number;
  webglErrors: number;
  resourceErrors: number;
  recoveryAttempts: number;
  successfulRecoveries: number;
}

interface RecoveryAction {
  type: 'storage' | 'csp' | 'webgl' | 'resource' | 'full';
  priority: 'low' | 'medium' | 'high' | 'critical';
  action: () => Promise<boolean>;
  maxRetries: number;
  currentRetries: number;
}

class ProductionErrorRecovery {
  private static instance: ProductionErrorRecovery;
  private metrics: ErrorMetrics = {
    totalErrors: 0,
    trackingErrors: 0,
    cspErrors: 0,
    webglErrors: 0,
    resourceErrors: 0,
    recoveryAttempts: 0,
    successfulRecoveries: 0
  };
  
  private recoveryActions: RecoveryAction[] = [];
  private isRecovering = false;
  private lastRecoveryTime = 0;
  private errorThreshold = 10;

  static getInstance(): ProductionErrorRecovery {
    if (!ProductionErrorRecovery.instance) {
      ProductionErrorRecovery.instance = new ProductionErrorRecovery();
    }
    return ProductionErrorRecovery.instance;
  }

  private constructor() {
    this.setupGlobalErrorHandlers();
    this.initializeRecoveryActions();
    this.startMetricsReporting();
  }

  private setupGlobalErrorHandlers(): void {
    // Capturar errores de tracking prevention
    window.addEventListener('error', (event) => {
      if (event.message.includes('Tracking Prevention')) {
        this.metrics.trackingErrors++;
        this.triggerRecovery('storage');
      }
    });

    // Capturar violaciones CSP
    document.addEventListener('securitypolicyviolation', () => {
      this.metrics.cspErrors++;
      this.triggerRecovery('csp');
    });

    // Capturar errores de recursos
    window.addEventListener('error', (event) => {
      if (event.target && (event.target as any).tagName) {
        this.metrics.resourceErrors++;
        this.triggerRecovery('resource');
      }
    }, true);

    // Capturar errores de WebGL
    window.addEventListener('error', (event) => {
      if (event.message.includes('WebGL') || event.message.includes('context')) {
        this.metrics.webglErrors++;
        this.triggerRecovery('webgl');
      }
    });
  }

  private initializeRecoveryActions(): void {
    this.recoveryActions = [
      {
        type: 'storage',
        priority: 'high',
        maxRetries: 3,
        currentRetries: 0,
        action: async () => {
          const { antiTrackingStorage } = await import('../storage/AntiTrackingStorageLayer');
          return antiTrackingStorage.getStatus().hasLocalStorage;
        }
      },
      {
        type: 'csp',
        priority: 'medium',
        maxRetries: 2,
        currentRetries: 0,
        action: async () => {
          const { cspCompatibility } = await import('../security/CSPCompatibilityLayer');
          cspCompatibility.clearViolations();
          return true;
        }
      },
      {
        type: 'webgl',
        priority: 'high',
        maxRetries: 2,
        currentRetries: 0,
        action: async () => {
          const { ultraStableWebGL } = await import('../webgl/UltraStableWebGLManager');
          const status = ultraStableWebGL.getStatus();
          return !status.emergencyMode;
        }
      },
      {
        type: 'resource',
        priority: 'medium',
        maxRetries: 1,
        currentRetries: 0,
        action: async () => {
          const { resourceOptimizer } = await import('../performance/ResourceOptimizationEngine');
          const metrics = resourceOptimizer.getOptimizationMetrics();
          return metrics.unusedResources < 5;
        }
      },
      {
        type: 'full',
        priority: 'critical',
        maxRetries: 1,
        currentRetries: 0,
        action: async () => {
          return this.performFullSystemRecovery();
        }
      }
    ];
  }

  private triggerRecovery(type: RecoveryAction['type']): void {
    this.metrics.totalErrors++;
    
    // Evitar recovery muy frecuente
    const now = Date.now();
    if (now - this.lastRecoveryTime < 30000) return;
    
    // Verificar si necesitamos recovery
    if (this.metrics.totalErrors < this.errorThreshold && type !== 'full') {
      return;
    }

    if (!this.isRecovering) {
      this.executeRecovery(type);
    }
  }

  private async executeRecovery(type: RecoveryAction['type']): Promise<void> {
    this.isRecovering = true;
    this.lastRecoveryTime = Date.now();
    this.metrics.recoveryAttempts++;

    try {
      const action = this.recoveryActions.find(a => a.type === type);
      if (!action || action.currentRetries >= action.maxRetries) {
        // Escalate to full recovery
        await this.executeRecovery('full');
        return;
      }

      action.currentRetries++;
      const success = await action.action();
      
      if (success) {
        this.metrics.successfulRecoveries++;
        action.currentRetries = 0; // Reset on success
        
        // Reset error counters for this type
        this.resetErrorCounters(type);
      } else if (action.currentRetries >= action.maxRetries) {
        // Escalate to full recovery if max retries reached
        await this.executeRecovery('full');
      }
    } catch (error) {
      console.error('Recovery action failed:', error);
    } finally {
      this.isRecovering = false;
    }
  }

  private async performFullSystemRecovery(): Promise<boolean> {
    try {
      // 1. Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      // 2. Reset storage systems
      const { antiTrackingStorage } = await import('../storage/AntiTrackingStorageLayer');
      antiTrackingStorage.clear();

      // 3. Reset WebGL system
      const { ultraStableWebGL } = await import('../webgl/UltraStableWebGLManager');
      ultraStableWebGL.destroy();

      // 4. Clear CSP violations
      const { cspCompatibility } = await import('../security/CSPCompatibilityLayer');
      cspCompatibility.clearViolations();

      // 5. Reset metrics
      this.resetAllMetrics();

      // 6. Trigger garbage collection if available
      if ((window as any).gc) {
        (window as any).gc();
      }

      return true;
    } catch (error) {
      // Last resort: page reload
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      
      return false;
    }
  }

  private resetErrorCounters(type: RecoveryAction['type']): void {
    switch (type) {
      case 'storage':
        this.metrics.trackingErrors = 0;
        break;
      case 'csp':
        this.metrics.cspErrors = 0;
        break;
      case 'webgl':
        this.metrics.webglErrors = 0;
        break;
      case 'resource':
        this.metrics.resourceErrors = 0;
        break;
    }
  }

  private resetAllMetrics(): void {
    this.metrics = {
      totalErrors: 0,
      trackingErrors: 0,
      cspErrors: 0,
      webglErrors: 0,
      resourceErrors: 0,
      recoveryAttempts: 0,
      successfulRecoveries: 0
    };
  }

  private startMetricsReporting(): void {
    // Report metrics every 5 minutes in development
    if (process.env.NODE_ENV === 'development') {
      setInterval(() => {
        console.log('🔧 Production Error Recovery Metrics:', this.metrics);
      }, 300000);
    }
  }

  getMetrics(): ErrorMetrics {
    return { ...this.metrics };
  }

  getRecoveryRate(): number {
    return this.metrics.recoveryAttempts > 0 
      ? this.metrics.successfulRecoveries / this.metrics.recoveryAttempts 
      : 1;
  }

  // Manual recovery trigger for testing
  async manualRecovery(type: RecoveryAction['type'] = 'full'): Promise<boolean> {
    if (this.isRecovering) return false;
    
    await this.executeRecovery(type);
    return true;
  }
}

export const productionErrorRecovery = ProductionErrorRecovery.getInstance();
