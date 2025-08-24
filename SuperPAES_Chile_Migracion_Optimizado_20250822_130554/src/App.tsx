// 🔥 APP PRINCIPAL - CONECTADA A SUPABASE REAL
// Sistema SuperPAES con backend real y datos reales

import React, { useState, useEffect } from 'react';
import RealSupabaseDashboard from './components/RealSupabaseDashboard';
import RealExerciseSystem from './components/RealExerciseSystem';
import { testRealConnection } from './lib/supabase';

// Componentes existentes
import { NotificationSystem } from './components/NotificationSystem';
import CalendarCenter from './components/CalendarCenter';
import { AccessibilityProvider } from './components/AccessibilityProvider';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardSection } from './components/sections/DashboardSection';
import IntegratedSystemDashboard from './components/IntegratedSystemDashboard';
import DiagnosticoSection from './components/sections/DiagnosticoSection';
import PAESNodesDashboard from './components/PAESNodesDashboard';
import { NeuralPredictionDashboard } from './components/dashboards/NeuralPredictionDashboard';
import UnifiedNodesDashboard from './components/UnifiedNodesDashboard';

// Estilos
import './App.css';

// Datos (mantener como fallback)
import { officialData } from './data/officialData';
import type { PAESGoal, SpotifyPlaylist, AgentStatus, LearningMetrics, UserProfile, Notification } from './data/officialData';

function App() {
  // ========================================
  // ESTADO PRINCIPAL
  // ========================================
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('real-connection');
  const [notifications, setNotifications] = useState<Notification[]>(officialData.notifications);
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('testing');

  // ========================================
  // TEST DE CONEXIÓN AUTOMÁTICO
  // ========================================
  
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await testRealConnection();
        setSupabaseConnected(result.success);
        setConnectionStatus(result.success ? 'connected' : 'failed');
        
        if (result.success) {
          console.log('🚀 SuperPAES conectado exitosamente a Supabase');
          // Agregar notificación de conexión exitosa
          setNotifications(prev => [{
            id: 'supabase-connected',
            type: 'success',
            title: '🚀 Conexión Establecida',
            message: 'SuperPAES conectado exitosamente a Supabase',
            timestamp: new Date().toISOString()
          }, ...prev]);
        } else {
          console.error('💥 Error conectando a Supabase:', result.error);
          // Agregar notificación de error
          setNotifications(prev => [{
            id: 'supabase-error',
            type: 'error',
            title: '⚠️ Error de Conexión',
            message: 'No se pudo conectar a Supabase. Usando datos locales.',
            timestamp: new Date().toISOString()
          }, ...prev]);
        }
      } catch (error) {
        console.error('💥 Error crítico:', error);
        setConnectionStatus('failed');
      }
    };

    checkConnection();
  }, []);

  // ========================================
  // DATOS DE LA APLICACIÓN (fallback)
  // ========================================
  
  const userProfile: UserProfile = officialData.userProfile;
  const paesGoals: PAESGoal[] = officialData.paesGoals;
  const spotifyPlaylists: SpotifyPlaylist[] = officialData.spotifyPlaylists;
  const agents: AgentStatus[] = officialData.agents;
  const learningMetrics: LearningMetrics = officialData.learningMetrics;

  // ========================================
  // MANEJADORES DE EVENTOS
  // ========================================
  
  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleExerciseComplete = (score: number, totalQuestions: number) => {
    console.log(`🎉 Sesión completada: ${score}% de acierto en ${totalQuestions} preguntas`);
    
    // Agregar notificación de logro
    setNotifications(prev => [{
      id: `exercise-complete-${Date.now()}`,
      type: 'success',
      title: '🎉 ¡Ejercicio Completado!',
      message: `Obtuviste ${score}% de acierto. ¡Excelente trabajo!`,
      timestamp: new Date().toISOString()
    }, ...prev]);
  };

  // ========================================
  // SIDEBAR MEJORADO CON OPCIONES REALES
  // ========================================
  
  const enhancedUserProfile = {
    ...userProfile,
    connectionStatus: supabaseConnected ? 'connected' : 'offline',
    lastSync: new Date().toISOString()
  };

  // ========================================
  // RENDERIZADO DE CONTENIDO
  // ========================================
  
  const renderContent = () => {
    switch (activeTab) {
      case 'real-connection':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                🚀 SuperPAES Chile - Conexión Real Supabase
              </h1>
              <p className="text-gray-600 mb-4">
                Sistema conectado directamente al backend de Supabase con datos reales.
                Estado de conexión: <span className={`font-semibold ${
                  supabaseConnected ? 'text-green-600' : 'text-red-600'
                }`}>
                  {supabaseConnected ? '✅ Conectado' : '❌ Desconectado'}
                </span>
              </p>
            </div>
            <RealSupabaseDashboard />
          </div>
        );
      
      case 'real-exercises':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                📚 Ejercicios PAES Reales
              </h1>
              <p className="text-gray-600 mb-4">
                Ejercicios cargados directamente desde la base de datos Supabase.
              </p>
            </div>
            <RealExerciseSystem 
              userId="user-real-001"
              onComplete={handleExerciseComplete}
            />
          </div>
        );
      
      case 'dashboard':
        return <DashboardSection learningMetrics={learningMetrics} />;
      case 'goals':
        return <GoalsContent paesGoals={paesGoals} />;
      case 'playlists':
        return <PlaylistsContent spotifyPlaylists={spotifyPlaylists} />;
      case 'agents':
        return <AgentsContent agents={agents} />;
      case 'analytics':
        return <AnalyticsContent learningMetrics={learningMetrics} />;
      case 'calendar':
        return <CalendarContent />;
      case 'integrated-system':
        return <IntegratedSystemDashboard />;
      case 'diagnostico':
        return <DiagnosticoSection />;
      case 'paes-nodes':
        return <PAESNodesDashboard />;
      case 'neural-predictions':
        return <NeuralPredictionDashboard />;
      case 'unified-nodes':
        return <UnifiedNodesDashboard />;
      default:
        return <DashboardSection learningMetrics={learningMetrics} />;
    }
  };

  // ========================================
  // SIDEBAR CON OPCIONES REALES
  // ========================================
  
  const sidebarProps = {
    sidebarOpen,
    activeTab,
    userProfile: enhancedUserProfile,
    onTabChange: handleTabChange,
    onToggle: handleSidebarToggle,
    // Agregar opciones del sistema real
    extraOptions: [
      {
        id: 'real-connection',
        label: '🔌 Conexión Real',
        description: 'Dashboard de Supabase',
        badge: supabaseConnected ? 'Conectado' : 'Offline'
      },
      {
        id: 'real-exercises',
        label: '📚 Ejercicios Reales',
        description: 'PAES desde Supabase',
        badge: 'Nuevo'
      }
    ]
  };

  // ========================================
  // RENDERIZADO PRINCIPAL
  // ========================================
  
  return (
    <AccessibilityProvider>
      <div className="app dark-mode">
        {/* Skip links para accesibilidad */}
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>
        <a href="#navigation" className="skip-link">
          Saltar a la navegación
        </a>

        {/* Banner de Estado de Conexión */}
        <div className={`w-full py-2 px-4 text-center text-sm font-medium ${
          supabaseConnected 
            ? 'bg-green-600 text-white' 
            : 'bg-red-600 text-white'
        }`}>
          {supabaseConnected 
            ? '🚀 SuperPAES Chile - Conectado a Supabase' 
            : '⚠️ SuperPAES Chile - Sin conexión a Supabase (usando datos locales)'
          }
        </div>

        {/* Sidebar Mejorado */}
        <Sidebar {...sidebarProps} />

        {/* Main Content */}
        <main 
          className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`} 
          id="main-content" 
          role="main"
        >
          {/* Content Area */}
          <div className="content-area">
            {renderContent()}
          </div>
        </main>

        {/* Notification System */}
        <NotificationSystem 
          notifications={notifications} 
          onDismiss={handleDismissNotification} 
        />
      </div>
    </AccessibilityProvider>
  );
}

// ========================================
// COMPONENTES INTERNOS (mantenidos como fallback)
// ========================================

const GoalsContent: React.FC<{ paesGoals: PAESGoal[] }> = ({ paesGoals }) => (
  <div className="goals-section">
    <h1 className="section-title">Metas PAES</h1>
    <div className="goals-grid">
      {paesGoals.map((goal, index) => (
        <div key={index} className="goal-card">
          <h3>{goal.subject}</h3>
          <div className="goal-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${goal.progress}%` }}></div>
            </div>
            <p>{goal.currentScore} / {goal.targetScore} puntos</p>
          </div>
          <span className={`status-indicator status-${goal.status}`}>
            {goal.status === 'on-track' ? 'En camino' : goal.status === 'ahead' ? 'Adelantado' : 'Atrasado'}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const PlaylistsContent: React.FC<{ spotifyPlaylists: SpotifyPlaylist[] }> = ({ spotifyPlaylists }) => (
  <div className="playlists-section">
    <h1 className="section-title">Playlists Neural</h1>
    <div className="playlists-grid">
      {spotifyPlaylists.map((playlist) => (
        <div key={playlist.id} className="playlist-card">
          <h3>{playlist.name}</h3>
          <p className="playlist-subject">{playlist.subject}</p>
          <p className="playlist-duration">{playlist.duration}</p>
          <div className="playlist-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${playlist.progress}%` }}></div>
            </div>
            <p>{playlist.progress}% completado</p>
          </div>
          <span className={`status-indicator status-${playlist.status}`}>
            {playlist.status === 'active' ? 'Activo' : playlist.status === 'completed' ? 'Completado' : 'Pendiente'}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const AgentsContent: React.FC<{ agents: AgentStatus[] }> = ({ agents }) => (
  <div className="agents-section">
    <h1 className="section-title">Agentes IA</h1>
    <div className="agents-grid">
      {agents.map((agent, index) => (
        <div key={index} className="agent-card">
          <div className="agent-header">
            <h3>{agent.name}</h3>
            <span className={`status-indicator status-${agent.status}`}>
              {agent.status === 'online' ? 'En línea' : agent.status === 'busy' ? 'Ocupado' : 'Desconectado'}
            </span>
          </div>
          <p className="agent-specialty">{agent.specialty}</p>
          <p className="agent-activity">{agent.lastActivity}</p>
        </div>
      ))}
    </div>
  </div>
);

const AnalyticsContent: React.FC<{ learningMetrics: LearningMetrics }> = ({ learningMetrics }) => (
  <div className="analytics-section">
    <h1 className="section-title">Analytics</h1>
    <div className="analytics-grid">
      <div className="analytics-card">
        <h3>Rendimiento por Materia</h3>
        <div className="chart-placeholder">
          <div className="w-12 h-12 text-blue-600">📊</div>
          <p>Gráfico de rendimiento</p>
        </div>
      </div>
      <div className="analytics-card">
        <h3>Tiempo de Estudio</h3>
        <p className="metric-value">{learningMetrics.studyTime}</p>
        <p>Hoy</p>
      </div>
      <div className="analytics-card">
        <h3>Eficiencia</h3>
        <p className="metric-value">92%</p>
        <p>Basado en ejercicios completados</p>
      </div>
    </div>
  </div>
);

const CalendarContent: React.FC = () => (
  <div className="calendar-section">
    <CalendarCenter />
  </div>
);

export default App;
