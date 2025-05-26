
import React, { createContext, useContext, useEffect, useState } from 'react';
import { logger } from '@/core/logging/SystemLogger';

interface PerformanceMetrics {
  memoryUsage: number;
  renderTime: number;
  errorCount: number;
  warningCount: number;
  lastUpdate: number;
}

interface PerformanceContextType {
  metrics: PerformanceMetrics;
  isHealthy: boolean;
  reportError: (error: string) => void;
  reportWarning: (warning: string) => void;
}

const PerformanceContext = createContext<PerformanceContextType | null>(null);

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within PerformanceMonitor');
  }
  return context;
};

interface PerformanceMonitorProps {
  children: React.ReactNode;
  warningThreshold?: number;
  errorThreshold?: number;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  children,
  warningThreshold = 5,
  errorThreshold = 10
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    memoryUsage: 0,
    renderTime: 0,
    errorCount: 0,
    warningCount: 0,
    lastUpdate: Date.now()
  });

  const [isHealthy, setIsHealthy] = useState(true);

  // Monitoreo de memoria
  useEffect(() => {
    const interval = setInterval(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        
        setMetrics(prev => ({
          ...prev,
          memoryUsage,
          lastUpdate: Date.now()
        }));

        if (memoryUsage > 0.8) {
          logger.warn('PerformanceMonitor', `High memory usage: ${(memoryUsage * 100).toFixed(1)}%`);
        }
      }
    }, 10000); // Cada 10 segundos

    return () => clearInterval(interval);
  }, []);

  // Verificar salud del sistema
  useEffect(() => {
    const healthy = metrics.errorCount < errorThreshold && 
                   metrics.warningCount < warningThreshold && 
                   metrics.memoryUsage < 0.9;
    
    if (healthy !== isHealthy) {
      setIsHealthy(healthy);
      logger.info('PerformanceMonitor', `System health changed: ${healthy ? 'Healthy' : 'Degraded'}`, metrics);
    }
  }, [metrics, isHealthy, errorThreshold, warningThreshold]);

  const reportError = (error: string) => {
    setMetrics(prev => ({
      ...prev,
      errorCount: prev.errorCount + 1,
      lastUpdate: Date.now()
    }));
    logger.error('PerformanceMonitor', error);
  };

  const reportWarning = (warning: string) => {
    setMetrics(prev => ({
      ...prev,
      warningCount: prev.warningCount + 1,
      lastUpdate: Date.now()
    }));
    logger.warn('PerformanceMonitor', warning);
  };

  return (
    <PerformanceContext.Provider value={{
      metrics,
      isHealthy,
      reportError,
      reportWarning
    }}>
      {children}
    </PerformanceContext.Provider>
  );
};
