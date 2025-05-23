
import { AIFeedback } from "@/types/ai-types";
import { openRouterService } from "./core";

// Caché mejorado para respuestas frecuentes
const feedbackCache: Record<string, { timestamp: number, response: any }> = {};
const CACHE_TTL = 30 * 60 * 1000; // 30 minutos

// Respuestas predefinidas para casos comunes o emergencias
const COMMON_RESPONSES: Record<string, string> = {
  "hola": "¡Hola! Soy LectoGuía, tu asistente de aprendizaje para la PAES. ¿En qué te puedo ayudar hoy?",
  "gracias": "¡De nada! Estoy aquí para apoyarte en tu preparación para la PAES. ¿Hay algo más en lo que pueda ayudarte?",
  "adios": "¡Hasta luego! Recuerda que puedo ayudarte con cualquier duda sobre la PAES cuando lo necesites.",
  "que eres": "Soy LectoGuía, un asistente de aprendizaje diseñado para ayudarte a prepararte para la PAES. Puedo responder preguntas sobre materias, generar ejercicios y guiarte en tu plan de estudio.",
  "error": "Lo siento, estoy teniendo problemas para acceder a toda mi información. Por favor intenta con una pregunta más simple o específica.",
  "offline": "Actualmente estoy funcionando en modo offline con capacidades limitadas. Puedo responder preguntas básicas pero no generar contenido complejo."
};

// Función para generar una clave de caché basada en los parámetros
const generateCacheKey = (message: string, context?: string): string => {
  const normalizedMessage = message.trim().toLowerCase().substring(0, 100);
  const normalizedContext = (context || '').toLowerCase().substring(0, 50);
  return `${normalizedContext}:${normalizedMessage}`;
};

/**
 * Busca una respuesta predefinida para preguntas muy comunes
 * Retorna null si no hay respuesta predefinida
 */
const getCommonResponse = (message: string): string | null => {
  const normalizedMessage = message.trim().toLowerCase();
  
  // Verificar coincidencias exactas
  for (const [key, response] of Object.entries(COMMON_RESPONSES)) {
    if (normalizedMessage === key || normalizedMessage.includes(key)) {
      return response;
    }
  }
  
  // Verificar coincidencias parciales para mensajes muy cortos
  if (normalizedMessage.length < 10) {
    for (const [key, response] of Object.entries(COMMON_RESPONSES)) {
      if (key.includes(normalizedMessage)) {
        return response;
      }
    }
  }
  
  return null;
};

/**
 * Proporciona retroalimentación sobre un ejercicio utilizando OpenRouter
 * Versión optimizada con retry y fallbacks
 */
export const provideExerciseFeedback = async (
  exerciseAttempt: { question: string; answer: string },
  correctAnswer: string,
  explanation: string
): Promise<AIFeedback | null> => {
  try {
    console.log('Solicitando feedback para respuesta:', exerciseAttempt);
    
    // Generar clave de caché
    const cacheKey = generateCacheKey(exerciseAttempt.answer, exerciseAttempt.question);
    const cachedItem = feedbackCache[cacheKey];
    
    // Verificar caché primero si existe y es válido
    if (cachedItem && (Date.now() - cachedItem.timestamp) < CACHE_TTL) {
      console.log('Usando feedback en caché');
      return cachedItem.response as AIFeedback;
    }
    
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
    
    // Respuesta fallback si no se pudo obtener respuesta
    if (!result) {
      console.log('Generando feedback fallback');
      
      // Generar feedback básico basado en coincidencia exacta
      const isExactMatch = exerciseAttempt.answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
      
      const fallbackFeedback: AIFeedback = {
        isCorrect: isExactMatch,
        feedback: isExactMatch 
          ? "Tu respuesta parece ser correcta basada en una comparación simple." 
          : "Tu respuesta parece diferir de la respuesta correcta.",
        explanation: "No pude realizar un análisis detallado en este momento, pero puedes revisar la explicación oficial: " + explanation,
        tips: ["Revisa la explicación proporcionada", "Intenta entender los conceptos fundamentales"]
      };
      
      // Guardar en caché para futuras consultas
      feedbackCache[cacheKey] = {
        timestamp: Date.now(),
        response: fallbackFeedback
      };
      
      return fallbackFeedback;
    }
    
    console.log('Feedback recibido:', result);
    
    // Guardar respuesta exitosa en caché
    feedbackCache[cacheKey] = {
      timestamp: Date.now(),
      response: result
    };
    
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
 * Versión mejorada con mejor manejo de errores, respuestas y caché
 */
export const provideChatFeedback = async (
  userMessage: string,
  context?: string,
  previousMessages?: any[]
): Promise<string | null> => {
  try {
    console.log('Solicitando respuesta para mensaje:', userMessage);
    
    // Verificar respuestas comunes primero (muy rápido)
    const commonResponse = getCommonResponse(userMessage);
    if (commonResponse) {
      console.log('Usando respuesta predefinida común');
      return commonResponse;
    }
    
    // Verificar si hay una respuesta en caché para consultas frecuentes
    const cacheKey = generateCacheKey(userMessage, context);
    const cachedItem = feedbackCache[cacheKey];
    
    if (cachedItem && (Date.now() - cachedItem.timestamp) < CACHE_TTL) {
      console.log('Usando respuesta en caché para:', userMessage);
      return cachedItem.response;
    }
    
    // Implementar sistema de reintentos con backoff exponencial
    let attempts = 0;
    const maxAttempts = 2;
    let result = null;
    
    while (attempts < maxAttempts && result === null) {
      try {
        // Configurar un timeout interno para la solicitud
        const timeoutPromise = new Promise<null>((_, reject) => {
          setTimeout(() => reject(new Error("Timeout interno")), 15000); // 15 segundos
        });
        
        // Competir entre la solicitud real y el timeout
        result = await Promise.race([
          openRouterService<any>({
            action: "provide_feedback",
            payload: {
              userMessage,
              context: context || "general assistance",
              previousMessages: previousMessages || [],
              timestamp: new Date().toISOString()
            }
          }),
          timeoutPromise
        ]);
        
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
    
    // Si después de todos los intentos no hay respuesta, generar respuesta fallback
    if (!result) {
      console.log('Generando respuesta fallback por falta de respuesta');
      
      // Para mensajes cortos o simples, intentar proporcionar una respuesta básica
      if (userMessage.length < 30) {
        const fallbackResponse = "Lo siento, estoy teniendo problemas para conectarme. Intenta con una pregunta más específica o vuelve más tarde cuando tenga mejor conectividad.";
        
        // Guardar en caché la respuesta fallback por tiempo limitado
        feedbackCache[cacheKey] = {
          timestamp: Date.now(),
          response: fallbackResponse
        };
        
        return fallbackResponse;
      }
      
      // Para mensajes más complejos
      return "No pude procesar completamente tu pregunta en este momento debido a limitaciones temporales. ¿Podrías simplificarla o dividirla en partes más pequeñas?";
    }
    
    console.log('Respuesta recibida del servicio:', typeof result, result);
    
    // Procesar la respuesta y guardar en caché
    let finalResponse: string;
    
    // Manejar diferentes formatos de respuesta
    if (typeof result === 'string') {
      finalResponse = result;
    } else if (typeof result === 'object') {
      // Si tiene la propiedad response, usarla directamente
      if ('response' in result) {
        finalResponse = result.response;
      } else if (result.success && typeof result.result === 'string') {
        finalResponse = result.result;
      } else {
        // Último recurso: convertir el objeto a string de manera legible
        try {
          finalResponse = JSON.stringify(result, null, 2);
        } catch (e) {
          finalResponse = "Recibí una respuesta en formato incorrecto.";
        }
      }
    } else {
      finalResponse = "He recibido tu mensaje, pero tuve dificultades procesando la respuesta. ¿Puedes reformular tu pregunta?";
    }
    
    // Guardar en caché
    feedbackCache[cacheKey] = {
      timestamp: Date.now(),
      response: finalResponse
    };
    
    // Limpiar caché si se hace muy grande
    if (Object.keys(feedbackCache).length > 100) {
      const oldestKeys = Object.keys(feedbackCache)
        .sort((a, b) => feedbackCache[a].timestamp - feedbackCache[b].timestamp)
        .slice(0, 20);
        
      oldestKeys.forEach(key => delete feedbackCache[key]);
    }
    
    return finalResponse;
  } catch (error) {
    console.error('Error al procesar mensaje:', error);
    // Proporcionar un mensaje de error amigable al usuario
    return "Lo siento, estoy experimentando dificultades técnicas en este momento. Por favor, intenta de nuevo más tarde o con una pregunta más simple.";
  }
};
