
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Brain, 
  Target, 
  TrendingUp,
  Zap,
  Clock
} from 'lucide-react';

interface MetricData {
  label: string;
  value: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  unit: string;
  icon: React.ComponentType<any>;
  color: string;
}

export const RealMetricsWidget: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricData[]>([
    {
      label: 'Rendimiento Neural',
      value: 87,
      target: 90,
      trend: 'up',
      unit: '%',
      icon: Brain,
      color: 'from-purple-500 to-pink-500'
    },
    {
      label: 'Progreso PAES',
      value: 72,
      target: 100,
      trend: 'up',
      unit: '%',
      icon: Target,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Actividad Diaria',
      value: 45,
      target: 60,
      trend: 'stable',
      unit: 'min',
      icon: Activity,
      color: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Eficiencia',
      value: 94,
      target: 95,
      trend: 'up',
      unit: '%',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500'
    }
  ]);

  useEffect(() => {
    // Simular actualización de métricas en tiempo real
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(0, Math.min(100, metric.value + (Math.random() - 0.5) * 2))
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          Métricas en Tiempo Real
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const progressPercentage = (metric.value / metric.target) * 100;
          
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg bg-gradient-to-r ${metric.color}`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/90 text-sm font-medium">
                    {metric.label}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">
                    {Math.round(metric.value)}{metric.unit}
                  </span>
                  <Badge 
                    className={`text-xs ${
                      metric.trend === 'up' 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                        : metric.trend === 'down'
                        ? 'bg-red-500/20 text-red-400 border-red-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    }`}
                  >
                    {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                  </Badge>
                </div>
              </div>
              
              <Progress 
                value={progressPercentage} 
                className="h-2"
                indicatorClassName={`bg-gradient-to-r ${metric.color}`}
              />
              
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>Meta: {metric.target}{metric.unit}</span>
                <span>{Math.round(progressPercentage)}% completado</span>
              </div>
            </motion.div>
          );
        })}

        {/* Tiempo de sesión actual */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pt-4 border-t border-white/10"
        >
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-white/70">
              <Clock className="w-4 h-4" />
              Sesión actual
            </div>
            <div className="text-white font-medium">
              {new Date().toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};
