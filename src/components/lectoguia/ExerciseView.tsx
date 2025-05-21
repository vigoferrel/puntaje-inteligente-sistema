
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Award } from 'lucide-react';
import { Exercise } from '@/types/ai-types';

interface ExerciseViewProps {
  exercise: Exercise | null;
  selectedOption: number | null;
  showFeedback: boolean;
  onOptionSelect: (index: number) => void;
  onContinue: () => void;
}

export const ExerciseView: React.FC<ExerciseViewProps> = ({
  exercise,
  selectedOption,
  showFeedback,
  onOptionSelect,
  onContinue
}) => {
  if (!exercise) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
        <div className="h-16 w-16 text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
        </div>
        <h3 className="text-xl font-medium text-foreground">No hay ejercicios activos</h3>
        <p className="text-muted-foreground max-w-md">
          Pídele a LectoGuía que te genere un ejercicio de comprensión lectora según tus necesidades.
        </p>
      </div>
    );
  }

  // Determinar la respuesta correcta como índice
  const correctAnswerIndex = exercise.options.findIndex(
    option => option === exercise.correctAnswer
  );
  
  // Si no se encuentra la respuesta correcta, usamos 0 por defecto
  const correctIndex = correctAnswerIndex >= 0 ? correctAnswerIndex : 0;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold text-foreground mb-1">Lectura</h3>
          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
            {exercise.skill || "Comprensión Lectora"}
          </span>
        </div>
        <div className="bg-secondary/30 p-4 rounded-lg text-foreground border border-border">
          {exercise.text || exercise.context || "Sin contenido"}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">{exercise.question}</h3>
        
        <div className="space-y-3 mb-6">
          {exercise.options.map((option, index) => (
            <button
              key={index}
              className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                selectedOption === index 
                  ? showFeedback
                    ? index === correctIndex 
                      ? 'bg-green-500/20 border border-green-500/50'
                      : 'bg-red-500/20 border border-red-500/50'
                    : 'bg-primary/20 border border-primary/50' 
                  : 'bg-secondary/30 border border-border hover:bg-secondary'
              }`}
              onClick={() => !showFeedback && onOptionSelect(index)}
              disabled={showFeedback}
            >
              <div className="flex items-start">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5 ${
                  selectedOption === index 
                    ? showFeedback
                      ? index === correctIndex
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                      : 'bg-primary text-white' 
                    : correctIndex === index && showFeedback
                      ? 'bg-green-500 text-white'
                      : 'border border-muted-foreground'
                }`}>
                  {showFeedback 
                    ? (index === correctIndex 
                        ? <Award size={12} /> 
                        : selectedOption === index ? '✗' : '')
                    : selectedOption === index && <ArrowRight size={12} />
                  }
                </div>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>
        
        {showFeedback && (
          <div className={`p-4 rounded-lg mt-4 ${
            selectedOption === correctIndex 
              ? 'bg-green-500/20 border border-green-500/30' 
              : 'bg-red-500/20 border border-red-500/30'
          }`}>
            <h4 className="font-semibold mb-2">
              {selectedOption === correctIndex 
                ? '¡Correcto!' 
                : 'Incorrecto'
              }
            </h4>
            <p>
              {selectedOption === correctIndex 
                ? exercise.explanation || "¡Bien hecho! Has seleccionado la respuesta correcta." 
                : `Respuesta incorrecta. La opción correcta es: "${exercise.correctAnswer}". ${exercise.explanation || ""}`
              }
            </p>
            
            <div className="mt-4 flex justify-end">
              <Button onClick={onContinue} className="bg-primary hover:bg-primary/90">
                Continuar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
