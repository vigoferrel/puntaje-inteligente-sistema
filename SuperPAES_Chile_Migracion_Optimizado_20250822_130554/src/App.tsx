import React, { useState, useEffect } from 'react'

// Componentes
import { NotificationSystem } from './components/NotificationSystem'
import CalendarCenter from './components/CalendarCenter'
// Header profesional eliminado - usando header integrado
import { AccessibilityProvider } from './components/AccessibilityProvider'
import { ExerciseSystem } from './components/ExerciseSystem'
import { Sidebar } from './components/layout/Sidebar'
import { DashboardSection } from './components/sections/DashboardSection'
import IntegratedSystemDashboard from './components/IntegratedSystemDashboard';
import DiagnosticoSection from './components/sections/DiagnosticoSection';
import PAESNodesDashboard from './components/PAESNodesDashboard';
import { NeuralPredictionDashboard } from './components/dashboards/NeuralPredictionDashboard';
import UnifiedNodesDashboard from './components/UnifiedNodesDashboard';

// Estilos
import './App.css'
// CSS Global ya incluye todos los estilos de accesibilidad
// CSS Global ya incluye los estilos del header profesional
// CSS Global ya incluye todos los estilos específicos

// Datos oficiales PAES
import { PAES_EXERCISES } from './data/paes-exercises'
import { NODOS_COMPETENCIA_LECTORA, NODOS_MATEMATICA_M1, BLOOM_LEVELS } from './data/paesStructure'
import { officialData } from './data/officialData'
import type { PAESGoal, SpotifyPlaylist, AgentStatus, LearningMetrics, UserProfile, Notification } from './data/officialData'

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

function App() {
  // ========================================
  // ESTADO PRINCIPAL
  // ========================================
  
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [notifications, setNotifications] = useState<Notification[]>(officialData.notifications)

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }
  
  // Filtros de ejercicios
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedBloomLevel, setSelectedBloomLevel] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')

  // ========================================
  // DATOS DE LA APLICACIÓN
  // ========================================
  
  const userProfile: UserProfile = officialData.userProfile
  const paesGoals: PAESGoal[] = officialData.paesGoals
  const spotifyPlaylists: SpotifyPlaylist[] = officialData.spotifyPlaylists
  const agents: AgentStatus[] = officialData.agents
  const learningMetrics: LearningMetrics = officialData.learningMetrics

  // ========================================
  // EFECTOS
  // ========================================
  
  useEffect(() => {
    // Aplicar modo oscuro por defecto
    document.documentElement.classList.add('dark-mode')
    document.documentElement.style.setProperty('--color-scheme', 'dark')
  }, [])

  // ========================================
  // MANEJADORES DE EVENTOS
  // ========================================
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleExerciseComplete = (score: number, totalQuestions: number) => {
    console.log(`Sesión completada: ${score} puntos de ${totalQuestions} preguntas`)
    // Aquí se puede integrar con el sistema de scoring
  }

  // ========================================
  // RENDERIZADO DE CONTENIDO
  // ========================================
  
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardSection learningMetrics={learningMetrics} />
      case 'goals':
        return <GoalsContent paesGoals={paesGoals} />
      case 'playlists':
        return <PlaylistsContent spotifyPlaylists={spotifyPlaylists} />
      case 'agents':
        return <AgentsContent agents={agents} />
      case 'analytics':
        return <AnalyticsContent learningMetrics={learningMetrics} />
      case 'calendar':
        return <CalendarContent />
      case 'exercises':
        return <ExercisesContent 
          selectedSubject={selectedSubject}
          selectedBloomLevel={selectedBloomLevel}
          selectedDifficulty={selectedDifficulty}
          onSubjectChange={setSelectedSubject}
          onBloomLevelChange={setSelectedBloomLevel}
          onDifficultyChange={setSelectedDifficulty}
          onComplete={handleExerciseComplete}
        />
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
        return <DashboardSection learningMetrics={learningMetrics} />
    }
  }

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

        {/* Sidebar */}
        <Sidebar 
          sidebarOpen={sidebarOpen}
          activeTab={activeTab}
          userProfile={userProfile}
          onTabChange={handleTabChange}
          onToggle={handleSidebarToggle}
        />

        {/* Main Content */}
        <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`} id="main-content" role="main">
          {/* Header integrado en el layout principal */}

          {/* Content Area */}
          <div className="content-area">
            {renderContent()}
          </div>
        </main>

        {/* Notification System */}
        <NotificationSystem notifications={notifications} onDismiss={handleDismissNotification} />
      </div>
    </AccessibilityProvider>
  )
}

// ========================================
// COMPONENTES INTERNOS TEMPORALES
// ========================================

// Goals Content
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
)

// Playlists Content
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
)

// Agents Content
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
)

// Analytics Content
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
)

// Calendar Content
const CalendarContent: React.FC = () => (
  <div className="calendar-section">
    <CalendarCenter />
  </div>
)

// Exercises Content
const ExercisesContent: React.FC<{
  selectedSubject: string;
  selectedBloomLevel: string;
  selectedDifficulty: string;
  onSubjectChange: (subject: string) => void;
  onBloomLevelChange: (level: string) => void;
  onDifficultyChange: (difficulty: string) => void;
  onComplete: (score: number, totalQuestions: number) => void;
}> = ({ 
  selectedSubject, 
  selectedBloomLevel, 
  selectedDifficulty, 
  onSubjectChange, 
  onBloomLevelChange, 
  onDifficultyChange, 
  onComplete 
}) => (
  <div className="exercises-section">
    <h1 className="section-title">Ejercicios PAES</h1>
    <div className="exercise-controls">
      <div className="exercise-filters">
        <select 
          className="filter-select"
          onChange={(e) => onSubjectChange(e.target.value)}
          value={selectedSubject}
        >
          <option value="">Todas las materias</option>
          <option value="Competencia Lectora">Competencia Lectora</option>
          <option value="Matemática M1">Matemática M1</option>
          <option value="Matemática M2">Matemática M2</option>
          <option value="Ciencias">Ciencias</option>
          <option value="Historia">Historia</option>
        </select>
        <select 
          className="filter-select"
          onChange={(e) => onBloomLevelChange(e.target.value)}
          value={selectedBloomLevel}
        >
          <option value="">Todos los niveles Bloom</option>
          <option value="Recordar">Recordar</option>
          <option value="Comprender">Comprender</option>
          <option value="Aplicar">Aplicar</option>
          <option value="Analizar">Analizar</option>
          <option value="Evaluar">Evaluar</option>
          <option value="Crear">Crear</option>
        </select>
        <select 
          className="filter-select"
          onChange={(e) => onDifficultyChange(e.target.value)}
          value={selectedDifficulty}
        >
          <option value="">Todas las dificultades</option>
          <option value="Básico">Básico</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzado">Avanzado</option>
          <option value="Excelencia">Excelencia</option>
        </select>
      </div>
    </div>
    <ExerciseSystem
      subject={selectedSubject || undefined}
      bloomLevel={selectedBloomLevel || undefined}
      difficulty={selectedDifficulty || undefined}
      onComplete={onComplete}
    />
  </div>
)

export default App
