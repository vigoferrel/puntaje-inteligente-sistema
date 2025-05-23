
import React, { useState, useMemo } from 'react';
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
  Target,
  BookOpen,
  Calculator,
  BarChart3,
  Atom,
  History
} from 'lucide-react';
import { TLearningNode, TPAESPrueba, getHabilidadDisplayName, getPruebaDisplayName } from '@/types/system-types';
import { NodeProgress } from '@/types/node-progress';
import { motion } from 'framer-motion';

interface InteractiveLearningPathProps {
  nodes: TLearningNode[];
  nodeProgress: Record<string, NodeProgress>;
  selectedPrueba: TPAESPrueba;
  onNodeSelect: (nodeId: string) => void;
}

const TEST_ICONS = {
  'COMPETENCIA_LECTORA': BookOpen,
  'MATEMATICA_1': Calculator,
  'MATEMATICA_2': BarChart3,
  'CIENCIAS': Atom,
  'HISTORIA': History
};

const TEST_COLORS = {
  'COMPETENCIA_LECTORA': {
    primary: 'blue',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    button: 'bg-blue-500 hover:bg-blue-600'
  },
  'MATEMATICA_1': {
    primary: 'green',
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    button: 'bg-green-500 hover:bg-green-600'
  },
  'MATEMATICA_2': {
    primary: 'purple',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    button: 'bg-purple-500 hover:bg-purple-600'
  },
  'CIENCIAS': {
    primary: 'orange',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    button: 'bg-orange-500 hover:bg-orange-600'
  },
  'HISTORIA': {
    primary: 'red',
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    button: 'bg-red-500 hover:bg-red-600'
  }
};

export const InteractiveLearningPath: React.FC<InteractiveLearningPathProps> = ({
  nodes,
  nodeProgress,
  selectedPrueba,
  onNodeSelect
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Filtrar nodos SOLO por la prueba seleccionada usando la propiedad 'prueba'
  const filteredNodes = useMemo(() => {
    return nodes.filter(node => node.prueba === selectedPrueba);
  }, [nodes, selectedPrueba]);

  // Organizar nodos por posición dentro de la prueba seleccionada
  const sortedNodes = useMemo(() => {
    return [...filteredNodes].sort((a, b) => a.position - b.position);
  }, [filteredNodes]);

  // Obtener configuración de colores para la prueba actual
  const testConfig = TEST_COLORS[selectedPrueba];
  const TestIcon = TEST_ICONS[selectedPrueba];

  // Determinar el estado de cada nodo
  const getNodeStatus = (node: TLearningNode) => {
    const progress = nodeProgress[node.id];
    if (!progress) return 'not_started';
    
    // Verificar dependencias solo dentro de la misma prueba
    const dependencies = node.dependsOn || [];
    const relevantDependencies = dependencies.filter(depId => 
      sortedNodes.some(n => n.id === depId)
    );
    
    const allDependenciesMet = relevantDependencies.every(depId => {
      const depProgress = nodeProgress[depId];
      return depProgress && depProgress.status === 'completed';
    });

    if (!allDependenciesMet && relevantDependencies.length > 0) return 'locked';
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
        return `${testConfig.bg} ${testConfig.border} hover:bg-${testConfig.primary}-100`;
      case 'locked':
        return 'bg-gray-50 border-gray-200 opacity-60';
      default:
        return `bg-white border-gray-200 hover:${testConfig.bg}`;
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

  // Calcular estadísticas de la prueba
  const completedCount = sortedNodes.filter(node => 
    nodeProgress[node.id]?.status === 'completed'
  ).length;
  
  const totalTime = sortedNodes.reduce((total, node) => 
    total + (node.estimatedTimeMinutes || node.estimatedTime || 30), 0
  );

  if (sortedNodes.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className={`p-4 rounded-full ${testConfig.bg} inline-block`}>
          <TestIcon className={`h-12 w-12 ${testConfig.text}`} />
        </div>
        <h3 className="text-xl font-semibold">No hay nodos disponibles</h3>
        <p className="text-muted-foreground">
          No se encontraron nodos de aprendizaje para {getPruebaDisplayName(selectedPrueba)}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header específico de la prueba */}
      <div className={`p-6 rounded-lg ${testConfig.bg} ${testConfig.border} border`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full bg-white/50`}>
              <TestIcon className={`h-8 w-8 ${testConfig.text}`} />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${testConfig.text}`}>
                Ruta de {getPruebaDisplayName(selectedPrueba)}
              </h2>
              <p className={`${testConfig.text} opacity-80`}>
                {sortedNodes.length} nodos • {Math.round(totalTime / 60)}h estimadas
              </p>
            </div>
          </div>
          <Badge variant="secondary" className={`${testConfig.bg} ${testConfig.text}`}>
            {completedCount}/{sortedNodes.length} completados
          </Badge>
        </div>
      </div>

      <div className="relative">
        {/* Línea de conexión con color de la prueba */}
        <div className={`absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-${testConfig.primary}-200 via-${testConfig.primary}-400 to-${testConfig.primary}-200`} />
        
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
                {/* Punto de conexión con color de la prueba */}
                <div className={`absolute left-6 top-6 w-4 h-4 rounded-full bg-white border-2 border-${testConfig.primary}-500 z-10`} />
                
                <Card 
                  className={`ml-16 transition-all duration-200 cursor-pointer ${getStatusColor(status)} ${
                    isSelected ? `ring-2 ring-${testConfig.primary}-500 shadow-lg` : ''
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
                              <span>{node.estimatedTimeMinutes || node.estimatedTime || 30} min</span>
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
                            className={`${testConfig.button} text-white`}
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
                            const depNode = sortedNodes.find(n => n.id === depId);
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
                    <ArrowRight className={`h-6 w-6 text-${testConfig.primary}-400`} />
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
