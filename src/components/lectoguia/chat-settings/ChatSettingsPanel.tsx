
import React from 'react';
import { useChatSettings } from './ChatSettingsContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Settings, RefreshCw } from 'lucide-react';

export const ChatSettingsPanel: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useChatSettings();

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <h3 className="text-lg font-medium">Configuración del Chat</h3>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={resetSettings}
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Reiniciar
        </Button>
      </div>
      
      <Separator />

      <div className="space-y-4">
        <h4 className="font-medium text-sm text-muted-foreground">Apariencia</h4>
        
        <div className="space-y-2">
          <Label htmlFor="font-size">Tamaño de texto</Label>
          <RadioGroup 
            value={settings.fontSize} 
            onValueChange={(val) => updateSettings('fontSize', val as 'sm' | 'md' | 'lg')}
            className="flex space-x-2"
            id="font-size"
          >
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="sm" id="font-sm" />
              <Label htmlFor="font-sm">Pequeño</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="md" id="font-md" />
              <Label htmlFor="font-md">Normal</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="lg" id="font-lg" />
              <Label htmlFor="font-lg">Grande</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message-spacing">Espaciado entre mensajes</Label>
          <RadioGroup 
            value={settings.messageSpacing} 
            onValueChange={(val) => updateSettings('messageSpacing', val as 'compact' | 'normal' | 'relaxed')}
            className="flex space-x-2"
            id="message-spacing"
          >
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="compact" id="spacing-compact" />
              <Label htmlFor="spacing-compact">Compacto</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="normal" id="spacing-normal" />
              <Label htmlFor="spacing-normal">Normal</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="relaxed" id="spacing-relaxed" />
              <Label htmlFor="spacing-relaxed">Amplio</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex items-center space-x-2 py-2">
          <Switch 
            id="show-timestamps" 
            checked={settings.showTimestamps}
            onCheckedChange={(checked) => updateSettings('showTimestamps', checked)}
          />
          <Label htmlFor="show-timestamps">Mostrar marca de tiempo en los mensajes</Label>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="font-medium text-sm text-muted-foreground">Comportamiento</h4>
        
        <div className="flex items-center space-x-2 py-2">
          <Switch 
            id="enter-to-send" 
            checked={settings.enterToSend}
            onCheckedChange={(checked) => updateSettings('enterToSend', checked)}
          />
          <Label htmlFor="enter-to-send">Usar Enter para enviar mensaje (Shift+Enter para nueva línea)</Label>
        </div>
        
        <div className="flex items-center space-x-2 py-2">
          <Switch 
            id="auto-expand-images" 
            checked={settings.autoExpandImages}
            onCheckedChange={(checked) => updateSettings('autoExpandImages', checked)}
          />
          <Label htmlFor="auto-expand-images">Expandir imágenes automáticamente</Label>
        </div>
        
        <div className="flex items-center space-x-2 py-2">
          <Switch 
            id="notification-sound" 
            checked={settings.notificationSound}
            onCheckedChange={(checked) => updateSettings('notificationSound', checked)}
          />
          <Label htmlFor="notification-sound">Sonido de notificación al recibir mensajes</Label>
        </div>
      </div>
    </div>
  );
};
