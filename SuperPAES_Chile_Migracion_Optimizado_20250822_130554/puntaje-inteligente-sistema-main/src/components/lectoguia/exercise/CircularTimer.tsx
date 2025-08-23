/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../../../types/core';

import { motion } from 'framer-motion';
import { Clock, Zap } from 'lucide-react';

interface CircularTimerProps {
  timeElapsed: number;
  estimatedTime: number;
  isActive: boolean;
}

export const CircularTimer: FC<CircularTimerProps> = ({
  timeElapsed,
  estimatedTime,
  isActive
}) => {
  const progress = Math.min((timeElapsed / estimatedTime) * 100, 100);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return { mins, secs };
  };

  const { mins, secs } = formatTime(timeElapsed);
  const { mins: estMins, secs: estSecs } = formatTime(estimatedTime);

  const getTimerColor = () => {
    if (progress < 50) return 'text-green-400';
    if (progress < 80) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStrokeColor = () => {
    if (progress < 50) return '#10b981'; // green-500
    if (progress < 80) return '#f59e0b'; // yellow-500
    return '#ef4444'; // red-500
  };

  return (
    <div className="glass-morphism rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="h-5 w-5 text-primary" />
        <h4 className="font-semibold">CronÃ³metro</h4>
      </div>

      <div className="relative flex items-center justify-center">
        {/* SVG del cÃ­rculo de progreso */}
        <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 200 200">
          {/* CÃ­rculo de fondo */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-white/10"
          />
          
          {/* CÃ­rculo de progreso */}
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            stroke={getStrokeColor()}
            strokeWidth="8"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="dynamic-filter"
            data-filter="drop-shadow(0 0 8px currentColor)"
            data-opacity={0.9}
          />
        </svg>

        {/* Contenido central */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-2">
            {/* Tiempo transcurrido */}
            <motion.div
              key={`${mins}-${secs}`}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className={`text-3xl font-mono font-bold ${getTimerColor()}`}
            >
              {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
            </motion.div>
            
            {/* Tiempo estimado */}
            <div className="text-xs text-muted-foreground">
              de {estMins.toString().padStart(2, '0')}:{estSecs.toString().padStart(2, '0')}
            </div>

            {/* Indicador de actividad */}
            {isActive && (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center justify-center gap-1"
              >
                <div className="w-1 h-1 bg-primary rounded-full" />
                <div className="w-1 h-1 bg-primary rounded-full" />
                <div className="w-1 h-1 bg-primary rounded-full" />
              </motion.div>
            )}
          </div>
        </div>

        {/* PartÃ­culas orbitales */}
        {isActive && (
          <div className="absolute inset-0">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-primary rounded-full dynamic-particle"
                data-left="50%"
                data-top="50%"
                data-transform-origin={`0 ${radius + 20}px`}
                animate={{
                  rotate: 360
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.5
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* EstadÃ­sticas adicionales */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-lg font-bold text-primary">
            {Math.round(progress)}%
          </div>
          <div className="text-xs text-muted-foreground">Progreso</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Zap className="h-4 w-4 text-amber-400" />
            <span className="text-lg font-bold text-amber-400">
              {progress < 80 ? 'ðŸ’ª' : 'ðŸ”¥'}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">Estado</div>
        </div>
      </div>
    </div>
  );
};


