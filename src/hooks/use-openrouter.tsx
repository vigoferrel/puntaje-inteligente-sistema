
import { useState, useCallback, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { ImageAnalysisResult } from "@/types/ai-types";
import { openRouterService } from "@/services/openrouter/core";
import { processImageWithOpenRouter } from "@/services/openrouter/image-processing";

// Constante para tiempo máximo de espera en milisegundos
const API_TIMEOUT = 25000;
// Intervalo para comprobar la conexión en milisegundos
const CONNECTION_CHECK_INTERVAL = 60000; // 1 minuto

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

export function useOpenRouter() {
  const [loading, setLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connected');
  const [lastConnectionCheck, setLastConnectionCheck] = useState(0);

  // Función para verificar si la función está disponible de manera más eficiente
  const checkConnectionStatus = useCallback(async (force = false): Promise<boolean> => {
    const now = Date.now();
    
    // Evitar verificaciones frecuentes a menos que se fuerce
    if (!force && now - lastConnectionCheck < CONNECTION_CHECK_INTERVAL) {
      return connectionStatus === 'connected';
    }
    
    setLastConnectionCheck(now);
    
    if (!force && connectionStatus === 'connecting') {
      return false; // Evitar verificaciones paralelas
    }
    
    try {
      setConnectionStatus('connecting');
      
      // Usar un timeout para evitar bloqueos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // Timeout más corto para health check
      
      // Realizar una solicitud simple para verificar disponibilidad
      const response = await fetch('https://settifboilityelprvjd.supabase.co/functions/v1/openrouter-ai/health_check', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: controller.signal,
        cache: 'no-store'
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        setConnectionStatus('disconnected');
        console.error('Servicio OpenRouter no disponible:', response.status);
        return false;
      }
      
      setConnectionStatus('connected');
      return true;
    } catch (error) {
      console.error("Error verificando estado de conexión:", error);
      setConnectionStatus('disconnected');
      return false;
    }
  }, [connectionStatus, lastConnectionCheck]);
  
  // Verificar periódicamente el estado de la conexión
  useEffect(() => {
    // Verificación inicial al montar el componente
    checkConnectionStatus();
    
    // Configurar verificación periódica
    const intervalId = setInterval(() => {
      checkConnectionStatus();
    }, CONNECTION_CHECK_INTERVAL);
    
    return () => clearInterval(intervalId);
  }, []);

  /**
   * Generic function to call the OpenRouter service with improved logging and timeout handling
   */
  const callOpenRouter = async <T,>(action: string, payload: any): Promise<T | null> => {
    try {
      setLoading(true);
      setLastError(null);
      console.log(`useOpenRouter: llamando a ${action}`, payload);
      
      if (!payload) {
        console.error("Error: Payload es requerido");
        setLastError("Payload es requerido");
        throw new Error("Payload es requerido");
      }
      
      // Validar parámetros específicos según la acción
      if (action === "generate_exercise") {
        if (!payload.skill) {
          console.warn("Advertencia: 'skill' no especificada en generate_exercise");
        }
        if (!payload.prueba) {
          console.warn("Advertencia: 'prueba' no especificada en generate_exercise");
        }
      }
      
      // Verificar disponibilidad solo si es una acción crítica 
      // (evitamos para acciones simples como health_check para prevenir bucles)
      if (action !== 'health_check') {
        const isAvailable = await checkConnectionStatus();
        if (!isAvailable) {
          console.warn("La función OpenRouter no está disponible actualmente pero intentaremos la solicitud igualmente");
          // No bloqueamos la solicitud, simplemente registramos una advertencia
        }
      }
      
      // Crear la promesa para la llamada al servicio
      const servicePromise = openRouterService<T>({
        action,
        payload,
        requestId: `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
      });
      
      // Crear promesa para el timeout
      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => reject(new Error("Tiempo de espera agotado")), API_TIMEOUT);
      });
      
      // Competir entre ambas promesas
      const result = await Promise.race([servicePromise, timeoutPromise]) as T;
      
      console.log(`useOpenRouter: respuesta de ${action}`, result);
      
      // Actualizar estado de conexión si la solicitud fue exitosa
      setConnectionStatus('connected');
      
      if (!result) {
        setLastError("No se recibió respuesta");
        // No lanzamos error para mantener la aplicación funcionando
        console.warn(`No se recibió respuesta para la acción ${action}`);
        return null;
      }
      
      return result;
    } catch (error) {
      // Mejorar el manejo de errores con información más específica
      const isTimeoutError = error instanceof Error && error.message === "Tiempo de espera agotado";
      const message = error instanceof Error ? error.message : 'Error en la solicitud a OpenRouter';
      
      console.error('useOpenRouter error:', error);
      console.error('Detalles del error:', { action, payloadType: typeof payload });
      
      setLastError(message);
      
      // Actualizar estado de conexión si hubo un error crítico
      if (isTimeoutError || message.includes('network') || message.includes('fetch')) {
        setConnectionStatus('disconnected');
      }
      
      // Mostrar mensaje de error apropiado según el tipo de error solo para errores críticos
      if (isTimeoutError || connectionStatus === 'disconnected') {
        toast({
          title: isTimeoutError ? "Tiempo de espera agotado" : "Error de conexión",
          description: isTimeoutError 
            ? "El servicio está tardando demasiado en responder. Modo offline activado."
            : "Problemas de conectividad detectados. Modo offline activado.",
          variant: "destructive"
        });
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Process an image using OpenRouter's vision capabilities with mejor manejo de errores
   */
  const processImage = async (imageData: string, prompt?: string, context?: string): Promise<ImageAnalysisResult | null> => {
    try {
      setLoading(true);
      setLastError(null);
      
      console.log('useOpenRouter: procesando imagen con prompt:', prompt);
      
      if (!imageData || imageData.length < 100) {
        setLastError("Datos de imagen inválidos");
        throw new Error('Datos de imagen inválidos o incompletos');
      }
      
      // Process the image and get the result with error handling
      try {
        const result = await processImageWithOpenRouter(imageData, prompt, context);
        
        // If null result, return formatted error
        if (!result) {
          console.log('useOpenRouter: resultado nulo de processImageWithOpenRouter');
          setLastError("No se pudo analizar la imagen");
          return { response: "No se pudo analizar la imagen. Intenta con una imagen de mejor calidad." };
        }
        
        console.log('useOpenRouter: resultado recibido de processImageWithOpenRouter', typeof result);
        
        // Si el resultado es un objeto con la propiedad response
        if (typeof result === 'object' && result !== null && 'response' in result) {
          return result as ImageAnalysisResult;
        }
        
        // Si el resultado es una cadena de texto
        if (typeof result === 'string') {
          return { response: result };
        }
        
        // Formato de respuesta por defecto para otros casos
        return { 
          response: typeof result === 'object' ? 
            JSON.stringify(result) : 
            "Análisis de imagen completado pero con formato inesperado."
        };
      } catch (error) {
        // Capturar errores específicos del procesamiento de imágenes
        setConnectionStatus('disconnected');
        console.error('Error en processImageWithOpenRouter:', error);
        return {
          response: "Lo siento, el servicio de análisis de imágenes no está disponible en este momento. Intenta describir lo que ves en la imagen."
        };
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error procesando la imagen';
      console.error('useOpenRouter processImage error:', message);
      
      setLastError(message);
      
      toast({
        title: "Error en procesamiento de imagen",
        description: message,
        variant: "destructive"
      });
      
      return {
        response: "Hubo un error al procesar la imagen. Verifica que el formato sea válido e intenta de nuevo."
      };
    } finally {
      setLoading(false);
    }
  };

  const retryLastOperation = useCallback(() => {
    setLastError(null);
    checkConnectionStatus(true).then(isConnected => {
      if (isConnected) {
        toast({
          title: "Conexión restablecida",
          description: "Intentando conectar nuevamente con el servicio...",
        });
      } else {
        toast({
          title: "Servicio aún no disponible",
          description: "Seguiremos funcionando en modo offline con capacidades limitadas.",
          variant: "destructive"
        });
      }
    });
  }, [checkConnectionStatus]);
  
  const resetConnectionStatus = useCallback(() => {
    setConnectionStatus('connecting');
    checkConnectionStatus(true);
  }, [checkConnectionStatus]);

  return {
    callOpenRouter,
    processImage,
    loading,
    lastError,
    retryLastOperation,
    connectionStatus,
    resetConnectionStatus,
    checkConnectionStatus
  };
}
