
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
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

  // Sincronización con contexto de autenticación existente
  useEffect(() => {
    if (profile && !user) {
      actions.setUser({
        id: profile.id,
        email: profile.email || '',
        name: profile.name || '',
        profile,
      });
    }
  }, [profile, user, actions]);

  // Inicialización unificada del sistema
  const initializeSystem = async () => {
    if (systemState.isInitialized || !user?.id) return;

    try {
      actions.setSystemState({ isLoading: true, phase: 'auth' });
      
      console.log('🚀 Iniciando SuperContext unificado...');
      
      // Fase 1: Autenticación (ya manejada por AuthContext)
      actions.setSystemState({ phase: 'nodes' });
      
      // Fase 2: Cargar nodos de aprendizaje
      // Usar servicios existentes pero de forma centralizada
      const { ensureLearningNodesExist } = await import('@/services/learning/initialize-learning-service');
      await ensureLearningNodesExist();
      
      // Fase 3: Validación del sistema
      actions.setSystemState({ phase: 'validation' });
      
      // Activar modo cinematográfico
      actions.enableCinematicMode();
      
      // Sincronizar todos los datos
      await actions.syncAllData();
      
      // Completar inicialización
      actions.setInitialized(true);
      
      toast({
        title: "🎬 Sistema Cinematográfico Activado",
        description: "Experiencia completa iniciada exitosamente",
      });
      
    } catch (error) {
      console.error('❌ Error en SuperContext:', error);
      actions.setError(`Error de inicialización: ${error}`);
    }
  };

  // Navegación unificada entre módulos
  const navigateToModule = (module: string) => {
    actions.setCurrentModule(module);
    
    // Efectos cinematográficos opcionales
    if (systemState.phase === 'complete') {
      console.log(`🎭 Navegando a módulo: ${module}`);
    }
  };

  // Actualización de datos
  const refreshData = async () => {
    if (!user?.id) return;
    await actions.syncAllData();
  };

  // Activar experiencia cinematográfica completa
  const enableCinematicExperience = () => {
    actions.enableCinematicMode();
    
    toast({
      title: "🎬 Modo Cinematográfico",
      description: "Experiencia visual mejorada activada",
    });
  };

  // Auto-inicialización cuando hay usuario
  useEffect(() => {
    if (user?.id && !systemState.isInitialized) {
      const timer = setTimeout(initializeSystem, 500);
      return () => clearTimeout(timer);
    }
  }, [user?.id, systemState.isInitialized]);

  const contextValue: SuperContextType = {
    isInitialized: systemState.isInitialized,
    isLoading: systemState.isLoading,
    user,
    cinematicMode: useGlobalStore(state => state.ui.cinematicMode),
    
    initializeSystem,
    navigateToModule,
    refreshData,
    enableCinematicExperience,
  };

  return (
    <SuperContext.Provider value={contextValue}>
      {children}
    </SuperContext.Provider>
  );
};
