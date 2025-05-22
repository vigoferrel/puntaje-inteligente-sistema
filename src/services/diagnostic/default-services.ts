
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { DiagnosticTest } from "@/types/diagnostic";
import { generateDiagnostic } from "../openrouter/diagnostics";
import { TPAESHabilidad } from "@/types/system-types";
import { saveDiagnostic } from "../openrouter/diagnostics";
import { fetchDiagnosticTests } from "./test-services";
import { fetchSkillsForTest } from "./skill-services";

/**
 * Genera y guarda un diagnóstico por defecto para un testId específico
 */
export const generateDefaultDiagnostic = async (testId: number): Promise<string | null> => {
  try {
    console.log(`Iniciando generación de diagnóstico para test ID: ${testId}`);
    
    // Obtener las habilidades asociadas al test
    const skills = await fetchSkillsForTest(testId);
    
    if (!skills || skills.length === 0) {
      console.error(`No se encontraron habilidades para el test ${testId}`);
      throw new Error(`No hay habilidades definidas para este test (ID: ${testId})`);
    }
    
    // Mapear las skills a sus códigos
    const skillCodes = skills.map(skill => skill.code as TPAESHabilidad);
    console.log(`Habilidades encontradas para test ${testId}:`, skillCodes);
    
    // Generar el diagnóstico usando el servicio de OpenRouter
    const diagnostic = await generateDiagnostic(testId, skillCodes);
    
    if (!diagnostic || !diagnostic.exercises || diagnostic.exercises.length === 0) {
      console.error(`Diagnóstico generado sin ejercicios válidos`, diagnostic);
      throw new Error(`No se pudieron generar ejercicios válidos para el diagnóstico`);
    }
    
    // Guardar el diagnóstico en la base de datos
    const diagnosticId = await saveDiagnostic(diagnostic, testId);
    
    if (!diagnosticId) {
      console.error(`No se pudo guardar el diagnóstico generado`);
      throw new Error(`Error al guardar el diagnóstico en la base de datos`);
    }
    
    console.log(`Diagnóstico generado correctamente con ID: ${diagnosticId}`);
    return diagnosticId;
  } catch (error) {
    console.error(`Error al generar diagnóstico por defecto:`, error);
    toast({
      title: "Error al generar diagnóstico",
      description: error instanceof Error ? error.message : "Se produjo un error inesperado",
      variant: "destructive"
    });
    return null;
  }
};

/**
 * Asegura que exista al menos un diagnóstico por defecto
 */
export const ensureDefaultDiagnosticsExist = async (): Promise<boolean> => {
  try {
    // Verificar si ya existen diagnósticos
    const { data: existingTests } = await supabase
      .from('diagnostic_tests')
      .select('id')
      .limit(1);
    
    if (existingTests && existingTests.length > 0) {
      console.log('Se encontraron diagnósticos existentes, no es necesario generar más.');
      return true;
    }
    
    console.log('No se encontraron diagnósticos, generando uno por defecto...');
    
    // Intentar generar diagnósticos para los primeros 5 tests
    const testIds = [1, 2, 3, 4, 5];
    
    // Intentar generar para cada uno hasta que tengamos éxito
    for (const testId of testIds) {
      try {
        const newDiagnosticId = await generateDefaultDiagnostic(testId);
        if (newDiagnosticId) {
          console.log(`Diagnóstico generado exitosamente para test ${testId} con ID ${newDiagnosticId}`);
          return true;
        }
      } catch (err) {
        console.error(`Error al generar diagnóstico para test ${testId}:`, err);
        // Continuar con el siguiente testId
      }
    }
    
    console.error('No se pudo generar ningún diagnóstico por defecto');
    return false;
  } catch (error) {
    console.error('Error al asegurar diagnósticos por defecto:', error);
    return false;
  }
};

/**
 * Crea diagnósticos locales mínimos cuando la generación en línea falla
 */
export const createLocalFallbackDiagnostics = async (): Promise<boolean> => {
  try {
    // Verificar si ya existen diagnósticos
    const { data: existingTests } = await supabase
      .from('diagnostic_tests')
      .select('id')
      .limit(1);
    
    if (existingTests && existingTests.length > 0) {
      console.log('Se encontraron diagnósticos existentes, no es necesario crear fallbacks.');
      return true;
    }
    
    // Crear diagnósticos locales mínimos
    const fallbackDiagnostics = [
      {
        title: "Diagnóstico de Comprensión Lectora",
        description: "Evaluación básica de habilidades de comprensión lectora",
        test_id: 1
      },
      {
        title: "Diagnóstico de Matemáticas (M1)",
        description: "Evaluación básica de habilidades matemáticas nivel 1",
        test_id: 2
      },
      {
        title: "Diagnóstico de Matemáticas (M2)",
        description: "Evaluación básica de habilidades matemáticas nivel 2",
        test_id: 3
      }
    ];
    
    const { data: insertedDiagnostics, error } = await supabase
      .from('diagnostic_tests')
      .insert(fallbackDiagnostics)
      .select();
    
    if (error || !insertedDiagnostics) {
      console.error('Error al crear diagnósticos fallback:', error);
      return false;
    }
    
    // Para cada diagnóstico, crear ejercicios básicos
    for (const diagnostic of insertedDiagnostics) {
      const skills = await fetchSkillsForTest(diagnostic.test_id);
      
      if (!skills || skills.length === 0) continue;
      
      // Crear ejercicio básico por cada habilidad
      for (const skill of skills.slice(0, 3)) { // Máximo 3 ejercicios por diagnóstico
        await supabase.from('exercises').insert({
          diagnostic_id: diagnostic.id,
          node_id: '00000000-0000-0000-0000-000000000000',
          test_id: diagnostic.test_id,
          skill_id: skill.id,
          question: `Pregunta de ejemplo para la habilidad ${skill.name}`,
          options: ["Opción A", "Opción B", "Opción C", "Opción D"],
          correct_answer: "Opción A",
          explanation: "Esta es una pregunta de ejemplo creada automáticamente",
          difficulty: "basic"
        });
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error al crear diagnósticos fallback:', error);
    return false;
  }
};
