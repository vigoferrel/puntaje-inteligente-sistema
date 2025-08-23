/* eslint-disable react-refresh/only-export-components */

import React, { memo } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  previousValue?: string | number;
  icon: React.ComponentType<unknown>;
  color: string;
  index: number;
  description?: string;
}

export const OptimizedMetricsCard = memo<MetricsCardProps>(({ 
  title, 
  value, 
  previousValue,
  icon: Icon, 
  color, 
  index,
  description 
}) => {
  const getTrend = () => {
    if (previousValue === undefined) return null;
    
    const current = typeof value === 'string' ? parseFloat(value) : value;
    const previous = typeof previousValue === 'string' ? parseFloat(previousValue.toString()) : previousValue;
    
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'same';
  };

  const trend = getTrend();

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-400" />;
      case 'down': return <TrendingDown className="w-3 h-3 text-red-400" />;
      case 'same': return <Minus className="w-3 h-3 text-gray-400" />;
      default: return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'bg-green-600';
      case 'down': return 'bg-red-600';
      case 'same': return 'bg-gray-600';
      default: return 'bg-blue-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.1,
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white relative overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-white/80">
              {title}
            </CardTitle>
            <div className={`p-2 rounded-full bg-gradient-to-r ${color}`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold text-white">
                {value}
              </div>
              {description && (
                <p className="text-xs text-white/60 mt-1">
                  {description}
                </p>
              )}
            </div>
            
            {trend && (
              <Badge 
                variant="secondary"
                className={`${getTrendColor()} text-white border-0 flex items-center gap-1`}
              >
                {getTrendIcon()}
                <span className="text-xs">
                  {Math.abs(Number(value) - Number(previousValue)).toFixed(1)}
                </span>
              </Badge>
            )}
          </div>
        </CardContent>
        
        {/* Efecto de brillo sutil */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-0 transition-transform duration-1000" />
      </Card>
    </motion.div>
  );
});

OptimizedMetricsCard.displayName = 'OptimizedMetricsCard';

