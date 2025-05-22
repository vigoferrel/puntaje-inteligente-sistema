
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
 * Con manejo mejorado de texto plano y respuestas complejas
 */
export function extractResponseContent(response: any): string {
  console.log("Procesando respuesta:", response);
  
  if (!response) {
    console.log('La respuesta está vacía');
    return "Lo siento, tuve un problema generando una respuesta. Puedo ayudarte con cualquier materia de la PAES si lo deseas.";
  }
  
  // Manejar respuestas de OpenRouter con estructura success/result
  if (typeof response === 'object' && 'success' in response && response.success === true) {
    console.log('Detectada respuesta con formato success/result:', response.result);
    if (response.result) {
      // Si result es un objeto con propiedad 'response'
      if (typeof response.result === 'object' && 'response' in response.result) {
        return response.result.response;
      }
      // Si result es texto plano
      if (typeof response.result === 'string') {
        return response.result;
      }
      // Si result es otro tipo de objeto, intentar convertirlo
      if (typeof response.result === 'object') {
        const stringProps = Object.values(response.result).find(val => typeof val === 'string');
        if (stringProps) return stringProps as string;
        return JSON.stringify(response.result);
      }
    }
  }
  
  // Manejar respuestas de texto plano directamente
  if (typeof response === 'string') {
    return response;
  } 
  
  // Manejar objetos con propiedad 'response' directa
  if (typeof response === 'object' && 'response' in response) {
    return response.response;
  }
  
  // Para compatibilidad con el formato OpenRouter de OpenAI
  if (typeof response === 'object' && 'choices' in response && Array.isArray(response.choices) && response.choices.length > 0) {
    const choice = response.choices[0];
    if ('message' in choice && 'content' in choice.message) {
      return choice.message.content;
    }
  }
  
  // Extraer información útil de cualquier objeto
  if (typeof response === 'object' && response !== null) {
    // Buscar propiedades que puedan contener la respuesta
    for (const key of ['text', 'content', 'message', 'data', 'result']) {
      if (key in response && typeof response[key] === 'string') {
        return response[key];
      }
    }
    
    // Buscar cualquier propiedad string que no esté vacía
    for (const key of Object.keys(response)) {
      const value = response[key];
      if (typeof value === 'string' && value.trim().length > 0) {
        return value;
      }
    }
    
    // Si es un objeto anidado, intentar buscar recursivamente
    for (const key of Object.keys(response)) {
      if (typeof response[key] === 'object' && response[key] !== null) {
        // Evitar recursión infinita
        if (response[key] !== response) {
          const nestedContent = extractResponseContent(response[key]);
          if (nestedContent && nestedContent.length > 5) { 
            return nestedContent;
          }
        }
      }
    }
    
    // Si todo falla, convertir el objeto a string
    try {
      return JSON.stringify(response);
    } catch (e) {
      console.error("Error al convertir respuesta a texto:", e);
    }
  }
  
  // Respuesta por defecto
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
