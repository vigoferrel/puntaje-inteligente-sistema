/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../integrations/supabase/leonardo-auth-client';

interface AudioWaveVisualizerProps {
  isPlaying?: boolean;
  intensity?: number;
  neuralActivity?: number;
  className?: string;
}

export const AudioWaveVisualizer: React.FC<AudioWaveVisualizerProps> = ({
  isPlaying = false,
  intensity = 0.5,
  neuralActivity = 75,
  className = ''
}) => {
  const [waveData, setWaveData] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      // Generar datos de onda basados en actividad neural
      intervalRef.current = setInterval(() => {
        const newWaveData = Array.from({ length: 7 }, (_, i) => {
          const baseHeight = 20 + (neuralActivity / 100) * 30;
          const variation = Math.sin(Date.now() / 200 + i * 0.5) * intensity * 15;
          return Math.max(4, baseHeight + variation);
        });
        setWaveData(newWaveData);
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // AnimaciÃ³n de parada gradual
      setWaveData(prev => prev.map(height => Math.max(4, height * 0.9)));
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, intensity, neuralActivity]);

  return (
    <div className={`audio-wave-container ${className}`}>
      {waveData.map((height, index) => (
        <motion.div
          key={index}
          className="audio-wave-bar"
          animate={{
            height: `${height}px`,
            scaleY: isPlaying ? [1, 1.2, 1] : 0.3
          }}
          transition={{
            duration: 0.3,
            repeat: isPlaying ? Infinity : 0,
            repeatType: "reverse",
            delay: index * 0.1
          }}
          style={{
            background: `linear-gradient(to top, 
              hsl(${120 + (neuralActivity / 100) * 60}, 70%, 50%), 
              hsl(${140 + (neuralActivity / 100) * 40}, 80%, 60%))`
          }}
        />
      ))}
    </div>
  );
};

interface NeuralParticleSystemProps {
  isActive?: boolean;
  neuralMetrics?: {
    coherencia: number;
    velocidadAprendizaje: number;
    prediccionPAES: number;
  };
  className?: string;
}

export const NeuralParticleSystem: React.FC<NeuralParticleSystemProps> = ({
  isActive = true,
  neuralMetrics = { coherencia: 95, velocidadAprendizaje: 88, prediccionPAES: 750 },
  className = ''
}) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    speed: number;
  }>>([]);

  useEffect(() => {
    if (!isActive) return;

    // Generar partÃ­culas basadas en mÃ©tricas neurales
    const particleCount = Math.floor((neuralMetrics.coherencia / 100) * 20) + 10;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      color: `hsl(${120 + (neuralMetrics.velocidadAprendizaje / 100) * 120}, 70%, 60%)`,
      speed: (neuralMetrics.velocidadAprendizaje / 100) * 2 + 0.5
    }));

    setParticles(newParticles);
  }, [isActive, neuralMetrics]);

  if (!isActive) return null;

  return (
    <div className={`neural-particles ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="neural-particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `radial-gradient(circle, ${particle.color} 0%, transparent 70%)`
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, Math.sin(particle.id) * 10, 0],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{
            duration: particle.speed * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.id * 0.2
          }}
        />
      ))}
    </div>
  );
};

interface SpotifyProgressBarProps {
  progress: number;
  duration: string;
  isPlaying?: boolean;
  neuralActivity?: number;
  onSeek?: (position: number) => void;
}

export const SpotifyProgressBar: React.FC<SpotifyProgressBarProps> = ({
  progress,
  duration,
  isPlaying = false,
  neuralActivity = 75,
  onSeek
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [localProgress, setLocalProgress] = useState(progress);

  useEffect(() => {
    if (!isDragging) {
      setLocalProgress(progress);
    }
  }, [progress, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateProgress(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      updateProgress(e);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      onSeek?.(localProgress);
    }
  };

  const updateProgress = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newProgress = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    setLocalProgress(newProgress);
  };

  return (
    <div className="flex items-center gap-3 w-full">
      <span className="text-xs text-gray-400 min-w-[40px]">
        {Math.floor((localProgress / 100) * 180)}:{String(Math.floor(((localProgress / 100) * 180) % 60)).padStart(2, '0')}
      </span>
      
      <div 
        className="neural-progress-bar flex-1 cursor-pointer"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <motion.div 
          className="neural-progress-fill"
          style={{ width: `${localProgress}%` }}
          animate={{
            filter: isPlaying
              ? `drop-shadow(0 0 10px hsl(${120 + (neuralActivity / 100) * 60}, 70%, 50%))`
              : 'drop-shadow(0 0 0px transparent)'
          }}
        />
      </div>
      
      <span className="text-xs text-gray-400 min-w-[40px]">{duration}</span>
    </div>
  );
};

interface PlayButtonProps {
  isPlaying?: boolean;
  onToggle?: () => void;
  size?: 'sm' | 'md' | 'lg';
  neuralActivity?: number;
}

export const SpotifyPlayButton: React.FC<PlayButtonProps> = ({
  isPlaying = false,
  onToggle,
  size = 'md',
  neuralActivity = 75
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-7 h-7'
  };

  return (
    <motion.button
      className={`spotify-play-button ${sizeClasses[size]}`}
      onClick={onToggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        filter: isPlaying
          ? `drop-shadow(0 0 20px hsl(${120 + (neuralActivity / 100) * 60}, 70%, 50%))`
          : 'drop-shadow(0 4px 15px rgba(29, 185, 84, 0.4))'
      }}
    >
      <motion.div
        animate={{ rotate: isPlaying ? 0 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isPlaying ? (
          <div className="flex gap-1">
            <div className={`bg-black ${iconSizes[size]} rounded-sm spotify-pause-bar`} />
            <div className={`bg-black ${iconSizes[size]} rounded-sm spotify-pause-bar`} />
          </div>
        ) : (
          <div
            className={`${iconSizes[size]} bg-black spotify-play-triangle`}
          />
        )}
      </motion.div>
    </motion.button>
  );
};

