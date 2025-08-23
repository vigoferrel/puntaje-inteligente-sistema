/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { UnifiedButton } from '../../components/ui/unified-button';
import { useProductionNavigation } from '../../hooks/useProductionNavigation';
import { Navigation, Target, Brain, Zap } from 'lucide-react';

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

export const NeuralNavigationWidget: FC<NeuralNavigationWidgetProps> = ({
  subjects,
  onNavigate
}) => {
  const { navigateToRoute } = useProductionNavigation();

  const getRecommendedSubject = () => {
    return subjects.reduce((prev, current) => {
      const prevScore = (prev.neuralMetrics.engagement + prev.neuralMetrics.adaptability) / 2;
      const currentScore = (current.neuralMetrics.engagement + current.neuralMetrics.adaptability) / 2;
      return currentScore > prevScore ? current : prev;
    });
  };

  const handleNavigateToSubject = (subject: PAESSubjectNeural) => {
    onNavigate(subject);
    console.log(`ðŸŽ¯ NavegaciÃ³n Neural: ${subject.name}`);
    navigateToRoute(subject.route);
  };

  const recommendedSubject = getRecommendedSubject();
  const finalScore = Math.round((recommendedSubject.neuralMetrics.engagement + recommendedSubject.neuralMetrics.adaptability) / 2);

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Navigation className="w-5 h-5 text-cyan-400" />
          NavegaciÃ³n Neural Inteligente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gradient-to-r from-cyan-600/20 to-purple-600/20 rounded-lg p-4 border border-cyan-500/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-cyan-400" />
              <span className="text-white font-medium">RecomendaciÃ³n Neural</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span className="text-yellow-400 text-sm font-bold">
                {finalScore}%
              </span>
            </div>
          </div>
          
          <div className="text-white/90 font-medium mb-2">{recommendedSubject.name}</div>
          <div className="text-white/70 text-sm mb-3">
            Ã“ptimo para tu contexto actual
          </div>
          
          <UnifiedButton
            onClick={() => handleNavigateToSubject(recommendedSubject)}
            variant="neural"
            className="w-full"
            icon={<Target className="w-4 h-4" />}
          >
            Acceder con Neural
          </UnifiedButton>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {subjects.slice(0, 4).map((subject) => {
            const quickScore = Math.round((subject.neuralMetrics.engagement + subject.neuralMetrics.efficiency) / 2);
            
            return (
              <UnifiedButton
                key={subject.id}
                onClick={() => handleNavigateToSubject(subject)}
                className="bg-white/10 hover:bg-white/20 text-white text-xs p-2 h-auto flex flex-col gap-1"
              >
                <span className="font-medium">{subject.name.split(' ')[0]}</span>
                <span className="text-cyan-400 text-xs">
                  {quickScore}%
                </span>
              </UnifiedButton>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

