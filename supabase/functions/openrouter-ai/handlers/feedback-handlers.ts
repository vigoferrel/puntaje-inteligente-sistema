
import { callOpenRouter } from "../services/openrouter-service.ts";
import { processAIResponse, createSuccessResponse, createErrorResponse } from "../utils/response-utils.ts";

/**
 * Manejador para la acción de retroalimentación
 */
export async function provideFeedback(payload: any): Promise<any> {
  try {
    // Extraer los parámetros enviados desde el frontend
    // Aceptar tanto 'message' como 'userMessage' para compatibilidad
    const userMessage = payload.message || payload.userMessage || payload.content || "";
    const context = payload.context || payload.subject || '';
    const previousMessages = payload.history || payload.previousMessages || [];
    const systemPromptOverride = payload.systemPrompt || '';

    console.log('Feedback Handler: Recibido payload:', {
      messageLength: userMessage.length,
      context,
      prevMsgCount: previousMessages.length,
      hasSystemPrompt: !!systemPromptOverride
    });

    if (!userMessage && !systemPromptOverride) {
      console.warn('Feedback Handler: No se proporcionó mensaje de usuario');
      return createErrorResponse('Se requiere un mensaje del usuario para proporcionar feedback');
    }
    
    // Determinar el contexto de materia o el contexto general
    const currentSubject = context?.includes('subject:') 
      ? context.split('subject:')[1]?.split(',')[0]?.trim() 
      : (context || 'general');
    
    let subjectPrompt = '';
    switch (currentSubject) {
      case 'lectura':
        subjectPrompt = 'especialista en comprensión lectora y análisis de textos';
        break;
      case 'matematicas':
      case 'matematicas-basica':
      case 'matematicas-avanzada':  
        subjectPrompt = 'especialista en matemáticas, álgebra, geometría y estadística';
        break;
      case 'ciencias':
        subjectPrompt = 'especialista en ciencias (física, química y biología)';
        break;
      case 'historia':
        subjectPrompt = 'especialista en historia, geografía y ciencias sociales';
        break;
      default:
        subjectPrompt = 'asistente educativo general';
    }

    const systemPrompt = systemPromptOverride || `You are LectoGuía, an AI educational assistant specializing in helping students prepare for the Chilean PAES exam.
    You are currently acting as a ${subjectPrompt}.
    Your goal is to provide clear, accurate, and helpful responses to student queries related to PAES preparation.
    You also know about the platform's features including: Diagnostic tests, Learning Plan, Simulations, History content, and Exercises.
    Your responses should be well-formatted, concise, and directly address the student's questions in Spanish.`;

    // Construir un contexto conversacional si hay mensajes previos
    let conversationContext = '';
    if (previousMessages && previousMessages.length > 0) {
      conversationContext = "Previous conversation:\n" + previousMessages
        .map((msg: any) => `${msg.role || 'user'}: ${(msg.content || '').substring(0, 150)}...`)
        .join("\n");
    }

    const userPrompt = `Student message: ${userMessage}
    Context: ${context || 'PAES preparation, general assistance'}
    ${conversationContext}
    
    Provide a helpful, encouraging response that addresses their question specifically.
    Keep your answer concise and focused on their needs.
    Always respond in Spanish, as the student is a native Spanish speaker.`;

    console.log('Providing feedback with comprehensive subject support');
    const result = await callOpenRouter(systemPrompt, userPrompt);

    if (result.error) {
      console.error('Error providing feedback:', result.error);
      return createErrorResponse(result.error, 500, result.fallbackResponse);
    }

    // Procesar la respuesta de la IA para asegurar formato adecuado
    const processedResponse = processAIResponse(result.result);
    
    // Registrar la respuesta procesada para depuración
    console.log('Processed response for client:', 
                typeof processedResponse, 
                Object.keys(processedResponse).length > 0 ? 
                  Object.keys(processedResponse) : 'Sin propiedades');
    
    return createSuccessResponse(processedResponse);
  } catch (error) {
    console.error('Error in provideFeedback handler:', error);
    return createErrorResponse(`Error al proporcionar feedback: ${error.message}`, 500, {
      response: "Lo siento, ocurrió un error al procesar tu mensaje. Por favor intenta de nuevo más tarde."
    });
  }
}
