import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  Moon,
  Sun,
  Monitor,
  Sparkles,
  Eye,
  Trophy,
  Brain,
  Music,
  Zap,
  Settings,
  RefreshCw,
  Save,
  Download,
  Upload,
  Wand2
} from 'lucide-react';

import { useGamification } from '@/hooks/use-gamification';
import { useAIRecommendations } from '@/hooks/use-ai-recommendations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Tipos de temas disponibles
export type ThemeType = 'default' | 'holographic' | 'gaming' | 'minimal' | 'ai-adaptive' | 'high-contrast' | 'music-sync' | 'achievement-based';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
  destructive: string;
  destructiveForeground: string;
  success: string;
  warning: string;
  info: string;
  // Colores específicos del sistema
  gamification: string;
  ai: string;
  analytics: string;
  spotify: string;
  holographic: string;
}

export interface ThemeConfig {
  id: ThemeType;
  name: string;
  description: string;
  colors: ThemeColors;
  requiredLevel?: number;
  unlockConditions?: {
    achievements?: string[];
    totalPoints?: number;
    streakDays?: number;
  };
  isUnlocked: boolean;
  animations: {
    enabled: boolean;
    intensity: number; // 0-100
    particles: boolean;
    transitions: boolean;
  };
  customization: {
    backgroundImage?: string;
    gradientOverlay?: boolean;
    glassEffect?: boolean;
    blurIntensity: number;
    borderRadius: number;
    spacing: number;
  };
  aiAdaptive?: {
    enabled: boolean;
    moodSync: boolean;
    performanceOptimization: boolean;
    contextualColors: boolean;
  };
}

export interface UserThemePreferences {
  selectedTheme: ThemeType;
  customThemes: Record<string, ThemeConfig>;
  preferences: {
    automaticThemeSwitch: boolean;
    timeBasedThemes: {
      enabled: boolean;
      morning: ThemeType;
      afternoon: ThemeType;
      evening: ThemeType;
      night: ThemeType;
    };
    moodBasedThemes: {
      enabled: boolean;
      study: ThemeType;
      gaming: ThemeType;
      relax: ThemeType;
      focus: ThemeType;
    };
    achievementUnlocks: boolean;
    aiRecommendations: boolean;
    adaptiveColors: boolean;
  };
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    largeFonts: boolean;
    colorBlindFriendly: boolean;
  };
}

// Temas predefinidos
const predefinedThemes: Record<ThemeType, ThemeConfig> = {
  default: {
    id: 'default',
    name: 'PAES Clásico',
    description: 'El tema original del sistema PAES',
    isUnlocked: true,
    colors: {
      primary: 'hsl(221, 83%, 53%)',
      secondary: 'hsl(210, 40%, 90%)',
      accent: 'hsl(210, 40%, 90%)',
      background: 'hsl(222, 84%, 5%)',
      foreground: 'hsl(210, 40%, 98%)',
      muted: 'hsl(217, 33%, 17%)',
      mutedForeground: 'hsl(215, 20%, 65%)',
      border: 'hsl(217, 33%, 17%)',
      input: 'hsl(217, 33%, 17%)',
      ring: 'hsl(221, 83%, 53%)',
      destructive: 'hsl(0, 62%, 30%)',
      destructiveForeground: 'hsl(210, 40%, 98%)',
      success: 'hsl(142, 71%, 45%)',
      warning: 'hsl(38, 92%, 50%)',
      info: 'hsl(199, 89%, 48%)',
      gamification: 'hsl(45, 93%, 47%)',
      ai: 'hsl(271, 91%, 65%)',
      analytics: 'hsl(142, 71%, 45%)',
      spotify: 'hsl(141, 76%, 48%)',
      holographic: 'hsl(271, 91%, 65%)'
    },
    animations: {
      enabled: true,
      intensity: 50,
      particles: false,
      transitions: true
    },
    customization: {
      glassEffect: false,
      gradientOverlay: true,
      blurIntensity: 0,
      borderRadius: 8,
      spacing: 16
    }
  },

  holographic: {
    id: 'holographic',
    name: 'Holograma 3D',
    description: 'Interfaz futurista con efectos holográficos',
    requiredLevel: 5,
    isUnlocked: false,
    colors: {
      primary: 'hsl(271, 91%, 65%)',
      secondary: 'hsl(280, 100%, 90%)',
      accent: 'hsl(320, 100%, 70%)',
      background: 'hsl(240, 10%, 3%)',
      foreground: 'hsl(280, 100%, 95%)',
      muted: 'hsl(240, 15%, 15%)',
      mutedForeground: 'hsl(280, 30%, 70%)',
      border: 'hsl(271, 50%, 25%)',
      input: 'hsl(240, 15%, 15%)',
      ring: 'hsl(271, 91%, 65%)',
      destructive: 'hsl(340, 75%, 50%)',
      destructiveForeground: 'hsl(280, 100%, 95%)',
      success: 'hsl(160, 100%, 50%)',
      warning: 'hsl(50, 100%, 50%)',
      info: 'hsl(200, 100%, 50%)',
      gamification: 'hsl(60, 100%, 50%)',
      ai: 'hsl(271, 91%, 65%)',
      analytics: 'hsl(160, 100%, 50%)',
      spotify: 'hsl(140, 100%, 50%)',
      holographic: 'hsl(300, 100%, 70%)'
    },
    animations: {
      enabled: true,
      intensity: 90,
      particles: true,
      transitions: true
    },
    customization: {
      glassEffect: true,
      gradientOverlay: true,
      blurIntensity: 20,
      borderRadius: 16,
      spacing: 20
    },
    aiAdaptive: {
      enabled: true,
      moodSync: true,
      performanceOptimization: false,
      contextualColors: true
    }
  },

  gaming: {
    id: 'gaming',
    name: 'Modo Gaming',
    description: 'Diseñado para la experiencia de gamificación',
    unlockConditions: {
      totalPoints: 1000,
      achievements: ['first_achievement', 'level_up_master']
    },
    isUnlocked: false,
    colors: {
      primary: 'hsl(45, 93%, 47%)',
      secondary: 'hsl(45, 100%, 90%)',
      accent: 'hsl(15, 100%, 60%)',
      background: 'hsl(0, 0%, 8%)',
      foreground: 'hsl(45, 100%, 95%)',
      muted: 'hsl(0, 0%, 20%)',
      mutedForeground: 'hsl(45, 20%, 70%)',
      border: 'hsl(45, 50%, 30%)',
      input: 'hsl(0, 0%, 20%)',
      ring: 'hsl(45, 93%, 47%)',
      destructive: 'hsl(0, 75%, 50%)',
      destructiveForeground: 'hsl(45, 100%, 95%)',
      success: 'hsl(120, 100%, 40%)',
      warning: 'hsl(38, 92%, 50%)',
      info: 'hsl(200, 100%, 50%)',
      gamification: 'hsl(45, 93%, 47%)',
      ai: 'hsl(280, 100%, 70%)',
      analytics: 'hsl(120, 100%, 40%)',
      spotify: 'hsl(140, 100%, 50%)',
      holographic: 'hsl(300, 100%, 70%)'
    },
    animations: {
      enabled: true,
      intensity: 80,
      particles: true,
      transitions: true
    },
    customization: {
      glassEffect: false,
      gradientOverlay: true,
      blurIntensity: 5,
      borderRadius: 12,
      spacing: 18
    }
  },

  'ai-adaptive': {
    id: 'ai-adaptive',
    name: 'IA Adaptativo',
    description: 'Tema que se adapta inteligentemente a tu estado y progreso',
    requiredLevel: 10,
    isUnlocked: false,
    colors: {
      primary: 'hsl(271, 91%, 65%)',
      secondary: 'hsl(240, 30%, 90%)',
      accent: 'hsl(200, 100%, 60%)',
      background: 'hsl(225, 25%, 5%)',
      foreground: 'hsl(240, 30%, 95%)',
      muted: 'hsl(225, 25%, 18%)',
      mutedForeground: 'hsl(240, 15%, 70%)',
      border: 'hsl(225, 25%, 25%)',
      input: 'hsl(225, 25%, 18%)',
      ring: 'hsl(271, 91%, 65%)',
      destructive: 'hsl(0, 75%, 50%)',
      destructiveForeground: 'hsl(240, 30%, 95%)',
      success: 'hsl(142, 71%, 45%)',
      warning: 'hsl(38, 92%, 50%)',
      info: 'hsl(199, 89%, 48%)',
      gamification: 'hsl(45, 93%, 47%)',
      ai: 'hsl(271, 91%, 65%)',
      analytics: 'hsl(142, 71%, 45%)',
      spotify: 'hsl(141, 76%, 48%)',
      holographic: 'hsl(271, 91%, 65%)'
    },
    animations: {
      enabled: true,
      intensity: 70,
      particles: false,
      transitions: true
    },
    customization: {
      glassEffect: true,
      gradientOverlay: true,
      blurIntensity: 10,
      borderRadius: 10,
      spacing: 16
    },
    aiAdaptive: {
      enabled: true,
      moodSync: true,
      performanceOptimization: true,
      contextualColors: true
    }
  },

  'music-sync': {
    id: 'music-sync',
    name: 'Sincronía Musical',
    description: 'Se sincroniza con tu música de Spotify',
    unlockConditions: {
      streakDays: 7
    },
    isUnlocked: false,
    colors: {
      primary: 'hsl(141, 76%, 48%)',
      secondary: 'hsl(141, 50%, 90%)',
      accent: 'hsl(300, 100%, 70%)',
      background: 'hsl(120, 15%, 8%)',
      foreground: 'hsl(141, 50%, 95%)',
      muted: 'hsl(120, 15%, 20%)',
      mutedForeground: 'hsl(141, 20%, 70%)',
      border: 'hsl(141, 30%, 25%)',
      input: 'hsl(120, 15%, 20%)',
      ring: 'hsl(141, 76%, 48%)',
      destructive: 'hsl(0, 75%, 50%)',
      destructiveForeground: 'hsl(141, 50%, 95%)',
      success: 'hsl(141, 76%, 48%)',
      warning: 'hsl(38, 92%, 50%)',
      info: 'hsl(200, 100%, 50%)',
      gamification: 'hsl(45, 93%, 47%)',
      ai: 'hsl(280, 100%, 70%)',
      analytics: 'hsl(160, 100%, 50%)',
      spotify: 'hsl(141, 76%, 48%)',
      holographic: 'hsl(300, 100%, 70%)'
    },
    animations: {
      enabled: true,
      intensity: 60,
      particles: false,
      transitions: true
    },
    customization: {
      glassEffect: false,
      gradientOverlay: true,
      blurIntensity: 5,
      borderRadius: 8,
      spacing: 16
    },
    aiAdaptive: {
      enabled: true,
      moodSync: true,
      performanceOptimization: false,
      contextualColors: false
    }
  },

  minimal: {
    id: 'minimal',
    name: 'Minimalista',
    description: 'Interfaz limpia y enfocada en el rendimiento',
    isUnlocked: true,
    colors: {
      primary: 'hsl(0, 0%, 20%)',
      secondary: 'hsl(0, 0%, 90%)',
      accent: 'hsl(0, 0%, 60%)',
      background: 'hsl(0, 0%, 98%)',
      foreground: 'hsl(0, 0%, 10%)',
      muted: 'hsl(0, 0%, 95%)',
      mutedForeground: 'hsl(0, 0%, 45%)',
      border: 'hsl(0, 0%, 90%)',
      input: 'hsl(0, 0%, 95%)',
      ring: 'hsl(0, 0%, 20%)',
      destructive: 'hsl(0, 75%, 50%)',
      destructiveForeground: 'hsl(0, 0%, 98%)',
      success: 'hsl(120, 50%, 40%)',
      warning: 'hsl(38, 70%, 50%)',
      info: 'hsl(200, 70%, 50%)',
      gamification: 'hsl(45, 70%, 50%)',
      ai: 'hsl(280, 70%, 50%)',
      analytics: 'hsl(120, 50%, 40%)',
      spotify: 'hsl(140, 70%, 50%)',
      holographic: 'hsl(280, 70%, 50%)'
    },
    animations: {
      enabled: false,
      intensity: 10,
      particles: false,
      transitions: false
    },
    customization: {
      glassEffect: false,
      gradientOverlay: false,
      blurIntensity: 0,
      borderRadius: 4,
      spacing: 12
    }
  },

  'high-contrast': {
    id: 'high-contrast',
    name: 'Alto Contraste',
    description: 'Optimizado para accesibilidad',
    isUnlocked: true,
    colors: {
      primary: 'hsl(0, 0%, 100%)',
      secondary: 'hsl(0, 0%, 85%)',
      accent: 'hsl(45, 100%, 50%)',
      background: 'hsl(0, 0%, 0%)',
      foreground: 'hsl(0, 0%, 100%)',
      muted: 'hsl(0, 0%, 20%)',
      mutedForeground: 'hsl(0, 0%, 85%)',
      border: 'hsl(0, 0%, 50%)',
      input: 'hsl(0, 0%, 10%)',
      ring: 'hsl(0, 0%, 100%)',
      destructive: 'hsl(0, 100%, 60%)',
      destructiveForeground: 'hsl(0, 0%, 0%)',
      success: 'hsl(120, 100%, 50%)',
      warning: 'hsl(45, 100%, 50%)',
      info: 'hsl(200, 100%, 60%)',
      gamification: 'hsl(45, 100%, 50%)',
      ai: 'hsl(280, 100%, 70%)',
      analytics: 'hsl(120, 100%, 50%)',
      spotify: 'hsl(140, 100%, 50%)',
      holographic: 'hsl(280, 100%, 70%)'
    },
    animations: {
      enabled: false,
      intensity: 0,
      particles: false,
      transitions: false
    },
    customization: {
      glassEffect: false,
      gradientOverlay: false,
      blurIntensity: 0,
      borderRadius: 2,
      spacing: 16
    }
  },

  'achievement-based': {
    id: 'achievement-based',
    name: 'Logros Elite',
    description: 'Tema exclusivo para usuarios de elite',
    requiredLevel: 20,
    unlockConditions: {
      totalPoints: 10000,
      achievements: ['elite_learner', 'master_achiever', 'streak_legend']
    },
    isUnlocked: false,
    colors: {
      primary: 'hsl(35, 100%, 50%)',
      secondary: 'hsl(35, 80%, 90%)',
      accent: 'hsl(280, 100%, 70%)',
      background: 'hsl(220, 30%, 5%)',
      foreground: 'hsl(35, 80%, 95%)',
      muted: 'hsl(220, 30%, 15%)',
      mutedForeground: 'hsl(35, 40%, 70%)',
      border: 'hsl(35, 60%, 30%)',
      input: 'hsl(220, 30%, 15%)',
      ring: 'hsl(35, 100%, 50%)',
      destructive: 'hsl(0, 75%, 50%)',
      destructiveForeground: 'hsl(35, 80%, 95%)',
      success: 'hsl(120, 100%, 50%)',
      warning: 'hsl(38, 92%, 50%)',
      info: 'hsl(200, 100%, 50%)',
      gamification: 'hsl(35, 100%, 50%)',
      ai: 'hsl(280, 100%, 70%)',
      analytics: 'hsl(120, 100%, 50%)',
      spotify: 'hsl(140, 100%, 50%)',
      holographic: 'hsl(300, 100%, 70%)'
    },
    animations: {
      enabled: true,
      intensity: 100,
      particles: true,
      transitions: true
    },
    customization: {
      glassEffect: true,
      gradientOverlay: true,
      blurIntensity: 15,
      borderRadius: 20,
      spacing: 24
    },
    aiAdaptive: {
      enabled: true,
      moodSync: true,
      performanceOptimization: false,
      contextualColors: true
    }
  }
};

// Context del tema
interface ThemeContextType {
  currentTheme: ThemeConfig;
  availableThemes: ThemeConfig[];
  switchTheme: (themeId: ThemeType) => void;
  preferences: UserThemePreferences;
  updatePreferences: (preferences: Partial<UserThemePreferences>) => void;
  createCustomTheme: (name: string, baseTheme: ThemeType, customizations: Partial<ThemeConfig>) => void;
  getThemeForContext: (context: 'study' | 'gaming' | 'relax' | 'focus') => ThemeType;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const AdaptiveThemeProvider: React.FC<{
  children: React.ReactNode;
  userId: string;
}> = ({ children, userId }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(predefinedThemes.default);
  const [availableThemes, setAvailableThemes] = useState<ThemeConfig[]>([]);
  const [preferences, setPreferences] = useState<UserThemePreferences>({
    selectedTheme: 'default',
    customThemes: {},
    preferences: {
      automaticThemeSwitch: false,
      timeBasedThemes: {
        enabled: false,
        morning: 'default',
        afternoon: 'default',
        evening: 'default',
        night: 'default'
      },
      moodBasedThemes: {
        enabled: false,
        study: 'minimal',
        gaming: 'gaming',
        relax: 'music-sync',
        focus: 'ai-adaptive'
      },
      achievementUnlocks: true,
      aiRecommendations: true,
      adaptiveColors: true
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      largeFonts: false,
      colorBlindFriendly: false
    }
  });

  const { gameStats, achievements } = useGamification();
  const { recommendations } = useAIRecommendations();

  // Verificar qué temas están desbloqueados
  const checkUnlockedThemes = useMemo(() => {
    const userLevel = gameStats?.level || 1;
    const userPoints = gameStats?.totalPoints || 0;
    const userStreakDays = gameStats?.streakDays || 0;
    const userAchievements = achievements?.map(a => a.id) || [];

    return Object.values(predefinedThemes).map(theme => {
      let isUnlocked = theme.isUnlocked;

      // Verificar nivel requerido
      if (theme.requiredLevel && userLevel < theme.requiredLevel) {
        isUnlocked = false;
      }

      // Verificar condiciones de desbloqueo
      if (theme.unlockConditions) {
        const conditions = theme.unlockConditions;
        
        if (conditions.totalPoints && userPoints < conditions.totalPoints) {
          isUnlocked = false;
        }
        
        if (conditions.streakDays && userStreakDays < conditions.streakDays) {
          isUnlocked = false;
        }
        
        if (conditions.achievements) {
          const hasAllAchievements = conditions.achievements.every(reqAchievement =>
            userAchievements.includes(reqAchievement)
          );
          if (!hasAllAchievements) {
            isUnlocked = false;
          }
        }
      }

      return {
        ...theme,
        isUnlocked
      };
    });
  }, [gameStats, achievements]);

  // Actualizar temas disponibles
  useEffect(() => {
    setAvailableThemes(checkUnlockedThemes);
  }, [checkUnlockedThemes]);

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

  const switchTheme = (themeId: ThemeType) => {
    const theme = availableThemes.find(t => t.id === themeId);
    if (theme && theme.isUnlocked) {
      setCurrentTheme(theme);
      setPreferences(prev => ({
        ...prev,
        selectedTheme: themeId
      }));
    }
  };

  const updatePreferences = (newPreferences: Partial<UserThemePreferences>) => {
    setPreferences(prev => ({
      ...prev,
      ...newPreferences
    }));
  };

  const createCustomTheme = (
    name: string,
    baseTheme: ThemeType,
    customizations: Partial<ThemeConfig>
  ) => {
    const baseThemeConfig = predefinedThemes[baseTheme];
    const customTheme: ThemeConfig = {
      ...baseThemeConfig,
      ...customizations,
      id: `custom-${Date.now()}` as ThemeType,
      name,
      isUnlocked: true
    };

    setPreferences(prev => ({
      ...prev,
      customThemes: {
        ...prev.customThemes,
        [customTheme.id]: customTheme
      }
    }));

    setAvailableThemes(prev => [...prev, customTheme]);
  };

  const getThemeForContext = (context: 'study' | 'gaming' | 'relax' | 'focus'): ThemeType => {
    if (preferences.preferences.moodBasedThemes.enabled) {
      return preferences.preferences.moodBasedThemes[context];
    }
    return preferences.selectedTheme;
  };

  // Tema automático basado en tiempo
  useEffect(() => {
    if (preferences.preferences.timeBasedThemes.enabled) {
      const hour = new Date().getHours();
      let themeToUse: ThemeType;

      if (hour >= 6 && hour < 12) {
        themeToUse = preferences.preferences.timeBasedThemes.morning;
      } else if (hour >= 12 && hour < 18) {
        themeToUse = preferences.preferences.timeBasedThemes.afternoon;
      } else if (hour >= 18 && hour < 22) {
        themeToUse = preferences.preferences.timeBasedThemes.evening;
      } else {
        themeToUse = preferences.preferences.timeBasedThemes.night;
      }

      const theme = availableThemes.find(t => t.id === themeToUse);
      if (theme && theme.isUnlocked && theme.id !== currentTheme.id) {
        setCurrentTheme(theme);
      }
    }
  }, [preferences.preferences.timeBasedThemes, availableThemes, currentTheme.id]);

  const value: ThemeContextType = {
    currentTheme,
    availableThemes,
    switchTheme,
    preferences,
    updatePreferences,
    createCustomTheme,
    getThemeForContext
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Componente de configuración de temas
export const ThemeCustomizer: React.FC = () => {
  const {
    currentTheme,
    availableThemes,
    switchTheme,
    preferences,
    updatePreferences
  } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('themes');

  const { gameStats, achievements } = useGamification();

  const unlockedThemes = availableThemes.filter(t => t.isUnlocked);
  const lockedThemes = availableThemes.filter(t => !t.isUnlocked);

  const ThemeCard = ({ theme }: { theme: ThemeConfig }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'p-4 rounded-lg border-2 cursor-pointer transition-all duration-200',
        theme.id === currentTheme.id
          ? 'border-blue-500 bg-blue-500/10'
          : theme.isUnlocked
          ? 'border-gray-600 hover:border-gray-500 bg-gray-800/30'
          : 'border-gray-700 bg-gray-900/30 opacity-50 cursor-not-allowed'
      )}
      onClick={() => theme.isUnlocked && switchTheme(theme.id)}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-white">{theme.name}</h3>
        {theme.id === currentTheme.id && (
          <Badge variant="default">Actual</Badge>
        )}
        {!theme.isUnlocked && (
          <Badge variant="secondary">🔒</Badge>
        )}
      </div>
      
      <p className="text-sm text-gray-400 mb-3">{theme.description}</p>
      
      {/* Preview de colores */}
      <div className="flex gap-2 mb-3">
        <div 
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: theme.colors.primary }}
        />
        <div 
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: theme.colors.secondary }}
        />
        <div 
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: theme.colors.accent }}
        />
        <div 
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: theme.colors.ai }}
        />
        <div 
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: theme.colors.gamification }}
        />
      </div>

      {/* Requisitos para temas bloqueados */}
      {!theme.isUnlocked && (
        <div className="text-xs text-gray-500">
          {theme.requiredLevel && (
            <div>Nivel requerido: {theme.requiredLevel}</div>
          )}
          {theme.unlockConditions?.totalPoints && (
            <div>Puntos: {theme.unlockConditions.totalPoints}</div>
          )}
          {theme.unlockConditions?.streakDays && (
            <div>Racha: {theme.unlockConditions.streakDays} días</div>
          )}
        </div>
      )}
    </motion.div>
  );

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-600 transition-colors shadow-lg z-40"
      >
        <Palette className="h-5 w-5" />
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-4 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden"
    >
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Wand2 className="h-6 w-6 text-purple-400" />
              Personalización de Temas
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="mx-4 mt-4">
              <TabsTrigger value="themes">Temas</TabsTrigger>
              <TabsTrigger value="preferences">Preferencias</TabsTrigger>
              <TabsTrigger value="accessibility">Accesibilidad</TabsTrigger>
              <TabsTrigger value="custom">Personalizar</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto p-4">
              <TabsContent value="themes" className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Temas Disponibles ({unlockedThemes.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {unlockedThemes.map(theme => (
                      <ThemeCard key={theme.id} theme={theme} />
                    ))}
                  </div>
                </div>

                {lockedThemes.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Temas Bloqueados ({lockedThemes.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {lockedThemes.map(theme => (
                        <ThemeCard key={theme.id} theme={theme} />
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="preferences" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Cambio Automático</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white">Temas basados en hora</span>
                      <Switch
                        checked={preferences.preferences.timeBasedThemes.enabled}
                        onCheckedChange={(enabled) =>
                          updatePreferences({
                            preferences: {
                              ...preferences.preferences,
                              timeBasedThemes: {
                                ...preferences.preferences.timeBasedThemes,
                                enabled
                              }
                            }
                          })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-white">Temas basados en actividad</span>
                      <Switch
                        checked={preferences.preferences.moodBasedThemes.enabled}
                        onCheckedChange={(enabled) =>
                          updatePreferences({
                            preferences: {
                              ...preferences.preferences,
                              moodBasedThemes: {
                                ...preferences.preferences.moodBasedThemes,
                                enabled
                              }
                            }
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white">Recomendaciones de IA</span>
                      <Switch
                        checked={preferences.preferences.aiRecommendations}
                        onCheckedChange={(aiRecommendations) =>
                          updatePreferences({
                            preferences: {
                              ...preferences.preferences,
                              aiRecommendations
                            }
                          })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="accessibility" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración de Accesibilidad</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white">Alto contraste</span>
                      <Switch
                        checked={preferences.accessibility.highContrast}
                        onCheckedChange={(highContrast) =>
                          updatePreferences({
                            accessibility: {
                              ...preferences.accessibility,
                              highContrast
                            }
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white">Reducir animaciones</span>
                      <Switch
                        checked={preferences.accessibility.reducedMotion}
                        onCheckedChange={(reducedMotion) =>
                          updatePreferences({
                            accessibility: {
                              ...preferences.accessibility,
                              reducedMotion
                            }
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white">Fuentes grandes</span>
                      <Switch
                        checked={preferences.accessibility.largeFonts}
                        onCheckedChange={(largeFonts) =>
                          updatePreferences({
                            accessibility: {
                              ...preferences.accessibility,
                              largeFonts
                            }
                          })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="custom" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Crear Tema Personalizado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-center py-8">
                      Próximamente: Editor de temas personalizado
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
};

export default AdaptiveThemeProvider;
