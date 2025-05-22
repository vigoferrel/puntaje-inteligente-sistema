
import { OfflineDiagnosticService } from "../../services/offline-diagnostic-service.ts";
import { MonitoringService } from "../../services/monitoring-service.ts";
import { createDiagnosticFallback } from "../../utils/fallback-generators.ts";

/**
 * Maneja la generación de diagnósticos de respaldo cuando la generación principal falla
 */
export const generateFallbackDiagnostic = (
  testId: number,
  skills: string[],
  exercisesPerSkill: number
): any => {
  try {
    // Primero intentamos usar el servicio offline que puede tener ejercicios precargados de calidad
    MonitoringService.info("Generando diagnóstico de respaldo desde OfflineDiagnosticService");
    return OfflineDiagnosticService.generateOfflineDiagnostic(testId, skills, exercisesPerSkill);
  } catch (error) {
    // Si el servicio offline falla, usamos el generador de respaldo más simple
    MonitoringService.error("Error en servicio offline, usando generador de respaldo básico: " + error.message);
    return createDiagnosticFallback(testId);
  }
};
