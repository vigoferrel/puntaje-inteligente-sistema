
import { MonitoringService } from "../monitoring-service.ts";

/**
 * Service responsible for managing the offline exercise bank
 */
export class ExerciseBankService {
  // Banco de ejercicios pre-generados por habilidad y prueba
  private static exerciseBank: Record<string, any[]> = {};
  
  /**
   * Añade ejercicios al banco
   */
  static addExercisesToBank(testId: number, skill: string, exercises: any[]): void {
    const key = `${testId}-${skill}`;
    this.exerciseBank[key] = [...(this.exerciseBank[key] || []), ...exercises];
  }
  
  /**
   * Obtiene ejercicios del banco para una combinación de prueba y habilidad
   */
  static getExercisesFromBank(testId: number, skill: string): any[] {
    const key = `${testId}-${skill}`;
    return this.exerciseBank[key] || [];
  }
  
  /**
   * Selecciona ejercicios aleatorios sin repetición
   */
  static getRandomExercises(exercises: any[], count: number): any[] {
    const shuffled = [...exercises].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  
  /**
   * Verifica si hay suficientes ejercicios disponibles
   */
  static hasEnoughExercises(testId: number, skill: string, needed: number): boolean {
    const key = `${testId}-${skill}`;
    return (this.exerciseBank[key] || []).length >= needed;
  }
  
  /**
   * Registra nuevos ejercicios en el banco de ejercicios
   * Esto permite aprender y mejorar el sistema offline con el tiempo
   */
  static registerExercises(testId: number, skill: string, exercises: any[]): void {
    const validExercises = exercises.filter(e => 
      e && e.question && Array.isArray(e.options) && e.correctAnswer);
      
    if (validExercises.length > 0) {
      this.addExercisesToBank(testId, skill, validExercises);
      MonitoringService.info(`Registrados ${validExercises.length} ejercicios en banco offline para ${testId}-${skill}`);
    }
  }
}
