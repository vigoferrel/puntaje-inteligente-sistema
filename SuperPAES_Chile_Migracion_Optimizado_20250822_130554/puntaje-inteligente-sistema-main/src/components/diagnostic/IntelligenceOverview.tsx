/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { 
  TrendingUp, 
  Target, 
  Award, 
  AlertTriangle,
  Brain,
  BookOpen,
  Calendar,
  ChartBar
} from 'lucide-react';
import { TPAESPrueba, getPruebaDisplayName } from '../../types/system-types';
import { PAESTest } from '../../types/unified-diagnostic';

interface IntelligenceOverviewProps {
  tests: PAESTest[];
  baselineScores: Record<TPAESPrueba, number> | null;
  currentScores: Record<TPAESPrueba, number> | null;
  predictedScores: Record<TPAESPrueba, number> | null;
  nextRecommendedAssessment: string | null;
  onScheduleAssessment: () => void;
  onGenerateExercises: (prueba: TPAESPrueba) => void;
}

export const IntelligenceOverview: FC<IntelligenceOverviewProps> = ({
  tests,
  baselineScores,
  currentScores,
  predictedScores,
  nextRecommendedAssessment,
  onScheduleAssessment,
  onGenerateExercises
}) => {
  // Calcular mÃ©tricas principales
  const overallProgress = currentScores && baselineScores 
    ? Object.keys(currentScores).reduce((total, prueba) => {
        const improvement = currentScores[prueba as TPAESPrueba] - baselineScores[prueba as TPAESPrueba];
        return total + improvement;
      }, 0) / Object.keys(currentScores).length
    : 0;

  const strongestArea = currentScores 
    ? Object.entries(currentScores).reduce((max, [prueba, score]) => 
        score > max.score ? { prueba: prueba as TPAESPrueba, score } : max, 
        { prueba: 'COMPETENCIA_LECTORA' as TPAESPrueba, score: 0 }
      )
    : null;

  const weakestArea = currentScores 
    ? Object.entries(currentScores).reduce((min, [prueba, score]) => 
        score < min.score ? { prueba: prueba as TPAESPrueba, score } : min, 
        { prueba: 'COMPETENCIA_LECTORA' as TPAESPrueba, score: 850 }
      )
    : null;

  const averagePredicted = predictedScores 
    ? Math.round(Object.values(predictedScores).reduce((a, b) => a + b, 0) / Object.values(predictedScores).length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header Principal */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-lg text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Centro de Inteligencia DiagnÃ³stica</h1>
            <p className="text-blue-100">
              Sistema integral de evaluaciÃ³n, seguimiento y estrategias personalizadas
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{Math.round(overallProgress)}%</div>
            <div className="text-sm text-blue-200">Progreso General</div>
          </div>
        </div>
      </motion.div>

      {/* MÃ©tricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-700">+{Math.round(overallProgress)}</div>
                <div className="text-sm text-green-600">Mejora Promedio</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-blue-700">Ãrea MÃ¡s Fuerte</div>
                <div className="text-xs text-blue-600">
                  {strongestArea ? getPruebaDisplayName(strongestArea.prueba) : 'N/A'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <div>
                <div className="text-sm font-medium text-orange-700">Requiere AtenciÃ³n</div>
                <div className="text-xs text-orange-600">
                  {weakestArea ? getPruebaDisplayName(weakestArea.prueba) : 'N/A'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-sm font-medium text-purple-700">Puntaje Predicho</div>
                <div className="text-xs text-purple-600">{averagePredicted || 'Calculando...'}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumen de Puntajes y PrÃ³ximas Evaluaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resumen de Puntajes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ChartBar className="w-5 h-5" />
              <span>Puntajes por Prueba</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tests.map((test) => {
              const prueba = test.code as TPAESPrueba;
              const baseline = baselineScores?.[prueba] || 0;
              const current = currentScores?.[prueba] || 0;
              const improvement = current - baseline;
              
              return (
                <div key={test.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{getPruebaDisplayName(prueba)}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant={improvement > 0 ? "default" : "secondary"}>
                        {improvement > 0 ? `+${improvement}` : improvement}
                      </Badge>
                      <span className="font-bold">{current}</span>
                    </div>
                  </div>
                  <Progress value={(current / 850) * 100} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* PrÃ³ximas Evaluaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Evaluaciones Programadas</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-600 mb-2">PrÃ³xima EvaluaciÃ³n</div>
              <div className="font-bold text-blue-800">
                {nextRecommendedAssessment ? 
                  new Date(nextRecommendedAssessment).toLocaleDateString('es') : 
                  'Por programar'
                }
              </div>
            </div>
            
            <Button 
              onClick={onScheduleAssessment}
              className="w-full"
            >
              <Brain className="w-4 h-4 mr-2" />
              Realizar EvaluaciÃ³n Ahora
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => onGenerateExercises('COMPETENCIA_LECTORA')}
              className="w-full"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Ejercicios Personalizados
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

