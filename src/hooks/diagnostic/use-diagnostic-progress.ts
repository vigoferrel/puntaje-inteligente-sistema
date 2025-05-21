
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { saveTestProgress } from "@/utils/test-storage";
import { DiagnosticTest } from "@/types/diagnostic";

interface ProgressProps {
  testStarted: boolean;
  currentTest: DiagnosticTest | null;
  setTestStarted: (started: boolean) => void;
  setSelectedTestId: (id: string | null) => void;
}

export const useDiagnosticProgress = ({
  testStarted,
  currentTest,
  setTestStarted,
  setSelectedTestId
}: ProgressProps) => {
  const [showPauseConfirmation, setShowPauseConfirmation] = useState(false);
  
  const handlePauseTest = () => {
    setShowPauseConfirmation(true);
  };
  
  const confirmPauseTest = () => {
    if (testStarted && currentTest) {
      // We need to access these values from the parent hook
      // This is a limitation of our refactoring approach
      const currentQuestionIndex = document.getElementById('current-question-index')?.getAttribute('data-value') || '0';
      const answers = document.getElementById('current-answers')?.getAttribute('data-value') || '{}';
      const timeStarted = document.getElementById('time-started')?.getAttribute('data-value');
      
      if (timeStarted) {
        saveTestProgress(
          currentTest,
          parseInt(currentQuestionIndex),
          JSON.parse(answers),
          new Date(timeStarted)
        );
        
        setTestStarted(false);
        setSelectedTestId(null);
        toast({
          title: "Diagnóstico pausado",
          description: "Tu progreso ha sido guardado. Puedes continuar más tarde.",
        });
      }
    }
    setShowPauseConfirmation(false);
  };
  
  return {
    showPauseConfirmation,
    handlePauseTest,
    confirmPauseTest
  };
};
