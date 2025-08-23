
import { OfflineDiagnosticService } from "../../services/offline-diagnostic-service.ts";
import { MonitoringService } from "../../services/monitoring-service.ts";
import { CacheService } from "../../services/cache-service.ts";
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

/**
 * Genera una respuesta de respaldo cuando hay un error
 */
export const generateFallbackResponse = (errorMessage: string, testId: number, skills: string[]): any => {
  MonitoringService.error(`Generando respuesta de respaldo debido a error: ${errorMessage}`);
  
  return {
    result: createDiagnosticFallback(
      testId,
      `Diagnóstico para Test ${testId} (generado como respaldo)`,
      `Este diagnóstico fue generado automáticamente como respaldo debido a un error: ${errorMessage}`
    ),
    error: errorMessage
  };
};

/**
 * Almacena un diagnóstico en la caché
 */
export const cacheDiagnosticResult = async (key: string, data: any): Promise<void> => {
  try {
    // Guardamos el resultado en caché con persistencia
    const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas
    await CacheService.set(key, data, CACHE_TTL, true);
    MonitoringService.info(`Diagnóstico guardado en caché con clave: ${key}`);
  } catch (error) {
    MonitoringService.error(`Error al almacenar diagnóstico en caché: ${error.message}`);
  }
};
