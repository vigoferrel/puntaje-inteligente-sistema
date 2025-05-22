import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Exercise } from "@/types/ai-types";
import { BookOpen, PenTool, Calculator, Atom, History } from "lucide-react";
import { ExerciseView } from "./exercise";

interface ExerciseTabProps {
  exercise: Exercise | null;
  selectedOption: number | null;
  showFeedback: boolean;
  onOptionSelect: (index: number) => void;
  onContinue: () => void;
}

export const ExerciseTab: React.FC<ExerciseTabProps> = ({
  exercise,
  selectedOption,
  showFeedback,
  onOptionSelect,
  onContinue
}) => {
  // Determinar el icono según el tipo de habilidad
  const getSkillIcon = () => {
    if (!exercise?.skill) return <BookOpen size={18} />;
    
    const skillType = exercise.skill.toString().toUpperCase();
    
    if (skillType.includes('TRACK_LOCATE') || 
        skillType.includes('INTERPRET_RELATE') || 
        skillType.includes('EVALUATE_REFLECT')) {
      return <BookOpen size={18} />;
    } else if (skillType.includes('SOLVE_PROBLEMS') || 
               skillType.includes('REPRESENT') || 
               skillType.includes('MODEL') ||
               skillType.includes('ARGUE_COMMUNICATE')) {
      return <Calculator size={18} />;
    } else if (skillType.includes('IDENTIFY_THEORIES') || 
               skillType.includes('PROCESS_ANALYZE') ||
               skillType.includes('APPLY_PRINCIPLES') ||
               skillType.includes('SCIENTIFIC_ARGUMENT')) {
      return <Atom size={18} />; // Replacing Flask with Atom
    } else if (skillType.includes('TEMPORAL_THINKING') || 
               skillType.includes('SOURCE_ANALYSIS') ||
               skillType.includes('MULTICAUSAL_ANALYSIS') ||
               skillType.includes('CRITICAL_THINKING') ||
               skillType.includes('REFLECTION')) {
      return <History size={18} />;
    } else {
      return <PenTool size={18} />;
    }
  };

  // Determinar el título según el tipo de habilidad
  const getSkillTitle = () => {
    if (!exercise?.skill) return "Ejercicio";
    
    const skillType = exercise.skill.toString().toUpperCase();
    
    if (skillType.includes('TRACK_LOCATE') || 
        skillType.includes('INTERPRET_RELATE') || 
        skillType.includes('EVALUATE_REFLECT')) {
      return "Ejercicio de comprensión lectora";
    } else if (skillType.includes('SOLVE_PROBLEMS') || 
               skillType.includes('REPRESENT') || 
               skillType.includes('MODEL') ||
               skillType.includes('ARGUE_COMMUNICATE')) {
      return "Ejercicio de matemáticas";
    } else if (skillType.includes('IDENTIFY_THEORIES') || 
               skillType.includes('PROCESS_ANALYZE') ||
               skillType.includes('APPLY_PRINCIPLES') ||
               skillType.includes('SCIENTIFIC_ARGUMENT')) {
      return "Ejercicio de ciencias";
    } else if (skillType.includes('TEMPORAL_THINKING') || 
               skillType.includes('SOURCE_ANALYSIS') ||
               skillType.includes('MULTICAUSAL_ANALYSIS') ||
               skillType.includes('CRITICAL_THINKING') ||
               skillType.includes('REFLECTION')) {
      return "Ejercicio de historia";
    } else {
      return "Ejercicio de aprendizaje";
    }
  };

  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm">
      {exercise?.nodeId && (
        <CardHeader className="pb-0">
          <div className="flex items-center space-x-2 text-primary">
            {getSkillIcon()}
            <span className="text-sm font-medium">
              {exercise.nodeId ? `${getSkillTitle()} del nodo de aprendizaje` : getSkillTitle()}
            </span>
          </div>
        </CardHeader>
      )}
      <CardContent className={`p-6 ${exercise?.nodeId ? 'pt-4' : 'pt-6'}`}>
        <div className="h-[calc(100vh-280px)] min-h-[500px] overflow-auto custom-scrollbar">
          <ExerciseView
            exercise={exercise}
            selectedOption={selectedOption}
            showFeedback={showFeedback}
            onOptionSelect={onOptionSelect}
            onContinue={onContinue}
          />
        </div>
      </CardContent>
    </Card>
  );
};
