import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  customization: {
    borderRadius: number;
    spacing: number;
    blurIntensity: number;
    glassEffect: boolean;
    gradientOverlay: boolean;
  };
  animations: {
    enabled: boolean;
    intensity: number;
  };
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    largeFonts: boolean;
    colorBlindFriendly: boolean;
  };
  isUnlocked: boolean;
  requiredLevel?: number;
  unlockConditions?: {
    totalPoints?: number;
    streakDays?: number;
    achievements?: string[];
  };
}

interface AdaptiveThemeContextType {
  currentTheme: ThemeConfig;
  availableThemes: ThemeConfig[];
  setCurrentTheme: (theme: ThemeConfig) => void;
  customizeTheme: (customizations: Partial<ThemeConfig>) => void;
  resetToDefault: () => void;
  exportTheme: () => string;
  importTheme: (themeData: string) => void;
}

const AdaptiveThemeContext = createContext<AdaptiveThemeContextType | undefined>(undefined);

// Temas predefinidos simplificados
const predefinedThemes: Record<string, ThemeConfig> = {
  default: {
    id: 'default',
    name: 'Clásico',
    description: 'Tema clásico y elegante',
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f8fafc',
      textSecondary: '#94a3b8',
      border: '#334155',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    },
    customization: {
      borderRadius: 8,
      spacing: 16,
      blurIntensity: 10,
      glassEffect: true,
      gradientOverlay: true
    },
    animations: {
      enabled: true,
      intensity: 100
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      largeFonts: false,
      colorBlindFriendly: false
    },
    isUnlocked: true
  },
  dark: {
    id: 'dark',
    name: 'Oscuro',
    description: 'Tema oscuro para estudio nocturno',
    colors: {
      primary: '#6366f1',
      secondary: '#a855f7',
      accent: '#ec4899',
      background: '#000000',
      surface: '#111827',
      text: '#ffffff',
      textSecondary: '#9ca3af',
      border: '#374151',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626'
    },
    customization: {
      borderRadius: 12,
      spacing: 20,
      blurIntensity: 15,
      glassEffect: true,
      gradientOverlay: false
    },
    animations: {
      enabled: true,
      intensity: 80
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      largeFonts: false,
      colorBlindFriendly: false
    },
    isUnlocked: true
  },
  light: {
    id: 'light',
    name: 'Claro',
    description: 'Tema claro para estudio diurno',
    colors: {
      primary: '#2563eb',
      secondary: '#7c3aed',
      accent: '#0891b2',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#0f172a',
      textSecondary: '#475569',
      border: '#e2e8f0',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626'
    },
    customization: {
      borderRadius: 6,
      spacing: 12,
      blurIntensity: 5,
      glassEffect: false,
      gradientOverlay: false
    },
    animations: {
      enabled: true,
      intensity: 60
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      largeFonts: false,
      colorBlindFriendly: false
    },
    isUnlocked: true
  },
  neon: {
    id: 'neon',
    name: 'Neón',
    description: 'Tema futurista con colores neón',
    colors: {
      primary: '#00ff88',
      secondary: '#ff0080',
      accent: '#00ffff',
      background: '#0a0a0a',
      surface: '#1a1a1a',
      text: '#ffffff',
      textSecondary: '#888888',
      border: '#333333',
      success: '#00ff88',
      warning: '#ffff00',
      error: '#ff0080'
    },
    customization: {
      borderRadius: 16,
      spacing: 24,
      blurIntensity: 20,
      glassEffect: true,
      gradientOverlay: true
    },
    animations: {
      enabled: true,
      intensity: 120
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      largeFonts: false,
      colorBlindFriendly: false
    },
    isUnlocked: true,
    requiredLevel: 3
  }
};

interface SimpleAdaptiveThemeProviderProps {
  children: ReactNode;
  userId: string;
}

export const SimpleAdaptiveThemeProvider: React.FC<SimpleAdaptiveThemeProviderProps> = ({ 
  children, 
  userId 
}) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(predefinedThemes.default);
  const [availableThemes, setAvailableThemes] = useState<ThemeConfig[]>(
    Object.values(predefinedThemes).filter(theme => theme.isUnlocked)
  );

  // Cargar tema guardado del usuario
  useEffect(() => {
    const savedTheme = localStorage.getItem(`user-theme-${userId}`);
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        if (parsedTheme && predefinedThemes[parsedTheme.id]) {
          setCurrentTheme(parsedTheme);
        }
      } catch (error) {
        console.warn('Error loading saved theme:', error);
      }
    }
  }, [userId]);

  // Guardar tema cuando cambie
  useEffect(() => {
    localStorage.setItem(`user-theme-${userId}`, JSON.stringify(currentTheme));
  }, [currentTheme, userId]);

  // Aplicar tema al DOM
  useEffect(() => {
    const applyThemeToDOM = (theme: ThemeConfig) => {
      const root = document.documentElement;
      
      // Aplicar variables CSS
      Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });

      // Aplicar customizaciones
      root.style.setProperty('--border-radius', `${theme.customization.borderRadius}px`);
      root.style.setProperty('--spacing', `${theme.customization.spacing}px`);
      root.style.setProperty('--blur-intensity', `${theme.customization.blurIntensity}px`);

      // Aplicar clases de animación
      if (theme.animations.enabled) {
        root.classList.add('animations-enabled');
        root.style.setProperty('--animation-intensity', `${theme.animations.intensity}%`);
      } else {
        root.classList.remove('animations-enabled');
      }

      // Aplicar efectos especiales
      if (theme.customization.glassEffect) {
        root.classList.add('glass-effect');
      } else {
        root.classList.remove('glass-effect');
      }

      if (theme.customization.gradientOverlay) {
        root.classList.add('gradient-overlay');
      } else {
        root.classList.remove('gradient-overlay');
      }
    };

    applyThemeToDOM(currentTheme);
  }, [currentTheme]);

  const customizeTheme = (customizations: Partial<ThemeConfig>) => {
    setCurrentTheme(prev => ({
      ...prev,
      ...customizations,
      colors: {
        ...prev.colors,
        ...customizations.colors
      },
      customization: {
        ...prev.customization,
        ...customizations.customization
      },
      animations: {
        ...prev.animations,
        ...customizations.animations
      },
      accessibility: {
        ...prev.accessibility,
        ...customizations.accessibility
      }
    }));
  };

  const resetToDefault = () => {
    setCurrentTheme(predefinedThemes.default);
  };

  const exportTheme = (): string => {
    return JSON.stringify(currentTheme, null, 2);
  };

  const importTheme = (themeData: string) => {
    try {
      const parsedTheme = JSON.parse(themeData);
      if (parsedTheme && typeof parsedTheme === 'object') {
        setCurrentTheme(parsedTheme);
      }
    } catch (error) {
      console.error('Error importing theme:', error);
    }
  };

  const value: AdaptiveThemeContextType = {
    currentTheme,
    availableThemes,
    setCurrentTheme,
    customizeTheme,
    resetToDefault,
    exportTheme,
    importTheme
  };

  return (
    <AdaptiveThemeContext.Provider value={value}>
      {children}
    </AdaptiveThemeContext.Provider>
  );
};

export const useAdaptiveTheme = (): AdaptiveThemeContextType => {
  const context = useContext(AdaptiveThemeContext);
  if (!context) {
    throw new Error('useAdaptiveTheme must be used within a SimpleAdaptiveThemeProvider');
  }
  return context;
};

// Componente de personalización simplificado
export const SimpleThemeCustomizer: React.FC = () => {
  const { currentTheme, availableThemes, setCurrentTheme, customizeTheme } = useAdaptiveTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 p-3 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 text-white hover:bg-white/20 transition-colors z-40"
      >
        🎨
      </button>

      {/* Modal de personalización */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Personalizar Tema</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Selección de temas */}
            <div className="space-y-3 mb-6">
              <h4 className="font-medium text-white">Temas Disponibles</h4>
              <div className="grid grid-cols-2 gap-2">
                {availableThemes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setCurrentTheme(theme)}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      currentTheme.id === theme.id
                        ? 'border-blue-500 bg-blue-500/20 text-white'
                        : 'border-white/20 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white'
                    }`}
                  >
                    <div className="font-medium text-sm">{theme.name}</div>
                    <div className="text-xs text-white/60">
                      {theme.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Personalización rápida */}
            <div className="space-y-4">
              <h4 className="font-medium text-white">Personalización</h4>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-white/80">Efecto de Cristal</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={currentTheme.customization.glassEffect}
                    onChange={(e) => customizeTheme({
                      customization: { glassEffect: e.target.checked }
                    })}
                    className="mr-2 w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-white/70">Habilitar</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white/80">Animaciones</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={currentTheme.animations.enabled}
                    onChange={(e) => customizeTheme({
                      animations: { enabled: e.target.checked }
                    })}
                    className="mr-2 w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-white/70">Habilitar</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white/80">Radio de Bordes</label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={currentTheme.customization.borderRadius}
                  onChange={(e) => customizeTheme({
                    customization: { borderRadius: parseInt(e.target.value) }
                  })}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="text-xs text-white/60 mt-1">Valor: {currentTheme.customization.borderRadius}px</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
