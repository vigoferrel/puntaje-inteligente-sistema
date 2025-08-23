
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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

export const ExerciseResults: React.FC<ExerciseResultsProps> = ({
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
              La IA está creando ejercicios personalizados basados en tu selección
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
          <h3 className="text-lg font-semibold mb-2">¡Listo para generar!</h3>
          <p className="text-muted-foreground mb-4">
            Configura los parámetros y selecciona los nodos para comenzar
          </p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Selecciona el tier de prioridad</p>
            <p>• Elige los nodos específicos</p>
            <p>• Configura dificultad y cantidad</p>
            <p>• Los ejercicios se generarán con IA</p>
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
