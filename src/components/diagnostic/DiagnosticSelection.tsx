
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { DiagnosticTest } from "@/types/diagnostic";
import { DiagnosticSelector } from "./DiagnosticSelector";
import { PausedTestBanner } from "./PausedTestBanner";
import { StoredTestProgress } from "@/utils/test-storage";

interface DiagnosticSelectionProps {
  tests: DiagnosticTest[];
  loading: boolean;
  selectedTestId: string | null;
  pausedProgress: StoredTestProgress | null;
  onTestSelect: (testId: string) => void;
  onStartTest: () => void;
  onResumeTest: () => void;
  onDiscardProgress: () => void;
}

export const DiagnosticSelection = ({
  tests,
  loading,
  selectedTestId,
  pausedProgress,
  onTestSelect,
  onStartTest,
  onResumeTest,
  onDiscardProgress
}: DiagnosticSelectionProps) => {
  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900">
        <InfoIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertTitle className="text-blue-700 dark:text-blue-300">Evaluación Diagnóstica</AlertTitle>
        <AlertDescription className="text-blue-700 dark:text-blue-300">
          Esta evaluación nos ayudará a determinar tu nivel actual de habilidades para crear un plan de estudio personalizado.
          Selecciona una de las evaluaciones disponibles para comenzar.
        </AlertDescription>
      </Alert>
      
      {pausedProgress && (
        <PausedTestBanner
          pausedProgress={pausedProgress}
          onResumeTest={onResumeTest}
          onDiscardProgress={onDiscardProgress}
        />
      )}
      
      <DiagnosticSelector
        tests={tests}
        selectedTestId={selectedTestId}
        onTestSelect={onTestSelect}
        onStartTest={onStartTest}
        loading={loading}
      />
    </div>
  );
};
