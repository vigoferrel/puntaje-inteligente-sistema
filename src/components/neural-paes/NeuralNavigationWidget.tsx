
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

// Sistema de recomendación inteligente con contexto temporal
const getTimeBasedMultiplier = (subjectId: string): number => {
  const hour = new Date().getHours();
  
  switch (subjectId) {
    case 'matematica-m1':
    case 'matematica-m2':
      // Matemáticas mejor en mañanas (8-12h) y tardes tempranas (14-17h)
      return (hour >= 8 && hour <= 12) || (hour >= 14 && hour <= 17) ? 1.3 : 0.9;
    
    case 'ciencias':
      // Ciencias mejor en tardes (15-19h) cuando hay más concentración
      return hour >= 15 && hour <= 19 ? 1.2 : 0.95;
    
    case 'historia':
      // Historia mejor en horarios de reflexión (10-12h, 16-18h)
      return (hour >= 10 && hour <= 12) || (hour >= 16 && hour <= 18) ? 1.1 : 1.0;
    
    case 'competencia-lectora':
      // Lectura adaptable, pero mejor en momentos tranquilos
      return hour >= 7 && hour <= 10 || hour >= 20 && hour <= 22 ? 1.15 : 1.0;
    
    default:
      return 1.0;
  }
};

// Sistema anti-repetición
const getAntiRepetitionMultiplier = (subjectId: string): number => {
  const lastRecommendation = localStorage.getItem('neural_last_recommendation');
  const recommendationHistory = JSON.parse(localStorage.getItem('neural_recommendation_history') || '[]');
  
  // Penalizar si fue la última recomendación
  if (lastRecommendation === subjectId) {
    return 0.5;
  }
  
  // Bonificar si no ha sido recomendado recientemente
  const recentCount = recommendationHistory.slice(-3).filter((id: string) => id === subjectId).length;
  return recentCount === 0 ? 1.3 : 1.0 - (recentCount * 0.2);
};

// Factor de novedad basado en última visita
const getNoveltyMultiplier = (subjectId: string): number => {
  const lastVisit = localStorage.getItem(`neural_last_visit_${subjectId}`);
  if (!lastVisit) return 1.4; // Nunca visitado = alta bonificación
  
  const daysSinceVisit = (Date.now() - parseInt(lastVisit)) / (1000 * 60 * 60 * 24);
  
  if (daysSinceVisit > 3) return 1.3;
  if (daysSinceVisit > 1) return 1.1;
  return 0.9;
};

export const NeuralNavigationWidget: React.FC<NeuralNavigationWidgetProps> = ({
  subjects,
  onNavigate
}) => {
  const navigate = useNavigate();

  const getRecommendedSubject = () => {
    return subjects.reduce((prev, current) => {
      // Métricas neurales base (normalizadas)
      const prevBase = (prev.neuralMetrics.engagement + prev.neuralMetrics.adaptability) / 2;
      const currentBase = (current.neuralMetrics.engagement + current.neuralMetrics.adaptability) / 2;
      
      // Aplicar multiplicadores inteligentes
      const prevScore = prevBase * 
        getTimeBasedMultiplier(prev.id) * 
        getAntiRepetitionMultiplier(prev.id) * 
        getNoveltyMultiplier(prev.id);
        
      const currentScore = currentBase * 
        getTimeBasedMultiplier(current.id) * 
        getAntiRepetitionMultiplier(current.id) * 
        getNoveltyMultiplier(current.id);
      
      console.log(`🧠 Neural Score - ${prev.name}: ${prevScore.toFixed(2)}, ${current.name}: ${currentScore.toFixed(2)}`);
      
      return currentScore > prevScore ? current : prev;
    });
  };

  const handleNavigateToSubject = (subject: PAESSubjectNeural) => {
    onNavigate(subject);
    
    // Registrar en historial anti-repetición
    const history = JSON.parse(localStorage.getItem('neural_recommendation_history') || '[]');
    history.push(subject.id);
    if (history.length > 10) history.shift(); // Mantener solo últimas 10
    localStorage.setItem('neural_recommendation_history', JSON.stringify(history));
    localStorage.setItem('neural_last_recommendation', subject.id);
    
    // Registrar visita para factor novedad
    localStorage.setItem(`neural_last_visit_${subject.id}`, Date.now().toString());
    
    console.log(`🎯 Navegación Neural: ${subject.name} - Factor inteligente aplicado`);
    navigate(subject.route);
  };

  const recommendedSubject = getRecommendedSubject();

  // Calcular score final para display
  const finalScore = Math.round(
    ((recommendedSubject.neuralMetrics.engagement + recommendedSubject.neuralMetrics.adaptability) / 2) *
    getTimeBasedMultiplier(recommendedSubject.id) *
    getAntiRepetitionMultiplier(recommendedSubject.id) *
    getNoveltyMultiplier(recommendedSubject.id)
  );

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Navigation className="w-5 h-5 text-cyan-400" />
          Navegación Neural Inteligente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recommended Subject - Ahora genuinamente inteligente */}
        <div className="bg-gradient-to-r from-cyan-600/20 to-purple-600/20 rounded-lg p-4 border border-cyan-500/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-cyan-400" />
              <span className="text-white font-medium">Recomendación Neural</span>
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
            Óptimo para tu contexto actual
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
          {subjects.slice(0, 4).map((subject) => {
            const quickScore = Math.round(
              (subject.neuralMetrics.engagement + subject.neuralMetrics.efficiency) / 2 * 
              getTimeBasedMultiplier(subject.id)
            );
            
            return (
              <Button
                key={subject.id}
                onClick={() => handleNavigateToSubject(subject)}
                className="bg-white/10 hover:bg-white/20 text-white text-xs p-2 h-auto flex flex-col gap-1"
              >
                <span className="font-medium">{subject.name.split(' ')[0]}</span>
                <span className="text-cyan-400 text-xs">
                  {quickScore}%
                </span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
