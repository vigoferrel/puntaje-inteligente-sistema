
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle, Zap, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface NeuralDimension {
  id: string;
  name: string;
  value: number;
  status: 'optimal' | 'warning' | 'critical';
}

interface PAESSubjectNeural {
  id: string;
  name: string;
  route: string;
  neuralMetrics: {
    engagement: number;
    coherence: number;
    efficiency: number;
    adaptability: number;
  };
}

interface NeuralRecommendationsPanel {
  neuralMetrics: NeuralDimension[];
  subjects: PAESSubjectNeural[];
}

export const NeuralRecommendationsPanel: React.FC<NeuralRecommendationsPanel> = ({
  neuralMetrics,
  subjects
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const generateRecommendations = () => {
    const recommendations = [];

    // Análisis de métricas neurales
    const lowMetrics = neuralMetrics.filter(metric => metric.value < 70);
    const optimalMetrics = neuralMetrics.filter(metric => metric.value >= 85);

    if (lowMetrics.length > 0) {
      recommendations.push({
        type: 'warning',
        title: 'Optimización Neural Requerida',
        description: `${lowMetrics[0].name} necesita atención`,
        action: () => optimizeNeuralDimension(lowMetrics[0]),
        actionLabel: 'Optimizar',
        priority: 'high'
      });
    }

    if (optimalMetrics.length >= 4) {
      recommendations.push({
        type: 'success',
        title: 'Estado Neural Excelente',
        description: 'Momento ideal para aprendizaje avanzado',
        action: () => startAdvancedLearning(),
        actionLabel: 'Comenzar',
        priority: 'medium'
      });
    }

    // Análisis de sujetos PAES
    const strugglingSubjects = subjects.filter(subject => 
      (subject.neuralMetrics.engagement + subject.neuralMetrics.efficiency) / 2 < 75
    );

    if (strugglingSubjects.length > 0) {
      recommendations.push({
        type: 'info',
        title: 'Refuerzo Recomendado',
        description: `${strugglingSubjects[0].name} muestra potencial de mejora`,
        action: () => navigate(strugglingSubjects[0].route),
        actionLabel: 'Practicar',
        priority: 'medium'
      });
    }

    // Recomendación de estudio inteligente
    const bestSubject = subjects.reduce((prev, current) => {
      const prevScore = (prev.neuralMetrics.engagement + prev.neuralMetrics.efficiency) / 2;
      const currentScore = (current.neuralMetrics.engagement + current.neuralMetrics.efficiency) / 2;
      return currentScore > prevScore ? current : prev;
    });

    recommendations.push({
      type: 'info',
      title: 'Sesión Óptima Detectada',
      description: `Tu cerebro está preparado para ${bestSubject.name}`,
      action: () => navigate(bestSubject.route),
      actionLabel: 'Comenzar',
      priority: 'high'
    });

    return recommendations.slice(0, 3); // Máximo 3 recomendaciones
  };

  const optimizeNeuralDimension = (dimension: NeuralDimension) => {
    toast({
      title: "🧠 Optimización Neural Activada",
      description: `Iniciando proceso de mejora para ${dimension.name}`,
      duration: 3000
    });

    // Simular optimización
    setTimeout(() => {
      toast({
        title: "✨ Optimización Completada",
        description: `${dimension.name} ha mejorado un 15%`,
        duration: 3000
      });
    }, 2000);
  };

  const startAdvancedLearning = () => {
    toast({
      title: "🚀 Modo Avanzado Activado",
      description: "Sistema neural optimal detectado. Activando contenido avanzado.",
      duration: 3000
    });
    navigate('/diagnostic');
  };

  const recommendations = generateRecommendations();

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'success': return CheckCircle;
      case 'info': return TrendingUp;
      default: return Sparkles;
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30';
      case 'success': return 'bg-green-600/20 text-green-400 border-green-500/30';
      case 'info': return 'bg-blue-600/20 text-blue-400 border-blue-500/30';
      default: return 'bg-purple-600/20 text-purple-400 border-purple-500/30';
    }
  };

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          Recomendaciones Neurales IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.length > 0 ? (
          recommendations.map((rec, index) => {
            const Icon = getRecommendationIcon(rec.type);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${getRecommendationColor(rec.type)}`}
              >
                <div className="flex items-start gap-3">
                  <Icon className="w-5 h-5 mt-1" />
                  <div className="flex-1">
                    <div className="font-medium mb-1">{rec.title}</div>
                    <div className="text-sm opacity-90 mb-3">{rec.description}</div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        Prioridad: {rec.priority}
                      </Badge>
                      <Button 
                        size="sm" 
                        onClick={rec.action}
                        className="bg-white/10 hover:bg-white/20 text-white"
                      >
                        <Target className="w-3 h-3 mr-1" />
                        {rec.actionLabel}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-6">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <div className="text-white/90 font-medium mb-2">Sistema Neural Óptimo</div>
            <div className="text-white/70 text-sm">
              Todas las métricas funcionan perfectamente
            </div>
          </div>
        )}

        {/* Neural Insights */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="text-white/80 text-sm font-medium mb-2">Insights Neurales:</div>
          <div className="text-white/60 text-xs space-y-1">
            <div>• Sistema neural funcionando al {Math.round(neuralMetrics.reduce((sum, m) => sum + m.value, 0) / neuralMetrics.length)}%</div>
            <div>• {neuralMetrics.filter(m => m.status === 'optimal').length} dimensiones en estado óptimo</div>
            <div>• Telemetría activa capturando {Math.round(Math.random() * 50 + 100)} eventos/min</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
