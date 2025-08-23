/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useContext7 } from '../../contexts/Context7Provider';
import {
  Home, BarChart3, Trophy, TrendingUp, Star, BookOpen, Calculator,
  FileText, Microscope, Landmark, Target, Brain, MessageCircle,
  Lightbulb, BarChart, User, Palette, Bell, Shield, Search,
  Menu, X, ChevronDown, ChevronRight
} from 'lucide-react';
import './SpotifyLayoutStyles.css';

interface SpotifyLikeLayoutProps {
  children?: React.ReactNode;
}

// Componente Header Inline
const SpotifyHeader: React.FC<{
  onToggleSidebar: () => void;
  onToggleRightPanel: () => void;
}> = ({ onToggleSidebar, onToggleRightPanel }) => {
  return (
    <div className="spotify-header">
      <div className="header-left">
        <button
          onClick={onToggleSidebar}
          className="header-button"
          aria-label="Alternar menú lateral"
          title="Abrir/cerrar menú lateral"
        >
          <Menu size={20} className="text-white" />
        </button>
        <h1 className="text-xl font-bold text-white">PAES Master System</h1>
      </div>
      
      <div className="header-center">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar materias, temas, ejercicios..."
            className="global-search pl-10"
          />
        </div>
      </div>
      
      <div className="header-right">
        <button
          onClick={onToggleRightPanel}
          className="header-button"
          aria-label="Alternar panel de analytics"
          title="Abrir/cerrar panel de estadísticas"
        >
          <BarChart size={20} className="text-white" />
        </button>
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></div>
      </div>
    </div>
  );
};

// Componente Sidebar Educativo Inline
const EducationalSidebar: React.FC<{ collapsed: boolean }> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState(['mi-biblioteca', 'aprendizaje']);

  const sidebarSections = [
    {
      id: 'mi-biblioteca',
      title: 'Mi Biblioteca',
      items: [
        { id: 'dashboard', label: 'Dashboard Principal', icon: Home, path: '/' },
        { id: 'progreso', label: 'Mi Progreso', icon: BarChart3, path: '/dashboard' },
        { id: 'logros', label: 'Mis Logros', icon: Trophy, path: '/achievements', badge: '23' },
        { id: 'estadisticas', label: 'Estadísticas', icon: TrendingUp, path: '/planning' },
        { id: 'favoritos', label: 'Favoritos', icon: Star, path: '/favoritos' }
      ]
    },
    {
      id: 'aprendizaje',
      title: 'Aprendizaje',
      items: [
        { id: 'matematicas', label: 'Matemáticas', icon: Calculator, path: '/matematicas', badge: 'M1/M2' },
        { id: 'lenguaje', label: 'Lenguaje', icon: FileText, path: '/lenguaje' },
        { id: 'ciencias', label: 'Ciencias', icon: Microscope, path: '/ciencias' },
        { id: 'historia', label: 'Historia', icon: Landmark, path: '/historia' },
        { id: 'simulaciones', label: 'Simulaciones PAES', icon: Target, path: '/studio', badge: 'Nuevo' }
      ]
    },
    {
      id: 'ia-neural',
      title: 'IA Neural',
      items: [
        { id: 'asistente', label: 'Asistente Personal', icon: MessageCircle, path: '/assistant' },
        { id: 'recomendaciones', label: 'Recomendaciones', icon: Lightbulb, path: '/recomendaciones' },
        { id: 'analisis', label: 'Análisis Predictivo', icon: BarChart, path: '/analisis' },
        { id: 'insights', label: 'Insights Avanzados', icon: Brain, path: '/insights' }
      ]
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  if (collapsed) return null;

  return (
    <div className="spotify-sidebar">
      {sidebarSections.map((section) => (
        <div key={section.id} className="sidebar-section">
          <button
            onClick={() => toggleSection(section.id)}
            className="section-title-button"
            aria-label={`Alternar sección ${section.title}`}
            title={`Expandir/contraer sección ${section.title}`}
          >
            <span>{section.title}</span>
            {expandedSections.includes(section.id) ? (
              <ChevronDown size={12} />
            ) : (
              <ChevronRight size={12} />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.includes(section.id) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="dynamic-style" data-style="{overflow: 'hidden' }"
              >
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
                  >
                    <item.icon className="sidebar-item-icon" size={20} />
                    <span className="sidebar-item-label">{item.label}</span>
                    {item.badge && (
                      <span className="sidebar-item-badge">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

// Componente Central Stage Inline
const HolographicCentralStage: React.FC<{
  currentView: string;
  performanceScore: number;
}> = ({ currentView, performanceScore }) => {
  return (
    <div className="central-stage-container">
      <div className="stage-header">
        <h2 className="stage-title">Pantalla Central Holográfica</h2>
        <div className="view-switcher">
          <button className="view-button active">Dashboard</button>
          <button className="view-button">Hologramas</button>
          <button className="view-button">Progreso</button>
          <button className="view-button">Analytics</button>
        </div>
      </div>
      
      <div className="holographic-container holographic-glow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glassmorphism p-6">
            <h3 className="text-xl font-bold text-white mb-4">Performance Score</h3>
            <div className="text-3xl font-bold text-cyan-400">{performanceScore}</div>
          </div>
          
          <div className="glassmorphism p-6">
            <h3 className="text-xl font-bold text-white mb-4">Progreso Bloom</h3>
            <div className="text-3xl font-bold text-purple-400">87%</div>
          </div>
          
          <div className="glassmorphism p-6">
            <h3 className="text-xl font-bold text-white mb-4">IA Neural</h3>
            <div className="text-3xl font-bold text-green-400">Activo</div>
          </div>
        </div>
        
        <div className="mt-8 glassmorphism p-6">
          <h3 className="text-xl font-bold text-white mb-4">Visualización 3D</h3>
          <div className="h-64 bg-gradient-to-br from-purple-900/50 to-cyan-900/50 rounded-lg flex items-center justify-center">
            <div className="text-white text-lg">?? Universo Educativo Holográfico</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente Analytics Panel Inline
const AnalyticsRightPanel: React.FC<{ visible: boolean }> = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className="spotify-analytics">
      <div className="analytics-section">
        <h3 className="analytics-title">?? Recomendaciones IA</h3>
        <div className="analytics-card">
          <div className="text-sm text-white">Próximo tema sugerido:</div>
          <div className="text-lg font-bold text-cyan-400">Funciones Lineales</div>
        </div>
        <div className="analytics-card">
          <div className="text-sm text-white">Área de mejora:</div>
          <div className="text-lg font-bold text-orange-400">Álgebra Básica</div>
        </div>
      </div>
      
      <div className="analytics-section">
        <h3 className="analytics-title">?? Métricas en Tiempo Real</h3>
        <div className="analytics-card">
          <div className="text-sm text-white">Sesión actual:</div>
          <div className="text-lg font-bold text-green-400">45 min</div>
        </div>
        <div className="analytics-card">
          <div className="text-sm text-white">Precisión:</div>
          <div className="text-lg font-bold text-purple-400">89%</div>
        </div>
      </div>
      
      <div className="analytics-section">
        <h3 className="analytics-title">?? Próximos Objetivos</h3>
        <div className="analytics-card">
          <div className="text-sm text-white">Meta semanal:</div>
          <div className="text-lg font-bold text-yellow-400">700 pts PAES</div>
        </div>
      </div>
    </div>
  );
};

export const SpotifyLikeLayout: React.FC<SpotifyLikeLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanelVisible, setRightPanelVisible] = useState(true);
  const [currentView, setCurrentView] = useState<'dashboard' | 'holograms' | 'progress' | 'analytics'>('dashboard');
  const { state } = useContext7();

  // Responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 1024) {
        setSidebarCollapsed(true);
        setRightPanelVisible(false);
      } else {
        setSidebarCollapsed(false);
        setRightPanelVisible(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="spotify-paes-layout">
      {/* Header */}
      <SpotifyHeader
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        onToggleRightPanel={() => setRightPanelVisible(!rightPanelVisible)}
      />

      {/* Sidebar */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ x: -240, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -240, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="spotify-sidebar"
          >
            <EducationalSidebar collapsed={sidebarCollapsed} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Central Stage */}
      <div className={`spotify-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${!rightPanelVisible ? 'panel-hidden' : ''}`}>
        <HolographicCentralStage
          currentView={currentView}
          performanceScore={state.performanceScore}
        />
        {children}
      </div>

      {/* Right Panel */}
      <AnimatePresence>
        {rightPanelVisible && (
          <motion.div
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="spotify-analytics"
          >
            <AnalyticsRightPanel visible={rightPanelVisible} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation Overlay */}
      {sidebarCollapsed && (
        <div className="mobile-nav-overlay">
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="mobile-nav-toggle"
          >
            ?
          </button>
        </div>
      )}
    </div>
  );
};

export default SpotifyLikeLayout;


