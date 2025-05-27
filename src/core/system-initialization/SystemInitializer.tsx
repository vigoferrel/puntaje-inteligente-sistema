
import React, { useEffect, useState } from 'react';
import { robustErrorCapture } from '../error-handling/RobustErrorCaptureSystem';
import { assetIntegrityChecker } from '../resource-validation/AssetIntegrityChecker';
import { systemValidator } from '../validation/SystemValidator';
import { OptimizedRLSService } from '@/services/database/optimized-rls-service';
import { queryPerformanceMonitor } from '@/services/performance/query-performance-monitor';

interface SystemInitializerProps {
  children: React.ReactNode;
}

export const SystemInitializer: React.FC<SystemInitializerProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);

  useEffect(() => {
    const initializeSystem = async () => {
      try {
        console.log('🚀 Inicializando sistema neurológico optimizado...');

        // Configurar contexto de errores
        robustErrorCapture.setContext({
          component: 'SystemInitializer',
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          optimizations: 'RLS_OPTIMIZED'
        });

        // Inicializar sistema RLS optimizado
        console.log('🔧 Inicializando sistema RLS optimizado...');
        OptimizedRLSService.initializeAuthListener();

        // Validar assets críticos con medición de performance
        const assetsValid = await queryPerformanceMonitor.measureQuery(
          'asset_validation',
          () => assetIntegrityChecker.validateCriticalAssets()
        );
        
        if (!assetsValid) {
          console.warn('⚠️ Algunos assets no están disponibles, pero continuando...');
        }

        // Ejecutar validación completa del sistema
        const validationReport = await queryPerformanceMonitor.measureQuery(
          'system_validation',
          () => systemValidator.runFullValidation()
        );
        
        console.log('📊 Reporte de validación:', {
          score: validationReport.score,
          overall: validationReport.overall,
          certification: validationReport.certification.level
        });

        // Obtener estadísticas de performance inicial
        const perfStats = queryPerformanceMonitor.getPerformanceStats();
        console.log('⚡ Performance inicial:', perfStats);

        // Forzar procesamiento de errores acumulados
        robustErrorCapture.forceFlush();

        setIsInitialized(true);
        console.log('✅ Sistema neurológico optimizado inicializado correctamente');

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error('❌ Error en inicialización del sistema:', errorMessage);
        
        robustErrorCapture.captureException(
          error instanceof Error ? error : new Error(errorMessage),
          { 
            phase: 'system_initialization',
            optimization_level: 'rls_optimized'
          }
        );
        
        setInitializationError(errorMessage);
        setIsInitialized(true); // Continuar incluso con errores
      }
    };

    initializeSystem();
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-lg">Inicializando sistema neurológico optimizado...</p>
          <p className="text-sm text-cyan-300 mt-2">Optimizando RLS y validando performance</p>
          <div className="mt-4 text-xs text-cyan-200">
            <div>🔧 Sistema RLS optimizado</div>
            <div>⚡ Cache de autenticación activo</div>
            <div>📊 Monitoreo de consultas habilitado</div>
          </div>
        </div>
      </div>
    );
  }

  if (initializationError) {
    console.warn('⚠️ Sistema inicializado con advertencias:', initializationError);
  }

  return <>{children}</>;
};
