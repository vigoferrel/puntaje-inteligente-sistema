
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { DiagnosticTest } from "@/types/diagnostic";
import { TPAESPrueba } from "@/types/system-types";
import { mapTestIdToEnum } from "@/utils/supabase-mappers";
import { 
  generateExercisesForNode, 
  generateDiagnosticTest, 
  fetchAndGenerateDiagnostics 
} from "@/services/diagnostic-generator";

export const useDiagnosticGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [diagnostics, setDiagnostics] = useState<DiagnosticTest[]>([]);
  
  /**
   * Genera ejercicios para un nodo específico
   */
  const generateNodeExercises = async (
    nodeId: string,
    skillId: number,
    testId: number,
    count: number = 5
  ): Promise<boolean> => {
    try {
      setLoading(true);
      return await generateExercisesForNode(nodeId, skillId, testId, count);
    } catch (error) {
      console.error('Error en generateNodeExercises:', error);
      toast({
        title: "Error",
        description: "Error al generar ejercicios para el nodo",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Genera un diagnóstico completo
   */
  const generateFullDiagnostic = async (
    testId: number,
    title?: string,
    description?: string
  ): Promise<string | null> => {
    try {
      setLoading(true);
      const newDiagnosticId = await generateDiagnosticTest(testId, title, description);
      
      // Actualizar la lista de diagnósticos si se creó uno nuevo
      if (newDiagnosticId) {
        const result = await fetchAndGenerateDiagnostics(testId);
        setDiagnostics(result.diagnostics as DiagnosticTest[]);
      }
      
      return newDiagnosticId;
    } catch (error) {
      console.error('Error en generateFullDiagnostic:', error);
      toast({
        title: "Error",
        description: "Error al generar el diagnóstico completo",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Carga diagnósticos existentes y proporciona función para generar nuevos
   */
  const loadDiagnostics = async (testId?: number): Promise<{
    diagnostics: DiagnosticTest[],
    generateNew: (title?: string, description?: string) => Promise<string | null>
  }> => {
    try {
      setLoading(true);
      const { diagnostics: fetchedDiagnostics, generateNewDiagnostic } = await fetchAndGenerateDiagnostics(testId);
      
      setDiagnostics(fetchedDiagnostics as DiagnosticTest[]);
      
      return {
        diagnostics: fetchedDiagnostics as DiagnosticTest[],
        generateNew: async (title?: string, description?: string) => {
          const newId = await generateNewDiagnostic(title, description);
          // Recargar la lista después de generar uno nuevo
          if (newId) {
            const result = await fetchAndGenerateDiagnostics(testId);
            setDiagnostics(result.diagnostics as DiagnosticTest[]);
          }
          return newId;
        }
      };
    } catch (error) {
      console.error('Error en loadDiagnostics:', error);
      toast({
        title: "Error",
        description: "Error al cargar los diagnósticos",
        variant: "destructive"
      });
      return {
        diagnostics: [],
        generateNew: async () => null
      };
    } finally {
      setLoading(false);
    }
  };
  
  return {
    loading,
    diagnostics,
    generateNodeExercises,
    generateFullDiagnostic,
    loadDiagnostics
  };
};
