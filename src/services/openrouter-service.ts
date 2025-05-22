import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ImageAnalysisResult, Exercise, AIAnalysis, AIFeedback } from "@/types/ai-types";

interface OpenRouterServiceOptions {
  action: string;
  payload: any;
}

/**
 * Main service function for OpenRouter API calls with enhanced error handling
 */
export const openRouterService = async <T>({ action, payload }: OpenRouterServiceOptions): Promise<T | null> => {
  try {
    console.log(`Calling OpenRouter service with action: ${action}`);
    console.log('Payload:', JSON.stringify(payload).substring(0, 200) + (JSON.stringify(payload).length > 200 ? '...' : ''));
    
    const startTime = Date.now();
    const { data, error } = await supabase.functions.invoke('openrouter-ai', {
      body: {
        action,
        payload
      }
    });
    
    const responseTime = Date.now() - startTime;
    console.log(`OpenRouter response received in ${responseTime}ms:`, data);
    
    if (error) {
      console.error('Supabase functions error:', error);
      throw new Error(`Error en la función de Supabase: ${error.message}`);
    }
    
    if (!data) {
      console.error('No data received from OpenRouter');
      throw new Error('No se recibieron datos desde OpenRouter');
    }
    
    // Si hay un error pero también hay una respuesta de fallback, usamos esa respuesta
    if (data.error) {
      console.error('OpenRouter error:', data.error);
      
      // Si tenemos una respuesta de fallback, la usamos
      if (data.result) {
        console.log('Using result from error response:', data.result);
        return data.result as T;
      }
      
      throw new Error(`Error de OpenRouter: ${data.error}`);
    }
    
    if (data && data.result) {
      return data.result as T;
    }
    
    // No result found in response
    console.warn('No result found in OpenRouter response');
    return null;
  } catch (err) {
    const message = err instanceof Error 
      ? err.message 
      : 'Error en la solicitud a OpenRouter';
    
    console.error('Error in OpenRouter service:', err);
    
    // Only show toast for user-initiated actions, not background tasks
    if (!payload.suppressToast) {
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
    }
    
    // Implement basic retry logic for transient errors
    if (payload.retry && payload.retryCount < 3 && 
        (message.includes('timeout') || message.includes('rate limit'))) {
      console.log(`Retrying request (${payload.retryCount + 1}/3)...`);
      
      // Wait before retrying with exponential backoff
      const backoff = Math.pow(2, payload.retryCount) * 1000;
      await new Promise(resolve => setTimeout(resolve, backoff));
      
      return openRouterService<T>({
        action,
        payload: {
          ...payload,
          retryCount: (payload.retryCount || 0) + 1
        }
      });
    }
    
    return null;
  }
};

/**
 * Processes an image and returns analysis from the AI
 */
export const processImageWithOpenRouter = async (
  imageData: string, 
  prompt?: string, 
  context?: string
): Promise<ImageAnalysisResult | null> => {
  try {
    // Validate image data
    if (!imageData) {
      console.error('No image data provided for processing');
      toast({
        title: "Error",
        description: "No se proporcionó una imagen para procesar",
        variant: "destructive"
      });
      return null;
    }

    console.log('Processing image with prompt:', prompt || 'default prompt');
    
    // Ensure the image data is either a base64 string or a URL
    if (!imageData.startsWith('data:') && !imageData.startsWith('http')) {
      console.error('Invalid image data format');
      toast({
        title: "Error",
        description: "Formato de imagen inválido",
        variant: "destructive"
      });
      return null;
    }

    const result = await openRouterService<ImageAnalysisResult>({
      action: 'process_image',
      payload: {
        image: imageData,
        prompt: prompt || "Analiza esta imagen y extrae todo el texto que puedas encontrar",
        context: context || "Análisis de imagen para comprensión lectora"
      }
    });

    console.log('Image processing result:', result);
    return result;
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : 'Error procesando la imagen';
    
    console.error('Error processing image with OpenRouter:', error);
    
    toast({
      title: "Error",
      description: message,
      variant: "destructive"
    });
    
    return null;
  }
};

/**
 * Generates personalized insights from a user's performance data
 */
export const generatePerformanceInsights = async (
  userId: string,
  performanceData: any
): Promise<AIAnalysis | null> => {
  try {
    return await openRouterService<AIAnalysis>({
      action: 'analyze_performance',
      payload: {
        userId,
        performanceData,
        suppressToast: true, // Don't show errors to user for background tasks
        retry: true,         // Enable retries
        retryCount: 0        // Initial retry count
      }
    });
  } catch (error) {
    console.error('Error generating performance insights:', error);
    return null;
  }
};

/**
 * Provides feedback on a user's answer to an exercise
 */
export const provideFeedback = async (
  userAnswer: string,
  correctAnswer: string,
  context: string
): Promise<AIFeedback | null> => {
  try {
    return await openRouterService<AIFeedback>({
      action: 'provide_feedback',
      payload: {
        userAnswer,
        correctAnswer,
        context
      }
    });
  } catch (error) {
    console.error('Error providing feedback:', error);
    return null;
  }
};

/**
 * Genera un lote de ejercicios para un nodo y habilidad específicos
 */
export const generateExercisesBatch = async (
  nodeId: string,
  skill: string,
  testId: number,
  count: number = 5,
  difficulty: string = 'INTERMEDIATE'
): Promise<Exercise[]> => {
  try {
    console.log(`Generando lote de ${count} ejercicios para skill ${skill}, testId ${testId}`);
    
    const result = await openRouterService<Exercise[]>({
      action: 'generate_exercises_batch',
      payload: {
        nodeId,
        skill,
        testId,
        count,
        difficulty,
        retry: true,
        retryCount: 0
      }
    });
    
    if (!result || !Array.isArray(result)) {
      console.error('No se generaron ejercicios en el lote o el formato es inválido');
      return [];
    }
    
    console.log(`Generados ${result.length} ejercicios para el nodo ${nodeId}`);
    return result;
  } catch (error) {
    console.error('Error al generar lote de ejercicios:', error);
    return [];
  }
};

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
