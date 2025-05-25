
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNotificationPreferences } from '@/hooks/calendar/useNotificationPreferences';
import { usePushNotifications } from '@/hooks/calendar/usePushNotifications';
import { Bell, Mail, Smartphone, Settings, Clock, Moon } from 'lucide-react';

interface NotificationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  isOpen,
  onClose
}) => {
  const { preferences, updatePreferences, getPreferenceForEventType } = useNotificationPreferences();
  const { isSupported, isSubscribed, permission, subscribe, unsubscribe } = usePushNotifications();

  const eventTypes = [
    { value: 'study_session', label: 'Sesiones de Estudio', icon: Clock },
    { value: 'paes_date', label: 'Fechas PAES', icon: Bell },
    { value: 'deadline', label: 'Fechas Límite', icon: Bell },
    { value: 'reminder', label: 'Recordatorios', icon: Bell }
  ];

  const timingOptions = [
    { value: '5m', label: '5 minutos antes' },
    { value: '15m', label: '15 minutos antes' },
    { value: '30m', label: '30 minutos antes' },
    { value: '1h', label: '1 hora antes' },
    { value: '2h', label: '2 horas antes' },
    { value: '1d', label: '1 día antes' },
    { value: '1w', label: '1 semana antes' }
  ];

  const handleNotificationToggle = async (eventType: string, notificationType: 'email' | 'push', enabled: boolean) => {
    const currentPrefs = getPreferenceForEventType(eventType);
    const updateData = {
      [`${notificationType}_enabled`]: enabled,
      email_timing: currentPrefs?.email_timing || ['15m', '1h'],
      push_timing: currentPrefs?.push_timing || ['15m'],
      sms_timing: currentPrefs?.sms_timing || ['15m'],
      quiet_hours: currentPrefs?.quiet_hours || { start: '22:00', end: '08:00' },
      timezone: currentPrefs?.timezone || 'America/Santiago'
    };

    await updatePreferences(eventType, updateData);
  };

  const handlePushSubscription = async () => {
    try {
      if (isSubscribed) {
        await unsubscribe();
      } else {
        await subscribe();
      }
    } catch (error) {
      console.error('Error managing push subscription:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl cinematic-card border-cyan-500/30 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 font-luxury text-white">
            <Settings className="h-5 w-5 text-cyan-400" />
            <span>Configuración de Notificaciones</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Estado de Push Notifications */}
          <Card className="cinematic-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 font-luxury">
                <Smartphone className="h-5 w-5 text-purple-400" />
                <span className="text-white">Notificaciones Push</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!isSupported && (
                  <Badge variant="destructive">
                    Tu navegador no soporta notificaciones push
                  </Badge>
                )}
                
                {isSupported && (
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-gray-300 font-medium">
                        Estado de las notificaciones push
                      </p>
                      <p className="text-gray-400 text-sm">
                        {permission === 'granted' ? 'Permisos otorgados' : 
                         permission === 'denied' ? 'Permisos denegados' : 
                         'Permisos pendientes'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={isSubscribed ? 'default' : 'outline'}>
                        {isSubscribed ? 'Activo' : 'Inactivo'}
                      </Badge>
                      <Button
                        onClick={handlePushSubscription}
                        variant={isSubscribed ? 'destructive' : 'default'}
                        className="cinematic-button"
                      >
                        {isSubscribed ? 'Desactivar' : 'Activar'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Configuración por tipo de evento */}
          <div className="grid gap-6">
            {eventTypes.map((eventType) => {
              const prefs = getPreferenceForEventType(eventType.value);
              const IconComponent = eventType.icon;

              return (
                <Card key={eventType.value} className="cinematic-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 font-luxury">
                      <IconComponent className="h-5 w-5 text-cyan-400" />
                      <span className="text-white">{eventType.label}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Email Notifications */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-blue-400" />
                            <Label className="text-gray-300 font-medium">
                              Notificaciones por Email
                            </Label>
                          </div>
                          <Switch
                            checked={prefs?.email_enabled || false}
                            onCheckedChange={(checked) => 
                              handleNotificationToggle(eventType.value, 'email', checked)
                            }
                          />
                        </div>
                        
                        {prefs?.email_enabled && (
                          <div className="space-y-2">
                            <Label className="text-gray-400 text-sm">
                              Enviar recordatorios:
                            </Label>
                            <div className="flex flex-wrap gap-2">
                              {timingOptions.map((timing) => (
                                <Badge 
                                  key={timing.value}
                                  variant={
                                    (prefs.email_timing as string[])?.includes(timing.value) ? 
                                    'default' : 'outline'
                                  }
                                  className="cursor-pointer text-xs"
                                >
                                  {timing.label}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Push Notifications */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Bell className="w-4 h-4 text-purple-400" />
                            <Label className="text-gray-300 font-medium">
                              Notificaciones Push
                            </Label>
                          </div>
                          <Switch
                            checked={prefs?.push_enabled || false}
                            onCheckedChange={(checked) => 
                              handleNotificationToggle(eventType.value, 'push', checked)
                            }
                          />
                        </div>
                        
                        {prefs?.push_enabled && (
                          <div className="space-y-2">
                            <Label className="text-gray-400 text-sm">
                              Enviar recordatorios:
                            </Label>
                            <div className="flex flex-wrap gap-2">
                              {timingOptions.map((timing) => (
                                <Badge 
                                  key={timing.value}
                                  variant={
                                    (prefs.push_timing as string[])?.includes(timing.value) ? 
                                    'default' : 'outline'
                                  }
                                  className="cursor-pointer text-xs"
                                >
                                  {timing.label}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Horario de silencio */}
          <Card className="cinematic-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 font-luxury">
                <Moon className="h-5 w-5 text-indigo-400" />
                <span className="text-white">Horario de Silencio</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-300 text-sm">
                  Las notificaciones no se enviarán durante este horario
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-400 text-sm">Desde</Label>
                    <div className="text-gray-300 font-medium">22:00</div>
                  </div>
                  <div>
                    <Label className="text-gray-400 text-sm">Hasta</Label>
                    <div className="text-gray-300 font-medium">08:00</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
