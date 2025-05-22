
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
        
        // Para generate_exercise, el resultado ya debería ser un objeto
        if (action === 'generate_exercise') {
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
