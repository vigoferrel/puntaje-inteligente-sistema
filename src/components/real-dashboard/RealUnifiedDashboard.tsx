
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRealDashboardData } from '@/hooks/dashboard/useRealDashboardData';
import { useRealNeuralData } from '@/hooks/useRealNeuralData';
import { Enhanced3DUniverse } from '@/components/real-3d/Enhanced3DUniverse';
import { RealAdaptiveEngine } from '@/components/ai-recommendations/RealAdaptiveEngine';
import { RealAchievementSystem } from '@/components/achievements/RealAchievementSystem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, Target, Zap, TrendingUp, 
  Calendar, BookOpen, Award, RefreshCw, 
  Eye, BarChart3, Sparkles
} from 'lucide-react';

export const RealUnifiedDashboard: React.FC = () => {
  const { 
    metrics, 
    systemStatus, 
    isLoading: dashboardLoading,
    navigateToSection,
    getSmartRecommendations,
    refreshData
  } = useRealDashboardData();
  
  const { 
    neuralMetrics, 
    realNodes, 
    isLoading: neuralLoading 
  } = useRealNeuralData();

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'3d' | 'recommendations' | 'achievements'>('3d');

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    console.log('Nodo seleccionado:', nodeId);
  };

  const isLoading = dashboardLoading || neuralLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-6"></div>
          <div className="text-2xl font-bold">Inicializando Sistema Neural Avanzado...</div>
          <div className="text-cyan-300 mt-2">Conectando con datos reales desde Supabase</div>
          <div className="text-white/60 text-sm mt-1">
            {realNodes.length > 0 ? `${realNodes.length} nodos cargados` : 'Cargando nodos...'}
          </div>
        </div>
      </div>
    );
  }

  const renderMainContent = () => {
    switch (activeView) {
      case '3d':
        return (
          <Enhanced3DUniverse 
            onNodeClick={handleNodeClick}
            selectedNodeId={selectedNode}
          />
        );
      case 'recommendations':
        return <RealAdaptiveEngine />;
      case 'achievements':
        return <RealAchievementSystem />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-8 pb-8">
        
        {/* Header Principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-4">
            <Brain className="w-12 h-12 text-cyan-400" />
            <div>
              <h1 className="text-5xl font-bold text-white">Dashboard Neural PAES</h1>
              <p className="text-cyan-300 text-xl">Sistema Inteligente de Aprendizaje Real</p>
            </div>
            <Sparkles className="w-12 h-12 text-purple-400 animate-pulse" />
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={refreshData}
              variant="outline"
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar Datos
            </Button>
            <Badge className="bg-green-600 text-white">
              Sistema Neural Activo
            </Badge>
            <Badge variant="outline" className="text-white border-white">
              {realNodes.length} Nodos Conectados
            </Badge>
          </div>
        </motion.div>

        {/* Métricas Principales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="bg-black/40 backdrop-blur-xl border-green-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Progreso Global
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{metrics.completedNodes}</div>
              <div className="text-green-400 text-sm">
                {realNodes.filter(n => n.isActive).length} nodos activos
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border-blue-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Coherencia Neural
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{neuralMetrics.neuralCoherence}%</div>
              <div className="text-blue-400 text-sm">Sistema optimizado</div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Velocidad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{neuralMetrics.learningVelocity}%</div>
              <div className="text-purple-400 text-sm">Aprendizaje acelerado</div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border-orange-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-orange-400 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Engagement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{neuralMetrics.engagementScore}%</div>
              <div className="text-orange-400 text-sm">+{metrics.currentStreak} días</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navegación de Vistas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4"
        >
          <Button
            onClick={() => setActiveView('3d')}
            variant={activeView === '3d' ? 'default' : 'outline'}
            className={activeView === '3d' 
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600' 
              : 'border-white/30 text-white hover:bg-white/10'
            }
          >
            <Eye className="w-4 h-4 mr-2" />
            Universo 3D
          </Button>
          <Button
            onClick={() => setActiveView('recommendations')}
            variant={activeView === 'recommendations' ? 'default' : 'outline'}
            className={activeView === 'recommendations' 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
              : 'border-white/30 text-white hover:bg-white/10'
            }
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            IA Recomendaciones
          </Button>
          <Button
            onClick={() => setActiveView('achievements')}
            variant={activeView === 'achievements' ? 'default' : 'outline'}
            className={activeView === 'achievements' 
              ? 'bg-gradient-to-r from-yellow-600 to-orange-600' 
              : 'border-white/30 text-white hover:bg-white/10'
            }
          >
            <Award className="w-4 h-4 mr-2" />
            Logros
          </Button>
        </motion.div>

        {/* Contenido Principal */}
        <motion.div
          key={activeView}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {renderMainContent()}
        </motion.div>

        {/* Estado del Sistema */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {Object.entries(systemStatus).map(([key, status]) => (
            <Card key={key} className="bg-black/20 backdrop-blur-sm border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium capitalize">{key}</div>
                    <div className="text-gray-400 text-sm">{status.data}</div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    status.status === 'ready' || status.status === 'active' ? 'bg-green-400' :
                    status.status === 'loading' ? 'bg-yellow-400' :
                    'bg-red-400'
                  }`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
