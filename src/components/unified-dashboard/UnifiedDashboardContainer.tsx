
import React, { useState, useEffect } from 'react';
import { UnifiedHeader } from './UnifiedHeader';
import { RealDataDashboard } from './RealDataDashboard';
import { LectoGuiaUnified } from '@/components/lectoguia/LectoGuiaUnified';
import { DiagnosticSelection } from '@/components/diagnostic/DiagnosticSelection';
import { ExerciseGeneratorCore } from '@/components/exercise-generator/ExerciseGeneratorCore';
import { PlanInteligenteGenerator } from '@/components/plan/PlanInteligenteGenerator';
import { useAuth } from '@/contexts/AuthContext';
import { unifiedAPI } from '@/services/unified-api';
import { useDiagnosticSystem } from '@/hooks/diagnostic/useDiagnosticSystem';

interface UnifiedDashboardContainerProps {
  initialTool?: string | null;
}

// Mock para pausedProgress hasta que se implemente el hook completo
const mockPausedProgress = null;
const clearStoredProgress = () => console.log('Clearing stored progress');

export const UnifiedDashboardContainer: React.FC<UnifiedDashboardContainerProps> = ({ 
  initialTool 
}) => {
  const { user } = useAuth();
  const [currentTool, setCurrentTool] = useState(initialTool || 'dashboard');
  const [activeSubject, setActiveSubject] = useState('COMPETENCIA_LECTORA');
  const [systemMetrics, setSystemMetrics] = useState({
    completedNodes: 0,
    totalNodes: 0,
    todayStudyTime: 0,
    streakDays: 0
  });
  const [totalProgress, setTotalProgress] = useState(0);
  const [toolContext, setToolContext] = useState<any>(null);

  // Hook diagnóstico
  const diagnostic = useDiagnosticSystem();

  // Usar herramienta inicial si se proporciona
  useEffect(() => {
    if (initialTool && initialTool !== currentTool) {
      console.log(`🎯 Configurando herramienta inicial: ${initialTool}`);
      setCurrentTool(initialTool);
    }
  }, [initialTool]);

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
        ) * 0.1;
        
        setSystemMetrics({
          completedNodes: completed,
          totalNodes: total,
          todayStudyTime: Math.round(todayTime),
          streakDays: calculateStreak(data.userProgress)
        });
        
        setTotalProgress(progress);
      }
    } catch (error) {
      console.error('Error cargando métricas del sistema:', error);
    }
  };

  const calculateStreak = (progress: any[]) => {
    const recentActivities = progress
      .filter(p => p.last_activity_at)
      .sort((a, b) => new Date(b.last_activity_at).getTime() - new Date(a.last_activity_at).getTime());
    
    if (recentActivities.length === 0) return 0;
    
    const today = new Date();
    const lastActivity = new Date(recentActivities[0].last_activity_at);
    const diffDays = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    
    return Math.max(0, 7 - diffDays);
  };

  const handleToolChange = (tool: string, context?: any) => {
    console.log(`🔧 Cambiando herramienta: ${tool}`, context);
    setCurrentTool(tool);
    setToolContext(context);
    
    if (context?.subject) {
      setActiveSubject(context.subject);
    }
  };

  const handleSubjectChange = (subject: string) => {
    setActiveSubject(subject);
    setToolContext(prev => ({ ...prev, subject }));
  };

  const handleNavigateToTool = (tool: string, context?: any) => {
    handleToolChange(tool, context);
  };

  const handleDiagnosticStart = () => {
    if (diagnostic.data.diagnosticTests?.length > 0) {
      console.log('Iniciando diagnóstico:', diagnostic.data.diagnosticTests[0]);
    }
  };

  const handleDiagnosticResume = () => {
    if (mockPausedProgress) {
      console.log('Resumiendo diagnóstico');
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
        return (
          <div className="max-w-7xl mx-auto p-6">
            <LectoGuiaUnified 
              initialSubject={activeSubject}
              onSubjectChange={handleSubjectChange}
              onNavigateToTool={handleNavigateToTool}
            />
          </div>
        );
      
      case 'diagnostic':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <DiagnosticSelection
              tests={diagnostic.data.diagnosticTests || []}
              loading={diagnostic.isLoading}
              selectedTestId={null}
              pausedProgress={mockPausedProgress}
              onTestSelect={(testId) => console.log('Test selected:', testId)}
              onStartTest={handleDiagnosticStart}
              onResumeTest={handleDiagnosticResume}
              onDiscardProgress={clearStoredProgress}
            />
          </div>
        );
      
      case 'exercises':
        return (
          <div className="max-w-7xl mx-auto p-6">
            <ExerciseGeneratorCore
              selectedSubject={activeSubject}
              subjects={{
                'COMPETENCIA_LECTORA': {
                  name: 'Competencia Lectora',
                  icon: 'BookOpen',
                  color: 'bg-blue-500',
                  totalNodes: 30,
                  tier1: 14, tier2: 13, tier3: 3
                },
                'MATEMATICA_1': {
                  name: 'Matemática M1',
                  icon: 'Calculator',
                  color: 'bg-green-500',
                  totalNodes: 25,
                  tier1: 10, tier2: 10, tier3: 5
                },
                'MATEMATICA_2': {
                  name: 'Matemática M2',
                  icon: 'Calculator',
                  color: 'bg-purple-500',
                  totalNodes: 22,
                  tier1: 13, tier2: 6, tier3: 3
                },
                'HISTORIA': {
                  name: 'Historia y Ciencias Sociales',
                  icon: 'History',
                  color: 'bg-orange-500',
                  totalNodes: 65,
                  tier1: 19, tier2: 26, tier3: 20
                },
                'CIENCIAS': {
                  name: 'Ciencias',
                  icon: 'FlaskConical',
                  color: 'bg-red-500',
                  totalNodes: 135,
                  tier1: 33, tier2: 53, tier3: 49
                }
              }}
              showSettings={false}
              onGenerate={(config) => console.log('Generando ejercicios:', config)}
              isGenerating={false}
            />
          </div>
        );
      
      case 'plan':
        return (
          <div className="max-w-6xl mx-auto p-6">
            <PlanInteligenteGenerator
              onGeneratePlan={(config) => {
                console.log('Plan generado:', config);
                loadSystemMetrics();
              }}
              isGenerating={false}
            />
          </div>
        );
      
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
      
      <main>
        {renderCurrentTool()}
      </main>
    </div>
  );
};
