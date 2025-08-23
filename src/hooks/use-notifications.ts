import { useState, useCallback } from 'react';
import { Notification } from '@/components/ui/NotificationToast';

export const useNotifications = () => {
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString()
    };
    setNotification(newNotification);

    // Auto-hide after duration or default 5 seconds
    const duration = notification.duration || 5000;
    setTimeout(() => {
      setNotification(null);
    }, duration);
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const showSuccess = useCallback((title: string, message: string, duration?: number) => {
    showNotification({ type: 'success', title, message, duration });
  }, [showNotification]);

  const showError = useCallback((title: string, message: string, duration?: number) => {
    showNotification({ type: 'error', title, message, duration });
  }, [showNotification]);

  const showInfo = useCallback((title: string, message: string, duration?: number) => {
    showNotification({ type: 'info', title, message, duration });
  }, [showNotification]);

  const showWarning = useCallback((title: string, message: string, duration?: number) => {
    showNotification({ type: 'warning', title, message, duration });
  }, [showNotification]);

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning
  };
};
