
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, TrendingUp, Brain, Target, Clock,
  Zap, Star, AlertCircle
} from 'lucide-react';
import { SkillNode } from '@/core/unified-education-system/EducationDataHub';

interface LearningAnalyticsProps {
  patterns: any;
  metrics: {
    totalStudyTime: number;
    nodesCompleted: number;
    averagePerformance: number;
    learningVelocity: number;
    predictionAccuracy: number;
  };
  skillNodes: SkillNode[];
}

export const LearningAnalytics: React.FC<LearningAnalyticsProps> = ({
  patterns,
  metrics,
  skillNodes
}) => {
  const subjectPerformance = skillNodes.reduce((acc, node) => {
    if (!acc[node.subject]) {
      acc[node.subject] = { total: 0, count: 0 };
    }
    acc[node.subject].total += node.masteryLevel;
    acc[node.subject].count++;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const subjectAverages = Object.entries(subjectPerformance).map(([subject, data]) => ({
    subject,
    average: data.total / data.count
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-gradient-to-br from-black/40 to-slate-900/40 backdrop-blur-xl border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            Análisis de Rendimiento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {subjectAverages.map((item, index) => (
            <motion.div
              key={item.subject}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-white capitalize">{item.subject}</span>
                <Badge className={`${
                  item.average > 75 ? 'bg-green-600' : 
                  item.average > 50 ? 'bg-yellow-600' : 'bg-red-600'
                }`}>
                  {Math.round(item.average)}%
                </Badge>
              </div>
              <Progress value={item.average} className="h-2" />
            </motion.div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-black/40 to-slate-900/40 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <Brain className="w-6 h-6 text-purple-400" />
            Métricas de Aprendizaje IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">
                {Math.round(metrics.learningVelocity * 100)}%
              </div>
              <div className="text-sm text-gray-400">Velocidad</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {Math.round(metrics.predictionAccuracy)}%
              </div>
              <div className="text-sm text-gray-400">Precisión IA</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-blue-600/20 rounded-lg border-l-4 border-blue-400">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-white text-sm">
                  Progreso acelerado en {patterns.strongSubjects?.length || 0} materias
                </span>
              </div>
            </div>
            
            <div className="p-3 bg-orange-600/20 rounded-lg border-l-4 border-orange-400">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-orange-400" />
                <span className="text-white text-sm">
                  Requiere refuerzo en {patterns.weakSubjects?.length || 0} áreas
                </span>
              </div>
            </div>

            <div className="p-3 bg-green-600/20 rounded-lg border-l-4 border-green-400">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-green-400" />
                <span className="text-white text-sm">
                  {metrics.nodesCompleted} nodos completados exitosamente
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
