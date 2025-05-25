
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  Target, 
  Brain, 
  Zap, 
  Trophy,
  DollarSign,
  TrendingUp,
  Clock,
  Sparkles,
  Rocket,
  Star,
  Eye
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ScholarshipCalculator } from './components/ScholarshipCalculator';
import { FinancialHologram } from './components/FinancialHologram';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { CinematicTimeline } from './components/CinematicTimeline';
import { PredictiveAnalytics } from './components/PredictiveAnalytics';
import { FUASBot } from './components/FUASBot';

interface FinancialCenterMode {
  mode: 'command' | 'calculator' | 'simulator' | 'timeline' | 'analytics';
  focus?: string;
}

export const CinematicFinancialCenter: React.FC = () => {
  const { user, profile } = useAuth();
  const [centerMode, setCenterMode] = useState<FinancialCenterMode>({ mode: 'command' });
  const [hologramActive, setHologramActive] = useState(true);
  const [financialMetrics, setFinancialMetrics] = useState({
    potentialSavings: 0,
    eligibleScholarships: 0,
    currentProgress: 0,
    targetScore: 0,
    daysToDeadline: 0,
    optimizationLevel: 0
  });

  useEffect(() => {
    // Simular carga de métricas financieras
    const loadFinancialMetrics = () => {
      setFinancialMetrics({
        potentialSavings: 4500000,
        eligibleScholarships: 7,
        currentProgress: 65,
        targetScore: 750,
        daysToDeadline: 45,
        optimizationLevel: 82
      });
    };

    loadFinancialMetrics();
  }, []);

  const renderModeContent = () => {
    switch (centerMode.mode) {
      case 'calculator':
        return <ScholarshipCalculator onMetricsUpdate={setFinancialMetrics} />;
      case 'simulator':
        return <ScenarioSimulator currentMetrics={financialMetrics} />;
      case 'timeline':
        return <CinematicTimeline />;
      case 'analytics':
        return <PredictiveAnalytics metrics={financialMetrics} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Efectos de fondo cinematográficos */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Partículas flotantes */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto py-6 px-4">
        {/* Header del Centro de Comando */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="flex items-center justify-center space-x-4 mb-6">
            <motion.div
              className="relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <DollarSign className="w-16 h-16 text-cyan-400" />
              <div className="absolute inset-0 bg-cyan-400/20 rounded-full animate-ping"></div>
            </motion.div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                CENTRO FINANCIERO PAES
              </h1>
              <p className="text-xl text-blue-200 mt-2">
                Sistema de Optimización de Becas Avanzado • {profile?.name || 'Comandante'}
              </p>
            </div>
          </div>

          {/* Métricas holográficas principales */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {[
              { 
                label: 'Ahorro Potencial', 
                value: `$${(financialMetrics.potentialSavings / 1000000).toFixed(1)}M`, 
                icon: Trophy, 
                color: 'text-yellow-400',
                gradient: 'from-yellow-400 to-orange-400'
              },
              { 
                label: 'Becas Elegibles', 
                value: financialMetrics.eligibleScholarships, 
                icon: Star, 
                color: 'text-green-400',
                gradient: 'from-green-400 to-emerald-400'
              },
              { 
                label: 'Progreso Actual', 
                value: `${financialMetrics.currentProgress}%`, 
                icon: TrendingUp, 
                color: 'text-blue-400',
                gradient: 'from-blue-400 to-cyan-400'
              },
              { 
                label: 'Meta Puntaje', 
                value: financialMetrics.targetScore, 
                icon: Target, 
                color: 'text-purple-400',
                gradient: 'from-purple-400 to-pink-400'
              },
              { 
                label: 'Días Restantes', 
                value: financialMetrics.daysToDeadline, 
                icon: Clock, 
                color: 'text-red-400',
                gradient: 'from-red-400 to-rose-400'
              },
              { 
                label: 'Optimización', 
                value: `${financialMetrics.optimizationLevel}%`, 
                icon: Sparkles, 
                color: 'text-indigo-400',
                gradient: 'from-indigo-400 to-violet-400'
              }
            ].map((metric, index) => (
              <Card key={metric.label} className="bg-black/40 backdrop-blur-lg border-white/20 overflow-hidden">
                <CardContent className="p-4 text-center relative">
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-10`}
                    animate={{ opacity: [0.05, 0.15, 0.05] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <metric.icon className={`w-8 h-8 mx-auto mb-2 ${metric.color}`} />
                  <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
                  <div className="text-xs text-white/70">{metric.label}</div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </motion.div>

        {/* Panel de control principal */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          {/* Selector de modo cinematográfico */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Card className="bg-black/40 backdrop-blur-lg border-white/20 h-full">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Brain className="w-6 h-6 mr-2 text-cyan-400" />
                  Centro de Comando
                </h3>
                
                <div className="space-y-3">
                  {[
                    { mode: 'command', icon: Eye, label: 'Vista General', color: 'from-blue-500 to-cyan-500' },
                    { mode: 'calculator', icon: Calculator, label: 'Calculadora', color: 'from-green-500 to-emerald-500' },
                    { mode: 'simulator', icon: Zap, label: 'Simulador', color: 'from-purple-500 to-pink-500' },
                    { mode: 'timeline', icon: Clock, label: 'Timeline', color: 'from-orange-500 to-red-500' },
                    { mode: 'analytics', icon: TrendingUp, label: 'Analytics', color: 'from-indigo-500 to-violet-500' }
                  ].map(({ mode, icon: Icon, label, color }) => (
                    <motion.button
                      key={mode}
                      onClick={() => setCenterMode({ mode: mode as any })}
                      className={`w-full p-4 rounded-xl transition-all duration-300 ${
                        centerMode.mode === mode 
                          ? `bg-gradient-to-r ${color} text-white shadow-2xl transform scale-105` 
                          : 'bg-white/10 text-white/70 hover:bg-white/20 hover:scale-102'
                      }`}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Bot FUAS */}
                <div className="mt-6 pt-6 border-t border-white/20">
                  <FUASBot />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contenido principal */}
          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Card className="bg-black/40 backdrop-blur-lg border-white/20 min-h-[600px]">
              <CardContent className="p-6">
                <AnimatePresence mode="wait">
                  {centerMode.mode === 'command' ? (
                    <motion.div
                      key="command"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className="h-full flex flex-col justify-center"
                    >
                      <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-4">
                          Holograma Financiero Activo
                        </h2>
                        <p className="text-blue-200 text-lg">
                          Sistema de optimización de becas en línea
                        </p>
                      </div>

                      {/* Holograma principal */}
                      <FinancialHologram 
                        metrics={financialMetrics}
                        active={hologramActive}
                      />

                      <div className="grid grid-cols-2 gap-6 mt-8">
                        <Button 
                          onClick={() => setCenterMode({ mode: 'calculator' })}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 text-lg"
                        >
                          <Calculator className="w-5 h-5 mr-2" />
                          Iniciar Cálculo
                        </Button>
                        <Button 
                          onClick={() => setCenterMode({ mode: 'simulator' })}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 text-lg"
                        >
                          <Zap className="w-5 h-5 mr-2" />
                          Simular Escenarios
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={centerMode.mode}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      {renderModeContent()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Botón de acción principal */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Button 
            size="lg"
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-12 py-6 rounded-2xl font-bold text-xl shadow-2xl"
            onClick={() => setCenterMode({ mode: 'calculator' })}
          >
            <Rocket className="w-8 h-8 mr-3" />
            Maximizar Oportunidades de Becas
            <Sparkles className="w-8 h-8 ml-3" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
