/* eslint-disable react-refresh/only-export-components */

import React, { useState, useEffect } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Award, Sparkles, RotateCcw } from 'lucide-react';
import { TPAESHabilidad, TPAESPrueba, TLearningCyclePhase } from '../../../types/system-types';
import { usePAESCycleIntegration } from '../../../hooks/lectoguia/use-paes-cycle-integration';
import { PAESBadge } from '../exercise/PAESBadge';

interface PhaseContentMixerProps {
  currentPhase: TLearningCyclePhase;
  skill: TPAESHabilidad;
  prueba: TPAESPrueba;
  onExerciseGenerated: (exercise: unknown) => void;
  className?: string;
}

export const PhaseContentMixer: React.FC<PhaseContentMixerProps> = ({
  currentPhase,
  skill,
  prueba,
  onExerciseGenerated,
  className = ''
}) => {
  const {
    loading,
    generatePhaseExercises,
    getPhaseConfig
  } = usePAESCycleIntegration();

  const [exercises, setExercises] = useState<unknown[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const phaseConfig = getPhaseConfig(currentPhase);

  // Generar ejercicios al montar o cambiar parÃ¡metros
  useEffect(() => {
    handleGenerateExercises();
  }, [currentPhase, skill, prueba]);

  const handleGenerateExercises = async () => {
    try {
      const newExercises = await generatePhaseExercises(currentPhase, skill, prueba);
      setExercises(newExercises);
      setCurrentIndex(0);
      
      if (newExercises.length > 0) {
        onExerciseGenerated(newExercises[0]);
      }
    } catch (error) {
      console.error('Error generando ejercicios mixtos:', error);
    }
  };

  const handleNextExercise = () => {
    if (exercises.length === 0) return;
    
    const nextIndex = (currentIndex + 1) % exercises.length;
    setCurrentIndex(nextIndex);
    onExerciseGenerated(exercises[nextIndex]);
  };

  const currentExercise = exercises[currentIndex];
  const paesCount = exercises.filter(ex => ex.source === 'PAES').length;
  const aiCount = exercises.length - paesCount;

  return (
    <Card className={`border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <Award className="h-4 w-4" />
          Contenido Fase: {currentPhase.replace('_', ' ')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ConfiguraciÃ³n de la fase */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs">
            {phaseConfig.questionCount} ejercicios
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Prioridad: {phaseConfig.priority}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Dificultad: {phaseConfig.difficultyRange.min}-{phaseConfig.difficultyRange.max}
          </Badge>
        </div>

        {/* EstadÃ­sticas del contenido */}
        {exercises.length > 0 && (
          <div className="bg-white p-3 rounded-lg border border-purple-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-purple-700">Contenido Generado</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGenerateExercises}
                disabled={loading}
                className="h-6 px-2"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{paesCount}</div>
                <div className="text-xs text-green-700">Oficiales PAES</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{aiCount}</div>
                <div className="text-xs text-blue-700">Generados IA</div>
              </div>
            </div>

            {/* Ejercicio actual */}
            {currentExercise && (
              <div className="mt-3 pt-3 border-t border-purple-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-purple-600">
                    Ejercicio {currentIndex + 1} de {exercises.length}
                  </span>
                  <PAESBadge 
                    source={currentExercise.source} 
                    questionNumber={currentExercise.numero}
                    className="text-xs"
                  />
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextExercise}
                  className="w-full text-xs"
                  disabled={exercises.length <= 1}
                >
                  Siguiente Ejercicio
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Estado de carga */}
        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin h-6 w-6 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-purple-600">Generando contenido para {currentPhase}...</p>
          </div>
        )}

        {/* DescripciÃ³n de la fase */}
        <div className="text-xs text-purple-600 border-t border-purple-200 pt-3">
          <Sparkles className="h-3 w-3 inline mr-1" />
          Contenido adaptado automÃ¡ticamente segÃºn la fase del ciclo de aprendizaje
        </div>
      </CardContent>
    </Card>
  );
};

