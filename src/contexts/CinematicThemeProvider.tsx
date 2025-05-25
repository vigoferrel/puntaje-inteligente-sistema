
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

  // Aplicar tema cinematográfico al documento
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (uiState.cinematicMode) {
      // Modo cinematográfico: tema oscuro futurista
      root.classList.add('dark', 'cinematic-mode');
      body.classList.add('cinematic-body');
      
      // CSS Variables para el tema cinematográfico
      root.style.setProperty('--cinematic-bg-primary', 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)');
      root.style.setProperty('--cinematic-bg-secondary', 'rgba(15, 23, 42, 0.8)');
      root.style.setProperty('--cinematic-border', 'rgba(34, 211, 238, 0.3)');
      root.style.setProperty('--cinematic-glow', '0 0 20px rgba(34, 211, 238, 0.3)');
      root.style.setProperty('--cinematic-text-primary', '#ffffff');
      root.style.setProperty('--cinematic-text-secondary', '#94a3b8');
      root.style.setProperty('--cinematic-accent', '#22d3ee');
      
      // Efectos de partículas en CSS
      const style = document.createElement('style');
      style.textContent = `
        .cinematic-body {
          background: var(--cinematic-bg-primary);
          color: var(--cinematic-text-primary);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .cinematic-body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 80%, rgba(34, 211, 238, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.05) 0%, transparent 50%);
          pointer-events: none;
          z-index: -1;
        }
        
        .cinematic-card {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid var(--cinematic-border);
          box-shadow: var(--cinematic-glow);
          transition: all 0.3s ease;
        }
        
        .cinematic-card:hover {
          border-color: var(--cinematic-accent);
          box-shadow: 0 0 30px rgba(34, 211, 238, 0.4);
          transform: translateY(-2px);
        }
        
        .cinematic-button {
          background: linear-gradient(135deg, rgba(34, 211, 238, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%);
          border: 1px solid var(--cinematic-border);
          color: var(--cinematic-text-primary);
          transition: all 0.3s ease;
        }
        
        .cinematic-button:hover {
          background: linear-gradient(135deg, rgba(34, 211, 238, 0.3) 0%, rgba(147, 51, 234, 0.3) 100%);
          box-shadow: 0 0 20px rgba(34, 211, 238, 0.3);
        }
        
        .cinematic-sidebar {
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(16px);
          border-right: 1px solid var(--cinematic-border);
        }
        
        .cinematic-nav-item {
          transition: all 0.3s ease;
        }
        
        .cinematic-nav-item:hover {
          background: rgba(34, 211, 238, 0.1);
          box-shadow: inset 3px 0 0 var(--cinematic-accent);
        }
        
        .cinematic-hologram {
          position: relative;
          overflow: hidden;
        }
        
        .cinematic-hologram::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent,
            rgba(34, 211, 238, 0.1),
            transparent
          );
          animation: hologram-scan 3s linear infinite;
        }
        
        @keyframes hologram-scan {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        
        .cinematic-glow-text {
          text-shadow: 0 0 10px var(--cinematic-accent);
          animation: glow-pulse 2s ease-in-out infinite alternate;
        }
        
        @keyframes glow-pulse {
          from { text-shadow: 0 0 10px var(--cinematic-accent); }
          to { text-shadow: 0 0 20px var(--cinematic-accent), 0 0 30px var(--cinematic-accent); }
        }
        
        .cinematic-particle-bg {
          position: relative;
          overflow: hidden;
        }
        
        .cinematic-particle-bg::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(2px 2px at 20px 30px, var(--cinematic-accent), transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(147, 51, 234, 0.8), transparent),
            radial-gradient(1px 1px at 90px 40px, rgba(59, 130, 246, 0.6), transparent);
          background-repeat: repeat;
          background-size: 100px 100px;
          animation: particle-float 20s linear infinite;
          opacity: 0.3;
          pointer-events: none;
        }
        
        @keyframes particle-float {
          0% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-10px) translateX(10px); }
          66% { transform: translateY(-20px) translateX(-10px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
      `;
      document.head.appendChild(style);
      
    } else if (uiState.isDarkMode) {
      // Modo oscuro estándar
      root.classList.add('dark');
      root.classList.remove('cinematic-mode');
      body.classList.remove('cinematic-body');
    } else {
      // Modo claro
      root.classList.remove('dark', 'cinematic-mode');
      body.classList.remove('cinematic-body');
    }
  }, [uiState.isDarkMode, uiState.cinematicMode]);

  // Función para aplicar tema a elementos específicos
  const applyThemeToElement = (element: HTMLElement) => {
    if (uiState.cinematicMode) {
      element.classList.add('cinematic-card');
    }
  };

  const contextValue: CinematicThemeContextType = {
    isDarkMode: uiState.isDarkMode,
    cinematicMode: uiState.cinematicMode,
    toggleDarkMode: actions.toggleDarkMode,
    enableCinematicMode: actions.enableCinematicMode,
    applyThemeToElement,
  };

  return (
    <CinematicThemeContext.Provider value={contextValue}>
      {children}
    </CinematicThemeContext.Provider>
  );
};
