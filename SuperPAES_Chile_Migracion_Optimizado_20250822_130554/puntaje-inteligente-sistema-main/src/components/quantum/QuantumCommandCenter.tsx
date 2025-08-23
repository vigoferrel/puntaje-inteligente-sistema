/* eslint-disable react-refresh/only-export-components */
/**
 * ðŸ§  QUANTUM COMMAND CENTER - Centro de Comando CuÃ¡ntico Ultra-Optimizado
 * Inspirado en VS Code pero esculpido para mÃ³viles de gama media
 * Context7 + Pensamiento Secuencial + MÃ­nimo CÃ³digo = MÃ¡xima Funcionalidad
 * 
 * "Fuera de la caja, dentro del Ã¡tomo" - Leonardo da Vinci
 */

import React, { useState } from 'react';
import { useQuantumCommandCenter } from '../../hooks/useQuantumCommandCenter';

// ðŸŽ¨ Componente Principal - Ultra-Minimalista con Hook Optimizado
export const QuantumCommandCenter: React.FC = () => {
  const {
    state,
    systemStats,
    activateAgent,
    deactivateAgent,
    getFilteredAgents,
    isAgentActive,
    getAgentById,
    isLowPerformance,
    controlViralActivity
  } = useQuantumCommandCenter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPiso, setSelectedPiso] = useState<1 | 2 | 'all'>('all');

  // ðŸŽ¨ Filtered Agents usando el hook optimizado
  const filteredAgents = getFilteredAgents(selectedPiso);

  return (
    <div className="quantum-command-center">
      {/* ðŸ“± Header - Ultra-Minimalista */}
      <header className="qcc-header">
        <div className="qcc-header-left">
          <button 
            className="qcc-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            â˜°
          </button>
          <span className="qcc-title">ðŸ§  Quantum Command</span>
        </div>
        
        <div className="qcc-header-right">
          <div className="qcc-stats">
            <span className="qcc-stat">
              ðŸ”‹ {state.batteryLevel}%
            </span>
            <span className="qcc-stat">
              ðŸ“Š {state.memoryUsage}%
            </span>
            <span className={`qcc-network qcc-network--${state.networkStatus}`}>
              {state.networkStatus === 'online' ? 'ðŸŸ¢' :
               state.networkStatus === 'slow' ? 'ðŸŸ¡' : 'ðŸ”´'}
            </span>
          </div>
        </div>
      </header>

      <div className="qcc-body">
        {/* ðŸ“‹ Sidebar - Agentes */}
        <aside className={`qcc-sidebar ${sidebarOpen ? 'qcc-sidebar--open' : ''}`}>
          <div className="qcc-sidebar-header">
            <h3>Agentes</h3>
            <div className="qcc-piso-filter">
              <button 
                className={selectedPiso === 'all' ? 'active' : ''}
                onClick={() => setSelectedPiso('all')}
              >
                Todos
              </button>
              <button 
                className={selectedPiso === 1 ? 'active' : ''}
                onClick={() => setSelectedPiso(1)}
              >
                P1
              </button>
              <button 
                className={selectedPiso === 2 ? 'active' : ''}
                onClick={() => setSelectedPiso(2)}
              >
                P2
              </button>
            </div>
          </div>
          
          <div className="qcc-agent-list">
            {filteredAgents.map(agent => (
              <div
                key={agent.id}
                className={`qcc-agent ${agent.status} ${isAgentActive(agent.id) ? 'active' : ''}`}
                onClick={() => activateAgent(agent.id)}
              >
                <div className="qcc-agent-icon">
                  {agent.emoji}
                </div>
                <div className="qcc-agent-info">
                  <div className="qcc-agent-name">{agent.name}</div>
                  <div className="qcc-agent-meta">
                    P{agent.piso} â€¢ {agent.health}%
                  </div>
                </div>
                <div className={`qcc-agent-status qcc-agent-status--${agent.status}`}>
                  {agent.status === 'thinking' ? 'ðŸ¤”' :
                   agent.status === 'active' ? 'âš¡' :
                   agent.status === 'error' ? 'âŒ' : 'ðŸ’¤'}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* ðŸŽ¯ Main Panel */}
        <main className="qcc-main">
          <div className="qcc-main-header">
            <h2>
              {state.activeAgent
                ? `${getAgentById(state.activeAgent)?.emoji} ${getAgentById(state.activeAgent)?.name}`
                : 'ðŸŽ¯ Centro de Comando'
              }
            </h2>
          </div>
          
          <div className="qcc-main-content">
            {state.activeAgent ? (
              <div className="qcc-agent-detail">
                <div className="qcc-agent-detail-stats">
                  <div className="qcc-stat-card">
                    <div className="qcc-stat-label">Estado</div>
                    <div className="qcc-stat-value">
                      {getAgentById(state.activeAgent)?.status}
                    </div>
                  </div>
                  <div className="qcc-stat-card">
                    <div className="qcc-stat-label">Salud</div>
                    <div className="qcc-stat-value">
                      {getAgentById(state.activeAgent)?.health}%
                    </div>
                  </div>
                  <div className="qcc-stat-card">
                    <div className="qcc-stat-label">Piso</div>
                    <div className="qcc-stat-value">
                      {getAgentById(state.activeAgent)?.piso}
                    </div>
                  </div>
                </div>
                
                <div className="qcc-agent-actions">
                  <button className="qcc-btn qcc-btn--primary">
                    ðŸš€ Ejecutar
                  </button>
                  <button className="qcc-btn qcc-btn--secondary">
                    âš™ï¸ Configurar
                  </button>
                  <button className="qcc-btn qcc-btn--danger">
                    ðŸ›‘ Detener
                  </button>
                </div>
              </div>
            ) : (
              <div className="qcc-overview">
                <div className="qcc-overview-stats">
                  <div className="qcc-overview-card">
                    <div className="qcc-overview-icon">ðŸ¤–</div>
                    <div className="qcc-overview-info">
                      <div className="qcc-overview-number">{systemStats.activeAgents}</div>
                      <div className="qcc-overview-label">Agentes Activos</div>
                    </div>
                  </div>
                  
                  <div className="qcc-overview-card">
                    <div className="qcc-overview-icon">ðŸ’š</div>
                    <div className="qcc-overview-info">
                      <div className="qcc-overview-number">{systemStats.avgHealth}%</div>
                      <div className="qcc-overview-label">Salud Promedio</div>
                    </div>
                  </div>
                  
                  <div className="qcc-overview-card">
                    <div className="qcc-overview-icon">ðŸŒ€</div>
                    <div className="qcc-overview-info">
                      <div className="qcc-overview-number">{state.viralActivity}%</div>
                      <div className="qcc-overview-label">Actividad Viral</div>
                    </div>
                  </div>
                </div>
                
                <div className="qcc-quick-actions">
                  <h3>Acciones RÃ¡pidas</h3>
                  <div className="qcc-quick-grid">
                    <button className="qcc-quick-btn" onClick={() => activateAgent('leonardo-neural')}>
                      ðŸ§  PredicciÃ³n Neural
                    </button>
                    <button className="qcc-quick-btn" onClick={() => activateAgent('quantum-virus')}>
                      ðŸŒ€ Activar Virus
                    </button>
                    <button className="qcc-quick-btn" onClick={() => activateAgent('lectoguia')}>
                      ðŸ“– LectoGuÃ­a
                    </button>
                    <button className="qcc-quick-btn" onClick={() => activateAgent('leonardo-ocr')}>
                      ðŸ‘ï¸ Procesar OCR
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ðŸ“Š Footer - MÃ©tricas Esenciales */}
      <footer className="qcc-footer">
        <div className="qcc-footer-stats">
          <span>Sistema: {Math.round(state.systemHealth)}%</span>
          <span>Agentes: {systemStats.activeAgents}/{systemStats.totalAgents}</span>
          <span>Memoria: {state.memoryUsage}%</span>
        </div>
      </footer>

      <style>{`
        .quantum-command-center {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #1e1e1e;
          color: #d4d4d4;
          font-family: 'Consolas', 'Monaco', monospace;
          font-size: 14px;
        }

        .qcc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 16px;
          background: #2d2d30;
          border-bottom: 1px solid #3e3e42;
          height: 48px;
        }

        .qcc-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .qcc-menu-btn {
          background: none;
          border: none;
          color: #d4d4d4;
          font-size: 16px;
          cursor: pointer;
          padding: 4px;
        }

        .qcc-title {
          font-weight: 600;
          font-size: 16px;
        }

        .qcc-header-right {
          display: flex;
          align-items: center;
        }

        .qcc-stats {
          display: flex;
          gap: 12px;
          font-size: 12px;
        }

        .qcc-stat {
          padding: 2px 6px;
          background: #3c3c3c;
          border-radius: 3px;
        }

        .qcc-network {
          font-size: 14px;
        }

        .qcc-body {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        .qcc-sidebar {
          width: 0;
          background: #252526;
          border-right: 1px solid #3e3e42;
          overflow: hidden;
          transition: width 0.2s ease;
        }

        .qcc-sidebar--open {
          width: 280px;
        }

        .qcc-sidebar-header {
          padding: 16px;
          border-bottom: 1px solid #3e3e42;
        }

        .qcc-sidebar-header h3 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 600;
        }

        .qcc-piso-filter {
          display: flex;
          gap: 4px;
        }

        .qcc-piso-filter button {
          background: #3c3c3c;
          border: none;
          color: #d4d4d4;
          padding: 4px 8px;
          border-radius: 3px;
          font-size: 11px;
          cursor: pointer;
        }

        .qcc-piso-filter button.active {
          background: #007acc;
        }

        .qcc-agent-list {
          padding: 8px;
          overflow-y: auto;
          max-height: calc(100vh - 200px);
        }

        .qcc-agent {
          display: flex;
          align-items: center;
          padding: 8px;
          margin-bottom: 4px;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.1s ease;
        }

        .qcc-agent:hover {
          background: #2a2d2e;
        }

        .qcc-agent.active {
          background: #094771;
        }

        .qcc-agent.thinking {
          background: #5a4e00;
        }

        .qcc-agent.error {
          background: #5a1e1e;
        }

        .qcc-agent-icon {
          font-size: 18px;
          margin-right: 12px;
        }

        .qcc-agent-info {
          flex: 1;
        }

        .qcc-agent-name {
          font-weight: 500;
          font-size: 13px;
        }

        .qcc-agent-meta {
          font-size: 11px;
          color: #969696;
        }

        .qcc-agent-status {
          font-size: 14px;
        }

        .qcc-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .qcc-main-header {
          padding: 16px;
          border-bottom: 1px solid #3e3e42;
        }

        .qcc-main-header h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .qcc-main-content {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
        }

        .qcc-agent-detail-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 12px;
          margin-bottom: 24px;
        }

        .qcc-stat-card {
          background: #2d2d30;
          padding: 12px;
          border-radius: 6px;
          text-align: center;
        }

        .qcc-stat-label {
          font-size: 11px;
          color: #969696;
          margin-bottom: 4px;
        }

        .qcc-stat-value {
          font-size: 16px;
          font-weight: 600;
        }

        .qcc-agent-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .qcc-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          font-size: 13px;
          cursor: pointer;
          font-weight: 500;
        }

        .qcc-btn--primary {
          background: #007acc;
          color: white;
        }

        .qcc-btn--secondary {
          background: #3c3c3c;
          color: #d4d4d4;
        }

        .qcc-btn--danger {
          background: #d73a49;
          color: white;
        }

        .qcc-overview-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .qcc-overview-card {
          background: #2d2d30;
          padding: 16px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .qcc-overview-icon {
          font-size: 24px;
        }

        .qcc-overview-number {
          font-size: 20px;
          font-weight: 700;
          color: #4ec9b0;
        }

        .qcc-overview-label {
          font-size: 12px;
          color: #969696;
        }

        .qcc-quick-actions h3 {
          margin: 0 0 16px 0;
          font-size: 16px;
        }

        .qcc-quick-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
        }

        .qcc-quick-btn {
          background: #3c3c3c;
          border: none;
          color: #d4d4d4;
          padding: 12px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          transition: background 0.1s ease;
        }

        .qcc-quick-btn:hover {
          background: #4a4a4a;
        }

        .qcc-footer {
          padding: 8px 16px;
          background: #2d2d30;
          border-top: 1px solid #3e3e42;
          font-size: 11px;
        }

        .qcc-footer-stats {
          display: flex;
          gap: 16px;
          color: #969696;
        }

        /* ðŸ“± Mobile Optimizations */
        @media (max-width: 768px) {
          .qcc-header {
            padding: 6px 12px;
            height: 44px;
          }
          
          .qcc-title {
            font-size: 14px;
          }
          
          .qcc-stats {
            gap: 8px;
          }
          
          .qcc-stat {
            font-size: 11px;
          }
          
          .qcc-sidebar--open {
            width: 240px;
          }
          
          .qcc-main-content {
            padding: 12px;
          }
          
          .qcc-overview-stats {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          
          .qcc-quick-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .qcc-agent-actions {
            flex-direction: column;
          }
          
          .qcc-btn {
            width: 100%;
          }
        }

        /* ðŸ”‹ Battery Optimizations */
        @media (max-width: 480px) {
          .qcc-agent {
            padding: 6px;
          }
          
          .qcc-agent-icon {
            font-size: 16px;
            margin-right: 8px;
          }
          
          .qcc-overview-card {
            padding: 12px;
          }
          
          .qcc-quick-btn {
            padding: 10px;
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  );
};

export default QuantumCommandCenter;
