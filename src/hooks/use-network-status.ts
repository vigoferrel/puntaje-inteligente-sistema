import { useState, useEffect, useCallback } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  isSupabaseAvailable: boolean;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'offline';
  lastChecked: Date;
}

export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    isSupabaseAvailable: false,
    connectionQuality: 'offline',
    lastChecked: new Date()
  });

  const checkSupabaseConnection = useCallback(async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const startTime = Date.now();
      const response = await fetch('https://settifboilityelprvjd.supabase.co/rest/v1/', {
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
        }
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      if (response.ok) {
        // Determine connection quality based on response time
        let quality: 'excellent' | 'good' | 'poor' = 'excellent';
        if (responseTime > 2000) quality = 'poor';
        else if (responseTime > 1000) quality = 'good';

        setNetworkStatus(prev => ({
          ...prev,
          isSupabaseAvailable: true,
          connectionQuality: quality,
          lastChecked: new Date()
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.warn('Supabase connection check failed:', error);
      setNetworkStatus(prev => ({
        ...prev,
        isSupabaseAvailable: false,
        connectionQuality: prev.isOnline ? 'poor' : 'offline',
        lastChecked: new Date()
      }));
      return false;
    }
  }, []);

  const checkNetworkStatus = useCallback(async () => {
    const isOnline = navigator.onLine;
    
    setNetworkStatus(prev => ({
      ...prev,
      isOnline,
      lastChecked: new Date()
    }));

    if (isOnline) {
      await checkSupabaseConnection();
    } else {
      setNetworkStatus(prev => ({
        ...prev,
        isSupabaseAvailable: false,
        connectionQuality: 'offline'
      }));
    }
  }, [checkSupabaseConnection]);

  useEffect(() => {
    // Initial check only once
    checkNetworkStatus();

    // Set up event listeners
    const handleOnline = () => {
      setNetworkStatus(prev => ({ ...prev, isOnline: true }));
      checkSupabaseConnection();
    };

    const handleOffline = () => {
      setNetworkStatus(prev => ({
        ...prev,
        isOnline: false,
        isSupabaseAvailable: false,
        connectionQuality: 'offline'
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic checks every 60 seconds (less frequent)
    const interval = setInterval(() => {
      if (navigator.onLine) {
        checkSupabaseConnection();
      }
    }, 60000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []); // Remove dependencies to prevent re-runs

  return {
    ...networkStatus,
    checkConnection: checkNetworkStatus,
    forceSupabaseCheck: checkSupabaseConnection
  };
};
