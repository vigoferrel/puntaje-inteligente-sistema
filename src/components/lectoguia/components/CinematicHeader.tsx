
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Target, 
  BarChart3, 
  BookOpen, 
  User,
  Home,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface CinematicHeaderProps {
  user: any;
  systemState: any;
  validationStatus: any;
  onNavigateToModule: (module: string) => void;
}

export const CinematicHeader: React.FC<CinematicHeaderProps> = ({
  user,
  systemState,
  validationStatus,
  onNavigateToModule
}) => {
  const navigate = useNavigate();

  const moduleButtons = [
    {
      id: 'chat',
      label: 'Chat IA',
      icon: Brain,
      description: 'Asistente inteligente'
    },
    {
      id: 'exercise',
      label: 'Ejercicios',
      icon: Target,
      description: 'Práctica adaptativa'
    },
    {
      id: 'plan',
      label: 'Mi Plan',
      icon: BookOpen,
      description: 'Plan de estudio'
    },
    {
      id: 'diagnostic',
      label: 'Diagnósticos',
      icon: BarChart3,
      description: 'Evaluaciones PAES'
    }
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/20 backdrop-blur-xl border-b border-white/10"
    >
      <div className="container mx-auto px-4 py-4">
        {/* Navegación superior */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/10"
            >
              <Home className="w-4 h-4 mr-2" />
              Inicio
            </Button>
            <ArrowRight className="w-4 h-4 text-white/50" />
            <span className="text-white font-medium">LectoGuía</span>
          </div>

          <div className="flex items-center gap-3">
            <Badge 
              variant={validationStatus.isValid ? "default" : "destructive"}
              className="text-xs"
            >
              {validationStatus.isValid ? 'Sistema OK' : 'Validando...'}
            </Badge>
            
            <div className="flex items-center gap-2 text-white">
              <User className="w-4 h-4" />
              <span className="text-sm">{user?.email}</span>
            </div>
          </div>
        </div>

        {/* Navegación de módulos */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {moduleButtons.map((module) => (
            <Button
              key={module.id}
              variant={systemState.activeModule === module.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onNavigateToModule(module.id)}
              className={`flex items-center gap-2 whitespace-nowrap transition-all ${
                systemState.activeModule === module.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <module.icon className="w-4 h-4" />
              <div className="text-left">
                <div className="text-sm font-medium">{module.label}</div>
                <div className="text-xs opacity-75">{module.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </motion.header>
  );
};
