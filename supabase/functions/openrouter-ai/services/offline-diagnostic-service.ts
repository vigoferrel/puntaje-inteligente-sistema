
import { MonitoringService } from "./monitoring-service.ts";
import { 
  ExerciseBankService,
  FallbackGeneratorService,
  InitializationService
} from "./offline-diagnostic/index.ts";

/**
 * Servicio para proporcionar diagnósticos cuando estamos en modo offline o degradado
 * Implementa un sistema de plantillas pre-generadas para garantizar disponibilidad
 * 
 * Este archivo actúa como fachada para mantener compatibilidad con el código existente
 */
export class OfflineDiagnosticService {
  /**
   * Inicializa el servicio con ejercicios pregenerados
   * Esto debería llamarse al iniciar la función
   */
  static initialize(): void {
    InitializationService.initialize();
  }
  
  /**
   * Genera un diagnóstico offline basado en las plantillas disponibles
   */
  static generateOfflineDiagnostic(testId: number, skills: string[], exercisesPerSkill: number): any {
    return FallbackGeneratorService.generateOfflineDiagnostic(testId, skills, exercisesPerSkill);
  }
  
  /**
   * Registra nuevos ejercicios en el banco de ejercicios
   * Esto permite aprender y mejorar el sistema offline con el tiempo
   */
  static registerExercises(testId: number, skill: string, exercises: any[]): void {
    ExerciseBankService.registerExercises(testId, skill, exercises);
  }
  
  /**
   * Verifica si el servicio offline tiene suficientes ejercicios para una prueba/habilidad
   */
  static hasEnoughExercises(testId: number, skill: string, needed: number): boolean {
    return ExerciseBankService.hasEnoughExercises(testId, skill, needed);
  }
}

// Inicializar el servicio al cargar el módulo
OfflineDiagnosticService.initialize();
