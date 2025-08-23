/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion } from 'framer-motion';
import { Brain, Zap, Target, Clock, BookOpen, Calculator, Globe, Microscope } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Checkbox } from '../../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import type { TPAESHabilidad } from '../../core/scoring/types';

interface SkillOption {
  id: TPAESHabilidad;
  name: string;
  description: string;
  icon: React.ReactNode;
  estimatedTime: number;
  nodeCount: number;
  color: string;
  domains: string[];
}

interface NeuralSkillSelectorProps {
  onSelectionComplete: (config: {
    selectedSkills: TPAESHabilidad[];
    difficulty: 'BASICO' | 'INTERMEDIO' | 'AVANZADO';
    questionCount: number;
    adaptiveMode: boolean;
  }) => void;
  onCancel: () => void;
}

export const NeuralSkillSelector: React.FC<NeuralSkillSelectorProps> = ({
  onSelectionComplete,
  onCancel
}) => {
  const [selectedSkills, setSelectedSkills] = useState<TPAESHabilidad[]>([]);
  const [difficulty, setDifficulty] = useState<'BASICO' | 'INTERMEDIO' | 'AVANZADO'>('INTERMEDIO');
  const [questionCount, setQuestionCount] = useState(15);
  const [adaptiveMode, setAdaptiveMode] = useState(true);

  const skillOptions: SkillOption[] = [
    {
      id: 'matematica',
      name: 'Matematicas',
      description: 'ÃƒÂlgebra, Geometria, Estadistica, Funciones',
      icon: <Calculator className="w-6 h-6" />,
      estimatedTime: 45,
      nodeCount: 12,
      color: 'from-blue-500 to-cyan-500',
      domains: ['ÃƒÂlgebra', 'Geometria', 'Estadistica', 'Calculo']
    },
    {
      id: 'lenguaje',
      name: 'Comprension Lectora',
      description: 'Analisis, Interpretacion, Evaluacion Critica',
      icon: <BookOpen className="w-6 h-6" />,
      estimatedTime: 40,
      nodeCount: 10,
      color: 'from-purple-500 to-pink-500',
      domains: ['Comprension', 'Analisis', 'Interpretacion', 'Evaluacion']
    },
    {
      id: 'ciencias',
      name: 'Ciencias Naturales',
      description: 'Biologia, Fisica, Quimica, Metodologia',
      icon: <Microscope className="w-6 h-6" />,
      estimatedTime: 50,
      nodeCount: 14,
      color: 'from-green-500 to-emerald-500',
      domains: ['Biologia', 'Fisica', 'Quimica', 'Metodologia']
    },
    {
      id: 'historia',
      name: 'Historia y Ciencias Sociales',
      description: 'Temporal, Fuentes, Multicausal, Critico',
      icon: <Globe className="w-6 h-6" />,
      estimatedTime: 35,
      nodeCount: 8,
      color: 'from-orange-500 to-red-500',
      domains: ['Pensamiento Temporal', 'Analisis de Fuentes', 'Multicausal', 'Critico']
    }
  ];

  const handleSkillToggle = (skillId: TPAESHabilidad) => {
    setSelectedSkills(prev => 
      prev.includes(skillId) 
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  const calculateTotalTime = () => {
    return selectedSkills.reduce((total, skillId) => {
      const skill = skillOptions.find(s => s.id === skillId);
      return total + (skill?.estimatedTime || 0);
    }, 0);
  };

  const calculateTotalNodes = () => {
    return selectedSkills.reduce((total, skillId) => {
      const skill = skillOptions.find(s => s.id === skillId);
      return total + (skill?.nodeCount || 0);
    }, 0);
  };

  const handleStart = () => {
    if (selectedSkills.length === 0) return;
    
    onSelectionComplete({
      selectedSkills,
      difficulty,
      questionCount,
      adaptiveMode
    });
  };

  const getDifficultyDescription = () => {
    switch (difficulty) {
      case 'BASICO':
        return 'Conceptos fundamentales y aplicaciones basicas';
      case 'INTERMEDIO':
        return 'Aplicaciones estandar y resolucion de problemas';
      case 'AVANZADO':
        return 'Analisis complejo y pensamiento critico avanzado';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center space-x-3">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity }
              }}
            >
              <Brain className="w-12 h-12 text-cyan-400" />
            </motion.div>
            <h1 className="text-4xl font-bold text-white">
              Selector Neural de Habilidades PAES
            </h1>
          </div>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Selecciona las habilidades que deseas evaluar con nuestro sistema neural inteligente. 
            El diagnostico se adaptara automaticamente a tu rendimiento en tiempo real.
          </p>
        </motion.div>

        {/* Skill Selection Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5" />
                Habilidades PAES Disponibles
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skillOptions.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer"
                  onClick={() => handleSkillToggle(skill.id)}
                >
                  <Card className={`${
                    selectedSkills.includes(skill.id) 
                      ? `bg-gradient-to-r ${skill.color} border-white/40 shadow-lg` 
                      : 'bg-white/5 border-white/20 hover:border-white/40'
                  } transition-all duration-300`}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <Checkbox 
                            checked={selectedSkills.includes(skill.id)}
                            onChange={() => handleSkillToggle(skill.id)}
                            className="mt-1"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="text-white">{skill.icon}</div>
                            <h3 className="text-white font-bold text-lg">{skill.name}</h3>
                          </div>
                          <p className="text-gray-300 text-sm mb-4">{skill.description}</p>
                          
                          {/* Domains */}
                          <div className="mb-4">
                            <div className="text-xs text-gray-400 mb-2">Dominios incluidos:</div>
                            <div className="flex flex-wrap gap-1">
                              {skill.domains.map((domain, idx) => (
                                <Badge 
                                  key={idx}
                                  variant="outline" 
                                  className="text-xs text-white border-white/30"
                                >
                                  {domain}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          {/* Stats */}
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span className="text-gray-300">{skill.estimatedTime} min</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Target className="w-3 h-3 text-gray-400" />
                                <span className="text-gray-300">{skill.nodeCount} nodos</span>
                              </div>
                            </div>
                            {selectedSkills.includes(skill.id) && (
                              <Badge className="bg-green-500 text-white text-xs">
                                Seleccionado
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Configuration Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Configuracion Neural Avanzada
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Difficulty */}
              <div className="space-y-3">
                <label className="text-white text-sm font-medium">Nivel de Dificultad</label>
                <Select value={difficulty} onValueChange={(value: unknown) => setDifficulty(value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BASICO">Ã°Å¸Å¸Â¢ Basico</SelectItem>
                    <SelectItem value="INTERMEDIO">Ã°Å¸Å¸Â¡ Intermedio</SelectItem>
                    <SelectItem value="AVANZADO">Ã°Å¸â€Â´ Avanzado</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-400">{getDifficultyDescription()}</p>
              </div>

              {/* Question Count */}
              <div className="space-y-3">
                <label className="text-white text-sm font-medium">Numero de Preguntas</label>
                <Select value={questionCount.toString()} onValueChange={(value) => setQuestionCount(Number(value))}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 preguntas (Rapido)</SelectItem>
                    <SelectItem value="15">15 preguntas (Estandar)</SelectItem>
                    <SelectItem value="20">20 preguntas (Completo)</SelectItem>
                    <SelectItem value="25">25 preguntas (Exhaustivo)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-400">
                  Tiempo estimado: {Math.round((questionCount * 2.5))} minutos
                </p>
              </div>

              {/* Adaptive Mode */}
              <div className="space-y-3">
                <label className="text-white text-sm font-medium">Modo Adaptativo</label>
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <Checkbox 
                    checked={adaptiveMode}
                    onChange={() => setAdaptiveMode(!adaptiveMode)}
                  />
                  <div>
                    <div className="text-white text-sm">IA Neural Activa</div>
                    <div className="text-xs text-gray-400">
                      Ajuste automatico de dificultad
                    </div>
                  </div>
                </div>
                {adaptiveMode && (
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs text-cyan-400">Sistema neural activado</span>
                  </div>
                )}
              </div>

              {/* Neural Features */}
              <div className="space-y-3">
                <label className="text-white text-sm font-medium">Caracteristicas Neurales</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">Analytics en tiempo real</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Predicciones PAES</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300">Recomendaciones IA</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span className="text-gray-300">Integracion calendario</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Summary Panel */}
        {selectedSkills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-200/30">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-cyan-400">{selectedSkills.length}</div>
                    <div className="text-sm text-gray-300">Habilidades</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-400">{questionCount}</div>
                    <div className="text-sm text-gray-300">Preguntas</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-400">{calculateTotalTime()}</div>
                    <div className="text-sm text-gray-300">Minutos</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-orange-400">{calculateTotalNodes()}</div>
                    <div className="text-sm text-gray-300">Nodos</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-yellow-400">{difficulty}</div>
                    <div className="text-sm text-gray-300">Dificultad</div>
                  </div>
                </div>
                
                {/* Selected Skills Preview */}
                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="text-sm text-gray-300 mb-3">Habilidades seleccionadas:</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map(skillId => {
                      const skill = skillOptions.find(s => s.id === skillId);
                      return skill ? (
                        <Badge 
                          key={skillId}
                          className={`bg-gradient-to-r ${skill.color} text-white`}
                        >
                          {skill.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center space-x-6"
        >
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-white/30 text-white hover:bg-white/10 px-8 py-3"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleStart}
            disabled={selectedSkills.length === 0}
            className={`px-8 py-3 text-white font-semibold ${
              selectedSkills.length === 0 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600'
            }`}
          >
            {selectedSkills.length === 0 ? (
              'Selecciona al menos una habilidad'
            ) : (
              <>
                <Brain className="w-5 h-5 mr-2" />
                Iniciar Diagnostico Neural
              </>
            )}
          </Button>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-gray-400 text-sm space-y-2"
        >
          <p>
            Ã°Å¸Â§Â  Sistema Neural Inteligente integrado con <strong>ScoringSystemFacade</strong> y <strong>RealTimeNeuralAnalyzer</strong>
          </p>
          <p>
            Ã¢Å¡Â¡ Adaptacion automatica | Ã°Å¸â€œÅ  Analytics en tiempo real | Ã°Å¸Å½Â¯ Predicciones PAES precisas
          </p>
        </motion.div>
      </div>
    </div>
  );
};

