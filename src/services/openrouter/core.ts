
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

// Variables para el seguimiento del estado del servicio
let serviceHealthLastChecked = 0;
let serviceHealthStatus = true; // Asumimos que está saludable inicialmente
const HEALTH_CHECK_INTERVAL = 60000; // 1 minuto

/**
 * Verifica la salud del servicio sin bloquear si fue verificado recientemente
 */
async function checkServiceHealth(): Promise<boolean> {
  const now = Date.now();
  
  // Si verificamos recientemente, devolver el último estado conocido
  if (now - serviceHealthLastChecked < HEALTH_CHECK_INTERVAL) {
    return serviceHealthStatus;
  }
  
  try {
    // Hacer una solicitud liviana para verificar si el servicio está disponible
    const response = await fetch('https://settifboilityelprvjd.supabase.co/functions/v1/openrouter-ai/health_check', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });
    
    serviceHealthLastChecked = now;
    
    if (!response.ok) {
      serviceHealthStatus = false;
      return false;
    }
    
    const data = await response.json();
    serviceHealthStatus = data?.result?.status === 'available';
    return serviceHealthStatus;
  } catch (error) {
    serviceHealthLastChecked = now;
    serviceHealthStatus = false;
    return false;
  }
}

/**
 * Servicio principal para comunicarse con la función de borde de OpenRouter
 * Con manejo mejorado de errores, caché y detección de estado
 */
export async function openRouterService<T>(request: OpenRouterRequest): Promise<T | null> {
  try {
    // Verificar estado del servicio antes de intentar la solicitud
    const isHealthy = await checkServiceHealth();
    if (!isHealthy) {
      console.warn('OpenRouter service health check failed, continuing with request anyway');
    }
    
    // Añadir un ID de solicitud para seguimiento si no existe
    const requestWithId = {
      ...request,
      requestId: request.requestId || generateRequestId()
    };
    
    // URL completa de la función de borde de Supabase
    const functionUrl = 'https://settifboilityelprvjd.supabase.co/functions/v1/openrouter-ai';
    
    console.log('OpenRouter: Enviando solicitud a', functionUrl, requestWithId);
    
    // Implementar un timeout para evitar solicitudes pendientes indefinidamente
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos timeout
    
    try {
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY || ''}`
        },
        body: JSON.stringify(requestWithId),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter: Error en la respuesta:', response.status, errorText);
        
        // Actualizar estado del servicio si hay errores críticos
        if (response.status >= 500) {
          serviceHealthStatus = false;
        }
        
        // Manejo específico según el código de estado
        if (response.status === 404) {
          toast({
            title: "Servicio no disponible",
            description: "La función OpenRouter no se encuentra disponible. Contacte al administrador.",
            variant: "destructive"
          });
          throw new Error("Función OpenRouter no encontrada (404). Verifique que la función esté desplegada.");
        } else if (response.status === 429) {
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
            title: "Error de conexión",
            description: `Error ${response.status}: Problema al comunicarse con el servicio. Inténtalo de nuevo.`,
            variant: "destructive"
          });
        }
        
        throw new Error(`Error en solicitud OpenRouter: ${response.status}`);
      }
      
      // Restablecer el estado del servicio a saludable si la solicitud fue exitosa
      serviceHealthStatus = true;
      
      // Intenta procesar la respuesta como JSON
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Error al procesar respuesta JSON:', jsonError);
        throw new Error(`Error al procesar respuesta JSON: ${jsonError.message}`);
      }
      
      // Verificar estructura de respuesta esperada
      if (data.error) {
        console.error('OpenRouter: Error reportado en la respuesta:', data.error);
        throw new Error(`Error de la API: ${data.error}`);
      }
      
      console.log('OpenRouter: Respuesta exitosa de', request.action, data);
      
      // Devolver el resultado o un objeto vacío si es null/undefined
      return data.result || null;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      // Detectar si fue un error de timeout
      if (fetchError.name === 'AbortError') {
        toast({
          title: "Tiempo de espera agotado",
          description: "La solicitud tomó demasiado tiempo. Inténtalo de nuevo.",
          variant: "destructive"
        });
        throw new Error("Tiempo de espera agotado al comunicarse con OpenRouter");
      }
      
      // Cualquier otro error de red
      throw fetchError;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('OpenRouter service error:', errorMessage, error);
    
    // No mostrar notificación aquí - dejarlo para el nivel superior (useOpenRouter)
    return null;
  }
}
