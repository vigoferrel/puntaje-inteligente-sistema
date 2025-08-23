
import { useCallback, useMemo, useRef, useEffect } from 'react';
import { IntelligentAlertsEngine } from '@/core/performance/IntelligentAlertsEngine';
import { usePredictiveAnalyzer } from '@/core/performance/PredictiveAnalyzer';
import { useAutoOptimization } from '@/core/performance/AutoOptimizationEngine';

export const usePerformanceOptimization = (componentName: string) => {
  const renderCountRef = useRef(0);
  const lastRenderTime = useRef(performance.now());
  const startTime = useRef(performance.now());
  
  const alertsEngine = IntelligentAlertsEngine.getInstance();
  const { addMetric, recordBehavior } = usePredictiveAnalyzer();
  const { updateMetrics } = useAutoOptimization();

  useEffect(() => {
    renderCountRef.current++;
    
    const currentTime = performance.now();
    const renderTime = currentTime - lastRenderTime.current;
    const totalTime = currentTime - startTime.current;
    
    // Registrar métricas en el sistema predictivo
    addMetric(`${componentName}_renderTime`, renderTime);
    addMetric(`${componentName}_renderCount`, renderCountRef.current);
    
    // Analizar con el sistema de alertas
    alertsEngine.analyzeMetrics({
      memory: getMemoryUsage(),
      responseTime: renderTime,
      errorRate: 0, // Se actualizaría desde error boundaries
      renderTime,
      componentName
    });
    
    // Actualizar auto-optimización
    updateMetrics({
      renderCount: renderCountRef.current,
      responseTime: renderTime,
      memoryUsage: getMemoryUsage(),
      componentCount: 1
    });
    
    // Alertar sobre renders muy frecuentes
    if (renderTime < 16) { // 60fps threshold
      console.warn(`⚠️ ${componentName}: Renderizado muy frecuente (${renderTime.toFixed(2)}ms)`);
    }
    
    // Registrar comportamiento de performance
    if (renderTime > 100) {
      recordBehavior('performance', `slow_render:${componentName}`);
    }
    
    lastRenderTime.current = currentTime;
  });

  const getMemoryUsage = useCallback(() => {
    const memory = (performance as any).memory;
    return memory ? (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100 : 0;
  }, []);

  const optimizedCallback = useCallback((fn: Function) => {
    return useCallback(fn, []);
  }, []);

  const optimizedMemo = useCallback((factory: () => any, deps: any[]) => {
    return useMemo(factory, deps);
  }, []);

  const markLoadComplete = useCallback(() => {
    const loadTime = performance.now() - startTime.current;
    addMetric(`${componentName}_loadTime`, loadTime);
    
    console.log(`✅ ${componentName} cargado en ${loadTime.toFixed(2)}ms`);
  }, [componentName, addMetric]);

  const recordError = useCallback((error: Error) => {
    alertsEngine.analyzeMetrics({
      memory: getMemoryUsage(),
      responseTime: performance.now() - lastRenderTime.current,
      errorRate: 1,
      renderTime: 0,
      componentName
    });
    
    recordBehavior('performance', `error:${componentName}:${error.name}`);
  }, [componentName, alertsEngine, recordBehavior, getMemoryUsage]);

  return {
    renderCount: renderCountRef.current,
    optimizedCallback,
    optimizedMemo,
    markLoadComplete,
    recordError,
    currentRenderTime: performance.now() - lastRenderTime.current,
    totalLoadTime: performance.now() - startTime.current
  };
};
