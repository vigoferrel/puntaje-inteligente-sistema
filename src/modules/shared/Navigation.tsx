
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home,
  BookOpen,
  Calculator,
  FlaskConical,
  Target,
  Scroll,
  Trophy,
  Zap,
  DollarSign,
  Database
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const routes = [
    { path: '/', name: 'Hub', icon: Home },
    { path: '/lectoguia', name: 'Lectura', icon: BookOpen },
    { path: '/mathematics', name: 'Matemática', icon: Calculator },
    { path: '/sciences', name: 'Ciencias', icon: FlaskConical },
    { path: '/history', name: 'Historia', icon: Scroll },
    { path: '/diagnostic', name: 'Diagnóstico', icon: Target },
    { path: '/evaluations', name: 'Evaluaciones', icon: Database },
    { path: '/exercise-generator', name: 'Generador', icon: Zap },
    { path: '/gamification', name: 'Logros', icon: Trophy },
    { path: '/financial', name: 'Financiero', icon: DollarSign },
  ];

  const handleNavigation = (path: string) => {
    console.log(`🧭 Navegación desde barra: ${path}`);
    navigate(path);
  };

  return (
    <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
      <div className="bg-black/80 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20 pointer-events-auto">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide max-w-[90vw]">
          {routes.map((route) => {
            const Icon = route.icon;
            const isActive = location.pathname === route.path;
            
            return (
              <motion.div 
                key={route.path} 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
              >
                <Button
                  onClick={() => handleNavigation(route.path)}
                  variant="ghost"
                  size="sm"
                  className={`
                    relative px-2 py-2 rounded-full transition-colors min-w-0 flex-shrink-0
                    ${isActive 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                    }
                  `}
                  title={route.name}
                >
                  <Icon className="w-4 h-4" />
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full"
                      initial={false}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
