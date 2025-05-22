
import { MonitoringService } from "../monitoring-service.ts";
import { ExerciseBankService } from "./exercise-bank-service.ts";

/**
 * Service responsible for initializing the offline diagnostic service
 * Versión expandida para cubrir todas las materias PAES
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
      MonitoringService.info("Servicio de asistente PAES ya estaba inicializado");
      return;
    }
    
    this.initialized = true;
    this.loadCoreExercises();
    MonitoringService.info("Servicio de asistente PAES inicializado con soporte completo para todas las materias");
  }
  
  /**
   * Carga un conjunto de ejercicios para múltiples materias PAES
   */
  private static loadCoreExercises(): void {
    // Comprensión Lectora - Mantener ejercicio existente
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
    
    // Matemáticas - Álgebra
    ExerciseBankService.addExercisesToBank(3, "ALGEBRA", [
      {
        id: "math-alg-1",
        question: "¿Cuál es la factorización de x² - 9?",
        options: ["(x+3)(x-3)", "(x+9)(x-1)", "(x-9)(x+1)", "(x-3)(x-3)"],
        correctAnswer: "(x+3)(x-3)",
        explanation: "La expresión x² - 9 es una diferencia de cuadrados que se factoriza como (x+3)(x-3)",
        difficulty: "INTERMEDIATE"
      }
    ]);
    
    // Ciencias - Física
    ExerciseBankService.addExercisesToBank(4, "PHYSICS", [
      {
        id: "sci-phy-1",
        question: "¿Qué fórmula representa la segunda ley de Newton?",
        options: ["F = ma", "E = mc²", "F = G(m₁m₂)/r²", "v = d/t"],
        correctAnswer: "F = ma",
        explanation: "La segunda ley de Newton establece que la fuerza neta aplicada sobre un cuerpo es proporcional a la aceleración que adquiere dicho cuerpo: Fuerza = masa × aceleración",
        difficulty: "BASIC"
      }
    ]);
    
    // Historia - Procesos históricos
    ExerciseBankService.addExercisesToBank(5, "HISTORY", [
      {
        id: "hist-ch-1",
        question: "¿En qué año se produjo la independencia de Chile?",
        options: ["1810", "1818", "1826", "1830"],
        correctAnswer: "1818",
        explanation: "Aunque el proceso se inició en 1810, la independencia de Chile se declaró formalmente el 12 de febrero de 1818 con la firma del Acta de Independencia",
        difficulty: "BASIC"
      }
    ]);
  }
}
