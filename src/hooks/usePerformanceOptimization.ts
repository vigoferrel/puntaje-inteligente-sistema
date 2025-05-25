
import { useCallback, useMemo, useRef, useEffect } from 'react';
import { loadValidator } from '@/core/performance/LoadValidationSystem';

export const usePerformanceOptimization = (componentName: string) => {
  const renderCountRef = useRef(0);
  const lastRenderTime = useRef(performance.now());

  useEffect(() => {
    renderCountRef.current++;
    loadValidator.incrementRenderCount();
    
    const currentTime = performance.now();
    const timeSinceLastRender = currentTime - lastRenderTime.current;
    
    if (timeSinceLastRender < 16) { // 60fps threshold
      console.warn(`⚠️ ${componentName}: Renderizado muy frecuente (${timeSinceLastRender.toFixed(2)}ms)`);
    }
    
    lastRenderTime.current = currentTime;
  });

  const optimizedCallback = useCallback((fn: Function) => {
    return useCallback(fn, []);
  }, []);

  const optimizedMemo = useCallback((factory: () => any, deps: any[]) => {
    return useMemo(factory, deps);
  }, []);

  const markLoadComplete = useCallback(() => {
    loadValidator.markComponentLoad(componentName);
  }, [componentName]);

  return {
    renderCount: renderCountRef.current,
    optimizedCallback,
    optimizedMemo,
    markLoadComplete
  };
};
