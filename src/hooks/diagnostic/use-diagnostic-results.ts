
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/hooks/use-user-data";
import { useDiagnostic } from "@/hooks/use-diagnostic";
import { toast } from "@/components/ui/use-toast";
import { clearTestProgress } from "@/utils/test-storage";
import { DiagnosticTest } from "@/types/diagnostic";

interface ResultsProps {
  currentTest: DiagnosticTest | null;
  answers: Record<string, string>;
  timeStarted: Date | null;
  setTestStarted: (started: boolean) => void;
}

export const useDiagnosticResults = ({
  currentTest,
  answers,
  timeStarted,
  setTestStarted
}: ResultsProps) => {
  const { user, updateLearningPhase } = useUserData();
  const { profile } = useAuth();
  const { submitDiagnosticResult } = useDiagnostic();
  
  const [resultSubmitted, setResultSubmitted] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, number> | null>(null);
  
  const handleFinishTest = async () => {
    if (!profile || !currentTest || !timeStarted) {
      toast({
        title: "Error",
        description: "No se pudo completar el diagnóstico debido a datos faltantes.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Calculate time spent
      const timeSpentMinutes = Math.floor((new Date().getTime() - timeStarted.getTime()) / 60000);
      
      // Make sure all questions have been answered
      const questionsAnswered = currentTest.questions.every(
        question => !!answers[question.id]
      );
      
      if (!questionsAnswered) {
        toast({
          title: "Preguntas sin responder",
          description: "Por favor responde todas las preguntas antes de finalizar el diagnóstico.",
          variant: "warning"
        });
        return;
      }
      
      // Submit results
      const result = await submitDiagnosticResult(
        profile.id,
        currentTest.id,
        answers,
        timeSpentMinutes
      );
      
      if (result) {
        setResultSubmitted(true);
        setTestResults(result.results);
        
        // Clear any saved progress
        clearTestProgress();
        
        // Update user's learning phase to next phase
        if (user) {
          try {
            await updateLearningPhase("PERSONALIZED_PLAN");
            
            toast({
              title: "Diagnóstico completado",
              description: "Ahora puedes avanzar a la creación de tu plan de estudio personalizado",
            });
          } catch (error) {
            console.error("Error updating learning phase:", error);
            toast({
              title: "Error",
              description: "No se pudo actualizar tu fase de aprendizaje. Por favor, inténtalo de nuevo más tarde.",
              variant: "destructive"
            });
          }
        }
      } else {
        toast({
          title: "Error",
          description: "No se pudo enviar los resultados del diagnóstico. Por favor, inténtalo de nuevo.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error finishing test:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al finalizar el diagnóstico. Por favor, inténtalo de nuevo más tarde.",
        variant: "destructive"
      });
    }
  };
  
  const handleRestartDiagnostic = () => {
    setTestStarted(false);
    setResultSubmitted(false);
    setTestResults(null);
  };
  
  return {
    resultSubmitted,
    testResults,
    handleFinishTest,
    handleRestartDiagnostic
  };
};
