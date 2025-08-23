import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Award,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { PAESUnifiedMetrics, PAESTestPerformance } from '@/hooks/use-paes-unified-dashboard-optimized';

interface PAESGlobalMetricsProps {
  metrics: PAESUnifiedMetrics;
  testPerformances: PAESTestPerformance[];
  className?: string;
}

export const PAESGlobalMetrics: React.FC<PAESGlobalMetricsProps> = ({
  metrics,
  testPerformances,
  className
}) => {
  const getReadinessColor = (level: string) => {
    switch (level) {
      case 'EXCELENTE': return 'text-green-400 bg-green-600/10 border-green-600/30';
      case 'BUENO': return 'text-blue-400 bg-blue-600/10 border-blue-600/30';
      case 'REGULAR': return 'text-yellow-400 bg-yellow-600/10 border-yellow-600/30';
      case 'REQUIERE_REFUERZO': return 'text-red-400 bg-red-600/10 border-red-600/30';
      default: return 'text-gray-400 bg-gray-600/10 border-gray-600/30';
    }
  };

  const getReadinessIcon = (level: string) => {
    switch (level) {
      case 'EXCELENTE': return CheckCircle;
      case 'BUENO': return Target;
      case 'REGULAR': return Clock;
      case 'REQUIERE_REFUERZO': return AlertTriangle;
      default: return Target;
    }
  };

  const ReadinessIcon = getReadinessIcon(metrics.readinessLevel);

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Header con puntaje global */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-700/50 rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Puntaje PAES Proyectado</h2>
            <p className="text-blue-200">Basado en tu rendimiento actual</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-white">{metrics.globalScore}</div>
            <div className="text-sm text-blue-200">/ 850 pts</div>
          </div>
        </div>
        
        <Progress 
          value={(metrics.globalScore - 150) / 7} 
          className="h-3 mb-2" 
        />
        
        <div className="flex justify-between text-xs text-blue-200">
          <span>150</span>
          <span>500</span>
          <span>850</span>
        </div>
      </motion.div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${getReadinessColor(metrics.readinessLevel)}`}>
                  <ReadinessIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Nivel de Preparación</p>
                  <p className="font-bold text-white">{metrics.readinessLevel.replace('_', ' ')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-600/10 border border-green-600/30">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Confianza</p>
                  <p className="font-bold text-white">{metrics.confidenceLevel}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-purple-600/10 border border-purple-600/30">
                  <Clock className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Horas de Estudio</p>
                  <p className="font-bold text-white">{metrics.studyTimeNeeded}h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-yellow-600/10 border border-yellow-600/30">
                  <Award className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Probabilidad Admisión</p>
                  <p className="font-bold text-white">{Math.round(metrics.projectedAdmissionChance)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tests prioritarios */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-400" />
              Próximas Prioridades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Acción Recomendada</span>
                <Badge variant="outline" className="text-blue-400 border-blue-600/50">
                  {metrics.nextRecommendedAction}
                </Badge>
              </div>
              
              {metrics.priorityTests.length > 0 && (
                <div>
                  <p className="text-gray-400 text-sm mb-2">Tests que requieren atención:</p>
                  <div className="flex flex-wrap gap-2">
                    {metrics.priorityTests.map((test, index) => (
                      <Badge 
                        key={test} 
                        variant="outline" 
                        className="text-yellow-400 border-yellow-600/50"
                      >
                        {index + 1}. {test}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Resumen de tests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Resumen por Prueba</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testPerformances.map((performance, index) => (
                <motion.div
                  key={performance.testId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{performance.testName}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-400">
                        {performance.correctAnswers}/{performance.totalQuestions} correctas
                      </span>
                      <span className="text-sm text-blue-400">
                        {Math.round(performance.accuracy)}% precisión
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">
                      {performance.projectedScore}
                    </div>
                    <div className="text-xs text-gray-400">pts proyectados</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
