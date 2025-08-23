/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, Zap, TrendingUp } from 'lucide-react';

interface NeuralPrediction {
  area: string;
  currentScore: number;
  predictedScore: number;
  confidence: number;
  timeToGoal: string;
  recommendation: string;
}

export const NeuralScoringEngineFixed = () => {
  const [loading, setLoading] = useState(false);
  const [neuralPower, setNeuralPower] = useState(87);
  const [predictions, setPredictions] = useState<NeuralPrediction[]>([
    {
      area: 'Matematica M1',
      currentScore: 650,
      predictedScore: 720,
      confidence: 92,
      timeToGoal: '3 semanas',
      recommendation: 'Enfocarse en algebra lineal'
    },
    {
      area: 'Competencia Lectora',
      currentScore: 680,
      predictedScore: 750,
      confidence: 88,
      timeToGoal: '2 semanas',
      recommendation: 'Practicar comprension de textos complejos'
    },
    {
      area: 'Ciencias Naturales',
      currentScore: 580,
      predictedScore: 680,
      confidence: 78,
      timeToGoal: '4 semanas',
      recommendation: 'Reforzar conceptos de fisica'
    },
    {
      area: 'Historia y Geografia',
      currentScore: 690,
      predictedScore: 750,
      confidence: 85,
      timeToGoal: '3 semanas',
      recommendation: 'Estudiar procesos historicos chilenos'
    }
  ]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30"
      >
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Brain className="w-6 h-6 text-purple-400" />
          <span className="text-white font-bold">Neural Power</span>
        </div>
        <div className="text-3xl font-bold text-white mb-1">{neuralPower}%</div>
        <div className="text-purple-300 text-sm">Confianza del Sistema</div>
      </motion.div>

      <div className="space-y-3">
        {predictions.map((prediction, index) => (
          <motion.div
            key={prediction.area}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-white/10"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-purple-400" />
                <span className="text-white font-medium">{prediction.area}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-white/60">Confianza:</span>
                <span className="text-purple-400 font-bold">{prediction.confidence}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="text-center">
                <div className="text-lg font-bold text-white">{prediction.currentScore}</div>
                <div className="text-xs text-white/60">Actual</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">{prediction.predictedScore}</div>
                <div className="text-xs text-white/60">Prediccion</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs mb-3">
              <div className="flex items-center space-x-1 text-cyan-400">
                <Zap className="w-3 h-3" />
                <span>{prediction.timeToGoal}</span>
              </div>
              <div className="flex items-center space-x-1 text-green-400">
                <TrendingUp className="w-3 h-3" />
                <span>+{prediction.predictedScore - prediction.currentScore}</span>
              </div>
            </div>

            <div className="mt-3 p-2 bg-black/20 rounded-lg">
              <div className="text-xs text-white/80">{prediction.recommendation}</div>
            </div>

            <div className="mt-3 w-full bg-white/20 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${prediction.confidence}%` }}
                transition={{ duration: 1, delay: index * 0.2 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
