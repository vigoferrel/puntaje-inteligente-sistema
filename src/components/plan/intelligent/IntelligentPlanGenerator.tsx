
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, Calendar, Target, TrendingUp, 
  Zap, Clock, CheckCircle, AlertTriangle,
  Sparkles, BarChart3
} from 'lucide-react';

interface StudyPlan {
  id: string;
  title: string;
  description: string;
  priority: 'alta' | 'media' | 'baja';
  estimatedTime: number;
  difficulty: number;
  subject: string;
  tasks: StudyTask[];
  deadline: Date;
  progress: number;
}

interface StudyTask {
  id: string;
  title: string;
  type: 'lectura' | 'ejercicios' | 'simulacro' | 'repaso';
  duration: number;
  completed: boolean;
  resources: string[];
}

interface IntelligentPlanGeneratorProps {
  userMetrics: {
    strengths: string[];
    weaknesses: string[];
    studyTime: number;
    performance: number;
  };
  onPlanGenerated: (plan: StudyPlan) => void;
}

export const IntelligentPlanGenerator: React.FC<IntelligentPlanGeneratorProps> = ({
  userMetrics,
  onPlanGenerated
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlans, setGeneratedPlans] = useState<StudyPlan[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  const subjects = [
    'COMPETENCIA_LECTORA',
    'MATEMATICA_1', 
    'MATEMATICA_2',
    'CIENCIAS',
    'HISTORIA'
  ];

  const generateIntelligentPlan = async (subject: string) => {
    setIsGenerating(true);
    
    // Simular IA generando plan basado en métricas reales
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const isWeakArea = userMetrics.weaknesses.includes(subject);
    const priority = isWeakArea ? 'alta' : userMetrics.strengths.includes(subject) ? 'baja' : 'media';
    
    const tasks: StudyTask[] = [
      {
        id: `task_1_${subject}`,
        title: 'Diagnóstico inicial',
        type: 'simulacro',
        duration: 45,
        completed: false,
        resources: ['Banco de preguntas', 'Simulador PAES']
      },
      {
        id: `task_2_${subject}`,
        title: 'Estudio de conceptos clave',
        type: 'lectura',
        duration: 90,
        completed: false,
        resources: ['LectoGuía IA', 'Material complementario']
      },
      {
        id: `task_3_${subject}`,
        title: 'Práctica dirigida',
        type: 'ejercicios',
        duration: 60,
        completed: false,
        resources: ['Ejercicios adaptativos', 'Evaluaciones']
      },
      {
        id: `task_4_${subject}`,
        title: 'Simulacro final',
        type: 'simulacro',
        duration: 45,
        completed: false,
        resources: ['SuperPAES', 'Análisis de resultados']
      }
    ];

    const newPlan: StudyPlan = {
      id: `plan_${Date.now()}`,
      title: `Plan Inteligente: ${subject}`,
      description: `Plan personalizado basado en tu rendimiento actual (${userMetrics.performance}%) y tiempo disponible`,
      priority,
      estimatedTime: tasks.reduce((sum, task) => sum + task.duration, 0),
      difficulty: isWeakArea ? 8 : 6,
      subject,
      tasks,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
      progress: 0
    };

    setGeneratedPlans(prev => [...prev, newPlan]);
    onPlanGenerated(newPlan);
    setIsGenerating(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-500';
      case 'media': return 'bg-yellow-500';
      case 'baja': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getSubjectRecommendation = (subject: string) => {
    if (userMetrics.weaknesses.includes(subject)) {
      return {
        type: 'Área de mejora',
        color: 'text-red-400',
        icon: AlertTriangle,
        message: 'Requiere atención prioritaria'
      };
    }
    if (userMetrics.strengths.includes(subject)) {
      return {
        type: 'Fortaleza',
        color: 'text-green-400',
        icon: CheckCircle,
        message: 'Mantener nivel actual'
      };
    }
    return {
      type: 'Desarrollo',
      color: 'text-blue-400',
      icon: Target,
      message: 'Potencial de crecimiento'
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <Brain className="w-6 h-6 text-purple-400" />
            Generador de Planes Inteligentes
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </CardTitle>
          <p className="text-purple-200">
            IA avanzada que crea planes personalizados basados en tu progreso real
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{userMetrics.performance}%</div>
              <div className="text-sm text-gray-300">Rendimiento Actual</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{userMetrics.studyTime}h</div>
              <div className="text-sm text-gray-300">Tiempo de Estudio</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{generatedPlans.length}</div>
              <div className="text-sm text-gray-300">Planes Generados</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selección de Materia */}
      <Card className="bg-black/40 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5" />
            Seleccionar Materia para Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => {
              const recommendation = getSubjectRecommendation(subject);
              const Icon = recommendation.icon;
              
              return (
                <motion.div
                  key={subject}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all border-2 ${
                      selectedSubject === subject 
                        ? 'border-purple-400 bg-purple-900/20' 
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                    onClick={() => setSelectedSubject(subject)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className={`w-4 h-4 ${recommendation.color}`} />
                        <span className="text-white font-medium text-sm">
                          {subject.replace('_', ' ')}
                        </span>
                      </div>
                      <Badge className={`${getPriorityColor(
                        userMetrics.weaknesses.includes(subject) ? 'alta' : 
                        userMetrics.strengths.includes(subject) ? 'baja' : 'media'
                      )} text-white text-xs`}>
                        {recommendation.type}
                      </Badge>
                      <p className="text-xs text-gray-400 mt-1">
                        {recommendation.message}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
          
          <div className="mt-6">
            <Button
              onClick={() => selectedSubject && generateIntelligentPlan(selectedSubject)}
              disabled={!selectedSubject || isGenerating}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
            >
              {isGenerating ? (
                <>
                  <Brain className="w-4 h-4 mr-2 animate-spin" />
                  Generando Plan Inteligente...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generar Plan con IA
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Planes Generados */}
      {generatedPlans.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            Planes Generados
          </h3>
          
          {generatedPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-black/40 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      {plan.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getPriorityColor(plan.priority)} text-white`}>
                        Prioridad {plan.priority}
                      </Badge>
                      <Badge variant="outline" className="text-purple-400 border-purple-400">
                        <Clock className="w-3 h-3 mr-1" />
                        {plan.estimatedTime}min
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 text-sm">{plan.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">
                        {plan.difficulty}/10
                      </div>
                      <div className="text-xs text-gray-400">Dificultad</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">
                        {plan.tasks.length}
                      </div>
                      <div className="text-xs text-gray-400">Tareas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">
                        {Math.ceil(plan.estimatedTime / 60)}h
                      </div>
                      <div className="text-xs text-gray-400">Duración Total</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Progreso del Plan</span>
                      <span className="text-white">{plan.progress}%</span>
                    </div>
                    <Progress value={plan.progress} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-white font-medium">Tareas del Plan:</h4>
                    {plan.tasks.slice(0, 3).map((task) => (
                      <div key={task.id} className="flex items-center gap-3 p-2 bg-white/5 rounded">
                        <div className={`w-2 h-2 rounded-full ${
                          task.completed ? 'bg-green-400' : 'bg-gray-400'
                        }`} />
                        <span className="text-sm text-gray-300 flex-1">{task.title}</span>
                        <span className="text-xs text-gray-500">{task.duration}min</span>
                      </div>
                    ))}
                    {plan.tasks.length > 3 && (
                      <p className="text-xs text-gray-500">
                        +{plan.tasks.length - 3} tareas más...
                      </p>
                    )}
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600"
                    onClick={() => onPlanGenerated(plan)}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Activar Este Plan
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
