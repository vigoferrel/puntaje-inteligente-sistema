
import { callOpenRouter } from "../services/openrouter-service.ts";
import { createDiagnosticFallback, processAIResponse } from "../utils/response-utils.ts";

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
