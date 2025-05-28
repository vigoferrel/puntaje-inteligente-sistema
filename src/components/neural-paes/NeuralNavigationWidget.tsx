
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navigation, Target, Brain, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

interface NeuralNavigationWidgetProps {
  subjects: PAESSubjectNeural[];
  onNavigate: (subject: PAESSubjectNeural) => void;
}

export const NeuralNavigationWidget: React.FC<NeuralNavigationWidgetProps> = ({
  subjects,
  onNavigate
}) => {
  const navigate = useNavigate();

  const getRecommendedSubject = () => {
    return subjects.reduce((prev, current) => {
      const prevScore = (prev.neuralMetrics.engagement + prev.neuralMetrics.adaptability) / 2;
      const currentScore = (current.neuralMetrics.engagement + current.neuralMetrics.adaptability) / 2;
      return currentScore > prevScore ? current : prev;
    });
  };

  const handleNavigateToSubject = (subject: PAESSubjectNeural) => {
    onNavigate(subject);
    navigate(subject.route);
  };

  const recommendedSubject = getRecommendedSubject();

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Navigation className="w-5 h-5 text-cyan-400" />
          Navegación Neural Inteligente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recommended Subject */}
        <div className="bg-gradient-to-r from-cyan-600/20 to-purple-600/20 rounded-lg p-4 border border-cyan-500/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-cyan-400" />
              <span className="text-white font-medium">Recomendación Neural</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span className="text-yellow-400 text-sm font-bold">
                {Math.round((recommendedSubject.neuralMetrics.engagement + recommendedSubject.neuralMetrics.adaptability) / 2)}%
              </span>
            </div>
          </div>
          
          <div className="text-white/90 font-medium mb-2">{recommendedSubject.name}</div>
          <div className="text-white/70 text-sm mb-3">
            Óptimo para tu estado neural actual
          </div>
          
          <Button
            onClick={() => handleNavigateToSubject(recommendedSubject)}
            className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white"
          >
            <Target className="w-4 h-4 mr-2" />
            Acceder con Neural
          </Button>
        </div>

        {/* Quick Navigation Grid */}
        <div className="grid grid-cols-2 gap-2">
          {subjects.slice(0, 4).map((subject) => (
            <Button
              key={subject.id}
              onClick={() => handleNavigateToSubject(subject)}
              className="bg-white/10 hover:bg-white/20 text-white text-xs p-2 h-auto flex flex-col gap-1"
            >
              <span className="font-medium">{subject.name.split(' ')[0]}</span>
              <span className="text-cyan-400 text-xs">
                {Math.round((subject.neuralMetrics.engagement + subject.neuralMetrics.efficiency) / 2)}%
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
