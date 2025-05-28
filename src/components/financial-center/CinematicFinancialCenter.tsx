
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  Brain, 
  Calculator, 
  Clock,
  Target,
  TrendingUp,
  Sparkles,
  Zap
} from 'lucide-react';

// Componentes rescatados
import { FinancialHologram } from './components/FinancialHologram';
import { CinematicTimeline } from './components/CinematicTimeline';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { FUASBot } from './components/FUASBot';

export const CinematicFinancialCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [hologramActive, setHologramActive] = useState(true);
  const [financialMetrics, setFinancialMetrics] = useState({
    potentialSavings: 4500000,
    eligibleScholarships: 8,
    optimizationLevel: 87,
    daysToDeadline: 45
  });

  useEffect(() => {
    // Simulación de métricas en tiempo real
    const interval = setInterval(() => {
      setFinancialMetrics(prev => ({
        ...prev,
        optimizationLevel: Math.min(95, prev.optimizationLevel + Math.random() * 2),
        daysToDeadline: Math.max(0, prev.daysToDeadline - 0.01)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const tabConfigs = [
    {
      id: 'overview',
      label: 'Vista General',
      icon: Brain,
      color: 'text-cyan-400'
    },
    {
      id: 'timeline',
      label: 'Timeline FUAS',
      icon: Clock,
      color: 'text-orange-400'
    },
    {
      id: 'simulator',
      label: 'Simulador',
      icon: Zap,
      color: 'text-purple-400'
    },
    {
      id: 'calculator',
      label: 'Calculadora',
      icon: Calculator,
      color: 'text-green-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header Cinematográfico */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/20 backdrop-blur-xl border-b border-white/10 p-6"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div 
              className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <DollarSign className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-white">Centro Financiero Cinematográfico</h1>
              <p className="text-cyan-200">Sistema neural de optimización financiera PAES 2025</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">
              <Sparkles className="w-3 h-3 mr-1" />
              IA Activa
            </Badge>
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
              <Clock className="w-3 h-3 mr-1" />
              {financialMetrics.daysToDeadline.toFixed(0)} días FUAS
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Navegación de Tabs */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-black/40 backdrop-blur-xl border border-white/20 p-2">
            {tabConfigs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.id}
                  value={tab.id} 
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white flex items-center gap-2"
                >
                  <Icon className={`w-4 h-4 ${tab.color}`} />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Vista General con Holograma */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Panel de Holograma */}
              <Card className="bg-black/40 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-cyan-400" />
                      Visualización Neural
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setHologramActive(!hologramActive)}
                      className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10"
                    >
                      {hologramActive ? 'Pausar' : 'Activar'}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FinancialHologram 
                    metrics={financialMetrics}
                    active={hologramActive}
                  />
                </CardContent>
              </Card>

              {/* Panel de Métricas Rápidas */}
              <Card className="bg-black/40 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Métricas en Tiempo Real
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg p-4 border border-green-400/30">
                      <div className="text-green-400 text-2xl font-bold">
                        ${(financialMetrics.potentialSavings / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-green-300 text-sm">Ahorro Potencial</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg p-4 border border-blue-400/30">
                      <div className="text-blue-400 text-2xl font-bold">
                        {financialMetrics.eligibleScholarships}
                      </div>
                      <div className="text-blue-300 text-sm">Becas Elegibles</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-400/30">
                      <div className="text-purple-400 text-2xl font-bold">
                        {financialMetrics.optimizationLevel.toFixed(1)}%
                      </div>
                      <div className="text-purple-300 text-sm">Optimización IA</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg p-4 border border-orange-400/30">
                      <div className="text-orange-400 text-2xl font-bold">
                        {financialMetrics.daysToDeadline.toFixed(0)}
                      </div>
                      <div className="text-orange-300 text-sm">Días Restantes</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bot FUAS */}
            <Card className="bg-black/40 backdrop-blur-xl border-white/20">
              <CardContent className="p-6">
                <FUASBot />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline FUAS */}
          <TabsContent value="timeline">
            <CinematicTimeline />
          </TabsContent>

          {/* Simulador de Escenarios */}
          <TabsContent value="simulator">
            <ScenarioSimulator currentMetrics={financialMetrics} />
          </TabsContent>

          {/* Calculadora Avanzada */}
          <TabsContent value="calculator">
            <Card className="bg-black/40 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-green-400" />
                  Calculadora Financiera Avanzada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-20">
                  <Calculator className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    Calculadora de Becas y Costos
                  </h3>
                  <p className="text-white/70 mb-6">
                    Herramienta avanzada para calcular becas, aranceles y financiamiento universitario
                  </p>
                  <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90">
                    <Target className="w-4 h-4 mr-2" />
                    Iniciar Cálculo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
