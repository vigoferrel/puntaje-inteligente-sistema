
import { callOpenRouter } from "../../services/openrouter-service.ts";
import { createSuccessResponse, createErrorResponse } from "../../utils/response-utils.ts";

/**
 * Genera un lote de ejercicios según los parámetros especificados
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
