
import { useState } from "react";
import { DiagnosticTest } from "@/types/diagnostic";
import { toast } from "@/components/ui/use-toast";
import { saveTestProgress, clearTestProgress } from "@/utils/test-storage";

interface ProgressProps {
  testStarted: boolean;
  currentTest: DiagnosticTest | null;
  setTestStarted: (started: boolean) => void;
  setSelectedTestId: (id: string | null) => void;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  timeStarted: Date | null;
}

export const useDiagnosticProgress = ({
  testStarted,
  currentTest,
  setTestStarted,
  setSelectedTestId,
  currentQuestionIndex,
  answers,
  timeStarted
}: ProgressProps) => {
  const [showPauseConfirmation, setShowPauseConfirmation] = useState(false);
  
  const handlePauseTest = () => {
    setShowPauseConfirmation(true);
  };
  
  const confirmPauseTest = (shouldPause: boolean = true) => {
    setShowPauseConfirmation(false);
    
    if (!shouldPause) return;
    
    if (!currentTest || !timeStarted) return;
    
    // Save progress to localStorage
    saveTestProgress(
      currentTest,
      currentQuestionIndex,
      answers,
      timeStarted
    );
    
    toast({
      title: "Diagnóstico pausado",
      description: "Tu progreso ha sido guardado y podrás continuar más tarde.",
    });
    
    // Reset test state
    setTestStarted(false);
    setSelectedTestId(null);
  };
  
  return {
    showPauseConfirmation,
    handlePauseTest,
    confirmPauseTest,
    setShowPauseConfirmation
  };
};
