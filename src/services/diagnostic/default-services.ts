
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
    
    // Determinar qué prueba usar (Matemáticas = 1 por defecto)
    const testId = 1;
    
    // Generar un diagnóstico utilizando el generador existente
    const diagnosticId = await generateDiagnosticTest(
      testId,
      "Diagnóstico Inicial de Matemáticas",
      "Este diagnóstico evaluará tus habilidades matemáticas básicas para crear un plan de estudio personalizado."
    );
    
    // Verificar resultado
    if (diagnosticId) {
      console.log('Diagnóstico por defecto generado con ID:', diagnosticId);
      return true;
    } else {
      console.error('No se pudo generar el diagnóstico por defecto');
      return false;
    }
  } catch (error) {
    console.error('Error al generar diagnóstico por defecto:', error);
    return false;
  }
};
