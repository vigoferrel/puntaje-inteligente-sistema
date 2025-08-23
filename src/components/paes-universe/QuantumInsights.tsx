
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, Brain } from 'lucide-react';

interface QuantumInsightsProps {
  cinematicMetrics: {
    projectedScore: number;
    quantumPower: number;
  };
  predictions: {
    nextWeekScore: number;
    strongestSubject: string;
    improvementAreas: string[];
  };
  onQuantumAction: (action: string) => void;
}

export const QuantumInsights: React.FC<QuantumInsightsProps> = ({
  cinematicMetrics,
  predictions,
  onQuantumAction
}) => {
  return (
    <div className="h-full p-8 bg-gradient-to-br from-yellow-900 via-amber-900 to-black">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-400 mb-4">
          QUANTUM INSIGHTS
        </h1>
        <p className="text-white/80 text-xl">Predicciones IA para tu futuro académico</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <Card className="bg-black/40 border-yellow-500/30 backdrop-blur-xl">
          <CardContent className="p-6 text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
            <div className="text-3xl font-bold text-white mb-2">
              {cinematicMetrics.projectedScore}
            </div>
            <div className="text-yellow-400">Puntaje Proyectado</div>
            <div className="text-sm text-white/70 mt-2">
              Próxima semana: {predictions.nextWeekScore}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-green-500/30 backdrop-blur-xl">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-green-400" />
            <div className="text-xl font-bold text-white mb-2">
              {predictions.strongestSubject}
            </div>
            <div className="text-green-400">Fortaleza Principal</div>
            <Button 
              className="mt-4 bg-green-600 hover:bg-green-700"
              onClick={() => onQuantumAction('focus-strength')}
            >
              Potenciar
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-red-500/30 backdrop-blur-xl">
          <CardContent className="p-6 text-center">
            <Brain className="w-12 h-12 mx-auto mb-4 text-red-400" />
            <div className="text-lg font-bold text-white mb-2">
              Áreas de Mejora
            </div>
            <div className="space-y-2">
              {predictions.improvementAreas.map((area, index) => (
                <div key={index} className="text-red-400 text-sm">
                  {area}
                </div>
              ))}
            </div>
            <Button 
              className="mt-4 bg-red-600 hover:bg-red-700"
              onClick={() => onQuantumAction('improve-areas')}
            >
              Entrenar
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
