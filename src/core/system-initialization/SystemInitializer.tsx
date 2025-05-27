
import React, { useEffect, useState } from 'react';
import { robustErrorCapture } from '../error-handling/RobustErrorCaptureSystem';
import { assetIntegrityChecker } from '../resource-validation/AssetIntegrityChecker';
import { systemValidator } from '../validation/SystemValidator';

interface SystemInitializerProps {
  children: React.ReactNode;
}

export const SystemInitializer: React.FC<SystemInitializerProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);

  useEffect(() => {
    const initializeSystem = async () => {
      try {
        console.log('🚀 Inicializando sistema neurológico...');

        // Configurar contexto de errores
        robustErrorCapture.setContext({
          component: 'SystemInitializer',
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        });

        // Validar assets críticos
        const assetsValid = await assetIntegrityChecker.validateCriticalAssets();
        if (!assetsValid) {
          console.warn('⚠️ Algunos assets no están disponibles, pero continuando...');
        }

        // Ejecutar validación completa del sistema
        const validationReport = await systemValidator.runFullValidation();
        console.log('📊 Reporte de validación:', {
          score: validationReport.score,
          overall: validationReport.overall,
          certification: validationReport.certification.level
        });

        // Forzar procesamiento de errores acumulados
        robustErrorCapture.forceFlush();

        setIsInitialized(true);
        console.log('✅ Sistema neurológico inicializado correctamente');

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error('❌ Error en inicialización del sistema:', errorMessage);
        
        robustErrorCapture.captureException(
          error instanceof Error ? error : new Error(errorMessage),
          { phase: 'system_initialization' }
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
          <p className="text-lg">Inicializando sistema neurológico...</p>
          <p className="text-sm text-cyan-300 mt-2">Validando integridad del sistema</p>
        </div>
      </div>
    );
  }

  if (initializationError) {
    console.warn('⚠️ Sistema inicializado con advertencias:', initializationError);
  }

  return <>{children}</>;
};
