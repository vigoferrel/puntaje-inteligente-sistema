
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  Clock, 
  Star,
  Lock,
  PlayCircle,
  Target
} from 'lucide-react';
import { TLearningNode, TPAESPrueba, getHabilidadDisplayName } from '@/types/system-types';
import { NodeProgress } from '@/types/node-progress';
import { motion } from 'framer-motion';

interface InteractiveLearningPathProps {
  nodes: TLearningNode[];
  nodeProgress: Record<string, NodeProgress>;
  selectedPrueba: TPAESPrueba;
  onNodeSelect: (nodeId: string) => void;
}

export const InteractiveLearningPath: React.FC<InteractiveLearningPathProps> = ({
  nodes,
  nodeProgress,
  selectedPrueba,
  onNodeSelect
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Organizar nodos por posición y dependencias
  const sortedNodes = [...nodes].sort((a, b) => a.position - b.position);

  // Determinar el estado de cada nodo
  const getNodeStatus = (node: TLearningNode) => {
    const progress = nodeProgress[node.id];
    if (!progress) return 'locked';
    
    // Verificar dependencias
    const dependencies = node.dependsOn || [];
    const allDependenciesMet = dependencies.every(depId => {
      const depProgress = nodeProgress[depId];
      return depProgress && depProgress.status === 'completed';
    });

    if (!allDependenciesMet && dependencies.length > 0) return 'locked';
    return progress.status || 'not_started';
  };

  const getStatusIcon = (status: string, progress?: NodeProgress) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'in_progress':
        return <PlayCircle className="h-6 w-6 text-blue-500" />;
      case 'locked':
        return <Lock className="h-6 w-6 text-gray-400" />;
      default:
        return <Circle className="h-6 w-6 text-gray-300" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200 hover:bg-green-100';
      case 'in_progress':
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      case 'locked':
        return 'bg-gray-50 border-gray-200 opacity-60';
      default:
        return 'bg-white border-gray-200 hover:bg-gray-50';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'basic':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Ruta de Aprendizaje Interactiva</h3>
        <p className="text-muted-foreground">
          Sigue tu progreso paso a paso hacia el dominio de {selectedPrueba}
        </p>
      </div>

      <div className="relative">
        {/* Línea de conexión */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20" />
        
        <div className="space-y-4">
          {sortedNodes.map((node, index) => {
            const status = getNodeStatus(node);
            const progress = nodeProgress[node.id];
            const isSelected = selectedNode === node.id;
            const canInteract = status !== 'locked';

            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Punto de conexión */}
                <div className="absolute left-6 top-6 w-4 h-4 rounded-full bg-white border-2 border-primary z-10" />
                
                <Card 
                  className={`ml-16 transition-all duration-200 cursor-pointer ${getStatusColor(status)} ${
                    isSelected ? 'ring-2 ring-primary shadow-lg' : ''
                  }`}
                  onClick={() => {
                    if (canInteract) {
                      setSelectedNode(isSelected ? null : node.id);
                    }
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(status, progress)}
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-lg">{node.title}</h4>
                            <Badge className={getDifficultyColor(node.difficulty)}>
                              {node.difficulty}
                            </Badge>
                            {node.skill && (
                              <Badge variant="outline" className="text-xs">
                                {getHabilidadDisplayName(node.skill)}
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-muted-foreground">{node.description}</p>
                          
                          {progress && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>Progreso</span>
                                <span>{Math.round(progress.progress * 100)}%</span>
                              </div>
                              <Progress value={progress.progress * 100} className="h-2" />
                            </div>
                          )}
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{node.estimatedTimeMinutes || 30} min</span>
                            </div>
                            {progress?.timeSpentMinutes && (
                              <div className="flex items-center gap-1">
                                <Target className="h-4 w-4" />
                                <span>Tiempo: {progress.timeSpentMinutes} min</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        {canInteract && (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onNodeSelect(node.id);
                            }}
                            className="bg-primary hover:bg-primary/90"
                          >
                            {status === 'in_progress' ? 'Continuar' : 'Iniciar'}
                          </Button>
                        )}
                        
                        {status === 'completed' && (
                          <div className="flex items-center gap-1 text-green-600">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="text-sm font-medium">Completado</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dependencias */}
                    {node.dependsOn && node.dependsOn.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          Requiere completar:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {node.dependsOn.map(depId => {
                            const depNode = nodes.find(n => n.id === depId);
                            const depProgress = nodeProgress[depId];
                            const isCompleted = depProgress?.status === 'completed';
                            
                            return depNode ? (
                              <Badge
                                key={depId}
                                variant={isCompleted ? "default" : "secondary"}
                                className={`text-xs ${
                                  isCompleted ? 'bg-green-100 text-green-800' : ''
                                }`}
                              >
                                {isCompleted && <CheckCircle className="h-3 w-3 mr-1" />}
                                {depNode.title}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Flecha de conexión */}
                {index < sortedNodes.length - 1 && (
                  <div className="flex justify-center my-2">
                    <ArrowRight className="h-6 w-6 text-primary/60" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
