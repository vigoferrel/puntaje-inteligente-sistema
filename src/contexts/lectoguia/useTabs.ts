
import { useState } from 'react';
import { UseTabsState } from './types';

export function useTabs(initialTab: string = 'chat'): UseTabsState {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  return {
    activeTab,
    setActiveTab
  };
}
