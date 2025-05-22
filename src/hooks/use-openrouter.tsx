
import { useState } from "react";
import { openRouterService, processImageWithOpenRouter } from "@/services/openrouter-service";
import { toast } from "@/components/ui/use-toast";

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

  const processImage = async (imageData: string, prompt?: string, context?: string) => {
    try {
      setLoading(true);
      return await processImageWithOpenRouter(imageData, prompt, context);
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
