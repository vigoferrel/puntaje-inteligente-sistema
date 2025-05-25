
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useGlobalStore, useUIState, useActions } from '@/store/globalStore';

interface CinematicThemeContextType {
  isDarkMode: boolean;
  cinematicMode: boolean;
  toggleDarkMode: () => void;
  enableCinematicMode: () => void;
  applyThemeToElement: (element: HTMLElement) => void;
}

const CinematicThemeContext = createContext<CinematicThemeContextType | undefined>(undefined);

export const useCinematicTheme = () => {
  const context = useContext(CinematicThemeContext);
  if (!context) {
    throw new Error('useCinematicTheme must be used within CinematicThemeProvider');
  }
  return context;
};

export const CinematicThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const uiState = useUIState();
  const actions = useActions();

  // Aplicar tema cinematográfico oscuro por defecto
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Siempre aplicar modo cinematográfico oscuro
    root.classList.add('dark', 'cinematic-mode');
    body.classList.add('cinematic-body');
    
    // CSS Variables mejoradas para el tema cinematográfico
    root.style.setProperty('--cinematic-bg-primary', 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)');
    root.style.setProperty('--cinematic-bg-secondary', 'rgba(15, 23, 42, 0.95)');
    root.style.setProperty('--cinematic-bg-card', 'rgba(15, 23, 42, 0.8)');
    root.style.setProperty('--cinematic-border', 'rgba(34, 211, 238, 0.3)');
    root.style.setProperty('--cinematic-border-hover', 'rgba(34, 211, 238, 0.6)');
    root.style.setProperty('--cinematic-glow', '0 0 20px rgba(34, 211, 238, 0.3)');
    root.style.setProperty('--cinematic-glow-strong', '0 0 30px rgba(34, 211, 238, 0.5)');
    root.style.setProperty('--cinematic-text-primary', '#ffffff');
    root.style.setProperty('--cinematic-text-secondary', '#94a3b8');
    root.style.setProperty('--cinematic-accent', '#22d3ee');
    root.style.setProperty('--cinematic-accent-purple', '#8b5cf6');
    root.style.setProperty('--cinematic-accent-pink', '#f472b6');
    
    // Efectos cinematográficos mejorados
    const style = document.createElement('style');
    style.textContent = `
      .cinematic-body {
        background: var(--cinematic-bg-primary);
        color: var(--cinematic-text-primary);
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        transition: all 0.3s ease;
      }
      
      .cinematic-body::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: 
          radial-gradient(circle at 20% 80%, rgba(34, 211, 238, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(244, 114, 182, 0.08) 0%, transparent 50%);
        pointer-events: none;
        z-index: -1;
        animation: ambient-glow 8s ease-in-out infinite alternate;
      }
      
      @keyframes ambient-glow {
        0% { opacity: 0.8; }
        100% { opacity: 1; }
      }
      
      .cinematic-card {
        background: var(--cinematic-bg-card);
        backdrop-filter: blur(16px);
        border: 1px solid var(--cinematic-border);
        box-shadow: var(--cinematic-glow);
        border-radius: 16px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      }
      
      .cinematic-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 1px;
        background: linear-gradient(90deg, transparent, var(--cinematic-accent), transparent);
        animation: card-shimmer 3s ease-in-out infinite;
      }
      
      @keyframes card-shimmer {
        0% { left: -100%; }
        50% { left: 100%; }
        100% { left: 100%; }
      }
      
      .cinematic-card:hover {
        border-color: var(--cinematic-border-hover);
        box-shadow: var(--cinematic-glow-strong);
        transform: translateY(-2px) scale(1.01);
      }
      
      .cinematic-button {
        background: linear-gradient(135deg, rgba(34, 211, 238, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
        border: 1px solid var(--cinematic-border);
        color: var(--cinematic-text-primary);
        border-radius: 12px;
        padding: 12px 24px;
        font-weight: 500;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      }
      
      .cinematic-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(34, 211, 238, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .cinematic-button:hover::before {
        opacity: 1;
      }
      
      .cinematic-button:hover {
        background: linear-gradient(135deg, rgba(34, 211, 238, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%);
        box-shadow: 0 0 25px rgba(34, 211, 238, 0.4);
        transform: translateY(-1px);
      }
      
      .cinematic-header {
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(20px);
        border-bottom: 1px solid var(--cinematic-border);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
      }
      
      .cinematic-glass {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
      }
      
      .cinematic-text-glow {
        text-shadow: 0 0 10px var(--cinematic-accent);
        animation: text-glow-pulse 3s ease-in-out infinite alternate;
      }
      
      @keyframes text-glow-pulse {
        from { text-shadow: 0 0 10px var(--cinematic-accent); }
        to { text-shadow: 0 0 20px var(--cinematic-accent), 0 0 30px var(--cinematic-accent); }
      }
      
      .cinematic-gradient-text {
        background: linear-gradient(135deg, var(--cinematic-accent) 0%, var(--cinematic-accent-purple) 50%, var(--cinematic-accent-pink) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .cinematic-floating {
        animation: floating 6s ease-in-out infinite;
      }
      
      @keyframes floating {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      
      .cinematic-particle {
        position: absolute;
        width: 2px;
        height: 2px;
        background: var(--cinematic-accent);
        border-radius: 50%;
        animation: particle-drift 15s linear infinite;
      }
      
      @keyframes particle-drift {
        0% { transform: translateY(100vh) translateX(0); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-10vh) translateX(100px); opacity: 0; }
      }
      
      .cinematic-scanner {
        position: relative;
        overflow: hidden;
      }
      
      .cinematic-scanner::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.2), transparent);
        animation: scanner 4s ease-in-out infinite;
      }
      
      @keyframes scanner {
        0% { left: -100%; }
        50% { left: 100%; }
        100% { left: 100%; }
      }
    `;
    document.head.appendChild(style);
  }, []);

  // Función para aplicar tema a elementos específicos
  const applyThemeToElement = (element: HTMLElement) => {
    element.classList.add('cinematic-card');
  };

  const contextValue: CinematicThemeContextType = {
    isDarkMode: true, // Siempre oscuro en modo cinematográfico
    cinematicMode: true, // Siempre cinematográfico
    toggleDarkMode: () => {}, // No-op en modo cinematográfico
    enableCinematicMode: () => {}, // Ya está habilitado
    applyThemeToElement,
  };

  return (
    <CinematicThemeContext.Provider value={contextValue}>
      {children}
    </CinematicThemeContext.Provider>
  );
};
