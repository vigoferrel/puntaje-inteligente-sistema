
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Bell, Mail, Phone, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNotificationPreferences } from '@/hooks/calendar/useNotificationPreferences';
import { usePushNotifications } from '@/hooks/calendar/usePushNotifications';

interface NotificationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  isOpen,
  onClose
}) => {
  const { preferences, updatePreferences, getPreferenceForEventType } = useNotificationPreferences();
  const { isSupported, isSubscribed, subscribe, unsubscribe } = usePushNotifications();
  
  const [selectedEventType, setSelectedEventType] = useState<string>('study_session');
  const [localSettings, setLocalSettings] = useState({
    email_enabled: true,
    push_enabled: true,
    sms_enabled: false,
    email_timing: ['15m', '1h'],
    push_timing: ['15m'],
    sms_timing: ['15m']
  });

  useEffect(() => {
    const preference = getPreferenceForEventType(selectedEventType);
    if (preference) {
      setLocalSettings({
        email_enabled: preference.email_enabled,
        push_enabled: preference.push_enabled,
        sms_enabled: preference.sms_enabled,
        email_timing: preference.email_timing,
        push_timing: preference.push_timing,
        sms_timing: preference.sms_timing
      });
    }
  }, [selectedEventType, preferences, getPreferenceForEventType]);

  const handleSave = async () => {
    await updatePreferences(selectedEventType, localSettings);
    onClose();
  };

  const handlePushToggle = async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
  };

  const updateSetting = (key: string, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-gray-900 border border-cyan-500/30 rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-semibold text-white">Configuración de Notificaciones</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <Label htmlFor="event-type" className="text-white text-sm font-medium">
              Tipo de Evento
            </Label>
            <Select value={selectedEventType} onValueChange={setSelectedEventType}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="study_session">Sesiones de Estudio</SelectItem>
                <SelectItem value="paes_date">Fechas PAES</SelectItem>
                <SelectItem value="deadline">Fechas Límite</SelectItem>
                <SelectItem value="reminder">Recordatorios</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white flex items-center space-x-2">
              <Bell className="w-4 h-4 text-purple-400" />
              <span>Métodos de Notificación</span>
            </h3>

            {/* Email Notifications */}
            <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <Label className="text-white">Email</Label>
                </div>
                <Switch
                  checked={localSettings.email_enabled}
                  onCheckedChange={(checked) => updateSetting('email_enabled', checked)}
                />
              </div>
              
              {localSettings.email_enabled && (
                <div className="text-sm text-gray-300">
                  Recibirás notificaciones por email 15 minutos y 1 hora antes del evento.
                </div>
              )}
            </div>

            {/* Push Notifications */}
            <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-purple-400" />
                  <Label className="text-white">Notificaciones Push</Label>
                </div>
                <div className="flex items-center space-x-2">
                  {isSupported && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePushToggle}
                      className="text-xs border-gray-600 text-gray-300"
                    >
                      {isSubscribed ? 'Desactivar' : 'Activar'}
                    </Button>
                  )}
                  <Switch
                    checked={localSettings.push_enabled && isSubscribed}
                    onCheckedChange={(checked) => updateSetting('push_enabled', checked)}
                    disabled={!isSubscribed}
                  />
                </div>
              </div>
              
              {!isSupported && (
                <div className="text-sm text-orange-300">
                  Las notificaciones push no son compatibles con este navegador.
                </div>
              )}
              
              {isSupported && !isSubscribed && (
                <div className="text-sm text-yellow-300">
                  Haz clic en "Activar" para habilitar las notificaciones push.
                </div>
              )}
              
              {localSettings.push_enabled && isSubscribed && (
                <div className="text-sm text-gray-300">
                  Recibirás notificaciones push 15 minutos antes del evento.
                </div>
              )}
            </div>

            {/* SMS Notifications */}
            <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-orange-400" />
                  <Label className="text-white">SMS</Label>
                </div>
                <Switch
                  checked={localSettings.sms_enabled}
                  onCheckedChange={(checked) => updateSetting('sms_enabled', checked)}
                  disabled
                />
              </div>
              
              <div className="text-sm text-gray-400">
                Las notificaciones SMS estarán disponibles próximamente.
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-700">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              Guardar Configuración
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
