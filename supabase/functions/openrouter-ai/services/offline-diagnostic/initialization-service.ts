
import { MonitoringService } from "../monitoring-service.ts";
import { ExerciseBankService } from "./exercise-bank-service.ts";

/**
 * Service responsible for initializing the offline diagnostic service
 */
export class InitializationService {
  /**
   * Inicializa el servicio con ejercicios pregenerados
   * Esto debería llamarse al iniciar la función
   */
  static initialize(): void {
    this.loadPregeneratedExercises();
    MonitoringService.info("Servicio de diagnóstico offline inicializado");
  }
  
  /**
   * Carga ejercicios pregenerados desde archivo o memoria
   */
  private static loadPregeneratedExercises(): void {
    // En una implementación real, cargaríamos de un archivo o base de datos
    // Por ahora, usamos algunos ejercicios de ejemplo duros
    
    // Matemáticas - Resolución de problemas
    ExerciseBankService.addExercisesToBank(2, "SOLVE_PROBLEMS", [
      {
        id: "math-sp-1",
        question: "Si 3x + 5 = 17, ¿cuál es el valor de x?",
        options: ["2", "3", "4", "6"],
        correctAnswer: "4",
        explanation: "Resolvemos 3x + 5 = 17, restando 5 a ambos lados: 3x = 12, luego dividimos por 3: x = 4",
        difficulty: "BASIC"
      },
      {
        id: "math-sp-2",
        question: "En un triángulo rectángulo, los catetos miden 6 cm y 8 cm. ¿Cuál es la longitud de la hipotenusa?",
        options: ["10 cm", "14 cm", "12 cm", "9 cm"],
        correctAnswer: "10 cm",
        explanation: "Aplicamos el teorema de Pitágoras: h² = 6² + 8² = 36 + 64 = 100, por lo tanto h = 10 cm",
        difficulty: "INTERMEDIATE"
      }
    ]);
    
    // Lectura - Localizar información
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
