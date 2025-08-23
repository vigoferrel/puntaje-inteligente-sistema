
import { useState, useEffect } from 'react';
import { NeuralBackendService, NeuralNotification } from '@/services/neural/neural-backend-service';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useNeuralNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NeuralNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotifications = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const userNotifications = await NeuralBackendService.getUserNotifications(user.id);
      setNotifications(userNotifications);
      setUnreadCount(userNotifications.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await NeuralBackendService.markNotificationAsRead(notificationId);
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const createNotification = async (notificationData: Omit<NeuralNotification, 'id' | 'created_at'>) => {
    try {
      const newNotification = await NeuralBackendService.createNotification(notificationData);
      setNotifications(prev => [newNotification, ...prev]);
      
      if (!newNotification.is_read) {
        setUnreadCount(prev => prev + 1);
      }

      // Mostrar toast para notificaciones importantes
      if (newNotification.priority === 'high' || newNotification.priority === 'urgent') {
        toast.success(newNotification.title, {
          description: newNotification.message,
          duration: 5000
        });
      }

      return newNotification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  };

  // Suscribirse a notificaciones en tiempo real
  useEffect(() => {
    if (!user) return;

    loadNotifications();

    const subscription = NeuralBackendService.subscribeToUserNotifications(
      user.id,
      (newNotification) => {
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);

        // Mostrar toast para notificaciones en tiempo real
        toast.info(newNotification.title, {
          description: newNotification.message,
          duration: 4000
        });
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return {
    notifications,
    unreadCount,
    isLoading,
    loadNotifications,
    markAsRead,
    createNotification
  };
};
