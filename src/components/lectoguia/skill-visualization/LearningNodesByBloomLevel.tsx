
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TLearningNode } from "@/types/system-types";
import { NodeProgress } from "@/hooks/use-learning-nodes";
import { mapSkillToBloomLevel } from "./BloomTaxonomyLevel";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, PlayCircle, CheckCircle } from "lucide-react";

interface LearningNodesByBloomLevelProps {
  nodes: TLearningNode[];
  nodeProgress: Record<string, NodeProgress>;
  onNodeSelect?: (nodeId: string) => void;
}

export function LearningNodesByBloomLevel({ 
  nodes,
  nodeProgress,
  onNodeSelect
}: LearningNodesByBloomLevelProps) {
  const [activeTab, setActiveTab] = useState<string>("remember");
  
  // Group nodes by Bloom level
  const nodesByBloomLevel = nodes.reduce((acc, node) => {
    const bloomLevel = mapSkillToBloomLevel(node.skill);
    if (!acc[bloomLevel]) {
      acc[bloomLevel] = [];
    }
    acc[bloomLevel].push(node);
    return acc;
  }, {} as Record<string, TLearningNode[]>);
  
  const bloomLevels = [
    { id: "remember", label: "Recordar" },
    { id: "understand", label: "Comprender" },
    { id: "apply", label: "Aplicar" },
    { id: "analyze", label: "Analizar" },
    { id: "evaluate", label: "Evaluar" },
    { id: "create", label: "Crear" }
  ];
  
  // Display color based on Bloom level
  const getBloomColor = (level: string) => {
    const colors: Record<string, string> = {
      "remember": "text-blue-600 bg-blue-50 border-blue-200",
      "understand": "text-green-600 bg-green-50 border-green-200",
      "apply": "text-yellow-600 bg-yellow-50 border-yellow-200",
      "analyze": "text-orange-600 bg-orange-50 border-orange-200",
      "evaluate": "text-red-600 bg-red-50 border-red-200",
      "create": "text-purple-600 bg-purple-50 border-purple-200"
    };
    
    return colors[level] || "";
  };
  
  // Get the node status badge
  const getNodeStatusBadge = (nodeId: string) => {
    const status = nodeProgress[nodeId]?.status || 'not_started';
    const progress = nodeProgress[nodeId]?.progress || 0;
    
    if (status === 'completed') {
      return <Badge variant="success">Completado</Badge>;
    } else if (status === 'in_progress') {
      return <Badge>{Math.round(progress * 100)}% Completado</Badge>;
    } else {
      return <Badge variant="outline">No iniciado</Badge>;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nodos de Aprendizaje por Nivel Cognitivo</CardTitle>
        <CardDescription>
          Organización de nodos según la Taxonomía de Bloom
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start overflow-x-auto">
            {bloomLevels.map(level => (
              <TabsTrigger key={level.id} value={level.id}>
                {level.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {bloomLevels.map(level => {
            const levelNodes = nodesByBloomLevel[level.id] || [];
            const bloomColorClass = getBloomColor(level.id);
            
            return (
              <TabsContent key={level.id} value={level.id} className="mt-4">
                {levelNodes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay nodos disponibles para este nivel cognitivo.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {levelNodes.map(node => {
                      const progress = nodeProgress[node.id]?.progress || 0;
                      const status = nodeProgress[node.id]?.status || 'not_started';
                      const isCompleted = status === 'completed';
                      
                      return (
                        <div 
                          key={node.id} 
                          className={`p-4 border rounded-lg ${isCompleted ? 'bg-green-50 border-green-100' : 'hover:bg-gray-50'} transition-colors`}
                        >
                          <div className="flex flex-col space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium flex items-center">
                                  <span>{node.title}</span>
                                  <Badge 
                                    variant="outline" 
                                    className={`ml-2 ${bloomColorClass}`}
                                  >
                                    {level.label}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{node.description}</p>
                              </div>
                              <div className="ml-4 flex-shrink-0">
                                {getNodeStatusBadge(node.id)}
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Progreso</span>
                                <span>{Math.round(progress * 100)}%</span>
                              </div>
                              <Progress value={progress * 100} className="h-2" />
                            </div>
                            
                            {onNodeSelect && (
                              <Button 
                                variant={status === 'completed' ? "outline" : "default"} 
                                size="sm"
                                className="w-full flex items-center justify-center gap-2"
                                disabled={status === 'completed'}
                                onClick={() => onNodeSelect(node.id)}
                              >
                                {status === 'completed' ? (
                                  <>
                                    <CheckCircle className="h-4 w-4" />
                                    Completado
                                  </>
                                ) : status === 'in_progress' ? (
                                  <>
                                    <PlayCircle className="h-4 w-4" />
                                    Continuar
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-4 w-4" />
                                    Iniciar nodo
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
}
