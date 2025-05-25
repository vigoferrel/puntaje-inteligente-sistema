
import React, { useState, useEffect } from 'react';
import { UnifiedHeader } from './UnifiedHeader';
import { RealDataDashboard } from './RealDataDashboard';
import { IntelligentDashboard } from '../intelligent-dashboard/IntelligentDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { unifiedAPI } from '@/services/unified-api';

export const UnifiedDashboardContainer: React.FC = () => {
  const { user } = useAuth();
  const [currentTool, setCurrentTool] = useState('dashboard');
  const [activeSubject, setActiveSubject] = useState('COMPETENCIA_LECTORA');
  const [systemMetrics, setSystemMetrics] = useState({
    completedNodes: 0,
    totalNodes: 0,
    todayStudyTime: 0,
    streakDays: 0
  });
  const [totalProgress, setTotalProgress] = useState(0);

  useEffect(() => {
    if (user?.id) {
      loadSystemMetrics();
    }
  }, [user?.id]);

  const loadSystemMetrics = async () => {
    if (!user?.id) return;

    try {
      const data = await unifiedAPI.syncAllUserData(user.id);
      
      if (data) {
        const completed = data.userProgress.filter((p: any) => p.status === 'completed').length;
        const total = data.learningNodes.length;
        const progress = total > 0 ? (completed / total) * 100 : 0;
        
        const todayTime = data.userProgress.reduce((sum: number, p: any) => 
          sum + (p.time_spent_minutes || 0), 0
        ) * 0.1; // Estimación del día
        
        setSystemMetrics({
          completedNodes: completed,
          totalNodes: total,
          todayStudyTime: Math.round(todayTime),
          streakDays: 7 // Calcular desde datos reales
        });
        
        setTotalProgress(progress);
      }
    } catch (error) {
      console.error('Error cargando métricas del sistema:', error);
    }
  };

  const handleToolChange = (tool: string) => {
    setCurrentTool(tool);
  };

  const handleSubjectChange = (subject: string) => {
    setActiveSubject(subject);
  };

  const handleNavigateToTool = (tool: string, context?: any) => {
    setCurrentTool(tool);
    if (context?.subject) {
      setActiveSubject(context.subject);
    }
  };

  const renderCurrentTool = () => {
    switch (currentTool) {
      case 'dashboard':
        return (
          <RealDataDashboard
            activeSubject={activeSubject}
            onNavigateToTool={handleNavigateToTool}
          />
        );
      
      case 'lectoguia':
      case 'diagnostic':
      case 'exercises':
      case 'plan':
        // Por ahora mantener el sistema avanzado para estas herramientas
        return <IntelligentDashboard />;
      
      default:
        return (
          <RealDataDashboard
            activeSubject={activeSubject}
            onNavigateToTool={handleNavigateToTool}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader
        currentTool={currentTool}
        totalProgress={totalProgress}
        activeSubject={activeSubject}
        onToolChange={handleToolChange}
        onSubjectChange={handleSubjectChange}
        systemMetrics={systemMetrics}
      />
      
      <main className="max-w-7xl mx-auto">
        {renderCurrentTool()}
      </main>
    </div>
  );
};
