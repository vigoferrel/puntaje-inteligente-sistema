
import { useEffect, useState } from 'react';
import { storageManager } from '@/core/storage/StorageManager';

interface StorageHealthStatus {
  isHealthy: boolean;
  storageAvailable: boolean;
  cacheSize: number;
  queueLength: number;
  lastError?: string;
}

export const useStorageHealth = () => {
  const [status, setStatus] = useState<StorageHealthStatus>({
    isHealthy: true,
    storageAvailable: true,
    cacheSize: 0,
    queueLength: 0
  });

  useEffect(() => {
    const checkHealth = () => {
      const managerStatus = storageManager.getStatus();
      
      setStatus({
        isHealthy: managerStatus.storageAvailable && managerStatus.queueLength < 10,
        storageAvailable: managerStatus.storageAvailable,
        cacheSize: managerStatus.cacheSize,
        queueLength: managerStatus.queueLength
      });
    };

    // Verificar cada 30 segundos
    const interval = setInterval(checkHealth, 30000);
    checkHealth(); // Verificar inmediatamente

    return () => clearInterval(interval);
  }, []);

  return status;
};
