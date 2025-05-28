
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRealDashboardData } from '@/hooks/dashboard/useRealDashboardData';
import { useRealNeuralData } from '@/hooks/useRealNeuralData';
import { NeuralEcosystemHub } from '@/components/neural-hub/NeuralEcosystemHub';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, Target, Zap, TrendingUp, 
  Calendar, BookOpen, Award, RefreshCw, 
  Eye, BarChart3, Sparkles, Globe, CheckCircle
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
    isLoading: neuralLoading,
    error: neuralError
  } = useRealNeuralData();

  const [activeView, setActiveView] = useState<'dashboard' | 'ecosystem'>('dashboard');

  const isLoading = dashboardLoading || neuralLoading;
  const hasRealData = realNodes.length > 0;

  // Mostrar loading solo inicialmente
  if (isLoading && !hasRealData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-6"></div>
          <div className="text-2xl font-bold">Conectando Sistema Neural PAES...</div>
          <div className="text-cyan-300 mt-2">
            Cargando nodos reales desde Supabase
          </div>
          <div className="text-white/60 text-sm mt-1">
            Preparando datos de producción...
          </div>
        </div>
      </div>
    );
  }

  if (activeView === 'ecosystem') {
    return <NeuralEcosystemHub />;
  }

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
              <p className="text-cyan-300 text-xl">Sistema de Producción - Datos Reales</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={() => setActiveView('ecosystem')}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500"
            >
              <Globe className="h-4 w-4 mr-2" />
              Ir al Ecosistema 3D
            </Button>
            <Button
              onClick={refreshData}
              variant="outline"
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar Sistema
            </Button>
            <Badge className="bg-green-600 text-white">
              Sistema Productivo Activo
            </Badge>
            <Badge variant="outline" className="text-white border-white">
              {realNodes.length} Nodos Reales Cargados
            </Badge>
          </div>
        </motion.div>

        {/* Métricas Principales del Sistema Real */}
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
                Nodos Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{realNodes.length}</div>
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
                Velocidad Neural
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{neuralMetrics.learningVelocity}%</div>
              <div className="text-purple-400 text-sm">Procesamiento acelerado</div>
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
              <div className="text-orange-400 text-sm">Sistema preparado</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Estado del Sistema Real */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-green-900/50 to-blue-900/50 border-green-500/30">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-4 mb-6">
                <CheckCircle className="w-16 h-16 text-green-400" />
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">Sistema de Producción Activo</h2>
                  <p className="text-white/70 mb-4">
                    Conectado a Supabase con {realNodes.length} nodos reales de PAES
                  </p>
                  <Button
                    onClick={() => setActiveView('ecosystem')}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500"
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    Explorar Universo Neural 3D
                  </Button>
                </div>
                <Brain className="w-16 h-16 text-cyan-400 animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Estado de Conexiones del Sistema */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
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

        {/* Información del Sistema */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-black/20 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Estado del Sistema Neural
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-white/80">Nodos Totales:</span>
                  <span className="text-cyan-400 font-bold ml-2">{realNodes.length}</span>
                </div>
                <div>
                  <span className="text-white/80">Nodos Activos:</span>
                  <span className="text-green-400 font-bold ml-2">{realNodes.filter(n => n.isActive).length}</span>
                </div>
                <div>
                  <span className="text-white/80">Tests PAES:</span>
                  <span className="text-purple-400 font-bold ml-2">{new Set(realNodes.map(n => n.testId)).size}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
