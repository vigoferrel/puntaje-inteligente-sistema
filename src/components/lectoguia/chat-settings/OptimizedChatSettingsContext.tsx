
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { storageManager } from '@/core/storage/StorageManager';
import { ChatSettings, ChatSettingsContextType } from './types';

const defaultSettings: ChatSettings = {
  fontSize: 'md',
  messageSpacing: 'normal',
  showTimestamps: true,
  enterToSend: true,
  autoExpandImages: true,
  notificationSound: true,
};

const SETTINGS_KEY = 'lectoguia_chat_settings_v2';

const ChatSettingsContext = createContext<ChatSettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  resetSettings: () => {},
});

export const useChatSettings = () => useContext(ChatSettingsContext);

export const OptimizedChatSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ChatSettings>(() => {
    // Cargar desde el StorageManager optimizado
    const savedSettings = storageManager.getItem(SETTINGS_KEY);
    return savedSettings || defaultSettings;
  });

  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Guardar con debounce para evitar accesos excesivos
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      storageManager.setItem(SETTINGS_KEY, settings, { silentErrors: true });
    }, 1000); // Debounce de 1 segundo

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [settings]);

  const updateSettings = <K extends keyof ChatSettings>(key: K, value: ChatSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    storageManager.removeItem(SETTINGS_KEY);
  };

  return (
    <ChatSettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </ChatSettingsContext.Provider>
  );
};
