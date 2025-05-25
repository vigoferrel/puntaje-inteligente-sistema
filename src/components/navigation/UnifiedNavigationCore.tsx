
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUnifiedNavigation } from '@/hooks/useUnifiedNavigation';
import { useIntersectional } from '@/contexts/IntersectionalProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  BookOpen, 
  Calculator, 
  FlaskConical, 
  MapPin, 
  Calendar,
  DollarSign,
  Target,
  ArrowLeft,
  Sparkles,
  Zap
} from 'lucide-react';

interface UnifiedNavigationCoreProps {
  onNavigate?: (tool: string, context?: any) => void;
  currentTool?: string;
  showBackButton?: boolean;
}

export const UnifiedNavigationCore: React.FC<UnifiedNavigationCoreProps> = ({
  onNavigate,
  currentTool = 'dashboard',
  showBackButton = true
}) => {
  const { 
    navigateToTool, 
    goBack, 
    canGoBack, 
    context,
    navigationHistory 
  } = useUnifiedNavigation();
  
  const { isIntersectionalReady, neuralHealth } = useIntersectional();
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);

  // Herramientas principales con métricas neurales
  const tools = [
    {
      id: 'lectoguia',
      name: 'LectoGuía IA',
      description: 'Asistente inteligente PAES',
      icon: Brain,
      color: 'cyan',
      metric: Math.round(neuralHealth.neural_efficiency),
      priority: 'high'
    },
    {
      id: 'exercises',
      name: 'Ejercicios',
      description: 'Práctica adaptativa',
      icon: Target,
      color: 'purple',
      metric: Math.round(neuralHealth.adaptive_learning_score),
      priority: 'high'
    },
    {
      id: 'diagnostic',
      name: 'Diagnóstico',
      description: 'Evaluación inteligente',
      icon: FlaskConical,
      color: 'blue',
      metric: Math.round(neuralHealth.cross_pollination_rate),
      priority: 'medium'
    },
    {
      id: 'plan',
      name: 'Plan Personal',
      description: 'Ruta optimizada',
      icon: MapPin,
      color: 'green',
      metric: Math.round(neuralHealth.user_experience_harmony),
      priority: 'medium'
    },
    {
      id: 'calendar',
      name: 'Calendario',
      description: 'Gestión de tiempo',
      icon: Calendar,
      color: 'orange',
      metric: Math.round(neuralHealth.paes_simulation_accuracy),
      priority: 'low'
    },
    {
      id: 'financial',
      name: 'Financiero',
      description: 'Calculadora PAES',
      icon: DollarSign,
      color: 'yellow',
      metric: Math.round(neuralHealth.universe_exploration_depth),
      priority: 'low'
    }
  ];

  // Manejo optimizado de navegación
  const handleNavigation = useCallback((toolId: string) => {
    const contextData = {
      fromTool: currentTool,
      timestamp: new Date().toISOString(),
      userIntent: `navigate_to_${toolId}`,
      neuralMetrics: {
        efficiency: neuralHealth.neural_efficiency,
        adaptiveScore: neuralHealth.adaptive_learning_score
      }
    };

    // Usar navegación interna
    navigateToTool(toolId, contextData);
    
    // Callback externo si existe
    if (onNavigate) {
      onNavigate(toolId, contextData);
    }
  }, [currentTool, navigateToTool, onNavigate, neuralHealth]);

  // Obtener color de métrica basado en valor
  const getMetricColor = (value: number) => {
    if (value >= 80) return 'text-green-400';
    if (value >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30">
      <CardContent className="p-6">
        {/* Header con estado de sistema */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-semibold text-white">Navegación Neural</h2>
            {isIntersectionalReady && (
              <Badge variant="outline" className="text-green-400 border-green-400">
                <Zap className="w-3 h-3 mr-1" />
                Sistema Activo
              </Badge>
            )}
          </div>
          
          {showBackButton && canGoBack && (
            <Button
              onClick={goBack}
              variant="outline"
              size="sm"
              className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Regresar
            </Button>
          )}
        </div>

        {/* Grid de herramientas con métricas */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <motion.div
              key={tool.id}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setHoveredTool(tool.id)}
              onHoverEnd={() => setHoveredTool(null)}
              className="relative"
            >
              <Button
                onClick={() => handleNavigation(tool.id)}
                variant="outline"
                className={`w-full h-24 flex flex-col items-center justify-center gap-2 border-${tool.color}-500/30 hover:border-${tool.color}-500/60 hover:bg-${tool.color}-500/10 transition-all duration-300 ${
                  currentTool === tool.id ? `bg-${tool.color}-500/20 border-${tool.color}-500` : ''
                }`}
              >
                <tool.icon className={`w-6 h-6 text-${tool.color}-400`} />
                <div className="text-center">
                  <div className="text-sm font-medium text-white">{tool.name}</div>
                  <div className="text-xs text-gray-400">{tool.description}</div>
                </div>
                
                {/* Métrica neural */}
                <Badge 
                  variant="secondary" 
                  className={`absolute -top-2 -right-2 ${getMetricColor(tool.metric)} bg-black/80`}
                >
                  {tool.metric}%
                </Badge>
              </Button>
              
              {/* Tooltip con información adicional */}
              <AnimatePresence>
                {hoveredTool === tool.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-${tool.color}-600 text-white text-xs px-3 py-2 rounded-lg z-10 whitespace-nowrap`}
                  >
                    Rendimiento Neural: {tool.metric}%
                    <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 border-4 border-transparent border-b-${tool.color}-600`} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Historial de navegación simplificado */}
        {navigationHistory.length > 1 && (
          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className="text-sm text-gray-400 mb-2">Historial reciente:</div>
            <div className="flex gap-2 overflow-x-auto">
              {navigationHistory.slice(-5).map((tool, index) => (
                <Badge
                  key={`${tool}-${index}`}
                  variant="outline"
                  className="text-xs whitespace-nowrap"
                >
                  {tool}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Contexto actual si existe */}
        {context && Object.keys(context).length > 0 && (
          <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Contexto activo:</div>
            <div className="text-xs text-gray-300">
              {context.subject && `Materia: ${context.subject}`}
              {context.nodeId && ` | Nodo: ${context.nodeId}`}
              {context.fromTool && ` | Desde: ${context.fromTool}`}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
