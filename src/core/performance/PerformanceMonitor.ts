
import React, { useEffect } from 'react';

interface PerformanceMetrics {
  componentRenderTime: number;
  memoryUsage: number;
  errorRate: number;
  userEngagement: number;
  loadTime: number;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    // Observer para navigation timing
    if ('PerformanceObserver' in window) {
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.recordLoadTime(navEntry.loadEventEnd - navEntry.loadEventStart);
          }
        }
      });
      
      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navObserver);
    }

    // Observer para memory usage
    this.startMemoryMonitoring();
  }

  recordComponentRender(componentName: string, renderTime: number) {
    const current = this.metrics.get(componentName) || this.getDefaultMetrics();
    current.componentRenderTime = renderTime;
    this.metrics.set(componentName, current);
    
    // Alert si el render es muy lento
    if (renderTime > 100) {
      console.warn(`⚠️ Render lento detectado en ${componentName}: ${renderTime}ms`);
    }
  }

  recordError(componentName: string) {
    const current = this.metrics.get(componentName) || this.getDefaultMetrics();
    current.errorRate += 1;
    this.metrics.set(componentName, current);
  }

  recordUserEngagement(componentName: string, engagement: number) {
    const current = this.metrics.get(componentName) || this.getDefaultMetrics();
    current.userEngagement = engagement;
    this.metrics.set(componentName, current);
  }

  private recordLoadTime(loadTime: number) {
    console.log(`📊 Tiempo de carga: ${loadTime}ms`);
  }

  private startMemoryMonitoring() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        if (memory) {
          const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
          
          if (usagePercent > 80) {
            console.warn(`🚨 Alto uso de memoria: ${usagePercent.toFixed(2)}%`);
          }
        }
      }, 30000); // Cada 30 segundos
    }
  }

  private getDefaultMetrics(): PerformanceMetrics {
    return {
      componentRenderTime: 0,
      memoryUsage: 0,
      errorRate: 0,
      userEngagement: 0,
      loadTime: 0
    };
  }

  getMetrics(componentName?: string): PerformanceMetrics | Map<string, PerformanceMetrics> {
    if (componentName) {
      return this.metrics.get(componentName) || this.getDefaultMetrics();
    }
    return this.metrics;
  }

  generateReport(): string {
    const report = Array.from(this.metrics.entries())
      .map(([name, metrics]) => `${name}: ${JSON.stringify(metrics, null, 2)}`)
      .join('\n\n');
    
    return `Performance Report:\n${report}`;
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Hook corregido para monitorear componentes
export const usePerformanceMonitor = (componentName: string) => {
  const startTime = performance.now();
  
  useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    performanceMonitor.recordComponentRender(componentName, renderTime);
  });

  return {
    recordError: () => performanceMonitor.recordError(componentName),
    recordEngagement: (level: number) => performanceMonitor.recordUserEngagement(componentName, level)
  };
};
