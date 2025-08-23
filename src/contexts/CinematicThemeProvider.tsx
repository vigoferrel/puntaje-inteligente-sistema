
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

  // Aplicar tema cinematográfico premium
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Siempre aplicar modo cinematográfico premium
    root.classList.add('dark', 'cinematic-mode', 'premium-mode');
    body.classList.add('cinematic-body', 'premium-body');
    
    // CSS Variables premium para el tema cinematográfico
    root.style.setProperty('--cinematic-bg-primary', 'linear-gradient(135deg, #0f0f23 0%, #1a0b2e 30%, #16213e 70%, #0f172a 100%)');
    root.style.setProperty('--cinematic-bg-secondary', 'rgba(139, 92, 246, 0.1)');
    root.style.setProperty('--cinematic-bg-card', 'rgba(139, 92, 246, 0.08)');
    root.style.setProperty('--cinematic-border', 'rgba(139, 92, 246, 0.3)');
    root.style.setProperty('--cinematic-border-hover', 'rgba(16, 185, 129, 0.6)');
    root.style.setProperty('--cinematic-glow', '0 0 30px rgba(139, 92, 246, 0.4)');
    root.style.setProperty('--cinematic-glow-strong', '0 0 50px rgba(139, 92, 246, 0.6), 0 0 80px rgba(16, 185, 129, 0.3)');
    root.style.setProperty('--cinematic-text-primary', '#ffffff');
    root.style.setProperty('--cinematic-text-secondary', '#a78bfa');
    root.style.setProperty('--cinematic-accent', '#8b5cf6');
    root.style.setProperty('--cinematic-accent-emerald', '#10b981');
    root.style.setProperty('--cinematic-accent-coral', '#f59e0b');
    
    // Efectos cinematográficos premium mejorados
    const style = document.createElement('style');
    style.textContent = `
      .premium-body {
        background: linear-gradient(135deg, #0f0f23 0%, #1a0b2e 20%, #16213e 60%, #0f172a 100%);
        color: var(--cinematic-text-primary);
        font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        min-height: 100vh;
      }
      
      .premium-body::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: 
          radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.12) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(245, 158, 11, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 60% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
        pointer-events: none;
        z-index: -1;
        animation: premium-ambient-glow 12s ease-in-out infinite alternate;
      }
      
      @keyframes premium-ambient-glow {
        0% { 
          opacity: 0.8; 
          transform: scale(1) rotate(0deg);
        }
        33% {
          opacity: 1;
          transform: scale(1.05) rotate(1deg);
        }
        66% {
          opacity: 0.9;
          transform: scale(0.98) rotate(-0.5deg);
        }
        100% { 
          opacity: 1; 
          transform: scale(1.02) rotate(0.5deg);
        }
      }
      
      .premium-card {
        background: linear-gradient(135deg, 
          rgba(139, 92, 246, 0.15) 0%, 
          rgba(0, 0, 0, 0.6) 30%, 
          rgba(16, 185, 129, 0.1) 100%);
        backdrop-filter: blur(24px) saturate(180%);
        -webkit-backdrop-filter: blur(24px) saturate(180%);
        border: 1px solid rgba(139, 92, 246, 0.3);
        box-shadow: 
          0 12px 40px rgba(0, 0, 0, 0.4),
          0 0 0 1px rgba(139, 92, 246, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.15);
        border-radius: 20px;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      }
      
      .premium-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, 
          transparent, 
          rgba(139, 92, 246, 0.8), 
          rgba(16, 185, 129, 0.6), 
          transparent);
        animation: premium-card-shimmer 4s ease-in-out infinite;
      }
      
      @keyframes premium-card-shimmer {
        0% { left: -100%; }
        50% { left: 100%; }
        100% { left: 100%; }
      }
      
      .premium-card:hover {
        border-color: rgba(16, 185, 129, 0.6);
        box-shadow: 
          0 20px 60px rgba(0, 0, 0, 0.5),
          0 0 60px rgba(139, 92, 246, 0.4),
          0 0 100px rgba(16, 185, 129, 0.2);
        transform: translateY(-8px) rotateX(2deg) rotateY(2deg) scale(1.02);
      }
      
      .premium-button {
        background: linear-gradient(135deg, 
          rgba(139, 92, 246, 0.9) 0%, 
          rgba(16, 185, 129, 0.8) 50%, 
          rgba(245, 158, 11, 0.9) 100%);
        border: 1px solid rgba(139, 92, 246, 0.4);
        color: white;
        border-radius: 16px;
        padding: 16px 32px;
        font-weight: 600;
        font-size: 16px;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }
      
      .premium-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, 
          rgba(16, 185, 129, 0.3) 0%, 
          rgba(245, 158, 11, 0.3) 100%);
        opacity: 0;
        transition: opacity 0.4s ease;
      }
      
      .premium-button:hover::before {
        opacity: 1;
      }
      
      .premium-button:hover {
        background: linear-gradient(135deg, 
          rgba(16, 185, 129, 0.9) 0%, 
          rgba(245, 158, 11, 0.8) 50%, 
          rgba(139, 92, 246, 0.9) 100%);
        box-shadow: 
          0 8px 30px rgba(0, 0, 0, 0.3),
          0 0 40px rgba(245, 158, 11, 0.5);
        transform: translateY(-4px) scale(1.05);
      }
      
      .premium-button:active {
        transform: translateY(-2px) scale(1.02);
      }
      
      .premium-header {
        background: linear-gradient(135deg, 
          rgba(139, 92, 246, 0.25) 0%, 
          rgba(0, 0, 0, 0.9) 40%, 
          rgba(16, 185, 129, 0.2) 100%);
        backdrop-filter: blur(32px) saturate(180%);
        -webkit-backdrop-filter: blur(32px) saturate(180%);
        border-bottom: 1px solid rgba(139, 92, 246, 0.4);
        box-shadow: 
          0 8px 40px rgba(0, 0, 0, 0.4),
          0 0 0 1px rgba(139, 92, 246, 0.1);
      }
      
      .premium-glass {
        background: linear-gradient(135deg,
          rgba(255, 255, 255, 0.08) 0%,
          rgba(139, 92, 246, 0.1) 50%,
          rgba(16, 185, 129, 0.05) 100%);
        backdrop-filter: blur(20px) saturate(150%);
        -webkit-backdrop-filter: blur(20px) saturate(150%);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 20px;
        box-shadow: 
          0 8px 32px rgba(0, 0, 0, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
      }
      
      .premium-text-glow {
        background: linear-gradient(135deg, 
          #a78bfa 0%, 
          #34d399 50%, 
          #fbbf24 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
        animation: premium-text-glow-pulse 4s ease-in-out infinite alternate;
      }
      
      @keyframes premium-text-glow-pulse {
        from { 
          filter: brightness(1);
          text-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
        }
        to { 
          filter: brightness(1.2);
          text-shadow: 
            0 0 40px rgba(139, 92, 246, 0.8), 
            0 0 60px rgba(16, 185, 129, 0.4);
        }
      }
      
      .premium-gradient-text {
        background: linear-gradient(135deg, 
          #a78bfa 0%, 
          #ffffff 25%, 
          #34d399 50%, 
          #fbbf24 75%, 
          #a78bfa 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        background-size: 200% 200%;
        animation: premium-gradient-shift 6s ease-in-out infinite;
      }
      
      @keyframes premium-gradient-shift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      
      .premium-floating {
        animation: premium-floating 8s ease-in-out infinite;
      }
      
      @keyframes premium-floating {
        0%, 100% { transform: translateY(0px) rotateZ(0deg); }
        25% { transform: translateY(-12px) rotateZ(1deg); }
        50% { transform: translateY(-8px) rotateZ(0deg); }
        75% { transform: translateY(-15px) rotateZ(-1deg); }
      }
      
      .premium-particle {
        position: absolute;
        width: 3px;
        height: 3px;
        background: linear-gradient(45deg, #8b5cf6, #10b981);
        border-radius: 50%;
        animation: premium-particle-drift 20s linear infinite;
        box-shadow: 0 0 10px rgba(139, 92, 246, 0.8);
      }
      
      @keyframes premium-particle-drift {
        0% { 
          transform: translateY(100vh) translateX(0) scale(0); 
          opacity: 0; 
        }
        10% { 
          opacity: 1; 
          transform: translateY(90vh) translateX(20px) scale(1);
        }
        90% { 
          opacity: 1; 
          transform: translateY(10vh) translateX(80px) scale(1);
        }
        100% { 
          transform: translateY(-10vh) translateX(100px) scale(0); 
          opacity: 0; 
        }
      }
      
      .premium-scanner {
        position: relative;
        overflow: hidden;
      }
      
      .premium-scanner::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, 
          transparent, 
          rgba(139, 92, 246, 0.3), 
          rgba(16, 185, 129, 0.2), 
          transparent);
        animation: premium-scanner 6s ease-in-out infinite;
      }
      
      @keyframes premium-scanner {
        0% { left: -100%; }
        50% { left: 100%; }
        100% { left: 100%; }
      }

      .premium-input {
        background: linear-gradient(135deg, 
          rgba(139, 92, 246, 0.1) 0%, 
          rgba(0, 0, 0, 0.6) 100%);
        border: 1px solid rgba(139, 92, 246, 0.3);
        color: white;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(10px);
      }

      .premium-input:focus {
        border-color: rgba(16, 185, 129, 0.6);
        box-shadow: 
          0 0 30px rgba(16, 185, 129, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
        background: linear-gradient(135deg, 
          rgba(16, 185, 129, 0.15) 0%, 
          rgba(0, 0, 0, 0.7) 100%);
      }

      .premium-nav-item {
        background: linear-gradient(135deg, 
          rgba(139, 92, 246, 0.1) 0%, 
          rgba(0, 0, 0, 0.3) 100%);
        border: 1px solid rgba(139, 92, 246, 0.2);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      }

      .premium-nav-item::before {
        content: '';
        position: absolute;
        left: -100%;
        top: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, 
          transparent, 
          rgba(16, 185, 129, 0.2), 
          transparent);
        transition: left 0.5s ease;
      }

      .premium-nav-item:hover::before {
        left: 100%;
      }

      .premium-nav-item:hover {
        background: linear-gradient(135deg, 
          rgba(139, 92, 246, 0.2) 0%, 
          rgba(16, 185, 129, 0.15) 100%);
        transform: translateX(8px) scale(1.02);
        box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
        border-color: rgba(16, 185, 129, 0.4);
      }

      .premium-nav-item.active {
        background: linear-gradient(135deg, 
          rgba(139, 92, 246, 0.4) 0%, 
          rgba(16, 185, 129, 0.3) 100%);
        border-color: rgba(16, 185, 129, 0.6);
        box-shadow: 
          0 0 40px rgba(16, 185, 129, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.2);
      }
    `;
    document.head.appendChild(style);
  }, []);

  // Función para aplicar tema premium a elementos específicos
  const applyThemeToElement = (element: HTMLElement) => {
    element.classList.add('premium-card');
  };

  const contextValue: CinematicThemeContextType = {
    isDarkMode: true,
    cinematicMode: true,
    toggleDarkMode: () => {},
    enableCinematicMode: () => {},
    applyThemeToElement,
  };

  return (
    <CinematicThemeContext.Provider value={contextValue}>
      {children}
    </CinematicThemeContext.Provider>
  );
};
