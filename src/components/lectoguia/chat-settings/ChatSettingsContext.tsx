
import React, { createContext, useContext, useState, useEffect } from 'react';
import { unifiedStorageSystem } from '@/core/storage/UnifiedStorageSystem';
import { ChatSettings, ChatSettingsContextType } from './types';

const defaultSettings: ChatSettings = {
  fontSize: 'md',
  messageSpacing: 'normal',
  showTimestamps: true,
  enterToSend: true,
  autoExpandImages: true,
  notificationSound: true,
};

const SETTINGS_KEY = 'lectoguia_chat_settings_unified';

// Create context with default values
const ChatSettingsContext = createContext<ChatSettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  resetSettings: () => {},
});

export const useChatSettings = () => useContext(ChatSettingsContext);

export const ChatSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ChatSettings>(() => {
    // Load settings from UnifiedStorageSystem
    const savedSettings = unifiedStorageSystem.getItem(SETTINGS_KEY);
    return savedSettings || defaultSettings;
  });

  // Save settings to UnifiedStorageSystem when they change
  useEffect(() => {
    unifiedStorageSystem.setItem(SETTINGS_KEY, settings, { silentErrors: true });
  }, [settings]);

  const updateSettings = <K extends keyof ChatSettings>(key: K, value: ChatSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    unifiedStorageSystem.removeItem(SETTINGS_KEY);
  };

  return (
    <ChatSettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </ChatSettingsContext.Provider>
  );
};
