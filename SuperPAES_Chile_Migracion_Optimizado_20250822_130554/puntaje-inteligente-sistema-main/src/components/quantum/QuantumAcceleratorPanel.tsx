/**
 * QUANTUM ACCELERATOR PANEL - PANEL DE ACELERACIÓN CUÁNTICA
 * Context7 + Modo Secuencial - Interfaz de aceleración avanzada
 * Integración directa con el dashboard cuántico
 */

import React, { useState, useCallback } from 'react';
import { quantumAccelerator } from '../../services/quantum/QuantumAccelerator';

interface AcceleratorStatus {
  cacheActive: boolean;
  hudActive: boolean;
  performanceOptimized: boolean;
  newEntanglements: number;
  finalCoherence: number;
  accelerationLevel: number;
}

const QuantumAcceleratorPanel: React.FC = () => {
  const [isAccelerating, setIsAccelerating] = useState(false);
  const [status, setStatus] = useState<AcceleratorStatus | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = useCallback((message: string) => {
    setLogs(prev => [...prev.slice(-4), `[${new Date().toLocaleTimeString()}] ${message}`]);
  }, []);

  const handleAccelerate = useCallback(async () => {
    if (isAccelerating) return;

    setIsAccelerating(true);
    addLog('🚀 Iniciando aceleración cuántica...');

    try {
      const result = await quantumAccelerator.accelerateFullSystem();
      setStatus(result);
      addLog(`✅ Sistema acelerado ${result.accelerationLevel.toFixed(2)}x`);
      addLog(`🌟 Coherencia: ${result.finalCoherence.toFixed(1)}%`);
      addLog(`🌐 Entrelazamientos: +${result.newEntanglements}`);
    } catch (error) {
      addLog(`❌ Error: ${error}`);
    } finally {
      setIsAccelerating(false);
    }
  }, [isAccelerating, addLog]);

  const handleReset = useCallback(() => {
    quantumAccelerator.reset();
    setStatus(null);
    setLogs([]);
    addLog('🔄 Acelerador reiniciado');
  }, [addLog]);

  return (
    <div className="bg-gradient-to-br from-cyan-900/20 to-purple-900/20 backdrop-blur-md border border-cyan-400/30 rounded-xl p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-cyan-300 flex items-center gap-2">
          ⚡ Acelerador Cuántico
        </h3>
        <div className="text-sm text-cyan-400">
          Context7 + Secuencial
        </div>
      </div>

      {/* Status Display */}
      {status && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/30 rounded-lg p-3">
            <div className="text-xs text-cyan-400 mb-1">Cache Neural</div>
            <div className={`text-sm font-medium ${status.cacheActive ? 'text-green-400' : 'text-red-400'}`}>
              {status.cacheActive ? 'Activo' : 'Inactivo'}
            </div>
          </div>
          
          <div className="bg-black/30 rounded-lg p-3">
            <div className="text-xs text-cyan-400 mb-1">HUD Futurístico</div>
            <div className={`text-sm font-medium ${status.hudActive ? 'text-green-400' : 'text-red-400'}`}>
              {status.hudActive ? 'Activo' : 'Inactivo'}
            </div>
          </div>
          
          <div className="bg-black/30 rounded-lg p-3">
            <div className="text-xs text-cyan-400 mb-1">Aceleración</div>
            <div className="text-sm font-medium text-purple-400">
              {status.accelerationLevel.toFixed(2)}x
            </div>
          </div>
          
          <div className="bg-black/30 rounded-lg p-3">
            <div className="text-xs text-cyan-400 mb-1">Coherencia</div>
            <div className="text-sm font-medium text-green-400">
              {status.finalCoherence.toFixed(1)}%
            </div>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleAccelerate}
          disabled={isAccelerating}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
            isAccelerating
              ? 'bg-yellow-600/50 text-yellow-200 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white shadow-lg hover:shadow-cyan-500/25'
          }`}
        >
          {isAccelerating ? '⚡ Acelerando...' : '🚀 Acelerar Sistema'}
        </button>
        
        <button
          onClick={handleReset}
          disabled={isAccelerating}
          className="py-3 px-4 rounded-lg font-medium bg-gray-600/50 hover:bg-gray-500/50 text-gray-200 transition-all duration-300"
        >
          🔄 Reset
        </button>
      </div>

      {/* Activity Log */}
      <div className="bg-black/40 rounded-lg p-4">
        <div className="text-sm font-medium text-cyan-400 mb-2">Log de Aceleración</div>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-xs text-gray-400">Sin actividad reciente</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="text-xs text-gray-300 font-mono">
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="flex justify-between text-xs text-cyan-400">
        <span>Intervalos Activos: {status?.newEntanglements || 1}</span>
        <span>Re-renders: {status?.performanceOptimized ? 'Optimizados' : 'Normales'}</span>
        <span>Estado: {isAccelerating ? 'Acelerando' : 'Listo'}</span>
      </div>
    </div>
  );
};

export default QuantumAcceleratorPanel;