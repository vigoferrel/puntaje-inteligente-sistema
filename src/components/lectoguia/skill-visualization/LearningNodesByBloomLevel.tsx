
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TLearningNode, getHabilidadDisplayName, getPruebaDisplayName } from "@/types/system-types";
import { NodeProgress } from "@/hooks/use-learning-nodes";
import { mapSkillToBloomLevel, BloomLevel } from "./BloomTaxonomyLevel";
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

interface LearningNodesByBloomLevelProps {
  nodes: TLearningNode[];
  nodeProgress: Record<string, NodeProgress>;
}

export const LearningNodesByBloomLevel: React.FC<LearningNodesByBloomLevelProps> = ({
  nodes,
  nodeProgress
}) => {
  // Group nodes by Bloom level
  const nodesByBloomLevel: Record<BloomLevel, TLearningNode[]> = {
    remember: [],
    understand: [],
    apply: [],
    analyze: [],
    evaluate: [],
    create: []
  };

  // Classify nodes by Bloom level based on their main skill
  nodes.forEach(node => {
    const bloomLevel = mapSkillToBloomLevel(node.skill);
    nodesByBloomLevel[bloomLevel].push(node);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nodos de Aprendizaje por Nivel Cognitivo</CardTitle>
        <CardDescription>
          Organización de nodos según los niveles de la taxonomía de Bloom
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(nodesByBloomLevel).map(([level, levelNodes]) => {
            if (levelNodes.length === 0) return null;
            
            return (
              <div key={level} className="space-y-3">
                <h3 className="font-semibold capitalize">{level}</h3>
                <div className="space-y-3">
                  {levelNodes.map((node) => {
                    const progress = nodeProgress[node.id]?.progress || 0;
                    const borderColor = bloomColorMap[level as BloomLevel];
                    
                    return (
                      <div 
                        key={node.id} 
                        className={cn(
                          "border-l-4 pl-3 py-2 rounded-md bg-secondary/20",
                          borderColor
                        )}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h4 className="font-medium">{node.title}</h4>
                            <p className="text-xs text-muted-foreground">{node.description}</p>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {getHabilidadDisplayName(node.skill)}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {getPruebaDisplayName(node.prueba)}
                              </Badge>
                            </div>
                          </div>
                          <Badge variant={
                            node.difficulty === "basic" ? "outline" : 
                            node.difficulty === "intermediate" ? "secondary" : 
                            "destructive"
                          }>
                            {node.difficulty}
                          </Badge>
                        </div>
                        <div className="mt-2">
                          <div className="text-xs flex justify-between">
                            <span>Progreso</span>
                            <span>{Math.round(progress * 100)}%</span>
                          </div>
                          <Progress value={progress * 100} className="h-1.5 mt-1" />
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
