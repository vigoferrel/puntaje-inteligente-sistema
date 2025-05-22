
import { useState } from "react";
import { openRouterService, processImageWithOpenRouter } from "@/services/openrouter-service";
import { toast } from "@/components/ui/use-toast";
import { ImageAnalysisResult } from "@/types/ai-types";

export function useOpenRouter() {
  const [loading, setLoading] = useState(false);

  /**
   * Generic function to call the OpenRouter service
   */
  const callOpenRouter = async <T,>(action: string, payload: any): Promise<T | null> => {
    try {
      setLoading(true);
      console.log(`useOpenRouter: calling ${action} with payload`, payload);
      const result = await openRouterService<T>({ action, payload });
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error en la solicitud a OpenRouter';
      console.error('useOpenRouter error:', message);
      toast({
        title: "Error",
        description: message,
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
      
      console.log('useOpenRouter: processing image with prompt:', prompt);
      
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
