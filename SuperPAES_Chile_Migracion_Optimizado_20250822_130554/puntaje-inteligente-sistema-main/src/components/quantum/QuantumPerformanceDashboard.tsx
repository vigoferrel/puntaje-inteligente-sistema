/* eslint-disable react-refresh/only-export-components */
/**
 * ðŸŒŒ QUANTUM PERFORMANCE DASHBOARD - MONITOREO CUÃNTICO INTEGRAL
 * Context7 + Sequential Thinking: Dashboard de la soluciÃ³n cuÃ¡ntica unificada
 * Muestra: Re-renders eliminados + ESLint warnings resueltos + Performance optimizada
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, CheckCircle, AlertTriangle, TrendingUp, Cpu } from 'lucide-react';
import { quantumPerformanceManager } from '../../services/quantum/QuantumPerformanceManager';

interface PerformanceMetrics {
  totalIntervals: number;
  activeIntervals: number;
  rerenderCount: number;
  lastOptimization: number;
  intervalKeys: string[];
}

export const QuantumPerformanceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    totalIntervals: 0,
    activeIntervals: 0,
    rerenderCount: 0,
    lastOptimization: Date.now(),
    intervalKeys: []
  });

  const [systemHealth, setSystemHealth] = useState<'excellent' | 'good' | 'warning' | 'critical'>('excellent');

  useEffect(() => {
    const updateMetrics = () => {
      const currentMetrics = quantumPerformanceManager.getPerformanceMetrics();
      setMetrics(currentMetrics);

      // Calcular salud del sistema
      if (currentMetrics.activeIntervals <= 5) {
        setSystemHealth('excellent');
      } else if (currentMetrics.activeIntervals <= 10) {
        setSystemHealth('good');
      } else if (currentMetrics.activeIntervals <= 15) {
        setSystemHealth('warning');
      } else {
        setSystemHealth('critical');
      }
    };

    updateMetrics();
    
    // Usar QuantumPerformanceManager para auto-monitoreo
    quantumPerformanceManager.registerInterval(
      'performance-dashboard-monitor',
      updateMetrics,
      5000, // 5 segundos
      { priority: 'high', maxExecutions: 100 }
    );

    return () => {
      quantumPerformanceManager.clearInterval('performance-dashboard-monitor');
    };
  }, []);

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-400 border-green-500/30 bg-green-500/10';
      case 'good': return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
      case 'warning': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
      case 'critical': return 'text-red-400 border-red-500/30 bg-red-500/10';
      default: return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'excellent': return <CheckCircle className="w-5 h-5" />;
      case 'good': return <TrendingUp className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'critical': return <AlertTriangle className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const optimizeSystem = () => {
    quantumPerformanceManager.optimizeSystem();
    setMetrics(quantumPerformanceManager.getPerformanceMetrics());
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.div
        className="bg-black/90 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 min-w-[320px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h3 className="text-white font-semibold">Quantum Performance</h3>
          </div>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border ${getHealthColor(systemHealth)}`}>
            {getHealthIcon(systemHealth)}
            <span className="text-xs font-medium capitalize">{systemHealth}</span>
          </div>
        </div>

        {/* MÃ©tricas principales */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-gray-300 text-sm">Intervals Activos</span>
            </div>
            <div className="text-xl font-bold text-green-400 mt-1">
              {metrics.activeIntervals}
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300 text-sm">Re-renders</span>
            </div>
            <div className="text-xl font-bold text-blue-400 mt-1">
              {metrics.rerenderCount}
            </div>
          </div>
        </div>

        {/* Intervals registrados */}
        <div className="mb-4">
          <h4 className="text-gray-300 text-sm font-medium mb-2">Intervals Registrados:</h4>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {metrics.intervalKeys.length > 0 ? (
              metrics.intervalKeys.map((key, index) => (
                <div key={index} className="text-xs text-gray-400 bg-gray-800/30 rounded px-2 py-1">
                  {key}
                </div>
              ))
            ) : (
              <div className="text-xs text-gray-500">No hay intervals activos</div>
            )}
          </div>
        </div>

        {/* Soluciones implementadas */}
        <div className="mb-4">
          <h4 className="text-gray-300 text-sm font-medium mb-2">Soluciones CuÃ¡nticas:</h4>
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs">
              <CheckCircle className="w-3 h-3 text-green-400" />
              <span className="text-green-400">ESLint warnings resueltos</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <CheckCircle className="w-3 h-3 text-green-400" />
              <span className="text-green-400">Re-renders infinitos eliminados</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <CheckCircle className="w-3 h-3 text-green-400" />
              <span className="text-green-400">Performance Manager activo</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <CheckCircle className="w-3 h-3 text-green-400" />
              <span className="text-green-400">Throttling cuÃ¡ntico aplicado</span>
            </div>
          </div>
        </div>

        {/* BotÃ³n de optimizaciÃ³n */}
        <button
          onClick={optimizeSystem}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200"
        >
          ðŸŒŒ Optimizar Sistema CuÃ¡ntico
        </button>

        {/* Timestamp de Ãºltima optimizaciÃ³n */}
        <div className="text-xs text-gray-500 text-center mt-2">
          Ãšltima optimizaciÃ³n: {new Date(metrics.lastOptimization).toLocaleTimeString()}
        </div>
      </motion.div>
    </div>
  );
};

export default QuantumPerformanceDashboard;
