
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface OpenRouterRequest {
  action: string;
  payload: any;
}

/**
 * Servicio central para llamar a las Edge Functions de OpenRouter
 */
export const openRouterService = async <T>(request: OpenRouterRequest): Promise<T | null> => {
  try {
    console.log(`OpenRouter: Iniciando petición a ${request.action}`, { payload: request.payload });
    
    // Mostrar un mensaje visual mientras carga si es una acción de duración considerable
    if (['generate_exercise', 'generate_exercises_batch', 'generate_diagnostic'].includes(request.action)) {
      toast({
        title: "Generando contenido",
        description: "Esto puede tomar unos segundos...",
      });
    }
    
    const { data, error } = await supabase.functions.invoke<T>('openrouter-ai', {
      body: {
        action: request.action,
        payload: request.payload,
        requestId: crypto.randomUUID() // Para seguimiento
      }
    });
    
    if (error) {
      console.error(`OpenRouter Error (${request.action}):`, error);
      throw new Error(`Error en OpenRouter: ${error.message}`);
    }
    
    if (!data) {
      console.error(`OpenRouter: No hay datos en la respuesta para ${request.action}`);
      throw new Error('No se recibieron datos de la función');
    }
    
    console.log(`OpenRouter: Respuesta exitosa de ${request.action}`, data);
    return data;
    
  } catch (error) {
    console.error('OpenRouter Service Error:', error);
    const message = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(`Error al contactar el servicio de IA: ${message}`);
  }
};

/**
 * Función específica para procesar imágenes a través de OpenRouter
 */
export const processImageWithOpenRouter = async (
  imageData: string,
  prompt?: string,
  context?: string
): Promise<any> => {
  try {
    console.log('OpenRouter: Procesando imagen');
    const response = await openRouterService({
      action: 'process_image',
      payload: {
        image: imageData,
        prompt: prompt || "Describe esta imagen en detalle",
        context: context
      }
    });
    
    return response;
  } catch (error) {
    console.error('Error al procesar imagen con OpenRouter:', error);
    throw error;
  }
};
