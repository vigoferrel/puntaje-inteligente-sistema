
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { generateDiagnosticTest } from "@/services/diagnostic-generator";

/**
 * Genera un diagnóstico predeterminado si no existen diagnósticos
 * @returns boolean Indica si se generó correctamente
 */
export const generateDefaultDiagnostic = async (): Promise<boolean> => {
  try {
    // Verificar si ya existen diagnósticos
    const { count, error } = await supabase
      .from('diagnostic_tests')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error al verificar diagnósticos existentes:', error);
      return false;
    }
    
    // Si ya existen diagnósticos, no crear uno nuevo
    if (count && count > 0) {
      console.log('Ya existen diagnósticos, no se generará uno por defecto');
      return true;
    }
    
    console.log('No se encontraron diagnósticos, generando uno por defecto...');
    
    // Generar diagnósticos para cada prueba PAES disponible
    const { data: tests, error: testsError } = await supabase
      .from('paes_tests')
      .select('id, name');
      
    if (testsError || !tests || tests.length === 0) {
      console.error('Error al obtener pruebas PAES:', testsError);
      
      // Si no hay pruebas disponibles, intentar con Matemáticas (ID=1) por defecto
      const diagnosticId = await generateDiagnosticTest(
        1, // Matemáticas = 1 por defecto
        "Diagnóstico Inicial de Matemáticas",
        "Este diagnóstico evaluará tus habilidades matemáticas básicas para crear un plan de estudio personalizado."
      );
      
      return !!diagnosticId;
    }
    
    // Generar diagnósticos para cada prueba disponible
    const results = await Promise.all(tests.map(async (test) => {
      const title = `Diagnóstico Inicial de ${test.name}`;
      const description = `Este diagnóstico evaluará tus habilidades de ${test.name} para crear un plan de estudio personalizado.`;
      
      try {
        const diagnosticId = await generateDiagnosticTest(
          test.id,
          title,
          description
        );
        
        return { 
          testId: test.id, 
          success: !!diagnosticId,
          diagnosticId 
        };
      } catch (error) {
        console.error(`Error generando diagnóstico para ${test.name}:`, error);
        return { 
          testId: test.id, 
          success: false,
          error 
        };
      }
    }));
    
    // Verificar si al menos uno fue exitoso
    const anySuccess = results.some(r => r.success);
    
    if (anySuccess) {
      console.log('Diagnósticos por defecto generados:', results);
      return true;
    } else {
      console.error('No se pudo generar ningún diagnóstico por defecto');
      return false;
    }
  } catch (error) {
    console.error('Error al generar diagnóstico por defecto:', error);
    return false;
  }
};

/**
 * Asegura que exista al menos un diagnóstico disponible
 * @returns boolean Indica si el sistema tiene diagnósticos disponibles
 */
export const ensureDefaultDiagnosticsExist = async (): Promise<boolean> => {
  try {
    // Verificar si ya existen diagnósticos
    const { count, error } = await supabase
      .from('diagnostic_tests')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error al verificar diagnósticos existentes:', error);
      return false;
    }
    
    // Si ya existen diagnósticos, todo está bien
    if (count && count > 0) {
      return true;
    }
    
    // Si no hay diagnósticos, generar uno por defecto
    return await generateDefaultDiagnostic();
  } catch (error) {
    console.error('Error al verificar/generar diagnósticos:', error);
    return false;
  }
};
