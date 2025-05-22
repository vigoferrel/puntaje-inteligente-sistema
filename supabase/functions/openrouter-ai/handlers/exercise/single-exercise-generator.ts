
import { callOpenRouter } from "../../services/openrouter-service.ts";
import { processAIResponse, createErrorResponse } from "../../utils/response-utils.ts";

/**
 * Genera un ejercicio individual basado en habilidad, prueba y dificultad
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
