
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Brain } from "lucide-react";
import { useBloomRecommendations } from "@/hooks/use-bloom-recommendations";
import { TLearningNode, TPAESHabilidad } from "@/types/system-types";
import { NodeProgress } from "@/hooks/use-learning-nodes";
import { BloomLevel } from "./BloomTaxonomyLevel";
import { Button } from "@/components/ui/button";

interface BloomRecommendationsProps {
  skillLevels: Record<TPAESHabilidad, number>;
  nodes: TLearningNode[];
  nodeProgress: Record<string, NodeProgress>;
  className?: string;
  onNodeSelect?: (nodeId: string) => void;
}

export const BloomRecommendations: React.FC<BloomRecommendationsProps> = ({
  skillLevels,
  nodes,
  nodeProgress,
  className,
  onNodeSelect
}) => {
  const {
    recommendedNodes,
    bloomStrengths,
    weakestLevel,
    suggestedFocus
  } = useBloomRecommendations(skillLevels, nodes, nodeProgress);

  // Function to get color class based on Bloom level
  const getBloomLevelColor = (level: BloomLevel): string => {
    const colors: Record<BloomLevel, string> = {
      remember: "text-blue-600",
      understand: "text-green-600",
      apply: "text-yellow-600",
      analyze: "text-orange-600",
      evaluate: "text-red-600",
      create: "text-purple-600"
    };
    
    return colors[level] || "text-gray-600";
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Recomendaciones de Aprendizaje
        </CardTitle>
        <CardDescription>
          Basadas en el análisis de tus niveles cognitivos (Taxonomía de Bloom)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Learning Focus Based on Bloom's Taxonomy */}
        {suggestedFocus && (
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
            <h4 className="font-medium text-blue-800">Estrategia Recomendada</h4>
            <p className="text-blue-700">{suggestedFocus}</p>
          </div>
        )}
        
        {/* Cognitive Strengths & Areas for Improvement */}
        <div className="space-y-2">
          <h4 className="font-medium">Perfil Cognitivo</h4>
          <div className="grid grid-cols-2 gap-2">
            {bloomStrengths.map(({ level, score, isStrength }) => (
              <div 
                key={level} 
                className={`p-2 rounded border ${
                  isStrength ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`capitalize font-medium ${getBloomLevelColor(level)}`}>
                    {level}
                  </span>
                  <span className={isStrength ? 'text-green-700' : 'text-amber-700'}>
                    {Math.round(score * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Recommended Learning Nodes */}
        {recommendedNodes.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Nodos Recomendados</h4>
            <div className="space-y-2">
              {recommendedNodes.map(node => (
                <div 
                  key={node.id} 
                  className="p-3 border rounded-md hover:bg-gray-50"
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">{node.title}</div>
                      <div className="text-sm text-muted-foreground">{node.description}</div>
                    </div>
                    {onNodeSelect && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 gap-1"
                        onClick={() => onNodeSelect(node.id)}
                      >
                        Iniciar <ArrowRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* If no recommendations are available */}
        {recommendedNodes.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            No hay nodos específicos recomendados en este momento.
            Continúa practicando con los nodos disponibles.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
