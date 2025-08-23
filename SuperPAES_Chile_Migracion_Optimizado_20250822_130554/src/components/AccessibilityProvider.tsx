import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityContextType {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReaderMode: boolean;
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
  toggleReducedMotion: () => void;
  toggleScreenReaderMode: () => void;
  announceToScreenReader: (message: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [screenReaderMode, setScreenReaderMode] = useState(false);

  // Detectar preferencias del sistema
  useEffect(() => {
    const mediaQueryHighContrast = window.matchMedia('(prefers-contrast: high)');
    const mediaQueryReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    setHighContrast(mediaQueryHighContrast.matches);
    setReducedMotion(mediaQueryReducedMotion.matches);

    const handleHighContrastChange = (e: MediaQueryListEvent) => setHighContrast(e.matches);
    const handleReducedMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);

    mediaQueryHighContrast.addEventListener('change', handleHighContrastChange);
    mediaQueryReducedMotion.addEventListener('change', handleReducedMotionChange);

    return () => {
      mediaQueryHighContrast.removeEventListener('change', handleHighContrastChange);
      mediaQueryReducedMotion.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);

  // Aplicar estilos de accesibilidad
  useEffect(() => {
    const root = document.documentElement;
    
    if (highContrast) {
      root.style.setProperty('--high-contrast-mode', 'enabled');
      root.classList.add('high-contrast');
    } else {
      root.style.removeProperty('--high-contrast-mode');
      root.classList.remove('high-contrast');
    }

    if (largeText) {
      root.style.setProperty('--font-size-multiplier', '1.2');
      root.classList.add('large-text');
    } else {
      root.style.removeProperty('--font-size-multiplier');
      root.classList.remove('large-text');
    }

    if (reducedMotion) {
      root.style.setProperty('--reduced-motion', 'enabled');
      root.classList.add('reduced-motion');
    } else {
      root.style.removeProperty('--reduced-motion');
      root.classList.remove('reduced-motion');
    }

    if (screenReaderMode) {
      root.style.setProperty('--screen-reader-mode', 'enabled');
      root.classList.add('screen-reader-mode');
    } else {
      root.style.removeProperty('--screen-reader-mode');
      root.classList.remove('screen-reader-mode');
    }
  }, [highContrast, largeText, reducedMotion, screenReaderMode]);

  const toggleHighContrast = () => setHighContrast(!highContrast);
  const toggleLargeText = () => setLargeText(!largeText);
  const toggleReducedMotion = () => setReducedMotion(!reducedMotion);
  const toggleScreenReaderMode = () => setScreenReaderMode(!screenReaderMode);

  const announceToScreenReader = (message: string) => {
    if (screenReaderMode) {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = message;
      
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  };

  const value: AccessibilityContextType = {
    highContrast,
    largeText,
    reducedMotion,
    screenReaderMode,
    toggleHighContrast,
    toggleLargeText,
    toggleReducedMotion,
    toggleScreenReaderMode,
    announceToScreenReader,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Componente de controles de accesibilidad
export const AccessibilityControls: React.FC = () => {
  const {
    highContrast,
    largeText,
    reducedMotion,
    screenReaderMode,
    toggleHighContrast,
    toggleLargeText,
    toggleReducedMotion,
    toggleScreenReaderMode,
  } = useAccessibility();

  return (
    <div className="accessibility-controls" role="region" aria-label="Controles de accesibilidad">
      <h3 className="text-lg font-semibold mb-4">Accesibilidad</h3>
      
      <div className="space-y-3">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={highContrast}
            onChange={toggleHighContrast}
            className="form-checkbox h-5 w-5 text-blue-600"
            aria-describedby="high-contrast-description"
          />
          <span className="text-base font-medium">Alto contraste</span>
          <span id="high-contrast-description" className="sr-only">
            Activa colores de alto contraste para mejor visibilidad
          </span>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={largeText}
            onChange={toggleLargeText}
            className="form-checkbox h-5 w-5 text-blue-600"
            aria-describedby="large-text-description"
          />
          <span className="text-base font-medium">Texto grande</span>
          <span id="large-text-description" className="sr-only">
            Aumenta el tamaño del texto para mejor legibilidad
          </span>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={reducedMotion}
            onChange={toggleReducedMotion}
            className="form-checkbox h-5 w-5 text-blue-600"
            aria-describedby="reduced-motion-description"
          />
          <span className="text-base font-medium">Reducir movimiento</span>
          <span id="reduced-motion-description" className="sr-only">
            Reduce las animaciones para usuarios sensibles al movimiento
          </span>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={screenReaderMode}
            onChange={toggleScreenReaderMode}
            className="form-checkbox h-5 w-5 text-blue-600"
            aria-describedby="screen-reader-description"
          />
          <span className="text-base font-medium">Modo lector de pantalla</span>
          <span id="screen-reader-description" className="sr-only">
            Optimiza la experiencia para lectores de pantalla
          </span>
        </label>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Atajos de teclado</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li><kbd className="px-2 py-1 bg-white border rounded">Tab</kbd> - Navegar por elementos</li>
          <li><kbd className="px-2 py-1 bg-white border rounded">Enter</kbd> - Activar elementos</li>
          <li><kbd className="px-2 py-1 bg-white border rounded">Escape</kbd> - Cerrar modales</li>
          <li><kbd className="px-2 py-1 bg-white border rounded">H</kbd> - Ir al inicio</li>
          <li><kbd className="px-2 py-1 bg-white border rounded">M</kbd> - Ir a metas PAES</li>
        </ul>
      </div>
    </div>
  );
};

// Hook para anuncios de progreso educativo
export const useEducationalAnnouncements = () => {
  const { announceToScreenReader } = useAccessibility();

  const announceProgress = (subject: string, progress: number) => {
    announceToScreenReader(`Progreso en ${subject}: ${progress}% completado`);
  };

  const announceAchievement = (achievement: string) => {
    announceToScreenReader(`¡Logro desbloqueado: ${achievement}!`);
  };

  const announceExerciseResult = (correct: boolean, subject: string) => {
    const result = correct ? 'correcta' : 'incorrecta';
    announceToScreenReader(`Respuesta ${result} en ${subject}`);
  };

  const announceGoalUpdate = (subject: string, newScore: number, targetScore: number) => {
    announceToScreenReader(`Meta actualizada en ${subject}: ${newScore} de ${targetScore} puntos`);
  };

  return {
    announceProgress,
    announceAchievement,
    announceExerciseResult,
    announceGoalUpdate,
  };
};
