
import { useState } from "react";
import { openRouterService, processImageWithOpenRouter } from "@/services/openrouter-service";
import { toast } from "@/components/ui/use-toast";
import { ImageAnalysisResult } from "@/types/ai-types";

export function useOpenRouter() {
  const [loading, setLoading] = useState(false);

  const callOpenRouter = async <T,>(action: string, payload: any): Promise<T | null> => {
    try {
      setLoading(true);
      const result = await openRouterService<T>({ action, payload });
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error en la solicitud a OpenRouter';
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

  const processImage = async (imageData: string, prompt?: string, context?: string): Promise<ImageAnalysisResult | null> => {
    try {
      setLoading(true);
      
      // Process the image and get the result
      const result = await processImageWithOpenRouter(imageData, prompt, context);
      
      // If null result, return null
      if (!result) return null;
      
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
        response: typeof result === 'object' && result !== null 
          ? JSON.stringify(result) 
          : "No se pudo procesar correctamente la imagen."
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error procesando la imagen';
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

  return {
    callOpenRouter,
    processImage,
    loading
  };
}
