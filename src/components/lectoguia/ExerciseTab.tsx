
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ExerciseView } from "@/components/lectoguia/ExerciseView";
import { Exercise } from "@/types/ai-types";

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
      <CardContent className="p-6">
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
