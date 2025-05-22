
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { ImageAnalysisResult } from "@/types/ai-types";
import { openRouterService } from "@/services/openrouter/core";
import { processImageWithOpenRouter } from "@/services/openrouter/image-processing";

// Constante para tiempo máximo de espera en milisegundos
const API_TIMEOUT = 25000;

export function useOpenRouter() {
  const [loading, setLoading] = useState(false);

  /**
   * Generic function to call the OpenRouter service with improved logging and timeout handling
   */
  const callOpenRouter = async <T,>(action: string, payload: any): Promise<T | null> => {
    try {
      setLoading(true);
      console.log(`useOpenRouter: llamando a ${action}`, payload);
      
      if (!payload) {
        console.error("Error: Payload es requerido");
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
      
      // Crear la promesa para la llamada al servicio
      const servicePromise = openRouterService<T>({ action, payload });
      
      // Crear promesa para el timeout
      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => reject(new Error("Tiempo de espera agotado")), API_TIMEOUT);
      });
      
      // Competir entre ambas promesas
      const result = await Promise.race([servicePromise, timeoutPromise]) as T;
      
      console.log(`useOpenRouter: respuesta de ${action}`, result);
      
      if (!result) {
        throw new Error(`No se recibió respuesta para la acción ${action}`);
      }
      
      return result;
    } catch (error) {
      // Mejorar el manejo de errores con información más específica
      const isTimeoutError = error instanceof Error && error.message === "Tiempo de espera agotado";
      const message = error instanceof Error ? error.message : 'Error en la solicitud a OpenRouter';
      
      console.error('useOpenRouter error:', error);
      console.error('Detalles del error:', { action, payloadType: typeof payload });
      
      // Mostrar mensaje de error apropiado según el tipo de error
      toast({
        title: isTimeoutError ? "Tiempo de espera agotado" : "Error de conexión",
        description: isTimeoutError 
          ? "El servicio está tardando demasiado en responder. Intenta con una solicitud más simple."
          : "Hubo un problema al conectar con el servicio. Inténtalo de nuevo.",
        variant: "destructive"
      });
      
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
      
      console.log('useOpenRouter: procesando imagen con prompt:', prompt);
      
      if (!imageData || imageData.length < 100) {
        throw new Error('Datos de imagen inválidos o incompletos');
      }
      
      // Process the image and get the result
      const result = await processImageWithOpenRouter(imageData, prompt, context);
      
      // If null result, return formatted error
      if (!result) {
        console.log('useOpenRouter: resultado nulo de processImageWithOpenRouter');
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
      const message = error instanceof Error ? error.message : 'Error procesando la imagen';
      console.error('useOpenRouter processImage error:', message);
      
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

  return {
    callOpenRouter,
    processImage,
    loading
  };
}
