
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
      
      // Si estamos en modo demostración o detectamos algún error, generar resultados locales
      if (demoActivated) {
        const result = getDemoDiagnosticResult();
        
        toast({
          title: "Resultados generados",
          description: "Se han generado resultados de demostración",
        });
        
        return result;
      } 
      
      // Solo intentamos guardar en la base de datos si NO estamos en modo demostración
      if (!profile) {
        toast({
          title: "Error",
          description: "Debes iniciar sesión para guardar resultados",
          variant: "destructive"
        });
        
        // Devolver resultados de demostración como fallback
        return getDemoDiagnosticResult();
      }
      
      try {
        const result = await submitDiagnosticResult(
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
          return result;
        } else {
          // Si submitDiagnosticResult falla, usar resultados de demostración
          const demoResult = getDemoDiagnosticResult();
          toast({
            title: "Resultados generados",
            description: "Se han generado resultados de demostración debido a un error",
          });
          return demoResult;
        }
      } catch (error) {
        console.error("Error al enviar resultados:", error);
        // Usar resultados de demostración como fallback
        const demoResult = getDemoDiagnosticResult();
        toast({
          title: "Resultados de demostración",
          description: "Se han generado resultados de demostración debido a un error de guardado",
        });
        return demoResult;
      }
    } catch (error) {
      console.error("Error general al finalizar el diagnóstico:", error);
      
      // Si hay cualquier error, usar resultados de demostración
      const demoResult = getDemoDiagnosticResult();
      toast({
        title: "Resultados de demostración",
        description: "Se muestran resultados de ejemplo debido a un error",
      });
      return demoResult;
    }
  }, [currentTest, answers, timeStarted, profile, submitDiagnosticResult, demoActivated, getDemoDiagnosticResult]);
  
  return {
    handleFinishTest
  };
};
