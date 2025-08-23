/* eslint-disable react-refresh/only-export-components */

import React, { useState, useEffect, memo } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Activity, 
  Zap, 
  Clock, 
  Users, 
  Target,
  Minimize2,
  Maximize2,
  RefreshCw
} from 'lucide-react';

interface RealTimeMetric {
  id: string;
  label: string;
  value: number;
  unit?: string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  icon: React.ComponentType<unknown>;
}

interface RealTimeMetricsProps {
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

export const RealTimeMetrics = memo<RealTimeMetricsProps>(({ 
  isMinimized = false, 
  onToggleMinimize 
}) => {
  const [metrics, setMetrics] = useState<RealTimeMetric[]>([
    {
      id: 'performance',
      label: 'Performance',
      value: 95,
      unit: '%',
      status: 'excellent',
      icon: Zap
    },
    {
      id: 'response',
      label: 'Tiempo Respuesta',
      value: 120,
      unit: 'ms',
      status: 'good',
      icon: Clock
    },
    {
      id: 'active_users',
      label: 'Usuarios Activos',
      value: 24,
      unit: '',
      status: 'good',
      icon: Users
    },
    {
      id: 'completion_rate',
      label: 'Tasa Completitud',
      value: 87,
      unit: '%',
      status: 'good',
      icon: Target
    }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  // SimulaciÃ³n de mÃ©tricas en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => {
        // VariaciÃ³n pequeÃ±a y realista
        const variation = (Math.random() - 0.5) * 0.1;
        let newValue = metric.value + (metric.value * variation);
        
        // Mantener en rangos realistas
        if (metric.unit === '%') {
          newValue = Math.max(0, Math.min(100, newValue));
        } else if (metric.id === 'response') {
          newValue = Math.max(50, Math.min(500, newValue));
        } else if (metric.id === 'active_users') {
          newValue = Math.max(1, Math.min(100, newValue));
        }

        // Determinar status basado en el valor
        let status: RealTimeMetric['status'] = 'good';
        if (metric.unit === '%') {
          if (newValue >= 90) status = 'excellent';
          else if (newValue >= 75) status = 'good';
          else if (newValue >= 60) status = 'warning';
          else status = 'critical';
        } else if (metric.id === 'response') {
          if (newValue <= 150) status = 'excellent';
          else if (newValue <= 250) status = 'good';
          else if (newValue <= 400) status = 'warning';
          else status = 'critical';
        }

        return {
          ...metric,
          value: Math.round(newValue * 10) / 10,
          status
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: RealTimeMetric['status']) => {
    switch (status) {
      case 'excellent': return 'bg-green-600';
      case 'good': return 'bg-blue-600';
      case 'warning': return 'bg-yellow-600';
      case 'critical': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simular tiempo de carga
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button
          onClick={onToggleMinimize}
          className="bg-black/80 backdrop-blur-md border border-cyan-500/30 text-cyan-400 hover:bg-black/90"
          size="sm"
        >
          <Activity className="w-4 h-4 mr-2" />
          MÃ©tricas
          <div className="ml-2 flex gap-1">
            {metrics.slice(0, 2).map((metric) => (
              <div
                key={metric.id}
                className={`w-2 h-2 rounded-full ${getStatusColor(metric.status)}`}
              />
            ))}
          </div>
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <Card className="w-80 bg-black/90 backdrop-blur-xl border-cyan-500/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              MÃ©tricas en Tiempo Real
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white h-6 w-6 p-0"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
              
              <Button
                onClick={onToggleMinimize}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white h-6 w-6 p-0"
              >
                <Minimize2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            <AnimatePresence>
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <metric.icon className="w-4 h-4 text-cyan-400" />
                    <span className="text-white text-sm">{metric.label}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono text-sm">
                      {metric.value}{metric.unit}
                    </span>
                    <Badge 
                      className={`${getStatusColor(metric.status)} text-white border-0 w-2 h-2 p-0 rounded-full`}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10">
            <div className="text-xs text-gray-400 flex items-center justify-between">
              <span>ActualizaciÃ³n automÃ¡tica cada 3s</span>
              <Badge variant="outline" className="text-cyan-400 border-cyan-400/30">
                En vivo
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

RealTimeMetrics.displayName = 'RealTimeMetrics';

