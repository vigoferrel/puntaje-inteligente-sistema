
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertCircle, TrendingUp, ChartBar, Brain, Zap, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUnifiedDiagnostic } from '@/hooks/diagnostic/use-unified-diagnostic';
import { TPAESPrueba } from '@/types/system-types';

// Importar componentes específicos
import { InitialAssessmentPanel } from './InitialAssessmentPanel';
import { IntelligenceOverview } from './IntelligenceOverview';
import { ProgressTrackerPanel } from './ProgressTrackerPanel';
import { SkillAnalysisPanel } from './SkillAnalysisPanel';
import { PersonalizedStrategiesPanel } from './PersonalizedStrategiesPanel';
import { PredictiveScoringPanel } from './PredictiveScoringPanel';

export const DiagnosticIntelligenceCenter: React.FC = () => {
  const {
    data,
    isLoading,
    tests,
    skills,
    baselineScores,
    currentScores,
    progressTrends,
    skillAnalysis,
    personalizedStrategies,
    predictedScores,
    needsInitialAssessment,
    lastAssessmentDate,
    nextRecommendedAssessment,
    performInitialAssessment,
    scheduleProgressAssessment,
    generatePersonalizedExercises
  } = useUnifiedDiagnostic();

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPrueba, setSelectedPrueba] = useState<TPAESPrueba>('COMPETENCIA_LECTORA');

  // Calcular métricas para el banner de estado
  const overallProgress = currentScores && baselineScores 
    ? Object.keys(currentScores).reduce((total, prueba) => {
        const improvement = currentScores[prueba as TPAESPrueba] - baselineScores[prueba as TPAESPrueba];
        return total + improvement;
      }, 0) / Object.keys(currentScores).length
    : 0;

  const weakestArea = currentScores 
    ? Object.entries(currentScores).reduce((min, [prueba, score]) => 
        score < min.score ? { prueba: prueba as TPAESPrueba, score } : min, 
        { prueba: 'COMPETENCIA_LECTORA' as TPAESPrueba, score: 850 }
      )
    : null;

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-xl font-medium">Analizando tu progreso...</div>
          <div className="text-blue-600 mt-2">Procesando datos de diagnóstico</div>
        </div>
      </div>
    );
  }

  if (needsInitialAssessment) {
    return <InitialAssessmentPanel onComplete={performInitialAssessment} />;
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </Button>
      </div>

      {/* System Status Banner */}
      {currentScores && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <TrendingUp className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            <div className="flex items-center justify-between">
              <span>
                Sistema de Inteligencia Diagnóstica activo: Progreso general +{Math.round(overallProgress)}%
              </span>
              <span className="text-sm">
                Última evaluación: {lastAssessmentDate ? new Date(lastAssessmentDate).toLocaleDateString('es') : 'N/A'}
              </span>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs Principales */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <ChartBar className="w-4 h-4" />
            <span>Vista General</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Progreso</span>
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>Habilidades</span>
          </TabsTrigger>
          <TabsTrigger value="strategies" className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Estrategias</span>
          </TabsTrigger>
          <TabsTrigger value="prediction" className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Predicción</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <IntelligenceOverview
            tests={tests}
            baselineScores={baselineScores}
            currentScores={currentScores}
            predictedScores={predictedScores}
            nextRecommendedAssessment={nextRecommendedAssessment}
            onScheduleAssessment={scheduleProgressAssessment}
            onGenerateExercises={generatePersonalizedExercises}
          />
        </TabsContent>

        <TabsContent value="progress">
          <ProgressTrackerPanel 
            baselineScores={baselineScores}
            currentScores={currentScores}
            progressTrends={progressTrends}
            tests={tests}
          />
        </TabsContent>

        <TabsContent value="skills">
          <SkillAnalysisPanel 
            skillAnalysis={skillAnalysis}
            selectedPrueba={selectedPrueba}
            onPruebaChange={setSelectedPrueba}
            tests={tests}
            skills={skills}
          />
        </TabsContent>

        <TabsContent value="strategies">
          <PersonalizedStrategiesPanel 
            strategies={personalizedStrategies}
            weakestArea={weakestArea}
            skillAnalysis={skillAnalysis}
            onGenerateExercises={generatePersonalizedExercises}
          />
        </TabsContent>

        <TabsContent value="prediction">
          <PredictiveScoringPanel 
            predictedScores={predictedScores}
            currentScores={currentScores}
            progressTrends={progressTrends}
            tests={tests}
          />
        </TabsContent>
      </Tabs>

      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded text-xs">
          <strong>Debug Info:</strong>
          <br />
          Tests loaded: {tests.length}
          <br />
          Skills loaded: {skills.length}
          <br />
          Baseline scores: {baselineScores ? 'Yes' : 'No'}
          <br />
          Current scores: {currentScores ? 'Yes' : 'No'}
          <br />
          Progress trends: {progressTrends.length}
        </div>
      )}
    </div>
  );
};
