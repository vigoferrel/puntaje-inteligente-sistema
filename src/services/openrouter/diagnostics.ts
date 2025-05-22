
import { supabase } from "@/integrations/supabase/client";
import { Exercise } from "@/types/ai-types";
import { openRouterService } from "./core";

/**
 * Genera un diagnóstico completo para un conjunto de habilidades y test con mejor manejo de errores
 */
export const generateDiagnostic = async (
  testId: number,
  skills: string[],
  exercisesPerSkill: number = 3,
  difficulty: string = 'MIXED'
): Promise<{title: string, description: string, exercises: Exercise[]}> => {
  try {
    console.log(`Generando diagnóstico para test ${testId} con ${skills.length} habilidades`);
    
    const result = await openRouterService<{title: string, description: string, exercises: Exercise[]}>({
      action: 'generate_diagnostic',
      payload: {
        testId,
        skills,
        exercisesPerSkill,
        difficulty,
        retry: true,
        retryCount: 0
      }
    });
    
    // Validación mejorada del resultado
    if (!result) {
      console.error('No se recibió resultado al generar el diagnóstico');
      return {
        title: `Diagnóstico para Test ${testId}`,
        description: "No se pudo generar el diagnóstico automáticamente",
        exercises: []
      };
    }
    
    if (!result.exercises || !Array.isArray(result.exercises)) {
      console.error('El formato del diagnóstico recibido es inválido', result);
      return {
        title: result.title || `Diagnóstico para Test ${testId}`,
        description: result.description || "El diagnóstico generado tiene un formato inválido",
        exercises: []
      };
    }
    
    // Validar que hay al menos un ejercicio
    if (result.exercises.length === 0) {
      console.error('El diagnóstico generado no contiene ejercicios');
      return {
        title: result.title || `Diagnóstico para Test ${testId}`,
        description: result.description || "El diagnóstico generado no contiene ejercicios",
        exercises: []
      };
    }
    
    console.log(`Generado diagnóstico con ${result.exercises.length} ejercicios`);
    
    // Validar cada ejercicio
    const validExercises = result.exercises.filter(exercise => 
      exercise.question && 
      Array.isArray(exercise.options) && 
      exercise.options.length > 0 &&
      exercise.correctAnswer
    );
    
    if (validExercises.length < result.exercises.length) {
      console.warn(`Se filtraron ${result.exercises.length - validExercises.length} ejercicios inválidos`);
    }
    
    return {
      title: result.title,
      description: result.description,
      exercises: validExercises
    };
  } catch (error) {
    console.error('Error al generar diagnóstico:', error);
    return {
      title: `Diagnóstico para Test ${testId}`,
      description: "Error al generar el diagnóstico",
      exercises: []
    };
  }
};

/**
 * Guarda un diagnóstico generado en la base de datos con mejor validación
 */
export const saveDiagnostic = async (
  diagnostic: {title: string, description: string, exercises: Exercise[]},
  testId: number
): Promise<string | null> => {
  try {
    // Validar el diagnóstico antes de guardarlo
    if (!diagnostic.title || !diagnostic.description || 
        !Array.isArray(diagnostic.exercises) || diagnostic.exercises.length === 0) {
      console.error('Diagnóstico inválido', diagnostic);
      return null;
    }
    
    // Crear el diagnóstico en la base de datos
    const { data: diagnosticData, error: diagnosticError } = await supabase
      .from('diagnostic_tests')
      .insert({
        title: diagnostic.title,
        description: diagnostic.description,
        test_id: testId
      })
      .select()
      .single();
    
    if (diagnosticError) {
      console.error('Error al guardar el diagnóstico:', diagnosticError);
      return null;
    }
    
    if (!diagnosticData) {
      console.error('No se recibieron datos al guardar el diagnóstico');
      return null;
    }
    
    const diagnosticId = diagnosticData.id;
    console.log(`Diagnóstico creado con ID: ${diagnosticId}, guardando ${diagnostic.exercises.length} ejercicios`);
    
    // Contador para ejercicios guardados correctamente
    let successCount = 0;
    
    // Guardar los ejercicios asociados al diagnóstico uno por uno
    for (const exercise of diagnostic.exercises) {
      try {
        // Mapear el string de dificultad a uno de los valores permitidos
        let mappedDifficulty: "basic" | "intermediate" | "advanced" = "intermediate";
        
        if (typeof exercise.difficulty === 'string') {
          const difficultyLower = exercise.difficulty.toLowerCase();
          if (difficultyLower === 'basic' || difficultyLower === 'easy') {
            mappedDifficulty = 'basic';
          } else if (difficultyLower === 'intermediate' || difficultyLower === 'medium') {
            mappedDifficulty = 'intermediate';
          } else if (difficultyLower === 'advanced' || difficultyLower === 'hard') {
            mappedDifficulty = 'advanced';
          }
        }
        
        // Validar que las opciones sean correctas
        const options = Array.isArray(exercise.options) ? 
          exercise.options : 
          typeof exercise.options === 'string' ? [exercise.options] : [];
        
        const { error: exerciseError } = await supabase
          .from('exercises')
          .insert({
            diagnostic_id: diagnosticId,
            node_id: '00000000-0000-0000-0000-000000000000', // Valor de marcador de posición
            test_id: testId,
            skill_id: typeof exercise.skill === 'number' ? 
              exercise.skill : 
              1, // Default skill_id if not provided
            question: exercise.question,
            options: options,
            correct_answer: exercise.correctAnswer,
            explanation: exercise.explanation || '',
            difficulty: mappedDifficulty
          });
        
        if (exerciseError) {
          console.error('Error al guardar el ejercicio:', exerciseError);
          // Continuar con el siguiente ejercicio incluso si uno falla
        } else {
          successCount++;
        }
      } catch (exerciseError) {
        console.error('Error al procesar ejercicio:', exerciseError);
      }
    }
    
    console.log(`Guardados ${successCount}/${diagnostic.exercises.length} ejercicios correctamente`);
    
    // Si no se guardó ningún ejercicio, considerarlo un fallo
    if (successCount === 0 && diagnostic.exercises.length > 0) {
      console.error('No se pudo guardar ningún ejercicio');
      
      // Eliminar el diagnóstico vacío
      await supabase
        .from('diagnostic_tests')
        .delete()
        .eq('id', diagnosticId);
        
      return null;
    }
    
    return diagnosticId;
  } catch (error) {
    console.error('Error al guardar diagnóstico en la base de datos:', error);
    return null;
  }
};
