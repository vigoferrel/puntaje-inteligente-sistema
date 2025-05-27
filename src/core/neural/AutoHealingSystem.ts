
/**
 * AUTO-HEALING SYSTEM v2.0
 * Sistema de recuperación automática y monitoreo de salud
 */

import { neuralTelemetryService } from './NeuralTelemetryService';
import { predictiveAnalyticsEngine } from './PredictiveAnalyticsEngine';

interface ComponentHealth {
  component_name: string;
  health_score: number;
  last_error?: Error;
  error_count: number;
  recovery_attempts: number;
  status: 'healthy' | 'warning' | 'critical' | 'recovering';
  performance_metrics: {
    render_time: number;
    memory_usage: number;
    error_rate: number;
  };
}

interface SystemHealth {
  overall_score: number;
  components: Map<string, ComponentHealth>;
  active_issues: string[];
  recovery_actions: string[];
  last_health_check: number;
  auto_healing_enabled: boolean;
}

interface RecoveryAction {
  id: string;
  type: 'component_restart' | 'memory_cleanup' | 'state_reset' | 'optimization' | 'emergency_fallback';
  target: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  auto_execute: boolean;
  execution_time?: number;
  success: boolean;
}

class AutoHealingSystemCore {
  private static instance: AutoHealingSystemCore;
  private systemHealth: SystemHealth = {
    overall_score: 100,
    components: new Map(),
    active_issues: [],
    recovery_actions: [],
    last_health_check: Date.now(),
    auto_healing_enabled: true
  };

  private recoveryHistory: RecoveryAction[] = [];
  private errorThresholds = {
    warning: 3,
    critical: 7,
    emergency: 15
  };

  private healingStrategies = new Map<string, () => Promise<boolean>>();

  static getInstance(): AutoHealingSystemCore {
    if (!AutoHealingSystemCore.instance) {
      AutoHealingSystemCore.instance = new AutoHealingSystemCore();
    }
    return AutoHealingSystemCore.instance;
  }

  private constructor() {
    this.initializeHealingSystem();
    this.registerDefaultHealingStrategies();
    this.startHealthMonitoring();
  }

  private initializeHealingSystem(): void {
    // Interceptar errores globales
    window.addEventListener('error', (event) => {
      this.handleGlobalError(event.error, 'global_error');
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.handleGlobalError(new Error(event.reason), 'unhandled_promise');
    });

    // Monitor React error boundaries (si está disponible)
    this.setupReactErrorBoundaryIntegration();

    console.log('🛡️ Auto-Healing System initialized');
  }

  private setupReactErrorBoundaryIntegration(): void {
    // Hook para integrar con error boundaries de React
    (window as any).__NEURAL_AUTO_HEALING__ = {
      reportComponentError: (componentName: string, error: Error) => {
        this.handleComponentError(componentName, error);
      },
      requestHealing: (componentName: string) => {
        return this.healComponent(componentName);
      }
    };
  }

  private registerDefaultHealingStrategies(): void {
    // Estrategia: Limpieza de memoria
    this.healingStrategies.set('memory_cleanup', async () => {
      console.log('🧹 Executing memory cleanup...');
      
      // Forzar garbage collection si está disponible
      if (typeof window !== 'undefined' && (window as any).gc) {
        (window as any).gc();
      }

      // Limpiar caches locales
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(name => 
            name.includes('old') ? caches.delete(name) : Promise.resolve()
          )
        );
      }

      return true;
    });

    // Estrategia: Reset de estado
    this.healingStrategies.set('state_reset', async () => {
      console.log('🔄 Executing state reset...');
      
      // Limpiar localStorage no crítico
      const keysToKeep = ['auth_token', 'user_preferences', 'neural_session_id'];
      Object.keys(localStorage).forEach(key => {
        if (!keysToKeep.some(keepKey => key.includes(keepKey))) {
          localStorage.removeItem(key);
        }
      });

      return true;
    });

    // Estrategia: Optimización de rendimiento
    this.healingStrategies.set('performance_optimization', async () => {
      console.log('⚡ Executing performance optimization...');
      
      // Reducir calidad de animaciones temporalmente
      document.documentElement.style.setProperty('--animation-duration', '0.1s');
      
      // Restaurar después de 30 segundos
      setTimeout(() => {
        document.documentElement.style.removeProperty('--animation-duration');
      }, 30000);

      return true;
    });

    // Estrategia: Recarga de componente
    this.healingStrategies.set('component_refresh', async () => {
      console.log('🔃 Executing component refresh...');
      
      // Trigger re-render forzado
      window.dispatchEvent(new CustomEvent('neural_healing_refresh'));
      return true;
    });
  }

  private startHealthMonitoring(): void {
    setInterval(() => {
      this.performHealthCheck();
      this.executeAutomaticHealing();
      this.cleanupOldRecoveryHistory();
    }, 15000); // Cada 15 segundos
  }

  private performHealthCheck(): void {
    let totalScore = 0;
    let componentCount = 0;

    // Evaluar salud de cada componente
    this.systemHealth.components.forEach((health, componentName) => {
      this.updateComponentHealth(componentName, health);
      totalScore += health.health_score;
      componentCount++;
    });

    // Calcular puntuación general
    this.systemHealth.overall_score = componentCount > 0 
      ? Math.round(totalScore / componentCount) 
      : 100;

    // Actualizar issues activos
    this.updateActiveIssues();

    // Registrar métricas de salud
    neuralTelemetryService.captureNeuralEvent('performance', {
      health_check: {
        overall_score: this.systemHealth.overall_score,
        component_count: componentCount,
        active_issues: this.systemHealth.active_issues.length
      }
    });

    this.systemHealth.last_health_check = Date.now();
    console.log(`💗 System Health: ${this.systemHealth.overall_score}%`);
  }

  private updateComponentHealth(componentName: string, health: ComponentHealth): void {
    // Calcular score basado en errores y performance
    const errorPenalty = Math.min(50, health.error_count * 5);
    const performancePenalty = health.performance_metrics.render_time > 100 ? 20 : 0;
    const memoryPenalty = health.performance_metrics.memory_usage > 50 ? 15 : 0;

    health.health_score = Math.max(10, 100 - errorPenalty - performancePenalty - memoryPenalty);

    // Actualizar status
    if (health.health_score >= 80) {
      health.status = 'healthy';
    } else if (health.health_score >= 60) {
      health.status = 'warning';
    } else if (health.health_score >= 30) {
      health.status = 'critical';
    } else {
      health.status = 'recovering';
    }

    this.systemHealth.components.set(componentName, health);
  }

  private updateActiveIssues(): void {
    const issues: string[] = [];

    this.systemHealth.components.forEach((health, componentName) => {
      if (health.status === 'critical' || health.status === 'recovering') {
        issues.push(`${componentName}: ${health.status}`);
      }
    });

    // Issues del sistema general
    if (this.systemHealth.overall_score < 70) {
      issues.push('system_performance_degraded');
    }

    const memory = (performance as any).memory;
    if (memory && memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.85) {
      issues.push('high_memory_usage');
    }

    this.systemHealth.active_issues = issues;
  }

  private executeAutomaticHealing(): void {
    if (!this.systemHealth.auto_healing_enabled) return;

    // Healing basado en issues activos
    this.systemHealth.active_issues.forEach(issue => {
      this.triggerHealingForIssue(issue);
    });

    // Healing preventivo
    if (this.systemHealth.overall_score < 80 && this.systemHealth.overall_score > 60) {
      this.executeRecoveryAction({
        id: `preventive_${Date.now()}`,
        type: 'optimization',
        target: 'system',
        description: 'Preventive optimization to maintain performance',
        priority: 'low',
        auto_execute: true,
        success: false
      });
    }
  }

  private triggerHealingForIssue(issue: string): void {
    console.log(`🔧 Triggering healing for issue: ${issue}`);

    if (issue.includes('memory')) {
      this.executeHealing('memory_cleanup', 'system');
    } else if (issue.includes('performance')) {
      this.executeHealing('performance_optimization', 'system');
    } else if (issue.includes('critical')) {
      const componentName = issue.split(':')[0];
      this.executeHealing('component_refresh', componentName);
    }
  }

  public async executeHealing(strategyName: string, target: string): Promise<boolean> {
    const strategy = this.healingStrategies.get(strategyName);
    if (!strategy) {
      console.warn(`⚠️ Healing strategy not found: ${strategyName}`);
      return false;
    }

    const action: RecoveryAction = {
      id: `healing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: strategyName as any,
      target,
      description: `Auto-healing: ${strategyName} for ${target}`,
      priority: 'medium',
      auto_execute: true,
      execution_time: Date.now(),
      success: false
    };

    try {
      console.log(`🚀 Executing healing strategy: ${strategyName}`);
      const success = await strategy();
      
      action.success = success;
      this.recoveryHistory.push(action);
      this.systemHealth.recovery_actions.push(action.description);

      if (success) {
        console.log(`✅ Healing successful: ${strategyName}`);
        
        // Notificar éxito
        neuralTelemetryService.captureNeuralEvent('performance', {
          auto_healing: {
            strategy: strategyName,
            target,
            success: true,
            execution_time: Date.now() - action.execution_time!
          }
        });
      }

      return success;
    } catch (error) {
      console.error(`❌ Healing failed: ${strategyName}`, error);
      action.success = false;
      this.recoveryHistory.push(action);
      return false;
    }
  }

  public handleComponentError(componentName: string, error: Error): void {
    let health = this.systemHealth.components.get(componentName);
    
    if (!health) {
      health = {
        component_name: componentName,
        health_score: 100,
        error_count: 0,
        recovery_attempts: 0,
        status: 'healthy',
        performance_metrics: {
          render_time: 0,
          memory_usage: 0,
          error_rate: 0
        }
      };
    }

    health.last_error = error;
    health.error_count++;
    health.performance_metrics.error_rate = health.error_count / 10; // Rate per 10 operations

    this.systemHealth.components.set(componentName, health);

    // Trigger healing si supera threshold
    if (health.error_count >= this.errorThresholds.critical) {
      this.healComponent(componentName);
    }

    console.log(`🚨 Component error registered: ${componentName}`, error.message);
  }

  private handleGlobalError(error: Error, source: string): void {
    console.log(`🚨 Global error intercepted from ${source}:`, error.message);
    
    neuralTelemetryService.captureNeuralEvent('error', {
      error_type: 'global',
      source,
      message: error.message,
      stack: error.stack?.substring(0, 500) // Limit stack trace
    });

    // Trigger healing global si es necesario
    if (this.systemHealth.overall_score < 50) {
      this.executeHealing('state_reset', 'global');
    }
  }

  public async healComponent(componentName: string): Promise<boolean> {
    console.log(`🔧 Attempting to heal component: ${componentName}`);
    
    const health = this.systemHealth.components.get(componentName);
    if (health) {
      health.recovery_attempts++;
      health.status = 'recovering';
      this.systemHealth.components.set(componentName, health);
    }

    // Intentar múltiples estrategias
    const strategies = ['component_refresh', 'memory_cleanup'];
    
    for (const strategy of strategies) {
      const success = await this.executeHealing(strategy, componentName);
      if (success) {
        if (health) {
          health.error_count = Math.max(0, health.error_count - 2);
          health.status = 'healthy';
          this.systemHealth.components.set(componentName, health);
        }
        return true;
      }
    }

    return false;
  }

  private executeRecoveryAction(action: RecoveryAction): void {
    this.recoveryHistory.push(action);
    console.log(`⚡ Executing recovery action: ${action.description}`);
  }

  private cleanupOldRecoveryHistory(): void {
    const cutoff = Date.now() - (60 * 60 * 1000); // 1 hora
    this.recoveryHistory = this.recoveryHistory.filter(
      action => (action.execution_time || 0) > cutoff
    );
  }

  // API pública
  public getSystemHealth(): SystemHealth {
    return { 
      ...this.systemHealth,
      components: new Map(this.systemHealth.components)
    };
  }

  public getRecoveryHistory(limit = 20): RecoveryAction[] {
    return this.recoveryHistory.slice(-limit);
  }

  public registerHealingStrategy(name: string, strategy: () => Promise<boolean>): void {
    this.healingStrategies.set(name, strategy);
    console.log(`📋 Registered healing strategy: ${name}`);
  }

  public toggleAutoHealing(enabled: boolean): void {
    this.systemHealth.auto_healing_enabled = enabled;
    console.log(`🛡️ Auto-healing ${enabled ? 'enabled' : 'disabled'}`);
  }

  public forceHealthCheck(): void {
    this.performHealthCheck();
  }

  public emergencyRecovery(): Promise<boolean> {
    console.log('🚨 EMERGENCY RECOVERY INITIATED');
    
    return this.executeHealing('state_reset', 'emergency').then(success => {
      if (success) {
        // Reload completo como último recurso
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
      return success;
    });
  }
}

export const autoHealingSystem = AutoHealingSystemCore.getInstance();
export type { ComponentHealth, SystemHealth, RecoveryAction };
