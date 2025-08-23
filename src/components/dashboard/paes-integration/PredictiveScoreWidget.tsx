
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface PredictiveScoreWidgetProps {
  predictedScore: number | null;
  confidence: number;
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
  totalAttempts: number;
  loading?: boolean;
}

export const PredictiveScoreWidget: React.FC<PredictiveScoreWidgetProps> = ({
  predictedScore,
  confidence,
  strengths,
  weaknesses,
  recommendation,
  totalAttempts,
  loading = false
}) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!predictedScore || totalAttempts < 5) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Target className="h-5 w-5" />
            Análisis Predictivo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-orange-700">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">
              Necesitas resolver al menos 5 preguntas oficiales PAES 
              para generar una predicción confiable.
            </p>
            <p className="text-xs mt-2 text-orange-600">
              Intentos actuales: {totalAttempts}/5
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 700) return 'text-green-600';
    if (score >= 500) return 'text-blue-600';
    if (score >= 300) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 700) return 'Excelente';
    if (score >= 500) return 'Bueno';
    if (score >= 300) return 'Regular';
    return 'Bajo';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Target className="h-5 w-5" />
            Predicción de Puntaje PAES
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Puntaje Predicho */}
          <div className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor(predictedScore)}`}>
              {predictedScore}
            </div>
            <Badge variant="outline" className="mt-1">
              {getScoreLabel(predictedScore)}
            </Badge>
          </div>

          {/* Confianza */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-700">Confianza del análisis</span>
              <span className="text-sm font-medium text-blue-800">{confidence}%</span>
            </div>
            <Progress value={confidence} className="h-2" />
            <p className="text-xs text-blue-600">
              Basado en {totalAttempts} preguntas oficiales
            </p>
          </div>

          {/* Fortalezas y Debilidades */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Fortalezas
              </h4>
              {strengths.length > 0 ? (
                <div className="space-y-1">
                  {strengths.slice(0, 2).map(strength => (
                    <Badge key={strength} variant="secondary" className="text-xs bg-green-100 text-green-800">
                      {strength.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">Sin datos suficientes</p>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium text-red-700 mb-2 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                A mejorar
              </h4>
              {weaknesses.length > 0 ? (
                <div className="space-y-1">
                  {weaknesses.slice(0, 2).map(weakness => (
                    <Badge key={weakness} variant="outline" className="text-xs border-red-200 text-red-700">
                      {weakness.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">¡Sigue así!</p>
              )}
            </div>
          </div>

          {/* Recomendación */}
          <div className="bg-white p-3 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-800">Recomendación</h4>
                <p className="text-xs text-blue-700 mt-1">{recommendation}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
