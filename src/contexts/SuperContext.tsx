
import React, { createContext, useContext, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { useGlobalStore, useSystemState, useUser, useActions } from '@/store/globalStore';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface SuperContextType {
  // Estados unificados
  isInitialized: boolean;
  isLoading: boolean;
  user: any;
  cinematicMode: boolean;
  
  // Acciones unificadas
  initializeSystem: () => Promise<void>;
  navigateToModule: (module: string) => void;
  refreshData: () => Promise<void>;
  enableCinematicExperience: () => void;
}

const SuperContext = createContext<SuperContextType | undefined>(undefined);

export const useSuperContext = () => {
  const context = useContext(SuperContext);
  if (!context) {
    throw new Error('useSuperContext must be used within SuperContextProvider');
  }
  return context;
};

export const SuperContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const systemState = useSystemState();
  const user = useUser();
  const actions = useActions();
  const { profile } = useAuth();
  const cinematicMode = useGlobalStore(state => state.ui.cinematicMode);

  // Memoizar las acciones para evitar recreación en cada render
  const memoizedActions = useMemo(() => {
    const initializeSystem = async () => {
      if (systemState.isInitialized || systemState.isLoading || !user?.id) {
        console.log('⏭️ Saltando inicialización:', { 
          isInitialized: systemState.isInitialized, 
          isLoading: systemState.isLoading,
          hasUser: !!user?.id 
        });
        return;
      }

      try {
        actions.setSystemState({ isLoading: true, phase: 'auth' });
        
        console.log('🚀 Iniciando SuperContext...');
        
        // Fase simplificada: solo marcar como inicializado
        actions.setSystemState({ phase: 'complete' });
        actions.enableCinematicMode();
        actions.setInitialized(true);
        
        toast({
          title: "🎬 Sistema Activado",
          description: "Experiencia cinematográfica lista",
        });
        
      } catch (error) {
        console.error('❌ Error en inicialización:', error);
        actions.setError(`Error: ${error}`);
      }
    };

    const navigateToModule = (module: string) => {
      actions.setCurrentModule(module);
    };

    const refreshData = async () => {
      if (!user?.id || systemState.isLoading) return;
      console.log('🔄 Refrescando datos...');
    };

    const enableCinematicExperience = () => {
      actions.enableCinematicMode();
      toast({
        title: "🎬 Modo Cinematográfico",
        description: "Experiencia visual activada",
      });
    };

    return {
      initializeSystem,
      navigateToModule,
      refreshData,
      enableCinematicExperience,
    };
  }, [actions, systemState.isInitialized, systemState.isLoading, user?.id]);

  // Sincronización con perfil de autenticación (solo una vez)
  useEffect(() => {
    if (profile && !user && profile.id) {
      console.log('👤 Sincronizando usuario desde AuthContext');
      actions.setUser({
        id: profile.id,
        email: profile.email || '',
        name: profile.name || '',
        profile,
      });
    }
  }, [profile?.id, user?.id, actions]);

  // Auto-inicialización simplificada (solo una vez cuando cambia el estado crítico)
  useEffect(() => {
    if (user?.id && !systemState.isInitialized && !systemState.isLoading) {
      console.log('🎯 Iniciando auto-inicialización...');
      const timer = setTimeout(() => {
        memoizedActions.initializeSystem();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [user?.id, systemState.isInitialized, systemState.isLoading]);

  // Valor del contexto memoizado
  const contextValue: SuperContextType = useMemo(() => ({
    isInitialized: systemState.isInitialized,
    isLoading: systemState.isLoading,
    user,
    cinematicMode,
    ...memoizedActions,
  }), [
    systemState.isInitialized,
    systemState.isLoading,
    user,
    cinematicMode,
    memoizedActions,
  ]);

  return (
    <SuperContext.Provider value={contextValue}>
      {children}
    </SuperContext.Provider>
  );
};
