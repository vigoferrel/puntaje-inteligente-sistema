import React from 'react';

interface ProgressOverlayProps {
  progress: number; // porcentaje de progreso 0-100
  achievementText?: string;
}

const ProgressOverlay: React.FC<ProgressOverlayProps> = ({ progress, achievementText }) => {
  return (
    <div style={{
      position: 'absolute',
      top: 20,
      right: 20,
      backgroundColor: 'rgba(0,0,0,0.6)',
      color: 'white',
      padding: '10px 15px',
      borderRadius: 8,
      fontSize: 14,
      maxWidth: 250,
      zIndex: 1000,
    }}>
      <div>Progreso: {progress}%</div>
      {achievementText && <div>Logro: {achievementText}</div>}
    </div>
  );
};

export default ProgressOverlay;