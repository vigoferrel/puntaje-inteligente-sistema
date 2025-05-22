
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface QuestionNavigationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  canContinue: boolean;
  onPreviousQuestion: () => void;
  onNextQuestion: () => void;
  onFinishTest: () => void;
  isLastQuestion: boolean;
}

export const QuestionNavigation = ({
  currentQuestionIndex,
  totalQuestions,
  canContinue,
  onPreviousQuestion,
  onNextQuestion,
  onFinishTest,
  isLastQuestion
}: QuestionNavigationProps) => {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  
  // Handle button click depending on whether it's the last question or not
  const handleActionButtonClick = () => {
    if (isLastQuestion) {
      onFinishTest();
    } else {
      onNextQuestion();
    }
  };
  
  return (
    <div className="space-y-4">
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Pregunta {currentQuestionIndex + 1} de {totalQuestions}
        </p>
        <p className="text-sm text-gray-500">
          {Math.round(progress)}% completado
        </p>
      </div>
      
      <div className="flex justify-between mt-4">
        <Button 
          variant="outline"
          onClick={onPreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Anterior
        </Button>
        
        <Button 
          onClick={handleActionButtonClick}
          disabled={!canContinue}
        >
          {isLastQuestion ? 'Finalizar' : 'Siguiente'}
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
