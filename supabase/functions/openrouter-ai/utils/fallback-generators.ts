
/**
 * Utilidades para generar respuestas de respaldo cuando las llamadas a IA fallan
 */

/**
 * Crea un diagnóstico de respaldo cuando la generación falla
 */
export function createDiagnosticFallback(
  testId: number, 
  title: string = "Diagnóstico de prueba",
  description: string = "Este es un diagnóstico generado automáticamente"
): any {
  console.log(`Creando diagnóstico de respaldo para ID de prueba: ${testId}`);
  
  // Definir habilidades básicas según el testId
  const skills = ['comprensión', 'análisis', 'interpretación', 'razonamiento'];
  
  // Crear ejercicios de ejemplo para cada habilidad
  const exercises = skills.map((skill, index) => ({
    id: `fallback-${testId}-${index}`,
    question: `¿Qué habilidad se está evaluando en esta pregunta de ${skill}?`,
    options: [
      `Capacidad de ${skills[0]}`,
      `Habilidad de ${skills[1]}`,
      `Competencia en ${skills[2]}`,
      `Destreza de ${skills[3]}`
    ],
    correctAnswer: `Habilidad de ${skill}`,
    explanation: `Esta pregunta evalúa específicamente la habilidad de ${skill}`,
    skill: skill.toUpperCase(),
    difficulty: index % 3 === 0 ? "BASIC" : index % 3 === 1 ? "INTERMEDIATE" : "ADVANCED"
  }));
  
  return {
    title: title || `Diagnóstico para Test ${testId}`,
    description: description || "Diagnóstico generado como respaldo ante errores en la generación con IA",
    exercises
  };
}
