// 🎯 BANCO DE EJERCICIOS CUÁNTICO - Context9 + Modo Secuencial
// El corazón del sistema educativo con visión global del bosque
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TPAESPrueba, TPAESHabilidad } from '../../types/system-types';
import { BloomLevelId } from '../../types/bloom';
import { useContext9Orchestration } from '../../contexts/Context9Orchestrator';
import { memo } from 'react';
import { 
  UniverseIntegration, 
  useUniverseExerciseContext, 
  UniverseExerciseLoader
} from './index';

// 🧬 INTERFACE CUÁNTICA MEJORADA
interface QuantumExercise {
  id: string;
  title: string;
  content: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  estimatedTime: number;
  prueba: TPAESPrueba;
  skill: TPAESHabilidad;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  exerciseType: string;
  bloomLevel: BloomLevelId;
  cognitiveAction: string;
  contentType: 'texto' | 'formula' | 'grafico' | 'experimento' | 'fuente';
  imageUrl?: string;
  quantumSignature: string;
  marbleState: 'initialized' | 'processing' | 'complete';
}

// 🎭 COMPONENTE DE CARGA SECUENCIAL ELEGANTE
const SequentialLoadingIndicator: React.FC<{ context9: ReturnType<typeof useContext9Orchestration> }> = ({ context9 }) => (
  <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center z-50">
    <div className="bg-black bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 text-center text-white max-w-md mx-4">
      <div className="mb-6">
        <div className="w-16 h-16 mx-auto mb-4 relative">
          <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-2 border-purple-400 border-b-transparent rounded-full animate-spin animate-reverse"></div>
        </div>
        <h3 className="text-xl font-bold mb-2">Context9 Mirando el Bosque</h3>
        <p className="text-blue-300 text-sm">Activación secuencial en progreso...</p>
      </div>
      
      <div className="mb-4">
        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 progress-fill"
            style={{ '--progress-width': `${(context9.sequentialMode.currentStep / context9.sequentialMode.totalSteps) * 100}%` } as React.CSSProperties}
          />
        </div>
        <p className="text-sm">
          Paso {context9.sequentialMode.currentStep} de {context9.sequentialMode.totalSteps}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {context9.sequentialMode.completedSteps[context9.sequentialMode.currentStep - 1] || 'Inicializando sistemas...'}
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="bg-gray-800 rounded-lg p-2">
          <div className="text-green-400 font-medium">🧠 Quantum Kidney</div>
          <div>{context9.quantumKidney?.status?.overallHealth || 0}% Salud</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-2">
          <div className="text-purple-400 font-medium">💎 Quantum Marble</div>
          <div>{context9.quantumMarble ? 'Activo' : 'Inicializando'}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-2">
          <div className="text-yellow-400 font-medium">🎯 Tesoros</div>
          <div>{context9.copilotStatus.readyCount}/{context9.copilotStatus.treasureCount}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-2">
          <div className="text-cyan-400 font-medium">⚡ Estado</div>
          <div>{context9.copilotStatus.isReady ? 'Listo' : 'Cargando'}</div>
        </div>
      </div>
    </div>
  </div>
);

// 🎯 HOOK CUÁNTICO PRINCIPAL
const useQuantumExerciseState = () => {
  const context9 = useContext9Orchestration();
  
  const quantumState = useMemo(() => ({
    kidneyHealth: context9.quantumKidney?.status?.overallHealth || 0,
    marbleState: context9.quantumMarble?.orchestrateQuantumState()?.marble || { initialized: false },
    sequentialProgress: context9.sequentialMode.currentStep / context9.sequentialMode.totalSteps,
    treasuresReady: context9.copilotStatus.readyCount,
    isSystemReady: context9.copilotStatus.isReady,
    totalTreasures: context9.copilotStatus.treasureCount
  }), [context9]);
  
  const activateExerciseBank = useCallback(() => {
    context9.activateTreasure('exerciseBank');
  }, [context9]);
  
  return { quantumState, activateExerciseBank };
};

// 🌟 INTERFACE PRINCIPAL CUÁNTICA
const QuantumExerciseInterface: React.FC = () => {
  const { quantumState, activateExerciseBank } = useQuantumExerciseState();
  const { exercises, universeConfig } = useUniverseExerciseContext();
  
  const [selectedPrueba, setSelectedPrueba] = useState<TPAESPrueba>('COMPETENCIA_LECTORA');
  const [bloomLevel, setBloomLevel] = useState<BloomLevelId>('L1');

  useEffect(() => {
    activateExerciseBank();
  }, [activateExerciseBank]);

  // 🛡️ VERIFICACIÓN DE SALUD DEL SISTEMA
  if (quantumState.kidneyHealth < 60) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center text-white">
        <div className="bg-red-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold mb-4">Sistema Cuántico Degradado</h3>
          <p className="mb-4">Quantum Kidney reporta {quantumState.kidneyHealth}% de salud</p>
          <p className="text-sm text-red-200">Reinicia el sistema para optimización completa</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* 🎨 HEADER CUÁNTICO */}
      <div className="bg-black bg-opacity-30 backdrop-blur-lg border-b border-white border-opacity-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                🎯 Banco de Ejercicios Cuántico
              </h1>
              <p className="text-blue-300 text-sm">
                Context9 + Modo Secuencial + Taxonomía Bloom + Estructuras PAES
              </p>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="bg-green-500 bg-opacity-20 px-3 py-1 rounded-full text-green-300">
                🧠 {quantumState.kidneyHealth}% Salud
              </div>
              <div className="bg-purple-500 bg-opacity-20 px-3 py-1 rounded-full text-purple-300">
                💎 {quantumState.marbleState.initialized ? 'Activo' : 'Inactivo'}
              </div>
              <div className="bg-yellow-500 bg-opacity-20 px-3 py-1 rounded-full text-yellow-300">
                🎯 {quantumState.treasuresReady}/{quantumState.totalTreasures}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🎛️ CONTROLES PRINCIPALES */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Selector Bloom */}
          <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
              🌸 Nivel Taxonomía Bloom
            </h3>
            <select
              value={bloomLevel}
              onChange={(e) => setBloomLevel(e.target.value as BloomLevelId)}
              className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Seleccionar nivel de taxonomía Bloom"
            >
              <option value="L1">L1: Recordar - Memory Palace</option>
              <option value="L2">L2: Comprender - Comprehension Lab</option>
              <option value="L3">L3: Aplicar - Workshop Arena</option>
              <option value="L4">L4: Analizar - Detective Center</option>
              <option value="L5">L5: Evaluar - Judgment Hub</option>
              <option value="L6">L6: Crear - Innovation Space</option>
            </select>
          </div>

          {/* Selector PAES */}
          <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
              📚 Estructura PAES
            </h3>
            <select
              value={selectedPrueba}
              onChange={(e) => setSelectedPrueba(e.target.value as TPAESPrueba)}
              className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              aria-label="Seleccionar estructura de prueba PAES"
            >
              <option value="COMPETENCIA_LECTORA">📖 Competencia Lectora - Textos + Análisis</option>
              <option value="MATEMATICA_1">🔢 Matemática 1 - Fórmulas + Gráficos</option>
              <option value="MATEMATICA_2">📐 Matemática 2 - Funciones + Geometría</option>
              <option value="CIENCIAS">🧪 Ciencias - Experimentos + Diagramas</option>
              <option value="HISTORIA">🏛️ Historia - Fuentes + Cronologías</option>
            </select>
          </div>
        </div>

        {/* 🎨 ÁREA DE EJERCICIOS */}
        <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20">
          <div className="text-center">
            <div className="text-6xl mb-4">
              {selectedPrueba === 'COMPETENCIA_LECTORA' && '📖'}
              {selectedPrueba === 'MATEMATICA_1' && '🔢'}
              {selectedPrueba === 'MATEMATICA_2' && '📐'}
              {selectedPrueba === 'CIENCIAS' && '🧪'}
              {selectedPrueba === 'HISTORIA' && '🏛️'}
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Ejercicios {selectedPrueba.replace(/_/g, ' ')}
            </h3>
            <p className="text-blue-300 mb-6">
              Nivel Bloom: {bloomLevel} | Estructura diferenciada por tipo de contenido
            </p>
            
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 bg-opacity-20 rounded-xl p-6 mb-6">
              <p className="text-white text-lg">
                🚀 Generando ejercicios adaptativos con Context9...
              </p>
              <p className="text-blue-200 text-sm mt-2">
                Integración con Gemini + OpenRouter + Banco de Imágenes en desarrollo
              </p>
            </div>
          </div>
        </div>

        {/* 📊 MÉTRICAS DEL SISTEMA */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-500 bg-opacity-20 backdrop-blur-lg rounded-xl p-4 text-center border border-blue-500 border-opacity-30">
            <div className="text-2xl font-bold text-blue-300">{exercises.length}</div>
            <div className="text-blue-200 text-sm">Ejercicios Totales</div>
          </div>
          <div className="bg-purple-500 bg-opacity-20 backdrop-blur-lg rounded-xl p-4 text-center border border-purple-500 border-opacity-30">
            <div className="text-2xl font-bold text-purple-300">{universeConfig?.availableSkills?.length || 0}</div>
            <div className="text-purple-200 text-sm">Habilidades PAES</div>
          </div>
          <div className="bg-green-500 bg-opacity-20 backdrop-blur-lg rounded-xl p-4 text-center border border-green-500 border-opacity-30">
            <div className="text-2xl font-bold text-green-300">6</div>
            <div className="text-green-200 text-sm">Niveles Bloom</div>
          </div>
          <div className="bg-yellow-500 bg-opacity-20 backdrop-blur-lg rounded-xl p-4 text-center border border-yellow-500 border-opacity-30">
            <div className="text-2xl font-bold text-yellow-300">{Math.round(quantumState.sequentialProgress * 100)}%</div>
            <div className="text-yellow-200 text-sm">Progreso Context9</div>
          </div>
        </div>
      </div>

      {/* 🎭 FOOTER CUÁNTICO */}
      <div className="bg-black bg-opacity-50 backdrop-blur-lg border-t border-white border-opacity-20 mt-8">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center">
          <p className="text-gray-400 text-sm">
            🎯 Banco de Ejercicios Cuántico | Context9 + Modo Secuencial | 
            Estado: <span className="text-green-400 font-medium">
              {quantumState.isSystemReady ? 'Sistema Listo' : 'Inicializando'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
 
// 🎯 COMPONENTE PRINCIPAL
const ExerciseBankDemo: React.FC = () => {
  const context9 = useContext9Orchestration();
  const [isSequentialReady, setIsSequentialReady] = useState(false);
 
  // 🚀 ACTIVACIÓN SECUENCIAL AUTOMÁTICA
  useEffect(() => {
    if (!context9.sequentialMode.isActive) {
      console.log('🎯 ExerciseBankDemo: Iniciando activación secuencial Context9');
      context9.startSequentialActivation();
    }
  }, [context9]);
 
  // 👁️ MONITOREO DEL PROGRESO SECUENCIAL
  useEffect(() => {
    const isComplete = context9.sequentialMode.completedSteps.length === context9.sequentialMode.totalSteps;
    const isReady = context9.copilotStatus.isReady;
    
    if (isComplete || isReady) {
      console.log('✅ ExerciseBankDemo: Context9 listo, mostrando interface cuántica');
      setIsSequentialReady(true);
    }
  }, [context9.sequentialMode, context9.copilotStatus]);
 
  return (
    <UniverseIntegration universeId="paes">
      <UniverseExerciseLoader>
        {isSequentialReady ? (
          <QuantumExerciseInterface />
        ) : (
          <SequentialLoadingIndicator context9={context9} />
        )}
      </UniverseExerciseLoader>
    </UniverseIntegration>
  );
};
 
export default memo(ExerciseBankDemo);
