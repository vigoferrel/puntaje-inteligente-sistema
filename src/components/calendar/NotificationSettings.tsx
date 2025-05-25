
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Mail, Phone, Clock, Volume2 } from 'lucide-react';
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
  const { preferences, updatePreferences, isLoading } = useNotificationPreferences();
  const { 
    isSupported, 
    isSubscribed, 
    permission, 
    subscribe, 
    unsubscribe, 
    requestPermission 
  } = usePushNotifications();

  const [settings, setSettings] = useState({
    study_session: {
      email_enabled: true,
      push_enabled: true,
      sms_enabled: false,
      email_timing: ['15m', '1h'],
      push_timing: ['15m'],
      sms_timing: ['15m']
    },
    paes_date: {
      email_enabled: true,
      push_enabled: true,
      sms_enabled: false,
      email_timing: ['1d', '1h'],
      push_timing: ['1d', '1h'],
      sms_timing: ['1h']
    },
    deadline: {
      email_enabled: true,
      push_enabled: true,
      sms_enabled: false,
      email_timing: ['1d', '1h'],
      push_timing: ['1h'],
      sms_timing: ['1h']
    },
    reminder: {
      email_enabled: false,
      push_enabled: true,
      sms_enabled: false,
      email_timing: ['15m'],
      push_timing: ['15m'],
      sms_timing: ['15m']
    }
  });

  useEffect(() => {
    if (preferences) {
      // Actualizar settings con las preferencias del usuario
      const updatedSettings = { ...settings };
      preferences.forEach(pref => {
        if (updatedSettings[pref.event_type as keyof typeof settings]) {
          updatedSettings[pref.event_type as keyof typeof settings] = {
            email_enabled: pref.email_enabled,
            push_enabled: pref.push_enabled,
            sms_enabled: pref.sms_enabled,
            email_timing: pref.email_timing,
            push_timing: pref.push_timing,
            sms_timing: pref.sms_timing
          };
        }
      });
      setSettings(updatedSettings);
    }
  }, [preferences]);

  const handleTogglePushNotifications = async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      if (permission === 'default') {
        await requestPermission();
      }
      if (permission === 'granted') {
        await subscribe();
      }
    }
  };

  const handleSaveSettings = async () => {
    for (const [eventType, eventSettings] of Object.entries(settings)) {
      await updatePreferences(eventType, eventSettings);
    }
    onClose();
  };

  const eventTypeLabels = {
    study_session: 'Sesiones de Estudio',
    paes_date: 'Fechas PAES',
    deadline: 'Fechas Límite',
    reminder: 'Recordatorios'
  };

  const timingOptions = [
    { value: '5m', label: '5 minutos antes' },
    { value: '15m', label: '15 minutos antes' },
    { value: '30m', label: '30 minutos antes' },
    { value: '1h', label: '1 hora antes' },
    { value: '2h', label: '2 horas antes' },
    { value: '1d', label: '1 día antes' },
    { value: '1w', label: '1 semana antes' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl cinematic-card border-cyan-500/30 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 font-luxury text-white">
            <Bell className="h-5 w-5 text-cyan-400" />
            <span>Configuración de Notificaciones</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Estado General de Notificaciones Push */}
          {isSupported && (
            <Card className="cinematic-card border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 font-luxury text-white">
                  <Volume2 className="h-5 w-5 text-purple-400" />
                  <span>Notificaciones Push del Navegador</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-gray-300">
                      Recibe notificaciones incluso cuando la aplicación esté cerrada
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={permission === 'granted' ? 'default' : 'destructive'}
                        className="font-medium"
                      >
                        {permission === 'granted' ? 'Permitido' : 
                         permission === 'denied' ? 'Bloqueado' : 'Pendiente'}
                      </Badge>
                      {isSubscribed && (
                        <Badge variant="outline" className="text-green-400 border-green-400">
                          Activo
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleTogglePushNotifications}
                    disabled={permission === 'denied'}
                    className="cinematic-button"
                  >
                    {isSubscribed ? 'Desactivar' : 'Activar'} Push
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Configuración por Tipo de Evento */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white font-luxury">
              Configuración por Tipo de Evento
            </h3>
            
            {Object.entries(settings).map(([eventType, eventSettings]) => (
              <Card key={eventType} className="cinematic-card border-gray-600/30">
                <CardHeader>
                  <CardTitle className="text-white font-luxury">
                    {eventTypeLabels[eventType as keyof typeof eventTypeLabels]}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Canales de Notificación */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Email */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-blue-400" />
                        <Label className="text-gray-300 font-medium">Email</Label>
                      </div>
                      
                      <Switch
                        checked={eventSettings.email_enabled}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          [eventType]: { ...eventSettings, email_enabled: checked }
                        })}
                      />
                      
                      {eventSettings.email_enabled && (
                        <Select 
                          value={eventSettings.email_timing[0]} 
                          onValueChange={(value) => setSettings({
                            ...settings,
                            [eventType]: { ...eventSettings, email_timing: [value] }
                          })}
                        >
                          <SelectTrigger className="bg-gray-800 border-gray-600 text-white text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timingOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    {/* Push */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Bell className="w-4 h-4 text-purple-400" />
                        <Label className="text-gray-300 font-medium">Push</Label>
                      </div>
                      
                      <Switch
                        checked={eventSettings.push_enabled}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          [eventType]: { ...eventSettings, push_enabled: checked }
                        })}
                      />
                      
                      {eventSettings.push_enabled && (
                        <Select 
                          value={eventSettings.push_timing[0]} 
                          onValueChange={(value) => setSettings({
                            ...settings,
                            [eventType]: { ...eventSettings, push_timing: [value] }
                          })}
                        >
                          <SelectTrigger className="bg-gray-800 border-gray-600 text-white text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timingOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    {/* SMS */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-orange-400" />
                        <Label className="text-gray-300 font-medium">SMS</Label>
                      </div>
                      
                      <Switch
                        checked={eventSettings.sms_enabled}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          [eventType]: { ...eventSettings, sms_enabled: checked }
                        })}
                      />
                      
                      {eventSettings.sms_enabled && (
                        <Select 
                          value={eventSettings.sms_timing[0]} 
                          onValueChange={(value) => setSettings({
                            ...settings,
                            [eventType]: { ...eventSettings, sms_timing: [value] }
                          })}
                        >
                          <SelectTrigger className="bg-gray-800 border-gray-600 text-white text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timingOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSaveSettings} className="cinematic-button">
              Guardar Configuración
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
