import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePAESContext } from '@/contexts/PAESContext';
import { PAESGlobalMetrics } from '@/components/paes-unified/PAESGlobalMetrics';
import { PAESTestNavigation } from '@/components/paes-unified/PAESTestNavigation';
import { PAESCompetenciaLectoraIntegration } from '@/components/paes-unified/PAESCompetenciaLectoraIntegration';
import { PAESMatematicaM1Integration } from '@/components/paes-unified/PAESMatematicaM1Integration';
import { PAESCienciasIntegration } from '@/components/paes-ciencias/PAESCienciasIntegration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  RefreshCw, 
  Target, 
  TrendingUp, 
  Clock, 
  Award,
  BarChart3,
  PlayCircle,
  CheckCircle,
  AlertTriangle,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { RealPAESDataService } from '@/services/dashboard/RealPAESDataService';

type PAESViewMode = 'unified' | 'evaluation' | 'universe';

interface PAESSpecializedDashboardProps {
  initialMode?: PAESViewMode;
  className?: string;
}

export const PAESSpecializedDashboard: React.FC<PAESSpecializedDashboardProps> = ({ 
  initialMode = 'unified',
  className 
}) => {
  const [currentMode, setCurrentMode] = useState<PAESViewMode>(initialMode);
  const [activeTestView, setActiveTestView] = useState<string>('global');
  const [evaluationStats, setEvaluationStats] = useState<any>(null);
  const [subjectScores, setSubjectScores] = useState<any[]>([]);
  const [upcomingTests, setUpcomingTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const {
    loading: paesLoading,
    testPerformances,
    unifiedMetrics,
    comparativeAnalysis,
    refreshData
  } = usePAESContext();

  // Cargar datos reales
  const loadRealData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const [stats, scores, tests] = await Promise.all([
        RealPAESDataService.getEvaluationStats(user.id),
        RealPAESDataService.getSubjectScores(user.id),
        RealPAESDataService.getUpcomingTests(user.id)
      ]);

      setEvaluationStats(stats);
      setSubjectScores(scores);
      setUpcomingTests(tests);
    } catch (error) {
      console.error('Error loading PAES data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRealData();
  }, [user?.id]);

  const handleTestSelect = (testId: string) => {
    setActiveTestView(testId);
  };

  const handleModeSwitch = (mode: PAESViewMode) => {
    setCurrentMode(mode);
  };

  const handleRefresh = () => {
    refreshData();
    loadRealData();
  };

  // Unified mode content (from PAESUnifiedDashboard)
  const renderUnifiedMode = () => {
    const renderTestContent = () => {
      if (activeTestView === 'global' || activeTestView === 'comparative') {
        return (
          <div className="space-y-6">
            {unifiedMetrics && (
              <PAESGlobalMetrics
                metrics={unifiedMetrics}
                testPerformances={testPerformances}
              />
            )}
            
            {comparativeAnalysis && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-400" />
                    Análisis Comparativo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-white mb-3">Gaps Críticos de Habilidades</h4>
                      <div className="space-y-2">
                        {comparativeAnalysis.skillGaps.slice(0, 5).map((gap, index) => (
                          <div 
                            key={gap.skill}
                            className={`p-3 rounded-lg border ${
                              gap.severity === 'HIGH' ? 'bg-red-600/10 border-red-600/30' :
                              gap.severity === 'MEDIUM' ? 'bg-yellow-600/10 border-yellow-600/30' :
                              'bg-blue-600/10 border-blue-600/30'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-white">{gap.skill}</span>
                              <span className="text-sm text-gray-400">
                                {gap.tests_affected.length} pruebas afectadas
                              </span>
                            </div>
                            <div className="text-sm text-gray-400 mt-1">
                              {gap.recommended_hours}h de estudio recomendadas
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );
      }

      const activeTest = testPerformances.find(test => test.testId === activeTestView);
      if (!activeTest) return null;

      if (activeTest.testCode.includes('COMPETENCIA_LECTORA')) {
        return <PAESCompetenciaLectoraIntegration />;
      }
      
      if (activeTest.testCode.includes('MATEMATICA_1')) {
        return <PAESMatematicaM1Integration />;
      }
      
      if (activeTest.testCode.includes('CIENCIAS')) {
        return <PAESCienciasIntegration />;
      }

      return (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-8 text-center">
            <div className="text-gray-400">
              Vista específica para {activeTest.testName} en desarrollo
            </div>
          </CardContent>
        </Card>
      );
    };

    return (
      <div className="space-y-6">
        <PAESTestNavigation
          testPerformances={testPerformances}
          activeTest={activeTestView}
          onTestSelect={handleTestSelect}
        />

        <motion.div
          key={activeTestView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTestContent()}
        </motion.div>
      </div>
    );
  };

  // Evaluation mode content with real data
  const renderEvaluationMode = () => (
    <div className="space-y-6">
      {/* Overview Cards with real data */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-white">Puntaje Actual</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {evaluationStats?.lastScore || 450}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-green-500">
                +{evaluationStats?.improvement || 0} vs inicio
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-white">Meta</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {evaluationStats?.targetScore || 700}
            </div>
            <div className="text-sm text-gray-400">
              {((evaluationStats?.targetScore || 700) - (evaluationStats?.lastScore || 450))} puntos restantes
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-white">Próximo Test</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {evaluationStats?.nextTest || 'Sin programar'}
            </div>
            <div className="text-sm text-gray-400">
              {upcomingTests.length > 0 ? upcomingTests[0].type : 'No programado'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-white">Preparación</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {evaluationStats?.readinessLevel || 0}%
            </div>
            <Progress value={evaluationStats?.readinessLevel || 0} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Subject Progress with real data */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Progreso por Materia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {subjectScores.map((subject) => (
            <div key={subject.subject} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">{subject.subject}</span>
                <span className="text-cyan-400 font-bold">
                  {subject.current}/{subject.target}
                </span>
              </div>
              <Progress value={subject.progress} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Upcoming Tests with real data */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Evaluaciones Programadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingTests.length > 0 ? upcomingTests.map((test, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <div className="text-white font-medium">{test.type}</div>
                  <div className="text-sm text-gray-400">{test.date} • {test.duration}</div>
                </div>
                <Badge variant={test.status === 'scheduled' ? 'default' : 'outline'}>
                  {test.status === 'scheduled' ? <CheckCircle className="w-3 h-3 mr-1" /> : 
                   test.status === 'available' ? <PlayCircle className="w-3 h-3 mr-1" /> :
                   <AlertTriangle className="w-3 h-3 mr-1" />}
                  {test.status === 'scheduled' ? 'Programado' :
                   test.status === 'available' ? 'Disponible' : 'Pendiente'}
                </Badge>
              </div>
            )) : (
              <div className="text-center text-gray-400 py-4">
                No hay evaluaciones programadas
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Universe mode content (simplified for now)
  const renderUniverseMode = () => (
    <div className="space-y-6">
      <Card className="bg-white/10 border-white/20">
        <CardContent className="p-8 text-center">
          <div className="text-white">
            Modo Universo PAES - Visualización 3D en desarrollo
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (currentMode) {
      case 'unified':
        return renderUnifiedMode();
      case 'evaluation':
        return renderEvaluationMode();
      case 'universe':
        return renderUniverseMode();
      default:
        return renderUnifiedMode();
    }
  };

  if (loading || paesLoading) {
    return (
      <div className={`space-y-6 ${className || ''}`}>
        <div className="animate-pulse space-y-6">
          <div className="h-48 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`space-y-6 ${className || ''}`}
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard PAES Especializado</h1>
          <p className="text-gray-400">Análisis integral de tu preparación PAES</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Mode Selector */}
          <div className="flex gap-2">
            <Button
              variant={currentMode === 'unified' ? 'default' : 'outline'}
              onClick={() => handleModeSwitch('unified')}
              size="sm"
            >
              Unificado
            </Button>
            <Button
              variant={currentMode === 'evaluation' ? 'default' : 'outline'}
              onClick={() => handleModeSwitch('evaluation')}
              size="sm"
            >
              Evaluación
            </Button>
            <Button
              variant={currentMode === 'universe' ? 'default' : 'outline'}
              onClick={() => handleModeSwitch('universe')}
              size="sm"
            >
              Universo
            </Button>
          </div>

          <Button
            onClick={handleRefresh}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
        </div>
      </div>

      <motion.div
        key={currentMode}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderContent()}
      </motion.div>
    </motion.div>
  );
};
