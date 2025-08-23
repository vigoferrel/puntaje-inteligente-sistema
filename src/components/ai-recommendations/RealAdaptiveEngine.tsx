
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Brain, 
  Target, 
  Zap, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Star,
  Clock
} from 'lucide-react';

interface RealRecommendation {
  id: string;
  type: 'urgent' | 'opportunity' | 'strength' | 'next_step';
  title: string;
  description: string;
  priority: number;
  estimatedImpact: string;
  timeRequired: number;
  nodeId?: string;
  actionType: string;
  metadata: any;
}

export const RealAdaptiveEngine: React.FC = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<RealRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRec, setSelectedRec] = useState<string | null>(null);

  useEffect(() => {
    const generateRealRecommendations = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);

        // Obtener progreso real del usuario
        const { data: progressData } = await supabase
          .from('user_node_progress')
          .select(`
            *,
            learning_nodes (
              code, title, test_id, skill_id, tier_priority, difficulty
            )
          `)
          .eq('user_id', user.id);

        // Obtener eventos neurales recientes
        const { data: neuralEvents } = await supabase
          .from('neural_events')
          .select('*')
          .eq('user_id', user.id)
          .gte('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
          .order('timestamp', { ascending: false })
          .limit(50);

        const realRecs: RealRecommendation[] = [];

        // Análisis de nodos con bajo rendimiento
        const weakNodes = progressData?.filter(p => p.mastery_level < 0.3) || [];
        weakNodes.slice(0, 3).forEach((node, index) => {
          realRecs.push({
            id: `weak-${node.id}`,
            type: 'urgent',
            title: `Reforzar ${node.learning_nodes?.code}`,
            description: `Tu nivel de dominio en "${node.learning_nodes?.title}" es del ${Math.round(node.mastery_level * 100)}%. Este nodo requiere atención inmediata.`,
            priority: 10 - index,
            estimatedImpact: 'Alto',
            timeRequired: 45,
            nodeId: node.node_id,
            actionType: 'practice',
            metadata: { masteryLevel: node.mastery_level, difficulty: node.learning_nodes?.difficulty }
          });
        });

        // Análisis de oportunidades de crecimiento
        const growthNodes = progressData?.filter(p => 
          p.mastery_level >= 0.3 && p.mastery_level < 0.7
        ) || [];
        growthNodes.slice(0, 2).forEach((node, index) => {
          realRecs.push({
            id: `growth-${node.id}`,
            type: 'opportunity',
            title: `Avanzar en ${node.learning_nodes?.code}`,
            description: `Tienes una base sólida (${Math.round(node.mastery_level * 100)}%) en "${node.learning_nodes?.title}". Es el momento perfecto para llevarlo al siguiente nivel.`,
            priority: 7 - index,
            estimatedImpact: 'Medio',
            timeRequired: 30,
            nodeId: node.node_id,
            actionType: 'advance',
            metadata: { masteryLevel: node.mastery_level, tier: node.learning_nodes?.tier_priority }
          });
        });

        // Análisis de fortalezas
        const strongNodes = progressData?.filter(p => p.mastery_level >= 0.8) || [];
        if (strongNodes.length > 0) {
          realRecs.push({
            id: 'strengths',
            type: 'strength',
            title: `Fortalezas Identificadas`,
            description: `Excelente dominio en ${strongNodes.length} áreas. Considera conectar estos conocimientos con nuevos conceptos.`,
            priority: 5,
            estimatedImpact: 'Medio',
            timeRequired: 20,
            actionType: 'connect',
            metadata: { strongNodes: strongNodes.length }
          });
        }

        // Análisis de patrones de estudio
        const recentActivity = neuralEvents?.length || 0;
        if (recentActivity < 5) {
          realRecs.push({
            id: 'activity',
            type: 'next_step',
            title: 'Incrementar Actividad',
            description: 'Se detecta baja actividad reciente. Mantener la consistencia es clave para el progreso.',
            priority: 6,
            estimatedImpact: 'Alto',
            timeRequired: 15,
            actionType: 'engage',
            metadata: { activityLevel: recentActivity }
          });
        }

        // Ordenar por prioridad
        realRecs.sort((a, b) => b.priority - a.priority);
        setRecommendations(realRecs);

      } catch (error) {
        console.error('Error generating recommendations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    generateRealRecommendations();
  }, [user?.id]);

  const handleActionClick = async (rec: RealRecommendation) => {
    setSelectedRec(rec.id);
    
    // Registrar interacción
    await supabase.from('neural_events').insert({
      user_id: user?.id,
      event_type: 'recommendation_action',
      component_source: 'RealAdaptiveEngine',
      event_data: {
        recommendationId: rec.id,
        actionType: rec.actionType,
        engagement: 0.8
      },
      neural_metrics: {
        adaptive_response: 1.0,
        user_intent: rec.actionType
      }
    });

    console.log('Executing recommendation action:', rec.actionType, rec.nodeId);
    
    setTimeout(() => setSelectedRec(null), 2000);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'urgent': return AlertTriangle;
      case 'opportunity': return TrendingUp;
      case 'strength': return Star;
      case 'next_step': return Target;
      default: return Brain;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'from-red-600 to-red-700';
      case 'opportunity': return 'from-yellow-600 to-orange-600';
      case 'strength': return 'from-green-600 to-emerald-600';
      case 'next_step': return 'from-blue-600 to-indigo-600';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-black/40 backdrop-blur-xl border-white/20">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mr-3"></div>
            <span className="text-white">Analizando tu progreso...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40 backdrop-blur-xl border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="w-6 h-6 text-cyan-400" />
          Motor de Recomendaciones Inteligentes
          <Badge className="bg-green-600 text-white ml-2">
            IA Activa
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AnimatePresence>
          {recommendations.map((rec, index) => {
            const Icon = getTypeIcon(rec.type);
            const isSelected = selectedRec === rec.id;
            
            return (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border border-white/20 bg-gradient-to-r ${getTypeColor(rec.type)}/10 hover:border-white/40 transition-all duration-300`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${getTypeColor(rec.type)}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{rec.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-white/70">
                        <Clock className="w-4 h-4" />
                        <span>{rec.timeRequired} min</span>
                        <Badge variant="outline" className="text-xs">
                          Impacto {rec.estimatedImpact}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-white/80 text-sm mb-4">{rec.description}</p>
                
                <Button
                  onClick={() => handleActionClick(rec)}
                  disabled={isSelected}
                  className={`w-full bg-gradient-to-r ${getTypeColor(rec.type)} hover:opacity-90`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Ejecutando...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Ejecutar Acción
                    </>
                  )}
                </Button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {recommendations.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <div className="text-white font-medium">¡Excelente trabajo!</div>
            <div className="text-white/70 text-sm">No hay recomendaciones urgentes en este momento.</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
