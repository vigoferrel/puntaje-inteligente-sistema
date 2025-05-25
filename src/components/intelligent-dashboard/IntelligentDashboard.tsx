
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NeuralCommandCenter } from '@/components/neural/NeuralCommandCenter';
import { UnifiedDashboardContainerOptimized } from '@/components/unified-dashboard/UnifiedDashboardContainerOptimized';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, Command, ArrowRight } from 'lucide-react';

export const IntelligentDashboard: React.FC = () => {
  const [systemMode, setSystemMode] = useState<'neural' | 'unified'>('neural');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Inicialización del sistema inteligente
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleNavigateToTool = (tool: string, context?: any) => {
    if (tool === 'universe') {
      setSystemMode('unified');
    }
    console.log('🎯 Navegando desde IntelligentDashboard:', tool, context);
  };

  const toggleSystemMode = () => {
    setSystemMode(prev => prev === 'neural' ? 'unified' : 'neural');
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          className="text-center text-white space-y-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <div className="text-2xl font-bold">Inicializando Sistema Neural</div>
          <div className="text-cyan-300">Conectando módulos inteligentes...</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* System Mode Toggle */}
      <motion.div
        className="fixed top-4 right-4 z-50"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <Badge className={`${systemMode === 'neural' ? 'bg-cyan-600' : 'bg-gray-600'}`}>
                <Brain className="w-3 h-3 mr-1" />
                Neural
              </Badge>
              
              <Button
                onClick={toggleSystemMode}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
              
              <Badge className={`${systemMode === 'unified' ? 'bg-purple-600' : 'bg-gray-600'}`}>
                <Sparkles className="w-3 h-3 mr-1" />
                Unificado
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main System Render */}
      {systemMode === 'neural' ? (
        <NeuralCommandCenter onNavigateToTool={handleNavigateToTool} />
      ) : (
        <UnifiedDashboardContainerOptimized initialTool="dashboard" />
      )}
    </div>
  );
};
