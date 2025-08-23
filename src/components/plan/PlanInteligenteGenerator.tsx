
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Clock, 
  Zap,
  CheckCircle,
  ArrowRight,
  Settings
} from "lucide-react";

interface SmartPlanConfig {
  goalType: 'comprehensive' | 'weakness_focused' | 'skill_specific';
  targetTests: string[];
  duration: number;
  intensity: 'light' | 'moderate' | 'intensive';
}

interface PlanInteligenteGeneratorProps {
  onGeneratePlan: (config: SmartPlanConfig) => void;
  isGenerating: boolean;
}

export const PlanInteligenteGenerator: React.FC<PlanInteligenteGeneratorProps> = ({
  onGeneratePlan,
  isGenerating
}) => {
  const [config, setConfig] = useState<SmartPlanConfig>({
    goalType: 'comprehensive',
    targetTests: ['COMPETENCIA_LECTORA', 'MATEMATICA_1'],
    duration: 8,
    intensity: 'moderate'
  });

  const planTypes = [
    {
      id: 'comprehensive' as const,
      title: 'Plan Integral',
      description: 'Cobertura completa de todas las materias PAES',
      icon: Target,
      estimatedImprovement: 25,
      timeCommitment: '3-4 horas/día'
    },
    {
      id: 'weakness_focused' as const,
      title: 'Enfoque en Debilidades',
      description: 'Concentrado en áreas de menor rendimiento',
      icon: TrendingUp,
      estimatedImprovement: 35,
      timeCommitment: '2-3 horas/día'
    },
    {
      id: 'skill_specific' as const,
      title: 'Habilidades Específicas',
      description: 'Desarrollo de competencias particulares',
      icon: Zap,
      estimatedImprovement: 20,
      timeCommitment: '1-2 horas/día'
    }
  ];

  const availableTests = [
    { id: 'COMPETENCIA_LECTORA', name: 'Comprensión Lectora', required: true },
    { id: 'MATEMATICA_1', name: 'Matemática M1', required: true },
    { id: 'MATEMATICA_2', name: 'Matemática M2', required: false },
    { id: 'CIENCIAS', name: 'Ciencias', required: false },
    { id: 'HISTORIA', name: 'Historia y Ciencias Sociales', required: false }
  ];

  const handleGeneratePlan = () => {
    onGeneratePlan(config);
  };

  return (
    <div className="space-y-6">
      {/* Plan Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {planTypes.map((type, index) => (
          <motion.div
            key={type.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-300 ${
                config.goalType === type.id 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:shadow-lg'
              }`}
              onClick={() => setConfig(prev => ({ ...prev, goalType: type.id }))}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <type.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{type.title}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      +{type.estimatedImprovement}% mejora estimada
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-3">{type.description}</CardDescription>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {type.timeCommitment}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Test Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Pruebas Objetivo
          </CardTitle>
          <CardDescription>
            Selecciona las pruebas PAES en las que quieres enfocarte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableTests.map((test) => (
              <div 
                key={test.id}
                className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                  config.targetTests.includes(test.id)
                    ? 'bg-blue-50 border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => {
                  if (test.required) return;
                  setConfig(prev => ({
                    ...prev,
                    targetTests: prev.targetTests.includes(test.id)
                      ? prev.targetTests.filter(t => t !== test.id)
                      : [...prev.targetTests, test.id]
                  }));
                }}
              >
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                  config.targetTests.includes(test.id)
                    ? 'bg-blue-500 border-blue-500'
                    : 'border-gray-300'
                }`}>
                  {config.targetTests.includes(test.id) && (
                    <CheckCircle className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="font-medium">{test.name}</span>
                {test.required && (
                  <Badge variant="destructive" className="text-xs">Obligatoria</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Plan Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Duración del Plan</CardTitle>
            <CardDescription>Semanas de estudio planificadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Duración: {config.duration} semanas</span>
                <Badge variant="outline">{config.duration * 7} días</Badge>
              </div>
              <input
                type="range"
                min="4"
                max="16"
                value={config.duration}
                onChange={(e) => setConfig(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>4 semanas</span>
                <span>16 semanas</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Intensidad</CardTitle>
            <CardDescription>Nivel de compromiso diario</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(['light', 'moderate', 'intensive'] as const).map((intensity) => (
                <div
                  key={intensity}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    config.intensity === intensity
                      ? 'bg-blue-50 border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setConfig(prev => ({ ...prev, intensity }))}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium capitalize">{intensity}</span>
                    <span className="text-sm text-muted-foreground">
                      {intensity === 'light' && '1-2h/día'}
                      {intensity === 'moderate' && '2-3h/día'}
                      {intensity === 'intensive' && '3-4h/día'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generate Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Plan Inteligente Personalizado</h3>
              <p className="text-sm text-muted-foreground">
                Basado en tu diagnóstico y objetivos de aprendizaje
              </p>
            </div>
            <Button 
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              size="lg"
              className="gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  Generar Plan IA
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
