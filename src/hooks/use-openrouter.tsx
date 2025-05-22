
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { ImageAnalysisResult } from "@/types/ai-types";
import { openRouterService } from "@/services/openrouter/core";
import { processImageWithOpenRouter } from "@/services/openrouter/image-processing";

export function useOpenRouter() {
  const [loading, setLoading] = useState(false);

  /**
   * Generic function to call the OpenRouter service with improved logging
   */
  const callOpenRouter = async <T,>(action: string, payload: any): Promise<T | null> => {
    try {
      setLoading(true);
      console.log(`useOpenRouter: llamando a ${action}`, payload);
      
      if (!payload) {
        console.error("Error: Payload es requerido");
        throw new Error("Payload es requerido");
      }
      
      // Si estamos llamando a generate_exercise, asegurarnos que los parámetros sean válidos
      if (action === "generate_exercise") {
        if (!payload.skill) {
          console.warn("Advertencia: 'skill' no especificada en generate_exercise");
        }
        if (!payload.prueba) {
          console.warn("Advertencia: 'prueba' no especificada en generate_exercise");
        }
      }
      
      // Llamar al servicio con manejo de tiempo de espera
      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => reject(new Error("Tiempo de espera agotado")), 25000);
      });
      
      const resultPromise = openRouterService<T>({ action, payload });
      const result = await Promise.race([resultPromise, timeoutPromise]) as T;
      
      console.log(`useOpenRouter: respuesta de ${action}`, result);
      
      if (!result) {
        throw new Error(`No se recibió respuesta para la acción ${action}`);
      }
      
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error en la solicitud a OpenRouter';
      console.error('useOpenRouter error:', error);
      console.error('Detalles del error:', { action, payload });
      
      toast({
        title: "Error de conexión",
        description: "Hubo un problema al conectar con el servicio. Inténtalo de nuevo.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Process an image using OpenRouter's vision capabilities
   */
  const processImage = async (imageData: string, prompt?: string, context?: string): Promise<ImageAnalysisResult | null> => {
    try {
      setLoading(true);
      
      console.log('useOpenRouter: procesando imagen con prompt:', prompt);
      
      // Process the image and get the result
      const result = await processImageWithOpenRouter(imageData, prompt, context);
      
      // If null result, return null
      if (!result) {
        console.log('useOpenRouter: received null result from processImageWithOpenRouter');
        return { response: "No se pudo analizar la imagen" };
      }
      
      console.log('useOpenRouter: received result from processImageWithOpenRouter', result);
      
      // If the result is already properly formatted
      if (typeof result === 'object' && result !== null && 'response' in result) {
        return result as ImageAnalysisResult;
      }
      
      // If result is a string, wrap it in an object
      if (typeof result === 'string') {
        return { response: result };
      }
      
      // Default fallback - ensure response property exists
      return { 
        response: typeof result === 'object' ? 
          JSON.stringify(result) : 
          "No se pudo procesar correctamente la imagen."
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error procesando la imagen';
      console.error('useOpenRouter processImage error:', message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
      return {
        response: "Hubo un error al procesar la imagen. Por favor intenta de nuevo."
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    callOpenRouter,
    processImage,
    loading
  };
}
