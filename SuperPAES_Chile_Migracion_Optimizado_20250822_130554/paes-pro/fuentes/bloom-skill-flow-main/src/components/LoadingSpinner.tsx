
import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Cargando...', 
  size = 'medium' 
}) => {
  return (
    <div className="skillnest-loading">
      <div className="skillnest-spinner" />
      <p style={{ 
        fontSize: size === 'small' ? '14px' : size === 'large' ? '18px' : '16px',
        marginTop: '0.5rem',
        color: 'var(--skillnest-gray)'
      }}>
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;
