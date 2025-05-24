
import React from 'react';
import { LectoGuiaTabs } from './LectoGuiaTabs';
import { useLectoGuia } from '@/contexts/LectoGuiaContext';
import { ChatMessageType } from '@/components/ai/chat/types';

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

  // Convert ChatMessage[] to ChatMessageType[] format
  const convertedMessages: ChatMessageType[] = messages.map(message => ({
    id: message.id,
    role: message.role,
    content: message.content,
    timestamp: message.timestamp.toISOString(),
    imageData: message.imageData
  }));

  return (
    <div className="space-y-4">
      <LectoGuiaTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        messages={convertedMessages}
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
