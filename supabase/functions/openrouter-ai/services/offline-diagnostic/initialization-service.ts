
import { MonitoringService } from "../monitoring-service.ts";
import { ExerciseBankService } from "./exercise-bank-service.ts";

/**
 * Service responsible for initializing the offline diagnostic service
 * Versión simplificada para reducir la carga
 */
export class InitializationService {
  // Flag para evitar múltiples inicializaciones
  private static initialized = false;
  
  /**
   * Inicializa el servicio con ejercicios pregenerados
   * Esto debería llamarse al iniciar la función
   */
  static initialize(): void {
    // Solo inicializar una vez
    if (this.initialized) {
      MonitoringService.info("Servicio de diagnóstico offline ya estaba inicializado");
      return;
    }
    
    this.initialized = true;
    this.loadMinimalExercises();
    MonitoringService.info("Servicio de diagnóstico offline inicializado");
  }
  
  /**
   * Carga un conjunto mínimo de ejercicios para reducir la carga
   */
  private static loadMinimalExercises(): void {
    // Matemáticas - Resolución de problemas (solo un ejercicio)
    ExerciseBankService.addExercisesToBank(2, "SOLVE_PROBLEMS", [
      {
        id: "math-sp-1",
        question: "Si 3x + 5 = 17, ¿cuál es el valor de x?",
        options: ["2", "3", "4", "6"],
        correctAnswer: "4",
        explanation: "Resolvemos 3x + 5 = 17, restando 5 a ambos lados: 3x = 12, luego dividimos por 3: x = 4",
        difficulty: "BASIC"
      }
    ]);
    
    // Lectura - Localizar información (solo un ejercicio)
    ExerciseBankService.addExercisesToBank(1, "TRACK_LOCATE", [
      {
        id: "read-tl-1",
        question: "Según el texto, ¿en qué año ocurrió el evento principal?",
        options: ["1945", "1953", "1962", "1978"],
        correctAnswer: "1962",
        explanation: "En el párrafo 2 se menciona explícitamente que el evento ocurrió en 1962",
        difficulty: "BASIC"
      }
    ]);
  }
}
