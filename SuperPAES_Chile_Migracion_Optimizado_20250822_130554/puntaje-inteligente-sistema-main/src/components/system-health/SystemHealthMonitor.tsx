/* eslint-disable react-refresh/only-export-components */

import React, { useState, useEffect } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion } from 'framer-motion';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { Brain, Zap, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

interface SystemHealth {
  status: 'optimal' | 'stable' | 'degraded' | 'critical';
  metrics: {
    memoryUsage: number;
    renderTime: number;
    errorCount: number;
    neuralEfficiency: number;
  };
  lastCheck: number;
}

export const SystemHealthMonitor: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth>({
    status: 'optimal',
    metrics: {
      memoryUsage: 0,
      renderTime: 0,
      errorCount: 0,
      neuralEfficiency: 100
    },
    lastCheck: Date.now()
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkSystemHealth = () => {
      const now = Date.now();
      const memory = (performance as unknown).memory;
      
      const newMetrics = {
        memoryUsage: memory ? memory.usedJSHeapSize / (1024 * 1024) : 0, // MB
        renderTime: performance.now() % 100, // Simulated
        errorCount: 0, // Reset cada check
        neuralEfficiency: Math.max(60, 100 - (memory ? memory.usedJSHeapSize / (10 * 1024 * 1024) : 0))
      };

      let status: SystemHealth['status'] = 'optimal';
      
      if (newMetrics.memoryUsage > 150) status = 'critical';
      else if (newMetrics.memoryUsage > 100) status = 'degraded';
      else if (newMetrics.memoryUsage > 50) status = 'stable';

      setHealth({
        status,
        metrics: newMetrics,
        lastCheck: now
      });
    };

    checkSystemHealth();
    const interval = setInterval(checkSystemHealth, 10000); // Cada 10 segundos

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (health.status) {
      case 'optimal': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'stable': return <Zap className="w-4 h-4 text-blue-400" />;
      case 'degraded': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'critical': return <RefreshCw className="w-4 h-4 text-red-400 animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (health.status) {
      case 'optimal': return 'from-green-500 to-emerald-500';
      case 'stable': return 'from-blue-500 to-cyan-500';
      case 'degraded': return 'from-yellow-500 to-orange-500';
      case 'critical': return 'from-red-500 to-pink-500';
    }
  };

  if (!isVisible) {
    return (
      <motion.button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 z-50 bg-black/80 backdrop-blur-xl rounded-full p-3 border border-cyan-500/30"
        whileHover={{ scale: 1.1 }}
      >
        <Brain className="w-5 h-5 text-cyan-400" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, x: -50 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      className="fixed bottom-4 left-4 z-50 w-72"
    >
      <Card className="bg-black/90 backdrop-blur-xl border-cyan-500/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="text-white font-semibold text-sm">Sistema Neural</span>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white"
            >
              âœ•
            </button>
          </div>

          <Badge className={`bg-gradient-to-r ${getStatusColor()} mb-3 w-full justify-center`}>
            {health.status.toUpperCase()}
          </Badge>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Memoria:</span>
              <span className="text-white">{health.metrics.memoryUsage.toFixed(1)} MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Eficiencia:</span>
              <span className="text-cyan-400">{health.metrics.neuralEfficiency.toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Ãšltima verificaciÃ³n:</span>
              <span className="text-green-400">
                {Math.floor((Date.now() - health.lastCheck) / 1000)}s
              </span>
            </div>
          </div>

          {/* Barra de eficiencia neural */}
          <div className="mt-3">
            <div className="text-xs text-gray-400 mb-1">Eficiencia Neural</div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className={`h-full bg-gradient-to-r ${getStatusColor()} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${health.metrics.neuralEfficiency}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

