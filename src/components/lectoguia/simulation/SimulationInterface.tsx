
import React, { useState } from 'react';
import { Exercise } from '@/types/ai-types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ExerciseQuestion } from '@/components/lectoguia/exercise/ExerciseQuestion';
import { Badge } from '@/components/ui/badge';
import { Clock, ChevronLeft, ChevronRight, Save, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatTimeRemaining } from '@/utils/lectoguia-utils';

interface SimulationInterfaceProps {
  currentQuestion: Exercise & { index: number } | null;
  answers: Record<number, number | null>;
  timeRemaining: number;
  totalQuestions: number;
  currentQuestionIndex: number;
  onAnswerSelect: (questionIndex: number, optionIndex: number) => void;
  onFinish: () => void;
  onNavigateQuestion: (direction: 'prev' | 'next' | number) => void;
}

export const SimulationInterface: React.FC<SimulationInterfaceProps> = ({
  currentQuestion,
  answers,
  timeRemaining,
  totalQuestions,
  currentQuestionIndex,
  onAnswerSelect,
  onFinish,
  onNavigateQuestion
}) => {
  const [showWarning, setShowWarning] = useState(false);
  
  // Calcular progreso de la prueba
  const progress = (currentQuestionIndex + 1) / totalQuestions * 100;
  
  // Obtener el tiempo restante formateado
  const formattedTime = formatTimeRemaining(timeRemaining);
  
  // Verificar si el tiempo está por agotarse
  const isTimeRunningLow = timeRemaining <= 300; // 5 minutos o menos
  
  // Manejar selección de respuesta
  const handleOptionSelect = (index: number) => {
    if (currentQuestion) {
      onAnswerSelect(currentQuestionIndex, index);
    }
  };
  
  // Renderizar navegación de preguntas
  const renderQuestionNav = () => {
    const buttons = [];
    for (let i = 0; i < totalQuestions; i++) {
      const isAnswered = answers[i] !== null;
      const isCurrent = i === currentQuestionIndex;
      
      buttons.push(
        <Button
          key={i}
          variant={isCurrent ? "default" : isAnswered ? "secondary" : "outline"}
          size="sm"
          className={`w-10 h-10 p-0 ${isCurrent ? "ring-2 ring-primary" : ""}`}
          onClick={() => onNavigateQuestion(i)}
        >
          {i + 1}
        </Button>
      );
    }
    return buttons;
  };
  
  const handleFinishAttempt = () => {
    const unansweredCount = Object.values(answers).filter(a => a === null).length;
    
    if (unansweredCount > 0) {
      setShowWarning(true);
    } else {
      onFinish();
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header con tiempo y progreso */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Simulación PAES</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={isTimeRunningLow ? "destructive" : "outline"} className="text-sm">
              <Clock className="h-3 w-3 mr-1" /> {formattedTime}
            </Badge>
            <Badge variant="outline" className="text-sm">
              {currentQuestionIndex + 1} de {totalQuestions}
            </Badge>
          </div>
        </div>
        
        <Button 
          variant="default" 
          onClick={handleFinishAttempt}
        >
          Finalizar simulación
        </Button>
      </div>
      
      {/* Barra de progreso */}
      <Progress value={progress} className="h-2" />
      
      {/* Pregunta actual */}
      <div className="bg-card rounded-lg">
        {currentQuestion ? (
          <ExerciseQuestion
            exercise={currentQuestion}
            selectedOption={answers[currentQuestionIndex] !== null ? answers[currentQuestionIndex] || 0 : null}
            showFeedback={false}
            onOptionSelect={handleOptionSelect}
          />
        ) : (
          <div className="p-8 text-center">
            <p>No hay preguntas disponibles.</p>
          </div>
        )}
      </div>
      
      {/* Navegación entre preguntas */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => onNavigateQuestion('prev')}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
        </Button>
        
        <Button
          variant="outline" 
          onClick={() => onNavigateQuestion('next')}
          disabled={currentQuestionIndex === totalQuestions - 1}
        >
          Siguiente <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      {/* Navegación rápida de preguntas */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Navegación de preguntas</h3>
            <Save className="h-4 w-4 text-muted-foreground" />
          </div>
          <Separator className="my-2" />
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 mt-2 max-h-48 overflow-y-auto">
            {renderQuestionNav()}
          </div>
        </CardContent>
      </Card>
      
      {/* Advertencia de preguntas sin responder */}
      {showWarning && (
        <Card className="bg-warning/10 border-warning">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <div>
              <p className="font-medium">Tienes preguntas sin responder</p>
              <p className="text-sm">¿Estás seguro de que deseas finalizar la simulación?</p>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="default" onClick={onFinish}>
                  Finalizar de todas formas
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowWarning(false)}>
                  Continuar respondiendo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
