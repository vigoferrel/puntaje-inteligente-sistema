
import { useState, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { openRouterService } from "@/services/openrouter/core";

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

interface OpenRouterRequest {
  action: string;
  payload: any;
  requestId?: string;
}

export function useOpenRouter() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState<Error | null>(null);
  const [lastOperation, setLastOperation] = useState<OpenRouterRequest | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connected');

  /**
   * Llama al servicio de OpenRouter con mejor manejo de errores y monitoreo de estado.
   * @param request La solicitud a enviar
   * @param silent Si es true, no mostrará notificaciones de error
   */
  const callOpenRouter = useCallback(async <T,>(
    request: OpenRouterRequest,
    silent: boolean = false
  ): Promise<T | null> => {
    setLastOperation(request);
    setIsLoading(true);
    setConnectionStatus('connecting');
    
    try {
      console.log(`Llamando a OpenRouter - Acción: ${request.action}`);
      
      // Generar un ID de solicitud si no se proporciona uno
      const requestWithId = {
        ...request,
        requestId: request.requestId || `req_${Math.random().toString(36).substring(2, 11)}`
      };
      
      // Usar timeout para evitar bloqueos prolongados
      const timeoutPromise = new Promise<null>((resolve) => {
        setTimeout(() => resolve(null), 15000); // 15 segundos de timeout
      });
      
      // Competir entre la solicitud real y el timeout
      const response = await Promise.race([
        openRouterService<T>(requestWithId),
        timeoutPromise
      ]);
      
      // Restablecer estado de éxito
      setLastError(null);
      setConnectionStatus('connected');
      
      if (!response) {
        console.warn(`La solicitud ${request.action} no retornó datos o expiró el timeout`);
        
        if (!silent) {
          toast({
            title: "Sin respuesta",
            description: "No se recibió una respuesta válida. Por favor intenta de nuevo.",
            variant: "destructive"
          });
        }
      }
      
      return response;
    } catch (error) {
      console.error(`Error llamando a OpenRouter (${request.action}):`, error);
      
      const isNetworkError = error instanceof Error && 
        (error.message.includes('network') || 
         error.message.includes('fetch') || 
         error.message.includes('timeout'));
      
      setLastError(error instanceof Error ? error : new Error("Error desconocido"));
      setConnectionStatus(isNetworkError ? 'disconnected' : 'connected');
      
      if (!silent) {
        let errorMessage = "Ocurrió un error al procesar tu solicitud.";
        
        // Mensajes personalizados según el tipo de error
        if (isNetworkError) {
          errorMessage = "Error de conexión. Verifica tu conexión a internet.";
        } else if (error instanceof Error) {
          if (error.message.includes('rate limit') || error.message.includes('429')) {
            errorMessage = "El servicio está experimentando alta demanda. Por favor intenta más tarde.";
          } else if (error.message.includes('auth') || error.message.includes('401')) {
            errorMessage = "Error de autenticación con el servicio.";
          }
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Reintenta la última operación fallida
   */
  const retryLastOperation = useCallback(async () => {
    if (lastOperation) {
      toast({
        title: "Reintentando operación",
        description: "Intentando nuevamente la solicitud anterior..."
      });
      
      return callOpenRouter(lastOperation);
    }
    
    return null;
  }, [lastOperation, callOpenRouter]);

  /**
   * Procesa una imagen y retorna el resultado del análisis
   */
  const processImage = useCallback(async (
    imageData: string,
    prompt: string,
    context?: string
  ) => {
    return callOpenRouter({
      action: "process_image",
      payload: {
        imageData,
        prompt,
        context
      }
    });
  }, [callOpenRouter]);

  /**
   * Resetea el estado de conexión e intenta reconectar
   */
  const resetConnectionStatus = useCallback(() => {
    setConnectionStatus('connected');
    retryLastOperation();
    
    toast({
      title: "Reintentando conexión",
      description: "Intentando restaurar la conexión con el servicio...",
      duration: 3000
    });
  }, [retryLastOperation]);

  return {
    callOpenRouter,
    retryLastOperation,
    processImage,
    resetConnectionStatus,
    isLoading,
    lastError,
    connectionStatus
  };
}
