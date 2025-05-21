
import { useState } from "react";
import { openRouterService } from "@/services/openrouter-service";
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

  return {
    callOpenRouter,
    loading
  };
}
