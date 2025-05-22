import { corsHeaders } from "../cors.ts";
import { callOpenRouter, callVisionModel } from "../services/openrouter-service.ts";
import { createErrorResponse, createSuccessResponse, processAIResponse } from "../utils/response-utils.ts";

/**
 * Handler for the 'generate_exercise' action
 */
export async function generateExercise(payload: any) {
  try {
    const { skill, prueba, difficulty, previousExercises } = payload;

    // Validate required parameters
    if (!skill) {
      return createErrorResponse('Se requiere especificar una habilidad');
    }

    const systemPrompt = `Eres un asistente educativo especializado en crear ejercicios para la preparación de la PAES (Prueba de Acceso a la Educación Superior de Chile).
    Tu tarea es crear ejercicios de alta calidad adaptados a las especificaciones solicitadas.
    Debes proporcionar ejercicios con contexto, pregunta, opciones, respuesta correcta y explicación.`;

    const userPrompt = `Crea un ejercicio de práctica para la prueba ${prueba || 'Comprensión Lectora'} 
    que evalúe la habilidad ${skill || 'Interpretar y Relacionar'} 
    con nivel de dificultad ${difficulty || 'intermedio'}.
    
    El ejercicio debe incluir:
    1. Un breve texto o contexto relevante para la prueba
    2. Una pregunta clara que evalúe la habilidad especificada
    3. Cuatro opciones de respuesta (A, B, C, D)
    4. La respuesta correcta
    5. Una explicación de por qué esa es la respuesta correcta
    
    Responde SOLO en formato JSON con las siguientes propiedades:
    { 
      "id": "id-único-generado", 
      "context": "texto o contexto", 
      "question": "pregunta", 
      "options": ["opción A", "opción B", "opción C", "opción D"], 
      "correctAnswer": "opción correcta", 
      "explanation": "explicación",  
      "skill": "${skill || 'INTERPRET_RELATE'}", 
      "prueba": "${prueba || 'COMPREHENSION_LECTORA'}", 
      "difficulty": "${difficulty || 'INTERMEDIATE'}" 
    }`;

    console.log('Generating exercise with prompt:', userPrompt.substring(0, 100) + '...');
    const result = await callOpenRouter(systemPrompt, userPrompt);

    if (result.error) {
      console.error('Error generating exercise:', result.error);
      return createErrorResponse(result.error, 500, result.fallbackResponse);
    }

    return createSuccessResponse(result.result);
  } catch (error) {
    console.error('Error in generateExercise handler:', error);
    return createErrorResponse(`Error al generar ejercicio: ${error.message}`, 500);
  }
}

/**
 * Handler for the 'analyze_performance' action
 */
export async function analyzePerformance(payload: any) {
  try {
    const { answers } = payload;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return createErrorResponse('Se requiere una lista de respuestas para analizar el rendimiento');
    }

    const systemPrompt = `Eres un asistente educativo especializado en analizar el rendimiento de los estudiantes en pruebas de comprensión lectora para la PAES.
    Tu tarea es identificar las fortalezas y áreas de mejora del estudiante basándote en sus respuestas a una serie de preguntas.
    Debes proporcionar recomendaciones específicas y pasos a seguir para mejorar su rendimiento.`;

    const userPrompt = `Analiza el rendimiento del estudiante basándote en las siguientes respuestas:
    ${JSON.stringify(answers)}
    
    Proporciona:
    1. Una lista de las fortalezas del estudiante
    2. Una lista de las áreas en las que el estudiante necesita mejorar
    3. Recomendaciones específicas para mejorar su rendimiento
    4. Pasos a seguir para implementar esas recomendaciones
    
    Responde SOLO en formato JSON con las siguientes propiedades:
    { 
      "strengths": ["fortaleza 1", "fortaleza 2", "fortaleza 3"], 
      "areasForImprovement": ["área de mejora 1", "área de mejora 2", "área de mejora 3"], 
      "recommendations": ["recomendación 1", "recomendación 2", "recomendación 3"], 
      "nextSteps": ["paso 1", "paso 2", "paso 3"] 
    }`;

    console.log('Analyzing performance based on answers:', answers.length, 'answers');
    const result = await callOpenRouter(systemPrompt, userPrompt);

    if (result.error) {
      console.error('Error analyzing performance:', result.error);
      return createErrorResponse(result.error, 500, result.fallbackResponse);
    }

    return createSuccessResponse(result.result);
  } catch (error) {
    console.error('Error in analyzePerformance handler:', error);
    return createErrorResponse(`Error al analizar el rendimiento: ${error.message}`, 500);
  }
}

/**
 * Handler for the 'provide_feedback' action
 */
export async function provideFeedback(payload: any) {
  try {
    const { userMessage, context } = payload;

    if (!userMessage) {
      return createErrorResponse('Se requiere un mensaje del usuario para proporcionar feedback');
    }

    const systemPrompt = `You are LectoGuía, an educational AI assistant specializing in helping students prepare for the Chilean PAES exam, particularly in reading comprehension.
    Your goal is to provide clear, accurate, and helpful responses to student queries related to PAES preparation.
    You should be supportive, patient, and encouraging while maintaining high educational standards.
    Your guidance should align with the official PAES assessment criteria.
    When you don't know something, admit it rather than making up information.`;

    const userPrompt = `Student message: ${userMessage}
    Context: ${context || 'PAES preparation, reading comprehension'}`;

    console.log('Providing feedback based on user message:', userMessage.substring(0, 100) + '...');
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

/**
 * Handler for the 'process_image' action
 */
export async function processImage(payload: any) {
  try {
    const { image, prompt, context } = payload;

    if (!image) {
      return createErrorResponse('Se requiere una imagen para procesar');
    }

    const systemPrompt = `Eres un asistente educativo especializado en comprensión lectora y análisis de textos para la preparación de la PAES.
    Tu tarea es analizar imágenes, especialmente aquellas que contienen texto, extraer su contenido y proporcionar un análisis claro y conciso.
    Cuando se te presente una imagen, debes:
    1. Extraer todo el texto visible de manera precisa
    2. Analizar y resumir el contenido principal
    3. Proporcionar información relevante para la preparación de la PAES
    Responde de manera clara, instructiva y orientada al estudiante.`;

    const userPrompt = prompt || "Analiza esta imagen y extrae todo el texto que puedas encontrar";

    console.log('Processing image with prompt:', prompt);
    const result = await callVisionModel(systemPrompt, userPrompt, image);

    if (result.error) {
      console.error('Error processing image:', result.error);
      return createErrorResponse(result.error, 500, result.fallbackResponse);
    }

    // Format the response
    let response = {
      response: result.result || "No se pudo extraer contenido de la imagen",
      extractedText: null,
      analysis: null
    };

    return createSuccessResponse(response);
  } catch (error) {
    console.error('Error in processImage handler:', error);
    
    // Provide a helpful error message and fallback response
    const fallbackResponse = {
      response: "Lo siento, tuve problemas procesando esta imagen. Por favor, intenta con una imagen diferente o proporciona más detalles sobre lo que necesitas.",
      extractedText: null,
      analysis: null
    };
    
    return createErrorResponse(
      `Error al procesar imagen: ${error.message}`, 
      500,
      fallbackResponse
    );
  }
}
