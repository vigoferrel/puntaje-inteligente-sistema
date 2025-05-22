
import { DiagnosticTest, DiagnosticQuestion } from "@/types/diagnostic";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a local fallback diagnostic test
 */
export async function createLocalFallbackDiagnostics(): Promise<boolean> {
  try {
    console.log("Creando diagnósticos locales de respaldo...");
    
    const basicDiagnostic: Partial<DiagnosticTest> = {
      title: "Diagnóstico Básico de Comprensión Lectora",
      description: "Evalúa tus habilidades básicas de comprensión de textos",
      testId: 1, // Suponiendo que 1 es el ID del test Comprensión Lectora
    };
    
    // Crear el diagnóstico en Supabase
    const { data: diagnosticData, error: diagnosticError } = await supabase
      .from('diagnostic_tests')
      .insert({
        title: basicDiagnostic.title,
        description: basicDiagnostic.description,
        test_id: basicDiagnostic.testId
      })
      .select()
      .single();
      
    if (diagnosticError) {
      console.error("Error al crear diagnóstico local:", diagnosticError);
      return false;
    }
    
    if (!diagnosticData) {
      console.error("No se recibieron datos al crear el diagnóstico local");
      return false;
    }
    
    const diagnosticId = diagnosticData.id;
    
    // Preguntas de ejemplo
    const questions = [
      {
        question: "¿Cuál es la idea principal del párrafo?",
        options: [
          "La importancia de la lectura",
          "El desarrollo de la escritura",
          "La evolución del lenguaje",
          "Los beneficios de la comprensión lectora"
        ],
        correctAnswer: "La importancia de la lectura",
        skill: 1, // TRACK_LOCATE
        explanation: "El párrafo se centra en cómo la lectura impacta el desarrollo cognitivo."
      },
      {
        question: "Según el texto, ¿qué relación existe entre los eventos A y B?",
        options: [
          "Causa y efecto",
          "Comparación",
          "Secuencia temporal",
          "No hay relación"
        ],
        correctAnswer: "Causa y efecto",
        skill: 2, // INTERPRET_RELATE
        explanation: "El texto establece que el evento A provocó directamente el evento B."
      },
      {
        question: "¿Cuál es la conclusión más adecuada para este argumento?",
        options: [
          "El argumento es válido y sólido",
          "El argumento tiene premisas falsas",
          "El argumento contiene una falacia",
          "El argumento es circular"
        ],
        correctAnswer: "El argumento contiene una falacia",
        skill: 3, // EVALUATE_REFLECT
        explanation: "El argumento presenta una falacia de generalización apresurada."
      }
    ];
    
    // Guardar las preguntas de ejemplo
    for (const q of questions) {
      const { error: exerciseError } = await supabase
        .from('exercises')
        .insert({
          diagnostic_id: diagnosticId,
          node_id: '00000000-0000-0000-0000-000000000000', // Placeholder
          test_id: basicDiagnostic.testId,
          skill_id: q.skill,
          question: q.question,
          options: q.options,
          correct_answer: q.correctAnswer,
          explanation: q.explanation,
          difficulty: 'basic'
        });
      
      if (exerciseError) {
        console.error("Error al crear ejercicio:", exerciseError);
        // No fallamos la operación completa si un ejercicio falla
      }
    }
    
    console.log("Diagnóstico local creado con éxito:", diagnosticId);
    return true;
    
  } catch (error) {
    console.error("Error al crear diagnóstico local fallback:", error);
    return false;
  }
}

/**
 * Ensures that default diagnostics exist, creating them if needed
 */
export async function ensureDefaultDiagnosticsExist(): Promise<boolean> {
  try {
    // Verificar si ya existen diagnósticos
    const { data: existingTests, error: fetchError } = await supabase
      .from('diagnostic_tests')
      .select('id, title, description')
      .limit(1);
    
    if (fetchError) {
      console.error("Error al verificar diagnósticos:", fetchError);
      return false;
    }
    
    if (existingTests && existingTests.length > 0) {
      console.log("Ya existen diagnósticos en el sistema:", existingTests.length);
      return true;
    }
    
    // Si no hay diagnósticos, crear uno básico
    return await createLocalFallbackDiagnostics();
    
  } catch (error) {
    console.error("Error al asegurar diagnósticos:", error);
    return false;
  }
}
