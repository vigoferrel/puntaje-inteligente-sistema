
import React, { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGlobalCinematic } from '@/contexts/GlobalCinematicContext';
import { 
  Brain, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Star, 
  Award,
  Home,
  Activity
} from 'lucide-react';

interface NeuralRoute {
  path: string;
  name: string;
  icon: React.ComponentType<any>;
  priority: 'critical' | 'high' | 'medium';
  description: string;
}

const neuralRoutes: NeuralRoute[] = [
  {
    path: '/',
    name: 'Hub Neural',
    icon: Home,
    priority: 'critical',
    description: 'Centro de comando SuperPAES'
  },
  {
    path: '/lectoguia',
    name: 'LectoGuía IA',
    icon: BookOpen,
    priority: 'high',
    description: 'Asistente inteligente de lectura'
  },
  {
    path: '/diagnostic',
    name: 'Diagnóstico',
    icon: Target,
    priority: 'high',
    description: 'Evaluación adaptativa neural'
  },
  {
    path: '/planning',
    name: 'Planificador',
    icon: TrendingUp,
    priority: 'medium',
    description: 'Planes de estudio personalizados'
  },
  {
    path: '/universe',
    name: 'Universo 3D',
    icon: Star,
    priority: 'medium',
    description: 'Exploración visual inmersiva'
  },
  {
    path: '/achievements',
    name: 'Logros',
    icon: Award,
    priority: 'medium',
    description: 'Sistema de reconocimientos'
  }
];

export const NeuralNavigationOptimized: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { startTransition } = useGlobalCinematic();

  const currentRoute = location.pathname;

  const navigateWithNeuralTransition = useCallback(async (path: string) => {
    if (currentRoute === path) return;

    try {
      console.log(`🧠 Neural navigation: ${currentRoute} → ${path}`);
      await startTransition(path);
      navigate(path);
    } catch (error) {
      console.warn('Neural transition failed, using direct navigation:', error);
      navigate(path);
    }
  }, [currentRoute, startTransition, navigate]);

  const sortedRoutes = useMemo(() => {
    return neuralRoutes.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, []);

  return (
    <nav className="neural-navigation">
      <div className="flex flex-wrap gap-2">
        {sortedRoutes.map((route) => {
          const Icon = route.icon;
          const isActive = currentRoute === route.path;
          
          return (
            <motion.button
              key={route.path}
              onClick={() => navigateWithNeuralTransition(route.path)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                ${isActive 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-black/20 text-white/70 hover:bg-purple-600/50 hover:text-white'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{route.name}</span>
              {isActive && (
                <motion.div
                  className="w-2 h-2 bg-cyan-400 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
      
      {/* Neural Status Indicator */}
      <div className="mt-4 flex items-center gap-2 text-xs text-cyan-400">
        <Activity className="w-3 h-3 animate-pulse" />
        <span>Sistema Neural Activo</span>
        <Brain className="w-3 h-3" />
      </div>
    </nav>
  );
};
