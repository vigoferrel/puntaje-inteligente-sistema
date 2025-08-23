import React, { useState, useEffect } from 'react';
import { Brain, Target, Lightbulb, Zap, BarChart3, RefreshCw, BookOpen, Users, Award } from 'lucide-react';
import { useNeuralPredictions } from '../../hooks/useNeuralPredictions';
import type { ExercisePerformance } from '../../services/NeuralPredictionService';
import { integratedSystemService } from '../../services/IntegratedSystemService';
import { PAES_EXERCISES } from '../../data/paes-exercises';
import { NODOS_COMPETENCIA_LECTORA, NODOS_MATEMATICA_M1, BLOOM_LEVELS } from '../../data/paesStructure';

export const NeuralPredictionDashboard: React.FC = () => {
  const {
    loading,
    error,
    generatePrediction,
    generatePersonalizedExercise
  } = useNeuralPredictions();

  const [showDetails, setShowDetails] = useState(false);
  const [quantumState, setQuantumState] = useState<any>(null);
  const [aiSystem, setAiSystem] = useState<any>(null);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [paesStats, setPaesStats] = useState<any>(null);

  useEffect(() => {
    // Obtener datos oficiales del sistema
    const loadOfficialData = () => {
      const currentQuantumState = integratedSystemService.getQuantumState();
      const currentAiSystem = integratedSystemService.getAISystem();
      const currentUserProgress = integratedSystemService.getUserProgress('default-user');
      
      setQuantumState(currentQuantumState);
      setAiSystem(currentAiSystem);
      setUserProgress(currentUserProgress);
      
      // Calcular estadísticas oficiales PAES
      const officialStats = calculateOfficialPAESStats();
      setPaesStats(officialStats);
      
      // Generar predicción con datos oficiales
      if (currentUserProgress && currentUserProgress.user_id) {
        generatePrediction(currentUserProgress.user_id, [] as ExercisePerformance[]);
      }
    };

    loadOfficialData();
    
    // Actualizar datos cada 30 segundos
    const interval = setInterval(loadOfficialData, 30000);
    return () => clearInterval(interval);
  }, [generatePrediction]);

  // Calcular estadísticas oficiales PAES
  const calculateOfficialPAESStats = () => {
    const totalExercises = PAES_EXERCISES.length;
    const exercisesBySubject = PAES_EXERCISES.reduce((acc, exercise) => {
      acc[exercise.subject] = (acc[exercise.subject] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const exercisesByDifficulty = PAES_EXERCISES.reduce((acc, exercise) => {
      acc[exercise.difficulty] = (acc[exercise.difficulty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const exercisesByBloom = PAES_EXERCISES.reduce((acc, exercise) => {
      acc[exercise.bloomLevel] = (acc[exercise.bloomLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const allNodos = [...NODOS_COMPETENCIA_LECTORA, ...NODOS_MATEMATICA_M1];
    const totalNodos = allNodos.length;
    const nodosByLevel = allNodos.reduce((acc: Record<number, number>, nodo) => {
      acc[nodo.nivel] = (acc[nodo.nivel] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return {
      totalExercises,
      exercisesBySubject,
      exercisesByDifficulty,
      exercisesByBloom,
      totalNodos,
      nodosByLevel,
      bloomLevels: BLOOM_LEVELS.length
    };
  };

  const handleGenerateExercise = async () => {
    if (userProgress && userProgress.user_id) {
      const exercise = await generatePersonalizedExercise(userProgress.user_id);
      if (exercise) {
        console.log('Ejercicio personalizado generado:', exercise);
      }
    }
  };

  const handleRefresh = () => {
    const currentQuantumState = integratedSystemService.getQuantumState();
    const currentAiSystem = integratedSystemService.getAISystem();
    const currentUserProgress = integratedSystemService.getUserProgress('default-user');
    
    setQuantumState(currentQuantumState);
    setAiSystem(currentAiSystem);
    setUserProgress(currentUserProgress);
    
    const officialStats = calculateOfficialPAESStats();
    setPaesStats(officialStats);
    
    if (currentUserProgress && currentUserProgress.user_id) {
      generatePrediction(currentUserProgress.user_id, [] as ExercisePerformance[]);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-500';
    if (confidence >= 0.6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-500';
    if (score >= 0.6) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Calcular métricas basadas en datos oficiales
  const getOfficialMetrics = () => {
    if (!quantumState || !paesStats) return { predictedScore: 0, confidence: 0, neuralFrequency: 0 };
    
    const predictedScore = quantumState.coherence || 0;
    const confidence = (quantumState.entanglement / 100) || 0;
    const neuralFrequency = (quantumState.bloom_levels / 10) || 0;
    
    return { predictedScore, confidence, neuralFrequency };
  };

  const metrics = getOfficialMetrics();

  if (loading) {
    return (
      <div className="neural-prediction-dashboard bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-slate-300">Cargando datos oficiales PAES...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="neural-prediction-dashboard bg-gradient-to-br from-red-900/20 to-red-800/20 rounded-xl p-6 border border-red-700/50">
        <div className="flex items-center text-red-400">
          <Brain className="w-5 h-5 mr-2" />
          <span>Error en predicción neural: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="neural-prediction-dashboard bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Brain className="w-6 h-6 mr-3 text-blue-400" />
          <h2 className="text-xl font-bold text-white">Predicción Neural PAES Oficial</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700"
            title="Actualizar datos oficiales"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            {showDetails ? 'Ocultar' : 'Ver'} detalles
          </button>
        </div>
      </div>

      {/* Estadísticas Oficiales PAES */}
      {paesStats && (
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 mb-6">
          <div className="flex items-center mb-4">
            <BookOpen className="w-5 h-5 mr-2 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Base de Datos Oficial PAES</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Ejercicios Totales:</span>
              <div className="text-green-400 font-semibold">{paesStats.totalExercises}</div>
            </div>
            <div>
              <span className="text-slate-400">Nodos Educativos:</span>
              <div className="text-blue-400 font-semibold">{paesStats.totalNodos}</div>
            </div>
            <div>
              <span className="text-slate-400">Niveles Bloom:</span>
              <div className="text-yellow-400 font-semibold">{paesStats.bloomLevels}</div>
            </div>
            <div>
              <span className="text-slate-400">Materias:</span>
              <div className="text-purple-400 font-semibold">{Object.keys(paesStats.exercisesBySubject).length}</div>
            </div>
          </div>
        </div>
      )}

      {/* Estado Cuántico Real */}
      {quantumState && (
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 mb-6">
          <div className="flex items-center mb-4">
            <Zap className="w-5 h-5 mr-2 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Estado Cuántico del Sistema</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Coherencia:</span>
              <div className="text-green-400 font-semibold">{(quantumState.coherence * 100).toFixed(1)}%</div>
            </div>
            <div>
              <span className="text-slate-400">Entrelazamiento:</span>
              <div className="text-blue-400 font-semibold">{quantumState.entanglement}</div>
            </div>
            <div>
              <span className="text-slate-400">Entropía:</span>
              <div className="text-yellow-400 font-semibold">{(quantumState.entropy * 100).toFixed(1)}%</div>
            </div>
            <div>
              <span className="text-slate-400">Nodos:</span>
              <div className="text-purple-400 font-semibold">{quantumState.nodes}</div>
            </div>
          </div>
        </div>
      )}

      {/* Sistema IA Real */}
      {aiSystem && (
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 mb-6">
          <div className="flex items-center mb-4">
            <Brain className="w-5 h-5 mr-2 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Sistema IA</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Precisión:</span>
              <div className="text-green-400 font-semibold">{(aiSystem.model_accuracy * 100).toFixed(1)}%</div>
            </div>
            <div>
              <span className="text-slate-400">Tiempo Respuesta:</span>
              <div className="text-blue-400 font-semibold">{aiSystem.average_response_time}ms</div>
            </div>
            <div>
              <span className="text-slate-400">Solicitudes:</span>
              <div className="text-yellow-400 font-semibold">{aiSystem.requests_processed}</div>
            </div>
            <div>
              <span className="text-slate-400">Tokens:</span>
              <div className="text-purple-400 font-semibold">{aiSystem.token_usage}</div>
            </div>
          </div>
        </div>
      )}

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Puntaje Predicho */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center mb-2">
            <Target className="w-4 h-4 mr-2 text-blue-400" />
            <span className="text-sm text-slate-400">Puntaje Predicho PAES</span>
          </div>
          <div className={`text-2xl font-bold ${getScoreColor(metrics.predictedScore)}`}>
            {(metrics.predictedScore * 100).toFixed(1)}%
          </div>
        </div>

        {/* Confianza */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center mb-2">
            <BarChart3 className="w-4 h-4 mr-2 text-green-400" />
            <span className="text-sm text-slate-400">Confianza IA</span>
          </div>
          <div className={`text-2xl font-bold ${getConfidenceColor(metrics.confidence)}`}>
            {(metrics.confidence * 100).toFixed(1)}%
          </div>
        </div>

        {/* Frecuencia Neural */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center mb-2">
            <Zap className="w-4 h-4 mr-2 text-purple-400" />
            <span className="text-sm text-slate-400">Frecuencia Neural</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">
            {(metrics.neuralFrequency * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Recomendaciones Oficiales */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 mb-6">
        <div className="flex items-center mb-4">
          <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Recomendaciones IA PAES</h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-start">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <p className="text-slate-300 text-sm">Enfócate en ejercicios oficiales de aplicación práctica</p>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <p className="text-slate-300 text-sm">Revisa los errores comunes en tu área de estudio PAES</p>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <p className="text-slate-300 text-sm">Desafíate con ejercicios de mayor complejidad oficial</p>
          </div>
          {quantumState && (
            <div className="flex items-start">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-slate-300 text-sm">Estado cuántico: Coherencia {(quantumState.coherence * 100).toFixed(1)}% - Entrelazamiento {quantumState.entanglement}</p>
            </div>
          )}
        </div>
      </div>

      {/* Detalles Expandibles */}
      {showDetails && (
        <div className="space-y-4">
          {/* Distribución de Ejercicios por Materia */}
          {paesStats && (
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center mb-4">
                <BookOpen className="w-5 h-5 mr-2 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Distribución Oficial PAES</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                {Object.entries(paesStats.exercisesBySubject).map(([subject, count]) => (
                  <div key={subject}>
                    <span className="text-slate-400">{subject}:</span>
                    <div className="text-green-400 font-semibold">{count as number} ejercicios</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progreso del Usuario */}
          {userProgress && (
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center mb-4">
                <Users className="w-5 h-5 mr-2 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Progreso del Usuario</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Nivel Actual:</span>
                  <div className="text-green-400 font-semibold">{userProgress.current_level}</div>
                </div>
                <div>
                  <span className="text-slate-400">Puntos XP:</span>
                  <div className="text-blue-400 font-semibold">{userProgress.experience_points}</div>
                </div>
                <div>
                  <span className="text-slate-400">Racha Diaria:</span>
                  <div className="text-yellow-400 font-semibold">{userProgress.streaks?.daily || 0}</div>
                </div>
                <div>
                  <span className="text-slate-400">Logros:</span>
                  <div className="text-purple-400 font-semibold">{userProgress.achievements?.total || 0}</div>
                </div>
              </div>
            </div>
          )}

          {/* Camino de Aprendizaje Oficial */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center mb-4">
              <Award className="w-5 h-5 mr-2 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Camino de Aprendizaje PAES Oficial</h3>
            </div>
            <div className="space-y-2">
              {BLOOM_LEVELS.slice(0, 3).map((level, index) => (
                <div key={level.id} className="flex items-center">
                  <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center mr-3">
                    <span className="text-xs text-slate-300">{index + 1}</span>
                  </div>
                  <span className="text-slate-300 text-sm">{level.nombre} - {level.descripcion}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Próximo Ejercicio */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-3">Próximo Ejercicio PAES</h3>
            <div className="bg-slate-700/50 rounded p-3 mb-3">
              <code className="text-blue-400 text-sm">ejercicio_paes_oficial_001</code>
            </div>
            <button
              onClick={handleGenerateExercise}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
            >
              <Zap className="w-4 h-4 mr-2" />
              Generar Ejercicio PAES Personalizado
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-slate-700">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Datos oficiales PAES - Ejercicios: {paesStats?.totalExercises || 0} | Nodos: {paesStats?.totalNodos || 0}</span>
          <span>Última actualización: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};
