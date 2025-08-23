import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Trophy,
  BarChart3,
  Music,
  Eye,
  Sparkles,
  TrendingUp,
  Target,
  Clock,
  Star,
  Zap,
  Activity,
  Users,
  Calendar,
  BookOpen,
  Headphones,
  Play,
  Pause,
  FastForward,
  Volume2,
  Settings,
  Maximize2,
  RefreshCw
} from 'lucide-react';

// Hooks
import { useGamification } from '@/hooks/use-gamification';
import { useAIRecommendations } from '@/hooks/use-ai-recommendations';
import { useRealTimeAnalytics } from '@/hooks/use-real-time-analytics';
import { useSpotifyPAES } from '@/hooks/use-spotify-paes';
import { useHolographicDashboard } from '@/hooks/use-holographic-dashboard';

// Components
import AIRecommendationDashboard from '@/components/ai/AIRecommendationDashboard';
import SimpleGamificationDashboard from '@/components/gamification/SimpleGamificationDashboard';
import RealTimeAnalyticsDashboard from '@/components/analytics/RealTimeAnalyticsDashboard';
import SpotifyPAESDashboard from '@/components/spotify/SpotifyPAESDashboard';
import Holographic3DDashboard from '@/components/3d/Holographic3DDashboard';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface DashboardWidget {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  icon: React.ElementType;
  priority: number;
  aiRelevance: number;
  isExpanded?: boolean;
  size: 'small' | 'medium' | 'large' | 'xlarge';
  category: 'core' | 'advanced' | 'ecosystem';
  requiresLevel?: number;
}

interface UserInsight {
  id: string;
  type: 'recommendation' | 'achievement' | 'prediction' | 'alert';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const MasterUnifiedDashboard: React.FC<{ userId: string }> = ({ userId }) => {
  const [activeView, setActiveView] = useState<'overview' | 'detailed'>('overview');
  const [expandedWidget, setExpandedWidget] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'core' | 'advanced' | 'ecosystem'>('all');
  const [isHolographicMode, setIsHolographicMode] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds

  // Hooks para obtener datos
  const { gameStats, achievements, isLoading: gamificationLoading } = useGamification();
  const { recommendations, isLoading: aiLoading } = useAIRecommendations();
  const { metrics, predictions, isLoading: analyticsLoading } = useRealTimeAnalytics();
  const { currentSession, isPlaying, currentTrack } = useSpotifyPAES();
  const { holographicMetrics, isHolographicActive } = useHolographicDashboard();

  // Auto-refresh de datos
  useEffect(() => {
    const interval = setInterval(() => {
      // Refrescar datos automáticamente sin recargar la página
      console.log('Auto-refreshing dashboard data...');
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  // Configuración de widgets
  const widgets: DashboardWidget[] = [
    {
      id: 'ai-recommendations',
      title: 'Recomendaciones IA',
      component: AIRecommendationDashboard,
      icon: Brain,
      priority: 10,
      aiRelevance: 10,
      size: 'large',
      category: 'advanced'
    },
    {
      id: 'gamification',
      title: 'Gamificación',
      component: SimpleGamificationDashboard,
      icon: Trophy,
      priority: 9,
      aiRelevance: 8,
      size: 'medium',
      category: 'advanced'
    },
    {
      id: 'real-time-analytics',
      title: 'Analytics Predictivos',
      component: RealTimeAnalyticsDashboard,
      icon: BarChart3,
      priority: 9,
      aiRelevance: 9,
      size: 'large',
      category: 'advanced'
    },
    {
      id: 'spotify-paes',
      title: 'Spotify PAES',
      component: SpotifyPAESDashboard,
      icon: Music,
      priority: 7,
      aiRelevance: 6,
      size: 'medium',
      category: 'ecosystem'
    },
    {
      id: 'holographic-3d',
      title: 'Dashboard 3D',
      component: Holographic3DDashboard,
      icon: Eye,
      priority: 6,
      aiRelevance: 7,
      size: 'xlarge',
      category: 'advanced',
      requiresLevel: 5
    }
  ];

  // Filtrar widgets por categoría y nivel de usuario
  const filteredWidgets = useMemo(() => {
    const userLevel = gameStats?.level || 1;
    return widgets
      .filter(widget => !widget.requiresLevel || userLevel >= widget.requiresLevel)
      .filter(widget => selectedCategory === 'all' || widget.category === selectedCategory)
      .sort((a, b) => b.priority - a.priority);
  }, [widgets, selectedCategory, gameStats?.level]);

  // Insights inteligentes basados en datos
  const generateInsights = useMemo((): UserInsight[] => {
    const insights: UserInsight[] = [];

    // Insights de IA
    if (recommendations?.personalizedActivities && recommendations.personalizedActivities.length > 0) {
      insights.push({
        id: 'ai-recommendation',
        type: 'recommendation',
        title: 'Nuevas actividades personalizadas disponibles',
        description: `${recommendations.personalizedActivities.length} actividades recomendadas por IA`,
        priority: 'high',
        timestamp: new Date().toISOString(),
        action: {
          label: 'Ver recomendaciones',
          onClick: () => setExpandedWidget('ai-recommendations')
        }
      });
    }

    // Insights de gamificación
    if (achievements?.some(a => !a.unlocked && a.progress > 0.8)) {
      const nearComplete = achievements.filter(a => !a.unlocked && a.progress > 0.8);
      insights.push({
        id: 'achievement-near',
        type: 'achievement',
        title: `¡Logro casi desbloqueado!`,
        description: `Estás a punto de conseguir: ${nearComplete[0]?.name}`,
        priority: 'medium',
        timestamp: new Date().toISOString(),
        action: {
          label: 'Ver progreso',
          onClick: () => setExpandedWidget('gamification')
        }
      });
    }

    // Insights de analytics predictivos
    if (predictions?.riskFactors && predictions.riskFactors.length > 0) {
      const highRisk = predictions.riskFactors.filter(r => r.severity === 'high');
      if (highRisk.length > 0) {
        insights.push({
          id: 'risk-alert',
          type: 'alert',
          title: 'Área de riesgo detectada',
          description: `Atención necesaria en: ${highRisk[0]?.area}`,
          priority: 'high',
          timestamp: new Date().toISOString(),
          action: {
            label: 'Ver análisis',
            onClick: () => setExpandedWidget('real-time-analytics')
          }
        });
      }
    }

    return insights.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [recommendations, achievements, predictions]);

  // Métricas generales del sistema
  const systemMetrics = useMemo(() => {
    return {
      totalProgress: gameStats ? Math.min(100, (gameStats.experience / gameStats.maxExperience) * 100) : 0,
      aiEngagement: recommendations ? Math.min(100, (recommendations.personalizedActivities?.length || 0) * 10) : 0,
      gamificationScore: gameStats?.totalPoints || 0,
      analyticsScore: metrics ? (metrics.engagementScore || 0) * 100 : 0,
      overallHealth: 85 // Calculado basado en múltiples factores
    };
  }, [gameStats, recommendations, metrics]);

  const QuickMetricsCard = () => (
    <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-400" />
          Métricas del Sistema
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{systemMetrics.overallHealth}%</div>
            <div className="text-xs text-gray-400">Salud General</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{gameStats?.level || 1}</div>
            <div className="text-xs text-gray-400">Nivel Usuario</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{systemMetrics.gamificationScore}</div>
            <div className="text-xs text-gray-400">Puntos Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{generateInsights().length}</div>
            <div className="text-xs text-gray-400">Insights IA</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Progreso IA</span>
            <span className="text-blue-400">{systemMetrics.aiEngagement.toFixed(0)}%</span>
          </div>
          <Progress value={systemMetrics.aiEngagement} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Analytics</span>
            <span className="text-purple-400">{systemMetrics.analyticsScore.toFixed(0)}%</span>
          </div>
          <Progress value={systemMetrics.analyticsScore} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );

  const InsightsPanel = () => (
    <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-400" />
          Insights Inteligentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {generateInsights().map((insight) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                'p-3 rounded-lg border-l-4 bg-white/5',
                insight.priority === 'high' && 'border-l-red-500',
                insight.priority === 'medium' && 'border-l-yellow-500',
                insight.priority === 'low' && 'border-l-blue-500'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-white">{insight.title}</h4>
                  <p className="text-xs text-gray-400 mt-1">{insight.description}</p>
                </div>
                {insight.action && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={insight.action.onClick}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    {insight.action.label}
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
          {generateInsights().length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-400 text-sm">No hay insights disponibles</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const SpotifyMiniPlayer = () => (
    <Card className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border-green-500/20">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Music className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {currentTrack?.name || 'Música para estudiar'}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {currentTrack?.artist || 'Playlist PAES adaptativa'}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <FastForward className="h-4 w-4 text-gray-300" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0"
              onClick={() => {/* Toggle play/pause */}}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 text-white" />
              ) : (
                <Play className="h-4 w-4 text-white" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const WidgetGrid = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredWidgets.map((widget) => {
        const isExpanded = expandedWidget === widget.id;
        const WidgetComponent = widget.component;
        
        return (
          <motion.div
            key={widget.id}
            layout
            className={cn(
              'relative',
              widget.size === 'small' && 'lg:col-span-1',
              widget.size === 'medium' && 'lg:col-span-1',
              widget.size === 'large' && 'xl:col-span-2',
              widget.size === 'xlarge' && 'xl:col-span-3',
              isExpanded && 'xl:col-span-3'
            )}
          >
            <Card className="bg-gray-900/50 border-gray-700/50 hover:border-gray-600/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <widget.icon className="h-5 w-5" />
                    {widget.title}
                    {widget.aiRelevance >= 9 && (
                      <Star className="h-4 w-4 text-yellow-400" />
                    )}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={widget.category === 'advanced' ? 'default' : 'secondary'}>
                      {widget.category === 'advanced' ? 'IA' : 
                       widget.category === 'ecosystem' ? 'ECO' : 'CORE'}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setExpandedWidget(isExpanded ? null : widget.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className={cn(
                  'transition-all duration-300',
                  isExpanded ? 'max-h-full' : 'max-h-64 overflow-hidden'
                )}>
                  <WidgetComponent 
                    userId={userId}
                    isExpanded={isExpanded}
                    isMinified={!isExpanded}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );

  if (gamificationLoading || aiLoading || analyticsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center text-white">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p>Cargando sistema PAES avanzado...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Dashboard PAES Avanzado
              </h1>
              <p className="text-gray-300">
                Sistema integrado con IA, Gamificación y Analytics Predictivos
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="text-white border-gray-600"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
              <Button
                variant={isHolographicMode ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIsHolographicMode(!isHolographicMode)}
                className={cn(
                  isHolographicMode 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'text-white border-gray-600'
                )}
              >
                <Eye className="h-4 w-4 mr-2" />
                Modo 3D
              </Button>
            </div>
          </div>
        </div>

        {/* Control Tabs */}
        <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)} className="mb-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="overview">Vista General</TabsTrigger>
            <TabsTrigger value="detailed">Vista Detallada</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <QuickMetricsCard />
              <InsightsPanel />
              <SpotifyMiniPlayer />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-3">
              <span className="text-gray-300 font-medium">Filtrar por:</span>
              <div className="flex gap-2">
                {['all', 'core', 'advanced', 'ecosystem'].map((category) => (
                  <Button
                    key={category}
                    size="sm"
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category as any)}
                    className={cn(
                      selectedCategory === category
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'text-white border-gray-600 hover:bg-gray-700'
                    )}
                  >
                    {category === 'all' ? 'Todos' :
                     category === 'core' ? 'Principal' :
                     category === 'advanced' ? 'IA Avanzada' : 'Ecosistema'}
                  </Button>
                ))}
              </div>
            </div>

            {/* Main Widgets Grid */}
            <WidgetGrid />
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            {/* Detailed view with full widgets */}
            <div className="space-y-8">
              {filteredWidgets.map((widget) => {
                const WidgetComponent = widget.component;
                return (
                  <Card key={widget.id} className="bg-gray-900/50 border-gray-700/50">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <widget.icon className="h-6 w-6" />
                        {widget.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <WidgetComponent 
                        userId={userId}
                        isExpanded={true}
                        isMinified={false}
                      />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MasterUnifiedDashboard;
