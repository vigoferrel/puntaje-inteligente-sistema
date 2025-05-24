
import React from 'react';
import { LectoGuiaTabs } from './LectoGuiaTabs';
import { ChatTab } from './ChatTab';
import { ExerciseTab } from './ExerciseTab';
import { ProgressTab } from './ProgressTab';
import { useLectoGuia } from '@/contexts/LectoGuiaContext';

export const LectoGuiaContent: React.FC = () => {
  const {
    activeTab,
    currentExercise,
    selectedOption,
    showFeedback,
    handleOptionSelect,
    handleNewExercise
  } = useLectoGuia();

  // Extraer la fuente del ejercicio si está disponible
  const exerciseSource = (currentExercise as any)?.source || 
    (currentExercise?.id?.startsWith('paes-') ? 'PAES' : 'AI');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatTab />;
      case 'exercise':
        return (
          <ExerciseTab
            exercise={currentExercise}
            selectedOption={selectedOption}
            showFeedback={showFeedback}
            onOptionSelect={handleOptionSelect}
            onContinue={handleNewExercise}
            exerciseSource={exerciseSource}
          />
        );
      case 'progress':
        return <ProgressTab />;
      default:
        return <ChatTab />;
    }
  };

  return (
    <div className="space-y-4">
      <LectoGuiaTabs />
      {renderTabContent()}
    </div>
  );
};
