/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { motion } from 'framer-motion';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { X, Target, TrendingUp, Star } from 'lucide-react';

interface UserMetrics {
  totalNodes: number;
  totalCompleted: number;
  overallProgress: number;
  projectedScore: number;
  neuralPower: number;
}

interface Galaxy {
  id: string;
  name: string;
  completed: number;
  nodes: number;
}

interface VocationalPredictorProps {
  userProgress: UserMetrics;
  galaxies: Galaxy[];
  onClose: () => void;
}

export const VocationalPredictor: FC<VocationalPredictorProps> = ({
  userProgress,
  galaxies,
  onClose
}) => {
  const predictions = [
    {
      career: "IngenierÃ­a Civil",
      probability: 92,
      reason: "Excelente en matemÃ¡ticas y fÃ­sica",
      universities: ["UC", "UCh", "UTFSM"]
    },
    {
      career: "Medicina",
      probability: 87,
      reason: "Alto rendimiento en ciencias",
      universities: ["UC", "UCh", "UFRO"]
    },
    {
      career: "PsicologÃ­a",
      probability: 78,
      reason: "Fortaleza en comprensiÃ³n lectora",
      universities: ["UC", "UAI", "UDP"]
    }
  ];

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="max-w-2xl w-full"
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
      >
        <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="text-white">
                <h2 className="text-2xl font-bold flex items-center space-x-2">
                  <Target className="w-6 h-6 text-cyan-400" />
                  <span>PredicciÃ³n Vocacional IA</span>
                </h2>
                <p className="text-cyan-300 mt-1">
                  AnÃ¡lisis basado en tu perfil neurolÃ³gico de aprendizaje
                </p>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* MÃ©tricas del Usuario */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-cyan-400">
                  {userProgress.projectedScore}
                </div>
                <div className="text-white text-sm">ProyecciÃ³n PAES</div>
              </div>
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {userProgress.neuralPower}%
                </div>
                <div className="text-white text-sm">Poder Neural</div>
              </div>
              <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-400">
                  {userProgress.overallProgress}%
                </div>
                <div className="text-white text-sm">Progreso Global</div>
              </div>
            </div>

            {/* Predicciones de Carreras */}
            <div className="space-y-4">
              <div className="text-white font-bold flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>Carreras Recomendadas</span>
              </div>
              
              {predictions.map((prediction, index) => (
                <motion.div
                  key={prediction.career}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white font-medium">{prediction.career}</div>
                    <Badge 
                      className={`${
                        prediction.probability > 90 ? 'bg-green-600' :
                        prediction.probability > 80 ? 'bg-yellow-600' : 'bg-orange-600'
                      }`}
                    >
                      {prediction.probability}% compatibilidad
                    </Badge>
                  </div>
                  <div className="text-gray-300 text-sm mb-2">{prediction.reason}</div>
                  <div className="flex space-x-2">
                    {prediction.universities.map((uni) => (
                      <Badge key={uni} variant="outline" className="text-cyan-300 border-cyan-500/50">
                        {uni}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Acciones */}
            <div className="mt-6 flex space-x-3">
              <Button 
                className="flex-1 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Plan Personalizado
              </Button>
              <Button 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10"
                onClick={onClose}
              >
                Explorar MÃ¡s
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

