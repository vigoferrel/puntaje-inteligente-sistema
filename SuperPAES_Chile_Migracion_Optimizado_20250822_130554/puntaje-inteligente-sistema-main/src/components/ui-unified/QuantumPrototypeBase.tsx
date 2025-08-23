/* eslint-disable react-refresh/only-export-components */
// QuantumPrototypeBase.tsx - Componente base unificado
// Context7 + Modo Secuencial - Prototipo visual simple
// Optimizado para moviles gama media

import React, { useState, useEffect } from 'react';
import './QuantumPrototype.css';
import '../../styles/quantum-design/quantum-colors.css';
import '../../styles/quantum-design/quantum-mobile.css';

interface QuantumPrototypeProps {
  children: React.ReactNode;
  title?: string;
  showNavigation?: boolean;
}

export const QuantumPrototypeBase: React.FC<QuantumPrototypeProps> = ({
  children,
  title = 'SuperPAES Quantum',
  showNavigation = true
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [context7Active, setContext7Active] = useState(false);

  // Context7 + Modo Secuencial: Inicializacion simple
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setContext7Active(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="quantum-loading">
        <div className="quantum-loading-spinner"></div>
        <p>Inicializando Context7...</p>
      </div>
    );
  }

  return (
    <div className="quantum-prototype-container">
      {showNavigation && <QuantumNavigation />}
      <main className="quantum-main-content">
        <header className="quantum-header">
          <h1 className="quantum-title">{title}</h1>
          <div className="quantum-status">
            <span className={`quantum-indicator ${context7Active ? 'active' : 'inactive'}`}>
              Context7: {context7Active ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </header>
        <div className="quantum-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default QuantumPrototypeBase;

