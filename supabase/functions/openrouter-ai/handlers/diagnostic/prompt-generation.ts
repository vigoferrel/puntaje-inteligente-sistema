
/**
 * Responsible for generating optimized prompts for diagnostic creation
 */

/**
 * Optimiza el prompt del sistema para Gemini 2.5
 */
export function generateSystemPrompt(testId: number, skills: string[], exercisesPerSkill: number, difficulty: string): string {
  return `Eres un asistente especializado en crear diagnósticos educativos para la prueba PAES, con enfoque en pedagogía chilena.
Tu tarea es generar un diagnóstico completo y estructurado con exactamente ${exercisesPerSkill} ejercicios de alta calidad para cada una de estas habilidades: ${skills.join(', ')}.
La dificultad general debe ser: ${difficulty}.

REGLAS IMPORTANTES:
1. Todos los ejercicios deben estar diseñados específicamente para medir habilidades PAES.
2. Incluye SIEMPRE explicaciones detalladas de cada respuesta correcta.
3. Cada pregunta debe tener EXACTAMENTE 4 opciones.
4. La dificultad debe ser consistente con el nivel solicitado (BASIC/INTERMEDIATE/ADVANCED).

Formatea tu respuesta como un objeto JSON con la siguiente estructura exacta:
{
  "title": "Título descriptivo del diagnóstico",
  "description": "Descripción clara explicando el propósito y habilidades evaluadas",
  "exercises": [
    {
      "question": "Pregunta completa y clara",
      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
      "correctAnswer": "Texto exacto de la opción correcta",
      "explanation": "Explicación detallada de por qué esta es la respuesta correcta",
      "skill": "Habilidad específica evaluada",
      "difficulty": "${difficulty}"
    },
    ... más ejercicios ...
  ]
}

Cada ejercicio debe ser original, desafiante y evaluativo según el nivel solicitado.`;
}

/**
 * Optimiza el prompt del usuario para Gemini 2.5
 */
export function generateUserPrompt(testId: number, skills: string[], exercisesPerSkill: number, difficulty: string): string {
  return `Genera un diagnóstico completo para el test ${testId} que evalúe estas habilidades específicas: ${skills.join(', ')}.
Incluye exactamente ${exercisesPerSkill} ejercicios por habilidad con nivel de dificultad ${difficulty}.
Asegúrate que:
1. El diagnóstico sea coherente y enfocado en las habilidades solicitadas
2. Los ejercicios sean variados y representen situaciones reales de evaluación
3. Las preguntas sean claras y las opciones plausibles
4. Las explicaciones sean didácticas y ayuden a comprender conceptos clave
5. El contenido esté adaptado al contexto educativo chileno

Responde ÚNICAMENTE con el objeto JSON solicitado, sin comentarios adicionales.`;
}
