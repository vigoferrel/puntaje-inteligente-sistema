
import { useState, useEffect } from "react";
import { useDiagnostic } from "@/hooks/use-diagnostic";
import { toast } from "@/components/ui/use-toast";
import { StoredTestProgress, getTestProgress, clearTestProgress } from "@/utils/test-storage";

interface TestSelectionProps {
  selectedTestId: string | null;
  setSelectedTestId: (id: string | null) => void;
  setTestStarted: (started: boolean) => void;
}

export const useDiagnosticTestSelection = ({
  selectedTestId,
  setSelectedTestId,
  setTestStarted
}: TestSelectionProps) => {
  const { 
    tests, 
    loading,
    startDiagnosticTest
  } = useDiagnostic();
  
  const [pausedProgress, setPausedProgress] = useState<StoredTestProgress | null>(null);
  
  // Solo verificamos el progreso guardado una vez al cargar
  useEffect(() => {
    // Verificar si hay progreso guardado
    const savedProgress = getTestProgress();
    if (savedProgress && tests.some(test => test.id === savedProgress.testId)) {
      setPausedProgress(savedProgress);
    }
  }, [tests]);
  
  const handleTestSelect = (testId: string) => {
    setSelectedTestId(testId);
  };
  
  const handleStartTest = async () => {
    if (selectedTestId) {
      const test = await startDiagnosticTest(selectedTestId);
      if (test) {
        setTestStarted(true);
      }
    }
  };
  
  const handleResumeTest = async () => {
    if (pausedProgress) {
      const test = await startDiagnosticTest(pausedProgress.testId);
      if (test) {
        setTestStarted(true);
        // Clear the paused state once resumed
        setPausedProgress(null);
        clearTestProgress();
      }
    }
  };
  
  const handleDiscardProgress = () => {
    setPausedProgress(null);
    clearTestProgress();
    toast({
      title: "Progreso descartado",
      description: "Se ha eliminado el progreso guardado del diagnóstico anterior",
    });
  };
  
  return {
    tests,
    loading,
    pausedProgress,
    handleTestSelect,
    handleStartTest,
    handleResumeTest,
    handleDiscardProgress
  };
};
