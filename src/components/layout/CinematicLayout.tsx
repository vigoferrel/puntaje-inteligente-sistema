
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, BookOpen, Target, BarChart3, Brain, Gamepad2, 
  Settings, HelpCircle, Menu, X, Volume2, VolumeX 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { CinematicParticles } from './CinematicParticles';
import { CinematicAudioProvider, useCinematicAudio } from '@/components/cinematic/UniversalCinematicSystem';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
  color: string;
  description: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/',
    color: '#8b5cf6',
    description: 'Panel principal de progreso'
  },
  {
    id: 'matematica1',
    label: 'Matemática M1',
    icon: Target,
    path: '/materias/matematica-1',
    color: '#10b981',
    description: 'Álgebra y funciones'
  },
  {
    id: 'matematica2',
    label: 'Matemática M2',
    icon: BarChart3,
    path: '/materias/matematica-2',
    color: '#f59e0b',
    description: 'Geometría y probabilidad'
  },
  {
    id: 'lectura',
    label: 'Competencia Lectora',
    icon: BookOpen,
    path: '/materias/competencia-lectora',
    color: '#06b6d4',
    description: 'Comprensión y análisis'
  },
  {
    id: 'ciencias',
    label: 'Ciencias',
    icon: Brain,
    path: '/materias/ciencias',
    color: '#ec4899',
    description: 'Física, química y biología'
  },
  {
    id: 'historia',
    label: 'Historia',
    icon: Gamepad2,
    path: '/materias/historia',
    color: '#f97316',
    description: 'Historia y ciencias sociales'
  }
];

const CinematicSidebar: React.FC<{
  isOpen: boolean;
  onToggle: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}> = ({ isOpen, onToggle, currentPath, onNavigate }) => {
  const { user, profile } = useAuth();
  const { muted, toggleMute } = useCinematicAudio();

  return (
    <>
      {/* Overlay Premium */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Premium */}
      <motion.div
        initial={{ x: -320 }}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-full w-80 premium-glass border-r border-premium-violet-500/30 z-50 lg:translate-x-0 lg:static lg:z-auto premium-scanner"
      >
        {/* Header Premium */}
        <div className="p-6 border-b border-premium-violet-500/30 premium-header">
          <div className="flex items-center justify-between mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-12 h-12 bg-gradient-to-r from-premium-violet-500 to-emerald-premium-500 rounded-full flex items-center justify-center shadow-glow-violet"
            >
              <Brain className="w-6 h-6 text-white" />
            </motion.div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="lg:hidden text-white hover:bg-white/10 hover-glow"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-bold premium-text-glow">PAES Command</h2>
            <p className="text-emerald-premium-400 text-sm">{profile?.name || 'Estudiante'}</p>
            <Badge className="mt-2 premium-badge animate-glow-pulse">
              Sistema Activo
            </Badge>
          </motion.div>
        </div>

        {/* Navigation Premium */}
        <div className="flex-1 p-4 space-y-2 scrollbar-premium">
          <div className="text-xs font-medium text-premium-violet-400 uppercase tracking-wider mb-4 premium-gradient-text">
            Materias PAES
          </div>
          
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start h-auto p-4 premium-nav-item ${
                    isActive ? 'active' : ''
                  }`}
                  onClick={() => {
                    onNavigate(item.path);
                    onToggle();
                  }}
                >
                  <Icon 
                    className="w-5 h-5 mr-3 flex-shrink-0" 
                    style={{ color: item.color }} 
                  />
                  <div className="text-left flex-1">
                    <div className="font-medium text-sm text-white">{item.label}</div>
                    <div className="text-xs opacity-70 text-gray-300">{item.description}</div>
                  </div>
                  {isActive && (
                    <motion.div
                      className="w-2 h-2 bg-emerald-premium-400 rounded-full shadow-glow-emerald"
                      layoutId="activeIndicator"
                    />
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Premium */}
        <div className="p-4 border-t border-white/10 premium-header">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 premium-button"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Ayuda
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="text-white hover:bg-white/10 hover-emerald"
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export const CinematicLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <CinematicAudioProvider>
      <div className="min-h-screen premium-body relative overflow-hidden premium-particles">
        {/* Partículas de fondo premium */}
        <CinematicParticles />
        
        {/* Partículas premium adicionales */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="premium-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 2}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
        
        {/* Layout Principal */}
        <div className="flex h-screen relative z-10">
          {/* Sidebar */}
          <CinematicSidebar
            isOpen={sidebarOpen}
            onToggle={toggleSidebar}
            currentPath={location.pathname}
            onNavigate={handleNavigate}
          />

          {/* Contenido Principal */}
          <div className="flex-1 flex flex-col">
            {/* Header Móvil Premium */}
            <motion.header
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:hidden premium-header border-b border-premium-violet-500/30 p-4"
            >
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSidebar}
                  className="text-white hover:bg-white/10 hover-glow"
                >
                  <Menu className="w-5 h-5" />
                </Button>
                <h1 className="text-lg font-bold premium-text-glow">PAES Command</h1>
                <div className="w-10" />
              </div>
            </motion.header>

            {/* Contenido de la Página Premium */}
            <main className="flex-1 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, scale: 0.95, rotateY: -5 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 1.05, rotateY: 5 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  className="h-full"
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>
      </div>
    </CinematicAudioProvider>
  );
};
