
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface PAESSubject {
  id: string;
  name: string;
  progress: number;
  projectedScore: number;
  criticalAreas: number;
  strengths: number;
}

interface BalancedPAESMetricsProps {
  subjects: PAESSubject[];
}

export const BalancedPAESMetrics: React.FC<BalancedPAESMetricsProps> = ({ subjects }) => {
  const calculateGlobalMetrics = () => {
    const totalProgress = subjects.reduce((sum, subject) => sum + subject.progress, 0);
    const averageProgress = Math.round(totalProgress / subjects.length);
    
    const totalScore = subjects.reduce((sum, subject) => sum + subject.projectedScore, 0);
    const averageScore = Math.round(totalScore / subjects.length);
    
    const totalCritical = subjects.reduce((sum, subject) => sum + subject.criticalAreas, 0);
    const totalStrengths = subjects.reduce((sum, subject) => sum + subject.strengths, 0);
    
    return {
      averageProgress,
      averageScore,
      totalCritical,
      totalStrengths
    };
  };

  const metrics = calculateGlobalMetrics();

  const metricCards = [
    {
      title: 'Progreso General',
      value: `${metrics.averageProgress}%`,
      color: 'text-cyan-400',
      description: 'Promedio entre las 5 pruebas'
    },
    {
      title: 'Puntaje Proyectado',
      value: metrics.averageScore,
      color: 'text-green-400',
      description: 'Promedio estimado PAES'
    },
    {
      title: 'Áreas Críticas',
      value: metrics.totalCritical,
      color: 'text-orange-400',
      description: 'Total a reforzar'
    },
    {
      title: 'Fortalezas',
      value: metrics.totalStrengths,
      color: 'text-yellow-400',
      description: 'Total desarrolladas'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {metricCards.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${metric.color}`}>
                {metric.value}
              </div>
              <div className="text-white/70 text-sm font-medium mt-1">
                {metric.title}
              </div>
              <div className="text-white/50 text-xs mt-1">
                {metric.description}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
