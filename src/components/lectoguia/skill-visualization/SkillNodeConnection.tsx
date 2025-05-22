
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TLearningNode, TPAESHabilidad, getHabilidadDisplayName } from "@/types/system-types";
import { NodeProgress } from "@/hooks/use-learning-nodes";
import { SkillRadar } from "./SkillRadar";
import { Badge } from "@/components/ui/badge";

interface SkillNodeConnectionProps {
  skillLevels: Record<TPAESHabilidad, number>;
  nodes?: TLearningNode[];
  nodeProgress?: Record<string, NodeProgress>;
  className?: string;
}

export const SkillNodeConnection = ({
  skillLevels,
  nodes = [],
  nodeProgress = {},
  className = "",
}: SkillNodeConnectionProps) => {
  // Convertir los niveles de habilidad al formato requerido por SkillRadar
  const skillRadarData = Object.entries(skillLevels).map(([skill, level]) => ({
    name: getHabilidadDisplayName(skill as TPAESHabilidad),
    value: Math.round(level * 100),
  }));

  // Filtrar solo los nodos que tienen progreso relevante
  const relevantNodes = nodes.filter(
    (node) => nodeProgress[node.id] && nodeProgress[node.id].progress > 0
  );

  // Obtener las habilidades principales (las 3 más altas)
  const topSkills = Object.entries(skillLevels)
    .sort(([_, a], [__, b]) => b - a)
    .slice(0, 3)
    .map(([skill]) => skill as TPAESHabilidad);

  return (
    <div className={`space-y-6 ${className}`}>
      <SkillRadar skills={skillRadarData} title="Radar de Habilidades" className="mb-6" />

      <Card>
        <CardHeader>
          <CardTitle>Progreso por Habilidades</CardTitle>
          <CardDescription>Tu progreso en las principales habilidades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(skillLevels).map(([skill, level]) => (
              <div key={skill} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{getHabilidadDisplayName(skill as TPAESHabilidad)}</span>
                  <span>{Math.round(level * 100)}%</span>
                </div>
                <Progress value={level * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {relevantNodes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Nodos de Aprendizaje Relacionados</CardTitle>
            <CardDescription>Nodos que estás trabajando actualmente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {relevantNodes.map((node) => (
                <div key={node.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{node.title}</h4>
                      <p className="text-sm text-muted-foreground">{node.description}</p>
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
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
