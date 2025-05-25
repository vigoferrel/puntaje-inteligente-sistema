
import React, { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, Target, Calendar, DollarSign, 
  BookOpen, ClipboardList, ArrowLeft,
  Sparkles, Zap
} from 'lucide-react';

interface NavigationItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  gradient: string;
  badge?: string;
  isNew?: boolean;
}

interface IntelligentNavigationProps {
  currentTool: string;
  onNavigate: (tool: string) => void;
  canGoBack: boolean;
  onGoBack: () => void;
}

export const IntelligentNavigation: React.FC<IntelligentNavigationProps> = ({
  currentTool,
  onNavigate,
  canGoBack,
  onGoBack
}) => {
  const navigationItems: NavigationItem[] = useMemo(() => [
    {
      id: 'lectoguia',
      title: 'LectoGuía IA',
      description: 'Asistente inteligente de aprendizaje',
      icon: Brain,
      gradient: 'from-purple-500 to-pink-500',
      badge: 'Popular',
      isNew: false
    },
    {
      id: 'exercises',
      title: 'Ejercicios Adaptativos',
      description: 'Práctica personalizada PAES',
      icon: Target,
      gradient: 'from-blue-500 to-cyan-500',
      isNew: false
    },
    {
      id: 'diagnostic',
      title: 'Evaluación Diagnóstica',
      description: 'Mide tu nivel actual',
      icon: ClipboardList,
      gradient: 'from-green-500 to-emerald-500',
      isNew: false
    },
    {
      id: 'plan',
      title: 'Plan de Estudio',
      description: 'Organiza tu preparación',
      icon: BookOpen,
      gradient: 'from-orange-500 to-red-500',
      isNew: false
    },
    {
      id: 'calendar',
      title: 'Calendario Inteligente',
      description: 'Gestión de tiempo optimizada',
      icon: Calendar,
      gradient: 'from-indigo-500 to-purple-500',
      isNew: true
    },
    {
      id: 'financial',
      title: 'Centro Financiero',
      description: 'Calculadora de becas PAES',
      icon: DollarSign,
      gradient: 'from-emerald-500 to-teal-500',
      badge: 'Nuevo',
      isNew: true
    }
  ], []);

  const handleNavigation = useCallback((toolId: string) => {
    if (toolId !== currentTool) {
      onNavigate(toolId);
    }
  }, [currentTool, onNavigate]);

  return (
    <div className="space-y-6">
      {/* Header con botón de retroceso */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white poppins-title">
              Herramientas Inteligentes
            </h2>
            <p className="text-white/70 text-sm poppins-body">
              Elige tu próxima acción de aprendizaje
            </p>
          </div>
        </div>
        
        {canGoBack && (
          <Button
            onClick={onGoBack}
            variant="outline"
            size="sm"
            className="cinematic-button flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Atrás
          </Button>
        )}
      </div>

      {/* Grid de herramientas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentTool === item.id;
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => handleNavigation(item.id)}
                className={`h-auto p-6 w-full text-left relative overflow-hidden transition-all duration-300 ${
                  isActive 
                    ? `bg-gradient-to-r ${item.gradient} shadow-lg scale-105 border-2 border-white/30` 
                    : `bg-gradient-to-r ${item.gradient} hover:opacity-90`
                }`}
                disabled={isActive}
              >
                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <Icon className="w-8 h-8 text-white" />
                    <div className="flex gap-2">
                      {item.badge && (
                        <Badge className="bg-white/20 text-white border-white/30 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                      {item.isNew && (
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-yellow-400" />
                          <span className="text-xs text-yellow-400 font-medium">Nuevo</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-white text-lg poppins-subtitle mb-1">
                      {item.title}
                    </h3>
                    <p className="text-white/80 text-sm poppins-body">
                      {item.description}
                    </p>
                  </div>
                </div>
                
                {/* Efecto de brillo para herramienta activa */}
                {isActive && (
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />
                )}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
