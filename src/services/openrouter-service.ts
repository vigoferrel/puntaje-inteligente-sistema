
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface OpenRouterServiceOptions {
  action: string;
  payload: any;
}

export const openRouterService = async <T>({ action, payload }: OpenRouterServiceOptions): Promise<T | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('openrouter-ai', {
      body: {
        action,
        payload
      }
    });
    
    if (error) throw new Error(error.message);
    
    if (data && data.result) {
      return typeof data.result === 'string'
        ? JSON.parse(data.result)
        : data.result;
    }
    
    return null;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error en la solicitud a OpenRouter';
    console.error('Error in OpenRouter service:', err);
    toast({
      title: "Error",
      description: message,
      variant: "destructive"
    });
    return null;
  }
};
