
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const { profile } = useAuth();

  useEffect(() => {
    checkSupport();
    checkPermission();
    registerServiceWorker();
  }, []);

  const checkSupport = () => {
    const supported = 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
    setIsSupported(supported);
  };

  const checkPermission = () => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  };

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js');
        setRegistration(reg);
        
        // Verificar si ya está suscrito
        const subscription = await reg.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      } catch (error) {
        console.error('Error registering service worker:', error);
      }
    }
  };

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      throw new Error('Push notifications not supported');
    }

    const permission = await Notification.requestPermission();
    setPermission(permission);
    
    if (permission === 'granted') {
      toast({
        title: "Notificaciones habilitadas",
        description: "Ahora recibirás notificaciones push"
      });
    } else {
      toast({
        title: "Notificaciones bloqueadas",
        description: "No se pueden enviar notificaciones push",
        variant: "destructive"
      });
    }

    return permission;
  };

  const subscribe = async () => {
    if (!registration || !profile) {
      throw new Error('Service worker not registered or user not logged in');
    }

    if (permission !== 'granted') {
      const newPermission = await requestPermission();
      if (newPermission !== 'granted') {
        throw new Error('Permission not granted');
      }
    }

    try {
      // Generar VAPID keys en el servidor (esto debería estar en las variables de entorno)
      const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HI0DLLfdUNzNoaMjc5FMwm__sB1r2_71DXoJoSkJzP2FWuQG5vSB5pqHtI'; // Clave pública VAPID
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      // Guardar la suscripción en la base de datos
      const { error } = await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: profile.id,
          endpoint: subscription.endpoint,
          p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
          auth: arrayBufferToBase64(subscription.getKey('auth')!),
          user_agent: navigator.userAgent
        }, {
          onConflict: 'user_id,endpoint'
        });

      if (error) throw error;

      setIsSubscribed(true);
      
      toast({
        title: "Suscripción exitosa",
        description: "Recibirás notificaciones push de PAES Command"
      });

      return subscription;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      toast({
        title: "Error de suscripción",
        description: "No se pudo activar las notificaciones push",
        variant: "destructive"
      });
      throw error;
    }
  };

  const unsubscribe = async () => {
    if (!registration || !profile) return;

    try {
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        
        // Eliminar de la base de datos
        const { error } = await supabase
          .from('push_subscriptions')
          .delete()
          .eq('user_id', profile.id)
          .eq('endpoint', subscription.endpoint);

        if (error) throw error;
      }

      setIsSubscribed(false);
      
      toast({
        title: "Suscripción cancelada",
        description: "Ya no recibirás notificaciones push"
      });
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      toast({
        title: "Error",
        description: "No se pudo cancelar la suscripción",
        variant: "destructive"
      });
    }
  };

  // Utilidades
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  return {
    isSupported,
    isSubscribed,
    permission,
    registration,
    requestPermission,
    subscribe,
    unsubscribe
  };
};
