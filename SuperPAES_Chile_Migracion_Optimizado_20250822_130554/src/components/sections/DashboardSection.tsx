import React from 'react'

interface LearningMetrics {
  totalExercises: number;
  completedExercises: number;
  averageScore: number;
  studyTime: string;
  streak: number;
}

interface DashboardSectionProps {
  learningMetrics: LearningMetrics;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({ learningMetrics }) => (
  <div className="dashboard-section">
    <h1 className="section-title">Dashboard</h1>
    <div className="dashboard-grid">
      <div className="metric-card">
        <h3>Progreso General</h3>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '67%' }}></div>
        </div>
        <p>67% completado</p>
      </div>
      <div className="metric-card">
        <h3>Ejercicios Completados</h3>
        <p className="metric-value">{learningMetrics.completedExercises}/{learningMetrics.totalExercises}</p>
      </div>
      <div className="metric-card">
        <h3>Promedio</h3>
        <p className="metric-value">{learningMetrics.averageScore}%</p>
      </div>
      <div className="metric-card">
        <h3>Racha de Estudio</h3>
        <p className="metric-value">{learningMetrics.streak} días</p>
      </div>
    </div>
  </div>
)
