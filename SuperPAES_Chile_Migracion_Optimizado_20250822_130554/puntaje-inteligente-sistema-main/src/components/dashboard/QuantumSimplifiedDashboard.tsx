import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Brain, Target, Zap, BookOpen, 
  Sparkles, Activity, TrendingUp, 
  Calendar, Award, Settings, 
  BarChart3, Eye, Globe
} from 'lucide-react';

// Types
interface QuantumMetric {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
  icon: React.ComponentType<any>;
  description: string;
}

interface QuantumModule {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  progress: number;
  status: 'active' | 'completed' | 'locked';
  color: string;
  path: string;
}

// Quantum Loading Component
const QuantumLoader: React.FC<{ message?: string }> = ({ message = "Inicializando Arsenal Cuántico" }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
    <div className="text-center space-y-6">
      <motion.div
        className="relative w-24 h-24 mx-auto"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 border-4 border-cyan-400/20 rounded-full"></div>
        <div className="absolute inset-2 border-4 border-purple-400/40 rounded-full"></div>
        <div className="absolute inset-4 border-4 border-pink-400/60 rounded-full"></div>
        <div className="absolute inset-8 w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"></div>
      </motion.div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          {message}
        </h2>
        <p className="text-cyan-300">Optimizando experiencia cuántica...</p>
      </div>
      
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </div>
    </div>
  </div>
);

// Quantum Background
const QuantumBackground: React.FC = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    {/* Base gradient */}
    <motion.div
      className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"
      animate={{
        background: [
          'radial-gradient(circle at 20% 80%, #1e293b 0%, #0f172a 50%, #020617 100%)',
          'radial-gradient(circle at 80% 20%, #1e1b4b 0%, #0f172a 50%, #020617 100%)',
          'radial-gradient(circle at 40% 40%, #164e63 0%, #0f172a 50%, #020617 100%)',
          'radial-gradient(circle at 20% 80%, #1e293b 0%, #0f172a 50%, #020617 100%)'
        ]
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    />
    
    {/* Quantum particles */}
    <div className="absolute inset-0 opacity-30">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, -50, -20],
            x: [-10, 10, -10],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.5, 1.5, 0.5]
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
    
    {/* Neural grid */}
    <div className="absolute inset-0 opacity-10">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {Array.from({ length: 10 }).map((_, i) => (
          <g key={i}>
            <line
              x1="0"
              y1={i * 10}
              x2="100"
              y2={i * 10}
              stroke="currentColor"
              strokeWidth="0.1"
              className="text-cyan-400"
            />
            <line
              x1={i * 10}
              y1="0"
              x2={i * 10}
              y2="100"
              stroke="currentColor"
              strokeWidth="0.1"
              className="text-cyan-400"
            />
          </g>
        ))}
      </svg>
    </div>
  </div>
);

// Main Dashboard Component
export const QuantumSimplifiedDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<'overview' | 'metrics' | 'modules'>('overview');

  // Initialize quantum systems
  useEffect(() => {
    const initializeQuantumSystems = async () => {
      // Simulate quantum initialization
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsLoading(false);
    };
    
    initializeQuantumSystems();
  }, []);

  // Quantum metrics data
  const quantumMetrics: QuantumMetric[] = [
    {
      id: 'neural_coherence',
      title: 'Coherencia Neural',
      value: 87,
      unit: '%',
      trend: 'up',
      color: 'text-cyan-400',
      icon: Brain,
      description: 'Sincronización del sistema neural'
    },
    {
      id: 'quantum_velocity',
      title: 'Velocidad Cuántica',
      value: 94,
      unit: '%',
      trend: 'up',
      color: 'text-purple-400',
      icon: Zap,
      description: 'Aceleración del aprendizaje'
    },
    {
      id: 'prediction_accuracy',
      title: 'Precisión Predictiva',
      value: 92,
      unit: '%',
      trend: 'stable',
      color: 'text-green-400',
      icon: Target,
      description: 'Exactitud de predicciones PAES'
    },
    {
      id: 'engagement_index',
      title: 'Índice de Engagement',
      value: 89,
      unit: '%',
      trend: 'up',
      color: 'text-orange-400',
      icon: TrendingUp,
      description: 'Nivel de participación activa'
    }
  ];

  // Quantum modules data
  const quantumModules: QuantumModule[] = [
    {
      id: 'neural_training',
      name: 'Entrenamiento Neural',
      icon: Brain,
      progress: 75,
      status: 'active',
      color: 'from-cyan-500 to-blue-600',
      path: '/neural'
    },
    {
      id: 'quantum_games',
      name: 'Juegos Cuánticos',
      icon: Sparkles,
      progress: 60,
      status: 'active',
      color: 'from-purple-500 to-pink-600',
      path: '/games'
    },
    {
      id: 'visual_universe',
      name: 'Universo Visual',
      icon: Globe,
      progress: 85,
      status: 'active',
      color: 'from-green-500 to-teal-600',
      path: '/visual'
    },
    {
      id: 'paes_simulator',
      name: 'Simulador PAES',
      icon: Award,
      progress: 45,
      status: 'active',
      color: 'from-yellow-500 to-orange-600',
      path: '/simulator'
    }
  ];

  if (isLoading) {
    return <QuantumLoader />;
  }

  return (
    <div className="min-h-screen relative">
      <QuantumBackground />
      
      <div className="relative z-10 p-6 space-y-8">
        {/* Quantum Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="p-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            
            <div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Arsenal Cuántico PAES
              </h1>
              <p className="text-cyan-300 text-lg md:text-xl">Sistema Educativo Simplificado</p>
            </div>
          </div>
          
          {/* Status indicators */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <Activity className="w-4 h-4 mr-1" />
              Sistema Activo
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              <Brain className="w-4 h-4 mr-1" />
              IA Neural Online
            </Badge>
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              <Zap className="w-4 h-4 mr-1" />
              Cuántico Optimizado
            </Badge>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-2 flex-wrap"
        >
          {[
            { key: 'overview', label: 'Vista General', icon: Eye },
            { key: 'metrics', label: 'Métricas Cuánticas', icon: BarChart3 },
            { key: 'modules', label: 'Módulos Arsenal', icon: Settings }
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              onClick={() => setActiveView(key as any)}
              variant={activeView === key ? 'default' : 'outline'}
              className={`${
                activeView === key 
                  ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-lg' 
                  : 'border-white/20 text-white hover:bg-white/10 backdrop-blur-sm'
              } transition-all duration-300`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </Button>
          ))}
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeView === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quantumMetrics.map((metric, index) => {
                  const Icon = metric.icon;
                  return (
                    <motion.div
                      key={metric.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <Card className="bg-black/40 backdrop-blur-xl border-white/20 hover:border-cyan-400/50 transition-all">
                        <CardContent className="p-6 text-center">
                          <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-${metric.color.replace('text-', '')} to-${metric.color.replace('text-', '')}/60 flex items-center justify-center`}>
                            <Icon className={`w-8 h-8 ${metric.color}`} />
                          </div>
                          <div className={`text-3xl font-bold ${metric.color} mb-2`}>
                            {metric.value}{metric.unit}
                          </div>
                          <div className="text-white font-medium mb-1">{metric.title}</div>
                          <div className="text-gray-400 text-xs">{metric.description}</div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {activeView === 'metrics' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-black/40 backdrop-blur-xl border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-cyan-400" />
                      Rendimiento Cuántico
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {quantumMetrics.map((metric) => (
                      <div key={metric.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white text-sm">{metric.title}</span>
                          <span className={`${metric.color} font-bold text-sm`}>
                            {metric.value}{metric.unit}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <motion.div
                            className={`h-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500`}
                            style={{ width: `${metric.value}%` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${metric.value}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-black/40 backdrop-blur-xl border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Activity className="w-5 h-5 text-green-400" />
                      Estado del Sistema
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">Online</div>
                        <div className="text-xs text-gray-400">Estado</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-400">4</div>
                        <div className="text-xs text-gray-400">Módulos Activos</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">127ms</div>
                        <div className="text-xs text-gray-400">Latencia</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-400">98.5%</div>
                        <div className="text-xs text-gray-400">Uptime</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeView === 'modules' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quantumModules.map((module, index) => {
                  const Icon = module.icon;
                  return (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                    >
                      <Card className="bg-black/40 backdrop-blur-xl border-white/20 hover:border-cyan-400/50 transition-all h-full">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className={`p-4 rounded-xl bg-gradient-to-r ${module.color}`}>
                              <Icon className="w-8 h-8 text-white" />
                            </div>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                module.status === 'active' ? 'text-green-400 border-green-400' :
                                module.status === 'completed' ? 'text-blue-400 border-blue-400' :
                                'text-gray-400 border-gray-400'
                              }`}
                            >
                              {module.status}
                            </Badge>
                          </div>
                          
                          <h3 className="text-xl font-bold text-white mb-3">{module.name}</h3>
                          
                          <div className="space-y-2 mb-6">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-300 text-sm">Progreso</span>
                              <span className="text-cyan-400 font-bold text-sm">{module.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <motion.div
                                className={`h-2 rounded-full bg-gradient-to-r ${module.color}`}
                                style={{ width: `${module.progress}%` }}
                                initial={{ width: 0 }}
                                animate={{ width: `${module.progress}%` }}
                                transition={{ duration: 1, delay: index * 0.2 }}
                              />
                            </div>
                          </div>
                          
                          <Button
                            onClick={() => navigate(module.path)}
                            className={`w-full bg-gradient-to-r ${module.color} hover:opacity-90 transition-all duration-200`}
                            disabled={module.status === 'locked'}
                          >
                            {module.status === 'locked' ? 'Bloqueado' : 'Acceder'}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center gap-4 flex-wrap"
        >
          <Button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-90"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Cabina Cuántica
          </Button>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
          >
            <Activity className="w-4 h-4 mr-2" />
            Reinicializar
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default QuantumSimplifiedDashboard;
