import { callOpenRouter, callVisionModel, ServiceResult } from "../services/openrouter-service.ts";
import { corsHeaders } from "../cors.ts";
import { createDiagnosticFallback, processAIResponse, createSuccessResponse, createErrorResponse } from "../utils/response-utils.ts";

/**
 * Manejador para la acción de generación de ejercicios
 */
export async function generateExercise(payload: any): Promise<any> {
  const { skill, prueba, difficulty } = payload;
  
  console.log(`Generando ejercicio para ${skill}, prueba ${prueba}, dificultad ${difficulty}`);
  
  const systemPrompt = `Eres un asistente especializado en crear ejercicios educativos para la prueba PAES.
  Debes generar ejercicios de alta calidad para la habilidad ${skill} en la prueba ${prueba}.
  Los ejercicios deben tener un nivel de dificultad: ${difficulty}.
  Formatea tu respuesta como un objeto JSON con los siguientes campos:
  {
    "question": "pregunta completa",
    "options": ["opción 1", "opción 2", "opción 3", "opción 4"],
    "correctAnswer": "opción correcta (texto exacto)",
    "explanation": "explicación detallada de la respuesta",
    "skill": "${skill}",
    "difficulty": "${difficulty}"
  }`;

  const userPrompt = `Genera un ejercicio de ${skill} para la prueba ${prueba} con dificultad ${difficulty}.
  Asegúrate de que sea desafiante pero factible para estudiantes de este nivel.
  Si es relevante, incluye un contexto o lectura breve. Proporciona cuatro opciones de respuesta.`;

  const response = await callOpenRouter(systemPrompt, userPrompt);
  
  if (response.error) {
    console.error('Error en la generación de ejercicio:', response.error);
    return {
      error: response.error,
      result: response.fallbackResponse || { 
        question: "¿Qué habilidad estamos practicando?", 
        options: [`${skill}`, "Comprensión lectora", "Razonamiento matemático", "Conocimiento científico"],
        correctAnswer: `${skill}`,
        explanation: "Este es un ejercicio de respaldo generado debido a un error en la API.",
        skill: skill,
        difficulty: difficulty 
      }
    };
  }
  
  return {
    result: processAIResponse(response.result)
  };
}

/**
 * Manejador para la acción de generación de lotes de ejercicios
 */
export async function generateExercisesBatch(payload: any): Promise<any> {
  try {
    const { nodeId, skill, testId, count, difficulty } = payload;
    const batchSize = count && !isNaN(Number(count)) ? Number(count) : 5;
    
    // Validate required parameters
    if (!skill) {
      return createErrorResponse('Se requiere especificar una habilidad');
    }
    
    const systemPrompt = `Eres un asistente educativo especializado en crear lotes de ejercicios para la preparación de la PAES.
    Tu tarea es crear ${batchSize} ejercicios de alta calidad adaptados a las especificaciones solicitadas.
    Cada ejercicio debe tener contexto, pregunta, opciones, respuesta correcta y explicación.
    Tu ÚNICA respuesta debe ser un array JSON válido y bien formateado, sin texto adicional.
    No utilices comillas simples dentro de las cadenas, utiliza comillas dobles escapadas.`;

    const userPrompt = `Crea ${batchSize} ejercicios diferentes de práctica para la prueba con ID ${testId || 1} 
    que evalúen la habilidad ${skill} con nivel de dificultad ${difficulty || 'MIXED'}.
    
    Cada ejercicio debe incluir:
    1. Un contexto relevante y diferente para cada uno
    2. Una pregunta clara que evalúe la habilidad especificada
    3. Cuatro opciones de respuesta (A, B, C, D)
    4. La respuesta correcta
    5. Una explicación de por qué esa es la respuesta correcta
    
    Responde ÚNICAMENTE con un array JSON con este formato exacto:
    [
      { 
        "id": "id-único-generado-1", 
        "context": "texto o contexto 1", 
        "question": "pregunta 1", 
        "options": ["opción A", "opción B", "opción C", "opción D"], 
        "correctAnswer": "opción correcta", 
        "explanation": "explicación",
        "skill": "${skill}",
        "difficulty": "BASIC|INTERMEDIATE|ADVANCED"
      },
      ... resto de ejercicios
    ]
    
    IMPORTANTE:
    - No incluyas backticks (\`\`\`) al principio o final del JSON
    - No escribas "json" ni ningún otro texto antes o después del array
    - No incluyas comentarios ni explicaciones adicionales
    - Asegúrate de escapar correctamente cualquier comilla dentro de las cadenas`;

    console.log('Generating exercise batch with improved JSON format prompt');
    const result = await callOpenRouter(systemPrompt, userPrompt);

    if (result.error) {
      console.error('Error generating exercise batch:', result.error);
      return createErrorResponse(result.error, 500, result.fallbackResponse);
    }
    
    // Asegurar que el resultado sea un array
    let exercises = result.result;
    if (!Array.isArray(exercises)) {
      try {
        if (typeof exercises === 'string') {
          exercises = JSON.parse(exercises);
        } else if (typeof exercises === 'object') {
          exercises = [exercises];
        }
      } catch (e) {
        console.error('Error parsing exercises array:', e);
        exercises = [];
      }
    }
    
    if (!Array.isArray(exercises)) {
      return createErrorResponse('Formato de respuesta inválido', 500);
    }

    return createSuccessResponse(exercises);
  } catch (error) {
    console.error('Error in generateExercisesBatch handler:', error);
    return createErrorResponse(`Error al generar lote de ejercicios: ${error.message}`, 500);
  }
}

/**
 * Manejador para la acción de generación de diagnósticos
 */
export async function generateDiagnostic(payload: any): Promise<any> {
  const { testId, skills, exercisesPerSkill = 3, difficulty = 'MIXED' } = payload;
  
  console.log(`Generando diagnóstico para test ${testId}, habilidades: ${skills.join(', ')}`);
  
  const systemPrompt = `Eres un asistente especializado en crear diagnósticos educativos para la prueba PAES.
  Debes generar un diagnóstico completo con ${exercisesPerSkill} ejercicios para cada una de estas habilidades: ${skills.join(', ')}.
  La dificultad general debe ser: ${difficulty}.
  Formatea tu respuesta como un objeto JSON con la siguiente estructura:
  {
    "title": "Título del diagnóstico",
    "description": "Descripción del diagnóstico",
    "exercises": [
      {
        "question": "pregunta completa",
        "options": ["opción 1", "opción 2", "opción 3", "opción 4"],
        "correctAnswer": "opción correcta (texto exacto)",
        "explanation": "explicación detallada",
        "skill": "habilidad específica",
        "difficulty": "BASIC|INTERMEDIATE|ADVANCED"
      },
      // Más ejercicios...
    ]
  }`;

  const userPrompt = `Genera un diagnóstico completo para el test ${testId} que evalúe estas habilidades: ${skills.join(', ')}.
  Incluye ${exercisesPerSkill} ejercicios por habilidad con una dificultad general ${difficulty}.
  Asegúrate de que los ejercicios sean variados y midan efectivamente cada habilidad.`;

  const response = await callOpenRouter(systemPrompt, userPrompt);
  
  if (response.error) {
    console.error('Error en la generación del diagnóstico:', response.error);
    return {
      error: response.error,
      result: response.fallbackResponse || createDiagnosticFallback(testId)
    };
  }
  
  return { result: processAIResponse(response.result) };
}

/**
 * Manejador para la acción de análisis de rendimiento
 */
export async function analyzePerformance(payload: any): Promise<any> {
  try {
    const { answers } = payload;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return createErrorResponse('Se requiere una lista de respuestas para analizar el rendimiento');
    }

    const systemPrompt = `Eres un asistente educativo especializado en analizar el rendimiento de los estudiantes en pruebas de comprensión lectora para la PAES.
    Tu única tarea es generar un objeto JSON válido con la estructura exacta solicitada.
    No debes incluir explicaciones, comentarios ni texto adicional en tu respuesta.`;

    const userPrompt = `Analiza el rendimiento del estudiante basándote en las siguientes respuestas:
    ${JSON.stringify(answers)}
    
    Proporciona:
    1. Una lista de las fortalezas del estudiante
    2. Una lista de las áreas en las que el estudiante necesita mejorar
    3. Recomendaciones específicas para mejorar su rendimiento
    4. Pasos a seguir para implementar esas recomendaciones
    
    Responde SOLO con este formato JSON exacto:
    { 
      "strengths": ["fortaleza 1", "fortaleza 2", "fortaleza 3"], 
      "areasForImprovement": ["área de mejora 1", "área de mejora 2", "área de mejora 3"], 
      "recommendations": ["recomendación 1", "recomendación 2", "recomendación 3"], 
      "nextSteps": ["paso 1", "paso 2", "paso 3"] 
    }
    
    No incluyas backticks, comentarios, ni texto explicativo adicional.`;

    console.log('Analyzing performance with improved JSON prompt format');
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

/**
 * Manejador para la acción de procesamiento de imágenes
 */
export async function processImage(payload: any): Promise<any> {
  const { image, prompt, context } = payload;
  
  if (!image) {
    console.error('No se proporcionó imagen para procesar');
    return {
      error: 'No se proporcionó imagen para procesar',
      result: { response: "Error: No se proporcionó una imagen para analizar." }
    };
  }
  
  console.log('Procesando imagen con prompt:', prompt || 'prompt predeterminado');
  
  const systemPrompt = `Eres un asistente especializado en analizar y extraer información de imágenes.
  Contexto: ${context || 'Análisis educativo'}.
  Debes analizar la imagen proporcionada y responder a la consulta del usuario.
  Si es posible, extrae cualquier texto visible en la imagen.
  Estructura tu respuesta como JSON cuando sea apropiado.`;

  const userPrompt = prompt || "Analiza esta imagen y extrae todo el texto que puedas encontrar. Describe brevemente su contenido.";

  const response = await callVisionModel(systemPrompt, userPrompt, image);
  
  if (response.error) {
    console.error('Error en el procesamiento de imagen:', response.error);
    return {
      error: response.error,
      result: response.fallbackResponse || { 
        response: "No se pudo analizar la imagen proporcionada debido a un error técnico." 
      }
    };
  }
  
  return { 
    result: processAIResponse(response.result) 
  };
}
