
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIntersectional } from '@/contexts/IntersectionalProvider';
import { useNeuralIntegration } from '@/hooks/use-neural-integration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Target, 
  BookOpen,
  Calendar,
  BarChart3,
  Sparkles,
  Users,
  Settings,
  Zap,
  MapPin,
  Shield,
  Database,
  Activity,
  TrendingUp
} from 'lucide-react';

type DashboardMode = 'neural' | 'optimized' | 'simplified';

interface UnifiedDashboardProps {
  initialMode?: DashboardMode;
  className?: string;
}

export const UnifiedDashboard: React.FC<UnifiedDashboardProps> = ({ 
  initialMode = 'neural',
  className 
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentMode, setCurrentMode] = useState<DashboardMode>(initialMode);

  // Neural Integration (from SimplifiedDashboard)
  const {
    isIntersectionalReady,
    neuralHealth,
    generateIntersectionalInsights,
    adaptToUser
  } = useIntersectional();

  const neural = useNeuralIntegration('dashboard', [
    'real_time_analytics',
    'adaptive_learning',
    'cross_module_synthesis'
  ], {
    systemStatus: 'active',
    neuralIntegrationLevel: 100
  });

  // Tools configuration (from OptimizedDashboard)
  const tools = [
    {
      id: 'neural',
      title: 'Sistema Neural',
      description: 'Centro de comando neural con IA avanzada',
      icon: Brain,
      path: '/neural',
      color: 'from-purple-600 to-indigo-700',
      badge: 'Neural IA',
      priority: 'high'
    },
    {
      id: 'plan',
      title: 'Plan Inteligente',
      description: 'Planificación personalizada con IA',
      icon: MapPin,
      path: '/plan',
      color: 'from-emerald-600 to-teal-700',
      badge: 'Personalizado',
      priority: 'high'
    },
    {
      id: 'calidad',
      title: 'Sistema de Calidad',
      description: 'Garantía de excelencia educativa',
      icon: Shield,
      path: '/calidad',
      color: 'from-green-600 to-emerald-700',
      badge: 'Garantizado',
      priority: 'high'
    },
    {
      id: 'lectoguia',
      title: 'LectoGuía IA',
      description: 'Sistema de comprensión lectora con IA',
      icon: BookOpen,
      path: '/lectoguia',
      color: 'from-blue-600 to-blue-700',
      badge: 'IA Avanzada'
    },
    {
      id: 'banco-evaluaciones',
      title: 'Banco de Evaluaciones',
      description: 'Biblioteca completa de evaluaciones PAES',
      icon: Database,
      path: '/banco-evaluaciones',
      color: 'from-cyan-600 to-blue-700',
      badge: '722 Evaluaciones'
    },
    {
      id: 'diagnostico',
      title: 'Diagnóstico Inteligente',
      description: 'Sistema de evaluación adaptativa',
      icon: Target,
      path: '/diagnostico',
      color: 'from-green-600 to-green-700',
      badge: 'Adaptativo'
    },
    {
      id: 'calendario',
      title: 'Calendario Cinematográfico',
      description: 'Planificación de estudios inteligente',
      icon: Calendar,
      path: '/calendario',
      color: 'from-purple-600 to-purple-700',
      badge: 'Planificación'
    },
    {
      id: 'superpaes',
      title: 'SuperPAES',
      description: 'Sistema completo de preparación PAES',
      icon: Sparkles,
      path: '/superpaes',
      color: 'from-yellow-600 to-orange-600',
      badge: 'Completo'
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleModeSwitch = (mode: DashboardMode) => {
    setCurrentMode(mode);
  };

  // Neural mode content (from SimplifiedDashboard)
  const renderNeuralMode = () => {
    if (!isIntersectionalReady) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
          <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
            <CardContent className="p-8 text-center">
              <Brain className="w-12 h-12 mx-auto mb-4 text-blue-400 animate-pulse" />
              <h2 className="text-xl font-bold text-white mb-2">Activando Red Neural</h2>
              <p className="text-white/70">Inicializando sistema neurológico...</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    const insights = generateIntersectionalInsights();

    return (
      <div className="space-y-6">
        {/* Neural Status Header */}
        <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-blue-400" />
                <h1 className="text-xl font-bold text-white">Dashboard PAES Neural</h1>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400 font-medium">Sistema Neural 100% Activo</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-white/60">Eficiencia Neural</div>
                <div className="text-lg font-bold text-green-400">
                  {Math.round(neuralHealth.neural_efficiency)}%
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/60">Coherencia</div>
                <div className="text-lg font-bold text-blue-400">
                  {Math.round(neuralHealth.user_experience_harmony)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Neural Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.slice(0, 3).map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/10 border-white/20 backdrop-blur-lg hover:bg-white/15 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <CardTitle className="text-white text-lg">{insight.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 text-sm mb-3">{insight.description}</p>
                  <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                    insight.level === 'excellent' ? 'bg-green-500/20 text-green-400' :
                    insight.level === 'good' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    {insight.level === 'excellent' ? 'Excelente' :
                     insight.level === 'good' ? 'Bien' : 'Mejorable'}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  // Optimized mode content (from OptimizedDashboard)
  const renderOptimizedMode = () => {
    const priorityTools = tools.filter(tool => tool.priority === 'high');
    const regularTools = tools.filter(tool => tool.priority !== 'high');

    return (
      <div className="space-y-8">
        {/* Herramientas Prioritarias */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            Herramientas Principales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {priorityTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group"
              >
                <Card className="bg-black/40 backdrop-blur-xl border-white/20 hover:border-white/40 transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-4 rounded-xl bg-gradient-to-r ${tool.color}`}>
                        <tool.icon className="w-10 h-10 text-white" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {tool.badge}
                      </Badge>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                      {tool.description}
                    </p>
                    
                    <Button
                      onClick={() => handleNavigation(tool.path)}
                      className={`w-full bg-gradient-to-r ${tool.color} hover:opacity-90 transition-all duration-200 text-lg py-3`}
                    >
                      Acceder
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Herramientas Adicionales */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Herramientas Adicionales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (priorityTools.length + index) * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group"
              >
                <Card className="bg-black/40 backdrop-blur-xl border-white/20 hover:border-white/40 transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${tool.color}`}>
                        <tool.icon className="w-8 h-8 text-white" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {tool.badge}
                      </Badge>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                      {tool.description}
                    </p>
                    
                    <Button
                      onClick={() => handleNavigation(tool.path)}
                      className={`w-full bg-gradient-to-r ${tool.color} hover:opacity-90 transition-all duration-200`}
                    >
                      Acceder
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Simplified mode content (basic overview)
  const renderSimplifiedMode = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.slice(0, 4).map((tool) => (
          <Card key={tool.id} className="bg-white/10 border-white/20 backdrop-blur-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${tool.color}`}>
                  <tool.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{tool.title}</h3>
                  <Badge variant="outline" className="text-xs">{tool.badge}</Badge>
                </div>
              </div>
              <Button
                onClick={() => handleNavigation(tool.path)}
                className="w-full bg-white/10 hover:bg-white/20"
                size="sm"
              >
                Acceder
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentMode) {
      case 'neural':
        return renderNeuralMode();
      case 'optimized':
        return renderOptimizedMode();
      case 'simplified':
        return renderSimplifiedMode();
      default:
        return renderNeuralMode();
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-6 ${className || ''}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header unificado */}
        <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30">
          <CardHeader className="text-center">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Brain className="w-12 h-12 text-cyan-400" />
                <div>
                  <CardTitle className="text-white text-4xl">Sistema PAES</CardTitle>
                  <p className="text-cyan-300 text-lg">Plataforma Integrada de Aprendizaje</p>
                </div>
              </div>
              
              {/* Mode Selector */}
              <div className="flex gap-2">
                <Button
                  variant={currentMode === 'neural' ? 'default' : 'outline'}
                  onClick={() => handleModeSwitch('neural')}
                  size="sm"
                >
                  Neural
                </Button>
                <Button
                  variant={currentMode === 'optimized' ? 'default' : 'outline'}
                  onClick={() => handleModeSwitch('optimized')}
                  size="sm"
                >
                  Completo
                </Button>
                <Button
                  variant={currentMode === 'simplified' ? 'default' : 'outline'}
                  onClick={() => handleModeSwitch('simplified')}
                  size="sm"
                >
                  Simple
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <Badge variant="outline" className="text-green-400 border-green-400">
                <Users className="w-4 h-4 mr-1" />
                Usuario: {user?.email || 'Invitado'}
              </Badge>
              <Badge variant="outline" className="text-purple-400 border-purple-400">
                <Sparkles className="w-4 h-4 mr-1" />
                Sistema Activo
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Contenido dinámico basado en modo */}
        <motion.div
          key={currentMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>

        {/* Quick Stats */}
        <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Estado del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">Activo</div>
                <div className="text-sm text-gray-300">Sistema</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{tools.length}</div>
                <div className="text-sm text-gray-300">Herramientas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">24/7</div>
                <div className="text-sm text-gray-300">Disponibilidad</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">IA</div>
                <div className="text-sm text-gray-300">Potenciado</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
