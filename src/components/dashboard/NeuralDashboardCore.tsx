
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Zap, Target, TrendingUp, BookOpen, Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NeuralDashboardCoreProps {
  insights: any[];
  systemHealth: any;
  realTimeMetrics?: any;
  recommendations?: any[];
  onNeuralAction: (action: any) => void;
}

export const NeuralDashboardCore: React.FC<NeuralDashboardCoreProps> = ({
  insights,
  systemHealth,
  realTimeMetrics,
  recommendations,
  onNeuralAction
}) => {
  const navigate = useNavigate();

  const handleModuleNavigation = (module: string, context?: any) => {
    onNeuralAction({
      type: 'MODULE_NAVIGATION',
      module,
      context,
      timestamp: Date.now()
    });
    navigate(module);
  };

  const neuralModules = [
    {
      id: 'lectoguia',
      title: 'LectoGuía IA',
      description: 'Sistema de comprensión lectora adaptativo',
      icon: Brain,
      color: 'from-purple-500 to-blue-500',
      route: '/lectoguia',
      neuralActivity: systemHealth.adaptive_learning_score
    },
    {
      id: 'diagnostico',
      title: 'Diagnóstico Neural',
      description: 'Evaluación inteligente de habilidades',
      icon: Target,
      color: 'from-green-500 to-teal-500',
      route: '/diagnostico',
      neuralActivity: systemHealth.neural_efficiency
    },
    {
      id: 'plan',
      title: 'Plan Estratégico',
      description: 'Planificación adaptativa personalizada',
      icon: BookOpen,
      color: 'from-orange-500 to-red-500',
      route: '/plan',
      neuralActivity: systemHealth.cross_pollination_rate
    },
    {
      id: 'progreso',
      title: 'Análisis de Progreso',
      description: 'Métricas neurológicas en tiempo real',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500',
      route: '/progreso',
      neuralActivity: systemHealth.user_experience_harmony
    }
  ];

  return (
    <div className="space-y-8">
      {/* Insights Neurológicos Reales */}
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

      {/* Módulos Neurológicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {neuralModules.map((module, index) => {
          const Icon = module.icon;
          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/10 border-white/20 backdrop-blur-lg hover:bg-white/15 transition-all cursor-pointer group"
                    onClick={() => handleModuleNavigation(module.route)}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${module.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-white/60">Actividad Neural</div>
                      <div className="text-lg font-bold text-white">{Math.round(module.neuralActivity)}%</div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
                  <p className="text-white/70 text-sm mb-4">{module.description}</p>
                  
                  <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20">
                    Acceder al Módulo
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Sistema de Recomendaciones Neural */}
      {recommendations && recommendations.length > 0 && (
        <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              Recomendaciones Neurológicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.slice(0, 3).map((rec, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-2 h-2 bg-purple-400 rounded-full" />
                  <span className="text-white/90 text-sm">{rec.title || rec.description}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
