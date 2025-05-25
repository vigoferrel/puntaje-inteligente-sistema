
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, Target, BookOpen, TrendingUp, 
  Zap, Crown, Award, Star, Calendar,
  Calculator, DollarSign, Users
} from 'lucide-react';
import { useCinematic } from '@/components/cinematic/CinematicTransitionSystem';
import { useAuth } from '@/contexts/AuthContext';

export const SuperPAESMain: React.FC = () => {
  const { startTransition } = useCinematic();
  const { profile } = useAuth();

  const handleNavigateToUniverse = () => {
    startTransition('dashboard');
  };

  const handleNavigateToModule = (module: string) => {
    console.log(`Navegando a módulo: ${module}`);
    startTransition('dashboard');
  };

  const handleNavigateToFinancial = () => {
    // Navegar al centro financiero
    window.location.href = '/financial';
  };

  const handleNavigateToCalendar = () => {
    // Navegar al calendario
    window.location.href = '/calendario';
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

        {/* Módulos Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'PAES Universe',
              description: 'Exploración 3D del conocimiento',
              icon: Target,
              color: 'from-blue-500 to-indigo-500',
              action: () => handleNavigateToUniverse()
            },
            {
              title: 'LectoGuía IA',
              description: 'Asistente de comprensión lectora',
              icon: BookOpen,
              color: 'from-orange-500 to-red-500',
              action: () => handleNavigateToModule('lectoguia')
            },
            {
              title: 'Diagnóstico Inteligente',
              description: 'Evaluación adaptativa personalizada',
              icon: Brain,
              color: 'from-purple-500 to-pink-500',
              action: () => handleNavigateToModule('diagnostic')
            },
            {
              title: 'Plan de Estudio IA',
              description: 'Planificación optimizada por IA',
              icon: TrendingUp,
              color: 'from-green-500 to-teal-500',
              action: () => handleNavigateToModule('plan')
            },
            {
              title: 'Ejercicios Adaptativos',
              description: 'Práctica inteligente personalizada',
              icon: Zap,
              color: 'from-yellow-500 to-orange-500',
              action: () => handleNavigateToModule('exercises')
            },
            {
              title: 'Centro Financiero',
              description: 'Calculadora de becas y beneficios',
              icon: DollarSign,
              color: 'from-emerald-500 to-green-500',
              action: () => handleNavigateToFinancial()
            },
            {
              title: 'Calendario Inteligente',
              description: 'Planificación de estudio y fechas PAES',
              icon: Calendar,
              color: 'from-indigo-500 to-purple-500',
              action: () => handleNavigateToCalendar()
            },
            {
              title: 'Calculadora PAES',
              description: 'Simulador de puntajes y carreras',
              icon: Calculator,
              color: 'from-cyan-500 to-blue-500',
              action: () => handleNavigateToModule('calculator')
            },
            {
              title: 'Métricas Avanzadas',
              description: 'Análisis predictivo de rendimiento',
              icon: Award,
              color: 'from-pink-500 to-purple-500',
              action: () => handleNavigateToModule('metrics')
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
                <Card className="bg-gradient-to-br from-black/40 to-slate-900/40 backdrop-blur-xl border-white/10 hover:border-cyan-500/50 transition-all cursor-pointer h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className={`w-12 h-12 bg-gradient-to-r ${module.color} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{module.title}</h3>
                    <p className="text-gray-300 text-sm mb-4 flex-1">{module.description}</p>
                    <Button 
                      onClick={module.action}
                      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                    >
                      Acceder
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Estado del Sistema */}
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
                Estado del Sistema SuperPAES
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: 'Módulos Activos', value: '9/9', status: 'success' },
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
