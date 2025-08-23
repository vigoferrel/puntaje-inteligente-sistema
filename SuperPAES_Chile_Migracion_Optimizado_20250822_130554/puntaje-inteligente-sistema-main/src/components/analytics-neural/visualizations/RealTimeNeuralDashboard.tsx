/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Target, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import type { UserResponse, UserScoreHistory } from '../../../core/scoring/types';

interface RealTimeNeuralDashboardProps {
  userId: string;
  userHistory: UserScoreHistory;
  currentResponse: UserResponse;
  userType: 'estudiante' | 'profesor' | 'administrador';
}

export const RealTimeNeuralDashboard: React.FC<RealTimeNeuralDashboardProps> = ({
  userId,
  userHistory,
  currentResponse,
  userType
}) => {
  // Calcular mÃ©tricas bÃ¡sicas
  const totalResponses = userHistory.scores.length;
  const correctResponses = userHistory.scores.filter(s => s.value > 500).length;
  const accuracy = totalResponses > 0 ? (correctResponses / totalResponses) * 100 : 0;
  const averageScore = totalResponses > 0 ? 
    userHistory.scores.reduce((sum, s) => sum + s.value, 0) / totalResponses : 0;

  // Calcular velocidad de aprendizaje
  let learningVelocity = 50;
  if (userHistory.scores.length >= 3) {
    const recent = userHistory.scores.slice(-3);
    const older = userHistory.scores.slice(-6, -3);
    if (older.length > 0) {
      const recentAvg = recent.reduce((sum, s) => sum + s.value, 0) / recent.length;
      const olderAvg = older.reduce((sum, s) => sum + s.value, 0) / older.length;
      learningVelocity = Math.min(100, Math.max(0, 50 + ((recentAvg - olderAvg) / 10)));
    }
  }

  // Calcular carga cognitiva
  const cognitiveLoad = Math.min(100, Math.max(0, accuracy < 50 ? 50 : 20));
  
  // Calcular engagement
  const engagement = Math.min(100, Math.max(0, 100 - cognitiveLoad + (learningVelocity / 2)));

  const getColorByUserType = () => {
    switch (userType) {
      case 'estudiante':
        return 'from-cyan-500 to-blue-500';
      case 'profesor':
        return 'from-green-500 to-emerald-500';
      case 'administrador':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getPerformanceLevel = (score: number) => {
    if (score >= 85) return { level: 'Excelente', color: 'text-green-400' };
    if (score >= 70) return { level: 'Avanzado', color: 'text-blue-400' };
    if (score >= 55) return { level: 'Intermedio', color: 'text-yellow-400' };
    if (score >= 40) return { level: 'BÃ¡sico', color: 'text-orange-400' };
    return { level: 'Inicial', color: 'text-red-400' };
  };

  const performance = getPerformanceLevel(averageScore / 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center space-x-3 mb-2">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="w-8 h-8 text-cyan-400" />
          </motion.div>
          <h3 className="text-xl font-bold text-white">
            Analytics Neural en Tiempo Real
          </h3>
        </div>
        <p className="text-gray-300 text-sm">
          Monitoreo cognitivo avanzado para {userType}
        </p>
      </motion.div>

      {/* MÃ©tricas principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="w-5 h-5 text-green-400 mr-2" />
                <span className="text-sm text-gray-300">PrecisiÃ³n</span>
              </div>
              <div className="text-2xl font-bold text-green-400">
                {Math.round(accuracy)}%
              </div>
              <div className="text-xs text-gray-400">
                {correctResponses}/{totalResponses}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Zap className="w-5 h-5 text-yellow-400 mr-2" />
                <span className="text-sm text-gray-300">Velocidad</span>
              </div>
              <div className="text-2xl font-bold text-yellow-400">
                {Math.round(learningVelocity)}%
              </div>
              <div className="text-xs text-gray-400">
                Aprendizaje
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Brain className="w-5 h-5 text-purple-400 mr-2" />
                <span className="text-sm text-gray-300">Carga</span>
              </div>
              <div className="text-2xl font-bold text-purple-400">
                {Math.round(cognitiveLoad)}%
              </div>
              <div className="text-xs text-gray-400">
                Cognitiva
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-cyan-400 mr-2" />
                <span className="text-sm text-gray-300">Engagement</span>
              </div>
              <div className="text-2xl font-bold text-cyan-400">
                {Math.round(engagement)}%
              </div>
              <div className="text-xs text-gray-400">
                Nivel
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Respuesta actual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className={`bg-gradient-to-r ${getColorByUserType()}/20 border-white/30`}>
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Respuesta Neural Actual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-300 mb-1">Habilidad</div>
                <Badge variant="outline" className="text-white border-white/30">
                  {currentResponse.skill.toUpperCase()}
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-300 mb-1">Score</div>
                <div className="text-xl font-bold text-white">
                  {currentResponse.score}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-300 mb-1">Nivel</div>
                <div className={`text-lg font-semibold ${performance.color}`}>
                  {performance.level}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* InformaciÃ³n del usuario */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center text-gray-400 text-sm"
      >
        <div>Usuario: {userId} | Tipo: {userType}</div>
        <div>Respuestas totales: {totalResponses} | Ãšltima actualizaciÃ³n: {new Date().toLocaleTimeString()}</div>
      </motion.div>
    </div>
  );
};
