
import React, { createContext, useContext, useEffect, useState } from 'react';
import { logger } from '@/core/logging/SystemLogger';
import { resourceValidator } from '@/core/resource-loader/ResourceValidator';
import { browserSupport } from '@/core/browser-compatibility/BrowserSupport';

interface SystemHealth {
  overall: 'excellent' | 'good' | 'warning' | 'critical';
  browser: 'supported' | 'partial' | 'unsupported';
  resources: 'loaded' | 'loading' | 'failed';
  errors: number;
  lastCheck: number;
}

interface HealthContextType {
  health: SystemHealth;
  isMonitoring: boolean;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  runHealthCheck: () => Promise<void>;
}

const HealthContext = createContext<HealthContextType | null>(null);

export const useSystemHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useSystemHealth must be used within HealthMonitorProvider');
  }
  return context;
};

export const HealthMonitorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [health, setHealth] = useState<SystemHealth>({
    overall: 'good',
    browser: 'supported',
    resources: 'loaded',
    errors: 0,
    lastCheck: Date.now()
  });
  
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [monitoringInterval, setMonitoringInterval] = useState<NodeJS.Timeout | null>(null);

  const runHealthCheck = async (): Promise<void> => {
    try {
      logger.debug('HealthMonitor', 'Running system health check');

      // Verificar navegador
      const browserInfo = browserSupport.getBrowserInfo();
      const browserStatus: SystemHealth['browser'] = 
        browserInfo.isSupported ? 'supported' : 
        Object.values(browserInfo.features).some(Boolean) ? 'partial' : 'unsupported';

      // Verificar errores recientes
      const recentErrors = logger.getLogsByLevel('error').length + 
                          logger.getLogsByLevel('critical').length;

      // Determinar salud general
      let overall: SystemHealth['overall'] = 'excellent';
      
      if (recentErrors > 10 || browserStatus === 'unsupported') {
        overall = 'critical';
      } else if (recentErrors > 5 || browserStatus === 'partial') {
        overall = 'warning';
      } else if (recentErrors > 0) {
        overall = 'good';
      }

      setHealth({
        overall,
        browser: browserStatus,
        resources: 'loaded', // Simplificado por ahora
        errors: recentErrors,
        lastCheck: Date.now()
      });

      logger.debug('HealthMonitor', 'Health check completed', {
        overall,
        browser: browserStatus,
        errors: recentErrors
      });

    } catch (error) {
      logger.error('HealthMonitor', 'Health check failed', error);
      setHealth(prev => ({
        ...prev,
        overall: 'critical',
        lastCheck: Date.now()
      }));
    }
  };

  const startMonitoring = () => {
    if (isMonitoring) return;
    
    setIsMonitoring(true);
    runHealthCheck(); // Check inmediato
    
    const interval = setInterval(() => {
      runHealthCheck();
    }, 30000); // Cada 30 segundos
    
    setMonitoringInterval(interval);
    logger.info('HealthMonitor', 'System health monitoring started');
  };

  const stopMonitoring = () => {
    if (!isMonitoring) return;
    
    setIsMonitoring(false);
    if (monitoringInterval) {
      clearInterval(monitoringInterval);
      setMonitoringInterval(null);
    }
    logger.info('HealthMonitor', 'System health monitoring stopped');
  };

  // Auto-start monitoring
  useEffect(() => {
    startMonitoring();
    return () => stopMonitoring();
  }, []);

  // Auto-recovery para estados críticos
  useEffect(() => {
    if (health.overall === 'critical') {
      logger.warn('HealthMonitor', 'Critical system state detected, attempting recovery');
      
      // Limpiar logs para reducir memoria
      if (health.errors > 20) {
        logger.clearLogs();
      }
      
      // Re-check después de limpieza
      setTimeout(runHealthCheck, 5000);
    }
  }, [health.overall]);

  return (
    <HealthContext.Provider value={{
      health,
      isMonitoring,
      startMonitoring,
      stopMonitoring,
      runHealthCheck
    }}>
      {children}
    </HealthContext.Provider>
  );
};
