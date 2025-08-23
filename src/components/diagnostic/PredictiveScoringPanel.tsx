
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Calendar, Award } from 'lucide-react';
import { TPAESPrueba, getPruebaDisplayName } from '@/types/system-types';
import { PAESTest } from '@/types/unified-diagnostic';

interface PredictiveScoringPanelProps {
  predictedScores: Record<TPAESPrueba, number> | null;
  currentScores: Record<TPAESPrueba, number> | null;
  progressTrends: Array<{
    date: string;
    scores: Record<TPAESPrueba, number>;
    improvements: Record<TPAESPrueba, number>;
  }>;
  tests: PAESTest[];
}

export const PredictiveScoringPanel: React.FC<PredictiveScoringPanelProps> = ({
  predictedScores,
  currentScores,
  progressTrends,
  tests
}) => {
  const averagePredicted = predictedScores 
    ? Math.round(Object.values(predictedScores).reduce((a, b) => a + b, 0) / Object.values(predictedScores).length)
    : 0;

  const averageCurrent = currentScores 
    ? Math.round(Object.values(currentScores).reduce((a, b) => a + b, 0) / Object.values(currentScores).length)
    : 0;

  const expectedImprovement = averagePredicted - averageCurrent;

  return (
    <div className="space-y-6">
      {/* Resumen de predicción */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-800">{averagePredicted}</div>
            <div className="text-sm text-blue-600">Puntaje Predicho</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-800">
              {expectedImprovement > 0 ? `+${expectedImprovement}` : expectedImprovement}
            </div>
            <div className="text-sm text-green-600">Mejora Esperada</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-800">4-6</div>
            <div className="text-sm text-purple-600">Semanas</div>
          </CardContent>
        </Card>
      </div>

      {/* Predicciones por prueba */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>Predicciones por Prueba</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {tests.map((test) => {
            const prueba = test.code as TPAESPrueba;
            const current = currentScores?.[prueba] || 0;
            const predicted = predictedScores?.[prueba] || 0;
            const improvement = predicted - current;
            
            return (
              <div key={test.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{getPruebaDisplayName(prueba)}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      Actual: {current}
                    </Badge>
                    <Badge variant={improvement > 0 ? "default" : "secondary"}>
                      Predicho: {predicted}
                    </Badge>
                    {improvement > 0 && (
                      <Badge variant="default" className="bg-green-600">
                        +{improvement}
                      </Badge>
                    )}
                  </div>
                </div>
                <Progress value={(predicted / 850) * 100} className="h-2" />
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>Basado en tendencia actual de progreso</span>
                  <span>{Math.round((predicted / 850) * 100)}% del máximo</span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Factores de predicción */}
      <Card>
        <CardHeader>
          <CardTitle>Factores de Predicción</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-green-700">Factores Positivos</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Tendencia de mejora consistente</li>
                <li>• Práctica regular de ejercicios</li>
                <li>• Reducción en tiempo de respuesta</li>
                <li>• Mejora en habilidades específicas</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-orange-700">Áreas de Atención</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Mantener constancia en el estudio</li>
                <li>• Reforzar áreas de menor rendimiento</li>
                <li>• Practicar ejercicios de mayor dificultad</li>
                <li>• Revisar conceptos fundamentales</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
