
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Brain, Zap, Settings, Minimize2, Maximize2, X } from 'lucide-react';
import { usePredictiveAnalyzer } from './PredictiveAnalyzer';
import { useAutoOptimization } from './AutoOptimizationEngine';

interface MinimizablePerformanceOrchestratorProps {
  enableAutoOptimization?: boolean;
  enablePredictiveAnalytics?: boolean;
  enableIntelligentAlerts?: boolean;
  enableRealTimeDashboard?: boolean;
}

export const MinimizablePerformanceOrchestrator: React.FC<MinimizablePerformanceOrchestratorProps> = ({
  enableAutoOptimization = true,
  enablePredictiveAnalytics = true,
  enableIntelligentAlerts = true,
  enableRealTimeDashboard = true
}) => {
  const [systemStatus, setSystemStatus] = useState<'healthy' | 'warning' | 'critical'>('healthy');
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [isMinimized, setIsMinimized] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  
  const { addMetric, recordBehavior, predictions, behaviorPatterns, getReport } = usePredictiveAnalyzer();
  const { updateMetrics, forceOptimization, getStatus } = useAutoOptimization();
  
  const metricsIntervalRef = useRef<NodeJS.Timeout>();

  // Auto-minimizar después de 12 segundos
  useEffect(() => {
    if (!isMinimized && isVisible) {
      const timer = setTimeout(() => {
        setIsMinimized(true);
      }, 12000);

      return () => clearTimeout(timer);
    }
  }, [isMinimized, isVisible]);

  // Recolección de métricas simplificada
  useEffect(() => {
    if (!isMonitoring) return;

    const collectMetrics = () => {
      const memory = (performance as any).memory;
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      const metrics = {
        memory: memory ? (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100 : 0,
        responseTime: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
        renderCount: document.querySelectorAll('[data-react-component]').length || 10,
        errorRate: getErrorRate(),
        componentCount: document.querySelectorAll('[data-testid]').length || 5
      };

      // Determinar estado del sistema
      updateSystemStatus(metrics);

      if (enableAutoOptimization) {
        updateMetrics({
          memoryUsage: metrics.memory,
          responseTime: metrics.responseTime,
          renderCount: metrics.renderCount,
          errorRate: metrics.errorRate,
          componentCount: metrics.componentCount,
          cacheHitRate: 85 + Math.random() * 10
        });
      }
    };

    collectMetrics();
    metricsIntervalRef.current = setInterval(collectMetrics, 5000);

    return () => {
      if (metricsIntervalRef.current) {
        clearInterval(metricsIntervalRef.current);
      }
    };
  }, [isMonitoring, enableAutoOptimization, updateMetrics]);

  const getErrorRate = (): number => {
    return Math.random() * 2; // Simular tasa baja de errores
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

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-4 left-4 z-20"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {isMinimized ? (
        // Versión minimizada - ultra compacta
        <motion.div
          className="bg-black/60 backdrop-blur-sm rounded-full p-2 cursor-pointer border border-cyan-500/20"
          onClick={() => setIsMinimized(false)}
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,0,0,0.8)' }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center gap-1">
            <Activity className="w-4 h-4 text-cyan-400" />
            <Badge 
              variant="outline"
              className={`${getStatusColor(systemStatus)} text-xs px-1 py-0 h-4 border-none`}
            >
              {getStatusIcon()}
            </Badge>
          </div>
        </motion.div>
      ) : (
        // Versión expandida
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-black/80 backdrop-blur-xl rounded-lg border border-cyan-500/30 p-4 max-w-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h3 className="font-semibold text-white text-sm">Performance</h3>
              </div>
              
              <div className="flex items-center gap-1">
                <Badge 
                  variant={systemStatus === 'healthy' ? "default" : "destructive"}
                  className={`${getStatusColor(systemStatus)} text-xs`}
                >
                  {getStatusIcon()}
                </Badge>
                
                <Button
                  onClick={() => setIsMinimized(true)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white h-6 w-6 p-0"
                >
                  <Minimize2 className="w-3 h-3" />
                </Button>
                
                <Button
                  onClick={() => setIsVisible(false)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
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

            <div className="space-y-1">
              <Button
                onClick={() => setIsMonitoring(!isMonitoring)}
                variant={isMonitoring ? "default" : "outline"}
                size="sm"
                className="w-full text-xs h-7"
              >
                {isMonitoring ? '⏸️ Pausar' : '▶️ Reanudar'}
              </Button>
              
              {enableAutoOptimization && (
                <Button
                  onClick={() => forceOptimization()}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs h-7 text-green-400 border-green-400 hover:bg-green-400/10"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Optimizar
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
};
