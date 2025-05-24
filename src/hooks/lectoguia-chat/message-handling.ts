
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/components/ai/ChatInterface';
import { ImageProcessingResult } from './types';

/**
 * Crea un mensaje de usuario con formato consistente
 */
export const createUserMessage = (content: string, imageData?: string): ChatMessage => {
  return {
    id: uuidv4(),
    role: "user",
    content,
    imageData,
    timestamp: new Date().toISOString() // Usar timestamp string consistente
  };
};

/**
 * Crea un mensaje del asistente con formato consistente
 */
export const createAssistantMessage = (content: string): ChatMessage => {
  return {
    id: uuidv4(),
    role: "assistant",
    content,
    timestamp: new Date().toISOString() // Usar timestamp string consistente
  };
};

/**
 * Maneja errores durante el procesamiento de mensajes
 */
export const handleMessageError = (error: any): { errorContent: string } => {
  // Garantizar que el error tiene un formato consistente
  let errorMessage = 'Error desconocido al procesar el mensaje';
  
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (typeof error === 'object' && error !== null) {
    errorMessage = error.message || JSON.stringify(error);
  }
  
  console.error('Error procesando mensaje:', errorMessage);
  
  // Crear un mensaje de error amigable para el usuario
  const userFriendlyMessage = errorMessage.includes('rate limit') || errorMessage.includes('429')
    ? "Lo siento, el servicio está experimentando mucho tráfico. Por favor intenta nuevamente en unos momentos."
    : "Lo siento, tuve un problema al procesar tu mensaje. Por favor intenta de nuevo.";
  
  return { errorContent: userFriendlyMessage };
};

/**
 * Extrae contenido relevante de una respuesta
 */
export const extractResponseContent = (response: any): string => {
  if (typeof response === 'string') {
    return response;
  }
  
  if (response && typeof response === 'object') {
    // Priorizar el campo 'response' si existe
    if ('response' in response) {
      return String(response.response || "");
    }
    
    // Buscar cualquier campo que contenga un string
    const stringValues = Object.values(response).filter(v => typeof v === 'string');
    if (stringValues.length > 0) {
      return stringValues[0] as string;
    }
  }
  
  return 'No se pudo extraer una respuesta válida';
};

/**
 * Formatea el resultado del análisis de imágenes
 */
export const formatImageAnalysisResult = (result: ImageProcessingResult): string => {
  let formattedResponse = result.response || '';
  
  if (result.extractedText) {
    formattedResponse += `\n\n**Texto extraído de la imagen:**\n${result.extractedText}`;
  }
  
  return formattedResponse;
};
