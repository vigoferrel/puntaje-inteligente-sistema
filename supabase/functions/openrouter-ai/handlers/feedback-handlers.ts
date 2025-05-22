
import { callOpenRouter } from "../services/openrouter-service.ts";
import { processAIResponse, createSuccessResponse, createErrorResponse } from "../utils/response-utils.ts";

/**
 * Manejador para la acción de retroalimentación
 */
export async function provideFeedback(payload: any): Promise<any> {
  try {
    const { userMessage, context, previousMessages = [] } = payload;

    if (!userMessage) {
      return createErrorResponse('Se requiere un mensaje del usuario para proporcionar feedback');
    }
    
    // Determinar el contexto de materia o el contexto general
    const currentSubject = context?.includes('subject:') 
      ? context.split('subject:')[1]?.split(',')[0]?.trim() 
      : 'general';
    
    let subjectPrompt = '';
    switch (currentSubject) {
      case 'lectura':
        subjectPrompt = 'especialista en comprensión lectora y análisis de textos';
        break;
      case 'matematicas':
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

    const systemPrompt = `You are LectoGuía, an AI educational assistant specializing in helping students prepare for the Chilean PAES exam.
    You are currently acting as a ${subjectPrompt}.
    Your goal is to provide clear, accurate, and helpful responses to student queries related to PAES preparation.
    You also know about the platform's features including: Diagnostic tests, Learning Plan, Simulations, History content, and Exercises.
    Your responses should be well-formatted, concise, and directly address the student's questions in Spanish.`;

    // Construir un contexto conversacional si hay mensajes previos
    let conversationContext = '';
    if (previousMessages && previousMessages.length > 0) {
      conversationContext = "Previous conversation:\n" + previousMessages
        .map((msg: any) => `${msg.role}: ${msg.content.substring(0, 150)}...`)
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

    // Process the AI response to ensure it has the expected format
    const formattedResponse = processAIResponse(result.result);
    return createSuccessResponse(formattedResponse);
  } catch (error) {
    console.error('Error in provideFeedback handler:', error);
    return createErrorResponse(`Error al proporcionar feedback: ${error.message}`, 500);
  }
}
