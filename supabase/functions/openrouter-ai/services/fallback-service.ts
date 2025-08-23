
import { createDiagnosticFallback } from "../utils/fallback-generators.ts";
import { MonitoringService } from "./monitoring-service.ts";

/**
 * Tipos de operaciones que pueden requerir fallback
 */
export enum FallbackOperation {
  GENERATE_EXERCISE = "generate_exercise",
  GENERATE_DIAGNOSTIC = "generate_diagnostic",
  ANALYZE_PERFORMANCE = "analyze_performance",
  PROVIDE_FEEDBACK = "provide_feedback"
}

/**
 * Servicio para manejar fallbacks cuando los servicios externos no están disponibles
 */
export class FallbackService {
  /**
   * Detecta si el error es un caso donde debemos usar fallback
   */
  static shouldUseFallback(error: any): boolean {
    // Identificar errores específicos que indican que debemos usar fallback
    const errorMessage = error?.message?.toLowerCase() || "";
    
    return (
      errorMessage.includes("límite de tasa") ||
      errorMessage.includes("rate limit") ||
      errorMessage.includes("timeout") ||
      errorMessage.includes("insufficient credits") ||
      errorMessage.includes("todos los modelos fallaron")
    );
  }
  
  /**
   * Genera una respuesta de fallback basada en el tipo de operación
   */
  static generateFallback(operation: FallbackOperation, params: any): any {
    MonitoringService.warn(`Generando respuesta de fallback para operación: ${operation}`, params);
    
    switch (operation) {
      case FallbackOperation.GENERATE_DIAGNOSTIC:
        return this.generateDiagnosticFallback(params);
      
      case FallbackOperation.GENERATE_EXERCISE:
        return this.generateExerciseFallback(params);
      
      case FallbackOperation.ANALYZE_PERFORMANCE:
        return {
          analysis: "No se pudo generar un análisis en este momento. Por favor, intente nuevamente más tarde.",
          recommendations: ["Revisar los conceptos básicos", "Practicar con más ejercicios", "Consultar material complementario"]
        };
      
      case FallbackOperation.PROVIDE_FEEDBACK:
        return {
          feedback: "El servicio de retroalimentación no está disponible en este momento. Por favor, intente nuevamente más tarde.",
          areas_to_improve: ["No se pudieron identificar áreas específicas"],
          strengths: ["No se pudieron identificar fortalezas específicas"]
        };
      
      default:
        return {
          message: "Servicio temporalmente no disponible. Por favor, intente nuevamente más tarde."
        };
    }
  }
  
  /**
   * Genera un diagnóstico de fallback
   */
  private static generateDiagnosticFallback(params: any): any {
    const { testId, title, description } = params;
    return createDiagnosticFallback(testId, title, description);
  }
  
  /**
   * Genera un ejercicio de fallback
   */
  private static generateExerciseFallback(params: any): any {
    const { skillId, testId, difficulty = "INTERMEDIATE" } = params;
    
    return {
      id: `fallback-${Date.now()}`,
      question: "Esta es una pregunta de ejemplo generada cuando el servicio principal no está disponible.",
      options: [
        "Primera opción (correcta)",
        "Segunda opción",
        "Tercera opción",
        "Cuarta opción"
      ],
      correctAnswer: "Primera opción (correcta)",
      explanation: "Esta es una explicación de ejemplo. El servicio de generación no está disponible temporalmente.",
      skill: skillId || 1,
      difficulty: difficulty
    };
  }
  
  /**
   * Mantiene un contador de fallos para determinar si debemos entrar en modo degradado
   */
  private static failureCounter: Record<string, number> = {};
  private static readonly FAILURE_THRESHOLD = 5;
  
  /**
   * Registra un fallo para una operación específica
   */
  static recordFailure(operation: string): number {
    this.failureCounter[operation] = (this.failureCounter[operation] || 0) + 1;
    return this.failureCounter[operation];
  }
  
  /**
   * Verifica si debemos entrar en modo degradado para una operación
   */
  static shouldEnterDegradedMode(operation: string): boolean {
    return (this.failureCounter[operation] || 0) >= this.FAILURE_THRESHOLD;
  }
  
  /**
   * Reinicia el contador de fallos para una operación
   */
  static resetFailureCounter(operation: string): void {
    this.failureCounter[operation] = 0;
  }
}
