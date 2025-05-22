
import { toast } from "@/components/ui/use-toast";

interface OpenRouterRequest {
  action: string;
  payload: any;
  requestId?: string;
}

// Función para generar un UUID para seguimiento de solicitudes
const generateRequestId = () => {
  return 'req_' + Math.random().toString(36).substring(2, 11);
};

/**
 * Servicio principal para comunicarse con la función de borde de OpenRouter
 */
export async function openRouterService<T>(request: OpenRouterRequest): Promise<T | null> {
  try {
    // Añadir un ID de solicitud para seguimiento si no existe
    const requestWithId = {
      ...request,
      requestId: request.requestId || generateRequestId()
    };
    
    // URL de la función de borde que maneja las solicitudes de OpenRouter
    const functionUrl = '/functions/v1/openrouter-ai';
    
    console.log('OpenRouter: Enviando solicitud a', functionUrl, requestWithId);
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestWithId),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter: Error en la respuesta:', response.status, errorText);
      
      // Manejo específico según el código de estado
      if (response.status === 429) {
        toast({
          title: "Límite de solicitudes excedido",
          description: "Por favor, espera un momento antes de intentar nuevamente.",
          variant: "destructive"
        });
      } else if (response.status === 504 || response.status === 503) {
        toast({
          title: "Servicio no disponible",
          description: "El servicio de IA está temporalmente no disponible. Inténtalo más tarde.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error de comunicación",
          description: `Error ${response.status}: Problema al comunicarse con el servicio.`,
          variant: "destructive"
        });
      }
      
      throw new Error(`Error en solicitud OpenRouter: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Verificar estructura de respuesta esperada
    if (data.error) {
      console.error('OpenRouter: Error reportado en la respuesta:', data.error);
      throw new Error(`Error de la API: ${data.error}`);
    }
    
    console.log('OpenRouter: Respuesta exitosa de', request.action, data);
    
    // Devolver el resultado o un objeto vacío si es null/undefined
    return data.result || null;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('OpenRouter service error:', errorMessage, error);
    
    // No mostrar notificación aquí - dejarlo para el nivel superior (useOpenRouter)
    return null;
  }
}
