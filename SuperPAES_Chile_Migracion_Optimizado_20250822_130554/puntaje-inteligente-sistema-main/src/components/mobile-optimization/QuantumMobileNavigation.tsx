/* eslint-disable react-refresh/only-export-components */
// QuantumMobileNavigation.tsx - Navegacion optimizada movil
// Context7 + Modo Secuencial - Bottom navigation para gama media

import React, { useState, useEffect } from 'react';

interface MobileNavItem {
  id: string;
  label: string;
  icon: string;
  badge?: number;
  active?: boolean;
}

export const QuantumMobileNavigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navItems: MobileNavItem[] = [
    { id: 'home', label: 'Inicio', icon: 'ðŸ ' },
    { id: 'study', label: 'Estudiar', icon: 'ðŸ“š', badge: 3 },
    { id: 'progress', label: 'Progreso', icon: 'ðŸ“Š' },
    { id: 'profile', label: 'Perfil', icon: 'ðŸ‘¤' }
  ];

  // Context7: Auto-hide navigation en scroll para mas espacio
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
ECHO est  desactivado.
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // Hide on scroll down
      } else {
        setIsVisible(true); // Show on scroll up
      }
ECHO est  desactivado.
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    // Context7: Aqui se integrara la navegacion real
    console.log(`Navegando a: ${tabId}`);
ECHO est  desactivado.
    // Haptic feedback para dispositivos compatibles
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  return (
    <nav 
      className={`quantum-mobile-nav ${isVisible ? 'visible' : 'hidden'}`}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: 'var(--quantum-bg-header)',
        borderTop: '1px solid var(--quantum-border-primary)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 1000,
        transform: isVisible ? 'translateY(0)' : 'translateY(100)',
        transition: 'transform 0.3s ease',
        backdropFilter: 'blur(10px)'
      }}
    >
      {navItems.map(item => (
        <button
          key={item.id}
          className={`quantum-mobile-nav-item ${activeTab === item.id ? 'active' : ''}`}
          onClick={() => handleTabClick(item.id)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            minWidth: '60px',
            minHeight: '44px',
            border: 'none',
            background: 'transparent',
            color: activeTab === item.id ? 'var(--quantum-accent-primary)' : 'var(--quantum-text-secondary)',
            fontSize: '12px',
            cursor: 'pointer',
            position: 'relative',
            transition: 'color 0.2s ease'
          }}
        >
          <span style={{ fontSize: '20px', marginBottom: '2px' }}>
            {item.icon}
          </span>
          <span style={{ fontSize: '10px' }}>{item.label}</span>
ECHO est  desactivado.
          {item.badge && (
            <span
              style={{
                position: 'absolute',
                top: '4px',
                right: '8px',
                backgroundColor: '#ef4444',
                color: 'white',
                borderRadius: '10px',
                padding: '2px 6px',
                fontSize: '10px',
                minWidth: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {item.badge}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
};

export default QuantumMobileNavigation;

