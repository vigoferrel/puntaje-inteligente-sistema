
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TLearningNode, TPAESHabilidad, TPAESPrueba, getHabilidadDisplayName } from "@/types/system-types";
import { NodeProgress } from "@/hooks/use-learning-nodes";
import { SkillRadar } from "./SkillRadar";
import { Badge } from "@/components/ui/badge";
import { BloomTaxonomyViewer } from "./BloomTaxonomyViewer";
import { SkillHierarchyChart } from "./SkillHierarchyChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mapSkillToBloomLevel, BloomLevel } from "./BloomTaxonomyLevel";
import { cn } from "@/lib/utils";

interface SkillNodeConnectionProps {
  skillLevels: Record<TPAESHabilidad, number>;
  nodes?: TLearningNode[];
  nodeProgress?: Record<string, NodeProgress>;
  className?: string;
}

// Bloom level color mapping
const bloomColorMap: Record<BloomLevel, string> = {
  remember: "border-blue-500",
  understand: "border-green-500",
  apply: "border-yellow-500",
  analyze: "border-orange-500",
  evaluate: "border-red-500",
  create: "border-purple-500"
};

export const SkillNodeConnection = ({
  skillLevels,
  nodes = [],
  nodeProgress = {},
  className = "",
}: SkillNodeConnectionProps) => {
  const [activeTab, setActiveTab] = useState<string>("radar");
  const [selectedTest, setSelectedTest] = useState<TPAESPrueba | undefined>(undefined);

  // Convertir los niveles de habilidad al formato requerido por SkillRadar
  const skillRadarData = Object.entries(skillLevels).map(([skill, level]) => ({
    name: getHabilidadDisplayName(skill as TPAESHabilidad),
    value: Math.round(level * 100),
  }));

  // Agrupar los nodos por nivel de Bloom
  const nodesByBloomLevel: Record<BloomLevel, TLearningNode[]> = {
    remember: [],
    understand: [],
    apply: [],
    analyze: [],
    evaluate: [],
    create: []
  };

  // Clasificar nodos por nivel de Bloom basado en su habilidad principal
  nodes.forEach(node => {
    const bloomLevel = mapSkillToBloomLevel(node.skill);
    nodesByBloomLevel[bloomLevel].push(node);
  });

  // Filtrar solo los nodos que tienen progreso relevante
  const relevantNodes = nodes.filter(
    (node) => nodeProgress[node.id] && nodeProgress[node.id].progress > 0
  );

  // Obtener las habilidades principales (las 3 más altas)
  const topSkills = Object.entries(skillLevels)
    .sort(([_, a], [__, b]) => b - a)
    .slice(0, 3)
    .map(([skill]) => skill as TPAESHabilidad);

  // Tests disponibles basados en los nodos activos
  const availableTests = [...new Set(nodes.map(node => node.prueba))];

  return (
    <div className={`space-y-6 ${className}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="radar">Radar de Habilidades</TabsTrigger>
          <TabsTrigger value="bloom">Taxonomía de Bloom</TabsTrigger>
          <TabsTrigger value="hierarchy">Jerarquía de Habilidades</TabsTrigger>
          <TabsTrigger value="nodes">Nodos de Aprendizaje</TabsTrigger>
        </TabsList>
        
        <div className="mt-4">
          <TabsContent value="radar" className="m-0">
            <SkillRadar skills={skillRadarData} title="Radar de Habilidades" />
          </TabsContent>
          
          <TabsContent value="bloom" className="m-0">
            <BloomTaxonomyViewer skillLevels={skillLevels} />
          </TabsContent>
          
          <TabsContent value="hierarchy" className="m-0">
            <div className="space-y-4">
              {/* Test selector */}
              {availableTests.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  <Badge 
                    variant={selectedTest ? "outline" : "default"} 
                    className="cursor-pointer"
                    onClick={() => setSelectedTest(undefined)}
                  >
                    Todas las pruebas
                  </Badge>
                  {availableTests.map(test => (
                    <Badge 
                      key={test} 
                      variant={selectedTest === test ? "default" : "outline"} 
                      className="cursor-pointer"
                      onClick={() => setSelectedTest(test)}
                    >
                      {getPruebaDisplayName(test)}
                    </Badge>
                  ))}
                </div>
              )}
              
              <SkillHierarchyChart skillLevels={skillLevels} selectedTest={selectedTest} />
            </div>
          </TabsContent>
          
          <TabsContent value="nodes" className="m-0">
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
          </TabsContent>
        </div>
      </Tabs>

      {relevantNodes.length > 0 && activeTab !== "nodes" && (
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
      )}
    </div>
  );
};
