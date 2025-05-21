
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { saveTestProgress } from "@/utils/test-storage";
import { DiagnosticTest } from "@/types/diagnostic";

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
  
  const confirmPauseTest = () => {
    if (testStarted && currentTest && timeStarted) {
      saveTestProgress(
        currentTest,
        currentQuestionIndex,
        answers,
        timeStarted
      );
      
      setTestStarted(false);
      setSelectedTestId(null);
      toast({
        title: "Diagnóstico pausado",
        description: "Tu progreso ha sido guardado. Puedes continuar más tarde.",
      });
    }
    setShowPauseConfirmation(false);
  };
  
  return {
    showPauseConfirmation,
    handlePauseTest,
    confirmPauseTest
  };
};
