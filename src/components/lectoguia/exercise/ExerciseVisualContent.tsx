
import React, { useState } from 'react';
import { Exercise } from '@/types/ai-types';
import { ChatImagePreview } from '@/components/ai/chat/ChatImagePreview';

interface ExerciseVisualContentProps {
  exercise: Exercise;
}

export const ExerciseVisualContent: React.FC<ExerciseVisualContentProps> = ({ exercise }) => {
  const [expandedImage, setExpandedImage] = useState(false);
  
  // If there's an image associated with the exercise
  if (exercise.imageUrl) {
    return (
      <div className="mb-4">
        <ChatImagePreview 
          imageUrl={exercise.imageUrl} 
          isExpanded={expandedImage}
          onToggleExpand={() => setExpandedImage(!expandedImage)}
        />
      </div>
    );
  }
  
  // If there are graph data associated with the exercise
  if (exercise.graphData && exercise.visualType === 'graph') {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <p className="text-xs text-muted-foreground mb-2">Gráfico relacionado:</p>
        <div className="bg-secondary/20 p-4 rounded border border-dashed border-primary/30 text-center">
          [Visualización de gráfico]
        </div>
      </div>
    );
  }
  
  // For other types of visual content that might be added in the future
  if (exercise.hasVisualContent && exercise.visualType) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <p className="text-xs text-muted-foreground mb-2">
          Contenido visual: {exercise.visualType}
        </p>
        <div className="bg-secondary/20 p-4 rounded border border-dashed border-primary/30 text-center">
          [Contenido visual no disponible]
        </div>
      </div>
    );
  }
  
  return null;
};
