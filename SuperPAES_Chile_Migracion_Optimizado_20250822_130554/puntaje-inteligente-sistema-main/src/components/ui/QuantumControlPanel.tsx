/* eslint-disable react-refresh/only-export-components */
/**
 * ðŸŽ® QUANTUM CONTROL PANEL - Panel de Control Principal
 * Interfaz visual completa para la Caja de Pandora Negra
 * Usando Arsenal CuÃ¡ntico CSS - El mÃ¡rmol siempre estuvo ahÃ­
 */

import React, { useState } from 'react';
import { useQuantumHomeostasis } from '../../hooks/useQuantumHomeostasis';
import '../../styles/QuantumUIComponents.css';

export const QuantumControlPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isVisible, setIsVisible] = useState(true);
  const quantumState = useQuantumHomeostasis();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'ðŸŽ¯' },
    { id: 'organs', label: 'Ã“rganos', icon: 'ðŸ«€' },
    { id: 'neural', label: 'Neural', icon: 'ðŸ§ ' },
    { id: 'quantum', label: 'CuÃ¡ntico', icon: 'âš›ï¸' }
  ];

  if (!isVisible) {
    return (
      <div 
        onClick={() => setIsVisible(true)}
        className="quantum-btn quantum-pulse-animation"
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 9998,
          fontSize: '24px'
        }}
      >
        ðŸ–¤
      </div>
    );
  }

  return (
    <div className="quantum-control-panel">
      {/* Header */}
      <div className="quantum-panel-header">
        <span>ðŸŽ›ï¸ Control CuÃ¡ntico</span>
        <button
          onClick={() => setIsVisible(false)}
          className="quantum-btn-close"
        >
          âœ•
        </button>
      </div>

      {/* Tabs */}
      <div className="quantum-panel-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`quantum-tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="quantum-panel-content">
        {activeTab === 'dashboard' && (
          <div className="quantum-metrics-section">
            <h3 className="quantum-section-title">ðŸ–¤ QUANTUM BLACK CUBE - DASHBOARD</h3>
            <div className="quantum-status-grid">
              <div className="quantum-status-item quantum-glow-active">
                <span className="quantum-status-value">{quantumState.systemHealth}%</span>
                <div className="quantum-status-label">System Health</div>
              </div>
              <div className="quantum-status-item">
                <span className="quantum-status-value">153KB</span>
                <div className="quantum-status-label">Bundle Size</div>
              </div>
              <div className="quantum-status-item">
                <span className="quantum-status-value">{quantumState.memoryUsage}MB</span>
                <div className="quantum-status-label">Memory Usage</div>
              </div>
              <div className="quantum-status-item">
                <span className="quantum-status-value">{quantumState.homeostasis}</span>
                <div className="quantum-status-label">Homeostasis</div>
              </div>
            </div>
            
            <div className="quantum-metrics-grid" style={{ marginTop: '1rem' }}>
              <div className="quantum-metric-card">
                <div className="quantum-metric-value text-quantum-neural">âœ…</div>
                <div className="quantum-metric-label">Context7</div>
              </div>
              <div className="quantum-metric-card">
                <div className="quantum-metric-value text-quantum-quantum">âœ…</div>
                <div className="quantum-metric-label">Sequential</div>
              </div>
              <div className="quantum-metric-card">
                <div className="quantum-metric-value text-quantum-emerald">âœ…</div>
                <div className="quantum-metric-label">Homeostasis</div>
              </div>
              <div className="quantum-metric-card">
                <div className="quantum-metric-value text-quantum-gold">âœ…</div>
                <div className="quantum-metric-label">Mobile Ready</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'organs' && (
          <div className="quantum-metrics-section">
            <h3 className="quantum-section-title">ðŸ«€ Ã“RGANOS CUÃNTICOS - HOMEOSTASIS</h3>
            <div className="quantum-organs-grid">
              <div className="quantum-organ-item quantum-glow-neural">
                <div className="quantum-organ-header">
                  <span className="quantum-organ-name">ðŸ§  LEONARDO BRAIN</span>
                  <span className="quantum-organ-status active">ACTIVO</span>
                </div>
                <div className="quantum-organ-metrics">
                  <span className="quantum-organ-metric">
                    Neural Engine: <strong>583 lÃ­neas</strong>
                  </span>
                  <span className="quantum-organ-metric">
                    Memory: <strong>15KB</strong>
                  </span>
                </div>
              </div>

              <div className="quantum-organ-item quantum-glow-quantum">
                <div className="quantum-organ-header">
                  <span className="quantum-organ-name">ðŸ‘ï¸ RAFAEL EYES</span>
                  <span className="quantum-organ-status active">ACTIVO</span>
                </div>
                <div className="quantum-organ-metrics">
                  <span className="quantum-organ-metric">
                    Visualization: <strong>2D+ Optimized</strong>
                  </span>
                  <span className="quantum-organ-metric">
                    Memory: <strong>35KB</strong>
                  </span>
                </div>
              </div>

              <div className="quantum-organ-item">
                <div className="quantum-organ-header">
                  <span className="quantum-organ-name">ðŸŽ¨ MICHELANGELO HANDS</span>
                  <span className="quantum-organ-status active">ACTIVO</span>
                </div>
                <div className="quantum-organ-metrics">
                  <span className="quantum-organ-metric">
                    Touch: <strong>Thumb-Friendly</strong>
                  </span>
                  <span className="quantum-organ-metric">
                    Memory: <strong>25KB</strong>
                  </span>
                </div>
              </div>

              <div className="quantum-organ-item">
                <div className="quantum-organ-header">
                  <span className="quantum-organ-name">ðŸŽµ SPOTIFY HEART</span>
                  <span className="quantum-organ-status active">ACTIVO</span>
                </div>
                <div className="quantum-organ-metrics">
                  <span className="quantum-organ-metric">
                    Agents: <strong>9 Neurales</strong>
                  </span>
                  <span className="quantum-organ-metric">
                    Memory: <strong>35KB</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'neural' && (
          <div className="quantum-metrics-section">
            <h3 className="quantum-section-title">ðŸ§¬ SPOTIFY NEURAL - 9 AGENTES</h3>
            <div className="quantum-neural-grid">
              <div className="quantum-neural-agent active">
                <div className="quantum-neural-name">PathFinder</div>
                <div className="quantum-neural-floor">Piso 1</div>
                <div className="quantum-neural-status">ðŸŸ¢ Activo</div>
              </div>
              <div className="quantum-neural-agent active">
                <div className="quantum-neural-name">BloomNavigator</div>
                <div className="quantum-neural-floor">Piso 1</div>
                <div className="quantum-neural-status">ðŸŸ¢ Activo</div>
              </div>
              <div className="quantum-neural-agent active">
                <div className="quantum-neural-name">AdaptiveTutor</div>
                <div className="quantum-neural-floor">Piso 1</div>
                <div className="quantum-neural-status">ðŸŸ¢ Activo</div>
              </div>
              <div className="quantum-neural-agent active">
                <div className="quantum-neural-name">ContentGenerator</div>
                <div className="quantum-neural-floor">Piso 1</div>
                <div className="quantum-neural-status">ðŸŸ¢ Activo</div>
              </div>
              <div className="quantum-neural-agent active">
                <div className="quantum-neural-name">PlaylistOrchestrator</div>
                <div className="quantum-neural-floor">Piso 2</div>
                <div className="quantum-neural-status">ðŸŸ¢ Activo</div>
              </div>
              <div className="quantum-neural-agent active">
                <div className="quantum-neural-name">GapCalculator</div>
                <div className="quantum-neural-floor">Piso 2</div>
                <div className="quantum-neural-status">ðŸŸ¢ Activo</div>
              </div>
              <div className="quantum-neural-agent active">
                <div className="quantum-neural-name">MotivationEngine</div>
                <div className="quantum-neural-floor">Piso 2</div>
                <div className="quantum-neural-status">ðŸŸ¢ Activo</div>
              </div>
              <div className="quantum-neural-agent active">
                <div className="quantum-neural-name">ProgressTracker</div>
                <div className="quantum-neural-floor">Piso 2</div>
                <div className="quantum-neural-status">ðŸŸ¢ Activo</div>
              </div>
              <div className="quantum-neural-agent active">
                <div className="quantum-neural-name">CalendarSync</div>
                <div className="quantum-neural-floor">Piso 2</div>
                <div className="quantum-neural-status">ðŸŸ¢ Activo</div>
              </div>
            </div>
            
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <div className="quantum-btn-primary" style={{ padding: '0.75rem', borderRadius: '8px' }}>
                ðŸŽµ SpotifyNeuralOrchestrator - MAESTRO ACTIVO
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quantum' && (
          <div className="quantum-metrics-section">
            <h3 className="quantum-section-title">âš›ï¸ SERVICIOS CUÃNTICOS</h3>
            <div className="quantum-services-list">
              <div className="quantum-service-item active">
                <div className="quantum-service-header">
                  <span className="quantum-service-name">ðŸ“… Calendar</span>
                  <span className="quantum-service-status connected">CONECTADO</span>
                </div>
                <div className="quantum-service-description">Quantum Events</div>
              </div>
              
              <div className="quantum-service-item active">
                <div className="quantum-service-header">
                  <span className="quantum-service-name">ðŸ’° FUAS</span>
                  <span className="quantum-service-status connected">CONECTADO</span>
                </div>
                <div className="quantum-service-description">Calculator</div>
              </div>
              
              <div className="quantum-service-item active">
                <div className="quantum-service-header">
                  <span className="quantum-service-name">ðŸ” OCR</span>
                  <span className="quantum-service-status connected">CONECTADO</span>
                </div>
                <div className="quantum-service-description">Classification</div>
              </div>
              
              <div className="quantum-service-item active">
                <div className="quantum-service-header">
                  <span className="quantum-service-name">ðŸ“š Nodos</span>
                  <span className="quantum-service-status connected">CONECTADO</span>
                </div>
                <div className="quantum-service-description">200+ Activos</div>
              </div>
              
              <div className="quantum-service-item active">
                <div className="quantum-service-header">
                  <span className="quantum-service-name">ðŸŒ¸ Bloom</span>
                  <span className="quantum-service-status connected">CONECTADO</span>
                </div>
                <div className="quantum-service-description">L1-L6 Levels</div>
              </div>
              
              <div className="quantum-service-item active">
                <div className="quantum-service-header">
                  <span className="quantum-service-name">ðŸŽ¯ PAES</span>
                  <span className="quantum-service-status connected">CONECTADO</span>
                </div>
                <div className="quantum-service-description">Agents Active</div>
              </div>
            </div>
            
            <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>
              <div className="text-quantum-emerald">
                ðŸ–¤ EL MÃRMOL SIEMPRE ESTUVO AHÃ - CAJA DE PANDORA NEGRA CERRADA âœ…
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuantumControlPanel;
