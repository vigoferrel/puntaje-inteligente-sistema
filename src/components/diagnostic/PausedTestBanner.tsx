
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayIcon, XCircleIcon } from "lucide-react";
import { StoredTestProgress } from "@/utils/test-storage";
import { DiagnosticTest } from "@/types/diagnostic";

interface PausedTestBannerProps {
  testProgress: StoredTestProgress;
  test: DiagnosticTest;
  onResumeTest: () => void;
  onDiscardProgress: () => void;
}

export const PausedTestBanner = ({
  testProgress,
  test,
  onResumeTest,
  onDiscardProgress
}: PausedTestBannerProps) => {
  // Calculate progress percentage
  const progressPercentage = Math.round(
    ((testProgress.currentQuestionIndex + 1) / test.questions.length) * 100
  );
  
  // Format last paused date
  const lastPaused = new Date(testProgress.lastPausedAt);
  const formattedDate = lastPaused.toLocaleDateString();
  const formattedTime = lastPaused.toLocaleTimeString();
  
  return (
    <Card className="mb-6 border-amber-300 bg-amber-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-amber-800">
          Test en pausa: {test.title}
        </CardTitle>
        <CardDescription>
          Tienes un diagnóstico en curso. ¿Deseas continuar donde lo dejaste?
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm space-y-1">
          <p>Progreso: {progressPercentage}% ({testProgress.currentQuestionIndex + 1} de {test.questions.length} preguntas)</p>
          <p>Pausado el: {formattedDate} a las {formattedTime}</p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button 
          onClick={onResumeTest} 
          className="flex items-center gap-1"
        >
          <PlayIcon className="h-4 w-4" /> Continuar
        </Button>
        <Button 
          variant="outline" 
          onClick={onDiscardProgress}
          className="flex items-center gap-1"
        >
          <XCircleIcon className="h-4 w-4" /> Descartar
        </Button>
      </CardFooter>
    </Card>
  );
};
