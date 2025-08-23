
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { RealNeuralMetrics } from '@/hooks/useRealNeuralMetrics';

interface NeuralMetricsProps {
  metrics: RealNeuralMetrics;
}

export const NeuralMetrics: React.FC<NeuralMetricsProps> = ({ metrics }) => {
  const metricConfigs = [
    {
      key: 'neural_efficiency' as keyof RealNeuralMetrics,
      label: 'Eficiencia Neural',
      color: 'from-cyan-500 to-blue-600',
      icon: '🧠'
    },
    {
      key: 'universe_exploration_depth' as keyof RealNeuralMetrics,
      label: 'Exploración Universal',
      color: 'from-purple-500 to-pink-600',
      icon: '🌌'
    },
    {
      key: 'paes_simulation_accuracy' as keyof RealNeuralMetrics,
      label: 'Precisión PAES',
      color: 'from-red-500 to-orange-600',
      icon: '🎯'
    },
    {
      key: 'gamification_engagement' as keyof RealNeuralMetrics,
      label: 'Engagement',
      color: 'from-green-500 to-emerald-600',
      icon: '🎮'
    }
  ];

  const getTrendIcon = (value: number) => {
    if (value >= 80) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (value >= 60) return <Minus className="w-4 h-4 text-yellow-400" />;
    return <TrendingDown className="w-4 h-4 text-red-400" />;
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {metricConfigs.map((config, index) => {
        const value = Math.round(metrics[config.key]);
        
        return (
          <motion.div
            key={String(config.key)}
            className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{config.icon}</span>
              {getTrendIcon(value)}
            </div>
            
            <h3 className="text-white font-semibold mb-2">{config.label}</h3>
            
            <div className="flex items-baseline space-x-2 mb-3">
              <span className="text-3xl font-bold text-white">{value}</span>
              <span className="text-sm text-gray-300">%</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full bg-gradient-to-r ${config.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            </div>
            
            <div className="mt-2 text-xs text-gray-400">
              Métrica calculada en tiempo real
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
