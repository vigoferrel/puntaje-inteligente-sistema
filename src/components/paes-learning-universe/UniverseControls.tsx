
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  RotateCcw, 
  Filter, 
  Route,
  Settings,
  Zap
} from 'lucide-react';

interface UniverseControlsProps {
  viewMode: { mode: string; focus?: string };
  onViewModeChange: (mode: any) => void;
  showPathways: boolean;
  onShowPathwaysChange: (show: boolean) => void;
  filters: any;
  onFiltersChange: (filters: any) => void;
  onReset: () => void;
}

export const UniverseControls: React.FC<UniverseControlsProps> = ({
  viewMode,
  onViewModeChange,
  showPathways,
  onShowPathwaysChange,
  filters,
  onFiltersChange,
  onReset
}) => {
  const filterOptions = {
    tier: ['all', 'tier1_critico', 'tier2_importante', 'tier3_complementario'],
    difficulty: ['all', 'basic', 'intermediate', 'advanced'],
    status: ['all', 'not_started', 'in_progress', 'completed']
  };

  return (
    <>
      {/* Panel de Controles Compacto */}
      <motion.div 
        className="absolute top-20 right-4 pointer-events-auto"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Card className="w-64 bg-black/40 backdrop-blur-lg border-white/20">
          <CardContent className="p-3 space-y-3">
            {/* Control de Rutas */}
            <div>
              <h3 className="text-white font-medium mb-2 flex items-center text-sm">
                <Settings className="w-4 h-4 mr-2" />
                Controles de Vista
              </h3>
              <Button
                variant={showPathways ? "default" : "outline"}
                size="sm"
                className={`w-full justify-start ${
                  showPathways 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'border-white/30 text-white hover:bg-white/10'
                }`}
                onClick={() => onShowPathwaysChange(!showPathways)}
              >
                <Route className="w-4 h-4 mr-2" />
                Rutas de Aprendizaje
                {showPathways && (
                  <Badge className="ml-auto bg-white/20 text-white border-none text-xs">
                    ON
                  </Badge>
                )}
              </Button>
            </div>

            {/* Filtros Rápidos */}
            <div>
              <h3 className="text-white font-medium mb-2 flex items-center text-sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtros Rápidos
              </h3>
              <div className="space-y-2">
                {Object.entries(filterOptions).map(([filterType, options]) => (
                  <div key={filterType}>
                    <label className="text-white text-xs font-medium capitalize mb-1 block">
                      {filterType === 'tier' ? 'Nivel' : filterType === 'difficulty' ? 'Dificultad' : 'Estado'}
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {options.slice(0, 3).map((option) => (
                        <Button
                          key={option}
                          variant={filters[filterType] === option ? "default" : "outline"}
                          size="sm"
                          className={`text-xs px-2 py-1 h-auto ${
                            filters[filterType] === option
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'border-white/30 text-white hover:bg-white/10'
                          }`}
                          onClick={() => onFiltersChange({
                            ...filters,
                            [filterType]: option
                          })}
                        >
                          {option === 'all' ? 'Todos' : option.replace('_', ' ').slice(0, 8)}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reset */}
            <Button
              variant="outline"
              size="sm"
              className="w-full border-white/30 text-white hover:bg-white/10"
              onClick={onReset}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Resetear Vista
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Indicadores de Estado Compactos */}
      <motion.div 
        className="absolute bottom-4 right-4 pointer-events-auto"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-black/40 backdrop-blur-lg border-white/20">
          <CardContent className="p-3">
            <h3 className="text-white font-medium mb-2 flex items-center text-sm">
              <Zap className="w-4 h-4 mr-2" />
              Estado
            </h3>
            <div className="space-y-1 text-xs text-white">
              <div className="flex justify-between">
                <span className="opacity-80">Modo:</span>
                <Badge className="bg-blue-600 text-white border-none text-xs capitalize">
                  {viewMode.mode}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="opacity-80">Render:</span>
                <Badge className="bg-green-600 text-white border-none text-xs">
                  WebGL
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};
