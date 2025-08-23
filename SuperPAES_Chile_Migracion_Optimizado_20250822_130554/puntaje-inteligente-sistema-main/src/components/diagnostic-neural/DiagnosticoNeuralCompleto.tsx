/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion } from 'framer-motion';
import { Brain, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { NeuralSkillSelector } from '../../components/diagnostic-neural/NeuralSkillSelector';
import { DiagnosticNeuralEngine, NeuralDiagnosticSession, NeuralDiagnosticConfig } from '../../services/diagnostic-neural/DiagnosticNeuralEngine';
import { RealTimeNeuralDashboard } from '../../components/analytics-neural/visualizations/RealTimeNeuralDashboard';
import { useRealTimeAnalytics } from '../../hooks/analytics-neural/useRealTimeAnalytics';
import type { UserResponse, UserScoreHistory, TPAESHabilidad } from '../../core/scoring/types';
import type { UserType } from '../../types/cinematic-universe';

interface DiagnosticoNeuralCompletoProps {
  userType: UserType;
  onComplete: () => void;
}

type ViewMode = 'selector' | 'execution' | 'results';

export const DiagnosticoNeuralCompleto: React.FC<DiagnosticoNeuralCompletoProps> = ({
  userType,
  onComplete
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('selector');
  const [currentSession, setCurrentSession] = useState<NeuralDiagnosticSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para analytics neurales
  const [userHistory, setUserHistory] = useState<UserScoreHistory>({
    userId: 'current-user',
    scores: []
  });
  const [currentResponse, setCurrentResponse] = useState<UserResponse | null>(null);

  // Hook de analytics neurales
  const {
    liveMetrics,
    instantTrends,
    cognitiveAnalysis,
    recommendations,
    overallScore,
    performanceLevel,
    updateAnalytics
  } = useRealTimeAnalytics({
    userId: 'current-user',
    userHistory,
    updateInterval: 2000,
    autoUpdate: true
  });

  // eslint-disable-next-line react-hooks/exhaustive-depsuseEffect(() => {
    window.scrollTo(0, 0);
  }, []);useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Obtener tema por tipo de usuario
  const getUserTheme = () => {
    switch (userType) {
      case 'estudiante':
        return {
          primary: 'from-cyan-400 to-purple-500',
          secondary: 'from-blue-500 to-cyan-400',
          accent: 'text-cyan-400',
          bg: 'from-blue-900 via-purple-900 to-indigo-900'
        };
      case 'profesor':
        return {
          primary: 'from-emerald-400 to-yellow-500',
          secondary: 'from-green-500 to-emerald-400',
          accent: 'text-emerald-400',
          bg: 'from-green-900 via-emerald-900 to-teal-900'
        };
      default:
        return {
          primary: 'from-purple-400 to-pink-500',
          secondary: 'from-indigo-500 to-purple-400',
          accent: 'text-purple-400',
          bg: 'from-purple-900 via-indigo-900 to-blue-900'
        };
    }
  };

  const theme = getUserTheme();

  // Manejar selecciÃ³n de habilidades y configuraciÃ³n
  const handleSelectionComplete = async (config: NeuralDiagnosticConfig) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('ðŸ§  Iniciando diagnÃ³stico neural con configuraciÃ³n:', config);
      
      // Generar evaluaciÃ³n neural
      const session = await DiagnosticNeuralEngine.generateNeuralEvaluation(config);
      setCurrentSession(session);
      setViewMode('execution');
      
      console.log('âœ… SesiÃ³n neural creada:', session.id);
      
    } catch (err) {
      console.error('âŒ Error creando sesiÃ³n neural:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar respuesta a pregunta
  const handleAnswerSelect = async (questionId: string, answer: string) => {
    if (!currentSession) return;

    try {
      setIsLoading(true);
      
      console.log('ðŸŽ¯ Procesando respuesta neural:', { questionId, answer });
      
      // Procesar respuesta con el motor neural
      const result = await DiagnosticNeuralEngine.processNeuralResponse(
        currentSession.id,
        questionId,
        answer
      );
      
      // Crear respuesta para analytics
      const userResponse: UserResponse = {
        skill: currentSession.questions[currentSession.currentQuestionIndex - 1]?.skill || 'lenguaje',
        score: result.score,
        response: answer,
        timestamp: new Date()
      };
      
      setCurrentResponse(userResponse);
      
      // Actualizar historial
      setUserHistory(prev => ({
        ...prev,
        scores: [...prev.scores, {
          value: result.score,
          timestamp: Date.now(),
          skill: userResponse.skill
        }]
      }));
      
      // Actualizar analytics neurales
      await updateAnalytics(userResponse);
      
      // Verificar si terminÃ³ el diagnÃ³stico
      if (!result.nextQuestion) {
        // Finalizar sesiÃ³n
        const finalResults = await DiagnosticNeuralEngine.finalizeNeuralSession(currentSession.id);
        console.log('ðŸ DiagnÃ³stico neural completado:', finalResults);
        setViewMode('results');
      }
      
      console.log('âœ… Respuesta procesada:', result);
      
    } catch (err) {
      console.error('âŒ Error procesando respuesta:', err);
      setError(err instanceof Error ? err.message : 'Error procesando respuesta');
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar cancelaciÃ³n
  const handleCancel = () => {
    setViewMode('selector');
    setCurrentSession(null);
    setError(null);
    setCurrentResponse(null);
    setUserHistory({ userId: 'current-user', scores: [] });
  };

  // Manejar reinicio
  const handleRestart = () => {
    setViewMode('selector');
    setCurrentSession(null);
    setError(null);
    setCurrentResponse(null);
    setUserHistory({ userId: 'current-user', scores: [] });
  };

  // Renderizar pregunta actual
  const renderCurrentQuestion = () => {
    if (!currentSession || currentSession.currentQuestionIndex >= currentSession.questions.length) {
      return null;
    }

    const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
    const progress = ((currentSession.currentQuestionIndex + 1) / currentSession.questions.length) * 100;

    return (
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className={`bg-gradient-to-r ${theme.primary} h-2 rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        {/* Question Info */}
        <div className="text-center text-white">
          <div className="text-sm text-gray-400 mb-2">
            Pregunta {currentSession.currentQuestionIndex + 1} de {currentSession.questions.length}
          </div>
          <div className="text-lg font-semibold">
            {currentQuestion.skill.toUpperCase()} - {currentQuestion.difficulty}
          </div>
        </div>

        {/* Question */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">
            {currentQuestion.question}
          </h3>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                disabled={isLoading}
                className="w-full p-4 text-left bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-white transition-all disabled:opacity-50"
              >
                <span className="font-semibold mr-3">{String.fromCharCode(65 + index)})</span>
                {option}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Node Info */}
        <div className={`bg-gradient-to-r ${theme.secondary}/20 border border-blue-200/30 rounded-lg p-4`}>
          <div className="text-sm text-gray-300">
            <div className="font-semibold text-white mb-2">InformaciÃ³n del Nodo:</div>
            <div>ðŸ“š {currentQuestion.nodeInfo.displayName}</div>
            <div>â±ï¸ Tiempo estimado: {currentQuestion.estimatedTime} minutos</div>
            <div>ðŸŽ¯ Ãrea: {currentQuestion.nodeInfo.contentArea}</div>
          </div>
        </div>
      </div>
    );
  };

  // Renderizar resultados
  const renderResults = () => {
    if (!currentSession) return null;

    const correctAnswers = currentSession.responses.filter(r => r.score > 500).length;
    const totalQuestions = currentSession.questions.length;
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Brain className={`w-12 h-12 ${theme.accent}`} />
            <h2 className="text-3xl font-bold text-white">
              DiagnÃ³stico Neural Completado
            </h2>
          </div>
          <p className="text-gray-300">
            AnÃ¡lisis completo de tus habilidades PAES con inteligencia artificial
          </p>
        </motion.div>

        {/* Resultados principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-200/30 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {correctAnswers}/{totalQuestions}
            </div>
            <div className="text-sm text-gray-300">Respuestas Correctas</div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-200/30 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {Math.round(accuracy)}%
            </div>
            <div className="text-sm text-gray-300">PrecisiÃ³n</div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-200/30 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {overallScore}%
            </div>
            <div className="text-sm text-gray-300">Score Neural</div>
          </div>
        </div>

        {/* Recomendaciones */}
        {recommendations.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">
              Recomendaciones Neurales
            </h3>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 ${theme.accent.replace('text-', 'bg-')} rounded-full mt-2`} />
                  <span className="text-gray-300">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botones de acciÃ³n */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={handleRestart}
            className={`bg-gradient-to-r ${theme.primary} hover:opacity-90 text-white px-8 py-3`}
          >
            <Brain className="w-5 h-5 mr-2" />
            Realizar Nuevo DiagnÃ³stico
          </Button>
          <Button
            onClick={onComplete}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 px-8 py-3"
          >
            Finalizar
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg}`}>
      <div className="container mx-auto px-6 py-8">
        
        {/* Header con navegaciÃ³n */}
        {viewMode !== 'selector' && (
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Selector
            </Button>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg"
          >
            <div className="text-red-400 font-semibold">Error:</div>
            <div className="text-red-300">{error}</div>
          </motion.div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className={`w-12 h-12 border-4 ${theme.accent.replace('text-', 'border-')} border-t-transparent rounded-full mx-auto mb-4`}
              />
              <div className="text-white font-semibold">Procesando con IA Neural...</div>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {viewMode === 'selector' && (
            <NeuralSkillSelector
              onSelectionComplete={handleSelectionComplete}
              onCancel={onComplete}
            />
          )}

          {viewMode === 'execution' && (
            <div className="space-y-8">
              {/* Analytics Dashboard */}
              {currentResponse && (
                <RealTimeNeuralDashboard
                  userId="current-user"
                  userHistory={userHistory}
                  currentResponse={currentResponse}
                  userType={userType === 'invitado' ? 'estudiante' : userType}
                />
              )}
              
              {/* Question */}
              {renderCurrentQuestion()}
            </div>
          )}

          {viewMode === 'results' && renderResults()}
        </div>

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && currentSession && (
          <div className="mt-8 p-4 bg-gray-900 text-green-400 rounded border border-gray-700 text-xs font-mono max-w-6xl mx-auto">
            <div className="text-yellow-400 font-bold mb-2">ðŸ§  Debug - Sistema Neural:</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-blue-400">SesiÃ³n Actual:</div>
                <div>â€¢ ID: {currentSession.id}</div>
                <div>â€¢ Pregunta: {currentSession.currentQuestionIndex + 1}/{currentSession.questions.length}</div>
                <div>â€¢ Activa: {currentSession.isActive ? 'SÃ­' : 'No'}</div>
                <div>â€¢ Respuestas: {currentSession.responses.length}</div>
              </div>
              <div>
                <div className="text-purple-400">MÃ©tricas Neurales:</div>
                <div>â€¢ Velocidad: {currentSession.neuralMetrics.learningVelocity}%</div>
                <div>â€¢ Carga Cognitiva: {currentSession.neuralMetrics.cognitiveLoad}%</div>
                <div>â€¢ AdaptaciÃ³n: {currentSession.neuralMetrics.adaptationLevel}</div>
                <div>â€¢ Rendimiento: {performanceLevel}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

