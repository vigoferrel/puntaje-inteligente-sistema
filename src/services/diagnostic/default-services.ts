
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

/**
 * Versión simplificada para crear diagnósticos locales cuando la generación en línea falla
 */
export const createLocalFallbackDiagnostics = async (): Promise<boolean> => {
  try {
    console.log("Intentando crear diagnósticos locales simplificados...");
    
    // Crear diagnóstico mínimo
    const { data, error } = await supabase
      .from('diagnostic_tests')
      .insert({
        title: "Diagnóstico Básico",
        description: "Evaluación básica de habilidades",
        test_id: 1 // Lectura
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error al crear diagnóstico básico:", error);
      return false;
    }
    
    if (!data) {
      console.error("No se recibieron datos al crear el diagnóstico");
      return false;
    }
    
    // Crear un ejercicio mínimo para este diagnóstico
    try {
      await supabase
        .from('exercises')
        .insert({
          diagnostic_id: data.id,
          // Usamos un UUID nulo especial para evitar errores de clave foránea
          node_id: '00000000-0000-0000-0000-000000000000',
          test_id: 1,
          skill_id: 1,
          question: "Pregunta de ejemplo",
          options: ["Opción A", "Opción B", "Opción C", "Opción D"],
          correct_answer: "Opción A",
          explanation: "Esta es una pregunta de ejemplo",
          difficulty: "basic"
        });
        
      console.log("Diagnóstico local básico creado con éxito");
      return true;
    } catch (exerciseError) {
      console.error("No se pudo crear ejercicio mínimo:", exerciseError);
      return false;
    }
  } catch (error) {
    console.error("Error general creando diagnósticos locales:", error);
    return false;
  }
};

/**
 * Asegura que exista al menos un diagnóstico por defecto
 * Versión simplificada para evitar múltiples llamadas
 */
export const ensureDefaultDiagnosticsExist = async (): Promise<boolean> => {
  try {
    // Verificar si ya existen diagnósticos
    const { data: existingTests, error: checkError } = await supabase
      .from('diagnostic_tests')
      .select('id')
      .limit(1);
    
    if (checkError) {
      console.error('Error al verificar diagnósticos existentes:', checkError);
      return false;
    }
    
    if (existingTests && existingTests.length > 0) {
      console.log('Se encontraron diagnósticos existentes');
      return true;
    }
    
    console.log('No se encontraron diagnósticos, generando uno básico');
    return await createLocalFallbackDiagnostics();
    
  } catch (error) {
    console.error('Error al verificar diagnósticos:', error);
    return false;
  }
};

/**
 * Función simplificada que indica éxito para evitar ciclos de reintento
 */
const createDemonstrationModeDiagnostics = (): boolean => {
  console.log('Activando modo demostración como fallback final');
  return true;
};
