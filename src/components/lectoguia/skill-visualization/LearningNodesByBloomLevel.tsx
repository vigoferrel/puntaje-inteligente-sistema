
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TLearningNode } from "@/types/system-types";
import { NodeProgress } from "@/hooks/use-learning-nodes";
import { mapSkillToBloomLevel, BloomLevel } from "./BloomTaxonomyLevel";
import { Badge } from "@/components/ui/badge";

interface LearningNodesByBloomLevelProps {
  nodes: TLearningNode[];
  nodeProgress: Record<string, NodeProgress>;
  className?: string;
}

export const LearningNodesByBloomLevel: React.FC<LearningNodesByBloomLevelProps> = ({
  nodes,
  nodeProgress,
  className
}) => {
  // Group nodes by Bloom level
  const nodesByLevel: Record<BloomLevel, TLearningNode[]> = {
    remember: [],
    understand: [],
    apply: [],
    analyze: [],
    evaluate: [],
    create: []
  };
  
  // Map each node to its Bloom level based on the skill
  nodes.forEach(node => {
    const bloomLevel = mapSkillToBloomLevel(node.skill);
    nodesByLevel[bloomLevel].push(node);
  });
  
  // Order of Bloom levels from basic to advanced
  const orderedLevels: BloomLevel[] = ["remember", "understand", "apply", "analyze", "evaluate", "create"];
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Nodos de Aprendizaje por Nivel Cognitivo</CardTitle>
        <CardDescription>
          Organización de nodos según la taxonomía de Bloom
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {orderedLevels.map(level => {
            const levelNodes = nodesByLevel[level];
            
            if (levelNodes.length === 0) return null;
            
            return (
              <div key={level} className="space-y-3">
                <h3 className="font-medium capitalize flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full bg-${level === "remember" ? "blue" : 
                    level === "understand" ? "green" : 
                    level === "apply" ? "yellow" : 
                    level === "analyze" ? "orange" : 
                    level === "evaluate" ? "red" : "purple"}-500`}></span>
                  {level}
                  <Badge variant="outline" className="ml-2">{levelNodes.length}</Badge>
                </h3>
                
                <div className="grid gap-2">
                  {levelNodes.map(node => {
                    const progress = nodeProgress[node.id]?.progress || 0;
                    const status = nodeProgress[node.id]?.status || "not_started";
                    
                    return (
                      <div 
                        key={node.id}
                        className={`p-3 rounded-md border ${
                          status === "completed" ? "border-green-200 bg-green-50" : 
                          status === "in_progress" ? "border-blue-200 bg-blue-50" : 
                          "border-gray-200"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{node.title}</div>
                            <div className="text-sm text-muted-foreground">{node.description}</div>
                          </div>
                          <Badge>{Math.round(progress)}%</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
