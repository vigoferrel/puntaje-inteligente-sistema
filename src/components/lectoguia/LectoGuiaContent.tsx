
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

  // Convertir mensajes del chat a formato ChatMessageType con manejo seguro de timestamps
  const convertedMessages: ChatMessageType[] = messages.map(message => ({
    id: message.id,
    role: message.role,
    content: message.content,
    // Convertir timestamp de manera segura
    timestamp: typeof message.timestamp === 'string' 
      ? message.timestamp 
      : message.timestamp instanceof Date 
        ? message.timestamp.toISOString()
        : new Date().toISOString(),
    imageData: message.imageData,
    imageUrl: message.imageData // Usar imageData como imageUrl para compatibilidad
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
