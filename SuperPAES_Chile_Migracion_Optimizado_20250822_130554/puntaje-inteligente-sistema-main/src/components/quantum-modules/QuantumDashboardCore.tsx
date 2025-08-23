/**
 * QUANTUM DASHBOARD CORE - NUCLEO OPTIMIZADO
 * Context7 + Sequential Thinking - Modulo principal del dashboard
 * Extraido de QuantumContext7Dashboard (1334 lineas) -> Core optimizado (200 lineas)
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useQuantumContext7Engine } from '../../hooks/useQuantumContext7Engine';
import { useQuantumAutoActivation } from '../../hooks/useQuantumAutoActivation';
import { useContext7 } from '../../contexts/Context7ProviderSimple';
import styles from './QuantumDashboardCore.module.css';

interface QuantumDashboardCoreProps {
  isVisible?: boolean;
  onToggle?: () => void;
  autoActivate?: boolean;
  integrateSequentialThinking?: boolean;
}

type TabType = 'overview' | 'layers' | 'metrics' | 'operations';

const QuantumDashboardCore: React.FC<QuantumDashboardCoreProps> = ({
  isVisible = false,
  onToggle,
  autoActivate = true,
  integrateSequentialThinking = true
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // ðŸ§  PENSAMIENTO SECUENCIAL INTEGRADO
  const sequentialContext = useContext7();
  const useSequentialData = integrateSequentialThinking;
  
  // Hook de auto-activaciÃ³n cuÃ¡ntica
  const {
    state: autoState,
    startQuantumProcessing,
    resetQuantumSystem,
    isProcessing: isAutoProcessing
  } = useQuantumAutoActivation(autoActivate);
  
  const {
    // Estado principal del hook
    layers,
    currentLayer,
    isProcessing,
    progress,
    metrics,
    isFullyProcessed,
    systemEfficiency,
    systemHealth,
    
    // Datos procesados
    coherenceByCategory,
    activeEntanglements,
    queueOperations,
    recentOperations,
    
    // Acciones
    processLayer,
    processNextLayer,
    processAllLayers,
    resetSystem,
    getLayerInfo,
    getSystemRecommendations,
    
    // Utilidades
    canProcessNext,
    nextLayerName
  } = useQuantumContext7Engine();

  // Obtener clase CSS para el estado de salud
  const getHealthClass = useCallback((status: string): string => {
    switch (status) {
      case 'excellent': return styles.healthExcellent;
      case 'good': return styles.healthGood;
      case 'warning': return styles.healthWarning;
      case 'critical': return styles.healthCritical;
      default: return styles.healthUnknown;
    }
  }, []);

  // Manejadores de eventos optimizados
  const handleToggleExpanded = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const handleTabChange = // eslint-disable-next-line react-hooks/exhaustive-depsuseCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  const handleOptimizeCoherence = useCallback(async () => {
    try {
      await processAllLayers();
    } catch (error) {
      console.error('Error optimizando coherencia:', error);
    }
  }, [processAllLayers]);

  // Obtener mÃ©tricas combinadas OPTIMIZADAS
  const getCombinedMetrics = useCallback(() => {
    // ðŸ§  PRIORIDAD 1: Pensamiento Secuencial (Context7ProviderSimple)
    if (useSequentialData && sequentialContext && sequentialContext.context7State) {
      const steps = sequentialContext.sequentialState?.steps || [];
      const completedSteps = steps.filter((s: { status: string }) => s.status === 'completed').length;
      const processingSteps = steps.filter((s: { status: string }) => s.status === 'processing').length;
      
      // Calcular coherencia progresiva basada en pasos completados
      const progressiveCoherence = Math.min(95, 60 + (completedSteps * 5));
      const currentLayer = Math.min(7, Math.floor(completedSteps / 2) + 1);
      
      return {
        totalCoherence: progressiveCoherence,
        layersCompleted: currentLayer,
        entanglementCount: completedSteps + (processingSteps * 0.5),
        layersProcessing: processingSteps > 0 ? 1 : 0,
        layersRemaining: Math.max(0, 7 - currentLayer),
        operationsCompleted: completedSteps,
        queueLength: steps.filter((s: { status: string }) => s.status === 'pending').length,
        // ðŸŽ“ DATOS EDUCATIVOS PAES
        educationalEfficiency: Math.min(100, (completedSteps / Math.max(1, steps.length)) * 100),
        studyReadiness: completedSteps >= 3 ? 'Listo' : 'Preparando',
        learningVelocity: completedSteps > 0 ? Math.round(completedSteps * 12.5) : 0
      };
    }
    
    // ðŸš€ PRIORIDAD 2: Auto-activaciÃ³n
    if (autoState.isActive) {
      const completedLayers = autoState.layers.filter(l => l.status === 'completed').length;
      const processingLayers = autoState.layers.filter(l => l.status === 'processing').length;
      
      return {
        totalCoherence: Math.min(100, autoState.globalCoherence + (completedLayers * 2)),
        layersCompleted: completedLayers,
        entanglementCount: autoState.totalEntanglements + (completedLayers * 1.5),
        layersProcessing: processingLayers,
        layersRemaining: autoState.totalLayers - completedLayers,
        operationsCompleted: completedLayers,
        queueLength: autoState.layers.filter(l => l.status === 'pending').length,
        educationalEfficiency: Math.min(100, autoState.overallProgress),
        studyReadiness: autoState.systemStatus === 'transcendent' ? 'Excelente' : 'Bueno',
        learningVelocity: Math.round(autoState.overallProgress * 8.5)
      };
    }
    
    // ðŸ”§ PRIORIDAD 3: Motor bÃ¡sico
    return {
      ...metrics,
      educationalEfficiency: Math.min(100, metrics.totalCoherence * 0.9),
      studyReadiness: metrics.totalCoherence > 80 ? 'Bueno' : 'BÃ¡sico',
      learningVelocity: Math.round(metrics.totalCoherence * 7.5)
    };
  }, [autoState, metrics, sequentialContext, useSequentialData]);

  // Obtener estado del sistema combinado
  const getCombinedSystemStatus = useCallback(() => {
    if (autoState.isActive) {
      return {
        status: autoState.systemStatus === 'transcendent' ? 'excellent' :
                autoState.systemStatus === 'processing' ? 'good' :
                autoState.systemStatus === 'critical' ? 'critical' : 'warning',
        issues: autoState.systemStatus === 'critical' ? ['Sistema en estado crÃ­tico'] : []
      };
    }
    return systemHealth;
  }, [autoState, systemHealth]);

  // Variables combinadas para el renderizado
  const combinedMetrics = getCombinedMetrics();
  const combinedSystemHealth = getCombinedSystemStatus();
  const combinedProgress = autoState.isActive ? autoState.overallProgress : progress;
  const combinedIsProcessing = isAutoProcessing || isProcessing;

  // Renderizado condicional basado en visibilidad
  if (!isVisible) return null;

  // Vista compacta
  if (!isExpanded) {
    return (
      <div 
        className={styles.dashboardCompact}
        onClick={handleToggleExpanded}
      >
        <div className={styles.compactHeader}>
          <span>Context7 Core</span>
          <span className={styles.compactProgress}>
            {combinedMetrics.totalCoherence.toFixed(1)}%
          </span>
        </div>
        <div className={styles.compactMetrics}>
          <div>Capas: {combinedMetrics.layersCompleted}/7</div>
          <div>Estado: {combinedSystemHealth.status}</div>
        </div>
      </div>
    );
  }

  // Vista expandida - CORE OPTIMIZADO
  return (
    <div className={styles.dashboardExpanded}>
      {/* Header Optimizado */}
      <div className={styles.header}>
        <div className={styles.title}>
          <span>Quantum Dashboard Core</span>
          <button
            className={styles.closeButton}
            onClick={handleToggleExpanded}
            aria-label="Cerrar dashboard"
          >
            Ã—
          </button>
        </div>
        
        <div className={styles.statusBar}>
          <div className={`${styles.healthIndicator} ${getHealthClass(combinedSystemHealth.status)}`}>
            {combinedSystemHealth.status}
            {autoState.isActive && (
              <span className={styles.autoIndicator}> (Auto)</span>
            )}
          </div>
          
          <div className={styles.progressBar}>
            <div
              className={styles.progressFillDynamic}
              data-progress={combinedProgress}
            />
            <div className={styles.progressText}>
              {combinedProgress.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabNavigation}>
        {(['overview', 'layers', 'metrics', 'operations'] as TabType[]).map(tab => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Placeholder - Los mÃ³dulos especÃ­ficos se cargarÃ¡n aquÃ­ */}
      <div className={styles.content}>
        <div className={styles.moduleContainer}>
          <p>ðŸŒŒ NÃºcleo CuÃ¡ntico Optimizado - Cargando mÃ³dulos especializados...</p>
          <p>ðŸ“Š Coherencia: {combinedMetrics.totalCoherence.toFixed(1)}%</p>
          <p>ðŸŽ“ Eficiencia Educativa: {combinedMetrics.educationalEfficiency?.toFixed(1)}%</p>
          <p>âš¡ Velocidad de Aprendizaje: {combinedMetrics.learningVelocity} pts/h</p>
        </div>
      </div>
    </div>
  );
};

export default QuantumDashboardCore;
