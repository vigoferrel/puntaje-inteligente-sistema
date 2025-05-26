
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LucideIcon } from 'lucide-react';

interface NeuralDimensionCardProps {
  dimension: {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
    value: number;
    trend: 'up' | 'down' | 'stable';
    category: string;
  };
  onClick: (dimensionId: string) => void;
  isActive?: boolean;
}

export const NeuralDimensionCard: React.FC<NeuralDimensionCardProps> = ({
  dimension,
  onClick,
  isActive = false
}) => {
  const Icon = dimension.icon;
  
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTrendSymbol = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      default: return '➡️';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`cursor-pointer ${isActive ? 'ring-2 ring-cyan-400' : ''}`}
      onClick={() => onClick(dimension.id)}
    >
      <Card className="bg-black/40 backdrop-blur-xl border-white/20 hover:border-white/40 transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${dimension.color}`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-right">
              <div className={`text-sm font-medium ${getTrendColor(dimension.trend)}`}>
                {getTrendSymbol(dimension.trend)} {dimension.value}%
              </div>
              <Badge variant="outline" className="text-xs mt-1">
                {dimension.category}
              </Badge>
            </div>
          </div>
          
          <h4 className="text-white font-medium text-sm mb-1">{dimension.title}</h4>
          <p className="text-gray-400 text-xs mb-3 line-clamp-2">{dimension.description}</p>
          
          <Progress value={dimension.value} className="h-1.5 mb-2" />
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>Neural Activity</span>
            <span>{dimension.value}%</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
