/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { motion } from 'framer-motion';
import { TrendingUp, Target, Brain, Zap, Award, BookOpen } from 'lucide-react';
import { supabase } from '../../integrations/supabase/leonardo-auth-client';

interface HolographicMetric {
  id: string;
  title: string;
  value: number | string;
  unit?: string;
  icon: React.ComponentType<unknown>;
  color: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
}

interface HolographicMetricsDisplayProps {
  metrics: HolographicMetric[];
  layout?: 'grid' | 'circular' | 'linear';
}

export const HolographicMetricsDisplay: FC<HolographicMetricsDisplayProps> = ({
  metrics,
  layout = 'grid'
}) => {
  const defaultMetrics: HolographicMetric[] = [
    {
      id: 'progress',
      title: 'Progreso PAES',
      value: 72,
      unit: '%',
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      trend: 'up',
      trendValue: 12
    },
    {
      id: 'efficiency',
      title: 'Eficiencia Neural',
      value: 89,
      unit: '%',
      icon: Brain,
      color: 'from-cyan-500 to-blue-500',
      trend: 'up',
      trendValue: 8
    },
    {
      id: 'energy',
      title: 'EnergÃ­a de Estudio',
      value: 156,
      unit: 'pts',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      trend: 'stable'
    },
    {
      id: 'achievements',
      title: 'Logros Desbloqueados',
      value: 23,
      unit: '',
      icon: Award,
      color: 'from-green-500 to-emerald-500',
      trend: 'up',
      trendValue: 3
    },
    {
      id: 'reading',
      title: 'Velocidad Lectora',
      value: 245,
      unit: 'ppm',
      icon: BookOpen,
      color: 'from-indigo-500 to-purple-500',
      trend: 'up',
      trendValue: 15
    },
    {
      id: 'trend',
      title: 'Tendencia Global',
      value: 'â–² Excelente',
      icon: TrendingUp,
      color: 'from-pink-500 to-red-500',
      trend: 'up'
    }
  ];

  const displayMetrics = metrics.length > 0 ? metrics : defaultMetrics;

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return 'â†—ï¸';
      case 'down': return 'â†˜ï¸';
      case 'stable': return 'âž¡ï¸';
      default: return '';
    }
  };

  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      case 'stable': return 'text-yellow-400';
      default: return 'text-white/60';
    }
  };

  const getLayoutClasses = () => {
    switch (layout) {
      case 'grid':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
      case 'linear':
        return 'flex flex-wrap gap-4';
      case 'circular':
        return 'grid grid-cols-2 md:grid-cols-3 gap-4';
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    }
  };

  return (
    <div className={getLayoutClasses()}>
      {displayMetrics.map((metric, index) => (
        <motion.div
          key={metric.id}
          className="relative group"
          initial={{ opacity: 0, y: 20, rotateX: -10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: index * 0.1,
            ease: "easeOut"
          }}
          whileHover={{ 
            scale: 1.05, 
            rotateY: 5,
            z: 50
          }}
        >
          {/* Holographic base */}
          <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl border border-white/20 p-6 overflow-hidden">
            
            {/* Holographic shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
              animate={{ x: [-100, 300] }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: index * 0.5
              }}
            />

            {/* Background glow */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-20 rounded-2xl`}
              animate={{ 
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.02, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Icon container */}
            <div className="relative z-10 flex items-start justify-between mb-4">
              <motion.div
                className={`p-3 rounded-xl bg-gradient-to-r ${metric.color} shadow-lg`}
                animate={{ 
                  rotateY: [0, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <metric.icon className="w-6 h-6 text-white" />
              </motion.div>

              {/* Trend indicator */}
              {metric.trend && (
                <motion.div
                  className={`flex items-center gap-1 ${getTrendColor(metric.trend)}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <span className="text-sm">{getTrendIcon(metric.trend)}</span>
                  {metric.trendValue && (
                    <span className="text-xs font-medium">+{metric.trendValue}</span>
                  )}
                </motion.div>
              )}
            </div>

            {/* Metric value */}
            <div className="relative z-10">
              <motion.div
                className="text-3xl font-bold text-white mb-1"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                {metric.value}
                {metric.unit && (
                  <span className="text-lg text-white/60 ml-1">{metric.unit}</span>
                )}
              </motion.div>

              <motion.div
                className="text-sm text-white/70 font-medium"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.4 }}
              >
                {metric.title}
              </motion.div>
            </div>

            {/* Interactive holographic grid */}
            <div className="absolute bottom-0 left-0 right-0 h-16 opacity-30">
              <div className="grid grid-cols-8 gap-1 h-full p-2">
                {Array.from({ length: 32 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className={`bg-gradient-to-t ${metric.color} rounded-sm`}
                    animate={{ 
                      height: [
                        `${Math.random() * 60 + 20}%`,
                        `${Math.random() * 60 + 20}%`,
                        `${Math.random() * 60 + 20}%`
                      ]
                    }}
                    transition={{ 
                      duration: 2 + Math.random() * 2, 
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: Math.random() * 2
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Holographic projection effect */}
          <motion.div
            className="absolute -inset-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            animate={{ 
              background: [
                'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.2), transparent)',
                'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.2), transparent)',
                'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.2), transparent)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>
      ))}
    </div>
  );
};


