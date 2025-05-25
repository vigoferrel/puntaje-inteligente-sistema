
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  RotateCcw, 
  Eye, 
  Filter, 
  Maximize2, 
  Route,
  Settings,
  Zap,
  Target
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
  const viewModes = [
    { 
      mode: 'galaxy', 
      label: 'Galaxia', 
      icon: Eye, 
      description: 'Vista panorámica completa' 
    },
    { 
      mode: 'constellation', 
      label: 'Constelación', 
      icon: Target, 
      description: 'Enfoque por prueba PAES' 
    },
    { 
      mode: 'pathway', 
      label: 'Rutas', 
      icon: Route, 
      description: 'Caminos de aprendizaje' 
    }
  ];

  const filterOptions = {
    tier: ['all', 'tier1_critico', 'tier2_importante', 'tier3_complementario'],
    difficulty: ['all', 'basic', 'intermediate', 'advanced'],
    status: ['all', 'not_started', 'in_progress', 'completed']
  };

  return (
    <>
      {/* Panel de Controles Principal */}
      <motion.div 
        className="absolute top-20 right-4 pointer-events-auto"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Card className="w-80 bg-black/40 backdrop-blur-lg border-white/20">
          <CardContent className="p-4 space-y-4">
            {/* Modos de Vista */}
            <div>
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                Modo de Vista
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {viewModes.map((mode) => (
                  <Button
                    key={mode.mode}
                    variant={viewMode.mode === mode.mode ? "default" : "outline"}
                    className={`justify-start h-auto p-3 ${
                      viewMode.mode === mode.mode 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'border-white/30 text-white hover:bg-white/10'
                    }`}
                    onClick={() => onViewModeChange({ mode: mode.mode })}
                  >
                    <mode.icon className="w-4 h-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">{mode.label}</div>
                      <div className="text-xs opacity-80">{mode.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Controles de Visualización */}
            <div>
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Visualización
              </h3>
              <div className="space-y-2">
                <Button
                  variant={showPathways ? "default" : "outline"}
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
                    <Badge className="ml-auto bg-white/20 text-white border-none">
                      ON
                    </Badge>
                  )}
                </Button>
              </div>
            </div>

            {/* Filtros */}
            <div>
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </h3>
              <div className="space-y-3">
                {Object.entries(filterOptions).map(([filterType, options]) => (
                  <div key={filterType}>
                    <label className="text-white text-sm font-medium capitalize mb-2 block">
                      {filterType === 'tier' ? 'Nivel' : filterType === 'difficulty' ? 'Dificultad' : 'Estado'}
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {options.map((option) => (
                        <Button
                          key={option}
                          variant={filters[filterType] === option ? "default" : "outline"}
                          size="sm"
                          className={`text-xs ${
                            filters[filterType] === option
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'border-white/30 text-white hover:bg-white/10'
                          }`}
                          onClick={() => onFiltersChange({
                            ...filters,
                            [filterType]: option
                          })}
                        >
                          {option === 'all' ? 'Todos' : option.replace('_', ' ')}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Acciones */}
            <div className="pt-2 border-t border-white/20">
              <Button
                variant="outline"
                className="w-full border-white/30 text-white hover:bg-white/10"
                onClick={onReset}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Resetear Vista
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Indicadores de Estado */}
      <motion.div 
        className="absolute bottom-20 right-4 pointer-events-auto"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-black/40 backdrop-blur-lg border-white/20">
          <CardContent className="p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Estado del Sistema
            </h3>
            <div className="space-y-2 text-sm text-white">
              <div className="flex justify-between">
                <span className="opacity-80">Nodos Cargados:</span>
                <span className="font-medium">277</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-80">Pruebas Activas:</span>
                <span className="font-medium">5</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-80">Renderizado:</span>
                <Badge className="bg-green-600 text-white border-none text-xs">
                  3D WebGL
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="opacity-80">Modo Vista:</span>
                <Badge className="bg-blue-600 text-white border-none text-xs capitalize">
                  {viewMode.mode}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};
