
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Award, Image as ImageIcon } from 'lucide-react';
import { Exercise } from '@/types/ai-types';
import { ChatImagePreview } from '@/components/ai/chat/ChatImagePreview';

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
  const [expandedImage, setExpandedImage] = useState(false);

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

  // Función para renderizar contenido visual del ejercicio
  const renderVisualContent = () => {
    // Si hay una imagen asociada al ejercicio
    if (exercise.imageUrl) {
      return (
        <div className="mb-4">
          <ChatImagePreview 
            imageUrl={exercise.imageUrl} 
            isExpanded={expandedImage}
            onToggleExpand={() => setExpandedImage(!expandedImage)}
          />
        </div>
      );
    }
    
    // Si hay datos de gráfico asociados al ejercicio
    if (exercise.graphData && exercise.visualType === 'graph') {
      return (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <p className="text-xs text-muted-foreground mb-2">Gráfico relacionado:</p>
          {/* Aquí se podría integrar un componente de visualización de gráficos */}
          <div className="bg-secondary/20 p-4 rounded border border-dashed border-primary/30 text-center">
            [Visualización de gráfico]
          </div>
        </div>
      );
    }
    
    // Para otros tipos de contenido visual que se puedan agregar en el futuro
    if (exercise.hasVisualContent && exercise.visualType) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <p className="text-xs text-muted-foreground mb-2">
            Contenido visual: {exercise.visualType}
          </p>
          <div className="bg-secondary/20 p-4 rounded border border-dashed border-primary/30 text-center">
            [Contenido visual no disponible]
          </div>
        </div>
      );
    }
    
    return null;
  };

  // Información del nodo relacionado (si existe)
  const renderNodeInfo = () => {
    if (exercise.nodeId) {
      return (
        <div className="bg-blue-50 p-3 rounded-md border border-blue-100 mb-4 text-sm">
          <p className="text-blue-600 font-medium">
            <span className="mr-2">📚</span> 
            Este ejercicio está relacionado con un nodo de aprendizaje.
          </p>
        </div>
      );
    }
    return null;
  };

  // Función para formatear el texto del ejercicio con posibles estilos
  const formatExerciseText = (text: string) => {
    // Aquí se podría implementar un parser de markdown o HTML si fuera necesario
    return text;
  };

  return (
    <div className="space-y-6">
      {renderNodeInfo()}
      
      <div>
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold text-foreground mb-1">Lectura</h3>
          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
            {exercise.skill || "Comprensión Lectora"}
          </span>
        </div>
        
        {renderVisualContent()}
        
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
