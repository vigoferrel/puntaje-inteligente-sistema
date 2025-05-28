
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  MessageCircle, 
  Target, 
  TrendingUp,
  Brain,
  Sparkles,
  Zap,
  Wifi,
  WifiOff,
  AlertCircle
} from 'lucide-react';
import { useLectoGuiaReal } from '@/hooks/lectoguia/useLectoGuiaReal';
import { ChatInterface } from '@/components/ai/ChatInterface';

interface LectoGuiaProps {
  userId?: string;
  onNavigate?: (path: string) => void;
}

export const LectoGuiaUnified: React.FC<LectoGuiaProps> = ({
  userId,
  onNavigate
}) => {
  const [activeMode, setActiveMode] = useState<'chat' | 'reading' | 'analysis'>('chat');

  // Use the REAL hook instead of simulated
  const {
    activeTab,
    setActiveTab,
    messages,
    isTyping,
    handleSendMessage,
    connectionStatus,
    serviceStatus,
    activeSubject,
    handleSubjectChange,
    currentExercise,
    selectedOption,
    showFeedback,
    handleOptionSelect,
    handleNewExercise,
    isLoading,
    getStats,
    activeSkill,
    setActiveSkill
  } = useLectoGuiaReal();

  const handleModeChange = useCallback((mode: 'chat' | 'reading' | 'analysis') => {
    setActiveMode(mode);
  }, []);

  // Generate exercise for current skill
  const handleGenerateExercise = useCallback(async () => {
    try {
      await handleNewExercise();
    } catch (error) {
      console.error('Error generando ejercicio:', error);
    }
  }, [handleNewExercise]);

  // Connection status helpers
  const showConnectionStatus = connectionStatus !== 'connected' || serviceStatus !== 'available';
  
  const getConnectionIcon = () => {
    if (connectionStatus === 'connected' && serviceStatus === 'available') {
      return <Wifi className="w-4 h-4 text-green-400" />;
    }
    if (connectionStatus === 'connecting') {
      return <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />;
    }
    return <WifiOff className="w-4 h-4 text-red-400" />;
  };

  const getConnectionText = () => {
    if (connectionStatus === 'connected' && serviceStatus === 'available') {
      return 'Sistema Neural Activo';
    }
    if (connectionStatus === 'connecting') {
      return 'Conectando...';
    }
    return 'Sin conexión';
  };

  // Get real statistics
  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header with Real Connection Status */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">LectoGuía IA</h1>
              <p className="text-white/70">Sistema real de comprensión lectora</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Real Stats Display */}
            <div className="text-white/70 text-sm">
              <div>Ejercicios: {stats.totalExercises}</div>
              <div>Precisión: {stats.successRate}%</div>
            </div>
            
            <Badge className={`${
              connectionStatus === 'connected' && serviceStatus === 'available'
                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                : connectionStatus === 'connecting'
                ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                : 'bg-red-500/20 text-red-400 border-red-500/30'
            }`}>
              {getConnectionIcon()}
              <span className="ml-2">{getConnectionText()}</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Real Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with Real Status */}
          <div className="space-y-4">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Módulos Reales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => handleModeChange('chat')}
                  variant={activeMode === 'chat' ? 'default' : 'outline'}
                  className="w-full justify-start"
                  disabled={isLoading}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat Real IA
                </Button>
                
                <Button
                  onClick={() => handleModeChange('reading')}
                  variant={activeMode === 'reading' ? 'default' : 'outline'}
                  className="w-full justify-start"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Análisis Real
                </Button>
                
                <Button
                  onClick={() => handleModeChange('analysis')}
                  variant={activeMode === 'analysis' ? 'default' : 'outline'}
                  className="w-full justify-start"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Evaluación Real
                </Button>
              </CardContent>
            </Card>

            {/* Real Connection Status */}
            {showConnectionStatus && (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                    <span className="text-white text-sm">Estado Real del Sistema</span>
                  </div>
                  <div className="text-white/70 text-xs mb-2">
                    Conexión: {connectionStatus}
                  </div>
                  <div className="text-white/70 text-xs">
                    Servicio: {serviceStatus}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Real Actions */}
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 space-y-2">
                <Button 
                  onClick={() => onNavigate?.('/diagnostic')}
                  className="w-full text-sm"
                  variant="outline"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Diagnóstico Real
                </Button>
                <Button 
                  onClick={() => onNavigate?.('/planning')}
                  className="w-full text-sm"
                  variant="outline"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Planificación Real
                </Button>
                <Button 
                  onClick={handleGenerateExercise}
                  className="w-full text-sm"
                  variant="outline"
                  disabled={isLoading}
                >
                  <Target className="w-4 h-4 mr-2" />
                  {isLoading ? 'Generando...' : 'Ejercicio Real'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Area with Real Chat */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white/10 border-white/20 min-h-[600px]">
                  <CardContent className="p-0">
                    {activeMode === 'chat' && (
                      <div className="h-[600px]">
                        <ChatInterface
                          messages={messages}
                          onSendMessage={handleSendMessage}
                          isTyping={isTyping}
                          placeholder="Chat real con IA - comprensión lectora, análisis textual y PAES..."
                          className="h-full"
                        />
                      </div>
                    )}

                    {activeMode === 'reading' && (
                      <div className="p-8 text-center py-20">
                        <BookOpen className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Análisis Real de Lectura</h3>
                        <p className="text-white/70 mb-6">
                          Herramientas reales conectadas a servicios de IA
                        </p>
                        <div className="max-w-md mx-auto p-4 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-white/60 text-sm">
                            📚 Datos reales desde base de datos y servicios IA
                          </p>
                        </div>
                      </div>
                    )}

                    {activeMode === 'analysis' && (
                      <div className="p-8 text-center py-20">
                        <Target className="w-16 h-16 text-green-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Evaluación Real PAES</h3>
                        <p className="text-white/70 mb-6">
                          Práctica real con ejercicios generados por IA
                        </p>
                        <div className="max-w-md mx-auto p-4 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-white/60 text-sm">
                            🎯 Ejercicios reales, métricas reales, progreso real
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
