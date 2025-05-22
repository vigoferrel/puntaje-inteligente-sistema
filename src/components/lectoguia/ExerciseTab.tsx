
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ExerciseView } from "@/components/lectoguia/ExerciseView";
import { Exercise } from "@/types/ai-types";
import { BookOpen } from "lucide-react";

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
  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm">
      {exercise?.nodeId && (
        <CardHeader className="pb-0">
          <div className="flex items-center space-x-2 text-primary">
            <BookOpen size={18} />
            <span className="text-sm font-medium">
              Ejercicio del nodo de aprendizaje
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
