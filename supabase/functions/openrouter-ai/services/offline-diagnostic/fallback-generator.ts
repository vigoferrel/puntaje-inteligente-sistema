
import { MonitoringService } from "../monitoring-service.ts";
import { DiagnosticTemplateService } from "./diagnostic-template-service.ts";
import { ExerciseBankService } from "./exercise-bank-service.ts";

/**
 * Service responsible for generating fallback exercises and diagnostics
 */
export class FallbackGeneratorService {
  /**
   * Genera un ejercicio básico cuando no hay disponibles
   */
  static generateBasicExercise(testId: number, skill: string, index: number): any {
    return {
      id: `offline-${testId}-${skill}-${index}`,
      question: `Ejercicio de ejemplo para evaluar la habilidad ${skill} (los ejercicios reales estarán disponibles pronto)`,
      options: ["Opción A", "Opción B", "Opción C", "Opción D"],
      correctAnswer: "Opción A",
      explanation: "Este es un ejercicio generado automáticamente cuando el servicio principal no está disponible",
      skill: skill,
      difficulty: "BASIC",
      isOfflineGenerated: true
    };
  }
  
  /**
   * Genera un diagnóstico offline basado en las plantillas disponibles
   */
  static generateOfflineDiagnostic(testId: number, skills: string[], exercisesPerSkill: number): any {
    MonitoringService.info(`Generando diagnóstico offline para test ${testId} con habilidades: ${skills.join(', ')}`);
    
    const template = DiagnosticTemplateService.getTemplateForTest(testId);
    
    const exercises: any[] = [];
    
    // Intentar obtener ejercicios del banco para cada habilidad
    skills.forEach(skill => {
      const availableExercises = ExerciseBankService.getExercisesFromBank(testId, skill);
      
      // Si hay suficientes ejercicios en el banco, tomarlos
      if (availableExercises.length >= exercisesPerSkill) {
        // Seleccionar aleatoriamente exercisesPerSkill ejercicios
        const selectedExercises = ExerciseBankService.getRandomExercises(availableExercises, exercisesPerSkill);
        exercises.push(...selectedExercises);
      } else {
        // Si no hay suficientes, generar algunos básicos
        for (let i = 0; i < exercisesPerSkill; i++) {
          exercises.push(this.generateBasicExercise(testId, skill, i));
        }
      }
    });
    
    return {
      title: template.title,
      description: template.description,
      exercises: exercises,
      isOfflineGenerated: true
    };
  }
}
