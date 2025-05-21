
import React from "react";
import { Progress } from "@/components/ui/progress";
import { TPAESHabilidad } from "@/types/system-types";
import { getHabilidadDisplayName } from "@/types/system-types";
import { cn } from "@/lib/utils";

interface SkillProgressProps {
  skill: TPAESHabilidad;
  level: number;
}

export function SkillProgress({ skill, level }: SkillProgressProps) {
  // Convert decimal to percentage (0-1 to 0-100)
  const percentage = Math.round(level * 100);
  
  // Determine skill color based on skill type
  const getSkillColor = (skill: TPAESHabilidad): {
    bg: string;
    text: string;
    indicator: string;
  } => {
    switch (skill) {
      case "SOLVE_PROBLEMS":
      case "REPRESENT":
      case "MODEL":
      case "ARGUE_COMMUNICATE":
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          indicator: "bg-blue-600"
        };
      case "INTERPRET_RELATE":
      case "EVALUATE_REFLECT":
        return {
          bg: "bg-purple-100",
          text: "text-purple-700",
          indicator: "bg-purple-600"
        };
      case "TRACK_LOCATE":
      case "CRITICAL_THINKING":
      case "REFLECTION":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          indicator: "bg-green-600"
        };
      case "IDENTIFY_THEORIES":
      case "PROCESS_ANALYZE":
      case "APPLY_PRINCIPLES":
      case "SCIENTIFIC_ARGUMENT":
        return {
          bg: "bg-amber-100",
          text: "text-amber-700",
          indicator: "bg-amber-600"
        };
      case "TEMPORAL_THINKING":
      case "SOURCE_ANALYSIS":
      case "MULTICAUSAL_ANALYSIS":
        return {
          bg: "bg-rose-100",
          text: "text-rose-700",
          indicator: "bg-rose-600"
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
          indicator: "bg-gray-600"
        };
    }
  };
  
  const { bg, text, indicator } = getSkillColor(skill);
  
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-sm">
        <div className="font-medium">{getHabilidadDisplayName(skill)}</div>
        <div className={cn("font-semibold", text)}>{percentage}%</div>
      </div>
      <Progress value={percentage} className={cn("h-2", bg)} indicatorClassName={indicator} />
    </div>
  );
}
