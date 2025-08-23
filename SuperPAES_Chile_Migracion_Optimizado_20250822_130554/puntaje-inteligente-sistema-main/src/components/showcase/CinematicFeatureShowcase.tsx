/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/leonardo-auth-client';
import {
  Brain,
  Globe,
  Target,
  BarChart3,
  DollarSign,
  Sparkles,
  ArrowRight,
  Play,
  Pause,
  SkipForward
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
// ?? COMPONENTES PREMIUM BLACK
import { CinematicBackground } from '../../components/premium/CinematicBackground';
import { PremiumCard } from '../../components/premium/PremiumCard';
import { ParticleSystem } from '../../components/premium/ParticleSystem';
import { PremiumButton } from '../../components/premium/PremiumButton';
import { PremiumContainer } from '../../components/premium/PremiumContainer';

// ?? Definición de las 5 Dimensiones Neurales del Showcase
interface ShowcaseDimension {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: {
    primary: string;
    secondary: string;
    glow: string;
  };
  visualComponent: React.ComponentType;
  duration: number;
}

// ?? Componente Visual: Centro de Comando Neural
const NeuralCommandVisual: React.FC = () => (
  <div className="relative w-full h-64 flex items-center justify-center">
    <motion.div
      className="relative"
      animate={{ 
        rotate: 360,
        scale: [1, 1.1, 1]
      }}
      transition={{ 
        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
        scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <Brain className="w-32 h-32 text-cyan-400" />
      
      {/* Partículas neurales */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-cyan-400 rounded-full"
          style={{
            left: `${50 + 40 * Math.cos((i * 30) * Math.PI / 180)}%`,
            top: `${50 + 40 * Math.sin((i * 30) * Math.PI / 180)}%`,
          }}
          animate={{
            scale: [0.5, 1.5, 0.5],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
    </motion.div>
    
    {/* Métricas en tiempo real */}
    <div className="absolute bottom-4 left-4 right-4">
      <div className="grid grid-cols-3 gap-2 text-center">
        <PremiumCard className="bg-cyan-500/20" glowColor="cyan">
          <div className="text-cyan-400 text-lg font-bold">94%</div>
          <div className="text-cyan-300 text-xs">Precisión IA</div>
        </PremiumCard>
        <PremiumCard className="bg-blue-500/20" glowColor="blue">
          <div className="text-blue-400 text-lg font-bold">127</div>
          <div className="text-blue-300 text-xs">Nodos Activos</div>
        </PremiumCard>
        <PremiumCard className="bg-purple-500/20" glowColor="purple">
          <div className="text-purple-400 text-lg font-bold">8</div>
          <div className="text-purple-300 text-xs">Potencial</div>
        </PremiumCard>
      </div>
    </div>
  </div>
);

// ?? Componente Visual: Universo Educativo 3D
const UniverseVisual: React.FC = () => (
  <div className="relative w-full h-64 flex items-center justify-center overflow-hidden">
    <motion.div
      className="relative"
      animate={{ rotateY: 360 }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
    >
      <Globe className="w-32 h-32 text-purple-400" />
      
      {/* Galaxia de conocimiento */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-purple-400 rounded-full"
          style={{
            left: `${50 + 60 * Math.cos((i * 18) * Math.PI / 180)}%`,
            top: `${50 + 60 * Math.sin((i * 18) * Math.PI / 180)}%`,
          }}
          animate={{
            scale: [0, 2, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </motion.div>
    
    {/* Conexiones de aprendizaje */}
    <div className="absolute inset-0">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-px h-16 bg-gradient-to-b from-purple-400 to-transparent"
          style={{
            left: `${20 + i * 12}%`,
            top: `${30 + (i % 2) * 20}%`,
          }}
          animate={{
            scaleY: [0, 1, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
    
    {/* Estadísticas del universo */}
    <div className="absolute bottom-4 left-4 right-4">
      <div className="grid grid-cols-2 gap-2 text-center">
        <PremiumCard className="bg-purple-500/20" glowColor="purple">
          <div className="text-purple-400 text-lg font-bold">8</div>
          <div className="text-purple-300 text-xs">Mundos Disponibles</div>
        </PremiumCard>
        <PremiumCard className="bg-pink-500/20" glowColor="pink">
          <div className="text-pink-400 text-lg font-bold">3D</div>
          <div className="text-pink-300 text-xs">Navegación Inmersiva</div>
        </PremiumCard>
      </div>
    </div>
  </div>
);

// ?? Componente Visual: Entrenamiento Neural
const TrainingVisual: React.FC = () => (
  <div className="relative w-full h-64 flex items-center justify-center">
    <motion.div
      className="relative"
      animate={{ 
        scale: [1, 1.2, 1],
        rotateZ: [0, 5, -5, 0]
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
    >
      <Target className="w-32 h-32 text-green-400" />
      
      {/* Anillos de precisión */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute border-2 border-green-400/30 rounded-full"
          style={{
            width: `${120 + i * 40}px`,
            height: `${120 + i * 40}px`,
            left: `${-60 - i * 20}px`,
            top: `${-60 - i * 20}px`,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
    </motion.div>
    
    {/* Métricas de entrenamiento */}
    <div className="absolute bottom-4 left-4 right-4">
      <div className="grid grid-cols-3 gap-2 text-center">
        <PremiumCard className="bg-green-500/20" glowColor="green">
          <div className="text-green-400 text-lg font-bold">AI</div>
          <div className="text-green-300 text-xs">LectoGuía</div>
        </PremiumCard>
        <PremiumCard className="bg-emerald-500/20" glowColor="emerald">
          <div className="text-emerald-400 text-lg font-bold">8</div>
          <div className="text-emerald-300 text-xs">Ejercicios</div>
        </PremiumCard>
        <PremiumCard className="bg-teal-500/20" glowColor="teal">
          <div className="text-teal-400 text-lg font-bold">100%</div>
          <div className="text-teal-300 text-xs">Adaptativo</div>
        </PremiumCard>
      </div>
    </div>
  </div>
);

// ?? Componente Visual: Análisis de Progreso
const AnalysisVisual: React.FC = () => (
  <div className="relative w-full h-64 flex items-center justify-center">
    <motion.div
      className="relative"
      animate={{ 
        rotateY: [0, 180, 360],
        scale: [1, 1.1, 1]
      }}
      transition={{ 
        duration: 6, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
    >
      <BarChart3 className="w-32 h-32 text-orange-400" />
      
      {/* Barras de datos dinámicas */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-orange-400/60 rounded"
          style={{
            width: '8px',
            left: `${40 + i * 12}px`,
            bottom: '20px',
          }}
          animate={{
            height: [`${20 + i * 10}px`, `${40 + i * 15}px`, `${20 + i * 10}px`],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </motion.div>
    
    {/* Métricas predictivas */}
    <div className="absolute bottom-4 left-4 right-4">
      <div className="grid grid-cols-3 gap-2 text-center">
        <PremiumCard className="bg-orange-500/20" glowColor="orange">
          <div className="text-orange-400 text-lg font-bold">AI</div>
          <div className="text-orange-300 text-xs">Diagnóstico</div>
        </PremiumCard>
        <PremiumCard className="bg-red-500/20" glowColor="red">
          <div className="text-red-400 text-lg font-bold">95%</div>
          <div className="text-red-300 text-xs">Precisión</div>
        </PremiumCard>
        <PremiumCard className="bg-yellow-500/20" glowColor="yellow">
          <div className="text-yellow-400 text-lg font-bold">8</div>
          <div className="text-yellow-300 text-xs">Insights</div>
        </PremiumCard>
      </div>
    </div>
  </div>
);

// ?? Componente Visual: Centro Financiero
const FinancialVisual: React.FC = () => (
  <div className="relative w-full h-64 flex items-center justify-center">
    <motion.div
      className="relative"
      animate={{ 
        rotateZ: [0, 360],
        scale: [1, 1.15, 1]
      }}
      transition={{ 
        rotateZ: { duration: 12, repeat: Infinity, ease: "linear" },
        scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <DollarSign className="w-32 h-32 text-emerald-400" />
      
      {/* Hologramas de datos financieros */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-emerald-400/60 rounded"
          style={{
            left: `${50 + 50 * Math.cos((i * 45) * Math.PI / 180)}%`,
            top: `${50 + 50 * Math.sin((i * 45) * Math.PI / 180)}%`,
          }}
          animate={{
            scale: [0.5, 1.5, 0.5],
            opacity: [0.4, 1, 0.4],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </motion.div>
    
    {/* Datos FUAS en tiempo real */}
    <div className="absolute bottom-4 left-4 right-4">
      <div className="grid grid-cols-3 gap-2 text-center">
        <PremiumCard className="bg-emerald-500/20" glowColor="emerald">
          <div className="text-emerald-400 text-lg font-bold">FUAS</div>
          <div className="text-emerald-300 text-xs">Simulador</div>
        </PremiumCard>
        <PremiumCard className="bg-green-500/20" glowColor="green">
          <div className="text-green-400 text-lg font-bold">100%</div>
          <div className="text-green-300 text-xs">Becas</div>
        </PremiumCard>
        <PremiumCard className="bg-teal-500/20" glowColor="teal">
          <div className="text-teal-400 text-lg font-bold">AI</div>
          <div className="text-teal-300 text-xs">Predictor</div>
        </PremiumCard>
      </div>
    </div>
  </div>
);

// ?? Configuración de las 5 Dimensiones
const SHOWCASE_DIMENSIONS: ShowcaseDimension[] = [
  {
    id: 'neural_command',
    title: 'Centro de Comando Neural',
    subtitle: 'Hub Central del Ecosistema',
    description: 'Sistema neural avanzado con métricas en tiempo real y control total del ecosistema educativo',
    icon: Brain,
    color: {
      primary: 'from-cyan-500 to-blue-600',
      secondary: 'from-cyan-400 to-blue-500',
      glow: 'cyan'
    },
    visualComponent: NeuralCommandVisual,
    duration: 4000
  },
  {
    id: 'educational_universe',
    title: 'Universo Educativo 3D',
    subtitle: 'Exploración Inmersiva del Conocimiento',
    description: 'Navegación 3D por mundos de aprendizaje con conexiones neurales y experiencias inmersivas',
    icon: Globe,
    color: {
      primary: 'from-purple-500 to-pink-600',
      secondary: 'from-purple-400 to-pink-500',
      glow: 'purple'
    },
    visualComponent: UniverseVisual,
    duration: 4000
  },
  {
    id: 'neural_training',
    title: 'Entrenamiento Neural',
    subtitle: 'LectoGuía con IA Adaptativa',
    description: 'Sistema de entrenamiento inteligente con ejercicios adaptativos y feedback personalizado',
    icon: Target,
    color: {
      primary: 'from-green-500 to-emerald-600',
      secondary: 'from-green-400 to-emerald-500',
      glow: 'green'
    },
    visualComponent: TrainingVisual,
    duration: 4000
  },
  {
    id: 'progress_analysis',
    title: 'Análisis de Progreso',
    subtitle: 'Diagnósticos Inteligentes y Predictivos',
    description: 'IA avanzada para análisis predictivo, diagnósticos precisos y reportes de progreso detallados',
    icon: BarChart3,
    color: {
      primary: 'from-orange-500 to-red-600',
      secondary: 'from-orange-400 to-red-500',
      glow: 'orange'
    },
    visualComponent: AnalysisVisual,
    duration: 4000
  },
  {
    id: 'financial_center',
    title: 'Centro Financiero Inteligente',
    subtitle: 'Simulador FUAS y Predicciones',
    description: 'Calculadora PAES avanzada, simulador FUAS y predicciones de becas con IA financiera',
    icon: DollarSign,
    color: {
      primary: 'from-emerald-500 to-green-600',
      secondary: 'from-emerald-400 to-green-500',
      glow: 'emerald'
    },
    visualComponent: FinancialVisual,
    duration: 4000
  }
];

// ?? Configuración del Showcase
const SHOWCASE_CONFIG = {
  totalDuration: 20000, // 20 segundos total
  transitionDuration: 1000, // 1 segundo entre dimensiones
  autoAdvance: true,
  allowSkip: true,
  showProgress: true
};

interface CinematicFeatureShowcaseProps {
  onComplete?: () => void;
}

export const CinematicFeatureShowcase: React.FC<CinematicFeatureShowcaseProps> = ({ onComplete }) => {
  const [currentDimensionIndex, setCurrentDimensionIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const currentDimension = SHOWCASE_DIMENSIONS[currentDimensionIndex];
  const VisualComponent = currentDimension.visualComponent;

  // ?? Control de progreso automático
  useEffect(() => {
    if (!isPlaying || isComplete) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (SHOWCASE_CONFIG.totalDuration / 100));
        
        if (newProgress >= 100) {
          setIsComplete(true);
          return 100;
        }
        
        // Cambiar dimensión cada 20% del progreso
        const dimensionProgress = (newProgress % 20);
        if (dimensionProgress < 1 && newProgress > 1) {
          setCurrentDimensionIndex(prev => 
            prev < SHOWCASE_DIMENSIONS.length - 1 ? prev + 1 : prev
          );
        }
        
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, isComplete]);

  // ?? Navegación manual
  const handleNext = () => {
    if (currentDimensionIndex < SHOWCASE_DIMENSIONS.length - 1) {
      setCurrentDimensionIndex(prev => prev + 1);
      setProgress((currentDimensionIndex + 1) * 20);
    } else {
      setIsComplete(true);
      setProgress(100);
    }
  };

  const handleSkip = () => {
    setIsComplete(true);
    setProgress(100);
  };

  const navigate = useNavigate();

  const handleComplete = () => {
    // Context7 + Pensamiento Secuencial: Marcar showcase como completado
    localStorage.setItem('showcase_completed', 'true');
    
    if (onComplete) {
      // Usar callback si está disponible
      onComplete();
    } else {
      // Fallback: navegar directamente al dashboard
      navigate('/dashboard', { replace: true });
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center space-y-8 max-w-2xl mx-auto p-8"
        >
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <Sparkles className="w-24 h-24 text-yellow-400 mx-auto" />
          </motion.div>
          
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              ¡Bienvenido a SUPERPAES!
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Tu ecosistema neural de preparación PAES está listo. 
              Explora las 5 dimensiones y alcanza tu máximo potencial.
            </p>
          </div>
          
          <PremiumButton
            onClick={handleComplete}
            variant="gold"
            size="lg"
            className="cinematic-glow gradient-gold-premium cinematic-hover"
          >
            <ArrowRight className="w-6 h-6 mr-2" />
            Ingresar al Dashboard Neural
          </PremiumButton>
        </motion.div>
      </div>
    );
  }

  return (
    <CinematicBackground
      particleCount={100}
      particleColor="gold"
      className="min-h-screen relative overflow-hidden"
    >
      {/* ?? Fondo cinematográfico dinámico mejorado */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentDimension.color.primary} transition-all duration-1000`}>
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              `radial-gradient(ellipse at top, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.5) 100%)`,
              `radial-gradient(ellipse at bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.5) 100%)`,
              `radial-gradient(ellipse at top, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.5) 100%)`
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* ?? Sistema de partículas premium adicional */}
      <ParticleSystem
        count={30}
        color={currentDimension.color.glow}
        size="small"
        speed="slow"
        className="absolute inset-0 opacity-40"
      />

      {/* ?? Contenido principal */}
      <div className="relative z-showcase min-h-screen flex flex-col">
        
        {/* ?? Barra de progreso superior */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <PremiumButton
                variant="platinum"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </PremiumButton>
              <PremiumButton
                variant="platinum"
                size="sm"
                onClick={handleNext}
              >
                <SkipForward className="w-4 h-4" />
              </PremiumButton>
            </div>
            
            <PremiumButton
              variant="diamond"
              size="sm"
              onClick={handleSkip}
            >
              Saltar Intro
            </PremiumButton>
          </div>
          
          <Progress value={progress} className="h-2 bg-white/20" />
          <div className="text-white/70 text-sm mt-2 text-center">
            Dimensión {currentDimensionIndex + 1} de {SHOWCASE_DIMENSIONS.length}
          </div>
        </div>

        {/* ?? Contenido de la dimensión actual */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentDimension.id}
                initial={{ opacity: 0, scale: 0.9, rotateY: -20 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 1.1, rotateY: 20 }}
                transition={{ duration: 0.8 }}
                className="text-center space-y-8"
              >
                
                {/* ?? Ícono y título */}
                <div className="space-y-4">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                    className="flex justify-center"
                  >
                    <currentDimension.icon className="w-20 h-20 text-white" />
                  </motion.div>
                  
                  <div>
                    <h1 className="text-4xl md:text-6xl font-bold text-cinematic mb-2 text-premium-glow">
                      {currentDimension.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-white/80 mb-4 cinematic-hover">
                      {currentDimension.subtitle}
                    </p>
                    <p className="text-lg text-white/70 max-w-2xl mx-auto">
                      {currentDimension.description}
                    </p>
                  </div>
                </div>

                {/* ?? Componente visual de la dimensión */}
                <PremiumContainer
                  glow={true}
                  className="cinematic-entrance ultra-glass cinematic-hover"
                >
                  <div className="premium-particles"></div>
                  <VisualComponent />
                </PremiumContainer>

              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ?? Indicadores de dimensiones */}
        <div className="p-6">
          <div className="flex justify-center gap-3">
            {SHOWCASE_DIMENSIONS.map((dimension, index) => (
              <motion.div
                key={dimension.id}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentDimensionIndex 
                    ? 'bg-white scale-125' 
                    : 'bg-white/30'
                }`}
                animate={index === currentDimensionIndex ? {
                  scale: [1.25, 1.5, 1.25],
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
            ))}
          </div>
        </div>

      </div>
    </CinematicBackground>
  );
};


