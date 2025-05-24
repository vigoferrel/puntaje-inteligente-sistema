
import React from 'react';
import { LectoGuiaTabs } from './LectoGuiaTabs';
import { useLectoGuia } from '@/contexts/LectoGuiaContext';

export const LectoGuiaContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    messages,
    isTyping,
    handleSendMessage,
    activeSubject,
    handleSubjectChange,
    currentExercise,
    selectedOption,
    showFeedback,
    handleOptionSelect,
    handleNewExercise,
    handleNodeSelect,
    isLoading
  } = useLectoGuia();

  return (
    <div className="space-y-4">
      <LectoGuiaTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        messages={messages}
        onSendMessage={handleSendMessage}
        isTyping={isTyping}
        activeSubject={activeSubject}
        onSubjectChange={handleSubjectChange}
        exercise={currentExercise}
        selectedOption={selectedOption}
        showFeedback={showFeedback}
        onOptionSelect={handleOptionSelect}
        onContinue={handleNewExercise}
        isLoading={isLoading}
        onNodeSelect={handleNodeSelect}
      />
    </div>
  );
};
