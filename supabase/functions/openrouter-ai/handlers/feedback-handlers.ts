
import { callOpenRouter } from "../services/openrouter-service.ts";
import { processAIResponse, createSuccessResponse, createErrorResponse } from "../utils/response-utils.ts";

/**
 * Manejador para la acción de retroalimentación
 */
export async function provideFeedback(payload: any): Promise<any> {
  try {
    const { userMessage, context } = payload;

    if (!userMessage) {
      return createErrorResponse('Se requiere un mensaje del usuario para proporcionar feedback');
    }

    const systemPrompt = `You are LectoGuía, an educational AI assistant specializing in helping students prepare for the Chilean PAES exam, particularly in reading comprehension.
    Your goal is to provide clear, accurate, and helpful responses to student queries related to PAES preparation.
    Your responses should be well-formatted, concise, and directly address the student's questions.`;

    const userPrompt = `Student message: ${userMessage}
    Context: ${context || 'PAES preparation, reading comprehension'}
    
    Provide a helpful, encouraging response that addresses their question specifically.
    Keep your answer concise and focused on their needs.`;

    console.log('Providing feedback with improved prompt format');
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
