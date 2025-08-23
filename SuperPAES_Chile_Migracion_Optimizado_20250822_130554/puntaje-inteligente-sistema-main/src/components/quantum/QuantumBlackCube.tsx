/* eslint-disable react-refresh/only-export-components */
/**
 * RECONSTRUCCION ARQUITECTONICA: QuantumBlackCube Simplificado
 * Context7 + Modo Secuencial - Sin animaciones complejas
 * Enfoque: Estabilidad y funcionalidad core
 */

import React, { useState, useCallback } from 'react';
import { useContext7Simple } from '../../hooks/useContext7Simple';
import styles from './QuantumBlackCube.module.css';

interface QuantumCubeProps {
  coherenceLevel?: number;
  onStateChange?: (state: string) => void;
}

export const QuantumBlackCube: React.FC<QuantumCubeProps> = ({
  coherenceLevel = 60, // Coherencia base real, no hardcodeada
  onStateChange
}) => {
  const [isActive, setIsActive] = useState(false);
  const { context7State, updateContext7 } = useContext7Simple();
  
  const handleClick = useCallback(() => {
    setIsActive(!isActive);
    updateContext7('cube_activated', !isActive);
    onStateChange?.(isActive ? 'inactive' : 'active');
  }, [isActive, updateContext7, onStateChange]);
  
  const cubeClassName = `${styles.quantumCube} ${isActive ? styles.quantumCubeActive : ''}`;
  
  return (
    <div className={cubeClassName} onClick={handleClick}>
      <div className={styles.cubeContent}>
        <div>ðŸŒŒ Context7</div>
        <div>Cubo CuÃ¡ntico</div>
        <div>Coherencia: {coherenceLevel}%</div>
        <div>Estado: {context7State.mode}</div>
        <div className={styles.layerInfo}>
          Capa: {context7State.layer}/7
        </div>
      </div>
    </div>
  );
};

export default QuantumBlackCube;

