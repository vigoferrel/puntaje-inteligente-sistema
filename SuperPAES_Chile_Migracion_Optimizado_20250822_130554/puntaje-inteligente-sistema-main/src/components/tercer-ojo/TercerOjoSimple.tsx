/* eslint-disable react-refresh/only-export-components */
/**
 * RECONSTRUCCION ARQUITECTONICA: TercerOjo Simplificado
 * Context7 + Modo Secuencial - Sin bucles infinitos
 * Enfoque: Funcionalidad core estable
 */

import React, { useState, useCallback } from 'react';
import { useContext7Simple } from '../../hooks/useContext7Simple';

export const TercerOjoSimple: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { context7State, updateContext7 } = useContext7Simple();
  
  const toggleExpanded = useCallback(() => {
    setIsExpanded(!isExpanded);
    updateContext7('tercer_ojo_expanded', !isExpanded);
  }, [isExpanded, updateContext7]);
  
  const eyeStyles = {
    position: 'fixed' as const,
    top: '20px',
    right: '20px',
    zIndex: 1000,
    width: '60px',
    height: '60px',
    backgroundColor: '#000',
    border: '2px solid #00ffff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#00ffff',
    cursor: 'pointer',
    fontSize: '24px',
    transition: 'all 0.3s ease'
  };
  
  const panelStyles = {
    position: 'absolute' as const,
    top: '70px',
    right: '0',
    width: '250px',
    backgroundColor: '#000',
    border: '2px solid #00ffff',
    borderRadius: '10px',
    padding: '15px',
    color: '#00ffff',
    fontSize: '12px'
  };
  
  return (
    <div>
      <div style={eyeStyles} onClick={toggleExpanded}>
        ðŸ‘ï¸
      </div>
      
      {isExpanded && (
        <div style={panelStyles}>
          <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
            ðŸŒŒ Context7 Dashboard
          </div>
          <div>Modo: {context7State.mode}</div>
          <div>Capa: {context7State.layer}/7</div>
          <div>Coherencia: {context7State.coherence}%</div>
          <div>Estado: {context7State.status}</div>
          <div style={{ marginTop: '10px', fontSize: '10px' }}>
            Pensamiento: Secuencial
          </div>
        </div>
      )}
    </div>
  );
};

export default TercerOjoSimple;

