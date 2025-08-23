/* eslint-disable react-refresh/only-export-components */
/**
 * ðŸŒŒ SuperPAESQuantumCommandCenter - Context7 + Pensamiento Secuencial
 * Centro de Comando HologrÃ¡fico Educativo Unificado
 * FilosofÃ­a Miguel Ãngel: Pulcritud absoluta, funcionalidad esencial
 * IntegraciÃ³n completa: Mobile + Performance + Spotify-3D + Arsenal Educativo
 */

import React, { useState, useEffect, useCallback } from 'react';
import { CleanQuantumBridge } from './CleanQuantumBridge';
import { useCleanQuantumIntegration } from '../../hooks/useCleanQuantumIntegration';
import { useCleanMobileOptimization } from '../../services/quantum/CleanMobileOptimizationService';
import { useAuth } from '../../hooks/useAuth';

// Importar el tipo exacto del hook
type ArsenalActions = ReturnType<typeof useCleanQuantumIntegration>['actions'];

// ðŸŽ¯ Context7 - MÃ©tricas para el sistema cuÃ¡ntico padre
interface QuantumMetricsCallback {
  efficiency: number;    // NÃºcleo CuÃ¡ntico
  engagement: number;    // Cerebro Visual
  coherence: number;     // CirculaciÃ³n Total
  addiction: number;     // AdicciÃ³n Educativa
}

// ðŸŽ¯ Context7 - Estado del centro de comando
interface CommandCenterState {
  mode: 'unified' | 'spotify' | 'cerebro' | 'bloom' | 'mobile';
  isOptimized: boolean;
  performanceLevel: 'optimal' | 'good' | 'warning' | 'critical';
  activeComponents: string[];
  userEngagement: number;
}

// ðŸ“Š Context7 - MÃ©tricas del centro de comando
interface CommandCenterMetrics {
  totalSystems: number;
  activeSystems: number;
  performanceScore: number;
  mobileOptimization: number;
  userSatisfaction: number;
  systemHealth: 'excellent' | 'good' | 'fair' | 'poor';
}

// ðŸŽ® Interfaces para tipos especÃ­ficos
interface MobileMetricsData {
  metrics?: {
    fps: number;
    memoryUsage: number;
    thermalState: string;
  } | undefined;
  isOptimal: boolean;
}

interface ArsenalStateData {
  spotify: {
    isActive: boolean;
    progress: number;
  };
  cerebro: {
    isActive: boolean;
    visualState: string;
  };
  bloom: {
    isActive: boolean;
    currentLevel: string;
  };
  quantum: {
    guideActive: boolean;
    tourInProgress: boolean;
  };
}


// ðŸŽ® Componente de indicadores de performance
const PerformanceIndicators: React.FC<{
  metrics: CommandCenterMetrics;
  mobileMetrics: MobileMetricsData;
}> = ({ metrics, mobileMetrics }) => (
  <div className="performance-indicators">
    <div className="indicator-grid">
      <div className={`indicator ${metrics.systemHealth}`}>
        <span className="label">Sistema</span>
        <span className="value">{metrics.performanceScore}%</span>
      </div>
      
      <div className={`indicator ${mobileMetrics?.isOptimal ? 'excellent' : 'fair'}`}>
        <span className="label">Mobile</span>
        <span className="value">{mobileMetrics?.metrics?.fps || 60} FPS</span>
      </div>
      
      <div className="indicator excellent">
        <span className="label">Activos</span>
        <span className="value">{metrics.activeSystems}/{metrics.totalSystems}</span>
      </div>
      
      <div className={`indicator ${metrics.userSatisfaction > 80 ? 'excellent' : 'good'}`}>
        <span className="label">Engagement</span>
        <span className="value">{Math.round(metrics.userSatisfaction)}%</span>
      </div>
    </div>
  </div>
);

// ðŸŽ›ï¸ Panel de control del arsenal educativo
const ArsenalControlPanel: React.FC<{
  arsenalState: ArsenalStateData;
  actions: ArsenalActions;
  currentMode: string;
  onModeChange: (mode: string) => void;
}> = ({ arsenalState, actions, currentMode, onModeChange }) => (
  <div className="arsenal-control-panel">
    <h3>ðŸŽ¯ Arsenal Educativo</h3>
    
    <div className="mode-selector">
      {[
        { id: 'unified', label: 'ðŸŒŒ Unificado', icon: 'ðŸŒŒ' },
        { id: 'spotify', label: 'ðŸŽµ Spotify Neural', icon: 'ðŸŽµ' },
        { id: 'cerebro', label: 'ðŸ§  Cerebro Visual', icon: 'ðŸ§ ' },
        { id: 'bloom', label: 'ðŸŒ¸ Bloom Taxonomy', icon: 'ðŸŒ¸' }
      ].map(mode => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          className={`mode-button ${currentMode === mode.id ? 'active' : ''}`}
        >
          <span className="mode-icon">{mode.icon}</span>
          <span className="mode-label">{mode.label}</span>
        </button>
      ))}
    </div>
    
    <div className="arsenal-status">
      <div className={`status-item ${arsenalState.spotify.isActive ? 'active' : 'inactive'}`}>
        <span>ðŸŽµ Spotify Neural</span>
        <span className="progress">{arsenalState.spotify.progress}%</span>
      </div>
      
      <div className={`status-item ${arsenalState.cerebro.isActive ? 'active' : 'inactive'}`}>
        <span>ðŸ§  Cerebro Visual</span>
        <span className="level">{arsenalState.cerebro.visualState}</span>
      </div>
      
      <div className={`status-item ${arsenalState.bloom.isActive ? 'active' : 'inactive'}`}>
        <span>ðŸŒ¸ Bloom Taxonomy</span>
        <span className="level">{arsenalState.bloom.currentLevel}</span>
      </div>
      
      <div className={`status-item ${arsenalState.quantum.guideActive ? 'active' : 'inactive'}`}>
        <span>ðŸ¤– Quantum Guide</span>
        <span className="status">{arsenalState.quantum.tourInProgress ? 'Tour' : 'Standby'}</span>
      </div>
    </div>
    
    <div className="quick-actions">
      <button onClick={actions.optimizePerformance} className="action-button optimize">
        âš¡ Optimizar
      </button>
      <button onClick={() => actions.startQuantumGuide()} className="action-button guide">
        ðŸ¤– Ayuda
      </button>
      <button onClick={actions.resetArsenal} className="action-button reset">
        ðŸ”„ Reset
      </button>
    </div>
  </div>
);

// ðŸŒŒ Componente principal del Centro de Comando
export const SuperPAESQuantumCommandCenter: React.FC<{
  onMetricsUpdate?: (metrics: QuantumMetricsCallback) => void;
}> = ({ onMetricsUpdate }) => {
  const { user } = useAuth();
  const userId = user?.id || 'userId';
  
  // ðŸŽ¯ IntegraciÃ³n del arsenal educativo
  const {
    arsenalState,
    integrationMetrics,
    spotifyData,
    actions,
    isLoading,
    isOptimal,
    needsHelp
  } = useCleanQuantumIntegration(userId);
  
  // ðŸ“± OptimizaciÃ³n mobile
  const {
    quality: mobileQuality,
    metrics: mobileMetrics,
    device: mobileDevice,
    isOptimal: mobileOptimal
  } = useCleanMobileOptimization();
  
  // ðŸŽ® Estado del centro de comando
  const [commandState, setCommandState] = useState<CommandCenterState>({
    mode: 'unified',
    isOptimized: true,
    performanceLevel: 'optimal',
    activeComponents: ['spotify', 'quantum'],
    userEngagement: 0
  });

  // ðŸ“Š MÃ©tricas del centro de comando
  const commandMetrics: CommandCenterMetrics = React.useMemo(() => {
    const performanceScore = Math.min(100, 
      (integrationMetrics.performanceScore * 0.6) + 
      ((mobileMetrics?.fps || 60) / 60 * 100 * 0.4)
    );
    
    const mobileScore = mobileOptimal ? 100 : (mobileMetrics?.fps || 30) / 60 * 100;
    const userSatisfaction = integrationMetrics.userEngagement;
    
    let systemHealth: CommandCenterMetrics['systemHealth'] = 'excellent';
    if (performanceScore < 60) systemHealth = 'poor';
    else if (performanceScore < 75) systemHealth = 'fair';
    else if (performanceScore < 90) systemHealth = 'good';
    
    return {
      totalSystems: 4,
      activeSystems: integrationMetrics.activeComponents,
      performanceScore,
      mobileOptimization: mobileScore,
      userSatisfaction,
      systemHealth
    };
  }, [integrationMetrics, mobileMetrics, mobileOptimal]);

  // ðŸŽ® Cambio de modo del centro de comando
  const handleModeChange = useCallback((mode: string) => {
    setCommandState(prev => ({ ...prev, mode: mode as CommandCenterState['mode'] }));
    
    // Activar componentes segÃºn el modo
    switch (mode) {
      case 'spotify':
        actions.activateSpotify();
        break;
      case 'cerebro':
        actions.activateCerebro(mobileDevice?.type === 'mobile' ? 'minimal' : 'simple');
        break;
      case 'bloom':
        actions.activateBloom();
        break;
      case 'unified':
        actions.activateSpotify();
        actions.activateCerebro('simple');
        actions.activateBloom();
        break;
    }
  }, [actions, mobileDevice]);

  // ðŸ¤– Auto-activaciÃ³n de ayuda si es necesaria
  useEffect(() => {
    if (needsHelp && !arsenalState.quantum.tourInProgress) {
      actions.startQuantumGuide('quick-help');
    }
  }, [needsHelp, arsenalState.quantum.tourInProgress, actions]);

  // ðŸ“± Auto-optimizaciÃ³n para mobile
  useEffect(() => {
    if (mobileDevice?.type === 'mobile' && !mobileOptimal) {
      actions.optimizePerformance();
    }
  }, [mobileDevice, mobileOptimal, actions]);

  // ðŸ“Š Enviar mÃ©tricas al sistema cuÃ¡ntico padre (Context7 - ConexiÃ³n QuirÃºrgica)
  useEffect(() => {
    if (onMetricsUpdate) {
      const quantumMetrics: QuantumMetricsCallback = {
        efficiency: Math.round(integrationMetrics.performanceScore),
        engagement: Math.round(integrationMetrics.userEngagement),
        coherence: Math.round(
          (mobileOptimal ? 100 : 50) * 0.6 +
          (integrationMetrics.activeComponents / 4 * 100) * 0.4
        ),
        addiction: Math.round(
          arsenalState.spotify.progress * 0.4 +
          arsenalState.bloom.taxonomyProgress * 0.3 +
          arsenalState.cerebro.processingLevel * 0.3
        )
      };
      
      onMetricsUpdate(quantumMetrics);
    }
  }, [
    onMetricsUpdate,
    integrationMetrics,
    mobileOptimal,
    arsenalState
  ]);

  // ðŸŽ¯ Renderizado adaptativo segÃºn dispositivo
  const renderContent = () => {
    if (mobileDevice?.type === 'mobile') {
      return (
        <div className="mobile-command-center">
          <div className="mobile-header">
            <h2>ðŸŒŒ SuperPAES Command</h2>
            <PerformanceIndicators metrics={commandMetrics} mobileMetrics={{ metrics: mobileMetrics || undefined, isOptimal: mobileOptimal }} />
          </div>
          
          <div className="mobile-content">
            <CleanQuantumBridge />
          </div>
          
          <div className="mobile-controls">
            <ArsenalControlPanel
              arsenalState={arsenalState}
              actions={actions}
              currentMode={commandState.mode}
              onModeChange={handleModeChange}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="desktop-command-center">
        <div className="command-header">
          <h1>ðŸŒŒ SuperPAES Quantum Command Center</h1>
          <PerformanceIndicators metrics={commandMetrics} mobileMetrics={{ metrics: mobileMetrics || undefined, isOptimal: mobileOptimal }} />
        </div>
        
        <div className="command-body">
          <div className="main-display">
            <CleanQuantumBridge />
          </div>
          
          <div className="control-sidebar">
            <ArsenalControlPanel
              arsenalState={arsenalState}
              actions={actions}
              currentMode={commandState.mode}
              onModeChange={handleModeChange}
            />
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="loading-command-center">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2>ðŸŒŒ Inicializando SuperPAES Quantum</h2>
          <p>Preparando arsenal educativo hologrÃ¡fico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="superpaes-quantum-command-center">
      {renderContent()}
      
      <style>{`
        .superpaes-quantum-command-center {
          width: 100%;
          height: 100vh;
          color: white;
          font-family: 'Inter', sans-serif;
          overflow: hidden;
        }
        
        .loading-command-center {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
        }
        
        .loading-content {
          text-align: center;
          color: white;
        }
        
        .loading-spinner {
          width: 60px;
          height: 60px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top: 3px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .desktop-command-center {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .command-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .command-body {
          flex: 1;
          display: flex;
        }
        
        .main-display {
          flex: 1;
        }
        
        .control-sidebar {
          width: 350px;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(15px);
          border-left: 1px solid rgba(255, 255, 255, 0.1);
          padding: 20px;
          overflow-y: auto;
        }
        
        .mobile-command-center {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .mobile-header {
          padding: 15px;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .mobile-content {
          flex: 1;
        }
        
        .mobile-controls {
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(15px);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 15px;
          max-height: 40vh;
          overflow-y: auto;
        }
        
        .performance-indicators {
          display: flex;
          align-items: center;
        }
        
        .indicator-grid {
          display: flex;
          gap: 15px;
        }
        
        .indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px 12px;
          border-radius: 8px;
          min-width: 70px;
          font-size: 12px;
        }
        
        .indicator.excellent {
          background: rgba(34, 197, 94, 0.2);
          border: 1px solid rgba(34, 197, 94, 0.3);
        }
        
        .indicator.good {
          background: rgba(59, 130, 246, 0.2);
          border: 1px solid rgba(59, 130, 246, 0.3);
        }
        
        .indicator.fair {
          background: rgba(245, 158, 11, 0.2);
          border: 1px solid rgba(245, 158, 11, 0.3);
        }
        
        .indicator.poor {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.3);
        }
        
        .indicator .label {
          opacity: 0.7;
          font-size: 10px;
        }
        
        .indicator .value {
          font-weight: bold;
          font-size: 14px;
        }
        
        .arsenal-control-panel h3 {
          margin-bottom: 20px;
          color: #667eea;
        }
        
        .mode-selector {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .mode-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .mode-button:hover {
          background: rgba(255, 255, 255, 0.15);
        }
        
        .mode-button.active {
          background: rgba(102, 126, 234, 0.3);
          border-color: #667eea;
        }
        
        .mode-icon {
          font-size: 20px;
          margin-bottom: 4px;
        }
        
        .mode-label {
          font-size: 11px;
          text-align: center;
        }
        
        .arsenal-status {
          margin-bottom: 20px;
        }
        
        .status-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          margin-bottom: 8px;
          border-radius: 6px;
          font-size: 12px;
        }
        
        .status-item.active {
          background: rgba(34, 197, 94, 0.2);
          border: 1px solid rgba(34, 197, 94, 0.3);
        }
        
        .status-item.inactive {
          background: rgba(107, 114, 128, 0.2);
          border: 1px solid rgba(107, 114, 128, 0.3);
        }
        
        .quick-actions {
          display: flex;
          gap: 8px;
        }
        
        .action-button {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 6px;
          color: white;
          cursor: pointer;
          font-size: 11px;
          transition: all 0.2s ease;
        }
        
        .action-button.optimize {
          background: linear-gradient(45deg, #f59e0b, #d97706);
        }
        
        .action-button.guide {
          background: linear-gradient(45deg, #8b5cf6, #7c3aed);
        }
        
        .action-button.reset {
          background: linear-gradient(45deg, #6b7280, #4b5563);
        }
        
        .action-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        @media (max-width: 768px) {
          .indicator-grid {
            gap: 8px;
          }
          
          .indicator {
            min-width: 60px;
            padding: 6px 8px;
          }
          
          .mode-selector {
            grid-template-columns: 1fr;
          }
          
          .quick-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default SuperPAESQuantumCommandCenter;
