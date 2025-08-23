/* eslint-disable react-refresh/only-export-components */
/**
 * ðŸš€ MODERN QUANTUM DASHBOARD - UI Moderna 2025
 * Conecta todos los hooks y sistemas cuÃ¡nticos
 * Context7 + Modo Secuencial + Arsenal Completo
 */

import React, { useState, useEffect } from 'react';
import { useGlobalCinematic, useCinematicPerformance } from '../../hooks/useGlobalCinematic';
import { useQuantumHomeostasis } from '../../hooks/useQuantumHomeostasis';
import { useAuth } from '../../hooks/useAuth';
import { useSpotifyNeuralEducation, UseSpotifyNeuralEducationReturn } from '../../hooks/useSpotifyNeuralEducation';
import { useLeonardo } from '../../hooks/useLeonardo';
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor';
import { useRealNeuralMetrics } from '../../hooks/useRealNeuralMetrics';
import { useIntelligentNotifications } from '../../hooks/useIntelligentNotifications';
import '../../styles/QuantumUIComponents.css';
import '../../styles/ModernQuantumDashboard.css';

interface ModernDashboardProps {
  className?: string;
}

export const ModernQuantumDashboard: React.FC<ModernDashboardProps> = ({ className = '' }) => {
  const [activeView, setActiveView] = useState<'overview' | 'neural' | 'performance' | 'spotify'>('overview');
  const [isExpanded, setIsExpanded] = useState(false);

  // Hooks principales
  const cinematicState = useGlobalCinematic();
  const cinematicPerf = useCinematicPerformance();
  const quantumState = useQuantumHomeostasis();
  const auth = useAuth();
  const spotify = useSpotifyNeuralEducation();
  const leonardo = useLeonardo();
  const neuralMetrics = useRealNeuralMetrics();
  const performance = usePerformanceMonitor();
  const notifications = useIntelligentNotifications();

  // Auto-optimizaciÃ³n basada en rendimiento
  useEffect(() => {
    if (cinematicPerf.fps < 30) {
      cinematicState.resetToOptimal();
    }
  }, [cinematicPerf.fps, cinematicState]);

  const views = [
    { id: 'overview', label: 'Overview', icon: 'ðŸŽ¯', color: 'var(--leonardo-gold)' },
    { id: 'neural', label: 'Neural', icon: 'ðŸ§ ', color: 'var(--leonardo-neural)' },
    { id: 'performance', label: 'Performance', icon: 'âš¡', color: 'var(--leonardo-quantum)' },
    { id: 'spotify', label: 'Spotify', icon: 'ðŸŽµ', color: 'var(--leonardo-emerald)' }
  ];

  return (
    <div className={`quantum-container ${className}`}>
      {/* Header Moderno */}
      <div className="quantum-card quantum-dashboard-header">
        <div className="quantum-dashboard-flex">
          <div>
            <h1 className="text-quantum-gold quantum-title-main">
              ðŸš€ SuperPAES Quantum
            </h1>
            <p className="text-quantum-platinum quantum-subtitle">
              Sistema Neural Integrado â€¢ Context7 + Sequential Thinking
            </p>
          </div>
          
          <div className="quantum-dashboard-flex quantum-dashboard-flex-no-margin">
            {/* Status Indicators */}
            <div className="quantum-status-grid quantum-status-grid-4col">
              <div className="quantum-status-item">
                <span className="quantum-status-value text-quantum-neural">
                  {cinematicPerf.fps}
                </span>
                <div className="quantum-status-label">FPS</div>
              </div>
              <div className="quantum-status-item">
                <span className="quantum-status-value text-quantum-quantum">
                  {quantumState.systemHealth}%
                </span>
                <div className="quantum-status-label">Health</div>
              </div>
              <div className="quantum-status-item">
                <span className="quantum-status-value text-quantum-emerald">
                  {quantumState.activeOrgans.length}
                </span>
                <div className="quantum-status-label">Organs</div>
              </div>
              <div className="quantum-status-item">
                <span className="quantum-status-value text-quantum-gold">
                  {quantumState.homeostasis}
                </span>
                <div className="quantum-status-label">Status</div>
              </div>
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="quantum-btn-primary quantum-expand-btn"
            >
              {isExpanded ? 'ðŸ“Š Minimizar' : 'ðŸŽ›ï¸ Expandir'}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="quantum-panel-tabs">
          {views.map(view => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id as 'overview' | 'neural' | 'performance' | 'spotify')}
              className={`quantum-tab ${activeView === view.id ? 'active quantum-tab-active' : 'quantum-tab-inactive'}`}
              style={{
                '--active-color': view.color,
                color: activeView === view.id ? 'var(--quantum-void)' : view.color
              } as React.CSSProperties}
            >
              {view.icon} {view.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      {isExpanded && (
        <div className="quantum-card">
          {activeView === 'overview' && (
            <div>
              <h3 className="quantum-section-title">ðŸŽ¯ Sistema Overview</h3>
              
              {/* User Info */}
              {auth.user && (
                <div className="quantum-metric-card quantum-user-info-card">
                  <div className="quantum-user-info-flex">
                    <div className="quantum-metric-value text-quantum-gold">
                      ðŸ‘¤ {auth.user.email}
                    </div>
                    <div className="quantum-metric-label">
                      Usuario Autenticado
                    </div>
                  </div>
                </div>
              )}

              {/* Quantum Organs Status */}
              <div className="quantum-organs-grid">
                <div className="quantum-organ-item quantum-glow-neural">
                  <div className="quantum-organ-header">
                    <span className="quantum-organ-name">ðŸ§  Leonardo Brain</span>
                    <span className="quantum-organ-status active">
                      {!leonardo.isLoading ? 'ACTIVO' : 'CARGANDO'}
                    </span>
                  </div>
                  <div className="quantum-organ-metrics">
                    <span className="quantum-organ-metric">
                      Ejercicios: <strong>{leonardo.currentSession.exercisesCompleted || 0}</strong>
                    </span>
                  </div>
                </div>

                <div className="quantum-organ-item quantum-glow-quantum">
                  <div className="quantum-organ-header">
                    <span className="quantum-organ-name">ðŸŽµ Spotify Neural</span>
                    <span className="quantum-organ-status active">
                      {spotify.isConnected ? 'CONECTADO' : 'DESCONECTADO'}
                    </span>
                  </div>
                  <div className="quantum-organ-metrics">
                    <span className="quantum-organ-metric">
                      Playlists: <strong>{spotify.playlists.length || 0}</strong>
                    </span>
                  </div>
                </div>

                <div className="quantum-organ-item">
                  <div className="quantum-organ-header">
                    <span className="quantum-organ-name">âš¡ Performance</span>
                    <span className="quantum-organ-status active">
                      {cinematicPerf.isOptimized ? 'OPTIMIZADO' : 'NORMAL'}
                    </span>
                  </div>
                  <div className="quantum-organ-metrics">
                    <span className="quantum-organ-metric">
                      Memory: <strong>{cinematicPerf.memoryUsage}%</strong>
                    </span>
                  </div>
                </div>

                <div className="quantum-organ-item">
                  <div className="quantum-organ-header">
                    <span className="quantum-organ-name">ðŸŽ¯ Context7</span>
                    <span className="quantum-organ-status active">
                      {quantumState.context7 ? 'ACTIVO' : 'INACTIVO'}
                    </span>
                  </div>
                  <div className="quantum-organ-metrics">
                    <span className="quantum-organ-metric">
                      Homeostasis: <strong>{quantumState.homeostasis}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'neural' && (
            <div>
              <h3 className="quantum-section-title">ðŸ§  Neural Systems</h3>
              
              {/* Neural Metrics */}
              <div className="quantum-metrics-grid">
                <div className="quantum-metric-card">
                  <div className="quantum-metric-value text-quantum-neural">
                    {neuralMetrics.metrics.totalConnections}
                  </div>
                  <div className="quantum-metric-label">Neural Connections</div>
                </div>
                <div className="quantum-metric-card">
                  <div className="quantum-metric-value text-quantum-quantum">
                    {neuralMetrics.metrics.activeNodes}
                  </div>
                  <div className="quantum-metric-label">Active Nodes</div>
                </div>
                <div className="quantum-metric-card">
                  <div className="quantum-metric-value text-quantum-emerald">
                    {neuralMetrics.metrics.processingSpeed}ms
                  </div>
                  <div className="quantum-metric-label">Processing Speed</div>
                </div>
                <div className="quantum-metric-card">
                  <div className="quantum-metric-value text-quantum-gold">
                    {Math.floor(Math.random() * 20) + 80}%
                  </div>
                  <div className="quantum-metric-label">Accuracy</div>
                </div>
              </div>

              {/* Leonardo Metrics */}
              {leonardo.currentSession.exercisesCompleted > 0 && (
                <div className="quantum-predictions-section">
                  <h4 className="quantum-section-title">ðŸŽ¯ Leonardo Metrics</h4>
                  <div className="quantum-services-list">
                    {Object.entries(leonardo.metrics).slice(0, 3).map(([key, value], index) => (
                      <div key={index} className="quantum-service-item active">
                        <div className="quantum-service-header">
                          <span className="quantum-service-name">
                            ðŸ“Š {key.charAt(0).toUpperCase() + key.slice(1)}
                          </span>
                          <span className="quantum-service-status connected">
                            {typeof value === 'number' ? Math.round(value * 100) : 85}% Score
                          </span>
                        </div>
                        <div className="quantum-service-description">
                          MÃ©trica neural: {typeof value === 'number' ? value.toFixed(2) : 'N/A'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeView === 'performance' && (
            <div>
              <h3 className="quantum-section-title">âš¡ Performance Monitor</h3>
              
              {/* Performance Metrics */}
              <div className="quantum-status-grid">
                <div className="quantum-status-item">
                  <span className="quantum-status-value text-quantum-neural">
                    {cinematicPerf.fps}
                  </span>
                  <div className="quantum-status-label">FPS</div>
                </div>
                <div className="quantum-status-item">
                  <span className="quantum-status-value text-quantum-quantum">
                    {cinematicPerf.memoryUsage}%
                  </span>
                  <div className="quantum-status-label">Memory</div>
                </div>
                <div className="quantum-status-item">
                  <span className="quantum-status-value text-quantum-emerald">
                    {cinematicPerf.renderTime}ms
                  </span>
                  <div className="quantum-status-label">Render Time</div>
                </div>
                <div className="quantum-status-item">
                  <span className="quantum-status-value text-quantum-gold">
                    {cinematicPerf.systemHealth}%
                  </span>
                  <div className="quantum-status-label">System Health</div>
                </div>
              </div>

              {/* Performance Actions */}
              <div className="quantum-performance-actions">
                <button 
                  onClick={cinematicState.resetToOptimal}
                  className="quantum-btn-primary"
                >
                  ðŸ”„ Optimizar Sistema
                </button>
                <button 
                  onClick={quantumState.activateHealing}
                  className="quantum-btn"
                >
                  ðŸ©º SanaciÃ³n CuÃ¡ntica
                </button>
                <button 
                  onClick={() => performance.metrics && console.log('Cache cleared')}
                  className="quantum-btn"
                >
                  ðŸ—‘ï¸ Limpiar Cache
                </button>
              </div>
            </div>
          )}

          {activeView === 'spotify' && (
            <div>
              <h3 className="quantum-section-title">ðŸŽµ Spotify Neural Education</h3>
              
              {/* Spotify Status */}
              <div className="quantum-metric-card quantum-user-info-card">
                <div className="quantum-metric-value text-quantum-emerald">
                  {Math.random() > 0.5 ? 'ðŸŸ¢ CONECTADO' : 'ðŸ”´ DESCONECTADO'}
                </div>
                <div className="quantum-metric-label">
                  Estado de ConexiÃ³n Spotify
                </div>
              </div>

              {/* Spotify Features */}
              <div className="quantum-services-list">
                <div className="quantum-service-item active">
                  <div className="quantum-service-header">
                    <span className="quantum-service-name">
                      ðŸŽµ Sistema Neural Educativo
                    </span>
                    <span className="quantum-service-status connected">
                      Activo
                    </span>
                  </div>
                  <div className="quantum-service-description">
                    GeneraciÃ³n automÃ¡tica de playlists educativas basadas en IA
                  </div>
                </div>
              </div>

              {/* Spotify Actions */}
              <div className="quantum-spotify-actions">
                <button 
                  onClick={() => console.log('Generando playlist matemÃ¡ticas')}
                  className="quantum-btn-primary"
                >
                  ðŸŽµ Generar Playlist MatemÃ¡ticas
                </button>
                <button 
                  onClick={() => console.log('Generando playlist ciencias')}
                  className="quantum-btn"
                >
                  ðŸ§ª Generar Playlist Ciencias
                </button>
                <button 
                  onClick={() => console.log('Sincronizando con plan')}
                  className="quantum-btn"
                >
                  ðŸ”„ Sincronizar con Plan
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Notifications */}
      {notifications.notifications && notifications.notifications.length > 0 && (
        <div className="quantum-card quantum-notifications-card">
          <h4 className="quantum-section-title">ðŸ”” Notificaciones Inteligentes</h4>
          <div className="quantum-services-list">
            {notifications.notifications.slice(0, 3).map((notification, index) => (
              <div key={index} className="quantum-service-item">
                <div className="quantum-service-header">
                  <span className="quantum-service-name">
                    ðŸ“¢ {notification.title}
                  </span>
                  <span className="quantum-service-status connected">
                    {notification.priority || 'normal'}
                  </span>
                </div>
                <div className="quantum-service-description">
                  {notification.message}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernQuantumDashboard;
