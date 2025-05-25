
import React, { createContext, useContext, useEffect } from 'react';
import { useCrossModuleDataSync, useAutomaticSync } from '@/core/intersectional-sync/CrossModuleDataSync';
import { useUnifiedPAES } from '@/core/unified-data-hub/UnifiedPAESHub';
import { toast } from '@/components/ui/use-toast';

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
    lastSyncTime 
  } = useCrossModuleDataSync();
  
  const { isInitialized } = useUnifiedPAES();
  
  // Activar sincronización automática
  useAutomaticSync(300000); // 5 minutos

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

  // Notificar cuando el sistema esté listo
  useEffect(() => {
    if (isIntersectionalReady) {
      toast({
        title: "🌐 Sistema Interseccional Activo",
        description: "Sincronización automática entre módulos habilitada",
      });
    }
  }, [isIntersectionalReady]);

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
