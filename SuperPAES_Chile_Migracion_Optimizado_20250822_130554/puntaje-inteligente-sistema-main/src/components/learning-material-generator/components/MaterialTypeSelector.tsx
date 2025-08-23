/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { MaterialType } from '../types/learning-material-types';
import { MATERIAL_TYPE_CONFIG } from '../utils/phase-material-mapping';
import { Clock, Sparkles, AlertCircle } from 'lucide-react';

interface MaterialTypeSelectorProps {
  selectedType: MaterialType;
  onTypeChange: (type: MaterialType) => void;
  recommendedTypes: MaterialType[];
  count: number;
}

export const MaterialTypeSelector: FC<MaterialTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
  recommendedTypes,
  count
}) => {
  const allTypes: MaterialType[] = [
    'exercises',
    'study_content', 
    'diagnostic_tests',
    'practice_guides',
    'simulations'
  ];

  // Validar que MATERIAL_TYPE_CONFIG estÃ© disponible
  if (!MATERIAL_TYPE_CONFIG || typeof MATERIAL_TYPE_CONFIG !== 'object') {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error al cargar los tipos de material. Por favor, recarga la pÃ¡gina.
        </AlertDescription>
      </Alert>
    );
  }

  const getEstimatedTime = (type: MaterialType) => {
    const config = MATERIAL_TYPE_CONFIG[type];
    if (!config) {
      console.warn('ConfiguraciÃ³n no encontrada para tipo de material:', type);
      return count * 3; // fallback por defecto
    }
    return config.estimatedTimePerItem * count;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-primary" />
        <h3 className="font-semibold">Tipo de Material a Generar</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {allTypes.map((type) => {
          const config = MATERIAL_TYPE_CONFIG[type];
          
          // ValidaciÃ³n por tipo individual
          if (!config) {
            console.warn('ConfiguraciÃ³n no encontrada para tipo:', type);
            return null;
          }
          
          const isSelected = selectedType === type;
          const isRecommended = recommendedTypes.includes(type);
          
          return (
            <Card
              key={type}
              className={`cursor-pointer transition-all ${
                isSelected 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => onTypeChange(type)}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{config.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{config.name}</h4>
                        {isRecommended && (
                          <Badge variant="default" className="text-xs">
                            Recomendado
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{config.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{getEstimatedTime(type)}min</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

