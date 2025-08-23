/* eslint-disable react-refresh/only-export-components */
/**
 * ðŸŽ¯ QUANTUM DASHBOARD UI - Dashboard Flotante Principal
 * Interfaz visual flotante para monitoreo en tiempo real
 * Usando Arsenal CuÃ¡ntico CSS - El mÃ¡rmol siempre estuvo ahÃ­
 */

import React from 'react';
import { useQuantumHomeostasis } from '../../hooks/useQuantumHomeostasis';
import '../../styles/QuantumUIComponents.css';

export const QuantumDashboardUI: React.FC = () => {
  const quantumState = useQuantumHomeostasis();

  return (
    <div className="quantum-dashboard-floating">
      <div className="quantum-dashboard-title">
        ðŸŽ¯ Quantum Dashboard
        <span className="quantum-pulse-animation">âš¡</span>
      </div>

      {/* Estado General */}
      <div className="quantum-status-grid">
        <div className="quantum-status-item quantum-glow-active">
          <span className="quantum-status-value">{quantumState.systemHealth}%</span>
          <div className="quantum-status-label">System Health</div>
        </div>
        <div className="quantum-status-item">
          <span className="quantum-status-value">{quantumState.memoryUsage}MB</span>
          <div className="quantum-status-label">Memory</div>
        </div>
        <div className="quantum-status-item">
          <span className="quantum-status-value">{quantumState.activeOrgans.length}</span>
          <div className="quantum-status-label">Active Organs</div>
        </div>
        <div className="quantum-status-item">
          <span className="quantum-status-value">{quantumState.homeostasis}</span>
          <div className="quantum-status-label">Homeostasis</div>
        </div>
      </div>

      {/* Ã“rganos Activos */}
      <div className="quantum-metrics-section">
        <h4 className="quantum-section-title">ðŸ«€ Ã“rganos Activos</h4>
        <div className="quantum-organs-grid">
          {quantumState.activeOrgans.map((organ, index) => (
            <div key={index} className="quantum-organ-item">
              <div className="quantum-organ-header">
                <span className="quantum-organ-name">
                  {organ === 'leonardo' ? 'ðŸ§  Leonardo' :
                   organ === 'rafael' ? 'ðŸ‘ï¸ Rafael' :
                   organ === 'michelangelo' ? 'ðŸŽ¨ Michelangelo' :
                   organ === 'spotify' ? 'ðŸŽµ Spotify' : organ}
                </span>
                <span className="quantum-organ-status active">ACTIVO</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sistemas Entrelazados */}
      <div className="quantum-metrics-section">
        <h4 className="quantum-section-title">ðŸŒŒ Sistemas Entrelazados</h4>
        <div className="quantum-services-list">
          {Object.entries(quantumState.entangledSystems).map(([system, status]) => (
            <div key={system} className={`quantum-service-item ${status ? 'active' : ''}`}>
              <div className="quantum-service-header">
                <span className="quantum-service-name">
                  {system === 'leonardo' ? 'ðŸ§  Leonardo Brain' :
                   system === 'rafael' ? 'ðŸ‘ï¸ Rafael Eyes' :
                   system === 'michelangelo' ? 'ðŸŽ¨ Michelangelo Hands' :
                   system === 'spotify' ? 'ðŸŽµ Spotify Heart' : system}
                </span>
                <span className={`quantum-service-status ${status ? 'connected' : 'disconnected'}`}>
                  {status ? 'ENTRELAZADO' : 'DESCONECTADO'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Context7 Status */}
      <div className="quantum-metrics-section">
        <h4 className="quantum-section-title">ðŸŽ¯ Context7 Manager</h4>
        <div className="quantum-metric-card quantum-glow-neural">
          <div className="quantum-metric-value text-quantum-neural">
            {quantumState.context7 ? 'âœ… ACTIVO' : 'âŒ INACTIVO'}
          </div>
          <div className="quantum-metric-label">
            Estado del Context7 Manager
          </div>
        </div>
      </div>

      {/* BotÃ³n de SanaciÃ³n */}
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <button 
          onClick={quantumState.activateHealing}
          className="quantum-btn-primary"
        >
          ðŸ”„ Activar SanaciÃ³n CuÃ¡ntica
        </button>
      </div>

      {/* Status Footer */}
      <div style={{ 
        marginTop: '1rem', 
        textAlign: 'center', 
        fontSize: '0.75rem',
        padding: '0.5rem',
        borderTop: '1px solid var(--glass-border)'
      }}>
        <div className="text-quantum-emerald">
          ðŸ–¤ Quantum Black Cube - Homeostasis Activa
        </div>
      </div>
    </div>
  );
};

export default QuantumDashboardUI;
