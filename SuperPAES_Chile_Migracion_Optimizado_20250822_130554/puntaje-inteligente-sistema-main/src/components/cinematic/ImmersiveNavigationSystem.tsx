/* eslint-disable react-refresh/only-export-components */
import React, { useState } from 'react';
import '@/styles/CinematicAnimations.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Brain, GraduationCap, BarChart3, Settings, Compass } from 'lucide-react';
import { supabase } from '../../integrations/supabase/leonardo-auth-client';

interface ImmersiveNavigationSystemProps {
  currentModule: string;
  onNavigate: (module: string) => void;
  cinematicMode: boolean;
}

export const ImmersiveNavigationSystem: React.FC<ImmersiveNavigationSystemProps> = ({
  currentModule,
  onNavigate,
  cinematicMode
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedModule, setSelectedModule] = useState(currentModule);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationNodes = [
    {
      id: 'dashboard',
      path: '/',
      label: 'Centro Neural',
      icon: Home,
      color: '#8b5cf6',
      description: 'Dashboard principal',
      angle: 0
    },
    {
      id: 'unified',
      path: '/unified',
      label: 'Sistema Unificado',
      icon: Brain,
      color: '#06b6d4',
      description: 'Plataforma completa',
      angle: 72
    },
    {
      id: 'paes',
      path: '/paes',
      label: 'PAES Universe',
      icon: GraduationCap,
      color: '#10b981',
      description: 'Evaluaciones PAES',
      angle: 144
    },
    {
      id: 'analytics',
      path: '/analytics',
      label: 'Neural Analytics',
      icon: BarChart3,
      color: '#f59e0b',
      description: 'AnÃ¡lisis avanzado',
      angle: 216
    },
    {
      id: 'settings',
      path: '/settings',
      label: 'ConfiguraciÃ³n',
      icon: Settings,
      color: '#ef4444',
      description: 'Ajustes del sistema',
      angle: 288
    }
  ];

  const handleNavigation = (node: typeof navigationNodes[0]) => {
    setSelectedModule(node.id);
    onNavigate(node.id);
    navigate(node.path);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.div
      className="immersive-navigation fixed bottom-8 right-8 z-30"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Central Navigation Hub */}
      <div className="relative">
        {/* Central Control */}
        <motion.div
          className="navigation-center bg-black/60 backdrop-blur-xl rounded-full border border-white/20 p-4 cursor-pointer"
          animate={{
            scale: isHovered ? 1.1 : 1,
            boxShadow: isHovered 
              ? '0 0 40px rgba(139, 92, 246, 0.6)' 
              : '0 0 20px rgba(139, 92, 246, 0.3)'
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            animate={{ rotate: isHovered ? 180 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <Compass className="w-8 h-8 text-white" />
          </motion.div>
        </motion.div>

        {/* Navigation Nodes */}
        <AnimatePresence>
          {isHovered && (
            <div className="navigation-nodes absolute inset-0">
              {navigationNodes.map((node, index) => {
                const radius = 120;
                const angleRad = (node.angle * Math.PI) / 180;
                const x = Math.cos(angleRad) * radius;
                const y = Math.sin(angleRad) * radius;

                return (
                  <motion.button
                    key={node.id}
                    className="navigation-node absolute dynamic-position"
                    data-x="50%"
                    data-y="50%"
                    initial={{ 
                      x: 0, 
                      y: 0, 
                      opacity: 0, 
                      scale: 0 
                    }}
                    animate={{ 
                      x, 
                      y, 
                      opacity: 1, 
                      scale: 1 
                    }}
                    exit={{ 
                      x: 0, 
                      y: 0, 
                      opacity: 0, 
                      scale: 0 
                    }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 200
                    }}
                    onClick={() => handleNavigation(node)}
                    whileHover={{ scale: 1.2, z: 10 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <div 
                      className={`relative bg-black/80 backdrop-blur-md rounded-2xl border p-4 min-w-[140px] dynamic-node-shadow ${
                        isActive(node.path) 
                          ? 'border-white/40 bg-white/10' 
                          : 'border-white/20'
                      }`}
                      data-color={node.color}
                      data-active={isActive(node.path)}
                    >
                      {/* Node Icon */}
                      <div className="flex items-center justify-center mb-2">
                        <div 
                          className="p-2 rounded-xl dynamic-bg-opacity" 
                          data-bg={node.color} 
                          data-opacity="20"
                        >
                          <node.icon 
                            className="w-5 h-5 dynamic-color" 
                            data-color={node.color}
                          />
                        </div>
                      </div>

                      {/* Node Info */}
                      <div className="text-center">
                        <div className="text-white font-semibold text-sm mb-1">
                          {node.label}
                        </div>
                        <div className="text-white/60 text-xs">
                          {node.description}
                        </div>
                      </div>

                      {/* Active Indicator */}
                      {isActive(node.path) && (
                        <motion.div
                          className="absolute inset-0 rounded-2xl dynamic-gradient-bg"
                          data-color={node.color}
                          animate={{
                            opacity: [0.2, 0.4, 0.2]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}

                      {/* Connection Line */}
                      <motion.div
                        className="absolute top-1/2 left-1/2 dynamic-connection-line"
                        data-color={node.color}
                        data-radius={radius}
                        data-angle={node.angle}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </AnimatePresence>

        {/* Orbital Rings */}
        <div className="orbital-rings absolute inset-0 pointer-events-none">
          {[60, 100, 140].map((radius, i) => (
            <motion.div
              key={radius}
              className="absolute border border-white/10 rounded-full dynamic-orbital-ring"
              data-radius={radius}
              animate={{
                rotate: 360,
                opacity: isHovered ? 0.3 : 0.1
              }}
              transition={{
                rotate: { duration: 20 + i * 10, repeat: Infinity, ease: "linear" },
                opacity: { duration: 0.3 }
              }}
            />
          ))}
        </div>

        {/* Navigation Particles */}
        {isHovered && (
          <div className="navigation-particles absolute inset-0 pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full dynamic-particle"
                data-index={i}
                animate={{
                  x: Math.cos((i * 30) * Math.PI / 180) * (80 + Math.sin(Date.now() / 1000 + i) * 20),
                  y: Math.sin((i * 30) * Math.PI / 180) * (80 + Math.sin(Date.now() / 1000 + i) * 20),
                  opacity: [0.3, 1, 0.3],
                  scale: [0.5, 1.5, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};


