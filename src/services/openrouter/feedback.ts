
import { AIFeedback } from "@/types/ai-types";
import { openRouterService } from "./core";

/**
 * Proporciona retroalimentación sobre un ejercicio utilizando OpenRouter
 */
export const provideExerciseFeedback = async (
  exerciseAttempt: { question: string; answer: string },
  correctAnswer: string,
  explanation: string
): Promise<AIFeedback | null> => {
  try {
    console.log('Solicitando feedback para respuesta:', exerciseAttempt);
    
    // Implementar reintentos automáticos para mejorar la fiabilidad
    let attempts = 0;
    const maxAttempts = 2;
    let result = null;
    
    while (attempts < maxAttempts && result === null) {
      try {
        result = await openRouterService<AIFeedback>({
          action: "provide_exercise_feedback",
          payload: {
            exerciseAttempt,
            correctAnswer,
            explanation,
            requestedAt: new Date().toISOString()
          }
        });
        
        if (!result) {
          console.log(`Intento ${attempts + 1} fallido, reintentando...`);
          attempts++;
          
          if (attempts < maxAttempts) {
            // Esperar un poco antes de reintentar (retroceso exponencial)
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempts)));
          }
        }
      } catch (attemptError) {
        console.error(`Error en intento ${attempts + 1}:`, attemptError);
        attempts++;
        
        if (attempts < maxAttempts) {
          // Esperar un poco antes de reintentar
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempts)));
        } else {
          throw attemptError; // Relanzar el último error si agotamos los intentos
        }
      }
    }
    
    if (!result) {
      throw new Error("No se recibió respuesta del servicio de feedback después de múltiples intentos");
    }
    
    console.log('Feedback recibido:', result);
    return result;
  } catch (error) {
    console.error('Error al obtener feedback de ejercicio:', error);
    // Return a valid AIFeedback object with the error information in the explanation
    return {
      isCorrect: false,
      feedback: "Lo siento, no pude evaluar tu respuesta. Por favor intenta de nuevo más tarde.",
      explanation: error instanceof Error 
        ? `Error: ${error.message}` 
        : "Error desconocido al procesar la respuesta",
      tips: ["Intenta de nuevo más tarde", "Verifica tu conexión a internet"]
    };
  }
};

/**
 * Procesa mensajes del usuario para proporcionar retroalimentación general
 * Versión mejorada con mejor manejo de errores y respuestas
 */
export const provideChatFeedback = async (
  userMessage: string,
  context?: string,
  previousMessages?: any[]
): Promise<string | null> => {
  try {
    console.log('Solicitando respuesta para mensaje:', userMessage);
    
    // Implementar sistema de reintentos
    let attempts = 0;
    const maxAttempts = 2;
    let result = null;
    
    while (attempts < maxAttempts && result === null) {
      try {
        result = await openRouterService<any>({
          action: "provide_feedback",
          payload: {
            userMessage,
            context: context || "general assistance",
            previousMessages: previousMessages || [],
            timestamp: new Date().toISOString()
          }
        });
        
        if (!result) {
          console.log(`Intento ${attempts + 1} fallido, reintentando...`);
          attempts++;
          
          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempts)));
          }
        }
      } catch (attemptError) {
        console.error(`Error en intento ${attempts + 1}:`, attemptError);
        attempts++;
        
        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempts)));
        } else {
          throw attemptError;
        }
      }
    }
    
    // Si después de todos los intentos no hay respuesta
    if (!result) {
      console.log('No se recibió respuesta del servicio después de múltiples intentos');
      return "Lo siento, estoy teniendo problemas para conectarme al servicio en este momento. ¿Podrías intentarlo de nuevo en unos momentos?";
    }
    
    console.log('Respuesta recibida del servicio:', typeof result, result);
    
    // Manejar diferentes formatos de respuesta
    if (typeof result === 'string') {
      return result;
    }
    
    if (typeof result === 'object') {
      // Si tiene la propiedad response, usarla directamente
      if ('response' in result) {
        return result.response;
      }
      
      // Si tiene cualquier propiedad de tipo string, usar la primera que encontremos
      for (const key of Object.keys(result)) {
        if (typeof result[key] === 'string') {
          return result[key];
        }
      }
      
      // Último recurso: convertir el objeto completo a string
      return JSON.stringify(result);
    }
    
    // Caso extremo: el resultado es de un tipo no esperado
    return "Recibí una respuesta pero no pude interpretarla correctamente. ¿Puedes reformular tu pregunta?";
  } catch (error) {
    console.error('Error al procesar mensaje:', error);
    // Proporcionar un mensaje de error amigable al usuario
    return "Lo siento, estoy experimentando dificultades técnicas en este momento. Por favor, intenta de nuevo más tarde.";
  }
};
