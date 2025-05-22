
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Exercise } from "@/types/ai-types";
import { BookOpen, PenTool, Calculator, Atom, History, Loader2, BarChart3 } from "lucide-react";
import { ExerciseView } from "./exercise";

interface ExerciseTabProps {
  exercise: Exercise | null;
  selectedOption: number | null;
  showFeedback: boolean;
  onOptionSelect: (index: number) => void;
  onContinue: () => void;
  isLoading?: boolean;
}

export const ExerciseTab: React.FC<ExerciseTabProps> = ({
  exercise,
  selectedOption,
  showFeedback,
  onOptionSelect,
  onContinue,
  isLoading = false
}) => {
  // Determinar el icono según el tipo de prueba o habilidad
  const getSkillIcon = () => {
    if (!exercise) return <BookOpen size={18} />;
    
    // Verificar primero por el tipo de prueba
    if (exercise.prueba) {
      if (exercise.prueba === 'COMPETENCIA_LECTORA') {
        return <BookOpen size={18} />;
      } else if (exercise.prueba === 'MATEMATICA_1') {
        return <Calculator size={18} />;
      } else if (exercise.prueba === 'MATEMATICA_2') {
        return <BarChart3 size={18} />;
      } else if (exercise.prueba === 'CIENCIAS') {
        return <Atom size={18} />;
      } else if (exercise.prueba === 'HISTORIA') {
        return <History size={18} />;
      }
    }
    
    // Fallback al método anterior por si no tiene prueba pero sí skill
    const skillType = exercise.skill?.toString().toUpperCase() || '';
    
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
      return <Atom size={18} />;
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

  // Determinar el título según el tipo de prueba o habilidad
  const getSkillTitle = () => {
    if (!exercise) return "Ejercicio";
    
    // Verificar primero por el tipo de prueba
    if (exercise.prueba) {
      if (exercise.prueba === 'COMPETENCIA_LECTORA') {
        return "Ejercicio de comprensión lectora";
      } else if (exercise.prueba === 'MATEMATICA_1') {
        return "Ejercicio de matemáticas (7° a 2° medio)";
      } else if (exercise.prueba === 'MATEMATICA_2') {
        return "Ejercicio de matemáticas (3° y 4° medio)";
      } else if (exercise.prueba === 'CIENCIAS') {
        return "Ejercicio de ciencias";
      } else if (exercise.prueba === 'HISTORIA') {
        return "Ejercicio de historia";
      }
    }
    
    // Fallback al método anterior por si no tiene prueba pero sí skill
    const skillType = exercise.skill?.toString().toUpperCase() || '';
    
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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Generando ejercicio...</p>
            </div>
          ) : (
            <ExerciseView
              exercise={exercise}
              selectedOption={selectedOption}
              showFeedback={showFeedback}
              onOptionSelect={onOptionSelect}
              onContinue={onContinue}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
