
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Brain, 
  Target, 
  TrendingUp, 
  Activity,
  ArrowLeft 
} from 'lucide-react';
import { UniverseMode, Galaxy } from '@/types/universe-types';

interface UniverseNavigationProps {
  mode: UniverseMode;
  onModeChange: (mode: UniverseMode) => void;
  onReturnToOverview: () => void;
  galaxies: Galaxy[];
  selectedGalaxy: string | null;
  isTransitioning: boolean;
}

export const UniverseNavigation: React.FC<UniverseNavigationProps> = ({
  mode,
  onModeChange,
  onReturnToOverview,
  galaxies,
  selectedGalaxy,
  isTransitioning
}) => {
  const navigationItems = [
    { mode: 'overview' as UniverseMode, icon: Home, label: 'Vista General' },
    { mode: 'neural' as UniverseMode, icon: Brain, label: 'Centro Neural' },
    { mode: 'prediction' as UniverseMode, icon: Target, label: 'Predicción' },
    { mode: 'progress' as UniverseMode, icon: TrendingUp, label: 'Progreso' }
  ];

  return (
    <motion.div 
      className="absolute left-4 top-1/2 transform -translate-y-1/2 z-40 pointer-events-auto"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <Card className="bg-black/30 backdrop-blur-xl border-white/20 w-64">
        <CardContent className="p-4 space-y-3">
          {/* Header */}
          <div className="text-center">
            <h3 className="text-lg font-bold text-white mb-2">Navegación Universal</h3>
            {mode !== 'overview' && (
              <Button
                onClick={onReturnToOverview}
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white/10"
                disabled={isTransitioning}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Regresar
              </Button>
            )}
          </div>

          {/* Mode Navigation */}
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = mode === item.mode;
              
              return (
                <Button
                  key={item.mode}
                  onClick={() => onModeChange(item.mode)}
                  variant={isActive ? "default" : "outline"}
                  className={`w-full justify-start ${
                    isActive 
                      ? 'bg-cyan-600 hover:bg-cyan-700' 
                      : 'border-white/30 text-white hover:bg-white/10'
                  }`}
                  disabled={isTransitioning}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}
          </div>

          {/* Galaxy Status */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-white/80">Estado de Galaxias</h4>
            {galaxies.map((galaxy) => {
              const progress = (galaxy.completed / galaxy.nodes) * 100;
              const isSelected = selectedGalaxy === galaxy.id;
              
              return (
                <div
                  key={galaxy.id}
                  className={`p-2 rounded border ${
                    isSelected 
                      ? 'border-cyan-400 bg-cyan-500/20' 
                      : 'border-white/20 bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-xs font-medium">
                      {galaxy.name}
                    </span>
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                      style={{ borderColor: galaxy.color, color: galaxy.color }}
                    >
                      {Math.round(progress)}%
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1">
                    <div 
                      className="h-1 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${progress}%`,
                        backgroundColor: galaxy.color 
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* System Status */}
          <div className="pt-2 border-t border-white/20">
            <div className="flex items-center justify-center space-x-2">
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-xs">Sistema Neural Activo</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
