/* eslint-disable react-refresh/only-export-components */
// UNIFIED LAYOUT - EvoluciÃ³n CuÃ¡ntica Leonardo da Vinci
// Context7 + MecÃ¡nica CuÃ¡ntica + Pensamiento Secuencial
// "Menos cÃ³digo, mÃ¡s funnel" - MÃ¡ximo impacto con mÃ­nima intervenciÃ³n

import React, { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NeuralParticles } from '../leonardo/NeuralParticles';
import { CinematicEffects } from '../leonardo/CinematicEffects';
import { QuantumBridgeConnector } from '../quantum/QuantumBridgeConnector';
import { TercerOjoQuantumController } from '../tercer-ojo/TercerOjoQuantumController';
import { QuantumSmartSidebar } from '../sidebar/QuantumSmartSidebar';
import { QuantumEducationalCycle } from '../educational/QuantumEducationalCycle';
import { QuantumFieldWrapper } from '../quantum/QuantumFieldWrapper';
import { useQuantumDashboard } from '../../hooks/useQuantumDashboard';
import './UnifiedLayout.module.css';

interface UnifiedLayoutProps {
  children: ReactNode;
  currentSection?: 'anatomia' | 'professional' | 'paes' | 'universe';
  showParticles?: boolean;
  showEffects?: boolean;
  theme?: 'neural' | 'spotify' | 'paes' | 'leonardo';
}

export const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({
  children,
  currentSection = 'anatomia',
  showParticles = true,
  showEffects = true,
  theme = 'leonardo'
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [performanceLevel, setPerformanceLevel] = useState<'high' | 'medium' | 'low'>('high');
  
  // ðŸŒŒ IntegraciÃ³n CuÃ¡ntica - Hook principal
  const { quantumState, isQuantumActive, exerciseMetrics } = useQuantumDashboard();

  // Detectar cambios de secciÃ³n para transiciones
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 800);
    return () => clearTimeout(timer);
  }, [currentSection]);

  // Detectar rendimiento del dispositivo
  useEffect(() => {
    const checkPerformance = () => {
      const memory = (navigator as Navigator & { deviceMemory?: number })?.deviceMemory;
      const connection = (navigator as Navigator & { connection?: { effectiveType?: string } })?.connection;
      
      if (memory && memory < 4) {
        setPerformanceLevel('low');
      } else if (connection && connection.effectiveType === '3g') {
        setPerformanceLevel('medium');
      } else {
        setPerformanceLevel('high');
      }
    };

    checkPerformance();
  }, []);

  const getThemeClasses = () => {
    const baseClasses = 'unified-layout spotify-neural-container';
    const themeClasses = {
      neural: 'theme-neural',
      spotify: 'theme-spotify', 
      paes: 'theme-paes',
      leonardo: 'theme-leonardo'
    };
    
    return `${baseClasses} ${themeClasses[theme]} section-${currentSection}`;
  };

  return (
    <QuantumBridgeConnector>
      <div className={getThemeClasses()}>
        {/* Tercer Ojo - Sistema de CoordinaciÃ³n Omnisciente */}
        <TercerOjoQuantumController />

        {/* Sidebar CuÃ¡ntico Inteligente */}
        <QuantumSmartSidebar />

        {/* Efectos de Fondo CinematogrÃ¡ficos */}
        {showEffects && performanceLevel !== 'low' && (
          <CinematicEffects
            intensity={performanceLevel === 'high' ? 'high' : 'medium'}
            isActive={true}
            theme={theme === 'paes' ? 'neural' : theme === 'leonardo' ? 'synergy' : 'neural'}
          />
        )}

        {/* PartÃ­culas Neurales Optimizadas (Michelangelo: menos es mÃ¡s) */}
        {showParticles && performanceLevel !== 'low' && (
          <NeuralParticles
            intensity="low"
            color="primary"
            isActive={true}
          />
        )}

        {/* Overlay de TransiciÃ³n */}
        {isTransitioning && (
          <div className="unified-transition-overlay">
            <div className="transition-particles"></div>
            <div className="transition-glow"></div>
          </div>
        )}

        {/* NavegaciÃ³n Unificada */}
        <UnifiedNavigation currentSection={currentSection} />

        {/* Contenido Principal con Campo CuÃ¡ntico */}
        <main className="unified-content">
          <div className={`content-wrapper ${isTransitioning ? 'transitioning' : ''}`}>
            <QuantumFieldWrapper>
              <QuantumEducationalCycle>
                {children}
              </QuantumEducationalCycle>
            </QuantumFieldWrapper>
          </div>
        </main>

        {/* MÃ©tricas Globales Flotantes */}
        <UnifiedGlobalMetrics />

        {/* Sistema de Notificaciones */}
        <UnifiedNotificationSystem />
      </div>
    </QuantumBridgeConnector>
  );
};

// NavegaciÃ³n Unificada FUNCIONAL (Enfoque Michelangelo)
const UnifiedNavigation: React.FC<{ currentSection: string }> = ({ currentSection }) => {
  const navigate = useNavigate();
  
  const sections = [
    { id: 'anatomia', name: 'Leonardo AnatomÃ­a', icon: 'ðŸ§ ', description: 'Sistema Completo', path: '/' },
    { id: 'professional', name: 'Leonardo Professional', icon: 'âš¡', description: 'Sinergias Totales', path: '/professional' },
    { id: 'paes', name: 'PAES Universe', icon: 'ðŸŽ¯', description: 'Ejercicios Infinitos', path: '/superpaes' },
    { id: 'universe', name: 'Neural Universe', icon: 'ðŸŒŒ', description: 'IA Avanzada', path: '/neural' }
  ];

  const handleSectionClick = (section: typeof sections[0]) => {
    navigate(section.path);
  };

  return (
    <nav className="unified-navigation spotify-glass-panel">
      <div className="nav-brand">
        <span className="brand-icon">ðŸŽ¨</span>
        <span className="brand-text">Leonardo Ecosystem</span>
      </div>
      
      <div className="nav-sections">
        {sections.map(section => (
          <button
            key={section.id}
            className={`nav-section ${currentSection === section.id ? 'active' : ''}`}
            title={section.description}
            onClick={() => handleSectionClick(section)}
          >
            <span className="section-icon">{section.icon}</span>
            <span className="section-name">{section.name}</span>
            <div className="section-indicator"></div>
          </button>
        ))}
      </div>

      <div className="nav-actions">
        <button
          className="action-button spotify-play-button"
          onClick={() => window.location.reload()}
          title="Recargar Sistema"
        >
          <span>ðŸ”„</span>
        </button>
        <button
          className="action-button spotify-play-button"
          onClick={() => navigate('/settings')}
          title="ConfiguraciÃ³n"
        >
          <span>âš™ï¸</span>
        </button>
      </div>
    </nav>
  );
};

// MÃ©tricas Globales CuÃ¡nticas - CorazÃ³n del Sistema
const UnifiedGlobalMetrics: React.FC = () => {
  const { exerciseMetrics, quantumState } = useQuantumDashboard();

  return (
    <div className="unified-global-metrics">
      <div className="metric-card spotify-glass-card">
        <div className="metric-icon">ðŸŽ¯</div>
        <div className="metric-value">{exerciseMetrics.prediccionPromedio}</div>
        <div className="metric-label">PredicciÃ³n PAES</div>
      </div>
      
      <div className="metric-card spotify-glass-card">
        <div className="metric-icon">ðŸ“Š</div>
        <div className="metric-value">{exerciseMetrics.progresoGlobal}%</div>
        <div className="metric-label">Progreso Global</div>
      </div>
      
      <div className="metric-card spotify-glass-card">
        <div className="metric-icon">ðŸŒŒ</div>
        <div className="metric-value">{exerciseMetrics.coherenciaCuantica}%</div>
        <div className="metric-label">Coherencia CuÃ¡ntica</div>
      </div>
      
      <div className="metric-card spotify-glass-card">
        <div className="metric-icon">ðŸ”—</div>
        <div className="metric-value">{quantumState.entangledComponents.length}</div>
        <div className="metric-label">Entrelazamientos</div>
      </div>
    </div>
  );
};

// Sistema de Notificaciones Unificado
const UnifiedNotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'success' | 'info' | 'warning';
    message: string;
    icon: string;
  }>>([]);

  return (
    <div className="unified-notifications">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`notification spotify-glass-card notification-${notification.type}`}
        >
          <span className="notification-icon">{notification.icon}</span>
          <span className="notification-message">{notification.message}</span>
          <button className="notification-close">âœ•</button>
        </div>
      ))}
    </div>
  );
};
