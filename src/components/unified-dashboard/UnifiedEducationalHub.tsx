
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useIntersectional } from '@/contexts/IntersectionalProvider';
import { useNeuralIntegration } from '@/hooks/use-neural-integration';
import { CinematicSystemWrapper } from '@/components/cinematic/CinematicSystemWrapper';
import { ModernDashboardHub } from '@/components/dashboard/modern/ModernDashboardHub';
import { PAESUnifiedDashboard } from '@/components/paes-unified/PAESUnifiedDashboard';
import { UniverseVisualizationHub } from '@/components/universe/UniverseVisualizationHub';
import { EnhancedNeuralCommandCenter } from '@/components/neural-cognition/EnhancedNeuralCommandCenter';
import { CinematicNavigationHub } from '@/components/cinematic/CinematicNavigationHub';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Sparkles, 
  BookOpen, 
  Calculator, 
  Target, 
  TrendingUp,
  Compass,
  Layers,
  Zap,
  Globe,
  Rocket,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UnifiedEducationalHubProps {
  userId?: string;
  onNavigateToTool?: (tool: string, context?: any) => void;
}

type ViewMode = 'dashboard' | 'universe' | 'neural' | 'analytics' | 'planning';

export const UnifiedEducationalHub: React.FC<UnifiedEducationalHubProps> = ({
  userId,
  onNavigateToTool
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    isIntersectionalReady,
    neuralHealth,
    generateIntersectionalInsights,
    systemVitals
  } = useIntersectional();

  const neural = useNeuralIntegration('dashboard', [
    'unified_educational_hub',
    'multi_modal_integration',
    'cinematic_experience',
    'real_time_analytics'
  ], {
    viewMode: 'unified',
    activeIntegrations: ['paes', 'lectoguia', 'financial', 'diagnostic']
  });

  const [activeView, setActiveView] = useState<ViewMode>('dashboard');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [achievements, setAchievements] = useState([]);

  // Módulos educativos principales
  const educationalModules = [
    {
      id: 'lectoguia',
      title: 'LectoGuía IA',
      description: 'Sistema de comprensión lectora con IA avanzada',
      icon: Brain,
      route: '/lectoguia',
      color: 'from-purple-500 to-blue-600',
      progress: Math.round(neuralHealth.adaptive_learning_score || 75),
      status: 'active'
    },
    {
      id: 'diagnostic',
      title: 'Diagnóstico PAES',
      description: 'Evaluación inteligente y adaptativa',
      icon: Target,
      route: '/diagnostic',
      color: 'from-green-500 to-emerald-600',
      progress: Math.round(neuralHealth.neural_efficiency || 80),
      status: 'active'
    },
    {
      id: 'financial',
      title: 'Centro Financiero',
      description: 'Planificación financiera universitaria',
      icon: Calculator,
      route: '/financial',
      color: 'from-orange-500 to-red-600',
      progress: Math.round(neuralHealth.cross_pollination_rate || 70),
      status: 'active'
    },
    {
      id: 'planning',
      title: 'Planificador Inteligente',
      description: 'Plan de estudios personalizado',
      icon: BookOpen,
      route: '/planning',
      color: 'from-blue-500 to-cyan-600',
      progress: Math.round(neuralHealth.user_experience_harmony || 85),
      status: 'active'
    }
  ];

  // Vistas especiales del hub
  const specialViews = [
    {
      id: 'universe',
      title: 'Universo Educativo',
      description: 'Visualización 3D del conocimiento',
      icon: Globe,
      color: 'from-indigo-500 to-purple-600'
    },
    {
      id: 'neural',
      title: 'Centro Neural',
      description: 'Command center neurológico',
      icon: Zap,
      color: 'from-yellow-500 to-orange-600'
    },
    {
      id: 'analytics',
      title: 'Analytics Pro',
      description: 'Análisis avanzado de rendimiento',
      icon: TrendingUp,
      color: 'from-pink-500 to-rose-600'
    }
  ];

  const handleModuleNavigation = (moduleId: string, route?: string) => {
    setIsTransitioning(true);
    
    neural.broadcastUserAction('MODULE_NAVIGATION', {
      module: moduleId,
      timestamp: Date.now(),
      integrationLevel: neural.integrationLevel
    });

    setTimeout(() => {
      if (route) {
        navigate(route);
      } else if (onNavigateToTool) {
        onNavigateToTool(moduleId);
      }
      setIsTransitioning(false);
    }, 500);
  };

  const handleViewChange = (view: ViewMode) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveView(view);
      setIsTransitioning(false);
    }, 300);
  };

  // Generar insights en tiempo real
  const insights = generateIntersectionalInsights();
  const systemStatus = {
    overall: neuralHealth.neural_efficiency > 80 ? 'Excelente' : 
             neuralHealth.neural_efficiency > 60 ? 'Bueno' : 'Mejorable',
    cardiovascular: systemVitals.cardiovascular.heartRate,
    modules: neural.systemHealth.cross_pollination_rate
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'universe':
        return <UniverseVisualizationHub />;
      case 'neural':
        return <EnhancedNeuralCommandCenter />;
      case 'analytics':
        return <PAESUnifiedDashboard />;
      case 'planning':
        return <ModernDashboardHub />;
      default:
        return (
          <div className="space-y-8">
            {/* Sistema de métricas en tiempo real */}
            <Card className="bg-gradient-to-r from-slate-800/80 to-gray-800/80 border-white/20 backdrop-blur-lg">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {systemStatus.overall}
                    </div>
                    <div className="text-sm text-white/70">Estado General</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      {systemStatus.cardiovascular} BPM
                    </div>
                    <div className="text-sm text-white/70">Sistema Neural</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">
                      {educationalModules.length}
                    </div>
                    <div className="text-sm text-white/70">Módulos Activos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-400 mb-2">
                      {Math.round(neural.integrationLevel)}%
                    </div>
                    <div className="text-sm text-white/70">Integración</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Módulos educativos principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {educationalModules.map((module, index) => {
                const Icon = module.icon;
                return (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white/10 border-white/20 backdrop-blur-lg hover:bg-white/15 transition-all cursor-pointer group"
                          onClick={() => handleModuleNavigation(module.id, module.route)}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-lg bg-gradient-to-r ${module.color} group-hover:scale-110 transition-transform`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <Badge className="bg-green-500/20 text-green-400">
                            {module.progress}%
                          </Badge>
                        </div>
                        
                        <h3 className="text-lg font-bold text-white mb-2">{module.title}</h3>
                        <p className="text-white/70 text-sm mb-4">{module.description}</p>
                        
                        <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                          <motion.div
                            className={`h-2 rounded-full bg-gradient-to-r ${module.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${module.progress}%` }}
                            transition={{ duration: 1, delay: index * 0.2 }}
                          />
                        </div>

                        <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20">
                          Ingresar
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Insights y recomendaciones */}
            {insights.length > 0 && (
              <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                    Insights Inteligentes
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {insights.slice(0, 3).map((insight, index) => (
                      <div key={index} className="p-4 bg-white/5 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">{insight.title}</h4>
                        <p className="text-white/70 text-sm">{insight.description}</p>
                        <Badge className={`mt-2 ${
                          insight.level === 'excellent' ? 'bg-green-500/20 text-green-400' :
                          insight.level === 'good' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-orange-500/20 text-orange-400'
                        }`}>
                          {insight.level === 'excellent' ? 'Excelente' :
                           insight.level === 'good' ? 'Bien' : 'Mejorable'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );
    }
  };

  if (!isIntersectionalReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
          <CardContent className="p-8 text-center">
            <Brain className="w-12 h-12 mx-auto mb-4 text-purple-400 animate-pulse" />
            <h2 className="text-2xl font-bold text-white mb-2">Activando Ecosistema Neural</h2>
            <p className="text-white/70">Inicializando sistema educativo inteligente...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <CinematicSystemWrapper cinematicMode={true}>
      <div className="min-h-screen">
        {/* Header unificado */}
        <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">PAES SuperHub</h1>
                    <p className="text-sm text-white/60">Ecosistema Educativo Inteligente</p>
                  </div>
                </div>

                {/* Navegación de vistas */}
                <div className="flex space-x-2 bg-white/10 backdrop-blur-sm rounded-xl p-1">
                  {[
                    { id: 'dashboard', label: 'Dashboard', icon: Layers },
                    { id: 'universe', label: 'Universo', icon: Globe },
                    { id: 'neural', label: 'Neural', icon: Zap },
                    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
                  ].map((view) => {
                    const Icon = view.icon;
                    return (
                      <Button
                        key={view.id}
                        onClick={() => handleViewChange(view.id as ViewMode)}
                        variant={activeView === view.id ? "default" : "ghost"}
                        size="sm"
                        className={`flex items-center gap-2 ${
                          activeView === view.id 
                            ? 'bg-white/20 text-white' 
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {view.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Status indicators */}
              <div className="flex items-center gap-4">
                <Badge className="bg-green-500/20 text-green-400">
                  Sistema Activo
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400">
                  {Math.round(neural.integrationLevel)}% Integrado
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="container mx-auto px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderMainContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navegación cinematográfica flotante */}
        <CinematicNavigationHub />
      </div>
    </CinematicSystemWrapper>
  );
};
