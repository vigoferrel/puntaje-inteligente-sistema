
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface OpenRouterServiceOptions {
  action: string;
  payload: any;
}

/**
 * Función principal del servicio OpenRouter con manejo mejorado de errores
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
    
    // Si hay metadatos, registrarlos para análisis de rendimiento
    if (data.metadata && data.metadata.modelUsed) {
      console.log(`Respuesta generada usando el modelo: ${data.metadata.modelUsed}`);
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
