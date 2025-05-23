
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/components/ai/ChatInterface';
import { toast } from '@/components/ui/use-toast';
import { ImageAnalysisResult } from '@/types/ai-types';
import { ERROR_RATE_LIMIT_MESSAGE } from './types';

// Estructura para mantener métricas sobre errores para análisis
interface ErrorMetrics {
  lastErrorTime: number;
  errorCount: number;
  errorTypes: Record<string, number>;
}

// Objeto global para seguimiento de errores (podría movarse a un contexto para persistencia entre sesiones)
const errorMetrics: ErrorMetrics = {
  lastErrorTime: 0,
  errorCount: 0,
  errorTypes: {}
};

/**
 * Create a new user message object
 */
export function createUserMessage(content: string, imageData?: string): ChatMessage {
  return {
    id: uuidv4(),
    role: "user",
    content,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    imageUrl: imageData
  };
}

/**
 * Create a new assistant message object
 */
export function createAssistantMessage(content: string): ChatMessage {
  return {
    id: uuidv4(),
    role: "assistant",
    content,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}

/**
 * Handle errors in message processing with tracking and analytics
 */
export function handleMessageError(error: unknown): { errorContent: string, isRateLimit: boolean } {
  console.error("Error procesando mensaje:", error);
  
  const now = Date.now();
  const errMsg = error instanceof Error ? error.message : "Hubo un problema al procesar tu mensaje";
  const errorType = errMsg.includes('rate limit') ? 'rate_limit' : 
                   errMsg.includes('timeout') ? 'timeout' :
                   errMsg.includes('network') ? 'network' : 'unknown';
  
  // Actualizar métricas de error
  errorMetrics.lastErrorTime = now;
  errorMetrics.errorCount++;
  errorMetrics.errorTypes[errorType] = (errorMetrics.errorTypes[errorType] || 0) + 1;
  
  const isRateLimitError = errorType === 'rate_limit';
  
  // Determinar si hay una concentración de errores (más de 3 en 5 minutos)
  const isErrorBurst = errorMetrics.errorCount > 3 && 
                      (now - errorMetrics.lastErrorTime) < 5 * 60 * 1000;
  
  const errorContent = isRateLimitError 
    ? ERROR_RATE_LIMIT_MESSAGE
    : isErrorBurst 
      ? "Estamos experimentando dificultades técnicas en este momento. Te recomendamos intentar más tarde."
      : "Lo siento, tuve un problema procesando tu mensaje. ¿Podrías intentarlo de nuevo o pedir ayuda con una materia específica?";
  
  // Mostrar notificación apropiada según tipo de error
  toast({
    title: isRateLimitError 
      ? "Límite de solicitudes excedido"
      : isErrorBurst
        ? "Servicio degradado"
        : "Error de procesamiento",
    description: isRateLimitError 
      ? "El servicio está experimentando alta demanda. Por favor, intenta de nuevo más tarde."
      : isErrorBurst
        ? "Múltiples errores detectados. Estamos trabajando para resolver el problema."
        : errMsg,
    variant: "destructive",
    duration: isErrorBurst ? 10000 : 5000
  });
  
  return { errorContent, isRateLimit: isRateLimitError };
}

/**
 * Extract response content from various API response formats
 * Versión mejorada con un enfoque gradual y detallado para manejar todo tipo de respuestas
 */
export function extractResponseContent(response: any): string {
  console.log("Extrayendo contenido de respuesta:", typeof response);
  
  // Caso 1: Respuesta vacía o nula
  if (!response) {
    console.log('La respuesta está vacía o es nula');
    return "Lo siento, tuve un problema generando una respuesta. Puedo ayudarte con cualquier materia de la PAES si lo deseas.";
  }
  
  // Caso 2: Respuesta como cadena de texto (más común desde el Edge Function con texto plano)
  if (typeof response === 'string') {
    console.log('Respuesta es una cadena de texto directa');
    return response;
  } 
  
  // Caso 3: Respuesta formateada por Edge Function con estructura {success: true, result: {...}}
  if (typeof response === 'object' && 'success' in response && response.success === true) {
    console.log('Detectada respuesta con formato success/result:', response.result);
    
    // Si result es un objeto con propiedad 'response'
    if (typeof response.result === 'object' && response.result !== null && 'response' in response.result) {
      console.log('Extrayendo response de result:', response.result.response);
      return response.result.response;
    }
    
    // Si result es una cadena
    if (typeof response.result === 'string') {
      console.log('Result es una cadena:', response.result);
      return response.result;
    }
    
    // Si result es otro tipo de objeto sin propiedad response
    if (typeof response.result === 'object' && response.result !== null) {
      // Buscar cualquier propiedad de tipo string para usar como respuesta
      for (const key of Object.keys(response.result)) {
        if (typeof response.result[key] === 'string' && response.result[key].trim().length > 0) {
          console.log(`Usando propiedad ${key} como respuesta:`, response.result[key]);
          return response.result[key];
        }
      }
      
      // Si no hay strings utilizables, stringificar el objeto
      try {
        console.log('Convirtiendo result a string:', response.result);
        return JSON.stringify(response.result);
      } catch (e) {
        console.error('Error al convertir result a string:', e);
      }
    }
  }
  
  // Caso 4: Respuesta con propiedad 'response' directa (formato estándar del edge function)
  if (typeof response === 'object' && response !== null && 'response' in response) {
    console.log('La respuesta tiene propiedad response directa:', response.response);
    return response.response;
  }
  
  // Caso 5: Formato estándar de OpenAI (choices > message > content)
  if (typeof response === 'object' && 'choices' in response && 
      Array.isArray(response.choices) && response.choices.length > 0) {
    const choice = response.choices[0];
    if ('message' in choice && 'content' in choice.message) {
      console.log('Extraído contenido de formato OpenAI:', choice.message.content);
      return choice.message.content;
    }
  }
  
  // Caso 6: Último recurso - buscar cualquier propiedad de texto en el objeto
  if (typeof response === 'object' && response !== null) {
    // Verificar propiedades comunes que podrían contener texto
    for (const key of ['text', 'content', 'message', 'data', 'result']) {
      if (key in response && typeof response[key] === 'string') {
        console.log(`Encontrada propiedad ${key} con texto:`, response[key]);
        return response[key];
      }
    }
    
    // Buscar cualquier propiedad de tipo string
    for (const key of Object.keys(response)) {
      if (typeof response[key] === 'string' && response[key].trim().length > 0) {
        console.log(`Usando propiedad ${key} como respuesta:`, response[key]);
        return response[key];
      }
    }
    
    // Intentar stringificar el objeto completo
    try {
      console.log('Convertir objeto completo a string:', response);
      return JSON.stringify(response);
    } catch (e) {
      console.error('Error al convertir objeto a string:', e);
    }
  }
  
  // Caso 7: Valor por defecto si todo lo demás falla
  console.log('No se pudo extraer contenido significativo de la respuesta');
  return "He recibido tu mensaje, pero tuve dificultades procesando la respuesta. ¿En qué tema de la PAES puedo ayudarte?";
}

/**
 * Format image analysis result
 */
export function formatImageAnalysisResult(result: ImageAnalysisResult | string | null): string {
  if (!result) {
    return "He analizado la imagen, pero no pude extraer información clara. ¿Puedes proporcionar una imagen con mejor resolución?";
  }
  
  if (typeof result === 'string') {
    return result;
  }
  
  let response = result.response || "He analizado la imagen";
  
  if (result.extractedText) {
    response = `${response}\n\n**Texto extraído:**\n${result.extractedText}`;
  }
  
  return response;
}
