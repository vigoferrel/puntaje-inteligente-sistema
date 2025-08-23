/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Card, CardContent } from '../../components/ui/card';
import { Brain } from 'lucide-react';
import { ExerciseCard, ExerciseActions } from './components';

interface Exercise {
  id: number;
  node: string;
  subject: string;
  difficulty: string;
  question: string;
  alternatives: string[];
  correctAnswer: string;
  explanation: string;
  estimatedTime: number;
}

interface ExerciseResultsProps {
  exercises: Exercise[];
  isGenerating: boolean;
  selectedSubject: string;
  onClear: () => void;
}

export const ExerciseResults: FC<ExerciseResultsProps> = ({
  exercises,
  isGenerating,
  selectedSubject,
  onClear
}) => {
  if (isGenerating) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="space-y-4">
            <Brain className="w-12 h-12 mx-auto animate-pulse text-primary" />
            <h3 className="text-lg font-semibold">Generando ejercicios...</h3>
            <p className="text-muted-foreground">
              La IA estÃ¡ creando ejercicios personalizados basados en tu selecciÃ³n
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (exercises.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Brain className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Â¡Listo para generar!</h3>
          <p className="text-muted-foreground mb-4">
            Configura los parÃ¡metros y selecciona los nodos para comenzar
          </p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>â€¢ Selecciona el tier de prioridad</p>
            <p>â€¢ Elige los nodos especÃ­ficos</p>
            <p>â€¢ Configura dificultad y cantidad</p>
            <p>â€¢ Los ejercicios se generarÃ¡n con IA</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <ExerciseActions
        exercises={exercises}
        selectedSubject={selectedSubject}
        onClear={onClear}
      />

      <div className="space-y-4">
        {exercises.map((exercise, index) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

