import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  X,
  Play,
  Pause,
  RotateCcw,
  Check,
  Star,
  Sparkles,
  Brain,
  Trophy,
  BarChart3,
  Music,
  Eye,
  Target,
  BookOpen,
  Settings,
  Compass,
  GraduationCap,
  Zap,
  Users,
  Calendar,
  HelpCircle,
  ArrowRight,
  Skip,
  Volume2,
  VolumeX
} from 'lucide-react';

import { useAuth } from '@/hooks/use-auth';
import { useGamification } from '@/hooks/use-gamification';
import { useNavigate } from 'react-router-dom';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  category: 'welcome' | 'navigation' | 'core' | 'ai' | 'gamification' | 'advanced' | 'completion';
  requiredLevel?: number;
  estimatedTime: number; // en segundos
  interactive: boolean;
  content: {
    highlights?: Array<{
      selector: string;
      title: string;
      description: string;
      position: 'top' | 'bottom' | 'left' | 'right';
    }>;
    actions?: Array<{
      type: 'navigate' | 'click' | 'input' | 'wait';
      target: string;
      value?: string;
      description: string;
    }>;
    tips?: string[];
    warnings?: string[];
    demoData?: any;
    videoUrl?: string;
    animation?: {
      type: 'slide' | 'fade' | 'scale' | 'bounce';
      duration: number;
      delay?: number;
    };
  };
  prerequisites?: string[];
  unlocks?: string[];
  completionCriteria?: {
    type: 'manual' | 'automatic' | 'interaction' | 'navigation';
    condition?: string;
  };
}

interface OnboardingProgress {
  currentStep: number;
  completedSteps: Set<string>;
  skippedSteps: Set<string>;
  timeSpent: number;
  userPreferences: {
    autoAdvance: boolean;
    showAnimations: boolean;
    playSound: boolean;
    detailedExplanations: boolean;
    skipBasics: boolean;
  };
  customization: {
    theme: 'light' | 'dark' | 'auto';
    speed: 'slow' | 'normal' | 'fast';
    language: 'es' | 'en';
  };
}

// Configuración de pasos de onboarding
const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: '¡Bienvenido a PAES AI!',
    subtitle: 'Tu sistema de preparación inteligente',
    description: 'PAES AI es una plataforma revolucionaria que combina inteligencia artificial, gamificación y análisis predictivo para maximizar tu preparación para la PSU.',
    icon: GraduationCap,
    category: 'welcome',
    estimatedTime: 30,
    interactive: false,
    content: {
      tips: [
        'Este tour te llevará 5-10 minutos aproximadamente',
        'Puedes saltar pasos si ya conoces el sistema',
        'Tu progreso se guardará automáticamente'
      ],
      animation: {
        type: 'fade',
        duration: 1000
      }
    },
    completionCriteria: {
      type: 'manual'
    }
  },

  {
    id: 'navigation-basics',
    title: 'Navegación Principal',
    subtitle: 'Conoce tu centro de comando',
    description: 'La navegación lateral es tu puerta de entrada a todas las funcionalidades. Cada sección está organizada por importancia y desbloqueada por tu progreso.',
    icon: Compass,
    category: 'navigation',
    estimatedTime: 45,
    interactive: true,
    content: {
      highlights: [
        {
          selector: '[data-onboarding="navigation-menu"]',
          title: 'Menú Principal',
          description: 'Accede a todas las secciones desde aquí',
          position: 'right'
        },
        {
          selector: '[data-onboarding="user-stats"]',
          title: 'Tu Progreso',
          description: 'Ve tu nivel, puntos y progreso actual',
          position: 'bottom'
        }
      ],
      actions: [
        {
          type: 'click',
          target: '[data-onboarding="navigation-toggle"]',
          description: 'Haz clic para abrir/cerrar el menú'
        }
      ],
      tips: [
        'El menú se adapta a tu nivel de progreso',
        'Las secciones bloqueadas se desbloquean con experiencia',
        'Usa el buscador para encontrar funciones específicas'
      ]
    },
    completionCriteria: {
      type: 'interaction',
      condition: 'navigation-menu-opened'
    }
  },

  {
    id: 'dashboard-overview',
    title: 'Dashboard Unificado',
    subtitle: 'Tu centro de control inteligente',
    description: 'El dashboard combina todas tus métricas, recomendaciones de IA y progreso en una vista cohesiva y poderosa.',
    icon: BarChart3,
    category: 'core',
    estimatedTime: 60,
    interactive: true,
    content: {
      highlights: [
        {
          selector: '[data-onboarding="metrics-cards"]',
          title: 'Métricas Principales',
          description: 'Tus estadísticas más importantes de un vistazo',
          position: 'bottom'
        },
        {
          selector: '[data-onboarding="quick-actions"]',
          title: 'Acciones Rápidas',
          description: 'Botones para las acciones más comunes',
          position: 'left'
        },
        {
          selector: '[data-onboarding="recommendations-preview"]',
          title: 'Vista Previa IA',
          description: 'Recomendaciones personalizadas basadas en tu progreso',
          position: 'top'
        }
      ],
      tips: [
        'El dashboard se actualiza en tiempo real',
        'Puedes personalizar qué métricas ver',
        'Las recomendaciones mejoran con tu uso del sistema'
      ]
    },
    completionCriteria: {
      type: 'automatic'
    }
  },

  {
    id: 'ai-introduction',
    title: 'Inteligencia Artificial',
    subtitle: 'Tu asistente de estudio personalizado',
    description: 'El sistema de IA analiza tu progreso, identifica áreas de mejora y genera recomendaciones personalizadas para optimizar tu aprendizaje.',
    icon: Brain,
    category: 'ai',
    estimatedTime: 90,
    interactive: true,
    content: {
      highlights: [
        {
          selector: '[data-onboarding="ai-recommendations"]',
          title: 'Recomendaciones IA',
          description: 'Actividades personalizadas basadas en tu rendimiento',
          position: 'right'
        },
        {
          selector: '[data-onboarding="bloom-progression"]',
          title: 'Progresión Bloom',
          description: 'Seguimiento de tus habilidades cognitivas',
          position: 'bottom'
        }
      ],
      actions: [
        {
          type: 'navigate',
          target: '/ai-recommendations',
          description: 'Exploremos las recomendaciones de IA'
        }
      ],
      tips: [
        'La IA aprende de tus patrones de estudio',
        'Las recomendaciones se actualizan diariamente',
        'Puedes retroalimentar la utilidad de cada recomendación'
      ],
      demoData: {
        recommendations: [
          { title: 'Ejercicios de Álgebra', confidence: 0.92, reasoning: 'Basado en tu bajo rendimiento en ecuaciones' },
          { title: 'Comprensión Lectora Avanzada', confidence: 0.87, reasoning: 'Para fortalecer análisis de textos complejos' }
        ]
      }
    },
    completionCriteria: {
      type: 'navigation',
      condition: '/ai-recommendations'
    }
  },

  {
    id: 'gamification-introduction',
    title: 'Sistema de Gamificación',
    subtitle: 'Aprende jugando y compitiendo',
    description: 'Convierte tu estudio en una experiencia gamificada con logros, niveles, puntos y competencias que mantienen tu motivación al máximo.',
    icon: Trophy,
    category: 'gamification',
    estimatedTime: 75,
    interactive: true,
    content: {
      highlights: [
        {
          selector: '[data-onboarding="achievements-section"]',
          title: 'Tus Logros',
          description: 'Colecciona logros por completar actividades',
          position: 'top'
        },
        {
          selector: '[data-onboarding="level-progress"]',
          title: 'Progreso de Nivel',
          description: 'Gana experiencia y sube de nivel',
          position: 'bottom'
        },
        {
          selector: '[data-onboarding="rankings"]',
          title: 'Rankings',
          description: 'Compite con otros estudiantes',
          position: 'left'
        }
      ],
      tips: [
        'Cada actividad completada otorga puntos y experiencia',
        'Los logros se desbloquean automáticamente',
        'Mantén tu racha diaria para bonificaciones especiales'
      ],
      demoData: {
        currentLevel: 3,
        points: 1250,
        achievements: ['Primer Logro', 'Estudiante Dedicado', 'Racha de 7 Días']
      }
    },
    completionCriteria: {
      type: 'manual'
    }
  },

  {
    id: 'advanced-features',
    title: 'Funciones Avanzadas',
    subtitle: 'Desbloquea el máximo potencial',
    description: 'A medida que progreses, desbloquearás funciones avanzadas como visualizaciones 3D, integración con Spotify y analytics predictivos.',
    icon: Sparkles,
    category: 'advanced',
    requiredLevel: 1,
    estimatedTime: 120,
    interactive: true,
    content: {
      highlights: [
        {
          selector: '[data-onboarding="3d-toggle"]',
          title: 'Dashboard 3D',
          description: 'Visualizaciones holográficas inmersivas (Nivel 5+)',
          position: 'top'
        },
        {
          selector: '[data-onboarding="spotify-integration"]',
          title: 'Spotify PAES',
          description: 'Música adaptativa para estudiar',
          position: 'right'
        },
        {
          selector: '[data-onboarding="analytics-preview"]',
          title: 'Analytics Predictivos',
          description: 'Predicciones de rendimiento con IA',
          position: 'bottom'
        }
      ],
      tips: [
        'Las funciones se desbloquean por nivel y logros',
        'Cada función está diseñada para mejorar tu aprendizaje',
        'Puedes personalizar cuáles usar según tus preferencias'
      ],
      warnings: [
        'Algunas funciones requieren navegadores modernos',
        'Las visualizaciones 3D pueden consumir más batería'
      ]
    },
    prerequisites: ['navigation-basics', 'dashboard-overview'],
    completionCriteria: {
      type: 'manual'
    }
  },

  {
    id: 'personalization',
    title: 'Personalización',
    subtitle: 'Haz que PAES sea verdaderamente tuyo',
    description: 'Personaliza temas, notificaciones, y configuraciones para crear una experiencia de aprendizaje que se adapte perfectamente a ti.',
    icon: Settings,
    category: 'advanced',
    estimatedTime: 60,
    interactive: true,
    content: {
      highlights: [
        {
          selector: '[data-onboarding="theme-customizer"]',
          title: 'Personalizar Tema',
          description: 'Cambia colores y estilos según tu progreso',
          position: 'left'
        },
        {
          selector: '[data-onboarding="notifications-settings"]',
          title: 'Notificaciones',
          description: 'Configura recordatorios y alertas inteligentes',
          position: 'top'
        }
      ],
      actions: [
        {
          type: 'click',
          target: '[data-onboarding="theme-customizer"]',
          description: 'Prueba cambiar el tema'
        }
      ],
      tips: [
        'Los temas se desbloquean con tu progreso',
        'Las notificaciones IA aprenden de tus horarios',
        'Puedes exportar e importar configuraciones'
      ]
    },
    completionCriteria: {
      type: 'interaction',
      condition: 'theme-changed'
    }
  },

  {
    id: 'help-system',
    title: 'Sistema de Ayuda',
    subtitle: 'Nunca estudies solo',
    description: 'Nuestro asistente de IA está siempre disponible para ayudarte. Desde dudas técnicas hasta recomendaciones de estudio.',
    icon: HelpCircle,
    category: 'core',
    estimatedTime: 45,
    interactive: true,
    content: {
      highlights: [
        {
          selector: '[data-onboarding="ai-assistant"]',
          title: 'Asistente IA',
          description: 'Chat inteligente para resolver dudas',
          position: 'left'
        },
        {
          selector: '[data-onboarding="contextual-help"]',
          title: 'Ayuda Contextual',
          description: 'Sugerencias automáticas según donde estés',
          position: 'top'
        }
      ],
      actions: [
        {
          type: 'click',
          target: '[data-onboarding="ai-assistant"]',
          description: 'Abre el asistente de IA'
        }
      ],
      tips: [
        'El asistente entiende contexto y preferencias',
        'Puedes hacer preguntas en lenguaje natural',
        'La ayuda se adapta a tu nivel de conocimiento'
      ]
    },
    completionCriteria: {
      type: 'interaction',
      condition: 'assistant-opened'
    }
  },

  {
    id: 'completion',
    title: '¡Felicitaciones!',
    subtitle: 'Estás listo para comenzar',
    description: 'Has completado el tour de PAES AI. Ahora tienes todo el conocimiento necesario para aprovechar al máximo esta plataforma inteligente.',
    icon: Star,
    category: 'completion',
    estimatedTime: 30,
    interactive: false,
    content: {
      tips: [
        'Recuerda que puedes revisar este tour en cualquier momento',
        'Las funciones avanzadas se desbloquean con tu progreso',
        'El sistema de ayuda está siempre disponible'
      ],
      actions: [
        {
          type: 'navigate',
          target: '/',
          description: 'Ir al dashboard principal'
        }
      ],
      animation: {
        type: 'bounce',
        duration: 1500
      }
    },
    unlocks: ['full-access'],
    completionCriteria: {
      type: 'manual'
    }
  }
];

export const AdvancedOnboardingSystem: React.FC<{
  userId: string;
  onComplete: () => void;
}> = ({ userId, onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState<OnboardingProgress>({
    currentStep: 0,
    completedSteps: new Set(),
    skippedSteps: new Set(),
    timeSpent: 0,
    userPreferences: {
      autoAdvance: true,
      showAnimations: true,
      playSound: false,
      detailedExplanations: true,
      skipBasics: false
    },
    customization: {
      theme: 'dark',
      speed: 'normal',
      language: 'es'
    }
  });
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isPlaying, setIsPlaying] = useState(false);

  const { user } = useAuth();
  const { gameStats } = useGamification();
  const navigate = useNavigate();

  // Filtrar pasos disponibles según el nivel del usuario
  const availableSteps = useMemo(() => {
    const userLevel = gameStats?.level || 1;
    return onboardingSteps.filter(step => 
      !step.requiredLevel || userLevel >= step.requiredLevel
    );
  }, [gameStats?.level]);

  const currentStep = availableSteps[progress.currentStep];
  const totalSteps = availableSteps.length;
  const completionPercentage = ((progress.currentStep + 1) / totalSteps) * 100;

  // Verificar si debe iniciarse automáticamente para nuevos usuarios
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem(`onboarding-completed-${userId}`);
    const isNewUser = !gameStats || gameStats.totalPoints === 0;
    
    if (!hasCompletedOnboarding && isNewUser) {
      setTimeout(() => setIsActive(true), 1000);
    }
  }, [userId, gameStats]);

  // Timer para rastrear tiempo gastado
  useEffect(() => {
    if (isActive && isPlaying) {
      const interval = setInterval(() => {
        setProgress(prev => ({
          ...prev,
          timeSpent: Date.now() - startTime
        }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isActive, isPlaying, startTime]);

  const handleNext = () => {
    if (currentStep) {
      const newCompleted = new Set(progress.completedSteps);
      newCompleted.add(currentStep.id);

      if (progress.currentStep < totalSteps - 1) {
        setProgress(prev => ({
          ...prev,
          currentStep: prev.currentStep + 1,
          completedSteps: newCompleted
        }));
      } else {
        // Completar onboarding
        handleComplete();
      }
    }
  };

  const handlePrevious = () => {
    if (progress.currentStep > 0) {
      setProgress(prev => ({
        ...prev,
        currentStep: prev.currentStep - 1
      }));
    }
  };

  const handleSkip = () => {
    if (currentStep) {
      const newSkipped = new Set(progress.skippedSteps);
      newSkipped.add(currentStep.id);
      
      setProgress(prev => ({
        ...prev,
        skippedSteps: newSkipped
      }));
    }
    handleNext();
  };

  const handleComplete = () => {
    localStorage.setItem(`onboarding-completed-${userId}`, 'true');
    localStorage.setItem(`onboarding-progress-${userId}`, JSON.stringify(progress));
    
    setIsActive(false);
    onComplete();
    
    // Navegar al dashboard principal
    navigate('/');
  };

  const handleStepClick = (stepIndex: number) => {
    setProgress(prev => ({
      ...prev,
      currentStep: stepIndex
    }));
  };

  const executeStepAction = (action: NonNullable<OnboardingStep['content']['actions']>[0]) => {
    switch (action.type) {
      case 'navigate':
        navigate(action.target);
        break;
      case 'click':
        const element = document.querySelector(action.target);
        if (element) {
          (element as HTMLElement).click();
        }
        break;
      case 'wait':
        setTimeout(() => {
          if (progress.userPreferences.autoAdvance) {
            handleNext();
          }
        }, parseInt(action.target));
        break;
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center space-x-2 mb-6">
      {availableSteps.map((step, index) => {
        const isCompleted = progress.completedSteps.has(step.id);
        const isSkipped = progress.skippedSteps.has(step.id);
        const isCurrent = index === progress.currentStep;

        return (
          <button
            key={step.id}
            onClick={() => handleStepClick(index)}
            className={cn(
              'w-3 h-3 rounded-full transition-all duration-200',
              isCurrent && 'ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-900',
              isCompleted && 'bg-green-500',
              isSkipped && 'bg-yellow-500',
              !isCompleted && !isSkipped && !isCurrent && 'bg-gray-600',
              !isCompleted && !isSkipped && isCurrent && 'bg-blue-500'
            )}
          />
        );
      })}
    </div>
  );

  const StepContent = () => {
    if (!currentStep) return null;

    const Icon = currentStep.icon;

    return (
      <motion.div
        key={currentStep.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <div className="mb-6">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4"
            animate={progress.userPreferences.showAnimations ? {
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Icon className="h-8 w-8 text-white" />
          </motion.div>
          
          <Badge variant="outline" className="text-xs mb-2">
            Paso {progress.currentStep + 1} de {totalSteps} • {currentStep.estimatedTime}s
          </Badge>
          
          <h2 className="text-2xl font-bold text-white mb-2">
            {currentStep.title}
          </h2>
          
          <p className="text-lg text-gray-300 mb-4">
            {currentStep.subtitle}
          </p>
          
          <p className="text-gray-400 max-w-lg mx-auto leading-relaxed">
            {currentStep.description}
          </p>
        </div>

        {/* Demo Data Visualization */}
        {currentStep.content.demoData && (
          <Card className="bg-gray-800/50 border-gray-700 mb-6 max-w-md mx-auto">
            <CardContent className="p-4">
              {currentStep.id === 'ai-introduction' && (
                <div className="space-y-3">
                  <h4 className="font-medium text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-400" />
                    Recomendaciones de Ejemplo
                  </h4>
                  {currentStep.content.demoData.recommendations.map((rec: any, index: number) => (
                    <div key={index} className="p-3 bg-gray-900/50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="text-sm font-medium text-white">{rec.title}</h5>
                        <Badge variant="secondary" className="text-xs">
                          {(rec.confidence * 100).toFixed(0)}%
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400">{rec.reasoning}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {currentStep.id === 'gamification-introduction' && (
                <div className="text-center space-y-3">
                  <div className="flex justify-around">
                    <div>
                      <div className="text-xl font-bold text-yellow-400">
                        {currentStep.content.demoData.currentLevel}
                      </div>
                      <div className="text-xs text-gray-400">Nivel</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-green-400">
                        {currentStep.content.demoData.points}
                      </div>
                      <div className="text-xs text-gray-400">Puntos</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white mb-2">Logros Recientes</h4>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {currentStep.content.demoData.achievements.map((achievement: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          🏆 {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tips Section */}
        {currentStep.content.tips && currentStep.content.tips.length > 0 && (
          <Card className="bg-blue-900/20 border-blue-500/30 mb-6 max-w-lg mx-auto">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-300 mb-3 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Consejos útiles
              </h4>
              <ul className="space-y-2 text-sm">
                {currentStep.content.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-blue-100">
                    <span className="text-blue-400 mt-1">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Warnings Section */}
        {currentStep.content.warnings && currentStep.content.warnings.length > 0 && (
          <Card className="bg-orange-900/20 border-orange-500/30 mb-6 max-w-lg mx-auto">
            <CardContent className="p-4">
              <h4 className="font-medium text-orange-300 mb-3 flex items-center gap-2">
                ⚠️ Importante
              </h4>
              <ul className="space-y-2 text-sm">
                {currentStep.content.warnings.map((warning, index) => (
                  <li key={index} className="text-orange-200">
                    {warning}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Interactive Actions */}
        {currentStep.content.actions && currentStep.interactive && (
          <div className="mb-6">
            <h4 className="font-medium text-white mb-3">Pruébalo ahora:</h4>
            <div className="space-y-2">
              {currentStep.content.actions.map((action, index) => (
                <Button
                  key={index}
                  onClick={() => executeStepAction(action)}
                  variant="outline"
                  className="text-blue-400 border-blue-400 hover:bg-blue-400/10"
                >
                  {action.description}
                </Button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-6 w-6 text-blue-400" />
              <div>
                <h1 className="font-bold text-white">PAES AI Onboarding</h1>
                <p className="text-sm text-gray-400">
                  {Math.floor(progress.timeSpent / 1000 / 60)}:{String(Math.floor((progress.timeSpent / 1000) % 60)).padStart(2, '0')} minutos
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Configuraciones rápidas */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setProgress(prev => ({
                  ...prev,
                  userPreferences: {
                    ...prev.userPreferences,
                    showAnimations: !prev.userPreferences.showAnimations
                  }
                }))}
              >
                {progress.userPreferences.showAnimations ? <Zap className="h-4 w-4" /> : <Zap className="h-4 w-4 opacity-50" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setProgress(prev => ({
                  ...prev,
                  userPreferences: {
                    ...prev.userPreferences,
                    playSound: !prev.userPreferences.playSound
                  }
                }))}
              >
                {progress.userPreferences.playSound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 opacity-50" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsActive(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Progreso del Tour</span>
              <span className="text-blue-400">{Math.round(completionPercentage)}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[60vh]">
          <StepIndicator />
          <AnimatePresence mode="wait">
            <StepContent />
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={progress.currentStep === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>
              
              {progress.currentStep > 0 && (
                <Button
                  variant="ghost"
                  onClick={() => setProgress(prev => ({
                    ...prev,
                    currentStep: 0
                  }))}
                  size="sm"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={progress.userPreferences.autoAdvance}
                onCheckedChange={(checked) => setProgress(prev => ({
                  ...prev,
                  userPreferences: {
                    ...prev.userPreferences,
                    autoAdvance: checked
                  }
                }))}
              />
              <span className="text-sm text-gray-400">Auto-avanzar</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleSkip}
              >
                Saltar
                <Skip className="h-4 w-4 ml-2" />
              </Button>
              
              <Button
                onClick={progress.currentStep === totalSteps - 1 ? handleComplete : handleNext}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {progress.currentStep === totalSteps - 1 ? (
                  <>
                    Completar
                    <Check className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  <>
                    Siguiente
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Hook para controlar el onboarding
export const useOnboarding = (userId: string) => {
  const [shouldShow, setShouldShow] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const hasCompleted = localStorage.getItem(`onboarding-completed-${userId}`);
    setIsCompleted(!!hasCompleted);
    
    if (!hasCompleted) {
      const timer = setTimeout(() => setShouldShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [userId]);

  const startOnboarding = () => setShouldShow(true);
  const completeOnboarding = () => {
    setShouldShow(false);
    setIsCompleted(true);
  };

  return {
    shouldShow,
    isCompleted,
    startOnboarding,
    completeOnboarding
  };
};

export default AdvancedOnboardingSystem;
