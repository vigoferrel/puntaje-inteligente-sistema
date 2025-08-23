
import React, { useState, useEffect, useRef } from 'react';
import { RealTimePerformanceDashboard } from './RealTimePerformanceDashboard';
import { AlertsPanel, IntelligentAlertsEngine } from './IntelligentAlertsEngine';
import { usePredictiveAnalyzer } from './PredictiveAnalyzer';
import { useAutoOptimization } from './AutoOptimizationEngine';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Brain, Zap, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface PerformanceOrchestratorProps {
  enableAutoOptimization?: boolean;
  enablePredictiveAnalytics?: boolean;
  enableIntelligentAlerts?: boolean;
  enableRealTimeDashboard?: boolean;
}

export const PerformanceOrchestrator: React.FC<PerformanceOrchestratorProps> = ({
  enableAutoOptimization = true,
  enablePredictiveAnalytics = true,
  enableIntelligentAlerts = true,
  enableRealTimeDashboard = true
}) => {
  const [systemStatus, setSystemStatus] = useState<'healthy' | 'warning' | 'critical'>('healthy');
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);
  
  const alertsEngine = IntelligentAlertsEngine.getInstance();
  const { addMetric, recordBehavior, predictions, behaviorPatterns, getReport } = usePredictiveAnalyzer();
  const { updateMetrics, forceOptimization, getStatus } = useAutoOptimization();
  
  const metricsIntervalRef = useRef<NodeJS.Timeout>();
  const lastReportRef = useRef<any>(null);

  // Recolección de métricas en tiempo real
  useEffect(() => {
    if (!isMonitoring) return;

    const collectMetrics = () => {
      const memory = (performance as any).memory;
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      const metrics = {
        memory: memory ? (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100 : 0,
        responseTime: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
        renderCount: document.querySelectorAll('[data-react-component]').length,
        errorRate: getErrorRate(),
        componentCount: document.querySelectorAll('[data-testid]').length
      };

      // Enviar a sistemas individuales
      if (enablePredictiveAnalytics) {
        addMetric('memory', metrics.memory);
        addMetric('responseTime', metrics.responseTime);
        addMetric('renderCount', metrics.renderCount);
        addMetric('errorRate', metrics.errorRate);
      }

      if (enableIntelligentAlerts) {
        alertsEngine.analyzeMetrics({
          memory: metrics.memory,
          responseTime: metrics.responseTime,
          errorRate: metrics.errorRate,
          renderTime: metrics.responseTime
        });
      }

      if (enableAutoOptimization) {
        updateMetrics({
          memoryUsage: metrics.memory,
          responseTime: metrics.responseTime,
          renderCount: metrics.renderCount,
          errorRate: metrics.errorRate,
          componentCount: metrics.componentCount,
          cacheHitRate: getCacheHitRate()
        });
      }

      // Determinar estado del sistema
      updateSystemStatus(metrics);
    };

    collectMetrics(); // Inicial
    metricsIntervalRef.current = setInterval(collectMetrics, 2000);

    return () => {
      if (metricsIntervalRef.current) {
        clearInterval(metricsIntervalRef.current);
      }
    };
  }, [isMonitoring, enablePredictiveAnalytics, enableIntelligentAlerts, enableAutoOptimization, addMetric, updateMetrics, alertsEngine]);

  // Monitoreo de comportamiento del usuario
  useEffect(() => {
    if (!enablePredictiveAnalytics) return;

    const handleNavigation = () => {
      recordBehavior('navigation', window.location.pathname);
    };

    const handleInteraction = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.role === 'button') {
        recordBehavior('interaction', `click:${target.className.split(' ')[0]}`);
      }
    };

    window.addEventListener('popstate', handleNavigation);
    document.addEventListener('click', handleInteraction);

    return () => {
      window.removeEventListener('popstate', handleNavigation);
      document.removeEventListener('click', handleInteraction);
    };
  }, [enablePredictiveAnalytics, recordBehavior]);

  // Generación de reportes periódicos
  useEffect(() => {
    const generateReport = () => {
      if (enablePredictiveAnalytics) {
        const report = getReport();
        lastReportRef.current = report;
        
        console.log('📊 Reporte de Performance:', {
          timestamp: new Date().toISOString(),
          systemStatus,
          predictions: Object.keys(predictions).length,
          behaviorPatterns: behaviorPatterns.length,
          ...report
        });
      }
    };

    const reportInterval = setInterval(generateReport, 60000); // Cada minuto
    generateReport(); // Inicial

    return () => clearInterval(reportInterval);
  }, [systemStatus, predictions, behaviorPatterns, getReport, enablePredictiveAnalytics]);

  const getErrorRate = (): number => {
    // Simular tasa de errores basada en console.error
    const errors = (window as any).performanceErrors || 0;
    return Math.min(errors * 0.1, 5);
  };

  const getCacheHitRate = (): number => {
    // Simular hit rate del cache
    const cacheHits = (window as any).cacheHits || 85;
    return cacheHits + Math.random() * 10 - 5;
  };

  const updateSystemStatus = (metrics: any) => {
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    
    if (metrics.memory > 85 || metrics.errorRate > 3 || metrics.responseTime > 500) {
      status = 'critical';
    } else if (metrics.memory > 70 || metrics.errorRate > 1 || metrics.responseTime > 200) {
      status = 'warning';
    }
    
    setSystemStatus(status);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400 bg-green-500/20';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20';
      case 'critical': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusIcon = () => {
    switch (systemStatus) {
      case 'healthy': return '✅';
      case 'warning': return '⚠️';
      case 'critical': return '🚨';
      default: return '⚪';
    }
  };

  const handleForceOptimization = () => {
    if (enableAutoOptimization) {
      forceOptimization();
    }
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
  };

  const toggleDashboard = () => {
    setShowDashboard(!showDashboard);
  };

  // Panel de control flotante
  const ControlPanel = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed top-4 left-4 z-40 bg-black/90 backdrop-blur-xl rounded-lg border border-cyan-500/30 p-4"
    >
      <div className="flex items-center gap-3 mb-3">
        <Activity className="w-5 h-5 text-cyan-400" />
        <h3 className="font-semibold text-white">Performance Control</h3>
        <Badge className={getStatusColor(systemStatus)} variant="outline">
          {getStatusIcon()} {systemStatus.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div className="bg-gray-800/50 p-2 rounded">
          <div className="text-gray-400">Predictions</div>
          <div className="text-white font-mono">{Object.keys(predictions).length}</div>
        </div>
        <div className="bg-gray-800/50 p-2 rounded">
          <div className="text-gray-400">Patterns</div>
          <div className="text-white font-mono">{behaviorPatterns.length}</div>
        </div>
      </div>

      <div className="space-y-2">
        <Button
          onClick={toggleMonitoring}
          variant={isMonitoring ? "default" : "outline"}
          size="sm"
          className="w-full text-xs"
        >
          {isMonitoring ? '⏸️ Pausar' : '▶️ Reanudar'} Monitoreo
        </Button>
        
        {enableRealTimeDashboard && (
          <Button
            onClick={toggleDashboard}
            variant={showDashboard ? "default" : "outline"}
            size="sm"
            className="w-full text-xs"
          >
            <Settings className="w-3 h-3 mr-1" />
            {showDashboard ? 'Ocultar' : 'Mostrar'} Dashboard
          </Button>
        )}

        {enableAutoOptimization && (
          <Button
            onClick={handleForceOptimization}
            variant="outline"
            size="sm"
            className="w-full text-xs text-green-400 border-green-400 hover:bg-green-400/10"
          >
            <Zap className="w-3 h-3 mr-1" />
            Optimizar Ahora
          </Button>
        )}
      </div>

      {/* Predicciones rápidas */}
      {enablePredictiveAnalytics && Object.keys(predictions).length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="text-xs text-gray-400 mb-2">Predicciones:</div>
          {Object.entries(predictions).slice(0, 2).map(([key, prediction]) => (
            <div key={key} className="flex justify-between text-xs mb-1">
              <span className="text-gray-300 capitalize">{key}:</span>
              <span className={`font-mono ${
                prediction.trend === 'increasing' ? 'text-red-400' : 
                prediction.trend === 'decreasing' ? 'text-green-400' : 'text-gray-400'
              }`}>
                {prediction.trend === 'increasing' ? '📈' : 
                 prediction.trend === 'decreasing' ? '📉' : '➡️'}
                {(prediction.confidence * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );

  return (
    <>
      <ControlPanel />
      
      {enableIntelligentAlerts && <AlertsPanel />}
      
      {enableRealTimeDashboard && showDashboard && <RealTimePerformanceDashboard />}
    </>
  );
};

export default PerformanceOrchestrator;
