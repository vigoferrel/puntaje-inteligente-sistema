
import React from 'react';
import { SuperPAESUnifiedHub } from '@/components/super-paes/SuperPAESUnifiedHub';
import { VirtualAssistant } from '@/components/virtual-assistant/VirtualAssistant';
import { TourGuide } from '@/components/virtual-assistant/TourGuide';
import { AIChat } from '@/components/virtual-assistant/AIChat';
import { useVirtualAssistant } from '@/hooks/useVirtualAssistant';
import { useLocation } from 'react-router-dom';

const Index: React.FC = () => {
  const location = useLocation();
  const {
    isFirstVisit,
    currentTour,
    isChatOpen,
    assistantVisible,
    startTour,
    completeTour,
    skipTour,
    openChat,
    closeChat
  } = useVirtualAssistant();

  return (
    <div className="relative">
      <SuperPAESUnifiedHub />
      
      {/* Asistente Virtual */}
      {assistantVisible && (
        <VirtualAssistant
          currentRoute={location.pathname}
          isFirstVisit={isFirstVisit}
          onStartTour={startTour}
          onShowHelp={openChat}
        />
      )}

      {/* Tour Guide */}
      <TourGuide
        tourType={currentTour as any || 'complete'}
        isActive={!!currentTour}
        onComplete={completeTour}
        onSkip={skipTour}
      />

      {/* AI Chat */}
      <AIChat
        isOpen={isChatOpen}
        onClose={closeChat}
        currentRoute={location.pathname}
      />
    </div>
  );
};

export default Index;
