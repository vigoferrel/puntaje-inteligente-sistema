
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
      // La función processImageWithOpenRouter debe devolver un objeto que incluya 'response'
      const result = await processImageWithOpenRouter(imageData, prompt, context);
      
      // Si el resultado es null, aseguramos que retornemos null (no un objeto vacío)
      if (!result) return null;
      
      // Si el resultado no tiene la propiedad 'response', la añadimos con un valor por defecto
      if (!result.response) {
        return {
          ...result,
          response: "No se pudo procesar correctamente la imagen."
        } as ImageAnalysisResult;
      }
      
      return result;
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
