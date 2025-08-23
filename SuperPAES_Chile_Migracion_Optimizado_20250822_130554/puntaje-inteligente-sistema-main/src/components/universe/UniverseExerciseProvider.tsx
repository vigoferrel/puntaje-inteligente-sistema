/* eslint-disable react-refresh/only-export-components */
// Optimizado con Context7 - React.memo aplicado
import React, { createContext, useContext, useEffect, useState } from 'react'
import { memo } from 'react';
import { UniverseExerciseConnector, UniverseExercise, UniverseConfig } from '../../services/UniverseExerciseConnector'; // Importar de la fuente correcta
import { TPAESHabilidad } from '../../types/system-types';

// TODO: REMOVER ESTOS MOCKS CUANDO SE IMPLEMENTE UniverseExerciseConnector (este bloque solo)
const mockUniverseExerciseConnector = {
  initialize: async () => { console.log("Initializing mock connector"); return Promise.resolve(); },
  getUniverseConfig: (universeId: string): UniverseConfig | null => {
    if (universeId === 'paes') {
      return { id: 'paes', name: 'Universo PAES', description: 'Ejercicios para la prueba PAES', availablePruebas: ['Matemática', 'Historia', 'Ciencias'] };
    }
    return null;
  },
  getExercisesForUniverse: async (universeId: string) => {
    if (universeId === 'paes') {
      const exercises: UniverseExercise[] = [
        { id: '1', name: 'Ejercicio PAES 1', skill: 'SOLVE_PROBLEMS', type: 'Matemática', difficulty: 'easy' }, // Habilidad corregida
        { id: '2', name: 'Ejercicio PAES 2', skill: 'REPRESENT', type: 'Matemática', difficulty: 'medium' },    // Habilidad corregida
        { id: '3', name: 'Ejercicio PAES Historia 1', skill: 'MULTICAUSAL_ANALYSIS', type: 'Historia', difficulty: 'hard' }, // Habilidad corregida
      ];
      return Promise.resolve({ success: true, exercises, total: exercises.length, errors: [] });
    }
    return Promise.resolve({ success: false, exercises: [], total: 0, errors: [`Universo ${universeId} no existe`] });
  },
  clearCache: (universeId: string) => { console.log(`Clearing cache for ${universeId}`); },
  getExercisesBySkill: async (skill: TPAESHabilidad, universeId: string) => {
    const exercisesResult = await mockUniverseExerciseConnector.getExercisesForUniverse(universeId);
    if (exercisesResult.success) {
      const filtered = exercisesResult.exercises.filter(ex => ex.skill === skill);
      return { success: true, exercises: filtered, errors: [] };
    }
    return { success: false, exercises: [], errors: [`Error filtering by skill ${skill}`] };
  },
  getExerciseById: async (id: string, universeId: string) => {
    const exercisesResult = await mockUniverseExerciseConnector.getExercisesForUniverse(universeId);
    if (exercisesResult.success) {
      const exercise = exercisesResult.exercises.find(ex => ex.id === id);
      return { success: true, exercise, errors: [] };
    }
    return { success: false, exercise: null, errors: [`Exercise ${id} not found`] };
  },
  getUniverseStats: async () => Promise.resolve({ paes: { totalExercises: 100 } }),
  getUniverseConfigs: () => ([{ id: 'paes', name: 'Universo PAES', description: 'Ejercicios para la prueba PAES', availablePruebas: ['Matemática', 'Historia', 'Ciencias'] }]),
};

const UniverseExerciseConnectorAlias = UniverseExerciseConnector; // Usar el conector real importado
// Puedes conmutar a mockUniverseExerciseConnector para propósito de pruebas unitarias
// const UniverseExerciseConnectorAlias = mockUniverseExerciseConnector; 
// FIN MOCKS
 
interface UniverseExerciseContextType {
  exercises: UniverseExercise[];
  loading: boolean;
  error: string | null;
  currentUniverse: string;
  universeConfig: UniverseConfig | null;
  switchUniverse: (universeId: string) => void;
  getExercisesBySkill: (skill: TPAESHabilidad) => UniverseExercise[];
  refreshExercises: () => Promise<void>;
}

const UniverseExerciseContext = createContext<UniverseExerciseContextType | null>(null);

interface UniverseExerciseProviderProps {
  children: React.ReactNode;
  defaultUniverse?: string;
}

/**
 * Provider que hace disponible el banco de ejercicios de Supabase
 * a todos los componentes de los universos cinematogrÃƒÂ¡ficos
 */
export const UniverseExerciseProvider = memo(({ 
  children, 
  defaultUniverse = 'paes' 
}: UniverseExerciseProviderProps) => {
  const [exercises, setExercises] = useState<UniverseExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUniverse, setCurrentUniverse] = useState(defaultUniverse);
  const [universeConfig, setUniverseConfig] = useState<UniverseConfig | null>(null);

  // Inicializar conector al montar
  useEffect(() => {
    const initializeConnector = async () => {
      try {
        await UniverseExerciseConnectorAlias.initialize();
        console.log('✅ [UniverseExerciseProvider] Conector inicializado');
      } catch (error) {
        console.error('❌ [UniverseExerciseProvider] Error inicializando conector:', error);
      }
    };

    initializeConnector();
  }, []);

  // Cargar ejercicios cuando cambie el universo
  useEffect(() => {
    const loadUniverseData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Obtener configuraciÃƒÂ³n del universo
        const config = UniverseExerciseConnectorAlias.getUniverseConfig(currentUniverse);
        setUniverseConfig(config);

        if (!config) {
          setError(`Universo ${currentUniverse} no configurado`);
          return;
        }

        console.log(`🗺️ [UniverseExerciseProvider] Cargando universo: ${config.name}`);

        // Cargar ejercicios del universo
        const result = await UniverseExerciseConnectorAlias.getExercisesForUniverse(currentUniverse);

        if (result.success) {
          setExercises(result.exercises);
          console.log(`✅ [UniverseExerciseProvider] ${result.total} ejercicios cargados para ${config.name}`);
        } else {
          const errorMsg = result.errors.join(', ') || 'Error desconocido';
          setError(errorMsg);
          console.error(`❌ [UniverseExerciseProvider] Error:`, errorMsg);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error inesperado';
        setError(errorMsg);
        console.error(`💔 [UniverseExerciseProvider] Error crítico:`, err);
      } finally {
        setLoading(false);
      }
    };

    loadUniverseData();
  }, [currentUniverse]);

  // Cambiar de universo
  const switchUniverse = (universeId: string) => {
    console.log(`📡 [UniverseExerciseProvider] Cambiando a universo: ${universeId}`);
    setCurrentUniverse(universeId);
  };

  // Obtener ejercicios por habilidad
  const getExercisesBySkill = (skill: TPAESHabilidad): UniverseExercise[] => {
    return exercises.filter(exercise => exercise.skill === skill);
  };

  // Refrescar ejercicios
  const refreshExercises = async () => {
    console.log(`📡 [UniverseExerciseProvider] Refrescando ejercicios para ${currentUniverse}`);
    UniverseExerciseConnectorAlias.clearCache(currentUniverse);
    
    // Recargar datos
    const result = await UniverseExerciseConnectorAlias.getExercisesForUniverse(currentUniverse);
    if (result.success) {
      setExercises(result.exercises);
    }
  };

  const contextValue: UniverseExerciseContextType = {
    exercises,
    loading,
    error,
    currentUniverse,
    universeConfig,
    switchUniverse,
    getExercisesBySkill,
    refreshExercises
  };

  return (
    <UniverseExerciseContext.Provider value={contextValue}>
      {children}
    </UniverseExerciseContext.Provider>
  );
});

/**
 * Hook para usar el contexto de ejercicios del universo
 */
export const useUniverseExerciseContext = (): UniverseExerciseContextType => {
  const context = useContext(UniverseExerciseContext);
  
  if (!context) {
    throw new Error('useUniverseExerciseContext debe usarse dentro de UniverseExerciseProvider');
  }
  
  return context;
};

/**
 * Componente de estado de carga para ejercicios
 */
export const UniverseExerciseLoader = memo(({ children }: { children: React.ReactNode }) => {
  const { loading, error, exercises, universeConfig } = useUniverseExerciseContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando banco de ejercicios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-red-600 mb-4">Error cargando ejercicios: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-yellow-500 text-xl mb-2">📒</div>
          <p className="text-gray-600 mb-2">No hay ejercicios disponibles</p>
          <p className="text-sm text-gray-500">
            Universo: {universeConfig?.name || 'Desconocido'}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
});

/**
 * Componente de informaciÃƒÂ³n del universo actual
 */
export const UniverseInfo = memo(() => {
  const { universeConfig, exercises, currentUniverse } = useUniverseExerciseContext();

  if (!universeConfig) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-blue-900">{universeConfig.name}</h3>
          <p className="text-sm text-blue-700">{universeConfig.description}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{exercises.length}</div>
          <div className="text-xs text-blue-500">ejercicios disponibles</div>
        </div>
      </div>
      
      <div className="mt-3 flex flex-wrap gap-2">
        {universeConfig.availablePruebas.map(prueba => (
          <span 
            key={prueba}
            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
          >
            {prueba}
          </span>
        ))}
      </div>
    </div>
  );
});

export default UniverseExerciseProvider;
