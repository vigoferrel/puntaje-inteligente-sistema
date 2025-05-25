
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { NeuralDimensionConfig, NeuralDimension } from '../config/neuralTypes';

interface DimensionCardProps {
  dimension: NeuralDimensionConfig;
  isActive: boolean;
  metrics: number;
  onActivate: (dimensionId: NeuralDimension) => void;
  index: number;
}

export const DimensionCard: React.FC<DimensionCardProps> = ({
  dimension,
  isActive,
  metrics,
  onActivate,
  index
}) => {
  const Icon = dimension.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card 
        className={`cursor-pointer transition-all duration-300 border-2 ${
          isActive 
            ? 'bg-white/20 border-white/40 shadow-xl scale-105' 
            : 'bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30'
        } backdrop-blur-sm`}
        onClick={() => onActivate(dimension.id)}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${dimension.color} group-hover:scale-110 transition-transform`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-white font-poppins">{metrics}%</div>
              <div className="text-xs text-white/60 font-poppins">Neural</div>
            </div>
          </div>
          
          <h4 className="text-lg font-bold text-white mb-2 font-poppins">{dimension.name}</h4>
          <p className="text-white/70 text-sm mb-4 font-poppins">{dimension.description}</p>
          
          <Button 
            className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20 font-poppins"
            onClick={(e) => {
              e.stopPropagation();
              onActivate(dimension.id);
            }}
          >
            <Play className="w-4 h-4 mr-2" />
            Activar Dimensión
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
