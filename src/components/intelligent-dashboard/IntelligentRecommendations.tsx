
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, Target, Clock, TrendingUp, Star,
  PlayCircle, BookOpen, Zap, AlertCircle
} from 'lucide-react';
import { IntelligentRecommendation } from '@/core/unified-education-system/EducationDataHub';

interface IntelligentRecommendationsProps {
  recommendations: IntelligentRecommendation[];
}

export const IntelligentRecommendations: React.FC<IntelligentRecommendationsProps> = ({
  recommendations
}) => {
  const priorityColors = {
    alta: 'from-red-600 to-orange-600',
    media: 'from-yellow-600 to-orange-600',
    baja: 'from-blue-600 to-cyan-600'
  };

  const typeIcons = {
    estudio: BookOpen,
    diagnostico: Brain,
    refuerzo: TrendingUp,
    avance: Target
  };

  const handleStartRecommendation = (recommendation: IntelligentRecommendation) => {
    console.log('🚀 Iniciando recomendación:', recommendation.description);
    // Aquí se implementaría la navegación a la actividad específica
  };

  return (
    <Card className="bg-gradient-to-br from-black/40 to-slate-900/40 backdrop-blur-xl border-cyan-500/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-3">
          <Brain className="w-6 h-6 text-cyan-400" />
          Recomendaciones IA
          <Badge className="bg-gradient-to-r from-cyan-600 to-blue-600">
            {recommendations.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.length === 0 ? (
          <div className="text-center py-8">
            <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <p className="text-white font-medium">¡Excelente trabajo!</p>
            <p className="text-gray-400 text-sm">No hay recomendaciones pendientes</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recommendations.map((recommendation, index) => {
              const Icon = typeIcons[recommendation.type];
              
              return (
                <motion.div
                  key={recommendation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${priorityColors[recommendation.priority]} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-white font-medium text-sm">
                          {recommendation.description}
                        </h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs border-${recommendation.priority === 'alta' ? 'red' : recommendation.priority === 'media' ? 'yellow' : 'blue'}-500/50`}
                        >
                          {recommendation.priority}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {recommendation.estimatedTime} min
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {recommendation.subject}
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          {Math.round(recommendation.confidence * 100)}% confianza
                        </div>
                      </div>

                      {/* Indicador de confianza */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Confianza IA</span>
                          <span className="text-cyan-400">{Math.round(recommendation.confidence * 100)}%</span>
                        </div>
                        <Progress value={recommendation.confidence * 100} className="h-1" />
                      </div>

                      {/* Razonamiento IA */}
                      {recommendation.reasoning.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs text-gray-400">Razonamiento IA:</p>
                          <ul className="text-xs text-gray-300 space-y-1">
                            {recommendation.reasoning.slice(0, 2).map((reason, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <Button
                        onClick={() => handleStartRecommendation(recommendation)}
                        size="sm"
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                      >
                        <PlayCircle className="w-3 h-3 mr-2" />
                        Comenzar
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
