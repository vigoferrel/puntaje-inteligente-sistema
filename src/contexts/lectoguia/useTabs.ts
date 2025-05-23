
import { useState } from 'react';
import { UseTabsState } from './types';

export function useTabs(initialTab: 'chat' | 'exercise' | 'progress' = 'chat'): UseTabsState {
  const [activeTab, setActiveTab] = useState<'chat' | 'exercise' | 'progress'>(initialTab);
  
  return {
    activeTab,
    setActiveTab
  };
}
