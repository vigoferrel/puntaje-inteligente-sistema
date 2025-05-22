
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/components/ai/ChatInterface';
import { toast } from '@/components/ui/use-toast';
import { ImageAnalysisResult } from '@/types/ai-types';
import { ERROR_RATE_LIMIT_MESSAGE } from './types';

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
 * Handle errors in message processing
 */
export function handleMessageError(error: unknown): { errorContent: string, isRateLimit: boolean } {
  console.error("Error procesando mensaje:", error);
  
  const errMsg = error instanceof Error ? error.message : "Hubo un problema al procesar tu mensaje";
  const isRateLimitError = errMsg.toLowerCase().includes('rate limit') || 
                         errMsg.toLowerCase().includes('rate-limit') || 
                         errMsg.toLowerCase().includes('límite de tasa');
  
  const errorContent = isRateLimitError 
    ? ERROR_RATE_LIMIT_MESSAGE
    : "Lo siento, tuve un problema procesando tu mensaje. ¿Podrías intentarlo de nuevo o pedir ayuda con una materia específica?";
  
  toast({
    title: "Error",
    description: isRateLimitError 
      ? "El servicio está experimentando alta demanda. Por favor, intenta de nuevo más tarde."
      : errMsg,
    variant: "destructive"
  });
  
  return { errorContent, isRateLimit: isRateLimitError };
}

/**
 * Extract response content from various API response formats
 */
export function extractResponseContent(response: any): string {
  if (!response) {
    return "Lo siento, tuve un problema generando una respuesta. Puedo ayudarte con cualquier materia de la PAES si lo deseas.";
  }
  
  // Handling different response formats
  if (typeof response === 'string') {
    return response;
  } else if (response && typeof response === 'object') {
    if ('response' in response) {
      return response.response;
    } else if (Object.keys(response).length > 0) {
      // Try to extract useful info from first value
      const firstValue = Object.values(response)[0];
      return typeof firstValue === 'string' ? firstValue : 
        "Para mejorar tu rendimiento en la PAES, es importante enfocarte en todas las materias relevantes para tu área de interés.";
    }
  }
  
  return "Lo siento, tuve un problema generando una respuesta. Puedo ayudarte con cualquier materia de la PAES si lo deseas.";
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
