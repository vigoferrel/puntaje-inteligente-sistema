
import { useState, useEffect } from 'react';

interface VirtualAssistantState {
  isFirstVisit: boolean;
  tourCompleted: boolean;
  currentTour: string | null;
  isChatOpen: boolean;
  assistantVisible: boolean;
}

export function useVirtualAssistant() {
  const [state, setState] = useState<VirtualAssistantState>({
    isFirstVisit: false,
    tourCompleted: false,
    currentTour: null,
    isChatOpen: false,
    assistantVisible: false
  });

  useEffect(() => {
    // Check if this is user's first visit
    const hasVisited = localStorage.getItem('superpaes_visited');
    const tourCompleted = localStorage.getItem('superpaes_tour_completed');
    
    if (!hasVisited) {
      setState(prev => ({ 
        ...prev, 
        isFirstVisit: true, 
        assistantVisible: true 
      }));
      localStorage.setItem('superpaes_visited', 'true');
    } else if (tourCompleted !== 'true') {
      setState(prev => ({ 
        ...prev, 
        assistantVisible: true 
      }));
    }
  }, []);

  const startTour = (tourType: string) => {
    setState(prev => ({ 
      ...prev, 
      currentTour: tourType 
    }));
  };

  const completeTour = () => {
    setState(prev => ({ 
      ...prev, 
      currentTour: null,
      tourCompleted: true,
      isFirstVisit: false
    }));
    localStorage.setItem('superpaes_tour_completed', 'true');
  };

  const skipTour = () => {
    setState(prev => ({ 
      ...prev, 
      currentTour: null,
      isFirstVisit: false
    }));
    localStorage.setItem('superpaes_tour_completed', 'true');
  };

  const openChat = () => {
    setState(prev => ({ 
      ...prev, 
      isChatOpen: true 
    }));
  };

  const closeChat = () => {
    setState(prev => ({ 
      ...prev, 
      isChatOpen: false 
    }));
  };

  const toggleAssistant = () => {
    setState(prev => ({ 
      ...prev, 
      assistantVisible: !prev.assistantVisible 
    }));
  };

  return {
    ...state,
    startTour,
    completeTour,
    skipTour,
    openChat,
    closeChat,
    toggleAssistant
  };
}
