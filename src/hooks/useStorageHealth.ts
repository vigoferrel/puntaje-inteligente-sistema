
import { useEffect, useState } from 'react';
import { unifiedStorageSystem } from '@/core/storage/UnifiedStorageSystem';

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
      const systemStatus = unifiedStorageSystem.getStatus();
      const metrics = unifiedStorageSystem.getPerformanceMetrics();
      
      setStatus({
        isHealthy: systemStatus.storageAvailable && systemStatus.queueLength < 10,
        storageAvailable: systemStatus.storageAvailable,
        cacheSize: systemStatus.cacheSize,
        queueLength: systemStatus.queueLength
      });
    };

    // Verificar cada 30 segundos
    const interval = setInterval(checkHealth, 30000);
    checkHealth(); // Verificar inmediatamente

    return () => clearInterval(interval);
  }, []);

  return status;
};
