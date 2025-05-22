
/**
 * Module for handling fallback scenarios and error cases
 */
import { DEFAULT_CACHE_TTL } from "../../config.ts";
import { CacheService } from "../../services/cache-service.ts";
import { FallbackService, FallbackOperation } from "../../services/fallback-service.ts";
import { MonitoringService } from "../../services/monitoring-service.ts";
import { OfflineDiagnosticService } from "../../services/offline-diagnostic-service.ts";

/**
 * Genera una respuesta de fallback en caso de error durante la generación de diagnóstico
 */
export function generateFallbackResponse(
  error: string, 
  testId: number, 
  skills: string[] = []
): any {
  MonitoringService.warn(`Generando respuesta de fallback para diagnóstico: ${error}`);
  
  // Registrar el fallo para determinar si entramos en modo degradado
  const failureCount = FallbackService.recordFailure(FallbackOperation.GENERATE_DIAGNOSTIC);
  if (failureCount >= 3) {
    MonitoringService.warn(`Entrando en modo degradado para generación de diagnósticos después de ${failureCount} fallos`);
  }
  
  // Generar un diagnóstico offline si está disponible
  if (OfflineDiagnosticService.hasEnoughExercises(testId, skills[0], 1)) {
    const offlineDiagnostic = OfflineDiagnosticService.generateOfflineDiagnostic(testId, skills, 2);
    return {
      error: `Error al generar diagnóstico: ${error}`,
      result: offlineDiagnostic
    };
  }
  
  // Usar el servicio de fallback genérico en caso contrario
  const fallbackDiagnostic = FallbackService.generateFallback(
    FallbackOperation.GENERATE_DIAGNOSTIC,
    { testId, skills }
  );
  
  return { 
    error: `Error inesperado: ${error}`,
    result: fallbackDiagnostic
  };
}

/**
 * Gestiona el almacenamiento en caché de diagnósticos
 */
export async function cacheDiagnosticResult(
  cacheKey: string, 
  result: any
): Promise<void> {
  if (result && result.exercises && result.exercises.length > 0) {
    await CacheService.set(cacheKey, result, DEFAULT_CACHE_TTL, true);
    MonitoringService.info(`Diagnóstico guardado en caché con clave: ${cacheKey}`);
    
    // Resetear contador de fallos si la operación fue exitosa
    FallbackService.resetFailureCounter(FallbackOperation.GENERATE_DIAGNOSTIC);
  }
}
