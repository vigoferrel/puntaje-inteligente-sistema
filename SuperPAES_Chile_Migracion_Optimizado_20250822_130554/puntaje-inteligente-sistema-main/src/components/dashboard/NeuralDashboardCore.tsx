/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Brain, Zap, Target, TrendingUp, BookOpen, Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NeuralDashboardCoreProps {
  insights: unknown[];
  systemHealth: unknown;
  realTimeMetrics?: unknown;
  recommendations?: unknown[];
  onNeuralAction: (action: unknown) => void;
}

export const NeuralDashboardCore: FC<NeuralDashboardCoreProps> = ({
  insights,
  systemHealth,
  realTimeMetrics,
  recommendations,
  onNeuralAction
}) => {
  const navigate = useNavigate();

  const handleModuleNavigation = (module: string, context?: unknown) => {
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
      title: 'LectoGuÃ­a IA',
      description: 'Sistema de comprensiÃ³n lectora adaptativo',
      icon: Brain,
      color: 'from-purple-500 to-blue-500',
      route: '/lectoguia',
      neuralActivity: systemHealth.adaptive_learning_score
    },
    {
      id: 'diagnostico',
      title: 'DiagnÃ³stico Neural',
      description: 'EvaluaciÃ³n inteligente de habilidades',
      icon: Target,
      color: 'from-green-500 to-teal-500',
      route: '/diagnostico',
      neuralActivity: systemHealth.neural_efficiency
    },
    {
      id: 'plan',
      title: 'Plan EstratÃ©gico',
      description: 'PlanificaciÃ³n adaptativa personalizada',
      icon: BookOpen,
      color: 'from-orange-500 to-red-500',
      route: '/plan',
      neuralActivity: systemHealth.cross_pollination_rate
    },
    {
      id: 'progreso',
      title: 'AnÃ¡lisis de Progreso',
      description: 'MÃ©tricas neurolÃ³gicas en tiempo real',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500',
      route: '/progreso',
      neuralActivity: systemHealth.user_experience_harmony
    }
  ];

  return (
    <div className="space-y-8">
      {/* Insights NeurolÃ³gicos Reales */}
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

      {/* MÃ³dulos NeurolÃ³gicos */}
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
                    Acceder al MÃ³dulo
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
              Recomendaciones NeurolÃ³gicas
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

