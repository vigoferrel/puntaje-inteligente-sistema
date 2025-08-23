/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import { Brain, Zap, Activity } from 'lucide-react';
import { supabase } from '../../../integrations/supabase/leonardo-auth-client';

interface NeuralVelocityMeterProps {
  userId: string;
  className?: string;
}

interface NeuralMetrics {
  learningVelocity: number; // 0-100
  cognitiveLoad: number; // 0-100
  adaptationLevel: number; // -50 to +50
  efficiency: number; // 0-100
}

interface ParticleEffectProps {
  intensity: number;
  color: string;
}

/**
 * NEURAL VELOCITY METER - COMPONENTE REVOLUCIONARIO
 * 
 * Muestra mÃ©tricas neurales en tiempo real con efectos visuales
 * PartÃ­culas que reaccionan a la velocidad de aprendizaje
 */
const ParticleEffect: React.FC<ParticleEffectProps> = ({ intensity, color }) => {
  const particleCount = Math.floor(intensity / 10) + 3;
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: particleCount }).map((_, i) => (
        <div
          key={i}
          className={`absolute w-1 h-1 ${color} rounded-full animate-pulse`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
};

const getVelocityColor = (velocity: number): { bg: string; text: string; particle: string } => {
  if (velocity >= 80) return { bg: 'bg-green-500', text: 'text-green-400', particle: 'bg-green-400' };
  if (velocity >= 60) return { bg: 'bg-blue-500', text: 'text-blue-400', particle: 'bg-blue-400' };
  if (velocity >= 40) return { bg: 'bg-yellow-500', text: 'text-yellow-400', particle: 'bg-yellow-400' };
  return { bg: 'bg-red-500', text: 'text-red-400', particle: 'bg-red-400' };
};

const getEfficiencyLabel = (velocity: number): string => {
  if (velocity >= 90) return 'Excelente';
  if (velocity >= 80) return 'Muy Buena';
  if (velocity >= 60) return 'Buena';
  if (velocity >= 40) return 'Regular';
  return 'Mejorando';
};

export const NeuralVelocityMeter: React.FC<NeuralVelocityMeterProps> = ({ 
  userId, 
  className = "" 
}) => {
  const [metrics, setMetrics] = useState<NeuralMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNeuralMetrics = async () => {
      try {
        setLoading(true);
        
        // Simular mÃ©tricas neurales en tiempo real
        // En producciÃ³n, esto vendrÃ­a del DiagnosticNeuralEngine
        const mockMetrics: NeuralMetrics = {
          learningVelocity: Math.floor(Math.random() * 40) + 60, // 60-100
          cognitiveLoad: Math.floor(Math.random() * 30) + 40, // 40-70
          adaptationLevel: Math.floor(Math.random() * 20) + 5, // 5-25
          efficiency: Math.floor(Math.random() * 30) + 70 // 70-100
        };
        
        setMetrics(mockMetrics);
      } catch (error) {
        console.error('Error fetching neural metrics:', error);
        // Fallback con mÃ©tricas demo
        setMetrics({
          learningVelocity: 85,
          cognitiveLoad: 60,
          adaptationLevel: 12,
          efficiency: 88
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNeuralMetrics();
    
    // Actualizar mÃ©tricas cada 5 segundos para efecto en tiempo real
    const interval = setInterval(fetchNeuralMetrics, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  if (loading) {
    return (
      <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-3"></div>
          <div className="h-4 bg-gray-700 rounded mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-3/4 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  const velocityColors = getVelocityColor(metrics.learningVelocity);
  const circumference = 2 * Math.PI * 35; // radio de 35
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (metrics.learningVelocity / 100) * circumference;

  return (
    <div className={`bg-gray-800 rounded-lg p-4 relative overflow-hidden ${className}`}>
      {/* Efectos de partÃ­culas */}
      <ParticleEffect 
        intensity={metrics.learningVelocity} 
        color={velocityColors.particle}
      />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-green-400" />
            <span className="text-sm font-medium text-white">Neural Velocity</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400">Live</span>
          </div>
        </div>

        {/* Medidor circular principal */}
        <div className="flex flex-col items-center mb-4">
          <div className="relative w-24 h-24">
            {/* CÃ­rculo de fondo */}
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="35"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-gray-700"
              />
              {/* CÃ­rculo de progreso */}
              <circle
                cx="40"
                cy="40"
                r="35"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className={velocityColors.text}
                style={{
                  transition: 'stroke-dashoffset 0.5s ease-in-out',
                }}
              />
            </svg>
            
            {/* Valor central */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-lg font-bold ${velocityColors.text}`}>
                  {metrics.learningVelocity}%
                </div>
              </div>
            </div>
          </div>
          
          {/* Label de eficiencia */}
          <div className="text-center mt-2">
            <div className={`text-sm font-medium ${velocityColors.text}`}>
              {getEfficiencyLabel(metrics.learningVelocity)}
            </div>
            <div className="text-xs text-gray-400">Velocidad de Aprendizaje</div>
          </div>
        </div>

        {/* MÃ©tricas adicionales */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300">Carga Cognitiva</span>
            </div>
            <span className="text-blue-400 font-medium">{metrics.cognitiveLoad}%</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-300">AdaptaciÃ³n</span>
            </div>
            <span className="text-yellow-400 font-medium">+{metrics.adaptationLevel}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-gray-300">Eficiencia</span>
            </div>
            <span className="text-purple-400 font-medium">{metrics.efficiency}%</span>
          </div>
        </div>

        {/* Indicador de estado neural */}
        <div className="mt-4 p-2 bg-gray-700/50 rounded text-center">
          <div className="text-xs text-gray-400 mb-1">Estado Neural</div>
          <div className={`text-sm font-medium ${velocityColors.text}`}>
            {metrics.learningVelocity >= 80 ? 'ðŸ§  Ã“ptimo' : 
             metrics.learningVelocity >= 60 ? 'âš¡ Activo' : 
             'ðŸ”„ Calibrando'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeuralVelocityMeter;

