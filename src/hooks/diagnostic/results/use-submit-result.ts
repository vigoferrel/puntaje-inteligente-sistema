
import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DiagnosticTest, DiagnosticResult } from "@/types/diagnostic";
import { submitDiagnosticResult } from "@/services/diagnostic";
import { toast } from "@/components/ui/use-toast";

interface SubmitResultProps {
  currentTest: DiagnosticTest | null;
  answers: Record<string, string>;
  timeStarted: Date | null;
}

export const useSubmitResult = ({ currentTest, answers, timeStarted }: SubmitResultProps) => {
  const { profile } = useAuth();
  const [resultSubmitted, setResultSubmitted] = useState(false);
  const [testResults, setTestResults] = useState<DiagnosticResult | null>(null);
  
  const handleFinishTest = useCallback(async () => {
    if (!profile || !currentTest || !timeStarted) return;
    
    // Check if all questions have been answered
    const unansweredQuestions = currentTest.questions.filter(
      q => !answers[q.id]
    );
    
    if (unansweredQuestions.length > 0) {
      toast({
        title: "Preguntas sin responder",
        description: `Tienes ${unansweredQuestions.length} preguntas sin responder. ¿Estás seguro de querer finalizar?`,
        variant: "default"
      });
      // We could add a confirmation dialog here, but for now let's proceed
    }
    
    // Calculate time spent in minutes
    const now = new Date();
    const timeSpentMinutes = (now.getTime() - timeStarted.getTime()) / (1000 * 60);
    
    try {
      const result = await submitDiagnosticResult(
        profile.id,
        currentTest.id,
        answers,
        timeSpentMinutes
      );
      
      if (result) {
        setTestResults(result);
        setResultSubmitted(true);
        toast({
          title: "Diagnóstico completado",
          description: "Tus resultados han sido guardados correctamente",
        });
      }
    } catch (error) {
      console.error("Error submitting test results:", error);
      toast({
        title: "Error",
        description: "No se pudieron guardar los resultados. Intenta nuevamente más tarde.",
        variant: "destructive"
      });
    }
  }, [profile, currentTest, timeStarted, answers]);
  
  return {
    resultSubmitted,
    testResults,
    handleFinishTest
  };
};
