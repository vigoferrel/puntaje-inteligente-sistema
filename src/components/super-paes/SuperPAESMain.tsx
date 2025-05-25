
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, Target, BookOpen, TrendingUp, 
  Zap, Crown, Award, Star, Calendar,
  Calculator, DollarSign, Users, Activity
} from 'lucide-react';
import { useCinematic } from '@/components/cinematic/CinematicTransitionSystem';
import { useAuth } from '@/contexts/AuthContext';

export const SuperPAESMain: React.FC = () => {
  const { startTransition } = useCinematic();
  const { profile } = useAuth();

  const handleNavigateToUniverse = () => {
    startTransition('dashboard');
  };

  const handleNavigateToUnified = () => {
    window.location.href = '/';
  };

  const handleNavigateToTool = (tool: string) => {
    console.log(`Navegando a herramienta: ${tool}`);
    window.location.href = `/?tool=${tool}`;
  };

  const handleNavigateToCalendar = () => {
    window.location.href = '/calendario';
  };

  const handleNavigateToFinancial = () => {
    window.location.href = '/financial';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header SuperPAES */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center space-x-4 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center"
            >
              <Crown className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold text-white">SuperPAES</h1>
              <p className="text-cyan-400">Sistema Inteligente de Preparación PAES</p>
              {profile && (
                <p className="text-purple-300 text-sm">
                  Bienvenido, {profile.name}
                </p>
              )}
            </div>
          </div>

          <Badge className="bg-gradient-to-r from-green-600 to-emerald-600">
            <Brain className="w-4 h-4 mr-2" />
            IA Avanzada Activa
          </Badge>
        </motion.div>

        {/* Herramientas Principales del Ecosistema */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Dashboard Unificado',
              description: 'Centro de control principal con datos reales',
              icon: Activity,
              color: 'from-blue-500 to-indigo-500',
              action: () => handleNavigateToUnified(),
              priority: 'high'
            },
            {
              title: 'LectoGuía IA',
              description: 'Asistente de comprensión lectora inteligente',
              icon: BookOpen,
              color: 'from-orange-500 to-red-500',
              action: () => handleNavigateToTool('lectoguia'),
              priority: 'high'
            },
            {
              title: 'Diagnóstico Inteligente',
              description: 'Evaluación adaptativa personalizada',
              icon: Brain,
              color: 'from-purple-500 to-pink-500',
              action: () => handleNavigateToTool('diagnostic'),
              priority: 'high'
            },
            {
              title: 'Ejercicios Adaptativos',
              description: 'Práctica inteligente personalizada',
              icon: Zap,
              color: 'from-yellow-500 to-orange-500',
              action: () => handleNavigateToTool('exercises'),
              priority: 'medium'
            },
            {
              title: 'Plan de Estudio IA',
              description: 'Planificación optimizada por IA',
              icon: TrendingUp,
              color: 'from-green-500 to-teal-500',
              action: () => handleNavigateToTool('plan'),
              priority: 'medium'
            },
            {
              title: 'Calendario Inteligente',
              description: 'Planificación de estudio y fechas PAES',
              icon: Calendar,
              color: 'from-indigo-500 to-purple-500',
              action: () => handleNavigateToCalendar(),
              priority: 'medium'
            },
            {
              title: 'Centro Financiero',
              description: 'Calculadora de becas y beneficios',
              icon: DollarSign,
              color: 'from-emerald-500 to-green-500',
              action: () => handleNavigateToFinancial(),
              priority: 'medium'
            },
            {
              title: 'Calculadora PAES',
              description: 'Simulador de puntajes y carreras',
              icon: Calculator,
              color: 'from-cyan-500 to-blue-500',
              action: () => handleNavigateToTool('calculator'),
              priority: 'low'
            },
            {
              title: 'PAES Universe',
              description: 'Exploración 3D del conocimiento',
              icon: Target,
              color: 'from-pink-500 to-purple-500',
              action: () => handleNavigateToUniverse(),
              priority: 'low'
            }
          ].map((module, index) => {
            const Icon = module.icon;
            return (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className={`bg-gradient-to-br from-black/40 to-slate-900/40 backdrop-blur-xl border-white/10 hover:border-cyan-500/50 transition-all cursor-pointer h-full ${
                  module.priority === 'high' ? 'ring-2 ring-cyan-500/30' : ''
                }`}>
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${module.color} rounded-xl flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      {module.priority === 'high' && (
                        <Badge variant="default" className="bg-cyan-600">
                          Esencial
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2">{module.title}</h3>
                    <p className="text-gray-300 text-sm mb-4 flex-1">{module.description}</p>
                    
                    <Button 
                      onClick={module.action}
                      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                    >
                      {module.priority === 'high' ? 'Acceder Ahora' : 'Explorar'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Flujo de Aprendizaje Recomendado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-br from-black/40 to-slate-900/40 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-400" />
                Flujo de Aprendizaje Recomendado
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { 
                    step: '1', 
                    title: 'Diagnóstico', 
                    description: 'Evalúa tu nivel actual',
                    action: () => handleNavigateToTool('diagnostic')
                  },
                  { 
                    step: '2', 
                    title: 'Plan IA', 
                    description: 'Genera tu plan personalizado',
                    action: () => handleNavigateToTool('plan')
                  },
                  { 
                    step: '3', 
                    title: 'Práctica', 
                    description: 'Ejercicios adaptativos diarios',
                    action: () => handleNavigateToTool('exercises')
                  },
                  { 
                    step: '4', 
                    title: 'Seguimiento', 
                    description: 'Monitorea tu progreso',
                    action: () => handleNavigateToUnified()
                  }
                ].map((step) => (
                  <Card 
                    key={step.step}
                    className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={step.action}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold text-sm">{step.step}</span>
                      </div>
                      <h4 className="font-semibold text-white text-sm">{step.title}</h4>
                      <p className="text-gray-300 text-xs mt-1">{step.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Estado del Sistema */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-br from-black/40 to-slate-900/40 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-green-400" />
                Estado del Ecosistema SuperPAES
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: 'Herramientas Activas', value: '9/9', status: 'success' },
                  { label: 'IA Operativa', value: '100%', status: 'success' },
                  { label: 'Datos Sincronizados', value: 'OK', status: 'success' },
                  { label: 'Rendimiento', value: 'Óptimo', status: 'success' },
                  { label: 'Usuario Conectado', value: profile ? 'Sí' : 'No', status: profile ? 'success' : 'warning' }
                ].map((metric) => (
                  <div key={metric.label} className="text-center">
                    <div className={`text-lg font-bold ${
                      metric.status === 'success' ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {metric.value}
                    </div>
                    <div className="text-sm text-gray-300">{metric.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};
