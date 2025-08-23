
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, Zap, Target, Sparkles, Globe, Eye,
  Network, Command, Cpu, Activity
} from 'lucide-react';
import { HolographicDashboard } from '@/components/intelligent-dashboard/HolographicDashboard';
import { EducationalUniverse } from '@/components/universe/EducationalUniverse';
import { IntersectionalDashboard } from '@/components/intersectional/IntersectionalDashboard';

interface NeuralCommandCenterProps {
  onNavigateToTool?: (tool: string, context?: any) => void;
}

export const NeuralCommandCenter: React.FC<NeuralCommandCenterProps> = ({ 
  onNavigateToTool 
}) => {
  const [activeModule, setActiveModule] = useState<'holographic' | 'universe' | 'intersectional'>('holographic');
  const [neuralMetrics, setNeuralMetrics] = useState({
    totalNodes: 277,
    completedNodes: 89,
    averagePerformance: 87,
    learningVelocity: 0.85,
    predictionAccuracy: 92,
    totalStudyTime: 3240,
    nodesCompleted: 89
  });

  useEffect(() => {
    // Simular actualización de métricas neurales en tiempo real
    const interval = setInterval(() => {
      setNeuralMetrics(prev => ({
        ...prev,
        averagePerformance: Math.min(100, prev.averagePerformance + Math.random() * 2 - 1),
        learningVelocity: Math.min(1, prev.learningVelocity + Math.random() * 0.1 - 0.05),
        predictionAccuracy: Math.min(100, prev.predictionAccuracy + Math.random() * 1 - 0.5)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleModuleChange = (module: 'holographic' | 'universe' | 'intersectional') => {
    setActiveModule(module);
  };

  const handleNavigateToUniverse = () => {
    onNavigateToTool?.('universe', { mode: 'overview' });
  };

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'holographic':
        return (
          <HolographicDashboard 
            metrics={neuralMetrics} 
            patterns={{}} 
          />
        );
      case 'universe':
        return (
          <EducationalUniverse 
            initialMode="overview"
            activeSubject="COMPETENCIA_LECTORA"
          />
        );
      case 'intersectional':
        return <IntersectionalDashboard />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-6">
      {/* Neural Command Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-r from-black/60 to-slate-900/60 backdrop-blur-xl border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <div className="relative">
                <Brain className="w-8 h-8 text-cyan-400" />
                <motion.div
                  className="absolute inset-0 w-8 h-8 bg-cyan-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              Centro de Comando Neural PAES
              <Badge className="bg-gradient-to-r from-cyan-600 to-purple-600">
                <Cpu className="w-3 h-3 mr-1" />
                IA Avanzada
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">{neuralMetrics.totalNodes}</div>
                <div className="text-sm text-gray-300">Nodos Totales</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{neuralMetrics.completedNodes}</div>
                <div className="text-sm text-gray-300">Completados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{Math.round(neuralMetrics.averagePerformance)}%</div>
                <div className="text-sm text-gray-300">Rendimiento</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{Math.round(neuralMetrics.predictionAccuracy)}%</div>
                <div className="text-sm text-gray-300">Precisión IA</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => handleModuleChange('holographic')}
                className={`flex items-center gap-2 ${
                  activeModule === 'holographic' 
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <Eye className="w-4 h-4" />
                Dashboard Holográfico
              </Button>

              <Button
                onClick={() => handleModuleChange('universe')}
                className={`flex items-center gap-2 ${
                  activeModule === 'universe' 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <Globe className="w-4 h-4" />
                Universo Educativo
              </Button>

              <Button
                onClick={() => handleModuleChange('intersectional')}
                className={`flex items-center gap-2 ${
                  activeModule === 'intersectional' 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <Network className="w-4 h-4" />
                Dashboard Interseccional
              </Button>

              <Button
                onClick={handleNavigateToUniverse}
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500"
              >
                <Command className="w-4 h-4" />
                Activar Universo 3D
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Active Module Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeModule}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          {renderActiveModule()}
        </motion.div>
      </AnimatePresence>

      {/* Neural Status Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 left-4 right-4 z-50"
      >
        <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/20">
          <CardContent className="p-3">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-400" />
                  <span className="text-sm">Sistema Neural: Activo</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">IA: {Math.round(neuralMetrics.predictionAccuracy)}%</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm">Módulo:</span>
                <Badge className="capitalize">
                  {activeModule}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
