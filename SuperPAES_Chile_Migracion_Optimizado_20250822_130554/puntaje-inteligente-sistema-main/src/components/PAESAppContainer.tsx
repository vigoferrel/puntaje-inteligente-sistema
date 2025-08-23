import React, { useState } from 'react';
import PAES3DExperience from './3d/PAES3DExperience';
import PaesOptimizationMobile from './paes/PaesOptimizationMobile';

type View = '3d' | 'optimization';

const PAESAppContainer: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('3d');

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <nav style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}>
        <button onClick={() => setCurrentView('3d')} disabled={currentView === '3d'}>
          Experiencia 3D
        </button>
        <button onClick={() => setCurrentView('optimization')} disabled={currentView === 'optimization'}>
          Optimización Móvil
        </button>
      </nav>
      <div style={{ width: '100%', height: '100%' }}>
        {currentView === '3d' && <PAES3DExperience />}
        {currentView === 'optimization' && <PaesOptimizationMobile />}
      </div>
    </div>
  );
};

export default PAESAppContainer;