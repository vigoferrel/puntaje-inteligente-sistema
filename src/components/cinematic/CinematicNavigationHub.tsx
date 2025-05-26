
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Brain, 
  GraduationCap, 
  Target, 
  BookOpen, 
  BarChart3,
  Settings,
  Maximize2,
  Minimize2
} from 'lucide-react';

export const CinematicNavigationHub: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { 
      path: '/', 
      icon: Home, 
      label: 'Inicio', 
      color: 'from-blue-500 to-cyan-500',
      description: 'Dashboard principal'
    },
    { 
      path: '/unified', 
      icon: Brain, 
      label: 'Sistema Unificado', 
      color: 'from-purple-500 to-pink-500',
      description: 'Plataforma IA completa'
    },
    { 
      path: '/paes', 
      icon: GraduationCap, 
      label: 'PAES Dashboard', 
      color: 'from-green-500 to-emerald-500',
      description: 'Métricas y progreso'
    },
    { 
      path: '/neural-command', 
      icon: Target, 
      label: 'Comando Neural', 
      color: 'from-red-500 to-orange-500',
      description: 'Centro de control'
    },
    { 
      path: '/lectoguia', 
      icon: BookOpen, 
      label: 'LectoGuía IA', 
      color: 'from-indigo-500 to-purple-500',
      description: 'Asistente de lectura'
    },
    { 
      path: '/analytics', 
      icon: BarChart3, 
      label: 'Analytics', 
      color: 'from-yellow-500 to-orange-500',
      description: 'Análisis avanzado'
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.div
      className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <div className="relative">
        {/* Hub principal */}
        <motion.div
          className="bg-black/60 backdrop-blur-md rounded-2xl border border-white/20 p-2"
          animate={{ 
            scale: isExpanded ? 1.05 : 1,
            borderColor: isExpanded ? 'rgba(139, 92, 246, 0.5)' : 'rgba(255, 255, 255, 0.2)'
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Botón de expansión */}
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-12 h-12 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl flex items-center justify-center mb-2 group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isExpanded ? (
              <Minimize2 className="w-5 h-5 text-white" />
            ) : (
              <Maximize2 className="w-5 h-5 text-white" />
            )}
          </motion.button>

          {/* Navegación compacta */}
          {!isExpanded && (
            <div className="space-y-2">
              {navigationItems.slice(0, 4).map((item, index) => (
                <motion.button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isActive(item.path)
                      ? `bg-gradient-to-r ${item.color} shadow-lg`
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <item.icon className={`w-5 h-5 ${
                    isActive(item.path) ? 'text-white' : 'text-white/70'
                  }`} />
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Panel expandido */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="absolute left-16 top-0 bg-black/80 backdrop-blur-md rounded-2xl border border-white/20 p-4 min-w-[280px]"
              initial={{ opacity: 0, x: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Centro de Navegación
              </h3>

              <div className="space-y-3">
                {navigationItems.map((item, index) => (
                  <motion.button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsExpanded(false);
                    }}
                    className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all duration-300 group ${
                      isActive(item.path)
                        ? `bg-gradient-to-r ${item.color} text-white`
                        : 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`p-2 rounded-lg ${
                      isActive(item.path) 
                        ? 'bg-white/20' 
                        : 'bg-white/10 group-hover:bg-white/20'
                    }`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-sm">{item.label}</div>
                      <div className="text-xs opacity-70">{item.description}</div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Configuración */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <motion.button
                  className="w-full p-2 rounded-xl bg-white/5 hover:bg-white/10 flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Configuración</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
