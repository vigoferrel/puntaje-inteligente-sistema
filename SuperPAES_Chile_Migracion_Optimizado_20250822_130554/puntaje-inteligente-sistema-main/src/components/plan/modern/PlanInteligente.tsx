/* eslint-disable react-refresh/only-export-components */

import React, { useState } from "react";
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Progress } from "../../../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Zap, 
  BarChart3, 
  CheckCircle, 
  AlertCircle,
  BookOpen,
  Calculator,
  Globe,
  Microscope,
  Clock,
  Award
} from "lucide-react";
import { motion } from "framer-motion";
import { usePAESData } from "../../../hooks/use-paes-data";
import { useSmartPlanGenerator, SmartPlanConfig } from "../../../hooks/use-smart-plan-generator";

interface PlanInteligenteProps {
  profile: unknown;
  nodeProgress: unknown;
  onCreatePlan: () => void;
}

export const PlanInteligente = ({ 
  profile, 
  nodeProgress, 
  onCreatePlan 
}: PlanInteligenteProps) => {
  const {
    tests,
    skills,
    recommendations,
    loading,
    error
  } = usePAESData();

  const { generateSmartPlan, generating } = useSmartPlanGenerator();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedConfig, setSelectedConfig] = useState<SmartPlanConfig>({
    goalType: 'comprehensive',
    targetTests: [],
    duration: 8,
    intensity: 'moderate',
    focusAreas: []
  });

  const getTestIcon = (testCode: string) => {
    switch (testCode) {
      case 'COMPETENCIA_LECTORA': return BookOpen;
      case 'MATEMATICA_1':
      case 'MATEMATICA_2': return Calculator;
      case 'HISTORIA': return Globe;
      case 'CIENCIAS': return Microscope;
      default: return BookOpen;
    }
  };

  const getWeaknessColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-400 bg-red-600/10 border-red-600/30';
      case 'moderate': return 'text-orange-400 bg-orange-600/10 border-orange-600/30';
      case 'low': return 'text-yellow-400 bg-yellow-600/10 border-yellow-600/30';
      case 'good': return 'text-green-400 bg-green-600/10 border-green-600/30';
      default: return 'text-gray-400 bg-gray-600/10 border-gray-600/30';
    }
  };

  const handleGenerateIntelligentPlan = async () => {
    // Auto-configure based on data
    const criticalTests = tests.filter(t => t.weaknessLevel === 'critical').map(t => t.code);
    const moderateTests = tests.filter(t => t.weaknessLevel === 'moderate').map(t => t.code);
    
    const targetTests = criticalTests.length > 0 ? criticalTests : 
                       moderateTests.length > 0 ? moderateTests :
                       tests.slice(0, 3).map(t => t.code);

    const config: SmartPlanConfig = {
      goalType: criticalTests.length > 2 ? 'comprehensive' : 'weakness_focused',
      targetTests,
      duration: criticalTests.length > 2 ? 12 : 8,
      intensity: criticalTests.length > 0 ? 'intensive' : 'moderate',
      focusAreas: recommendations.filter(r => r.type === 'weakness').map(r => r.skillCode)
    };

    const plan = await generateSmartPlan(config, tests, skills, recommendations);
    if (plan) {
      onCreatePlan();
    }
  };

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-8 text-center">
          <Brain className="h-12 w-12 text-purple-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-300">Analizando tu rendimiento PAES...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-600/10 border-red-600/30">
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-300">{error}</p>
        </CardContent>
      </Card>
    );
  }

  const criticalTests = tests.filter(t => t.weaknessLevel === 'critical').length;
  const averageProgress = tests.reduce((acc, test) => acc + test.userProgress, 0) / tests.length;
  const highPrioritySkills = skills.filter(s => s.priority === 'high').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header con anÃ¡lisis inteligente */}
      <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            AnÃ¡lisis Inteligente PAES
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <BarChart3 className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{tests.length}</div>
              <div className="text-sm text-gray-400">Pruebas PAES</div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{criticalTests}</div>
              <div className="text-sm text-gray-400">Ãreas CrÃ­ticas</div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{Math.round(averageProgress)}%</div>
              <div className="text-sm text-gray-400">Progreso Promedio</div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <Target className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{highPrioritySkills}</div>
              <div className="text-sm text-gray-400">Prioridad Alta</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            AnÃ¡lisis
          </TabsTrigger>
          <TabsTrigger 
            value="recommendations"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            Recomendaciones
          </TabsTrigger>
          <TabsTrigger 
            value="generator"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            Generar Plan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Tests PAES */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Estado por Prueba PAES</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tests.map((test) => {
                  const TestIcon = getTestIcon(test.code);
                  return (
                    <motion.div
                      key={test.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`p-4 rounded-lg border ${getWeaknessColor(test.weaknessLevel)}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <TestIcon className="h-5 w-5" />
                          <span className="font-medium text-white">{test.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {test.weaknessLevel === 'critical' ? 'CrÃ­tico' :
                           test.weaknessLevel === 'moderate' ? 'Moderado' :
                           test.weaknessLevel === 'low' ? 'Bajo' : 'Bueno'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Progreso</span>
                          <span className="text-white">{test.userProgress}%</span>
                        </div>
                        <Progress value={test.userProgress} className="h-2" />
                        
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{test.skillsCount} habilidades</span>
                          <span>{test.nodesCount} nodos</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top Skills que necesitan atenciÃ³n */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Habilidades que Requieren AtenciÃ³n</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {skills.filter(s => s.priority === 'high').slice(0, 5).map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between p-3 bg-red-600/10 border border-red-600/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <div>
                        <span className="text-white font-medium">{skill.name}</span>
                        <div className="text-xs text-gray-400">{skill.testCode}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-red-400 font-bold">{skill.performance}%</div>
                      <div className="text-xs text-gray-500">{skill.nodesCount} nodos</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recomendaciones Inteligentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-lg border ${
                      rec.type === 'weakness' ? 'bg-red-600/10 border-red-600/30' :
                      rec.type === 'opportunity' ? 'bg-blue-600/10 border-blue-600/30' :
                      'bg-green-600/10 border-green-600/30'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className={`font-semibold ${
                        rec.type === 'weakness' ? 'text-red-400' :
                        rec.type === 'opportunity' ? 'text-blue-400' :
                        'text-green-400'
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
                      <strong>AcciÃ³n:</strong> {rec.action}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {rec.testCode}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Impacto: {rec.impact}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generator" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                Generador de Plan Inteligente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <Brain className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  Plan Optimizado con IA
                </h3>
                <p className="text-gray-400 mb-6">
                  Basado en tu anÃ¡lisis personalizado, generaremos un plan Ã³ptimo que se enfoca en tus Ã¡reas de mayor impacto.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-purple-600/10 border border-purple-600/30 rounded-lg p-4">
                    <Target className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-sm font-medium text-white">Enfoque Inteligente</div>
                    <div className="text-xs text-gray-400">Prioriza Ã¡reas crÃ­ticas</div>
                  </div>
                  
                  <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
                    <Clock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-sm font-medium text-white">Cronograma Optimizado</div>
                    <div className="text-xs text-gray-400">DistribuciÃ³n eficiente</div>
                  </div>
                  
                  <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-4">
                    <Award className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <div className="text-sm font-medium text-white">Resultados Medibles</div>
                    <div className="text-xs text-gray-400">Seguimiento continuo</div>
                  </div>
                </div>

                <Button 
                  onClick={handleGenerateIntelligentPlan}
                  disabled={generating}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3"
                  size="lg"
                >
                  {generating ? (
                    <>
                      <Brain className="h-5 w-5 mr-2 animate-spin" />
                      Generando Plan Inteligente...
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5 mr-2" />
                      Generar Plan Inteligente
                    </>
                  )}
                </Button>
                
                {generating && (
                  <div className="mt-4">
                    <Progress value={65} className="h-2" />
                    <p className="text-xs text-gray-400 mt-2">
                      Analizando tu rendimiento y optimizando el plan...
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

