
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useCrossModuleDataSync, useAutomaticSync } from '@/core/intersectional-sync/CrossModuleDataSync';
import { useUnifiedPAES } from '@/core/unified-data-hub/UnifiedPAESHub';

interface IntersectionalContextType {
  isIntersectionalReady: boolean;
  crossModuleMetrics: any;
  unifiedUserProfile: any;
  syncAllModules: () => Promise<void>;
  generateIntersectionalInsights: () => any[];
}

const IntersectionalContext = createContext<IntersectionalContextType | undefined>(undefined);

export const useIntersectional = () => {
  const context = useContext(IntersectionalContext);
  if (!context) {
    throw new Error('useIntersectional must be used within IntersectionalProvider');
  }
  return context;
};

export const IntersectionalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    crossModuleMetrics, 
    unifiedUserProfile, 
    syncAllModules,
    generateUnifiedRecommendations,
    lastSyncTime,
    loadRealUserData
  } = useCrossModuleDataSync();
  
  const { isInitialized } = useUnifiedPAES();
  
  // Referencias para controlar notificaciones
  const hasNotifiedReady = useRef(false);
  const lastNotificationTime = useRef<Date | null>(null);
  
  // Activar sync automático con intervalo aumentado (5 minutos)
  useAutomaticSync(300000);

  const isIntersectionalReady = Boolean(
    isInitialized && 
    lastSyncTime && 
    crossModuleMetrics.systemCoherence > 50
  );

  const generateIntersectionalInsights = () => {
    const recommendations = generateUnifiedRecommendations();
    const coherenceLevel = crossModuleMetrics.systemCoherence;
    
    const insights = [
      {
        type: 'system-health',
        title: 'Estado del Sistema',
        description: `Coherencia interseccional: ${Math.round(coherenceLevel)}%`,
        level: coherenceLevel > 80 ? 'excellent' : coherenceLevel > 60 ? 'good' : 'needs-attention'
      },
      ...recommendations.map(rec => ({
        type: 'recommendation',
        title: rec.title,
        description: rec.description,
        level: rec.priority === 'Alta' ? 'high' : 'medium'
      }))
    ];

    return insights;
  };

  // Notificación controlada - solo una vez y con debounce
  useEffect(() => {
    if (isIntersectionalReady && !hasNotifiedReady.current) {
      const now = new Date();
      
      // Debounce de 30 segundos para notificaciones
      if (!lastNotificationTime.current || 
          (now.getTime() - lastNotificationTime.current.getTime()) > 30000) {
        
        // Usar setTimeout para mover fuera del ciclo de render
        setTimeout(() => {
          import('@/hooks/use-toast').then(({ toast }) => {
            toast({
              title: "🌐 Sistema Interseccional Activo",
              description: "Sincronización optimizada habilitada",
              duration: 3000
            });
          });
        }, 100);
        
        hasNotifiedReady.current = true;
        lastNotificationTime.current = now;
      }
    }
  }, [isIntersectionalReady]);

  // Cargar datos reales del usuario cuando esté disponible
  useEffect(() => {
    if (isInitialized && !unifiedUserProfile?.isLoaded) {
      loadRealUserData('user-123'); // TODO: usar userId real
    }
  }, [isInitialized, unifiedUserProfile?.isLoaded, loadRealUserData]);

  const contextValue: IntersectionalContextType = {
    isIntersectionalReady,
    crossModuleMetrics,
    unifiedUserProfile,
    syncAllModules,
    generateIntersectionalInsights,
  };

  return (
    <IntersectionalContext.Provider value={contextValue}>
      {children}
    </IntersectionalContext.Provider>
  );
};
