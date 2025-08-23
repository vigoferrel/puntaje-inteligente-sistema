// ???? NEURAL ORCHESTRATION DASHBOARD ????
// Creado por ROO & OSCAR FERREL - Los Arquitectos del Futuro Educativo

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNeuralOrchestrator } from '../../hooks/useNeuralOrchestrator';
import { useBloom } from '../../hooks/useBloom';

interface AgentVisualization {
  name: string;
  status: 'thinking' | 'active' | 'completed' | 'idle';
  confidence: number;
  lastDecision: string;
  color: string;
  icon: string;
}

const NeuralOrchestrationDashboard: React.FC = () => {
  const {
    currentPath,
    agentDecisions,
    isOrchestrating,
    studentProfile,
    orchestrateLearning,
    simulateNodeProgress,
    getAgentInsights
  } = useNeuralOrchestrator();

  const { dashboard } = useBloom();
  
  const [selectedConcept, setSelectedConcept] = useState('');
  const [agentVisualizations, setAgentVisualizations] = useState<AgentVisualization[]>([
    {
      name: 'PathFinder',
      status: 'idle',
      confidence: 0,
      lastDecision: 'Esperando instrucciones...',
      color: '#FF6B6B',
      icon: '??'
    },
    {
      name: 'BloomNavigator',
      status: 'idle',
      confidence: 0,
      lastDecision: 'Esperando instrucciones...',
      color: '#4ECDC4',
      icon: '??'
    },
    {
      name: 'ContentGenerator',
      status: 'idle',
      confidence: 0,
      lastDecision: 'Esperando instrucciones...',
      color: '#45B7D1',
      icon: '??'
    },
    {
      name: 'AdaptiveTutor',
      status: 'idle',
      confidence: 0,
      lastDecision: 'Esperando instrucciones...',
      color: '#96CEB4',
      icon: '??'
    },
    {
      name: 'ProgressAnalyzer',
      status: 'idle',
      confidence: 0,
      lastDecision: 'Esperando instrucciones...',
      color: '#FFEAA7',
      icon: '??'
    }
  ]);

  // Actualizar visualizaciones de agentes basándose en decisiones
  useEffect(() => {
    if (agentDecisions.length > 0) {
      setAgentVisualizations(prev => 
        prev.map(agent => {
          const decision = agentDecisions.find(d => d.agentName === agent.name);
          if (decision) {
            return {
              ...agent,
              status: 'completed',
              confidence: decision.confidence,
              lastDecision: decision.decision
            };
          }
          return agent;
        })
      );
    }
  }, [agentDecisions]);

  // Simular actividad de agentes durante orquestación
  useEffect(() => {
    if (isOrchestrating) {
      const agentNames = ['PathFinder', 'BloomNavigator', 'ContentGenerator', 'AdaptiveTutor', 'ProgressAnalyzer'];
      
      agentNames.forEach((name, index) => {
        setTimeout(() => {
          setAgentVisualizations(prev =>
            prev.map(agent =>
              agent.name === name
                ? { ...agent, status: 'thinking', lastDecision: 'Analizando datos...' }
                : agent
            )
          );
          
          setTimeout(() => {
            setAgentVisualizations(prev =>
              prev.map(agent =>
                agent.name === name
                  ? { ...agent, status: 'active', lastDecision: 'Procesando información...' }
                  : agent
              )
            );
          }, 1000);
        }, index * 500);
      });
    }
  }, [isOrchestrating]);

  const handleOrchestrateLearning = async () => {
    if (!selectedConcept.trim()) {
      alert('Por favor, ingresa un concepto para aprender');
      return;
    }

    await orchestrateLearning(selectedConcept);
  };

  const handleSimulateProgress = async (nodeId: string) => {
    const score = Math.floor(Math.random() * 40) + 60; // 60-100
    const timeSpent = Math.floor(Math.random() * 20) + 10; // 10-30 minutos
    const mistakes = score < 80 ? ['Error conceptual', 'Tiempo insuficiente'] : [];

    await simulateNodeProgress(nodeId, score, timeSpent, mistakes);
  };

  const insights = getAgentInsights();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            ?? Neural Learning Orchestrator ??
          </h1>
          <p className="text-xl text-purple-200">
            Ecosistema Educativo Inteligente con 5 Agentes Especializados
          </p>
        </motion.div>

        {/* Control Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">?? Panel de Control</h2>
          
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Concepto a Aprender:
              </label>
              <input
                type="text"
                value={selectedConcept}
                onChange={(e) => setSelectedConcept(e.target.value)}
                placeholder="Ej: Ecuaciones lineales, Comprensión lectora, etc."
                className="w-full px-4 py-3 bg-white/20 border border-purple-300/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOrchestrateLearning}
              disabled={isOrchestrating}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isOrchestrating ? '?? Orquestando...' : '?? Iniciar Orquestación'}
            </motion.button>
          </div>
        </motion.div>

        {/* Student Profile */}
        {studentProfile && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4">?? Perfil del Estudiante</h2>
            
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-blue-500/20 rounded-lg p-4">
                <div className="text-blue-300 text-sm">Nivel Actual</div>
                <div className="text-white text-xl font-bold">{studentProfile.currentLevel}</div>
              </div>
              
              <div className="bg-green-500/20 rounded-lg p-4">
                <div className="text-green-300 text-sm">Estilo de Aprendizaje</div>
                <div className="text-white text-xl font-bold capitalize">{studentProfile.learningStyle}</div>
              </div>
              
              <div className="bg-yellow-500/20 rounded-lg p-4">
                <div className="text-yellow-300 text-sm">Ritmo</div>
                <div className="text-white text-xl font-bold capitalize">{studentProfile.pace}</div>
              </div>
              
              <div className="bg-purple-500/20 rounded-lg p-4">
                <div className="text-purple-300 text-sm">Motivación</div>
                <div className="text-white text-xl font-bold capitalize">{studentProfile.motivation}</div>
              </div>
            </div>

            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div>
                <div className="text-green-300 text-sm mb-2">Fortalezas:</div>
                <div className="text-white text-sm">
                  {studentProfile.strengths.length > 0 
                    ? studentProfile.strengths.join(', ') 
                    : 'Analizando...'}
                </div>
              </div>
              
              <div>
                <div className="text-red-300 text-sm mb-2">Áreas de Mejora:</div>
                <div className="text-white text-sm">
                  {studentProfile.weaknesses.length > 0 
                    ? studentProfile.weaknesses.join(', ') 
                    : 'Analizando...'}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Agents Grid */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          {agentVisualizations.map((agent, index) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-4 relative overflow-hidden"
            >
              {/* Status indicator */}
              <div className="absolute top-2 right-2">
                <div className={`w-3 h-3 rounded-full ${
                  agent.status === 'thinking' ? 'bg-yellow-400 animate-pulse' :
                  agent.status === 'active' ? 'bg-blue-400 animate-bounce' :
                  agent.status === 'completed' ? 'bg-green-400' :
                  'bg-gray-400'
                }`} />
              </div>

              <div className="text-center">
                <div className="text-4xl mb-2">{agent.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{agent.name}</h3>
                
                {/* Confidence bar */}
                <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${agent.confidence * 100}%` }}
                    className="h-2 rounded-full dynamic-bg"
                    data-dynamic-bg={agent.color}
                  />
                </div>
                
                <div className="text-xs text-purple-200 mb-2">
                  Confianza: {Math.round(agent.confidence * 100)}%
                </div>
                
                <div className="text-xs text-white bg-black/20 rounded p-2 min-h-[60px]">
                  {agent.lastDecision}
                </div>
              </div>

              {/* Thinking animation */}
              <AnimatePresence>
                {agent.status === 'thinking' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent dynamic-thinking-gradient"
                    data-agent-color={agent.color}
                  >
                    <motion.div
                      animate={{ x: ['0%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Learning Path Visualization */}
        {currentPath && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4">??? Ruta de Aprendizaje Generada</h2>
            
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="bg-purple-500/20 rounded-lg p-4 text-center">
                <div className="text-purple-300 text-sm">Nodos en la Ruta</div>
                <div className="text-white text-2xl font-bold">{currentPath.nodes.length}</div>
              </div>
              
              <div className="bg-blue-500/20 rounded-lg p-4 text-center">
                <div className="text-blue-300 text-sm">Duración Estimada</div>
                <div className="text-white text-2xl font-bold">{currentPath.estimatedDuration} min</div>
              </div>
              
              <div className="bg-green-500/20 rounded-lg p-4 text-center">
                <div className="text-green-300 text-sm">Confianza</div>
                <div className="text-white text-2xl font-bold">{Math.round(currentPath.confidence * 100)}%</div>
              </div>
              
              <div className="bg-yellow-500/20 rounded-lg p-4 text-center">
                <div className="text-yellow-300 text-sm">Adaptaciones</div>
                <div className="text-white text-2xl font-bold">{currentPath.adaptations.length}</div>
              </div>
            </div>

            {/* Nodes */}
            <div className="space-y-3">
              {currentPath.nodes.map((node, index) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{node.title}</div>
                      <div className="text-purple-200 text-sm">
                        {node.bloomLevel} • {node.subject} • {node.estimatedTime} min
                      </div>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSimulateProgress(node.id)}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white text-sm rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300"
                  >
                    ?? Simular Progreso
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Agent Insights */}
        {insights && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-4">?? Insights de Agentes</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-purple-300 mb-3">Estadísticas</h3>
                <div className="space-y-2">
                  <div className="text-white">
                    <span className="text-purple-200">Decisiones Totales:</span> {insights.totalDecisions}
                  </div>
                  <div className="text-white">
                    <span className="text-purple-200">Confianza Promedio:</span> {Math.round(insights.averageConfidence * 100)}%
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-purple-300 mb-3">Actividad por Agente</h3>
                <div className="space-y-1">
                  {Object.entries(insights.agentBreakdown).map(([agent, count]) => (
                    <div key={agent} className="text-white text-sm">
                      <span className="text-purple-200">{agent}:</span> {count} decisiones
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-purple-300 mb-3">Top Recomendaciones</h3>
                <div className="space-y-1">
                  {insights.topRecommendations.map((rec, index) => (
                    <div key={index} className="text-white text-sm">
                      • {rec}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NeuralOrchestrationDashboard;

