/* eslint-disable react-refresh/only-export-components */
/**
 * ðŸŽ“ QuantumEducationalCycle - Pensamiento CuÃ¡ntico Secuencial
 * Leonardo da Vinci: "Menos es MÃ¡s" - Conecta existentes sin duplicar
 * 
 * Solo 40 lÃ­neas - Conecta Bloom + SmartExercise + Scoring + 3D
 * Efecto multiplicador: Ciclo completo Nodos â†’ Skills â†’ Bloom â†’ Scoring
 */

import React, { Suspense } from 'react';
import { useQuantumContext7 } from '../../hooks/useQuantumContext7';
import { useQuantumOrchestrator } from '../../hooks/useQuantumOrchestrator';

// Lazy loading de componentes existentes para optimizaciÃ³n
const BloomDashboard = React.lazy(() => import('../bloom/BloomDashboard'));
const CentralSpotifyDashboard = React.lazy(() => import('../spotify-neural/CentralSpotifyDashboard'));
const Enhanced3DUniverse = React.lazy(() => 
  import('../real-3d/Enhanced3DUniverse').then(module => ({
    default: module.Enhanced3DUniverse
  }))
);

interface QuantumEducationalCycleProps {
  children?: React.ReactNode;
}

export const QuantumEducationalCycle: React.FC<QuantumEducationalCycleProps> = ({ children }) => {
  const { state } = useQuantumContext7();
  const { activateComponent } = useQuantumOrchestrator();

  // Context7 - Pensamiento secuencial: determinar componente principal
  const getPrimaryComponent = () => {
    if (state.bloom.active && state.bloom.progress > 50) return 'bloom';
    if (state.spotify.active) return 'spotify';
    if (state.enhanced3D.active) return 'enhanced3D';
    return 'bloom'; // Default
  };

  const primaryComponent = getPrimaryComponent();

  // Renderizado condicional basado en Context7
  const renderPrimaryComponent = () => {
    switch (primaryComponent) {
      case 'bloom':
        return (
          <Suspense fallback={<div className="text-white p-8">Cargando Bloom...</div>}>
            <BloomDashboard />
          </Suspense>
        );
      case 'spotify':
        return (
          <Suspense fallback={<div className="text-white p-8">Cargando Spotify Neural...</div>}>
            <CentralSpotifyDashboard 
              onExerciseStart={(track) => {
                activateComponent('smartExercise', { difficulty: 'adaptive' });
              }}
            />
          </Suspense>
        );
      case 'enhanced3D':
        return (
          <Suspense fallback={<div className="text-white p-8">Cargando Universe 3D...</div>}>
            <Enhanced3DUniverse 
              onNodeClick={(nodeId) => {
                activateComponent('bloom', { level: 'apply', progress: 75 });
              }}
            />
          </Suspense>
        );
      default:
        return null;
    }
  };

  return (
    <div className="quantum-educational-cycle h-full">
      {children}
      {renderPrimaryComponent()}
    </div>
  );
};

export default QuantumEducationalCycle;
