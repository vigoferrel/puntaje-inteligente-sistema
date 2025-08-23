
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Pause } from "lucide-react";

interface DiagnosticProgressBarProps {
  currentQuestion: number;
  totalQuestions: number;
  onPause: () => void;
}

export const DiagnosticProgressBar = ({
  currentQuestion,
  totalQuestions,
  onPause,
}: DiagnosticProgressBarProps) => {
  const progressPercentage = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="mb-6 space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">
          Pregunta {currentQuestion} de {totalQuestions}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onPause}
          className="h-8 px-2 text-muted-foreground hover:text-foreground"
        >
          <Pause className="h-4 w-4 mr-1" />
          Pausar
        </Button>
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  );
};
