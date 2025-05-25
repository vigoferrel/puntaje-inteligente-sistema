
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  BookOpen,
  Zap,
  ChartBar,
  Calendar,
  Award,
  Users
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePAESData } from '@/hooks/use-paes-data';
import { useDiagnosticIntelligence } from '@/hooks/diagnostic/use-diagnostic-intelligence';
import { InitialAssessmentPanel } from './InitialAssessmentPanel';
import { ProgressTrackerPanel } from './ProgressTrackerPanel';
import { SkillAnalysisPanel } from './SkillAnalysisPanel';
import { PersonalizedStrategiesPanel } from './PersonalizedStrategiesPanel';
import { PredictiveScoringPanel } from './PredictiveScoringPanel';
import { TPAESPrueba, getPruebaDisplayName } from '@/types/system-types';

export const DiagnosticIntelligenceCenter: React.FC = () => {
  const { user } = useAuth();
  const { tests, skills } = usePAESData();
  const {
    baselineScores,
    currentScores,
    progressTrends,
    skillAnalysis,
    personalizedStrategies,
    predictedScores,
    isLoading,
    needsInitialAssessment,
    lastAssessmentDate,
    nextRecommendedAssessment,
    performInitialAssessment,
    scheduleProgressAssessment,
    generatePersonalizedExercises
  } = useDiagnosticIntelligence(user?.id);

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPrueba, setSelectedPrueba] = useState<TPAESPrueba>('COMPETENCIA_LECTORA');

  // Calcular métricas principales
  const overallProgress = currentScores && baselineScores 
    ? Object.keys(currentScores).reduce((total, prueba) => {
        const improvement = currentScores[prueba as TPAESPrueba] - baselineScores[prueba as TPAESPrueba];
        return total + improvement;
      }, 0) / Object.keys(currentScores).length
    : 0;

  const strongestArea = currentScores 
    ? Object.entries(currentScores).reduce((max, [prueba, score]) => 
        score > max.score ? { prueba: prueba as TPAESPrueba, score } : max, 
        { prueba: 'COMPETENCIA_LECTORA' as TPAESPrueba, score: 0 }
      )
    : null;

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
      {/* Header Principal */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-lg text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Centro de Inteligencia Diagnóstica</h1>
            <p className="text-blue-100">
              Sistema integral de evaluación, seguimiento y estrategias personalizadas
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{Math.round(overallProgress)}%</div>
            <div className="text-sm text-blue-200">Progreso General</div>
          </div>
        </div>
      </motion.div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-700">+{Math.round(overallProgress)}</div>
                <div className="text-sm text-green-600">Mejora Promedio</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-blue-700">Área Más Fuerte</div>
                <div className="text-xs text-blue-600">
                  {strongestArea ? getPruebaDisplayName(strongestArea.prueba) : 'N/A'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <div>
                <div className="text-sm font-medium text-orange-700">Requiere Atención</div>
                <div className="text-xs text-orange-600">
                  {weakestArea ? getPruebaDisplayName(weakestArea.prueba) : 'N/A'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-sm font-medium text-purple-700">Puntaje Predicho</div>
                <div className="text-xs text-purple-600">
                  {predictedScores ? Math.round(Object.values(predictedScores).reduce((a, b) => a + b, 0) / Object.values(predictedScores).length) : 'Calculando...'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resumen de Puntajes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ChartBar className="w-5 h-5" />
                  <span>Puntajes por Prueba</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tests.map((test) => {
                  const prueba = test.code as TPAESPrueba;
                  const baseline = baselineScores?.[prueba] || 0;
                  const current = currentScores?.[prueba] || 0;
                  const improvement = current - baseline;
                  
                  return (
                    <div key={test.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{getPruebaDisplayName(prueba)}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant={improvement > 0 ? "default" : "secondary"}>
                            {improvement > 0 ? `+${improvement}` : improvement}
                          </Badge>
                          <span className="font-bold">{current}</span>
                        </div>
                      </div>
                      <Progress value={(current / 850) * 100} className="h-2" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Próximas Evaluaciones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Evaluaciones Programadas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-600 mb-2">Próxima Evaluación</div>
                  <div className="font-bold text-blue-800">
                    {nextRecommendedAssessment ? 
                      new Date(nextRecommendedAssessment).toLocaleDateString('es') : 
                      'Por programar'
                    }
                  </div>
                </div>
                
                <Button 
                  onClick={scheduleProgressAssessment}
                  className="w-full"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Realizar Evaluación Ahora
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => generatePersonalizedExercises(selectedPrueba)}
                  className="w-full"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Ejercicios Personalizados
                </Button>
              </CardContent>
            </Card>
          </div>
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
    </div>
  );
};
