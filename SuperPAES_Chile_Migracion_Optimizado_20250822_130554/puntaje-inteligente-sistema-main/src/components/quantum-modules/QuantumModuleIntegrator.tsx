/**
 * QUANTUM MODULE INTEGRATOR - ADAPTADOR DE INTEGRACION
 * Context7 + Sequential Thinking - Conecta modulos optimizados con dashboard principal
 * Arquitectura hibrida: Preserva funcionalidad original + optimizaciones nuevas
 */

import React, { useState, useCallback, useEffect, Suspense, lazy } from 'react';
import { useQuantumContext7Engine } from '../../hooks/useQuantumContext7Engine';
import { useContext7 } from '../../contexts/Context7ProviderSimple';
import '../../styles/animations/quantum-animations.css';
import styles from './QuantumModuleIntegrator.module.css';

// Lazy loading de modulos optimizados para performance
const QuantumDashboardCore = lazy(() => import('./QuantumDashboardCore'));
const QuantumGranColadorModuleOptimized = lazy(() => import('./QuantumGranColadorModuleOptimized'));

interface QuantumModuleIntegratorProps {
  // Props del dashboard original
  isVisible?: boolean;
  onToggle?: () => void;
  
  // Props de integracion
  useOptimizedModules?: boolean;
  enableAnimations?: boolean;
  performanceMode?: 'high' | 'medium' | 'low';
  
  // Props de configuracion
  maxNodes?: number;
  autoActivate?: boolean;
  integrateSequentialThinking?: boolean;
}

type ModuleType = 'dashboard' | 'granColador' | 'both' | 'none';

const QuantumModuleIntegrator: React.FC<QuantumModuleIntegratorProps> = ({
  isVisible = false,
  onToggle,
  useOptimizedModules = true,
  enableAnimations = true,
  performanceMode = 'high',
  maxNodes = 15,
  autoActivate = true,
  integrateSequentialThinking = true
}) => {
  const [activeModule, setActiveModule] = useState<ModuleType>('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [integrationError, setIntegrationError] = useState<string | null>(null);

  // Context7 + Sequential Thinking integration
  const sequentialContext = useContext7();
  const quantumEngine = useQuantumContext7Engine();

  // Estado de integracion
  const [integrationState, setIntegrationState] = useState({
    dashboardCoreLoaded: false,
    granColadorLoaded: false,
    animationsEnabled: enableAnimations,
    performanceOptimized: performanceMode === 'high'
  });

  // Manejador de cambio de modulo
  const handleModuleChange = useCallback(async (module: ModuleType) => {
    setIsLoading(true);
    setIntegrationError(null);

    try {
      // Simular carga de modulo (en produccion seria carga real)
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setActiveModule(module);
      
      // Actualizar estado de integracion
      setIntegrationState(prev => ({
        ...prev,
        dashboardCoreLoaded: module === 'dashboard' || module === 'both',
        granColadorLoaded: module === 'granColador' || module === 'both'
      }));

      console.log(`🔄 Modulo cambiado a: ${module}`);
      
    } catch (error) {
      console.error('❌ Error cambiando modulo:', error);
      setIntegrationError(`Error cargando modulo: ${module}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Manejador de seleccion de nodo del Gran Colador
  const handleNodeSelect = useCallback((nodeId: string) => {
    console.log(`📚 Nodo seleccionado desde integrador: ${nodeId}`);
    
    // Propagar evento al dashboard principal si es necesario
    if (sequentialContext && sequentialContext.sequentialState) {
      console.log(`🔗 Nodo propagado al Context7: ${nodeId}`);
      // En una implementacion real, aqui se actualizaria el estado secuencial
      // sequentialContext.sequentialState podria ser usado para lectura
    }
  }, [sequentialContext]);

  // Auto-carga inicial
  useEffect(() => {
    if (isVisible && useOptimizedModules) {
      handleModuleChange('dashboard');
    }
  }, [isVisible, useOptimizedModules, handleModuleChange]);

  // Optimizacion de performance basada en modo
  useEffect(() => {
    const optimizePerformance = () => {
      if (performanceMode === 'high') {
        // Habilitar aceleracion GPU
        document.documentElement.style.setProperty('--quantum-gpu-acceleration', 'translateZ(0)');
      } else if (performanceMode === 'low') {
        // Deshabilitar animaciones complejas
        document.documentElement.style.setProperty('--quantum-animation-duration', '0.1s');
      }
    };

    optimizePerformance();
  }, [performanceMode]);

  // Loading fallback component
  const LoadingFallback = () => (
    <div className={`${styles.loadingFallback} quantum-fade-in quantum-gpu-accelerated`}>
      <div className="quantum-spinner"></div>
      <p>🌌 Cargando modulo cuantico...</p>
    </div>
  );

  // Error boundary fallback
  const ErrorFallback = ({ error }: { error: string }) => (
    <div className={`${styles.errorFallback} quantum-fade-in`}>
      <h4>⚠️ Error de Integracion</h4>
      <p>{error}</p>
      <button 
        onClick={() => setIntegrationError(null)}
        className={`${styles.errorButton} quantum-button-hover quantum-transition`}
      >
        Reintentar
      </button>
    </div>
  );

  // Renderizado condicional basado en visibilidad
  if (!isVisible) return null;

  // Mostrar error si existe
  if (integrationError) {
    return <ErrorFallback error={integrationError} />;
  }

  return (
    <div className={`${styles.moduleIntegrator} ${enableAnimations ? 'quantum-fade-in' : ''}`}>
      {/* Control de modulos */}
      <div className={styles.moduleControls}>
        <button
          onClick={() => handleModuleChange('dashboard')}
          disabled={isLoading}
          className={`${styles.controlButton} ${activeModule === 'dashboard' ? styles.controlButtonActive : ''} quantum-transition`}
        >
          📊 Dashboard Core
        </button>

        <button
          onClick={() => handleModuleChange('granColador')}
          disabled={isLoading}
          className={`${styles.controlButton} ${activeModule === 'granColador' ? styles.controlButtonActive : ''} quantum-transition`}
        >
          🌌 Gran Colador
        </button>

        <button
          onClick={() => handleModuleChange('both')}
          disabled={isLoading}
          className={`${styles.controlButton} ${activeModule === 'both' ? styles.controlButtonActive : ''} quantum-transition`}
        >
          🚀 Ambos
        </button>
      </div>

      {/* Estado de integracion */}
      <div className={styles.integrationStatus}>
        <span>
          Dashboard: {integrationState.dashboardCoreLoaded ? '✅' : '⏳'}
        </span>
        <span>
          Gran Colador: {integrationState.granColadorLoaded ? '✅' : '⏳'}
        </span>
        <span>
          Animaciones: {integrationState.animationsEnabled ? '✅' : '❌'}
        </span>
        <span>
          Performance: {integrationState.performanceOptimized ? '🚀' : '⚡'}
        </span>
      </div>

      {/* Contenido de modulos con lazy loading */}
      <div className={styles.moduleContent}>
        {/* Dashboard Core */}
        {(activeModule === 'dashboard' || activeModule === 'both') && (
          <Suspense fallback={<LoadingFallback />}>
            <div className={enableAnimations ? 'quantum-slide-in quantum-delay-1' : ''}>
              <QuantumDashboardCore
                isVisible={true}
                onToggle={onToggle}
                autoActivate={autoActivate}
                integrateSequentialThinking={integrateSequentialThinking}
              />
            </div>
          </Suspense>
        )}

        {/* Gran Colador Optimizado */}
        {(activeModule === 'granColador' || activeModule === 'both') && (
          <Suspense fallback={<LoadingFallback />}>
            <div className={enableAnimations ? 'quantum-slide-in quantum-delay-2' : ''}>
              <QuantumGranColadorModuleOptimized
                isActive={true}
                onNodeSelect={handleNodeSelect}
                maxNodes={maxNodes}
              />
            </div>
          </Suspense>
        )}
      </div>

      {/* Informacion de integracion */}
      <div className={styles.integrationInfo}>
        <h5>🔗 Estado de Integracion Cuantica</h5>
        <p>
          <strong>Modulo Activo:</strong> {activeModule} | 
          <strong> Performance:</strong> {performanceMode} | 
          <strong> Context7:</strong> {sequentialContext ? 'Activo' : 'Inactivo'}
        </p>
        <p>
          <strong>Coherencia Total:</strong> {quantumEngine.metrics.totalCoherence.toFixed(1)}% | 
          <strong> Capas Procesadas:</strong> {quantumEngine.metrics.layersCompleted}/7
        </p>
      </div>
    </div>
  );
};

export default QuantumModuleIntegrator;