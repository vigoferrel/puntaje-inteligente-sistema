import React, { useState, useEffect } from 'react';
import Math3DExperience from './math/Math3DExperience';
import Language3DExperience from './language/Language3DExperience';
import Science3DExperience from './science/Science3DExperience';
import ProgressOverlay from './common/ProgressOverlay';
import { useUnifiedAchievements } from '../../core/gamification/UnifiedAchievementEngine';
// import { useScoreCache } from '../../core/scoring/ScoreCache';

type Subject = 'math' | 'language' | 'science';

const PAES3DExperience: React.FC = () => {
  const [subject, setSubject] = useState<Subject>('math');
  const { achievements, userProgress } = useUnifiedAchievements();
  // const { score, updateScore } = useScoreCache();

  useEffect(() => {
    // Ejemplo: actualizar score basado en progreso o logros
    // updateScore(subject, userProgress.completed_nodes);
  }, [subject, userProgress]);

  const renderExperience = () => {
    switch (subject) {
      case 'math':
        return <Math3DExperience />;
      case 'language':
        return <Language3DExperience />;
      case 'science':
        return <Science3DExperience />;
      default:
        return null;
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
        <button onClick={() => setSubject('math')}>Matemáticas</button>
        <button onClick={() => setSubject('language')}>Lenguaje</button>
        <button onClick={() => setSubject('science')}>Ciencias</button>
      </div>
      {renderExperience()}
      <ProgressOverlay progress={userProgress.completed_nodes} achievementText={achievements.find(a => a.is_unlocked)?.title} />
      <div style={{ position: 'absolute', bottom: 10, left: 10, color: 'white', zIndex: 1000 }}>
        Puntaje: {/* Mostrar puntaje cuando se integre el sistema */}
      </div>
    </div>
  );
};

export default PAES3DExperience;