/* eslint-disable react-refresh/only-export-components */
/**
 * ðŸŒŒ QUANTUM MARBLE MONITOR
 * Monitor de Estado del MÃ¡rmol CuÃ¡ntico
 * VisualizaciÃ³n de OrquestaciÃ³n Global
 */

import React, { useState, useEffect } from 'react';
import { useQuantumMarble } from '../../core/QuantumMarbleOrchestrator';

interface MarbleState {
  marble: {
    initialized: boolean;
    patterns: {
      router: unknown;
      auth: unknown;
      performance: unknown;
    };
    globalState: Record<string, unknown>;
    observerCount: number;
  };
  context7: {
    coherence: number;
    entanglements: number;
    sequentialMode: boolean;
  };
}

export const QuantumMarbleMonitor: React.FC = () => {
  const marble = useQuantumMarble();
  const [marbleState, setMarbleState] = useState<MarbleState | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // ðŸ”„ ACTUALIZACIÃ“N PERIÃ“DICA DEL ESTADO
    const updateState = () => {
      const state = marble.orchestrateQuantumState() as MarbleState;
      setMarbleState(state);
    };

    updateState();
    const interval = setInterval(updateState, 1000);

    // ðŸ”” SUSCRIPCIÃ“N A CAMBIOS
    const unsubscribe = marble.subscribe(() => {
      updateState();
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [marble]);

  if (!marbleState) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* ðŸŽ¯ BOTÃ“N TOGGLE */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm font-medium"
      >
        ðŸŒŒ Marble {marbleState.marble.initialized ? 'âœ…' : 'â³'}
      </button>

      {/* ðŸŒŒ PANEL DE MONITOREO */}
      {isVisible && (
        <div className="absolute top-12 right-0 bg-black/90 backdrop-blur-md border border-purple-500/30 rounded-lg p-4 min-w-[300px] text-white text-xs">
          
          {/* ðŸŽ¯ HEADER */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-purple-400 font-bold">ðŸŒŒ QUANTUM MARBLE</h3>
            <div className="text-green-400">
              {marbleState.marble.initialized ? 'ACTIVO' : 'INICIALIZANDO'}
            </div>
          </div>

          {/* ðŸ§¬ ESTADO CONTEXT7 */}
          <div className="mb-3">
            <div className="text-cyan-400 font-semibold mb-1">Context7 Engine:</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>Coherencia: <span className="text-green-400">{marbleState.context7.coherence}%</span></div>
              <div>Entrelazamientos: <span className="text-blue-400">{marbleState.context7.entanglements}</span></div>
              <div className="col-span-2">
                Modo Secuencial: <span className="text-purple-400">{marbleState.context7.sequentialMode ? 'ACTIVO' : 'INACTIVO'}</span>
              </div>
            </div>
          </div>

          {/* ðŸ”§ PATRONES UNIFICADOS */}
          <div className="mb-3">
            <div className="text-yellow-400 font-semibold mb-1">Patrones Unificados:</div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Router:</span>
                <span className="text-green-400">{marbleState.marble.patterns.router ? 'âœ…' : 'âŒ'}</span>
              </div>
              <div className="flex justify-between">
                <span>Auth:</span>
                <span className="text-green-400">{marbleState.marble.patterns.auth ? 'âœ…' : 'âŒ'}</span>
              </div>
              <div className="flex justify-between">
                <span>Performance:</span>
                <span className="text-green-400">{marbleState.marble.patterns.performance ? 'âœ…' : 'âŒ'}</span>
              </div>
            </div>
          </div>

          {/* ðŸ“Š ESTADO GLOBAL */}
          <div className="mb-3">
            <div className="text-orange-400 font-semibold mb-1">Estado Global:</div>
            <div className="text-xs">
              <div>Observadores: <span className="text-blue-400">{marbleState.marble.observerCount}</span></div>
              <div>Estados: <span className="text-purple-400">{Object.keys(marbleState.marble.globalState).length}</span></div>
            </div>
          </div>

          {/* ðŸŒŸ INDICADOR DE SALUD */}
          <div className="border-t border-purple-500/30 pt-2">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-green-400 text-lg">ðŸŒŒ</div>
                <div className="text-xs text-green-400">MÃRMOL UNIFICADO</div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default QuantumMarbleMonitor;
