/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Progress } from "../../../components/ui/progress";
import { Badge } from "../../../components/ui/badge";
import { ArrowRight, CheckCircle, Lock, AlertCircle, ChevronRight } from "lucide-react";
import { TPAESHabilidad, getHabilidadDisplayName } from "../../../types/system-types";
import { useSkillLearningPath, SkillNode } from "../../../hooks/use-skill-learning-path";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip";

interface SkillLearningPathProps {
  skillLevels: Record<string, number>;
  selectedTestId: number;
  className?: string;
}

export const SkillLearningPath: FC<SkillLearningPathProps> = ({
  skillLevels,
  selectedTestId,
  className
}) => {
  const { skillNodes, recommendedSkills, loadingPath } = useSkillLearningPath(skillLevels, selectedTestId);

  if (loadingPath) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Ruta de Aprendizaje</CardTitle>
          <CardDescription>Cargando ruta de aprendizaje...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // No skills available for this test
  if (skillNodes.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Ruta de Aprendizaje</CardTitle>
          <CardDescription>No hay habilidades disponibles para esta prueba.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const renderSkillNode = (node: SkillNode, index: number) => {
    const mastered = node.level >= 0.7;
    const statusColor = mastered 
      ? "bg-green-100 border-green-200 text-green-800"
      : node.isRecommended
        ? "bg-blue-100 border-blue-200 text-blue-800"
        : node.isUnlocked
          ? "bg-gray-100 border-gray-200"
          : "bg-gray-50 border-gray-100 text-gray-500";
    
    const icon = mastered 
      ? <CheckCircle className="h-5 w-5 text-green-500" /> 
      : node.isRecommended
        ? <AlertCircle className="h-5 w-5 text-blue-500" />
        : node.isUnlocked
          ? <ChevronRight className="h-5 w-5 text-gray-400" />
          : <Lock className="h-5 w-5 text-gray-400" />;

    return (
      <React.Fragment key={node.skill}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`p-4 rounded-lg border ${statusColor} relative`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {icon}
                    </div>
                    <div>
                      <div className="font-medium">{getHabilidadDisplayName(node.skill)}</div>
                      <Progress 
                        value={node.level * 100} 
                        className="h-1.5 mt-1 w-32"
                      />
                    </div>
                  </div>
                  <Badge variant={node.isRecommended ? "default" : "outline"}>
                    {Math.round(node.level * 100)}%
                  </Badge>
                </div>
                {node.isRecommended && (
                  <div className="absolute -top-2 -right-2">
                    <Badge className="bg-blue-500">Recomendado</Badge>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent className="w-80 p-0">
              <div className="p-4">
                <div className="font-bold">
                  {getHabilidadDisplayName(node.skill)}
                </div>
                <div className="text-sm mt-1">
                  {node.description}
                </div>
                {node.prerequisites.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs font-semibold uppercase text-muted-foreground">Prerrequisitos:</div>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {node.prerequisites.map(prereq => (
                        <Badge key={prereq} variant="outline" className="text-xs">
                          {getHabilidadDisplayName(prereq)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex justify-between items-center mt-3">
                  <div className="text-xs font-medium">Nivel actual:</div>
                  <div>{Math.round(node.level * 100)}%</div>
                </div>
                <Progress 
                  value={node.level * 100} 
                  className="h-1.5 mt-1"
                />
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Arrows between nodes */}
        {index < skillNodes.length - 1 && (
          <div className="flex items-center justify-center py-2">
            <ArrowRight className="text-gray-300" />
          </div>
        )}
      </React.Fragment>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Ruta de Aprendizaje</CardTitle>
        <CardDescription>
          Tu progresiÃ³n de habilidades recomendada
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Learning Path Recommendation Block */}
        {recommendedSkills.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <h4 className="font-medium text-blue-700">RecomendaciÃ³n</h4>
            <p className="text-sm text-blue-600">
              EnfÃ³cate en mejorar {recommendedSkills.map(skill => getHabilidadDisplayName(skill)).join(', ')} 
              para avanzar en tu ruta de aprendizaje.
            </p>
          </div>
        )}
        
        {/* Skill Path Visualization */}
        <div className="flex flex-col">
          {skillNodes.map((node, index) => renderSkillNode(node, index))}
        </div>
        
        {/* Path Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-sm font-medium mb-2">Leyenda:</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Dominado</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Recomendado</span>
            </div>
            <div className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="text-sm">Disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-gray-400" />
              <span className="text-sm">Bloqueado</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

