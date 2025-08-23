import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../../../types/core';


export interface ChatSettings {
  // Appearance settings
  fontSize: 'sm' | 'md' | 'lg';
  messageSpacing: 'compact' | 'normal' | 'relaxed';
  showTimestamps: boolean;
  
  // Behavior settings
  enterToSend: boolean;
  autoExpandImages: boolean;
  notificationSound: boolean;
}

export interface ChatSettingsContextType {
  settings: ChatSettings;
  updateSettings: <K extends keyof ChatSettings>(key: K, value: ChatSettings[K]) => void;
  resetSettings: () => void;
}

