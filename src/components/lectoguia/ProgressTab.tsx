
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ProgressView } from "@/components/lectoguia/ProgressView";

interface ProgressTabProps {
  skillLevels: {
    'TRACK_LOCATE': number;
    'INTERPRET_RELATE': number;
    'EVALUATE_REFLECT': number;
  };
  onStartSimulation: () => void;
}

export const ProgressTab: React.FC<ProgressTabProps> = ({
  skillLevels,
  onStartSimulation
}) => {
  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="h-[calc(100vh-280px)] min-h-[500px] overflow-auto custom-scrollbar">
          <ProgressView 
            skillLevels={skillLevels}
            onStartSimulation={onStartSimulation}
          />
        </div>
      </CardContent>
    </Card>
  );
};
