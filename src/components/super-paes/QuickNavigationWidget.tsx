
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { 
  Target, 
  BookOpen, 
  Calculator,
  Calendar,
  Award,
  ArrowRight,
  Zap
} from 'lucide-react';

interface QuickNavItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  route: string;
  gradient: string;
  priority: 'high' | 'medium' | 'low';
}

const navigationItems: QuickNavItem[] = [
  {
    id: 'diagnostic',
    title: 'Diagnóstico PAES',
    description: 'Evaluación de nivel actual',
    icon: Target,
    route: '/diagnostic',
    gradient: 'from-blue-500 to-cyan-500',
    priority: 'high'
  },
  {
    id: 'planning',
    title: 'Planificador',
    description: 'Plan de estudio personalizado',
    icon: BookOpen,
    route: '/planning',
    gradient: 'from-green-500 to-emerald-500',
    priority: 'high'
  },
  {
    id: 'financial',
    title: 'Centro Financiero',
    description: 'Becas y financiamiento',
    icon: Calculator,
    route: '/financial',
    gradient: 'from-yellow-500 to-orange-500',
    priority: 'medium'
  },
  {
    id: 'lectoguia',
    title: 'LectoGuía IA',
    description: 'Comprensión lectora con IA',
    icon: Award,
    route: '/lectoguia',
    gradient: 'from-pink-500 to-purple-500',
    priority: 'low'
  }
];

export const QuickNavigationWidget: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (route: string) => {
    navigate(route);
  };

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Herramientas PAES</h3>
            <p className="text-white/70 text-sm">Accede a tus recursos de preparación</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  onClick={() => handleNavigation(item.route)}
                  className={`
                    h-auto p-4 w-full flex items-center justify-between
                    bg-gradient-to-r ${item.gradient} hover:opacity-90
                    border border-white/20 transition-all duration-300
                    hover:scale-105 hover:shadow-lg
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-white" />
                    <div className="text-left">
                      <div className="text-white font-medium text-sm">
                        {item.title}
                      </div>
                      <div className="text-white/80 text-xs">
                        {item.description}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white" />
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/5 rounded-lg p-2">
              <div className="text-cyan-400 font-bold text-lg">85%</div>
              <div className="text-white/60 text-xs">Preparación</div>
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <div className="text-green-400 font-bold text-lg">12</div>
              <div className="text-white/60 text-xs">Días activos</div>
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <div className="text-yellow-400 font-bold text-lg">670</div>
              <div className="text-white/60 text-xs">Puntaje meta</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
