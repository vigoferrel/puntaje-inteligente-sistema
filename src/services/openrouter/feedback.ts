
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
    
    const result = await openRouterService<AIFeedback>({
      action: "provide_exercise_feedback",
      payload: {
        exerciseAttempt,
        correctAnswer,
        explanation,
        requestedAt: new Date().toISOString()
      }
    });
    
    console.log('Feedback recibido:', result);
    return result;
  } catch (error) {
    console.error('Error al obtener feedback de ejercicio:', error);
    // Return a valid AIFeedback object without the errorMessage property
    return {
      isCorrect: false,
      feedback: "Lo siento, no pude evaluar tu respuesta. Por favor intenta de nuevo más tarde.",
      explanation: error instanceof Error ? `Error: ${error.message}` : "Error desconocido al procesar la respuesta",
      tips: ["Intenta de nuevo más tarde", "Verifica tu conexión a internet"]
    };
  }
};

/**
 * Procesa mensajes del usuario para proporcionar retroalimentación general
 */
export const provideChatFeedback = async (
  userMessage: string,
  context?: string,
  previousMessages?: any[]
): Promise<string | null> => {
  try {
    console.log('Solicitando respuesta para mensaje:', userMessage);
    
    const result = await openRouterService<any>({
      action: "provide_feedback",
      payload: {
        userMessage,
        context: context || "general assistance",
        previousMessages: previousMessages || []
      }
    });
    
    // Manejar diferentes formatos de respuesta
    if (!result) {
      return null;
    }
    
    if (typeof result === 'string') {
      return result;
    }
    
    if (typeof result === 'object' && 'response' in result) {
      return result.response;
    }
    
    return JSON.stringify(result);
  } catch (error) {
    console.error('Error al procesar mensaje:', error);
    return null;
  }
};
