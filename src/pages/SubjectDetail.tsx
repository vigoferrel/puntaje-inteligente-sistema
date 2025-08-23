import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Calculator, 
  History, 
  FlaskConical, 
  Target,
  Play,
  CheckCircle,
  Clock,
  TrendingUp,
  Brain,
  Zap,
  BarChart3,
  Calendar
} from 'lucide-react';
import { useDiagnosticSystem } from '@/hooks/diagnostic/useDiagnosticSystem';
import { useLearningPlans } from '@/hooks/learning-plans/use-learning-plans';
import { useSystemIntegration } from '@/hooks/integration/useSystemIntegration';

const SubjectDetail: React.FC = () => {
  const { subject } = useParams<{ subject: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'nodes' | 'progress' | 'exercises'>('overview');
  
  const diagnosticSystem = useDiagnosticSystem();
  const { currentPlan } = useLearningPlans();
  const systemIntegration = useSystemIntegration();

  const subjectInfo = {
    'competencia-lectora': {
      name: 'Competencia Lectora',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      totalNodes: 30,
      tier1: 14, tier2: 13, tier3: 3,
      description: 'Desarrolla habilidades de comprensión, análisis y síntesis textual',
      subjectArea: 'COMPETENCIA_LECTORA'
    },
    'matematica-m1': {
      name: 'Matemática M1',
      icon: Calculator,
      color: 'from-green-500 to-emerald-500',
      totalNodes: 25,
      tier1: 10, tier2: 10, tier3: 5,
      description: 'Álgebra, funciones y probabilidades',
      subjectArea: 'MATEMATICA_1'
    },
    'matematica-m2': {
      name: 'Matemática M2',
      icon: Calculator,
      color: 'from-purple-500 to-violet-500',
      totalNodes: 22,
      tier1: 13, tier2: 6, tier3: 3,
      description: 'Geometría, trigonometría y cálculo',
      subjectArea: 'MATEMATICA_2'
    },
    'historia': {
      name: 'Historia y Ciencias Sociales',
      icon: History,
      color: 'from-orange-500 to-red-500',
      totalNodes: 65,
      tier1: 19, tier2: 26, tier3: 20,
      description: 'Historia de Chile, mundial y educación cívica',
      subjectArea: 'HISTORIA'
    },
    'ciencias': {
      name: 'Ciencias',
      icon: FlaskConical,
      color: 'from-red-500 to-pink-500',
      totalNodes: 135,
      tier1: 33, tier2: 53, tier3: 49,
      description: 'Biología, química, física y ciencias de la Tierra',
      subjectArea: 'CIENCIAS'
    }
  };

  const currentSubject = subject ? subjectInfo[subject as keyof typeof subjectInfo] : null;

  if (!currentSubject) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex items-center justify-center">
          <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Materia no encontrada</h2>
              <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700">
                Volver al inicio
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  // Filtrar nodos usando subjectArea corregido
  const subjectNodes = diagnosticSystem.learningNodes.filter(node => {
    const nodeSubject = node.subjectArea || '';
    return nodeSubject.toLowerCase().includes(currentSubject.subjectArea.toLowerCase());
  });

  const completedNodes = subjectNodes.filter(node => 
    (node as any).progress >= 80 || (node as any).isCompleted
  ).length;

  const progressPercentage = subjectNodes.length > 0 
    ? (completedNodes / subjectNodes.length) * 100 
    : 0;

  // Calcular métricas por tier
  const tier1Nodes = subjectNodes.filter(node => node.tierPriority === 'tier1_critico');
  const tier2Nodes = subjectNodes.filter(node => node.tierPriority === 'tier2_importante');
  const tier3Nodes = subjectNodes.filter(node => node.tierPriority === 'tier3_complementario');

  const tier1Completed = tier1Nodes.filter(node => (node as any).progress >= 80).length;
  const tier2Completed = tier2Nodes.filter(node => (node as any).progress >= 80).length;
  const tier3Completed = tier3Nodes.filter(node => (node as any).progress >= 80).length;

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${currentSubject.color} p-8 mb-6`}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <currentSubject.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{currentSubject.name}</h1>
                <p className="text-white/80">{currentSubject.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-xl rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{subjectNodes.length}</div>
                <div className="text-sm text-white/80">Nodos Totales</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{completedNodes}</div>
                <div className="text-sm text-white/80">Completados</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{Math.round(progressPercentage)}%</div>
                <div className="text-sm text-white/80">Progreso</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{tier1Nodes.length}</div>
                <div className="text-sm text-white/80">Tier 1 (Alta prioridad)</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'overview', label: 'Resumen', icon: Target },
            { id: 'nodes', label: 'Nodos', icon: Brain },
            { id: 'progress', label: 'Progreso', icon: TrendingUp },
            { id: 'exercises', label: 'Ejercicios', icon: Zap }
          ].map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              className={`
                px-4 py-2 ${activeTab === tab.id 
                  ? 'bg-cyan-500 hover:bg-cyan-600 text-white' 
                  : 'border-gray-600 text-gray-300 hover:bg-gray-800'
                }
              `}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    Progreso por Tiers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Tier 1 (Crítico)</span>
                        <span className="text-red-400">{tier1Completed}/{tier1Nodes.length}</span>
                      </div>
                      <Progress value={tier1Nodes.length > 0 ? (tier1Completed / tier1Nodes.length) * 100 : 0} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Tier 2 (Importante)</span>
                        <span className="text-yellow-400">{tier2Completed}/{tier2Nodes.length}</span>
                      </div>
                      <Progress value={tier2Nodes.length > 0 ? (tier2Completed / tier2Nodes.length) * 100 : 0} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Tier 3 (Complementario)</span>
                        <span className="text-green-400">{tier3Completed}/{tier3Nodes.length}</span>
                      </div>
                      <Progress value={tier3Nodes.length > 0 ? (tier3Completed / tier3Nodes.length) * 100 : 0} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Acciones Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => navigate('/lectoguia')}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Continuar Estudio
                  </Button>
                  <Button 
                    onClick={() => navigate('/ejercicios')}
                    variant="outline" 
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Generar Ejercicios
                  </Button>
                  <Button 
                    onClick={() => navigate('/diagnostico')}
                    variant="outline" 
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Diagnóstico Específico
                  </Button>
                  <Button 
                    onClick={() => navigate('/calendario')}
                    variant="outline" 
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Programar Sesiones
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'nodes' && (
            <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Nodos de {currentSubject.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {subjectNodes.length > 0 ? (
                  <div className="space-y-4">
                    {/* Tier 1 Nodes */}
                    <div>
                      <h4 className="text-red-400 font-medium mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Tier 1 - Críticos ({tier1Nodes.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {tier1Nodes.slice(0, 6).map((node, index) => (
                          <motion.div
                            key={node.id}
                            whileHover={{ scale: 1.02 }}
                            className="p-4 bg-red-900/20 rounded-lg border border-red-500/30 hover:border-red-400 transition-all cursor-pointer"
                            onClick={() => navigate('/lectoguia')}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="destructive" className="text-xs">
                                Crítico
                              </Badge>
                              {(node as any).isCompleted ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <Clock className="w-4 h-4 text-red-400" />
                              )}
                            </div>
                            <h5 className="text-white font-medium mb-1 text-sm">{node.title}</h5>
                            <p className="text-xs text-gray-400">{node.estimatedTimeMinutes} min</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Tier 2 Nodes */}
                    <div>
                      <h4 className="text-yellow-400 font-medium mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Tier 2 - Importantes ({tier2Nodes.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {tier2Nodes.slice(0, 8).map((node, index) => (
                          <motion.div
                            key={node.id}
                            whileHover={{ scale: 1.02 }}
                            className="p-3 bg-yellow-900/20 rounded-lg border border-yellow-500/30 hover:border-yellow-400 transition-all cursor-pointer"
                            onClick={() => navigate('/lectoguia')}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="secondary" className="text-xs bg-yellow-600">
                                Importante
                              </Badge>
                              {(node as any).isCompleted ? (
                                <CheckCircle className="w-3 h-3 text-green-400" />
                              ) : (
                                <Clock className="w-3 h-3 text-yellow-400" />
                              )}
                            </div>
                            <h5 className="text-white font-medium text-xs mb-1">{node.title}</h5>
                            <p className="text-xs text-gray-400">{node.estimatedTimeMinutes} min</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No hay nodos disponibles para esta materia</p>
                    <Button 
                      onClick={() => navigate('/diagnostico')} 
                      className="mt-4 bg-blue-600 hover:bg-blue-700"
                    >
                      Ejecutar Diagnóstico
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'progress' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-400" />
                    Análisis de Rendimiento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Tiempo total estimado</span>
                      <span className="text-white font-bold">
                        {Math.round(subjectNodes.reduce((total, node) => total + node.estimatedTimeMinutes, 0) / 60)}h
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Dificultad promedio</span>
                      <Badge variant="outline">
                        {subjectNodes.length > 0 ? 'Intermedio' : 'N/A'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Nodos críticos restantes</span>
                      <span className="text-red-400 font-bold">
                        {tier1Nodes.length - tier1Completed}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    Recomendaciones IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {systemIntegration.getSmartRecommendations.slice(0, 3).map((rec, index) => (
                      <div key={rec.id} className="p-3 bg-gray-700/30 rounded-lg">
                        <div className="text-sm font-medium text-white">{rec.title}</div>
                        <div className="text-xs text-gray-400 mt-1">{rec.description}</div>
                        <Badge 
                          variant={rec.priority === 'urgent' ? 'destructive' : 'secondary'} 
                          className="mt-2 text-xs"
                        >
                          {rec.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'exercises' && (
            <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Ejercicios Personalizados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center p-6">
                    <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                    <h4 className="text-white font-medium mb-2">Ejercicios por Nodo</h4>
                    <p className="text-gray-400 mb-4">Genera ejercicios específicos para nodos individuales</p>
                    <Button onClick={() => navigate('/ejercicios')} className="bg-yellow-600 hover:bg-yellow-700">
                      Generar Ejercicios
                    </Button>
                  </div>
                  
                  <div className="text-center p-6">
                    <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <h4 className="text-white font-medium mb-2">Simulacro PAES</h4>
                    <p className="text-gray-400 mb-4">Practica con ejercicios tipo PAES para esta materia</p>
                    <Button onClick={() => navigate('/paes')} className="bg-purple-600 hover:bg-purple-700">
                      Iniciar Simulacro
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default SubjectDetail;
