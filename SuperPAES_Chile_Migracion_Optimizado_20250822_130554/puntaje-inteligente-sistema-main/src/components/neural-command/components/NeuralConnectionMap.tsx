/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion } from 'framer-motion';
import { Network, Zap, Database, ArrowRight } from 'lucide-react';
import './NeuralConnectionMap.css';
import { supabase } from '../../../integrations/supabase/leonardo-auth-client';

interface NeuralConnection {
  id: string;
  from: string;
  to: string;
  strength: number;
  active: boolean;
  type: 'data' | 'neural' | 'feedback';
}

interface NeuralConnectionMapProps {
  connections: NeuralConnection[];
  activeModules: string[];
}

export const NeuralConnectionMap: FC<NeuralConnectionMapProps> = ({
  connections,
  activeModules
}) => {
  const getConnectionColor = (type: string, active: boolean) => {
    const colors = {
      data: active ? '#4ECDC4' : '#4ECDC440',
      neural: active ? '#9B59B6' : '#9B59B640',
      feedback: active ? '#E74C3C' : '#E74C3C40'
    };
    return colors[type as keyof typeof colors] || colors.data;
  };

  const getConnectionIcon = (type: string) => {
    switch (type) {
      case 'data': return Database;
      case 'neural': return Network;
      case 'feedback': return Zap;
      default: return Network;
    }
  };

  return (
    <div className="neural-connection-map">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="map-container"
      >
        {/* Header */}
        <div className="map-header">
          <h2 className="map-title">
            Mapa de Conexiones Neurales
          </h2>
          <p className="map-description">
            VisualizaciÃ³n en tiempo real de las conexiones entre dimensiones neurales
          </p>
        </div>

        {/* EstadÃ­sticas de conexiones */}
        <div className="stats-grid">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="stat-card total"
          >
            <div className="stat-header">
              <Network className="stat-icon total" />
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-value total">
              {connections.length}
            </div>
            <div className="stat-unit">Conexiones</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="stat-card active"
          >
            <div className="stat-header">
              <Zap className="stat-icon active" />
              <span className="stat-label">Activas</span>
            </div>
            <div className="stat-value active">
              {connections.filter(c => c.active).length}
            </div>
            <div className="stat-unit">En tiempo real</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="stat-card modules"
          >
            <div className="stat-header">
              <Database className="stat-icon modules" />
              <span className="stat-label">MÃ³dulos</span>
            </div>
            <div className="stat-value modules">
              {activeModules.length}
            </div>
            <div className="stat-unit">Operativos</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="stat-card flow"
          >
            <div className="stat-header">
              <ArrowRight className="stat-icon flow" />
              <span className="stat-label">Flujo</span>
            </div>
            <div className="stat-value flow">
              {Math.round(connections.reduce((sum, c) => sum + c.strength, 0) / connections.length * 100)}%
            </div>
            <div className="stat-unit">Intensidad</div>
          </motion.div>
        </div>

        {/* Mapa de conexiones */}
        <div className="connection-map-container">
          <div className="map-content">
            {/* Grid de fondo */}
            <div className="grid-background">
              <div className="grid-container">
                {Array.from({ length: 96 }).map((_, i) => (
                  <div key={i} className="grid-cell" />
                ))}
              </div>
            </div>

            {/* Conexiones visuales */}
            <svg className="connections-svg">
              {connections.map((connection, index) => {
                const startX = (index % 6) * 60 + 50;
                const startY = Math.floor(index / 6) * 80 + 50;
                const endX = ((index + 1) % 6) * 60 + 50;
                const endY = Math.floor((index + 1) / 6) * 80 + 50;
                const color = getConnectionColor(connection.type, connection.active);

                return (
                  <motion.g key={connection.id}>
                    <motion.line
                      x1={startX}
                      y1={startY}
                      x2={endX}
                      y2={endY}
                      stroke={color}
                      strokeWidth={connection.active ? 3 : 1}
                      strokeDasharray={connection.active ? "0" : "5,5"}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: index * 0.1 }}
                    />
                    
                    {connection.active && (
                      <motion.circle
                        r="3"
                        fill={color}
                        animate={{
                          cx: [startX, endX, startX],
                          cy: [startY, endY, startY]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                    )}
                  </motion.g>
                );
              })}
            </svg>

            {/* Nodos de conexiÃ³n */}
            {Array.from({ length: 12 }).map((_, index) => {
              const x = (index % 6) * 60 + 50;
              const y = Math.floor(index / 6) * 80 + 50;
              const isActive = Math.random() > 0.3;

              return (
                <motion.div
                  key={index}
                  className="connection-node"
                  className="dynamic-position" data-x={x - 15,
                    top: y - 15
                  }
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`node-circle ${isActive ? 'active' : 'inactive'}`}>
                    <motion.div
                      className={`node-dot ${isActive ? 'active' : 'inactive'}`}
                      animate={isActive ? {
                        scale: [1, 1.5, 1],
                        opacity: [0.7, 1, 0.7]
                      } : {}}
                      transition={{
                        duration: 2,
                        repeat: Infinity
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Leyenda */}
        <div className="legend-container">
          {[
            { type: 'data', label: 'Datos', icon: Database, colorClass: 'data' },
            { type: 'neural', label: 'Neural', icon: Network, colorClass: 'neural' },
            { type: 'feedback', label: 'Feedback', icon: Zap, colorClass: 'feedback' }
          ].map(({ type, label, icon: Icon, colorClass }) => (
            <div key={type} className="legend-item">
              <Icon className={`legend-icon ${colorClass}`} />
              <span className="legend-label">{label}</span>
              <div className={`legend-line ${colorClass}`} />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};



