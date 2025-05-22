
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChatSettings, ChatSettingsContextType } from './types';

const defaultSettings: ChatSettings = {
  fontSize: 'md',
  messageSpacing: 'normal',
  showTimestamps: true,
  enterToSend: true,
  autoExpandImages: true,
  notificationSound: true,
};

// Create context with default values
const ChatSettingsContext = createContext<ChatSettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  resetSettings: () => {},
});

export const useChatSettings = () => useContext(ChatSettingsContext);

export const ChatSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ChatSettings>(() => {
    // Load settings from localStorage if available
    const savedSettings = localStorage.getItem('lectoguia-chat-settings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('lectoguia-chat-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = <K extends keyof ChatSettings>(key: K, value: ChatSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('lectoguia-chat-settings');
  };

  return (
    <ChatSettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </ChatSettingsContext.Provider>
  );
};
