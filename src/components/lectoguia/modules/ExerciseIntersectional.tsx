
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Zap, CheckCircle, Brain, TrendingUp } from 'lucide-react';
import { IntersectionalContext, CrossModuleAction } from '@/types/intersectional-types';
import { useLectoGuiaSimplified } from '@/hooks/lectoguia/useLectoGuiaSimplified';

interface ExerciseIntersectionalProps {
  context: IntersectionalContext & { moduleState: any; diagnosticLevel?: string };
  onNavigateToTool: (tool: string, context?: any) => void;
  onDispatchAction: (action: CrossModuleAction) => void;
}

export const ExerciseIntersectional: React.FC<ExerciseIntersectionalProps> = ({
  context,
  onNavigateToTool,
  onDispatchAction
}) => {
  const {
    currentExercise,
    selectedOption,
    showFeedback,
    isLoading,
    handleOptionSelect,
    handleNewExercise
  } = useLectoGuiaSimplified();

  const [adaptiveDifficulty, setAdaptiveDifficulty] = useState<'basic' | 'intermediate' | 'advanced'>('intermediate');

  // Adaptar dificultad basada en contexto interseccional
  useEffect(() => {
    const avgPerformance = context.crossModuleMetrics.averagePerformance;
    
    if (avgPerformance >= 85) {
      setAdaptiveDifficulty('advanced');
    } else if (avgPerformance >= 65) {
      setAdaptiveDifficulty('intermediate');
    } else {
      setAdaptiveDifficulty('basic');
    }
  }, [context.crossModuleMetrics.averagePerformance]);

  // Generar ejercicio con contexto interseccional
  const handleIntersectionalExercise = async () => {
    try {
      await handleNewExercise();
      
      // Notificar progreso a otros módulos
      onDispatchAction({
        type: 'SYNC_METRICS',
        source: 'exercise',
        target: 'progress',
        payload: { 
          exerciseStarted: true,
          difficulty: adaptiveDifficulty,
          subject: context.currentSubject
        },
        priority: 'medium'
      });
      
    } catch (error) {
      console.error('Error generando ejercicio interseccional:', error);
    }
  };

  // Manejar selección con análisis interseccional
  const handleIntersectionalOptionSelect = (optionIndex: number) => {
    handleOptionSelect(optionIndex);
    
    if (currentExercise) {
      const isCorrect = currentExercise.options[optionIndex] === currentExercise.correctAnswer;
      
      // Actualizar métricas interseccionales
      onDispatchAction({
        type: 'SYNC_METRICS',
        source: 'exercise',
        target: 'all',
        payload: {
          exerciseCompleted: true,
          correct: isCorrect,
          subject: context.currentSubject,
          difficulty: adaptiveDifficulty
        },
        priority: 'high'
      });
      
      // Sugerir acciones basadas en rendimiento
      if (!isCorrect && context.financialGoals) {
        setTimeout(() => {
          onDispatchAction({
            type: 'REQUEST_RECOMMENDATION',
            source: 'exercise',
            target: 'financial',
            payload: {
              suggestion: 'additional_practice',
              reason: 'performance_below_career_requirement'
            },
            priority: 'medium'
          });
        }, 2000);
      }
    }
  };

  // Obtener recomendaciones de ejercicios basadas en contexto
  const getExerciseRecommendations = () => {
    const recommendations = [];
    
    if (context.diagnosticLevel === 'pending') {
      recommendations.push({
        title: 'Realizar Diagnóstico',
        description: 'Evalúa tu nivel actual para ejercicios más precisos',
        action: () => onNavigateToTool('diagnostic'),
        priority: 'high'
      });
    }
    
    if (context.financialGoals && context.crossModuleMetrics.averagePerformance < 75) {
      recommendations.push({
        title: 'Entrenamiento Intensivo',
        description: `Mejora tu rendimiento para acceder a ${context.financialGoals.targetCareer}`,
        action: () => handleIntersectionalExercise(),
        priority: 'high'
      });
    }
    
    if (context.studyPlan && context.crossModuleMetrics.exercisesCompleted < 5) {
      recommendations.push({
        title: 'Cumplir Meta Diaria',
        description: 'Completa ejercicios según tu plan de estudio',
        action: () => handleIntersectionalExercise(),
        priority: 'medium'
      });
    }
    
    return recommendations.sort((a, b) => (b.priority === 'high' ? 1 : 0) - (a.priority === 'high' ? 1 : 0));
  };

  const recommendations = getExerciseRecommendations();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            Ejercicios Interseccionales
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700">
              {adaptiveDifficulty}
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              Rendimiento: {context.crossModuleMetrics.averagePerformance}%
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Recomendaciones Contextuales */}
        {recommendations.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Recomendaciones Inteligentes
            </h3>
            {recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border-l-4 ${
                  rec.priority === 'high' 
                    ? 'bg-red-50 border-red-400' 
                    : 'bg-blue-50 border-blue-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{rec.title}</div>
                    <div className="text-sm text-gray-600">{rec.description}</div>
                  </div>
                  <Button
                    onClick={rec.action}
                    size="sm"
                    className={rec.priority === 'high' ? 'bg-red-500 hover:bg-red-600' : ''}
                  >
                    Acción
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Ejercicio Actual */}
        {!currentExercise ? (
          <div className="text-center py-12">
            <div className="relative mb-4">
              <Target className="w-16 h-16 text-gray-400 mx-auto" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 w-16 h-16 mx-auto border-4 border-transparent border-t-green-400 rounded-full"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">Ejercicio Personalizado IA</h3>
            <p className="text-gray-600 mb-6">
              Genera ejercicios adaptados a tu nivel y objetivos académicos
            </p>
            
            {/* Información Contextual */}
            <div className="grid grid-cols-2 gap-4 mb-6 max-w-md mx-auto">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="font-semibold text-blue-800">Materia Activa</div>
                <div className="text-sm text-blue-600">{context.currentSubject}</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="font-semibold text-purple-800">Dificultad IA</div>
                <div className="text-sm text-purple-600">{adaptiveDifficulty}</div>
              </div>
            </div>
            
            <Button 
              onClick={handleIntersectionalExercise}
              disabled={isLoading} 
              className="gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <Zap className="w-4 h-4" />
              {isLoading ? 'Generando con IA...' : 'Nuevo Ejercicio Inteligente'}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header del Ejercicio */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold mb-2">{currentExercise.question}</h3>
                <div className="flex gap-2">
                  <Badge variant="outline" className="gap-2">
                    <Brain className="w-3 h-3" />
                    IA Adaptativa
                  </Badge>
                  <Badge variant="outline">
                    {context.currentSubject}
                  </Badge>
                </div>
              </div>
              <Button 
                onClick={handleIntersectionalExercise}
                variant="outline" 
                size="sm"
                className="gap-2"
              >
                <Zap className="w-4 h-4" />
                Nuevo
              </Button>
            </div>

            {/* Opciones */}
            <div className="space-y-2">
              <p className="font-medium">Selecciona la respuesta correcta:</p>
              {currentExercise.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleIntersectionalOptionSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border transition-all duration-300 ${
                    selectedOption === index
                      ? showFeedback
                        ? option === currentExercise.correctAnswer
                          ? 'bg-green-100 border-green-500 text-green-800 shadow-md'
                          : 'bg-red-100 border-red-500 text-red-800 shadow-md'
                        : 'bg-blue-100 border-blue-500 shadow-md scale-105'
                      : 'hover:bg-gray-50 hover:border-gray-300 hover:scale-102'
                  }`}
                  disabled={showFeedback}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{String.fromCharCode(65 + index)})</span>
                    <span>{option}</span>
                    {showFeedback && option === currentExercise.correctAnswer && (
                      <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Feedback */}
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-600" />
                    Análisis IA Interseccional:
                  </h4>
                  <p className="text-gray-700 mb-3">{currentExercise.explanation}</p>
                  
                  {/* Contexto Adicional */}
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>💡 Este ejercicio se adaptó a tu nivel actual ({adaptiveDifficulty})</div>
                    {context.financialGoals && (
                      <div>🎯 Relevante para tu carrera objetivo: {context.financialGoals.targetCareer}</div>
                    )}
                    {context.diagnosticLevel === 'assessed' && (
                      <div>📊 Basado en tu evaluación diagnóstica más reciente</div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleIntersectionalExercise} className="flex-1">
                    <Zap className="w-4 h-4 mr-2" />
                    Siguiente Ejercicio
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => onNavigateToTool('progress')}
                    className="flex-1"
                  >
                    Ver Progreso
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
