
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Award, Target, TrendingUp, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface PAESPlanMetricsProps {
  metrics: {
    totalPAESQuestions: number;
    correctPAESAnswers: number;
    paesAccuracy: number;
    estimatedReadiness: number;
  };
  loading?: boolean;
}

export const PAESPlanMetrics: React.FC<PAESPlanMetricsProps> = ({
  metrics,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getReadinessColor = (readiness: number) => {
    if (readiness >= 80) return 'text-green-600';
    if (readiness >= 60) return 'text-blue-600';
    if (readiness >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getReadinessLabel = (readiness: number) => {
    if (readiness >= 80) return 'Listo';
    if (readiness >= 60) return 'Avanzado';
    if (readiness >= 40) return 'En progreso';
    return 'Inicial';
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Total Preguntas PAES */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0 }}
      >
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-blue-700">Preguntas Oficiales</span>
            </div>
            <div className="text-2xl font-bold text-blue-800">
              {metrics.totalPAESQuestions}
            </div>
            <p className="text-xs text-blue-600">resueltas</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Precisión PAES */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-green-600" />
              <span className="text-xs text-green-700">Precisión PAES</span>
            </div>
            <div className="text-2xl font-bold text-green-800">
              {Math.round(metrics.paesAccuracy)}%
            </div>
            <p className="text-xs text-green-600">
              {metrics.correctPAESAnswers}/{metrics.totalPAESQuestions}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Preparación Estimada */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <span className="text-xs text-purple-700">Preparación</span>
            </div>
            <div className={`text-2xl font-bold ${getReadinessColor(metrics.estimatedReadiness)}`}>
              {metrics.estimatedReadiness}%
            </div>
            <Badge variant="outline" className="text-xs mt-1">
              {getReadinessLabel(metrics.estimatedReadiness)}
            </Badge>
          </CardContent>
        </Card>
      </motion.div>

      {/* Progreso Visual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <span className="text-xs text-orange-700">Progreso del Plan</span>
            </div>
            <div className="space-y-2">
              <Progress 
                value={metrics.estimatedReadiness} 
                className="h-2"
              />
              <p className="text-xs text-orange-600">
                Basado en ejercicios oficiales
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
