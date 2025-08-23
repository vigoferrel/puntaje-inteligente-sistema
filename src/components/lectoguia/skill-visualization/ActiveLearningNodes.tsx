
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TLearningNode } from "@/types/system-types";
import { NodeProgress } from "@/hooks/use-learning-nodes";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayCircle, CheckCircle, Clock } from "lucide-react";

interface ActiveLearningNodesProps {
  nodes: TLearningNode[];
  nodeProgress: Record<string, NodeProgress>;
  className?: string;
  limit?: number;
  onNodeSelect?: (nodeId: string) => void;
}

export const ActiveLearningNodes: React.FC<ActiveLearningNodesProps> = ({
  nodes,
  nodeProgress,
  className,
  limit = 5,
  onNodeSelect
}) => {
  // Filter nodes that are in progress or not started
  const activeNodes = nodes
    .filter(node => {
      const status = nodeProgress[node.id]?.status || 'not_started';
      return status !== 'completed';
    })
    .slice(0, limit);

  if (activeNodes.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Nodos de Aprendizaje Activos</CardTitle>
          <CardDescription>
            ¡Felicidades! Has completado todos los nodos disponibles.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Nodos de Aprendizaje Activos</CardTitle>
        <CardDescription>
          Continúa tu aprendizaje con estos nodos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeNodes.map(node => {
            const progress = nodeProgress[node.id]?.progress || 0;
            const status = nodeProgress[node.id]?.status || 'not_started';
            const timeSpent = nodeProgress[node.id]?.timeSpentMinutes || 0;

            return (
              <div key={node.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="font-medium">{node.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-2">{node.description}</div>
                  </div>
                  <Badge variant={status === 'in_progress' ? "default" : "outline"} className="ml-2 flex-shrink-0">
                    {status === 'in_progress' ? 'En progreso' : 'Por iniciar'}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <Progress value={progress * 100} className="h-2" />
                  
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{timeSpent} min</span>
                    </div>
                    <div>{Math.round(progress * 100)}% completado</div>
                  </div>
                </div>
                
                {onNodeSelect && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={() => onNodeSelect(node.id)}
                  >
                    {status === 'in_progress' ? (
                      <>
                        <Clock className="h-4 w-4 mr-2" />
                        Continuar
                      </>
                    ) : (
                      <>
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Iniciar
                      </>
                    )}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
