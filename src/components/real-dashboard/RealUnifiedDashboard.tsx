
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRealDashboardData } from '@/hooks/dashboard/useRealDashboardData';
import { useRealNeuralData } from '@/hooks/useRealNeuralData';
import { Real3DEducationalUniverse } from '@/components/real-3d/Real3DEducationalUniverse';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, Target, Zap, TrendingUp, 
  Calendar, BookOpen, Award, RefreshCw 
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

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    console.log('Nodo seleccionado:', nodeId);
    // Aquí se puede abrir un modal o navegar a detalles del nodo
  };

  const recommendations = getSmartRecommendations();
  const isLoading = dashboardLoading || neuralLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-xl font-bold">Cargando Sistema Neural...</div>
          <div className="text-cyan-300">Conectando datos reales</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-8 pb-8">
        {/* Header con refresh */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-4xl font-bold text-white">Dashboard Neural Unificado</h1>
            <p className="text-cyan-300 text-lg">Sistema de Aprendizaje Inteligente PAES</p>
          </div>
          
          <Button
            onClick={refreshData}
            variant="outline"
            className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </motion.div>

        {/* Métricas principales */}
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
                Nodos Completados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{metrics.completedNodes}</div>
              <div className="text-green-400 text-sm">
                {realNodes.filter(n => n.isActive).length} activos
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
              <div className="text-blue-400 text-sm">Sistema estable</div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Velocidad Aprendizaje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{neuralMetrics.learningVelocity}%</div>
              <div className="text-purple-400 text-sm">En aceleración</div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border-orange-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-orange-400 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Progreso Semanal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{metrics.weeklyProgress}%</div>
              <div className="text-orange-400 text-sm">+{metrics.currentStreak} días seguidos</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Universo 3D */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-6 h-6 text-cyan-400" />
                Universo Neural de Aprendizaje
                <Badge className="bg-green-600 text-white ml-2">
                  {realNodes.length} Nodos Reales
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Real3DEducationalUniverse onNodeClick={handleNodeClick} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Recomendaciones inteligentes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Recomendaciones Inteligentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.slice(0, 3).map((rec, index) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={
                        rec.priority === 'urgent' ? 'bg-red-600' :
                        rec.priority === 'high' ? 'bg-orange-600' :
                        'bg-blue-600'
                      }>
                        {rec.priority}
                      </Badge>
                      <h4 className="text-white font-medium">{rec.title}</h4>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{rec.description}</p>
                  <Button 
                    onClick={rec.action}
                    size="sm" 
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                  >
                    Ejecutar Acción
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Estado del sistema */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {Object.entries(systemStatus).map(([key, status]) => (
            <Card key={key} className="bg-black/40 backdrop-blur-xl border-white/20">
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
