
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PlayIcon, XIcon } from "lucide-react";
import { StoredTestProgress } from "@/utils/test-storage";
import { DiagnosticTest } from "@/types/diagnostic";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
  onDiscardProgress,
}: PausedTestBannerProps) => {
  if (!testProgress || !test) return null;

  // Calcular tiempo transcurrido
  const startedDate = new Date(testProgress.timeStarted);
  const formattedDate = format(startedDate, "d 'de' MMMM 'a las' HH:mm", { locale: es });
  const progressPercentage = ((testProgress.currentQuestionIndex + 1) / test.questions.length) * 100;

  return (
    <Alert className="mb-6 border-amber-200 bg-amber-50">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
        <div>
          <AlertTitle className="text-amber-800 flex items-center">
            Diagnóstico en progreso
          </AlertTitle>
          <AlertDescription className="text-amber-700">
            <p>Tienes un diagnóstico pausado: <strong>{test.title}</strong></p>
            <p className="text-sm mt-1">
              Iniciado el {formattedDate} • Progreso: {Math.round(progressPercentage)}%
            </p>
          </AlertDescription>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm" onClick={onDiscardProgress}>
            <XIcon className="h-4 w-4 mr-1" />
            Descartar
          </Button>
          <Button className="bg-amber-600 hover:bg-amber-700" size="sm" onClick={onResumeTest}>
            <PlayIcon className="h-4 w-4 mr-1" />
            Continuar
          </Button>
        </div>
      </div>
    </Alert>
  );
};
