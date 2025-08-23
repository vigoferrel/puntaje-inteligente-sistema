/* eslint-disable react-refresh/only-export-components */

import React, { useState, useCallback } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { Target, Zap, CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react';
import { IntersectionalContext, CrossModuleAction } from '../../../types/intersectional-types';

interface ExerciseIntersectionalProps {
  context: IntersectionalContext & { moduleState: unknown };
  onNavigateToTool: (tool: string, context?: unknown) => void;
  onDispatchAction: (action: CrossModuleAction) => void;
}

export const ExerciseIntersectional: React.FC<ExerciseIntersectionalProps> = ({
  context,
  onNavigateToTool,
  onDispatchAction
}) => {
  const [currentExercise, setCurrentExercise] = useState<unknown>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const generateExercise = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Simular generaciÃ³n de ejercicio basado en contexto interseccional
      const exercise = {
        id: `exercise-${Date.now()}`,
        question: `Ejercicio de ${context.currentSubject} - Nivel adaptativo`,
        options: [
          'OpciÃ³n A: Respuesta correcta',
          'OpciÃ³n B: Distractor plausible',
          'OpciÃ³n C: Distractor comÃºn',
          'OpciÃ³n D: Distractor avanzado'
        ],
        correctAnswer: 'OpciÃ³n A: Respuesta correcta',
        explanation: 'Esta es la respuesta correcta porque...',
        difficulty: 'intermediate',
        subject: context.currentSubject,
        adaptedToLevel: context.crossModuleMetrics.averagePerformance
      };

      setCurrentExercise(exercise);
      setSelectedOption('');
      setShowFeedback(false);

      // Notificar a otros mÃ³dulos
      onDispatchAction({
        type: 'UPDATE_CONTEXT',
        source: 'exercise',
        target: 'progress',
        payload: { newExerciseGenerated: exercise.id },
        priority: 'medium'
      });

    } catch (error) {
      console.error('Error generando ejercicio:', error);
    } finally {
      setIsLoading(false);
    }
  }, [context, onDispatchAction]);

  const handleOptionSelect = useCallback((option: string) => {
    setSelectedOption(option);
    setShowFeedback(true);

    const isCorrect = option === currentExercise?.correctAnswer;
    
    // Actualizar mÃ©tricas interseccionales
    onDispatchAction({
      type: 'SYNC_METRICS',
      source: 'exercise',
      target: 'all',
      payload: {
        exercisesCompleted: context.crossModuleMetrics.exercisesCompleted + 1,
        averagePerformance: isCorrect ? 
          Math.min(100, context.crossModuleMetrics.averagePerformance + 2) :
          Math.max(0, context.crossModuleMetrics.averagePerformance - 1)
      },
      priority: 'high'
    });
  }, [currentExercise, context, onDispatchAction]);

  // Generar ejercicio inicial si no hay uno
  React.useEffect(() => {
    if (!currentExercise && !isLoading) {
      generateExercise();
    }
  }, [currentExercise, isLoading, generateExercise]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Ejercicios Adaptativos
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {context.currentSubject}
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              Nivel: {Math.round(context.crossModuleMetrics.averagePerformance)}%
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* MÃ©tricas del mÃ³dulo */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {context.crossModuleMetrics.exercisesCompleted}
            </div>
            <div className="text-sm text-gray-600">Completados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(context.crossModuleMetrics.averagePerformance)}%
            </div>
            <div className="text-sm text-gray-600">Rendimiento</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {context.crossModuleMetrics.streakDays}
            </div>
            <div className="text-sm text-gray-600">DÃ­as seguidos</div>
          </div>
        </div>

        {/* Ejercicio actual */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Generando ejercicio adaptativo...</p>
          </div>
        ) : currentExercise ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-4">
                {currentExercise.question}
              </h3>
              
              <div className="space-y-2">
                {currentExercise.options.map((option: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => !showFeedback && handleOptionSelect(option)}
                    disabled={showFeedback}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedOption === option
                        ? showFeedback
                          ? option === currentExercise.correctAnswer
                            ? 'bg-green-100 border-green-500 text-green-800'
                            : 'bg-red-100 border-red-500 text-red-800'
                          : 'bg-blue-100 border-blue-500'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showFeedback && selectedOption === option && (
                        option === currentExercise.correctAnswer ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        )
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <p className="text-blue-800 text-sm">
                    <strong>ExplicaciÃ³n:</strong> {currentExercise.explanation}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : null}

        {/* Acciones */}
        <div className="flex gap-2">
          <Button
            onClick={generateExercise}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Nuevo Ejercicio
          </Button>
          
          <Button
            variant="outline"
            onClick={() => onNavigateToTool('diagnostic', { fromExercise: true })}
            className="flex-1"
          >
            <Zap className="w-4 h-4 mr-2" />
            Evaluar Progreso
          </Button>
        </div>

        {/* Recomendaciones interseccionales */}
        {context.financialGoals && (
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-medium text-purple-900 mb-2">ðŸŽ¯ RecomendaciÃ³n Interseccional</h4>
            <p className="text-purple-800 text-sm">
              Tu rendimiento actual ({Math.round(context.crossModuleMetrics.averagePerformance)}%) 
              estÃ¡ alineado con tu objetivo de acceder a {context.financialGoals.targetCareer}.
              {context.crossModuleMetrics.averagePerformance < 70 && 
                " Considera practicar mÃ¡s para mejorar tus oportunidades."
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

