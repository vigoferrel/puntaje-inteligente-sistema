
import { MonitoringService } from "../monitoring-service.ts";

/**
 * Service responsible for handling diagnostic templates
 */
export class DiagnosticTemplateService {
  // Plantillas de diagnósticos por prueba
  private static diagnosticTemplates: Record<number, any> = {
    // Ejemplo para matemáticas (testId=2)
    2: {
      title: "Diagnóstico de Matemáticas",
      description: "Este diagnóstico evalúa tus habilidades matemáticas para la prueba PAES",
      exercisesTemplate: []
    },
    // Ejemplo para competencia lectora (testId=1)
    1: {
      title: "Diagnóstico de Competencia Lectora",
      description: "Este diagnóstico evalúa tu comprensión lectora para la prueba PAES",
      exercisesTemplate: []
    }
  };

  /**
   * Obtiene una plantilla de diagnóstico para un ID de prueba específico
   */
  static getTemplateForTest(testId: number): any {
    return this.diagnosticTemplates[testId] || {
      title: `Diagnóstico para Prueba ${testId}`,
      description: "Este diagnóstico evaluará tus habilidades para la prueba PAES",
      exercisesTemplate: []
    };
  }
}
