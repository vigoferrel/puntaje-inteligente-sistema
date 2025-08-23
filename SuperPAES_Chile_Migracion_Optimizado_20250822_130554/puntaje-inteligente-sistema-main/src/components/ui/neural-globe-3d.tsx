/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../integrations/supabase/leonardo-auth-client';

interface NeuralGlobeProps {
  className?: string;
  size?: number;
  data?: Array<{ lat: number; lng: number; value: number; label: string }>;
}

export const NeuralGlobe3D: React.FC<NeuralGlobeProps> = ({ 
  className = "", 
  size = 300,
  data = []
}) => {
  const globeRadius = size / 2;
  
  // Generate mock global data points
  const globalDataPoints = data.length > 0 ? data : [
    { lat: 40.7128, lng: -74.0060, value: 89, label: "New York" },
    { lat: 51.5074, lng: -0.1278, value: 76, label: "London" },
    { lat: 35.6762, lng: 139.6503, value: 94, label: "Tokyo" },
    { lat: -33.8688, lng: 151.2093, value: 82, label: "Sydney" },
    { lat: 37.7749, lng: -122.4194, value: 91, label: "San Francisco" },
    { lat: -23.5505, lng: -46.6333, value: 67, label: "SÃ£o Paulo" },
  ];

  // Convert lat/lng to 3D coordinates
  const latLngTo3D = (lat: number, lng: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    return {
      x: -(radius * Math.sin(phi) * Math.cos(theta)),
      y: radius * Math.cos(phi),
      z: radius * Math.sin(phi) * Math.sin(theta)
    };
  };

  return (
    <div className={`relative dynamic-dimensions ${className}`} data-width={size} data-height={size}>
      {/* Holographic globe container */}
      <motion.div
        className="relative w-full h-full dynamic-style"
        animate={{ rotateY: [0, 360] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        data-transform-style="preserve-3d"
      >
        {/* Globe base */}
        <div
          className="absolute inset-0 rounded-full dynamic-globe-base"
          data-bg-gradient="radial-gradient(circle at 30% 30%, rgba(6, 182, 212, 0.8) 0%, rgba(6, 182, 212, 0.4) 30%, rgba(6, 182, 212, 0.1) 70%, transparent 100%)"
          data-box-shadow="0 0 50px rgba(6, 182, 212, 0.3), inset 0 0 50px rgba(6, 182, 212, 0.1), 0 0 100px rgba(147, 51, 234, 0.2)"
          data-border="1px solid rgba(6, 182, 212, 0.3)"
        />

        {/* Grid lines */}
        <svg
          className="absolute inset-0 w-full h-full dynamic-style"
          viewBox={`0 0 ${size} ${size}`}
          data-overflow="visible"
        >
          {/* Longitude lines */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30) * (Math.PI / 180);
            const x1 = size/2 + (globeRadius - 10) * Math.cos(angle);
            const y1 = size/2 + (globeRadius - 10) * Math.sin(angle);
            const x2 = size/2 + (globeRadius - 10) * Math.cos(angle + Math.PI);
            const y2 = size/2 + (globeRadius - 10) * Math.sin(angle + Math.PI);
            
            return (
              <motion.line
                key={`long-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(6, 182, 212, 0.3)"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: i * 0.1, duration: 2 }}
              />
            );
          })}

          {/* Latitude lines */}
          {Array.from({ length: 6 }).map((_, i) => {
            const radius = (globeRadius - 20) * Math.cos((i * 30 - 60) * (Math.PI / 180));
            const cy = size/2 + (globeRadius - 20) * Math.sin((i * 30 - 60) * (Math.PI / 180));
            
            return (
              <motion.circle
                key={`lat-${i}`}
                cx={size/2}
                cy={cy}
                r={Math.abs(radius)}
                fill="none"
                stroke="rgba(6, 182, 212, 0.3)"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: i * 0.2, duration: 2 }}
              />
            );
          })}
        </svg>

        {/* Data points */}
        {globalDataPoints.map((point, index) => {
          const pos3D = latLngTo3D(point.lat, point.lng, globeRadius - 5);
          const isVisible = pos3D.z > 0; // Simple visibility check
          
          return (
            <motion.div
              key={index}
              className="absolute dynamic-position"
              data-left={size/2 + pos3D.x}
              data-top={size/2 - pos3D.y}
              data-transform={`translate(-50%, -50%) translateZ(${pos3D.z}px)`}
              data-z-index={Math.round(pos3D.z)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: isVisible ? 1 : 0.3,
                opacity: isVisible ? 1 : 0.3
              }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
            >
              {/* Data point */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.5 }}
              >
                {/* Pulsing core */}
                <motion.div
                  className="w-3 h-3 rounded-full bg-cyan-400 dynamic-shadow"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.7, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3
                  }}
                  data-shadow="0 0 10px rgba(6, 182, 212, 0.8)"
                />

                {/* Value indicator */}
                <div
                  className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-cyan-300 font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity dynamic-text-shadow"
                  data-text-shadow="0 0 5px rgba(6, 182, 212, 0.8)"
                >
                  {point.label}: {point.value}%
                </div>

                {/* Ripple effect */}
                <motion.div
                  className="absolute inset-0 rounded-full border border-cyan-400"
                  animate={{ 
                    scale: [1, 3],
                    opacity: [0.8, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    delay: index * 0.5
                  }}
                />
              </motion.div>
            </motion.div>
          );
        })}

        {/* Neural connections */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none dynamic-style"
          viewBox={`0 0 ${size} ${size}`}
          data-overflow="visible"
        >
          {globalDataPoints.map((point, i) => {
            const nextPoint = globalDataPoints[(i + 1) % globalDataPoints.length];
            const pos1 = latLngTo3D(point.lat, point.lng, globeRadius - 5);
            const pos2 = latLngTo3D(nextPoint.lat, nextPoint.lng, globeRadius - 5);
            
            return (
              <motion.line
                key={`connection-${i}`}
                x1={size/2 + pos1.x}
                y1={size/2 - pos1.y}
                x2={size/2 + pos2.x}
                y2={size/2 - pos2.y}
                stroke="rgba(147, 51, 234, 0.4)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: [0, 1, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.5
                }}
                className="dynamic-filter"
                data-filter="drop-shadow(0 0 3px rgba(147, 51, 234, 0.6))"
              />
            );
          })}
        </svg>

        {/* Atmospheric glow */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none dynamic-glow"
          data-bg-gradient="radial-gradient(circle, transparent 60%, rgba(6, 182, 212, 0.1) 70%, rgba(6, 182, 212, 0.3) 85%, transparent 100%)"
          data-transform="scale(1.1)"
        />
      </motion.div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full dynamic-particle"
            data-left={`${Math.random() * 100}%`}
            data-top={`${Math.random() * 100}%`}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
    </div>
  );
};



