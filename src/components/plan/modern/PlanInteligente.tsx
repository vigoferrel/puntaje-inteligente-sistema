
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, TrendingUp, Zap, BarChart3, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { usePAESIntelligence } from "@/hooks/use-paes-intelligence";
import { PAESTestSelector } from "@/components/plan/intelligent/PAESTestSelector";
import { GoalSelector } from "@/components/plan/intelligent/GoalSelector";
import { TPAESPrueba } from "@/types/system-types";

interface PlanInteligenteProps {
  profile: any;
  nodeProgress: any;
  onCreatePlan: () => void;
}

export const PlanInteligente = ({ 
  profile, 
  nodeProgress, 
  onCreatePlan 
}: PlanInteligenteProps) => {
  const {
    paesTests,
    recommendations,
    loading,
    selectedGoal,
    setSelectedGoal,
    generateAdaptivePlan,
    weakestSkills
  } = usePAESIntelligence();

  const [selectedTests, setSelectedTests] = useState<TPAESPrueba[]>([]);
  const [currentStep, setCurrentStep] = useState<'goal' | 'tests' | 'recommendations' | 'generate'>('goal');
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [generatingPlan, setGeneratingPlan] = useState(false);

  const handleTestToggle = (testCode: TPAESPrueba) => {
    setSelectedTests(prev => 
      prev.includes(testCode) 
        ? prev.filter(t => t !== testCode)
        : [...prev, testCode]
    );
  };

  const handleGoalSelect = (goalId: string) => {
    setSelectedGoal(goalId);
    
    // Auto-seleccionar tests basado en la meta
    if (goalId === 'comprehensive') {
      setSelectedTests(['COMPETENCIA_LECTORA', 'MATEMATICA_1', 'HISTORIA', 'CIENCIAS']);
    } else if (goalId === 'reading_focus') {
      setSelectedTests(['COMPETENCIA_LECTORA']);
    } else if (goalId === 'math_mastery') {
      setSelectedTests(['MATEMATICA_1', 'MATEMATICA_2']);
    } else if (goalId === 'sciences_boost') {
      setSelectedTests(['CIENCIAS']);
    } else if (goalId === 'history_social') {
      setSelectedTests(['HISTORIA']);
    } else if (goalId === 'weakness_targeted') {
      // Seleccionar tests basado en debilidades
      const weaknessTests = paesTests
        .filter(test => test.weaknessLevel === 'high' || test.weaknessLevel === 'medium')
        .map(test => test.code);
      setSelectedTests(weaknessTests.slice(0, 3));
    }
    
    setCurrentStep('tests');
  };

  const handleContinueToRecommendations = () => {
    setCurrentStep('recommendations');
  };

  const handleGeneratePlan = async () => {
    if (!selectedGoal) return;
    
    setGeneratingPlan(true);
    try {
      const plan = await generateAdaptivePlan(selectedGoal);
      if (plan) {
        setGeneratedPlan(plan);
        setCurrentStep('generate');
        onCreatePlan(); // Notificar al componente padre
      }
    } catch (error) {
      console.error('Error generating plan:', error);
    } finally {
      setGeneratingPlan(false);
    }
  };

  const goBackToStep = (step: typeof currentStep) => {
    setCurrentStep(step);
  };

  // Calcular estadísticas generales
  const totalWeaknesses = paesTests.filter(test => test.weaknessLevel === 'high').length;
  const averageProgress = paesTests.reduce((acc, test) => acc + test.userProgress, 0) / paesTests.length;
  const recommendedTestsCount = paesTests.filter(test => test.weaknessLevel !== 'none').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header con estadísticas inteligentes */}
      <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            Plan Inteligente PAES - Basado en Análisis Real
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <BarChart3 className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {paesTests.length}
              </div>
              <div className="text-sm text-gray-400">Pruebas PAES</div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {totalWeaknesses}
              </div>
              <div className="text-sm text-gray-400">Áreas Críticas</div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {Math.round(averageProgress)}%
              </div>
              <div className="text-sm text-gray-400">Progreso Promedio</div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <Target className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {recommendedTestsCount}
              </div>
              <div className="text-sm text-gray-400">Tests Recomendados</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stepper Navigation */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        {[
          { key: 'goal', label: 'Meta', icon: Target },
          { key: 'tests', label: 'Pruebas', icon: BarChart3 },
          { key: 'recommendations', label: 'Análisis', icon: Brain },
          { key: 'generate', label: 'Plan', icon: Zap }
        ].map((step, index) => {
          const StepIcon = step.icon;
          const isActive = currentStep === step.key;
          const isCompleted = ['goal', 'tests', 'recommendations', 'generate'].indexOf(currentStep) > 
                            ['goal', 'tests', 'recommendations', 'generate'].indexOf(step.key);
          
          return (
            <div key={step.key} className="flex items-center">
              <div 
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all
                  ${isActive ? 'bg-purple-600/20 text-purple-400 border border-purple-600/50' :
                    isCompleted ? 'bg-green-600/20 text-green-400' :
                    'bg-gray-800 text-gray-500'}
                `}
                onClick={() => goBackToStep(step.key as typeof currentStep)}
              >
                <StepIcon className="h-4 w-4" />
                <span className="text-sm font-medium">{step.label}</span>
                {isCompleted && <CheckCircle className="h-4 w-4" />}
              </div>
              {index < 3 && (
                <div className={`w-8 h-0.5 mx-2 ${
                  isCompleted ? 'bg-green-400' : 'bg-gray-600'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Contenido según el paso actual */}
      {currentStep === 'goal' && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Paso 1: Selecciona tu Meta</CardTitle>
          </CardHeader>
          <CardContent>
            <GoalSelector
              selectedGoal={selectedGoal}
              onGoalSelect={handleGoalSelect}
              weakestSkills={weakestSkills}
              loading={loading}
            />
          </CardContent>
        </Card>
      )}

      {currentStep === 'tests' && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Paso 2: Confirma las Pruebas PAES</CardTitle>
              <Button 
                onClick={handleContinueToRecommendations}
                disabled={selectedTests.length === 0}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Continuar al Análisis
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <PAESTestSelector
              paesTests={paesTests}
              selectedTests={selectedTests}
              onTestToggle={handleTestToggle}
              loading={loading}
            />
          </CardContent>
        </Card>
      )}

      {currentStep === 'recommendations' && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Paso 3: Análisis y Recomendaciones</CardTitle>
              <Button 
                onClick={handleGeneratePlan}
                disabled={generatingPlan}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {generatingPlan ? (
                  <>
                    <Brain className="h-4 w-4 mr-2 animate-spin" />
                    Generando Plan...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Generar Plan Inteligente
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${
                    rec.type === 'weakness' ? 'bg-red-600/10 border-red-600/30' :
                    rec.type === 'strength' ? 'bg-green-600/10 border-green-600/30' :
                    'bg-blue-600/10 border-blue-600/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className={`font-semibold ${
                      rec.type === 'weakness' ? 'text-red-400' :
                      rec.type === 'strength' ? 'text-green-400' :
                      'text-blue-400'
                    }`}>
                      {rec.title}
                    </h4>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        rec.priority === 'Alta' ? 'border-red-600/50 text-red-400' :
                        rec.priority === 'Media' ? 'border-yellow-600/50 text-yellow-400' :
                        'border-green-600/50 text-green-400'
                      }`}
                    >
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{rec.description}</p>
                  <p className="text-gray-400 text-xs">
                    <strong>Acción sugerida:</strong> {rec.action}
                  </p>
                  {rec.nodeIds.length > 0 && (
                    <p className="text-gray-500 text-xs mt-1">
                      {rec.nodeIds.length} nodos específicos recomendados
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 'generate' && generatedPlan && (
        <Card className="bg-green-600/10 border-green-600/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              Plan Inteligente Generado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-2">
                  {generatedPlan.title}
                </h3>
                <p className="text-gray-300 mb-4">{generatedPlan.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-green-400">
                    {generatedPlan.estimatedDuration}
                  </div>
                  <div className="text-sm text-gray-400">Semanas</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-blue-400">
                    {generatedPlan.metrics?.totalNodes || 0}
                  </div>
                  <div className="text-sm text-gray-400">Nodos</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-purple-400">
                    {Math.round(generatedPlan.metrics?.estimatedHours || 0)}h
                  </div>
                  <div className="text-sm text-gray-400">Tiempo Total</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-green-400 mb-2">Áreas de Enfoque:</h4>
                  <div className="space-y-1">
                    {generatedPlan.focusAreas?.slice(0, 3).map((area: string, index: number) => (
                      <Badge key={index} variant="destructive" className="mr-1 mb-1">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-green-400 mb-2">Fortalezas a Mantener:</h4>
                  <div className="space-y-1">
                    {generatedPlan.reinforcementAreas?.slice(0, 3).map((area: string, index: number) => (
                      <Badge key={index} variant="secondary" className="mr-1 mb-1">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-600/10 border border-blue-600/30 rounded-lg">
                <p className="text-sm text-blue-300">
                  ✅ Tu plan inteligente ha sido creado y está listo para usar. 
                  Se ha optimizado según tu diagnóstico y metas específicas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};
