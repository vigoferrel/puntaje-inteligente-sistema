
import { useCallback } from "react";
import { DiagnosticTest, DiagnosticResult } from "@/types/diagnostic";
import { useDiagnostic } from "@/hooks/use-diagnostic";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useDemonstrationMode } from "../use-demonstration-mode";

interface SubmitResultProps {
  currentTest: DiagnosticTest | null;
  answers: Record<string, string>;
  timeStarted: Date | null;
}

export const useSubmitResult = ({
  currentTest,
  answers,
  timeStarted
}: SubmitResultProps) => {
  const { profile } = useAuth();
  const { submitDiagnosticResult } = useDiagnostic();
  const { demoActivated, getDemoDiagnosticResult } = useDemonstrationMode();
  
  const handleFinishTest = useCallback(async () => {
    if (!currentTest) {
      toast({
        title: "Error",
        description: "No hay un diagnóstico activo para finalizar",
        variant: "destructive"
      });
      return null;
    }
    
    if (!timeStarted) {
      toast({
        title: "Error",
        description: "No se pudo determinar el tiempo de inicio del diagnóstico",
        variant: "destructive"
      });
      return null;
    }
    
    if (Object.keys(answers).length === 0) {
      toast({
        title: "Error",
        description: "No has contestado ninguna pregunta",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      // Calcular tiempo en minutos
      const endTime = new Date();
      const timeSpentMinutes = Math.round((endTime.getTime() - timeStarted.getTime()) / 60000);
      
      let result: DiagnosticResult | null = null;
      
      // Si estamos en modo demostración, generar resultados locales
      if (demoActivated) {
        result = getDemoDiagnosticResult();
        
        toast({
          title: "Resultados generados",
          description: "Se han generado resultados de demostración",
        });
      } else {
        // Si no estamos en demo, usar el flujo normal
        if (!profile) {
          toast({
            title: "Error",
            description: "Debes iniciar sesión para guardar resultados",
            variant: "destructive"
          });
          return null;
        }
        
        result = await submitDiagnosticResult(
          profile.id,
          currentTest.id,
          answers,
          timeSpentMinutes
        );
        
        if (result) {
          toast({
            title: "Diagnóstico completado",
            description: "Tus resultados han sido guardados correctamente",
          });
        }
      }
      
      return result;
    } catch (error) {
      console.error("Error al finalizar el diagnóstico:", error);
      
      // Mostrar mensaje de error al usuario
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar tus resultados. Intenta nuevamente más tarde.",
        variant: "destructive"
      });
      
      // Si hay error pero estamos en modo demostración, generar resultados locales
      if (demoActivated) {
        return getDemoDiagnosticResult();
      }
      
      return null;
    }
  }, [currentTest, answers, timeStarted, profile, submitDiagnosticResult, demoActivated, getDemoDiagnosticResult]);
  
  return {
    handleFinishTest
  };
};
