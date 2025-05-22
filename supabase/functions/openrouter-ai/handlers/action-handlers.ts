
import { corsHeaders } from "../cors.ts";
import { callOpenRouter, callVisionModel } from "../services/openrouter-service.ts";
import { 
  createErrorResponse, 
  createSuccessResponse, 
  processAIResponse, 
  extractJsonFromContent,
  createDiagnosticFallback 
} from "../utils/response-utils.ts";

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
    Tu ÚNICA salida debe ser un objeto JSON válido, sin texto adicional ni explicaciones.
    Respeta estrictamente el esquema JSON proporcionado, sin agregar comentarios ni marcadores.`;

    const userPrompt = `Crea un ejercicio de práctica para la prueba ${prueba || 'Comprensión Lectora'} 
    que evalúe la habilidad ${skill || 'Interpretar y Relacionar'} 
    con nivel de dificultad ${difficulty || 'intermedio'}.
    
    El ejercicio debe incluir:
    1. Un breve texto o contexto relevante para la prueba
    2. Una pregunta clara que evalúe la habilidad especificada
    3. Cuatro opciones de respuesta (A, B, C, D)
    4. La respuesta correcta
    5. Una explicación de por qué esa es la respuesta correcta
    
    Responde con EXACTAMENTE este formato JSON sin ningún otro texto adicional:
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
    }

    IMPORTANTE: Asegúrate de que todas las comillas internas estén correctamente escapadas.
    NO incluyas backticks, comentarios, ni marcadores alrededor del JSON.
    NO incluyas ninguna información adicional ni explicaciones antes o después del JSON.`;

    console.log('Generating exercise with improved JSON prompt');
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
 * Handler for the 'generate_exercises_batch' action with improved JSON generation
 */
export async function generateExercisesBatch(payload: any) {
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
 * Handler for the 'generate_diagnostic' action with improved JSON prompt and error handling
 */
export async function generateDiagnostic(payload: any) {
  try {
    const { testId, skills, exercisesPerSkill, difficulty } = payload;
    const skillsArray = Array.isArray(skills) ? skills : skills ? [skills] : [];
    const numExercisesPerSkill = exercisesPerSkill && !isNaN(Number(exercisesPerSkill)) ? 
      Number(exercisesPerSkill) : 3;
    
    // Log diagnostic generation request
    console.log(`Generating diagnostic for test ${testId} with skills: ${skillsArray.join(", ")}`);
    
    // Validate required parameters
    if (!testId || skillsArray.length === 0) {
      return createErrorResponse(
        'Se requiere especificar un testId y al menos una habilidad', 
        400
      );
    }
    
    // Create a more structured system prompt specifically designed to ensure valid JSON responses
    const systemPrompt = `Eres un asistente educativo especializado en crear diagnósticos para la preparación de la PAES.
    Tu única tarea es generar un objeto JSON válido con la estructura exacta solicitada.
    No debes incluir explicaciones, comentarios ni texto adicional en tu respuesta.
    No uses backticks, marcadores de código ni formateadores.
    Asegúrate de que todas las comillas estén correctamente escapadas.
    Tu respuesta debe poder ser procesada directamente por JSON.parse() sin modificaciones.`;

    // Create a detailed user prompt with clear JSON structure requirements
    const userPrompt = `Crea un diagnóstico completo para la prueba con ID ${testId}
    que evalúe las siguientes habilidades: ${skillsArray.join(', ')}.
    
    Genera exactamente este objeto JSON, sin ningún texto adicional:
    {
      "title": "título descriptivo del diagnóstico",
      "description": "descripción clara del propósito del diagnóstico",
      "exercises": [
        {
          "id": "id-único-1",
          "question": "pregunta concreta",
          "options": ["opción A", "opción B", "opción C", "opción D"],
          "correctAnswer": "texto exacto de la opción correcta",
          "explanation": "explicación de la respuesta correcta",
          "skill": "una de las habilidades solicitadas",
          "difficulty": "BASIC"
        },
        ... más ejercicios (${numExercisesPerSkill} por cada habilidad)
      ]
    }
    
    REGLAS CRÍTICAS:
    1. Genera EXACTAMENTE ${numExercisesPerSkill} ejercicios para CADA UNA de estas habilidades: ${skillsArray.join(', ')}
    2. Usa SOLO las dificultades: "BASIC", "INTERMEDIATE", o "ADVANCED"
    3. NO incluyas backticks, la palabra "json", ni ningún otro marcador
    4. NO incluyas comentarios ni texto explicativo dentro o fuera del JSON
    5. Asegúrate de que el valor de correctAnswer coincida EXACTAMENTE con una de las opciones
    6. Escapa correctamente todas las comillas internas usando \\\"
    7. La estructura debe ser exactamente la solicitada`;

    console.log('Generating diagnostic with improved JSON prompt');
    
    // First attempt with retry mechanism
    let result;
    let retryCount = 0;
    const maxRetries = 3;
    
    // Implementación de sistema de reintentos más robusto
    while (retryCount <= maxRetries) {
      console.log(`Intento ${retryCount + 1}/${maxRetries + 1} para generar diagnóstico`);
      
      result = await callOpenRouter(systemPrompt, userPrompt);
      
      if (!result.error) {
        try {
          // Try to parse and validate the response
          let diagnostic = result.result;
          
          // If string response, try to parse it with enhanced error handling
          if (typeof diagnostic === 'string') {
            try {
              diagnostic = JSON.parse(diagnostic);
              console.log('Successfully parsed diagnostic JSON string');
            } catch (e) {
              console.error('Error parsing diagnostic JSON string:', e);
              // Try extracting JSON from the content with improved extractor
              console.log('Attempting to extract JSON from response content');
              diagnostic = extractJsonFromContent(diagnostic);
            }
          }
          
          // Basic validation of the structure
          if (diagnostic && 
              typeof diagnostic === 'object' &&
              diagnostic.title && 
              diagnostic.description && 
              Array.isArray(diagnostic.exercises) && 
              diagnostic.exercises.length > 0) {
            
            console.log(`Successfully generated diagnostic with ${diagnostic.exercises.length} exercises`);
            return createSuccessResponse(diagnostic);
          }
          
          console.error('Invalid diagnostic format received, retrying...');
        } catch (parseError) {
          console.error('Error processing diagnostic result:', parseError);
        }
      } else {
        console.error(`Error from OpenRouter (attempt ${retryCount + 1}):`, result.error);
      }
      
      retryCount++;
      
      // Wait before retrying with exponential backoff
      if (retryCount <= maxRetries) {
        const backoffTime = Math.pow(2, retryCount) * 500; // 1s, 2s, 4s
        console.log(`Waiting ${backoffTime}ms before retry ${retryCount}...`);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
      }
    }
    
    // All attempts failed, return enhanced fallback diagnostic
    console.error('All attempts to generate diagnostic failed, returning fallback');
    const fallbackDiagnostic = createDiagnosticFallback(
      testId,
      `Diagnóstico para ${skillsArray.join(', ')}`,
      `Este diagnóstico evalúa las habilidades: ${skillsArray.join(', ')} para la prueba ${testId}.`
    );
    
    return createSuccessResponse(fallbackDiagnostic);
  } catch (error) {
    console.error('Error in generateDiagnostic handler:', error);
    return createErrorResponse(
      `Error al generar diagnóstico: ${error instanceof Error ? error.message : 'Unknown error'}`, 
      500,
      createDiagnosticFallback(payload.testId || 1)
    );
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
 * Handler for the 'provide_feedback' action with improved JSON format
 */
export async function provideFeedback(payload: any) {
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
 * Handler for the 'process_image' action with improved prompt
 */
export async function processImage(payload: any) {
  try {
    const { image, prompt, context } = payload;

    if (!image) {
      return createErrorResponse('Se requiere una imagen para procesar');
    }

    const systemPrompt = `Eres un asistente educativo especializado en comprensión lectora y análisis de textos para la preparación de la PAES.
    Tu tarea es analizar imágenes, extraer texto visible y proporcionar una respuesta clara y estructurada.
    Prioriza la extracción precisa del texto y organiza tu respuesta de manera concisa y útil para el estudiante.`;

    const userPrompt = prompt || "Analiza esta imagen y extrae todo el texto que puedas encontrar. Organiza el contenido de manera estructurada y fácil de comprender.";

    console.log('Processing image with improved vision model prompt');
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
