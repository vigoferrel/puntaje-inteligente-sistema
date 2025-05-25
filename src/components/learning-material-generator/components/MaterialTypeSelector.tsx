
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MaterialType } from '../types/learning-material-types';
import { MATERIAL_TYPE_CONFIG } from '../utils/phase-material-mapping';
import { Clock, Sparkles } from 'lucide-react';

interface MaterialTypeSelectorProps {
  selectedType: MaterialType;
  onTypeChange: (type: MaterialType) => void;
  recommendedTypes: MaterialType[];
  count: number;
}

export const MaterialTypeSelector: React.FC<MaterialTypeSelectorProps> = ({
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

  const getEstimatedTime = (type: MaterialType) => {
    return MATERIAL_TYPE_CONFIG[type].estimatedTimePerItem * count;
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
