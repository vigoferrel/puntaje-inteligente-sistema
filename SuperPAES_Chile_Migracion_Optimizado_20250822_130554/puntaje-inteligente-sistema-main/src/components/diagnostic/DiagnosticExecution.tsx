/* eslint-disable react-refresh/only-export-components */

import React, { useState, useEffect, useMemo } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion } from 'framer-motion';
import { Brain, Zap, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { DiagnosticTest } from "../../types/diagnostic";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { QuestionView } from "./QuestionView";
import { QuestionNavigation } from "./QuestionNavigation";
import { useRealTimeAnalytics } from '../../hooks/analytics-neural/useRealTimeAnalytics';
import type { UserResponse, UserScoreHistory, TPAESHabilidad } from '../../core/scoring/types';

interface DiagnosticExecutionProps {
  test: DiagnosticTest;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  showHint: boolean;
  onAnswerSelect: (questionId: string, answer: string) => void;
  onRequestHint: () => void;
  onPreviousQuestion: () => void;
  onNextQuestion: () => void;
  onFinishTest: () => void;
}

export const DiagnosticExecution = ({
  test,
  currentQuestionIndex,
  answers,
  showHint,
  onAnswerSelect,
  onRequestHint,
  onPreviousQuestion,
  onNextQuestion,
  onFinishTest
}: DiagnosticExecutionProps) => {
  const currentQuestion = test.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === test.questions.length - 1;
  const selectedAnswer = answers[currentQuestion.id] || "";
  
  // Estados para analytics neurales
  const [sessionStartTime] = useState(Date.now());
  const [responseHistory, setResponseHistory] = useState<UserResponse[]>([]);
  
  // Crear historial de usuario basado en respuestas actuales
  const userHistory: UserScoreHistory = useMemo(() => ({
    userId: 'current-user',
    scores: responseHistory.map(response => ({
      value: response.score,
      timestamp: response.timestamp.getTime(),
      skill: response.skill
    }))
  }), [responseHistory]);

  // Hook de analytics neurales en tiempo real
  const {
    liveMetrics,
    instantTrends,
    cognitiveAnalysis,
    recommendations,
    overallScore,
    performanceLevel,
    updateAnalytics,
    isLoading: analyticsLoading
  } = useRealTimeAnalytics({
    userId: 'current-user',
    userHistory,
    updateInterval: 2000,
    autoUpdate: true
  });

  // Mapear skill del diagnostico a TPAESHabilidad
  const mapSkill = (skill: string): TPAESHabilidad => {
    const skillMap: Record<string, TPAESHabilidad> = {
      'INTERPRET_RELATE': 'lenguaje',
      'SOLVE_PROBLEMS': 'matematica',
      'REPRESENT': 'matematica',
      'PROCESS_ANALYZE': 'ciencias',
      'TEMPORAL_THINKING': 'historia'
    };
    return skillMap[skill] || 'lenguaje';
  };

  // Funcion para manejar respuestas con analytics neurales
  const handleAnswerWithAnalytics = async (questionId: string, answer: string) => {
    // Llamar la funcion original
    onAnswerSelect(questionId, answer);
    
    // Calcular puntaje basado en respuesta correcta
    const isCorrect = answer === currentQuestion.correctAnswer;
    const baseScore = isCorrect ? 800 : 400;
    const timeBonus = Math.max(0, 200 - (Date.now() - sessionStartTime) / 1000);
    const finalScore = Math.min(1000, baseScore + timeBonus);
    
    // Crear respuesta para analytics
    const userResponse: UserResponse = {
      skill: mapSkill(currentQuestion.skill),
      score: finalScore,
      response: answer,
      timestamp: new Date()
    };
    
    // Actualizar historial
    setResponseHistory(prev => [...prev, userResponse]);
    
    // Actualizar analytics neurales
    await updateAnalytics(userResponse);
  };

  // Obtener color del badge de rendimiento
  const getPerformanceBadgeColor = () => {
    switch (performanceLevel) {
      case 'excellent': return 'bg-green-500 text-white';
      case 'good': return 'bg-blue-500 text-white';
      case 'average': return 'bg-yellow-500 text-white';
      default: return 'bg-red-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Analytics Neurales en Tiempo Real */}
      {liveMetrics && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-200/30">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Zap className="w-5 h-5 text-cyan-400 mr-2" />
                <span className="text-sm text-gray-600">Velocidad Neural</span>
              </div>
              <div className="text-2xl font-bold text-cyan-600">
                {Math.round(liveMetrics.learningVelocity)}%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-200/30">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Brain className="w-5 h-5 text-purple-400 mr-2" />
                <span className="text-sm text-gray-600">Carga Cognitiva</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(liveMetrics.cognitiveLoad)}%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-200/30">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="w-5 h-5 text-green-400 mr-2" />
                <span className="text-sm text-gray-600">Engagement</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(liveMetrics.engagementLevel)}%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-200/30">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-orange-400 mr-2" />
                <span className="text-sm text-gray-600">Rendimiento</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {overallScore}%
              </div>
              <Badge className={`text-xs mt-1 ${getPerformanceBadgeColor()}`}>
                {performanceLevel}
              </Badge>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Estado Cognitivo */}
      {cognitiveAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-200/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-600" />
                Estado Cognitivo en Tiempo Real
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Carga Actual</span>
                    <span className="font-semibold">{Math.round(cognitiveAnalysis.currentLoad)}%</span>
                  </div>
                  <Progress
                    value={cognitiveAnalysis.currentLoad}
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Capacidad Restante</span>
                    <span className="font-semibold">{Math.round(cognitiveAnalysis.remainingCapacity)}%</span>
                  </div>
                  <Progress
                    value={cognitiveAnalysis.remainingCapacity}
                    className="h-2"
                  />
                </div>
              </div>
              
              {cognitiveAnalysis.suggestedBreak > 0 && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">
                    Recomendacion: Tomar un descanso de {cognitiveAnalysis.suggestedBreak} minutos
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recomendaciones Instantaneas */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-200/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-600" />
                Recomendaciones Neurales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 bg-white/50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2" />
                    <span className="text-sm text-gray-700">{rec}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Pregunta Principal */}
      <Card>
        <CardContent className="pt-6">
          <QuestionView
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            showHint={showHint}
            onAnswerSelect={handleAnswerWithAnalytics}
            onRequestHint={onRequestHint}
          />
        </CardContent>
      </Card>
      
      {/* Navegacion */}
      <QuestionNavigation
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={test.questions.length}
        canContinue={Boolean(selectedAnswer)}
        isLastQuestion={isLastQuestion}
        onPreviousQuestion={onPreviousQuestion}
        onNextQuestion={onNextQuestion}
        onFinishTest={onFinishTest}
      />

      {/* Debug Info - Analytics Neurales */}
      {process.env.NODE_ENV === 'development' && liveMetrics && (
        <Card className="bg-gray-900 text-green-400 border-gray-700">
          <CardContent className="p-4 text-xs font-mono">
            <div className="text-yellow-400 font-bold mb-2">Ã°Å¸Â§Â  Analytics Neurales en Tiempo Real:</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-blue-400">Metricas Actuales:</div>
                <div>Ã¢â‚¬Â¢ Velocidad: {Math.round(liveMetrics.learningVelocity)}%</div>
                <div>Ã¢â‚¬Â¢ Carga Cognitiva: {Math.round(liveMetrics.cognitiveLoad)}%</div>
                <div>Ã¢â‚¬Â¢ Engagement: {Math.round(liveMetrics.engagementLevel)}%</div>
                <div>Ã¢â‚¬Â¢ Fatiga: {Math.round(liveMetrics.fatigueLevel)}%</div>
              </div>
              <div>
                <div className="text-purple-400">Estado Neural:</div>
                <div>Ã¢â‚¬Â¢ Respuestas: {responseHistory.length}</div>
                <div>Ã¢â‚¬Â¢ Rendimiento: {performanceLevel}</div>
                <div>Ã¢â‚¬Â¢ Score General: {overallScore}%</div>
                <div>Ã¢â‚¬Â¢ Tendencia: {instantTrends?.recentTrend || 'stable'}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};


