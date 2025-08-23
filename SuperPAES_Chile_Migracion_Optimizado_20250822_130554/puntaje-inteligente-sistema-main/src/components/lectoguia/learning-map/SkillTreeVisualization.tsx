/* eslint-disable react-refresh/only-export-components */

import React, { useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Progress } from '../../../components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../components/ui/tooltip';
import { 
  Brain, 
  Target, 
  BookOpen, 
  Zap,
  TrendingUp,
  Award,
  ArrowRight
} from 'lucide-react';
import { TLearningNode, TPAESHabilidad, TPAESPrueba, getHabilidadDisplayName } from '../../../types/system-types';
import { NodeProgress } from '../../../types/node-progress';
import { motion } from 'framer-motion';

interface SkillTreeVisualizationProps {
  skillLevels: Record<TPAESHabilidad, number>;
  nodes: TLearningNode[];
  nodeProgress: Record<string, NodeProgress>;
  selectedPrueba: TPAESPrueba;
  onNodeSelect: (nodeId: string) => void;
}

// Mapeo de habilidades por prueba con jerarquÃ­a
const SKILL_HIERARCHY: Record<TPAESPrueba, { basic: TPAESHabilidad[], intermediate: TPAESHabilidad[], advanced: TPAESHabilidad[] }> = {
  'COMPETENCIA_LECTORA': {
    basic: ['TRACK_LOCATE'],
    intermediate: ['INTERPRET_RELATE'],
    advanced: ['EVALUATE_REFLECT']
  },
  'MATEMATICA_1': {
    basic: ['REPRESENT'],
    intermediate: ['SOLVE_PROBLEMS'],
    advanced: ['MODEL', 'ARGUE_COMMUNICATE']
  },
  'MATEMATICA_2': {
    basic: ['REPRESENT'],
    intermediate: ['SOLVE_PROBLEMS'],
    advanced: ['MODEL', 'ARGUE_COMMUNICATE']
  },
  'CIENCIAS': {
    basic: ['IDENTIFY_THEORIES'],
    intermediate: ['PROCESS_ANALYZE'],
    advanced: ['APPLY_PRINCIPLES', 'SCIENTIFIC_ARGUMENT']
  },
  'HISTORIA': {
    basic: ['TEMPORAL_THINKING'],
    intermediate: ['SOURCE_ANALYSIS'],
    advanced: ['MULTICAUSAL_ANALYSIS', 'CRITICAL_THINKING', 'REFLECTION']
  }
};

export const SkillTreeVisualization: React.FC<SkillTreeVisualizationProps> = ({
  skillLevels,
  nodes,
  nodeProgress,
  selectedPrueba,
  onNodeSelect
}) => {
  const [selectedSkill, setSelectedSkill] = useState<TPAESHabilidad | null>(null);

  const hierarchy = SKILL_HIERARCHY[selectedPrueba] || { basic: [], intermediate: [], advanced: [] };
  
  // FunciÃ³n para obtener el color de la habilidad basado en el nivel
  const getSkillColor = (level: number) => {
    if (level >= 0.8) return 'from-green-400 to-green-600';
    if (level >= 0.6) return 'from-blue-400 to-blue-600';
    if (level >= 0.4) return 'from-yellow-400 to-yellow-600';
    if (level >= 0.2) return 'from-orange-400 to-orange-600';
    return 'from-gray-300 to-gray-500';
  };

  const getSkillStatus = (level: number) => {
    if (level >= 0.8) return { status: 'Maestro', icon: <Award className="h-4 w-4" /> };
    if (level >= 0.6) return { status: 'Avanzado', icon: <TrendingUp className="h-4 w-4" /> };
    if (level >= 0.4) return { status: 'Intermedio', icon: <Target className="h-4 w-4" /> };
    if (level >= 0.2) return { status: 'BÃ¡sico', icon: <BookOpen className="h-4 w-4" /> };
    return { status: 'Principiante', icon: <Zap className="h-4 w-4" /> };
  };

  // Obtener nodos relacionados con una habilidad
  const getNodesForSkill = (skill: TPAESHabilidad) => {
    return nodes.filter(node => node.skill === skill);
  };

  const renderSkillLevel = (skills: TPAESHabilidad[], levelName: string, levelIcon: React.ReactNode) => {
    if (skills.length === 0) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          {levelIcon}
          <span>{levelName}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill, index) => {
            const level = skillLevels[skill] || 0;
            const status = getSkillStatus(level);
            const relatedNodes = getNodesForSkill(skill);
            const completedNodes = relatedNodes.filter(node => 
              nodeProgress[node.id]?.status === 'completed'
            ).length;

            return (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-lg ${
                    selectedSkill === skill ? 'ring-2 ring-primary shadow-lg' : ''
                  }`}
                  onClick={() => setSelectedSkill(selectedSkill === skill ? null : skill)}
                >
                  <CardContent className="p-0">
                    {/* Header con gradiente */}
                    <div className={`bg-gradient-to-r ${getSkillColor(level)} p-4 text-white`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Brain className="h-5 w-5" />
                          <h4 className="font-semibold">
                            {getHabilidadDisplayName(skill)}
                          </h4>
                        </div>
                        <Badge className="bg-white/20 text-white border-white/30">
                          {Math.round(level * 100)}%
                        </Badge>
                      </div>
                      
                      <div className="mt-2">
                        <Progress 
                          value={level * 100} 
                          className="h-2 bg-white/20" 
                        />
                      </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {status.icon}
                          <span className="font-medium">{status.status}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {completedNodes}/{relatedNodes.length} nodos
                        </div>
                      </div>

                      {/* Nodos relacionados */}
                      {selectedSkill === skill && relatedNodes.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 border-t pt-3"
                        >
                          <h5 className="font-medium text-sm">Nodos de prÃ¡ctica:</h5>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {relatedNodes.map(node => {
                              const progress = nodeProgress[node.id];
                              const isCompleted = progress?.status === 'completed';
                              
                              return (
                                <div
                                  key={node.id}
                                  className="flex items-center justify-between p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                                >
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">{node.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {node.difficulty} â€¢ {node.estimatedTimeMinutes || 30} min
                                    </p>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant={isCompleted ? "secondary" : "default"}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onNodeSelect(node.id);
                                    }}
                                    className="ml-2"
                                  >
                                    {isCompleted ? 'Revisar' : 'Practicar'}
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}

                      {/* RecomendaciÃ³n de prÃ³ximos pasos */}
                      {level < 0.7 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                          <div className="flex items-start gap-2">
                            <Target className="h-4 w-4 text-blue-600 mt-0.5" />
                            <div className="text-sm">
                              <p className="font-medium text-blue-800">Siguiente objetivo:</p>
                              <p className="text-blue-600">
                                {level < 0.3 
                                  ? "Practica los conceptos bÃ¡sicos" 
                                  : level < 0.6 
                                    ? "Refuerza con ejercicios intermedios"
                                    : "Domina con problemas avanzados"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          Ãrbol de Habilidades
        </h3>
        <p className="text-muted-foreground">
          Desarrolla tus competencias paso a paso en {selectedPrueba}
        </p>
      </div>

      {/* Nivel BÃ¡sico */}
      {renderSkillLevel(
        hierarchy.basic, 
        "Habilidades Fundamentales", 
        <BookOpen className="h-5 w-5 text-green-600" />
      )}

      {/* Flecha de progresiÃ³n */}
      {hierarchy.basic.length > 0 && hierarchy.intermediate.length > 0 && (
        <div className="flex justify-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-px w-8 bg-border" />
            <ArrowRight className="h-5 w-5" />
            <div className="h-px w-8 bg-border" />
          </div>
        </div>
      )}

      {/* Nivel Intermedio */}
      {renderSkillLevel(
        hierarchy.intermediate, 
        "Habilidades Intermedias", 
        <Target className="h-5 w-5 text-blue-600" />
      )}

      {/* Flecha de progresiÃ³n */}
      {hierarchy.intermediate.length > 0 && hierarchy.advanced.length > 0 && (
        <div className="flex justify-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-px w-8 bg-border" />
            <ArrowRight className="h-5 w-5" />
            <div className="h-px w-8 bg-border" />
          </div>
        </div>
      )}

      {/* Nivel Avanzado */}
      {renderSkillLevel(
        hierarchy.advanced, 
        "Habilidades Avanzadas", 
        <Award className="h-5 w-5 text-purple-600" />
      )}
    </div>
  );
};

