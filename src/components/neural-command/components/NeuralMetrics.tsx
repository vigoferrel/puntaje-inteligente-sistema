
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Target, Zap, Users } from 'lucide-react';
import { NeuralMetrics as NeuralMetricsType } from '../config/neuralTypes';

interface NeuralMetricsProps {
  metrics: NeuralMetricsType;
}

export const NeuralMetrics: React.FC<NeuralMetricsProps> = ({ metrics }) => {
  const metricCards = [
    {
      icon: Brain,
      value: Math.round(metrics.neural_efficiency),
      label: 'Eficiencia Neural',
      color: 'text-purple-400'
    },
    {
      icon: Target,
      value: Math.round(metrics.adaptive_learning_score),
      label: 'Aprendizaje Adaptativo',
      color: 'text-green-400'
    },
    {
      icon: Zap,
      value: Math.round(metrics.cross_pollination_rate),
      label: 'Cross-Pollination',
      color: 'text-yellow-400'
    },
    {
      icon: Users,
      value: Math.round(metrics.user_experience_harmony),
      label: 'Armonía UX',
      color: 'text-blue-400'
    }
  ];

  return (
    <motion.div 
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {metricCards.map((metric, index) => (
        <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <metric.icon className={`w-8 h-8 mx-auto mb-2 ${metric.color}`} />
            <div className="text-2xl font-bold text-white font-poppins">{metric.value}%</div>
            <div className="text-xs text-white/70 font-poppins">{metric.label}</div>
          </CardContent>
        </Card>
      ))}
    </motion.div>
  );
};
