
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, BookOpen, Calculator, Target, Zap, TrendingUp, Award, Rocket, BarChart3, Map } from 'lucide-react';
import { useNeuralIntegration } from '@/hooks/use-neural-integration';
import { EnhancedNeuralCommandCenter } from '@/components/neural-command/EnhancedNeuralCommandCenter';

interface UnifiedEducationalHubProps {
  userId?: string;
  onNavigateToTool?: (tool: string) => void;
}

const UnifiedEducationalHub: React.FC<UnifiedEducationalHubProps> = ({ 
  userId = 'demo-user',
  onNavigateToTool 
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  
  const neural = useNeuralIntegration('dashboard', [
    'hub_coordination',
    'cross_module_analytics',
    'unified_navigation',
    'real_time_metrics'
  ], { activeTab, selectedTool, userId });

  const handleToolNavigation = useCallback((tool: string) => {
    setSelectedTool(tool);
    neural.broadcastUserAction('NAVIGATE_TO_TOOL', { tool, userId });
    
    if (onNavigateToTool) {
      onNavigateToTool(tool);
    }
  }, [neural, onNavigateToTool, userId]);

  const educationalTools = [
    {
      id: 'lectoguia',
      title: 'LectoGuía IA',
      description: 'Asistente de lectura inteligente con IA avanzada',
      icon: BookOpen,
      color: 'from-blue-600 to-cyan-600',
      route: '/lectoguia'
    },
    {
      id: 'diagnostic',
      title: 'Diagnóstico PAES',
      description: 'Evaluación inteligente de habilidades',
      icon: Target,
      color: 'from-purple-600 to-indigo-600',
      route: '/diagnostic'
    },
    {
      id: 'financial',
      title: 'Centro Financiero',
      description: 'Planificación financiera universitaria',
      icon: Calculator,
      color: 'from-green-600 to-emerald-600',
      route: '/financial'
    },
    {
      id: 'planning',
      title: 'Planificador Inteligente',
      description: 'Planes de estudio personalizados',
      icon: Map,
      color: 'from-orange-600 to-red-600',
      route: '/planning'
    },
    {
      id: 'universe',
      title: 'Universo Educativo 3D',
      description: 'Visualización inmersiva del aprendizaje',
      icon: Rocket,
      color: 'from-pink-600 to-purple-600',
      route: '/universe'
    },
    {
      id: 'achievements',
      title: 'Sistema de Logros',
      description: 'Gamificación y recompensas',
      icon: Award,
      color: 'from-yellow-600 to-orange-600',
      route: '/achievements'
    }
  ];

  const metrics = [
    { label: 'Progreso Global', value: '78%', trend: '+12%', color: 'text-green-400' },
    { label: 'Sesiones Activas', value: '24', trend: '+5', color: 'text-blue-400' },
    { label: 'Logros Desbloqueados', value: '15', trend: '+3', color: 'text-purple-400' },
    { label: 'Eficiencia IA', value: '92%', trend: '+8%', color: 'text-cyan-400' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="relative">
              <Brain className="w-12 h-12 text-cyan-400" />
              <motion.div
                className="absolute inset-0 w-12 h-12 bg-cyan-400 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <h1 className="text-4xl font-bold text-white">
              Hub Educativo Unificado
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Centro de control inteligente para tu experiencia educativa completa
          </p>
        </motion.div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-black/40 backdrop-blur-xl border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">{metric.label}</p>
                      <p className="text-2xl font-bold text-white">{metric.value}</p>
                    </div>
                    <div className={`text-sm font-medium ${metric.color}`}>
                      {metric.trend}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-black/40 backdrop-blur-xl">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-cyan-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="tools" className="data-[state=active]:bg-purple-600">
              <Zap className="w-4 h-4 mr-2" />
              Herramientas
            </TabsTrigger>
            <TabsTrigger value="neural" className="data-[state=active]:bg-indigo-600">
              <Brain className="w-4 h-4 mr-2" />
              Neural Center
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="dashboard" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* Quick Actions */}
                <Card className="bg-gradient-to-br from-black/60 to-slate-900/60 backdrop-blur-xl border-cyan-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Rocket className="w-5 h-5 text-cyan-400" />
                      Acciones Rápidas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {educationalTools.slice(0, 3).map((tool) => (
                      <Button
                        key={tool.id}
                        onClick={() => handleToolNavigation(tool.id)}
                        className={`w-full justify-start bg-gradient-to-r ${tool.color} hover:scale-105 transition-transform`}
                      >
                        <tool.icon className="w-4 h-4 mr-2" />
                        {tool.title}
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                {/* System Health */}
                <Card className="bg-gradient-to-br from-black/60 to-slate-900/60 backdrop-blur-xl border-green-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      Estado del Sistema
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Salud Neural</span>
                      <Badge className="bg-green-600">
                        {neural.integrationLevel}% Óptimo
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Módulos Activos</span>
                      <Badge className="bg-blue-600">6 de 6</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Performance</span>
                      <Badge className="bg-purple-600">Excelente</Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="tools" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {educationalTools.map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="cursor-pointer"
                    onClick={() => handleToolNavigation(tool.id)}
                  >
                    <Card className="bg-gradient-to-br from-black/60 to-slate-900/60 backdrop-blur-xl border-white/20 hover:border-white/40 transition-all">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tool.color} flex items-center justify-center`}>
                            <tool.icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold text-lg">{tool.title}</h3>
                            <p className="text-gray-400 text-sm">{tool.description}</p>
                          </div>
                          <Button 
                            className={`w-full bg-gradient-to-r ${tool.color} hover:opacity-90`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToolNavigation(tool.id);
                            }}
                          >
                            Acceder
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="neural" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
              >
                <EnhancedNeuralCommandCenter />
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
};

export { UnifiedEducationalHub };
