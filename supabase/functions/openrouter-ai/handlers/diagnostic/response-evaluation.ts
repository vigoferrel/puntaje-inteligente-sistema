
/**
 * Responsible for evaluating and processing AI responses
 */
import { MonitoringService } from "../../services/monitoring-service.ts";
import { extractJsonFromContent } from "../../utils/json-extractor.ts";

/**
 * Procesa y valida la respuesta de la IA
 */
export function processAIResponse(content: any): any {
  // Si el contenido ya es un objeto, usarlo directamente
  if (typeof content === 'object' && content !== null) {
    return validateDiagnostic(content);
  }
  
  // Si es texto, intentar extraer JSON
  if (typeof content === 'string') {
    try {
      const parsedContent = extractJsonFromContent(content);
      if (parsedContent) {
        return validateDiagnostic(parsedContent);
      }
    } catch (error) {
      MonitoringService.error('Error al procesar respuesta de IA:', error);
    }
  }
  
  // Si llegamos aquí, la respuesta no es válida
  return null;
}

/**
 * Valida y sanitiza el diagnóstico generado
 */
export function validateDiagnostic(diagnostic: any): any {
  if (!diagnostic || !diagnostic.exercises || !Array.isArray(diagnostic.exercises)) {
    MonitoringService.warn('Diagnóstico inválido recibido', diagnostic);
    return null;
  }
  
  // Validar y filtrar ejercicios
  const validExercises = diagnostic.exercises.filter((exercise: any) => {
    return exercise &&
           typeof exercise.question === 'string' &&
           Array.isArray(exercise.options) &&
           exercise.options.length >= 2 &&
           typeof exercise.correctAnswer === 'string';
  });
  
  if (validExercises.length === 0) {
    MonitoringService.warn('No hay ejercicios válidos en el diagnóstico', diagnostic);
    return null;
  }
  
  return {
    title: diagnostic.title || 'Diagnóstico PAES',
    description: diagnostic.description || 'Evaluación de habilidades para la prueba PAES',
    exercises: validExercises
  };
}

/**
 * Evalúa la calidad del contenido generado
 */
export function evaluateContentQuality(content: any): { 
  score: number;
  accuracy: number;
  relevance: number; 
  creativity: number;
  feedback: string;
} {
  if (!content || !content.exercises || content.exercises.length === 0) {
    return {
      score: 0,
      accuracy: 0,
      relevance: 0,
      creativity: 0,
      feedback: "Contenido inválido o vacío"
    };
  }
  
  // Contar ejercicios con los elementos requeridos
  const totalExercises = content.exercises.length;
  const exercisesWithAllElements = content.exercises.filter((ex: any) => 
    ex.question && 
    ex.options && 
    ex.options.length === 4 &&
    ex.correctAnswer && 
    ex.explanation &&
    ex.skill &&
    ex.difficulty
  ).length;
  
  // Calcular puntuaciones
  const accuracy = exercisesWithAllElements / totalExercises;
  const relevance = content.title && content.description ? 1.0 : 0.7;
  
  // Calcular creatividad basada en la longitud y diversidad de explicaciones
  let totalExplanationLength = 0;
  const uniqueWords = new Set<string>();
  
  content.exercises.forEach((ex: any) => {
    if (ex.explanation) {
      totalExplanationLength += ex.explanation.length;
      ex.explanation.split(/\s+/).forEach((word: string) => uniqueWords.add(word.toLowerCase()));
    }
  });
  
  const avgExplanationLength = totalExercises > 0 ? totalExplanationLength / totalExercises : 0;
  const creativity = Math.min(uniqueWords.size / 200, 1.0) * (Math.min(avgExplanationLength / 150, 1.0));
  
  // Puntuación global (ponderada)
  const score = (accuracy * 0.5) + (relevance * 0.3) + (creativity * 0.2);
  
  // Generar retroalimentación
  let feedback = "";
  if (score >= 0.8) {
    feedback = "Excelente calidad de contenido con explicaciones detalladas y ejercicios bien estructurados";
  } else if (score >= 0.6) {
    feedback = "Buena calidad pero puede mejorar en consistencia y detalle de explicaciones";
  } else {
    feedback = "Calidad insuficiente, faltan elementos importantes o el contenido no es adecuado";
  }
  
  return {
    score,
    accuracy,
    relevance,
    creativity,
    feedback
  };
}
