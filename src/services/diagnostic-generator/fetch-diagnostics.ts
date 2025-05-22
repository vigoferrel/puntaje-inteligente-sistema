
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { DiagnosticTest } from "@/types/diagnostic";
import { DiagnosticGeneratorService } from "./types";
import { generateDiagnosticTest } from "./diagnostic-test";

/**
 * Obtiene los diagnósticos existentes y permite generar uno nuevo
 */
export const fetchAndGenerateDiagnostics = async (
  testId?: number
): Promise<{
  diagnostics: DiagnosticTest[],
  generateNewDiagnostic: (title?: string, description?: string) => Promise<string | null>
}> => {
  try {
    // Obtener los diagnósticos existentes
    let query = supabase.from('diagnostic_tests').select('*');
    
    if (testId) {
      query = query.eq('test_id', testId);
    }
    
    const { data: dbDiagnostics, error } = await query;
    
    if (error) {
      console.error('Error al obtener los diagnósticos:', error);
      toast({
        title: "Error",
        description: "No se pudieron obtener los diagnósticos existentes",
        variant: "destructive"
      });
      return { 
        diagnostics: [], 
        generateNewDiagnostic: async () => null 
      };
    }
    
    // Transformar los datos de la base de datos a nuestro formato DiagnosticTest
    const diagnostics: DiagnosticTest[] = (dbDiagnostics || []).map(diagnostic => ({
      id: diagnostic.id,
      title: diagnostic.title,
      description: diagnostic.description || '',
      testId: diagnostic.test_id,
      questions: [], // Inicialmente vacío, se cargaría con otra consulta si es necesario
      isCompleted: false // Por defecto no completado
    }));
    
    // Función para generar un nuevo diagnóstico
    const generateNewDiagnostic = async (title?: string, description?: string): Promise<string | null> => {
      if (!testId) {
        toast({
          title: "Error",
          description: "Se requiere un ID de test para generar un diagnóstico",
          variant: "destructive"
        });
        return null;
      }
      
      return await generateDiagnosticTest(testId, title, description);
    };
    
    return {
      diagnostics,
      generateNewDiagnostic
    };
  } catch (error) {
    console.error('Error al obtener y preparar generación de diagnósticos:', error);
    toast({
      title: "Error",
      description: "Ocurrió un error al preparar la generación de diagnósticos",
      variant: "destructive"
    });
    return { 
      diagnostics: [], 
      generateNewDiagnostic: async () => null 
    };
  }
};
