
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TLearningNode } from "@/types/system-types";
import { NodeProgress } from "@/hooks/use-learning-nodes";
import { mapSkillToBloomLevel, BloomLevel } from "./BloomTaxonomyLevel";
import { getHabilidadDisplayName } from "@/types/system-types";
import { cn } from "@/lib/utils";

// Bloom level color mapping
const bloomColorMap: Record<BloomLevel, string> = {
  remember: "border-blue-500",
  understand: "border-green-500",
  apply: "border-yellow-500",
  analyze: "border-orange-500",
  evaluate: "border-red-500",
  create: "border-purple-500"
};

interface ActiveLearningNodesProps {
  nodes: TLearningNode[];
  nodeProgress: Record<string, NodeProgress>;
}

export const ActiveLearningNodes: React.FC<ActiveLearningNodesProps> = ({
  nodes,
  nodeProgress
}) => {
  // Filter only the nodes that have progreso relevante
  const relevantNodes = nodes.filter(
    (node) => nodeProgress[node.id] && nodeProgress[node.id].progress > 0
  );

  if (relevantNodes.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nodos de Aprendizaje Activos</CardTitle>
        <CardDescription>Nodos que estás trabajando actualmente</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {relevantNodes.slice(0, 5).map((node) => {
            const bloomLevel = mapSkillToBloomLevel(node.skill);
            const borderColor = bloomColorMap[bloomLevel];
            
            return (
              <div 
                key={node.id} 
                className={cn(
                  "border rounded-lg p-4",
                  "border-l-4",
                  borderColor
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{node.title}</h4>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {getHabilidadDisplayName(node.skill)}
                      </Badge>
                      <Badge className="text-xs capitalize" variant="secondary">
                        {bloomLevel}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{node.description}</p>
                  </div>
                  <Badge variant={node.difficulty === "basic" ? "outline" : node.difficulty === "intermediate" ? "secondary" : "destructive"}>
                    {node.difficulty}
                  </Badge>
                </div>
                <div className="mt-2">
                  <div className="text-sm flex justify-between">
                    <span>Progreso</span>
                    <span>{Math.round(nodeProgress[node.id]?.progress * 100)}%</span>
                  </div>
                  <Progress value={nodeProgress[node.id]?.progress * 100} className="h-1.5 mt-1" />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
