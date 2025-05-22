
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TLearningNode } from "@/types/system-types";
import { NodeProgress } from "@/hooks/use-learning-nodes";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ActiveLearningNodesProps {
  nodes: TLearningNode[];
  nodeProgress: Record<string, NodeProgress>;
  className?: string;
  limit?: number;
}

export const ActiveLearningNodes: React.FC<ActiveLearningNodesProps> = ({
  nodes,
  nodeProgress,
  className,
  limit = 5
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

            return (
              <div key={node.id} className="space-y-2">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">{node.title}</div>
                    <div className="text-sm text-muted-foreground">{node.description}</div>
                  </div>
                  <Badge variant={status === 'in_progress' ? "default" : "outline"}>
                    {status === 'in_progress' ? 'En progreso' : 'Por iniciar'}
                  </Badge>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
