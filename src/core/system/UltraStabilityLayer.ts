
/**
 * ULTRA STABILITY LAYER v1.0
 * Integración y orquestación de todos los sistemas de estabilidad
 */

import { antiTrackingStorage } from '../storage/AntiTrackingStorageLayer';
import { cspCompatibility } from '../security/CSPCompatibilityLayer';
import { resourceOptimizer } from '../performance/ResourceOptimizationEngine';
import { ultraStableWebGL } from '../webgl/UltraStableWebGLManager';
import { productionErrorRecovery } from '../error-handling/ProductionErrorRecovery';

interface SystemStatus {
  storage: 'healthy' | 'degraded' | 'failed';
  csp: 'healthy' | 'degraded' | 'failed';
  resources: 'healthy' | 'degraded' | 'failed';
  webgl: 'healthy' | 'degraded' | 'failed';
  overall: 'healthy' | 'degraded' | 'critical' | 'emergency';
}

class UltraStabilityLayer {
  private static instance: UltraStabilityLayer;
  private initialized = false;
  private systemStatus: SystemStatus = {
    storage: 'healthy',
    csp: 'healthy',
    resources: 'healthy',
    webgl: 'healthy',
    overall: 'healthy'
  };

  static getInstance(): UltraStabilityLayer {
    if (!UltraStabilityLayer.instance) {
      UltraStabilityLayer.instance = new UltraStabilityLayer();
    }
    return UltraStabilityLayer.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Inicializar todos los sistemas en paralelo
      await Promise.all([
        this.initializeStorage(),
        this.initializeCSP(),
        this.initializeResources(),
        this.initializeWebGL(),
        this.initializeErrorRecovery()
      ]);

      this.startSystemMonitoring();
      this.initialized = true;
      
      console.log('✅ Ultra Stability Layer: All systems initialized');
    } catch (error) {
      console.error('❌ Ultra Stability Layer: Initialization failed', error);
      await productionErrorRecovery.manualRecovery('full');
    }
  }

  private async initializeStorage(): Promise<void> {
    try {
      const status = antiTrackingStorage.getStatus();
      this.systemStatus.storage = status.trackingBlocked ? 'degraded' : 'healthy';
    } catch (error) {
      this.systemStatus.storage = 'failed';
    }
  }

  private async initializeCSP(): Promise<void> {
    try {
      const violations = cspCompatibility.getViolations();
      this.systemStatus.csp = violations.length > 5 ? 'degraded' : 'healthy';
    } catch (error) {
      this.systemStatus.csp = 'failed';
    }
  }

  private async initializeResources(): Promise<void> {
    try {
      const metrics = resourceOptimizer.getOptimizationMetrics();
      this.systemStatus.resources = metrics.unusedResources > 10 ? 'degraded' : 'healthy';
    } catch (error) {
      this.systemStatus.resources = 'failed';
    }
  }

  private async initializeWebGL(): Promise<void> {
    try {
      const status = ultraStableWebGL.getStatus();
      this.systemStatus.webgl = status.emergencyMode ? 'degraded' : 'healthy';
    } catch (error) {
      this.systemStatus.webgl = 'failed';
    }
  }

  private async initializeErrorRecovery(): Promise<void> {
    const recoveryRate = productionErrorRecovery.getRecoveryRate();
    if (recoveryRate < 0.8) {
      console.warn('⚠️ Error recovery rate below threshold:', recoveryRate);
    }
  }

  private startSystemMonitoring(): void {
    setInterval(() => {
      this.updateSystemStatus();
    }, 30000); // Cada 30 segundos
  }

  private updateSystemStatus(): void {
    const previousStatus = this.systemStatus.overall;
    
    // Recalcular estado de cada subsistema
    this.initializeStorage();
    this.initializeCSP();
    this.initializeResources();
    this.initializeWebGL();

    // Calcular estado general
    const subsystems = [
      this.systemStatus.storage,
      this.systemStatus.csp,
      this.systemStatus.resources,
      this.systemStatus.webgl
    ];

    const failedCount = subsystems.filter(s => s === 'failed').length;
    const degradedCount = subsystems.filter(s => s === 'degraded').length;

    if (failedCount >= 2) {
      this.systemStatus.overall = 'emergency';
    } else if (failedCount >= 1 || degradedCount >= 3) {
      this.systemStatus.overall = 'critical';
    } else if (degradedCount >= 1) {
      this.systemStatus.overall = 'degraded';
    } else {
      this.systemStatus.overall = 'healthy';
    }

    // Trigger recovery si el estado empeoró
    if (this.systemStatus.overall !== previousStatus && 
        ['critical', 'emergency'].includes(this.systemStatus.overall)) {
      productionErrorRecovery.manualRecovery('full');
    }
  }

  getSystemStatus(): SystemStatus {
    return { ...this.systemStatus };
  }

  async performHealthCheck(): Promise<boolean> {
    await this.updateSystemStatus();
    return this.systemStatus.overall !== 'emergency';
  }

  // Método para componentes que necesiten verificar estabilidad
  async waitForStability(): Promise<boolean> {
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      if (await this.performHealthCheck()) {
        return true;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    return false;
  }

  // Método para obtener configuración optimizada basada en el estado del sistema
  getOptimizedConfig() {
    const status = this.systemStatus.overall;
    
    return {
      enableWebGL: ['healthy', 'degraded'].includes(status),
      enablePreloading: status === 'healthy',
      useMemoryStorage: this.systemStatus.storage !== 'healthy',
      conservativeMode: ['critical', 'emergency'].includes(status),
      maxConcurrentOperations: status === 'healthy' ? 3 : 1
    };
  }
}

export const ultraStabilityLayer = UltraStabilityLayer.getInstance();

// Auto-initialize on module load
ultraStabilityLayer.initialize();
