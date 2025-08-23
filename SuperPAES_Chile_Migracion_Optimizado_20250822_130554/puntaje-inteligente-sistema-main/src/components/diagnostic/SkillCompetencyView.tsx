/* eslint-disable react-refresh/only-export-components */

import { Progress } from "../../components/ui/progress";
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { Card, CardContent } from "../../components/ui/card";
import { TPAESHabilidad, getHabilidadDisplayName } from "../../types/system-types";

interface SkillCompetencyViewProps {
  skill: TPAESHabilidad;
  score: number;
}

export const SkillCompetencyView = ({ skill, score }: SkillCompetencyViewProps) => {
  // Convert score to percentage (0-100)
  const scorePercent = Math.round(score * 100);
  
  // Determine level based on score
  const getLevel = () => {
    if (scorePercent >= 80) return { label: "Avanzado", color: "bg-green-500" };
    if (scorePercent >= 60) return { label: "Intermedio alto", color: "bg-teal-500" };
    if (scorePercent >= 40) return { label: "Intermedio", color: "bg-blue-500" };
    if (scorePercent >= 20) return { label: "BÃ¡sico", color: "bg-yellow-500" };
    return { label: "Inicial", color: "bg-red-500" };
  };
  
  const level = getLevel();
  const skillName = getHabilidadDisplayName(skill);
  
  // Generate recommendations based on level
  const getRecommendation = () => {
    if (scorePercent >= 80) return "Dominas esta habilidad. ContinÃºa practicando para mantener tu nivel.";
    if (scorePercent >= 60) return "Buen dominio. EnfÃ³cate en mejorar aspectos especÃ­ficos para llegar al siguiente nivel.";
    if (scorePercent >= 40) return "Nivel adecuado. Practica regularmente para fortalecer esta habilidad.";
    if (scorePercent >= 20) return "Requiere atenciÃ³n. Dedica tiempo adicional a mejorar esta habilidad.";
    return "Necesita refuerzo prioritario. Comienza con ejercicios bÃ¡sicos y avanza gradualmente.";
  };
  
  return (
    <Card className="overflow-hidden">
      <div className={`h-2 ${level.color}`} />
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">{skillName}</h3>
            <span className="text-sm px-2 py-1 rounded-full bg-muted">{level.label}</span>
          </div>
          
          <Progress 
            value={scorePercent} 
            className="h-2"
            indicatorClassName={level.color} 
          />
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Nivel actual: {scorePercent}%</span>
            <span>Meta: 100%</span>
          </div>
          
          <p className="text-sm mt-2">
            {getRecommendation()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

