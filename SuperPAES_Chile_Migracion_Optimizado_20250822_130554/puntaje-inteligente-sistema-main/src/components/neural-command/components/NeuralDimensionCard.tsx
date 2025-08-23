/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './NeuralDimensionCard.css';
import { supabase } from '../../../integrations/supabase/leonardo-auth-client';

interface NeuralDimension {
  id: string;
  title: string;
  description: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  connections: string[];
}

interface NeuralDimensionCardProps {
  dimension: NeuralDimension;
  onClick: (dimensionId: string) => void;
  isActive: boolean;
}

export const NeuralDimensionCard: FC<NeuralDimensionCardProps> = ({
  dimension,
  onClick,
  isActive
}) => {
  const getTrendIcon = () => {
    switch (dimension.trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Minus;
    }
  };

  const getTrendClass = () => {
    switch (dimension.trend) {
      case 'up': return 'trend-up';
      case 'down': return 'trend-down';
      default: return 'trend-stable';
    }
  };

  const TrendIcon = getTrendIcon();
  const trendClass = getTrendClass();

  return (
    <motion.div
      onClick={() => onClick(dimension.id)}
      className={`neural-dimension-card ${isActive ? 'active' : 'inactive'}`}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Header */}
      <div className="card-header">
        <div className="header-left">
          <div className="icon-container">
            <dimension.icon className="dimension-icon" />
          </div>
          <div>
            <h3 className="dimension-title">{dimension.title}</h3>
          </div>
        </div>
        
        <div className="trend-container">
          <TrendIcon 
            className={`trend-icon ${trendClass}`}
          />
        </div>
      </div>

      {/* Valor principal */}
      <div className="value-section">
        <div className="dimension-value">
          {dimension.value.toFixed(1)}%
        </div>
        <div className="dimension-description">
          {dimension.description}
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="progress-section">
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${dimension.value}%` }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </div>
      </div>

      {/* Conexiones */}
      <div className="connections-section">
        <span className="connections-label">Conexiones:</span>
        <div className="connections-dots">
          {dimension.connections.slice(0, 3).map((connection, index) => (
            <div
              key={connection}
              className={`connection-dot ${isActive ? 'animated' : ''}`}
            />
          ))}
          {dimension.connections.length > 3 && (
            <span className="connections-overflow">+{dimension.connections.length - 3}</span>
          )}
        </div>
      </div>

      {/* Efecto de activaciÃ³n */}
      {isActive && (
        <motion.div
          className="activation-effect"
          animate={{
            background: [
              'linear-gradient(45deg, transparent, rgba(6, 182, 212, 0.1), transparent)',
              'linear-gradient(45deg, rgba(6, 182, 212, 0.05), transparent, rgba(6, 182, 212, 0.05))',
              'linear-gradient(45deg, transparent, rgba(6, 182, 212, 0.1), transparent)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* PartÃ­culas de actividad */}
      {isActive && (
        <div className="particles-container">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="activity-particle"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1.5, 0.5],
                y: [0, -10, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};


