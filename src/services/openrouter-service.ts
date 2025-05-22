import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ImageAnalysisResult, Exercise, AIAnalysis, AIFeedback } from "@/types/ai-types";

interface OpenRouterServiceOptions {
  action: string;
  payload: any;
}

/**
 * Main service function for OpenRouter API calls
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
      if (data.fallbackResponse) {
        console.log('Using fallback response:', data.fallbackResponse);
        return data.fallbackResponse as T;
      }
      
      throw new Error(`Error de OpenRouter: ${data.error}`);
    }
    
    if (data && data.result) {
      try {
        // For image processing
        if (action === 'process_image') {
          console.log('Image processing result received:', data.result);
          return data.result as unknown as T;
        }
        
        // Para generate_exercise o generate_exercises_batch, el resultado ya debería ser un objeto o array
        if (action === 'generate_exercise' || action === 'generate_exercises_batch') {
          console.log('Exercise data received:', data.result);
          return data.result as unknown as T;
        }
        
        // Para provide_feedback, asegurarse de que tenemos una respuesta
        if (action === 'provide_feedback') {
          if (typeof data.result === 'string') {
            return { response: data.result } as unknown as T;
          }
          return data.result as unknown as T;
        }

        // Para analyze_performance, convertir el resultado a AIAnalysis
        if (action === 'analyze_performance') {
          if (typeof data.result === 'string') {
            try {
              return JSON.parse(data.result) as T;
            } catch (e) {
              return { 
                strengths: [], 
                areasForImprovement: [], 
                recommendations: [],
                nextSteps: []
              } as unknown as T;
            }
          }
          return data.result as unknown as T;
        }

        // Para generate_diagnostic, convertir el resultado
        if (action === 'generate_diagnostic') {
          console.log('Diagnostic data received:', data.result);
          return data.result as unknown as T;
        }
        
        // Para otros casos, intentar parsear si es un string
        if (typeof data.result === 'string') {
          try {
            return JSON.parse(data.result) as T;
          } catch (e) {
            console.log('Result is a string but not JSON, returning as is');
            return data.result as unknown as T;
          }
        }
        return data.result as unknown as T;
      } catch (parseError) {
        console.error('Error parsing result:', parseError);
        console.log('Raw result:', data.result);
        
        // Return the raw result if parsing fails
        return data.result as unknown as T;
      }
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
 * Genera un diagnóstico completo para un conjunto de habilidades y test
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
    
    if (!result || !result.exercises || !Array.isArray(result.exercises)) {
      console.error('No se generó el diagnóstico o el formato es inválido');
      return {
        title: `Diagnóstico para Test ${testId}`,
        description: "Diagnóstico generado automáticamente",
        exercises: []
      };
    }
    
    console.log(`Generado diagnóstico con ${result.exercises.length} ejercicios`);
    return result;
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
 * Guarda un diagnóstico generado en la base de datos
 */
export const saveDiagnostic = async (
  diagnostic: {title: string, description: string, exercises: Exercise[]},
  testId: number
): Promise<string | null> => {
  try {
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
    
    // Guardar los ejercicios asociados al diagnóstico uno por uno
    for (const exercise of diagnostic.exercises) {
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
      
      const { error: exerciseError } = await supabase
        .from('exercises')
        .insert({
          diagnostic_id: diagnosticId,
          node_id: '00000000-0000-0000-0000-000000000000', // Valor de marcador de posición para satisfacer el esquema
          test_id: testId,
          skill_id: typeof exercise.skill === 'number' ? 
            exercise.skill : 
            1, // Default skill_id if not provided
          question: exercise.question,
          options: exercise.options,
          correct_answer: exercise.correctAnswer,
          explanation: exercise.explanation || '',
          difficulty: mappedDifficulty
        });
      
      if (exerciseError) {
        console.error('Error al guardar el ejercicio:', exerciseError);
        // Continuar con el siguiente ejercicio incluso si uno falla
      }
    }
    
    return diagnosticId;
  } catch (error) {
    console.error('Error al guardar diagnóstico en la base de datos:', error);
    return null;
  }
};
