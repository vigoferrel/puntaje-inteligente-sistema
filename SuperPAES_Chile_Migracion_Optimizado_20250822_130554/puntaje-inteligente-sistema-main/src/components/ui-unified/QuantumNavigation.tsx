/* eslint-disable react-refresh/only-export-components */
// QuantumNavigation.tsx - Navegacion simple optimizada
// Context7 + Modo Secuencial - Touch-friendly para moviles

import React, { useState } from 'react';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'ðŸ ' },
  { id: 'exercises', label: 'Ejercicios', icon: 'ðŸ“š' },
  { id: 'progress', label: 'Progreso', icon: 'ðŸ“Š' },
  { id: 'profile', label: 'Perfil', icon: 'ðŸ‘¤' }
];

export const QuantumNavigation: React.FC = () => {
  const [activeItem, setActiveItem] = useState('dashboard');

  const handleNavClick = (itemId: string) => {
    setActiveItem(itemId);
    // Context7: Aqui se integrara la navegacion real
    console.log(`Navegando a: ${itemId}`);
  };

  return (
    <nav className="quantum-nav">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`quantum-nav-item ${activeItem === item.id ? 'active' : ''}`}
          onClick={() => handleNavClick(item.id)}
          aria-label={item.label}
        >
          <span className="quantum-nav-icon">{item.icon}</span>
          <span className="quantum-nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default QuantumNavigation;

