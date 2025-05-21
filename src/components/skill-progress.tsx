
import React from "react";
import { Progress } from "@/components/ui/progress";
import { TPAESHabilidad, getHabilidadDisplayName } from "@/types/system-types";
import { cn } from "@/lib/utils";

interface SkillProgressProps {
  skill: TPAESHabilidad;
  level: number; // 0 to 1
  className?: string;
}

const getSkillColor = (skill: TPAESHabilidad): string => {
  const colorMap: Partial<Record<TPAESHabilidad, string>> = {
    SOLVE_PROBLEMS: "bg-blue-500",
    REPRESENT: "bg-purple-500",
    MODEL: "bg-indigo-500",
    INTERPRET_RELATE: "bg-pink-500",
    EVALUATE_REFLECT: "bg-amber-500",
    TRACK_LOCATE: "bg-emerald-500",
    ARGUE_COMMUNICATE: "bg-cyan-500",
    IDENTIFY_THEORIES: "bg-rose-500",
    PROCESS_ANALYZE: "bg-teal-500",
    APPLY_PRINCIPLES: "bg-orange-500",
    SCIENTIFIC_ARGUMENT: "bg-lime-500",
    TEMPORAL_THINKING: "bg-fuchsia-500",
    SOURCE_ANALYSIS: "bg-sky-500",
    MULTICAUSAL_ANALYSIS: "bg-violet-500",
    CRITICAL_THINKING: "bg-red-500",
    REFLECTION: "bg-green-500"
  };
  
  return colorMap[skill] || "bg-gray-500";
};

export const SkillProgress = ({ skill, level, className }: SkillProgressProps) => {
  const skillColor = getSkillColor(skill);
  const percentage = Math.round(level * 100);
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{getHabilidadDisplayName(skill)}</span>
        <span className="text-xs font-medium">{percentage}%</span>
      </div>
      <Progress 
        value={percentage} 
        className="h-2"
        indicatorClassName={cn(skillColor)} 
      />
    </div>
  );
};
