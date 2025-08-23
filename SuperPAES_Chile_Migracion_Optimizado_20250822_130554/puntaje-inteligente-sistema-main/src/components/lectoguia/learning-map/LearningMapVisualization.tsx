/* eslint-disable react-refresh/only-export-components */

import React, { useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Progress } from '../../../components/ui/progress';
import { 
  Map, 
  TreePine, 
  Brain, 
  Target, 
  TrendingUp,
  BookOpen,
  Trophy,
  Clock,
  Zap
} from 'lucide-react';
import { TLearningNode, TPAESHabilidad, TPAESPrueba } from '../../../types/system-types';
import { NodeProgress } from '../../../types/node-progress';
import { InteractiveLearningPath } from './InteractiveLearningPath';
import { SkillTreeVisualization } from './SkillTreeVisualization';
import { BloomTaxonomyMap } from './BloomTaxonomyMap';
import { LearningMetrics } from './LearningMetrics';

interface LearningMapVisualizationProps {
  nodes: TLearningNode[];
  nodeProgress: Record<string, NodeProgress>;
  skillLevels: Record<TPAESHabilidad, number>;
  selectedPrueba: TPAESPrueba;
  onNodeSelect: (nodeId: string) => void;
  className?: string;
}

export const LearningMapVisualization: React.FC<LearningMapVisualizationProps> = ({
  nodes,
  nodeProgress,
  skillLevels,
  selectedPrueba,
  onNodeSelect,
  className
}) => {
  const [activeView, setActiveView] = useState('path');

  // Calcular mÃ©tricas generales
  const totalNodes = nodes.length;
  const completedNodes = Object.values(nodeProgress).filter(p => p.status === 'completed').length;
  const inProgressNodes = Object.values(nodeProgress).filter(p => p.status === 'in_progress').length;
  const overallProgress = totalNodes > 0 ? (completedNodes / totalNodes) * 100 : 0;

  // Calcular tiempo estimado restante
  const remainingNodes = nodes.filter(node => 
    !nodeProgress[node.id] || nodeProgress[node.id].status !== 'completed'
  );
  const estimatedTimeRemaining = remainingNodes.reduce((total, node) => 
    total + (node.estimatedTimeMinutes || 30), 0
  );

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Header con mÃ©tricas clave */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Progreso General</p>
              <p className="text-2xl font-bold text-blue-800">{Math.round(overallProgress)}%</p>
            </div>
            <Target className="h-8 w-8 text-blue-600" />
          </div>
          <Progress value={overallProgress} className="mt-2 h-2" />
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Nodos Completados</p>
              <p className="text-2xl font-bold text-green-800">{completedNodes}/{totalNodes}</p>
            </div>
            <Trophy className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">En Progreso</p>
              <p className="text-2xl font-bold text-yellow-800">{inProgressNodes}</p>
            </div>
            <Zap className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Tiempo Restante</p>
              <p className="text-2xl font-bold text-purple-800">{Math.round(estimatedTimeRemaining / 60)}h</p>
            </div>
            <Clock className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* NavegaciÃ³n de vistas */}
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="path" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden md:inline">Ruta de Aprendizaje</span>
            <span className="md:hidden">Ruta</span>
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden md:inline">Ãrbol de Habilidades</span>
            <span className="md:hidden">Habilidades</span>
          </TabsTrigger>
          <TabsTrigger value="bloom" className="flex items-center gap-2">
            <TreePine className="h-4 w-4" />
            <span className="hidden md:inline">TaxonomÃ­a de Bloom</span>
            <span className="md:hidden">Bloom</span>
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            <span className="hidden md:inline">MÃ©tricas Detalladas</span>
            <span className="md:hidden">MÃ©tricas</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="path" className="mt-6">
          <InteractiveLearningPath
            nodes={nodes}
            nodeProgress={nodeProgress}
            selectedPrueba={selectedPrueba}
            onNodeSelect={onNodeSelect}
          />
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          <SkillTreeVisualization
            skillLevels={skillLevels}
            nodes={nodes}
            nodeProgress={nodeProgress}
            selectedPrueba={selectedPrueba}
            onNodeSelect={onNodeSelect}
          />
        </TabsContent>

        <TabsContent value="bloom" className="mt-6">
          <BloomTaxonomyMap
            nodes={nodes}
            nodeProgress={nodeProgress}
            skillLevels={skillLevels}
            selectedPrueba={selectedPrueba}
            onNodeSelect={onNodeSelect}
          />
        </TabsContent>

        <TabsContent value="metrics" className="mt-6">
          <LearningMetrics
            nodes={nodes}
            nodeProgress={nodeProgress}
            skillLevels={skillLevels}
            selectedPrueba={selectedPrueba}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

