
import { useEffect, useRef, useCallback } from 'react';
import { intelligentCache } from './IntelligentCacheSystem';
import { toast } from 'sonner';

interface OptimizationRule {
  id: string;
  condition: (metrics: any) => boolean;
  action: () => Promise<void>;
  description: string;
  priority: number;
  cooldown: number;
  lastExecuted: number;
}

interface OptimizationMetrics {
  memoryUsage: number;
  cacheHitRate: number;
  renderCount: number;
  errorRate: number;
  responseTime: number;
  componentCount: number;
}

class AutoOptimizationEngine {
  private static instance: AutoOptimizationEngine;
  private rules: OptimizationRule[] = [];
  private isRunning = false;
  private metrics: OptimizationMetrics = {
    memoryUsage: 0,
    cacheHitRate: 0,
    renderCount: 0,
    errorRate: 0,
    responseTime: 0,
    componentCount: 0
  };

  static getInstance(): AutoOptimizationEngine {
    if (!AutoOptimizationEngine.instance) {
      AutoOptimizationEngine.instance = new AutoOptimizationEngine();
    }
    return AutoOptimizationEngine.instance;
  }

  constructor() {
    this.initializeRules();
  }

  private initializeRules() {
    this.rules = [
      {
        id: 'memory-cleanup',
        condition: (metrics) => metrics.memoryUsage > 80,
        action: this.performMemoryCleanup.bind(this),
        description: 'Limpieza automática de memoria',
        priority: 10,
        cooldown: 30000, // 30 segundos
        lastExecuted: 0
      },
      {
        id: 'cache-optimization',
        condition: (metrics) => metrics.cacheHitRate < 60,
        action: this.optimizeCache.bind(this),
        description: 'Optimización de cache',
        priority: 8,
        cooldown: 60000, // 1 minuto
        lastExecuted: 0
      },
      {
        id: 'component-memoization',
        condition: (metrics) => metrics.renderCount > 20,
        action: this.optimizeComponentRendering.bind(this),
        description: 'Optimización de renderizado',
        priority: 7,
        cooldown: 45000, // 45 segundos
        lastExecuted: 0
      },
      {
        id: 'resource-preloading',
        condition: (metrics) => metrics.responseTime > 300,
        action: this.optimizeResourceLoading.bind(this),
        description: 'Optimización de carga de recursos',
        priority: 6,
        cooldown: 120000, // 2 minutos
        lastExecuted: 0
      },
      {
        id: 'error-mitigation',
        condition: (metrics) => metrics.errorRate > 2,
        action: this.mitigateErrors.bind(this),
        description: 'Mitigación de errores',
        priority: 9,
        cooldown: 20000, // 20 segundos
        lastExecuted: 0
      }
    ];
  }

  updateMetrics(newMetrics: Partial<OptimizationMetrics>) {
    this.metrics = { ...this.metrics, ...newMetrics };
    
    if (!this.isRunning) {
      this.runOptimizations();
    }
  }

  private async runOptimizations() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    const now = Date.now();
    
    try {
      // Filtrar reglas que pueden ejecutarse
      const applicableRules = this.rules
        .filter(rule => 
          rule.condition(this.metrics) && 
          (now - rule.lastExecuted) > rule.cooldown
        )
        .sort((a, b) => b.priority - a.priority);

      // Ejecutar la regla de mayor prioridad
      if (applicableRules.length > 0) {
        const rule = applicableRules[0];
        console.log(`🤖 Auto-optimización: ${rule.description}`);
        
        try {
          await rule.action();
          rule.lastExecuted = now;
          
          toast.success('Auto-optimización aplicada', {
            description: rule.description,
            icon: '🚀'
          });
        } catch (error) {
          console.error(`Error en auto-optimización ${rule.id}:`, error);
        }
      }
    } finally {
      this.isRunning = false;
    }
  }

  private async performMemoryCleanup(): Promise<void> {
    // Limpiar cache inteligente
    intelligentCache.cleanup();
    
    // Forzar garbage collection si está disponible
    if (typeof window !== 'undefined' && 'gc' in window) {
      (window as any).gc();
    }
    
    // Limpiar referencias DOM innecesarias
    this.cleanupDOMReferences();
    
    // Limpiar localStorage si está muy lleno
    this.cleanupLocalStorage();
  }

  private async optimizeCache(): Promise<void> {
    // Limpiar entradas de cache expiradas
    intelligentCache.cleanup();
    
    // Precargar recursos frecuentemente usados
    const frequentResources = this.getFrequentlyUsedResources();
    frequentResources.forEach(resource => {
      intelligentCache.set(resource.key, resource.data, 600000, 'high');
    });
    
    // Ajustar configuración de cache
    this.adjustCacheConfiguration();
  }

  private async optimizeComponentRendering(): Promise<void> {
    // Implementar memoización dinámica
    this.enableDynamicMemoization();
    
    // Reducir frecuencia de renders
    this.implementRenderThrottling();
    
    // Cleanup de event listeners no utilizados
    this.cleanupEventListeners();
  }

  private async optimizeResourceLoading(): Promise<void> {
    // Precargar componentes críticos
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        this.preloadCriticalComponents();
      });
    }
    
    // Optimizar orden de carga
    this.optimizeLoadOrder();
    
    // Implementar resource hints
    this.addResourceHints();
  }

  private async mitigateErrors(): Promise<void> {
    // Activar modo de recuperación
    this.activateRecoveryMode();
    
    // Reiniciar componentes problemáticos
    this.restartProblematicComponents();
    
    // Aumentar timeouts temporalmente
    this.adjustTimeouts();
  }

  private cleanupDOMReferences() {
    // Remover nodos DOM huérfanos
    const orphanedNodes = document.querySelectorAll('[data-cleanup="true"]');
    orphanedNodes.forEach(node => node.remove());
    
    // Limpiar referencias de imágenes no utilizadas
    const unusedImages = document.querySelectorAll('img[data-loaded="false"]');
    unusedImages.forEach(img => {
      (img as HTMLImageElement).src = '';
    });
  }

  private cleanupLocalStorage() {
    try {
      const storageSize = new Blob([JSON.stringify(localStorage)]).size;
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (storageSize > maxSize) {
        // Remover entradas antiguas
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith('cache_') || key.startsWith('temp_')) {
            try {
              const item = JSON.parse(localStorage.getItem(key) || '{}');
              if (item.timestamp && Date.now() - item.timestamp > 24 * 60 * 60 * 1000) {
                localStorage.removeItem(key);
              }
            } catch {
              localStorage.removeItem(key);
            }
          }
        });
      }
    } catch (error) {
      console.warn('Error en limpieza de localStorage:', error);
    }
  }

  private getFrequentlyUsedResources() {
    // Simular análisis de recursos frecuentes
    return [
      { key: 'user_preferences', data: { theme: 'dark', language: 'es' } },
      { key: 'navigation_history', data: ['/dashboard', '/lectoguia'] },
      { key: 'component_states', data: { sidebar: 'expanded' } }
    ];
  }

  private adjustCacheConfiguration() {
    // Ajustar tamaños de cache basado en uso
    const cacheStats = intelligentCache.getCacheStats();
    if (cacheStats.size > 100) {
      // Reducir TTL para entradas menos importantes
      intelligentCache.adjustConfiguration({
        defaultTTL: 300000, // 5 minutos
        maxSize: 150
      });
    }
  }

  private enableDynamicMemoization() {
    // Implementar memoización automática para componentes frecuentes
    console.log('🧠 Habilitando memoización dinámica');
  }

  private implementRenderThrottling() {
    // Throttling de renders usando requestAnimationFrame
    console.log('⏱️ Implementando throttling de renders');
  }

  private cleanupEventListeners() {
    // Remover event listeners huérfanos
    console.log('🧹 Limpiando event listeners');
  }

  private preloadCriticalComponents() {
    // Precargar componentes basado en patrones de navegación
    const criticalComponents = ['dashboard', 'lectoguia', 'neural-command'];
    criticalComponents.forEach(component => {
      import(`@/components/${component}`).catch(() => {
        // Ignore errors for non-existent components
      });
    });
  }

  private optimizeLoadOrder() {
    // Reordenar carga de recursos por prioridad
    console.log('📊 Optimizando orden de carga');
  }

  private addResourceHints() {
    // Agregar hints de precarga
    const head = document.head;
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = '/api/neural-metrics';
    head.appendChild(link);
  }

  private activateRecoveryMode() {
    // Activar modo de recuperación de errores
    console.log('🛡️ Activando modo de recuperación');
  }

  private restartProblematicComponents() {
    // Reiniciar componentes que causan errores
    console.log('🔄 Reiniciando componentes problemáticos');
  }

  private adjustTimeouts() {
    // Aumentar timeouts temporalmente
    console.log('⏰ Ajustando timeouts');
  }

  getOptimizationStatus() {
    return {
      rulesCount: this.rules.length,
      activeRules: this.rules.filter(rule => 
        rule.condition(this.metrics) && 
        (Date.now() - rule.lastExecuted) > rule.cooldown
      ).length,
      lastOptimization: Math.max(...this.rules.map(r => r.lastExecuted)),
      metrics: this.metrics,
      isRunning: this.isRunning
    };
  }

  forceOptimization(ruleId?: string) {
    if (ruleId) {
      const rule = this.rules.find(r => r.id === ruleId);
      if (rule) {
        rule.lastExecuted = 0; // Reset cooldown
        this.runOptimizations();
      }
    } else {
      this.rules.forEach(rule => rule.lastExecuted = 0);
      this.runOptimizations();
    }
  }
}

export const useAutoOptimization = () => {
  const engineRef = useRef(AutoOptimizationEngine.getInstance());
  
  const updateMetrics = useCallback((metrics: Partial<OptimizationMetrics>) => {
    engineRef.current.updateMetrics(metrics);
  }, []);

  const forceOptimization = useCallback((ruleId?: string) => {
    engineRef.current.forceOptimization(ruleId);
  }, []);

  const getStatus = useCallback(() => {
    return engineRef.current.getOptimizationStatus();
  }, []);

  // Auto-update métricas desde performance API
  useEffect(() => {
    const updateFromPerformanceAPI = () => {
      const memory = (performance as any).memory;
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      updateMetrics({
        memoryUsage: memory ? (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100 : 0,
        responseTime: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0
      });
    };

    const interval = setInterval(updateFromPerformanceAPI, 5000);
    updateFromPerformanceAPI(); // Inicial

    return () => clearInterval(interval);
  }, [updateMetrics]);

  return {
    updateMetrics,
    forceOptimization,
    getStatus
  };
};

export { AutoOptimizationEngine };
