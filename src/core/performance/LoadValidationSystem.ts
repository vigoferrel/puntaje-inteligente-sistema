
interface LoadValidationMetrics {
  componentLoadTime: number;
  navigationResponseTime: number;
  memoryUsage: number;
  errorCount: number;
  renderCount: number;
}

interface ValidationResult {
  isHealthy: boolean;
  metrics: LoadValidationMetrics;
  issues: string[];
  recommendations: string[];
}

class LoadValidationSystem {
  private startTime = performance.now();
  private renderCount = 0;
  private errorCount = 0;
  private navigationStartTime = 0;

  markComponentLoad(componentName: string) {
    const loadTime = performance.now() - this.startTime;
    console.log(`✅ ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
    return loadTime;
  }

  markNavigationStart() {
    this.navigationStartTime = performance.now();
  }

  markNavigationEnd() {
    const responseTime = performance.now() - this.navigationStartTime;
    console.log(`🧭 Navigation completed in ${responseTime.toFixed(2)}ms`);
    return responseTime;
  }

  incrementRenderCount() {
    this.renderCount++;
  }

  incrementErrorCount() {
    this.errorCount++;
  }

  getValidationReport(): ValidationResult {
    const currentTime = performance.now();
    const totalLoadTime = currentTime - this.startTime;
    
    // Simular métricas de memoria
    const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;
    
    const metrics: LoadValidationMetrics = {
      componentLoadTime: totalLoadTime,
      navigationResponseTime: this.navigationStartTime > 0 ? currentTime - this.navigationStartTime : 0,
      memoryUsage,
      errorCount: this.errorCount,
      renderCount: this.renderCount
    };

    const issues: string[] = [];
    const recommendations: string[] = [];

    // Validaciones
    if (totalLoadTime > 2000) {
      issues.push('Tiempo de carga superior a 2 segundos');
      recommendations.push('Implementar lazy loading adicional');
    }

    if (this.errorCount > 0) {
      issues.push(`${this.errorCount} errores detectados`);
      recommendations.push('Revisar manejo de errores');
    }

    if (this.renderCount > 10) {
      issues.push('Exceso de re-renderizados detectado');
      recommendations.push('Optimizar useCallback y useMemo');
    }

    const isHealthy = issues.length === 0 && totalLoadTime < 2000;

    return {
      isHealthy,
      metrics,
      issues,
      recommendations
    };
  }

  reset() {
    this.startTime = performance.now();
    this.renderCount = 0;
    this.errorCount = 0;
    this.navigationStartTime = 0;
  }
}

export const loadValidator = new LoadValidationSystem();
