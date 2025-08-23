
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertTriangle, CheckCircle, XCircle, Zap } from 'lucide-react';
import { neuralTester } from '../testing/NeuralDimensionTester';

interface HealthStatus {
  overall: 'excellent' | 'good' | 'warning' | 'critical';
  dimensions: Record<string, {
    status: 'healthy' | 'degraded' | 'error';
    lastCheck: number;
    issues: string[];
  }>;
  performance: {
    loadTime: number;
    memoryUsage: number;
    errorRate: number;
  };
  alerts: Array<{
    id: string;
    type: 'info' | 'warning' | 'error';
    message: string;
    timestamp: number;
  }>;
}

export const RealTimeHealthMonitor: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus>({
    overall: 'excellent',
    dimensions: {},
    performance: { loadTime: 0, memoryUsage: 0, errorRate: 0 },
    alerts: []
  });
  
  const [isVisible, setIsVisible] = useState(false);
  const [autoMode, setAutoMode] = useState(true);

  useEffect(() => {
    const runHealthCheck = async () => {
      try {
        const testResults = await neuralTester.runFullTestSuite();
        const summary = neuralTester.getTestSummary();
        
        const dimensions: HealthStatus['dimensions'] = {};
        testResults.forEach(result => {
          dimensions[result.dimensionId] = {
            status: result.passed ? 'healthy' : result.errors.length > 0 ? 'error' : 'degraded',
            lastCheck: Date.now(),
            issues: [...result.errors, ...result.warnings]
          };
        });

        const overall: HealthStatus['overall'] = 
          summary.successRate > 95 ? 'excellent' :
          summary.successRate > 80 ? 'good' :
          summary.successRate > 60 ? 'warning' : 'critical';

        const newAlerts = testResults
          .filter(r => !r.passed)
          .map(r => ({
            id: `alert-${r.dimensionId}-${Date.now()}`,
            type: 'error' as const,
            message: `Dimensión ${r.dimensionId}: ${r.errors[0] || 'Error desconocido'}`,
            timestamp: Date.now()
          }));

        setHealthStatus(prev => ({
          overall,
          dimensions,
          performance: {
            loadTime: summary.avgLoadTime,
            memoryUsage: testResults[0]?.performance.memoryUsage || 0,
            errorRate: ((summary.total - summary.passed) / summary.total) * 100
          },
          alerts: [...prev.alerts, ...newAlerts].slice(-10) // Mantener últimas 10
        }));

        console.log('🏥 Health check completado:', {
          overall,
          successRate: summary.successRate,
          dimensionsChecked: Object.keys(dimensions).length
        });

      } catch (error) {
        console.error('❌ Error en health check:', error);
        setHealthStatus(prev => ({
          ...prev,
          overall: 'critical',
          alerts: [...prev.alerts, {
            id: `error-${Date.now()}`,
            type: 'error',
            message: 'Error crítico en monitoreo del sistema',
            timestamp: Date.now()
          }]
        }));
      }
    };

    if (autoMode) {
      runHealthCheck(); // Inicial
      const interval = setInterval(runHealthCheck, 30000); // Cada 30 segundos
      return () => clearInterval(interval);
    }
  }, [autoMode]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'good':
      case 'degraded':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      case 'critical':
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
      case 'healthy':
        return 'from-green-500 to-emerald-500';
      case 'good':
      case 'degraded':
        return 'from-yellow-500 to-amber-500';
      case 'warning':
        return 'from-orange-500 to-red-500';
      case 'critical':
      case 'error':
        return 'from-red-500 to-pink-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  if (!isVisible) {
    return (
      <motion.button
        onClick={() => setIsVisible(true)}
        className="fixed top-4 right-4 z-50 bg-black/80 backdrop-blur-xl rounded-full p-3 border border-cyan-500/30 hover:border-cyan-400/50 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Activity className="w-5 h-5 text-cyan-400" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, x: 50 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      className="fixed top-4 right-4 z-50 bg-black/90 backdrop-blur-xl rounded-lg border border-cyan-500/30 p-4 w-80 max-h-96 overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getStatusColor(healthStatus.overall)} animate-pulse`} />
          <h3 className="font-bold text-white">Health Monitor</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setAutoMode(!autoMode)}
            className={`p-1 rounded ${autoMode ? 'text-green-400' : 'text-gray-400'}`}
          >
            <Zap className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Overall Status */}
      <div className={`rounded-lg p-3 mb-4 bg-gradient-to-r ${getStatusColor(healthStatus.overall)}/10 border border-white/10`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(healthStatus.overall)}
            <span className="text-white font-medium">Sistema Neural</span>
          </div>
          <span className="text-white/80 text-sm capitalize">{healthStatus.overall}</span>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-white/5 rounded p-2 text-center">
          <div className="text-xs text-gray-400">Load Time</div>
          <div className="text-white font-mono text-sm">{healthStatus.performance.loadTime.toFixed(0)}ms</div>
        </div>
        <div className="bg-white/5 rounded p-2 text-center">
          <div className="text-xs text-gray-400">Memory</div>
          <div className="text-white font-mono text-sm">{healthStatus.performance.memoryUsage.toFixed(1)}MB</div>
        </div>
        <div className="bg-white/5 rounded p-2 text-center">
          <div className="text-xs text-gray-400">Errors</div>
          <div className="text-white font-mono text-sm">{healthStatus.performance.errorRate.toFixed(1)}%</div>
        </div>
      </div>

      {/* Dimensions Status */}
      <div className="space-y-2 mb-4">
        <h4 className="text-white/80 text-sm font-medium">Dimensiones</h4>
        {Object.entries(healthStatus.dimensions).map(([dimensionId, status]) => (
          <div key={dimensionId} className="flex items-center justify-between bg-white/5 rounded p-2">
            <div className="flex items-center gap-2">
              {getStatusIcon(status.status)}
              <span className="text-white/90 text-sm capitalize">{dimensionId.replace('_', ' ')}</span>
            </div>
            <span className="text-xs text-gray-400">
              {new Date(status.lastCheck).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>

      {/* Recent Alerts */}
      {healthStatus.alerts.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-white/80 text-sm font-medium">Alertas Recientes</h4>
          <AnimatePresence>
            {healthStatus.alerts.slice(-3).map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-500/10 border border-red-500/20 rounded p-2"
              >
                <div className="flex items-center gap-2">
                  <XCircle className="w-3 h-3 text-red-400" />
                  <span className="text-red-200 text-xs">{alert.message}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};
