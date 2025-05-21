
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface OpenRouterServiceOptions {
  action: string;
  payload: any;
}

export const openRouterService = async <T>({ action, payload }: OpenRouterServiceOptions): Promise<T | null> => {
  try {
    console.log(`Calling OpenRouter service with action: ${action}`);
    console.log('Payload:', JSON.stringify(payload));
    
    const { data, error } = await supabase.functions.invoke('openrouter-ai', {
      body: {
        action,
        payload
      }
    });
    
    if (error) {
      console.error('Supabase functions error:', error);
      throw new Error(error.message);
    }
    
    console.log('OpenRouter response received:', data);
    
    if (!data) {
      console.error('No data received from OpenRouter');
      throw new Error('No data received from OpenRouter');
    }
    
    if (data.error) {
      console.error('OpenRouter error:', data.error);
      throw new Error(data.error);
    }
    
    if (data && data.result) {
      try {
        return typeof data.result === 'string'
          ? JSON.parse(data.result)
          : data.result;
      } catch (parseError) {
        console.error('Error parsing result:', parseError);
        console.log('Raw result:', data.result);
        return data.result as unknown as T;
      }
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
