/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Progress } from '../../../components/ui/progress';
import { Badge } from '../../../components/ui/badge';
import { TLearningNode, TPAESHabilidad, TPAESPrueba } from '../../../types/system-types';
import { NodeProgress } from '../../../types/node-progress';
import { Clock, Target, TrendingUp, Award, Brain, BookOpen } from 'lucide-react';

interface LearningMetricsProps {
  nodes: TLearningNode[];
  nodeProgress: Record<string, NodeProgress>;
  skillLevels: Record<TPAESHabilidad, number>;
  selectedPrueba: TPAESPrueba;
}

export const LearningMetrics: FC<LearningMetricsProps> = ({
  nodes,
  nodeProgress,
  skillLevels,
  selectedPrueba
}) => {
  // Calcular mÃ©tricas detalladas
  const totalTimeSpent = Object.values(nodeProgress).reduce((total, progress) => 
    total + (progress.timeSpentMinutes || 0), 0
  );

  const averageSkillLevel = Object.values(skillLevels).reduce((sum, level) => sum + level, 0) / 
    Object.values(skillLevels).length;

  const completionRate = nodes.length > 0 ? 
    (Object.values(nodeProgress).filter(p => p.status === 'completed').length / nodes.length) * 100 : 0;

  const estimatedTotalTime = nodes.reduce((total, node) => 
    total + (node.estimatedTimeMinutes || 30), 0
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">MÃ©tricas Detalladas</h3>
        <p className="text-muted-foreground">
          AnÃ¡lisis profundo de tu progreso de aprendizaje
        </p>
      </div>

      {/* MÃ©tricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tiempo Total</p>
                <p className="text-2xl font-bold">{Math.round(totalTimeSpent / 60)}h</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tasa de FinalizaciÃ³n</p>
                <p className="text-2xl font-bold">{Math.round(completionRate)}%</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nivel Promedio</p>
                <p className="text-2xl font-bold">{Math.round(averageSkillLevel * 100)}%</p>
              </div>
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Eficiencia</p>
                <p className="text-2xl font-bold">
                  {estimatedTotalTime > 0 ? Math.round((totalTimeSpent / estimatedTotalTime) * 100) : 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DistribuciÃ³n por dificultad */}
      <Card>
        <CardHeader>
          <CardTitle>DistribuciÃ³n por Dificultad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['basic', 'intermediate', 'advanced'].map(difficulty => {
              const difficultyNodes = nodes.filter(node => node.difficulty === difficulty);
              const completedDifficulty = difficultyNodes.filter(node => 
                nodeProgress[node.id]?.status === 'completed'
              ).length;
              const progress = difficultyNodes.length > 0 ? 
                (completedDifficulty / difficultyNodes.length) * 100 : 0;

              return (
                <div key={difficulty} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="capitalize font-medium">{difficulty}</span>
                    <span>{completedDifficulty}/{difficultyNodes.length}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Progreso por habilidades */}
      <Card>
        <CardHeader>
          <CardTitle>Progreso por Habilidades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(skillLevels).map(([skill, level]) => (
              <div key={skill} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{skill}</span>
                  <Badge variant="outline">{Math.round(level * 100)}%</Badge>
                </div>
                <Progress value={level * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

