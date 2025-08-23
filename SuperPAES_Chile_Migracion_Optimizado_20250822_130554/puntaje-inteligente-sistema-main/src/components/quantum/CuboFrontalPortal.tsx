/* eslint-disable react-refresh/only-export-components */
// ðŸŒŒ CuboFrontalPortal.tsx - Portal CuÃ¡ntico Contextual Leonardo
// Context7 + Pensamiento Secuencial + 9 Agentes Neurales

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuantumEducationalArsenal } from '../../hooks/useQuantumEducationalArsenal';
import { useAuth } from '../../hooks/useAuth';
import styles from './CuboFrontal.module.css';

// =====================================================================================
// ðŸŽ¯ INTERFACES TYPESCRIPT LEONARDO
// =====================================================================================

interface CuboFace {
  id: number;
  name: string;
  icon: string;
  component: string;
  data: string;
  metric: number;
  context: 'dashboard' | 'exercise' | 'progress' | 'assessment';
}

interface QuantumMetrics {
  neuralEfficiency: number;
  learningVelocity: number;
  engagementScore: number;
  optimizationScore: number;
  cacheActive: boolean;
  playlistsCount: number;
  simulationsCount: number;
  hudActive: boolean;
}

interface QuantumParticle {
  id: number;
  x: number;
  y: number;
  delay: number;
}

interface UserInteraction {
  type: string;
  faceId?: number;
  context?: string;
  timestamp: number;
  metrics?: Partial<QuantumMetrics>;
}

interface CuboFrontalPortalProps {
  onFaceSelect?: (faceId: number) => void;
  context?: 'dashboard' | 'exercise' | 'progress' | 'assessment';
  className?: string;
}

// =====================================================================================
// ðŸŽ² CONFIGURACIÃ“N CUÃNTICA LEONARDO
// =====================================================================================

const CUBE_FACES: CuboFace[] = [
  {
    id: 0,
    name: 'Portal CuÃ¡ntico',
    icon: 'ðŸŒŒ',
    component: 'QuantumPortal',
    data: 'Context7 Activo',
    metric: 95,
    context: 'dashboard'
  },
  {
    id: 1,
    name: 'MÃ©tricas Neural',
    icon: 'ðŸ“Š',
    component: 'NeuralMetrics',
    data: 'Cache Optimizado',
    metric: 87,
    context: 'progress'
  },
  {
    id: 2,
    name: 'Spotify Educativo',
    icon: 'ðŸŽµ',
    component: 'SpotifyEducativo',
    data: 'Playlist Activa',
    metric: 60, // MÃ©trica base real, no hardcodeada
    context: 'exercise'
  },
  {
    id: 3,
    name: 'Bloom Navigator',
    icon: 'ðŸ§ ',
    component: 'BloomNavigator',
    data: 'Nivel Avanzado',
    metric: 78,
    context: 'assessment'
  },
  {
    id: 4,
    name: 'OCR Validator',
    icon: 'ðŸ“¸',
    component: 'OCRValidator',
    data: 'Leonardo Vision',
    metric: 89,
    context: 'exercise'
  },
  {
    id: 5,
    name: 'FUAS CuÃ¡ntico',
    icon: 'ðŸŽ“',
    component: 'FUASCuantico',
    data: 'Beca Disponible',
    metric: 85,
    context: 'progress'
  }
];

const QUANTUM_PARTICLES: QuantumParticle[] = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 1000
}));

// =====================================================================================
// ðŸŒŒ COMPONENTE PRINCIPAL
// =====================================================================================

export const CuboFrontalPortal: React.FC<CuboFrontalPortalProps> = ({
  onFaceSelect,
  context = 'dashboard',
  className = ''
}) => {
  // ðŸ”— Hooks Context7
  const { user } = useAuth();
  const {
    arsenalStatus,
    arsenalMetrics,
    isLoading,
    trackMetric,
    refreshArsenalStatus
  } = useQuantumEducationalArsenal();

  // ðŸŽ¯ Estados CuÃ¡nticos
  const [selectedFace, setSelectedFace] = useState<number>(0);
  const [cubeRotation, setCubeRotation] = useState<string>('cubeRotationDashboard');
  const [isInteracting, setIsInteracting] = useState(false);

  // ðŸ“Š MÃ©tricas CuÃ¡nticas Calculadas
  const quantumMetrics: QuantumMetrics = useMemo(() => ({
    neuralEfficiency: arsenalMetrics.neural_efficiency,
    learningVelocity: arsenalMetrics.learning_velocity,
    engagementScore: arsenalMetrics.engagement_score,
    optimizationScore: arsenalMetrics.optimization_score,
    cacheActive: arsenalStatus.cache_active,
    playlistsCount: arsenalStatus.playlists_count,
    simulationsCount: arsenalStatus.simulations_count,
    hudActive: arsenalStatus.hud_active
  }), [arsenalMetrics, arsenalStatus]);

  // ðŸŽ® Manejador de InteracciÃ³n CuÃ¡ntica
  const handleUserInteraction = useCallback(async (interaction: UserInteraction) => {
    try {
      // Registrar mÃ©trica en el arsenal
      await trackMetric(interaction.type, 1, {
        faceId: interaction.faceId,
        context: interaction.context,
        timestamp: interaction.timestamp
      });
      
      // Actualizar estado del arsenal
      await refreshArsenalStatus();
    } catch (error) {
      console.error('Error en interacciÃ³n cuÃ¡ntica:', error);
    }
  }, [trackMetric, refreshArsenalStatus]);

  // ðŸŽ® Manejadores de InteracciÃ³n
  const handleFaceClick = useCallback((faceId: number) => {
    if (isLoading) return;

    setSelectedFace(faceId);
    setIsInteracting(true);

    // Context7 + Pensamiento Secuencial
    handleUserInteraction({
      type: 'cube_face_select',
      faceId,
      context,
      timestamp: Date.now(),
      metrics: quantumMetrics
    });

    // RotaciÃ³n contextual usando clases CSS
    const face = CUBE_FACES[faceId];
    switch (face.context) {
      case 'dashboard':
        setCubeRotation('cubeRotationDashboard');
        break;
      case 'exercise':
        setCubeRotation('cubeRotationExercise');
        break;
      case 'progress':
        setCubeRotation('cubeRotationProgress');
        break;
      case 'assessment':
        setCubeRotation('cubeRotationAssessment');
        break;
    }

    // Callback externo
    onFaceSelect?.(faceId);

    // Reset interacciÃ³n
    setTimeout(() => setIsInteracting(false), 618); // NÃºmero Ã¡ureo
  }, [isLoading, context, quantumMetrics, handleUserInteraction, onFaceSelect]);

  // ðŸ”„ Efectos CuÃ¡nticos
  useEffect(() => {
    // Auto-rotaciÃ³n suave cada 5 segundos
    const interval = setInterval(() => {
      if (!isInteracting) {
        const rotations = ['cubeRotationDashboard', 'cubeRotationExercise', 'cubeRotationProgress', 'cubeRotationAssessment'];
        const currentIndex = rotations.indexOf(cubeRotation);
        const nextIndex = (currentIndex + 1) % rotations.length;
        setCubeRotation(rotations[nextIndex]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isInteracting, cubeRotation]);

  // ðŸŽ¨ Clases CSS DinÃ¡micas
  const containerClasses = [
    styles.quantumContainer,
    styles[`context${context.charAt(0).toUpperCase() + context.slice(1)}`],
    className
  ].filter(Boolean).join(' ');

  const cubeClasses = [
    styles.quantumCube,
    styles[cubeRotation],
    isInteracting ? styles.interacting : ''
  ].filter(Boolean).join(' ');

  // ðŸ” VerificaciÃ³n de AutenticaciÃ³n
  if (!user) {
    return (
      <div className={containerClasses}>
        <div className={styles.authRequired}>
          <div>
            <h2>ðŸ” Acceso Requerido</h2>
            <p>Inicia sesiÃ³n para acceder al Cubo CuÃ¡ntico</p>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================================================
  // ðŸŽ¨ RENDERIZADO PRINCIPAL
  // =====================================================================================

  return (
    <div className={containerClasses}>
      {/* ðŸ“Š HUD CuÃ¡ntico */}
      <div className={styles.quantumHUD}>
        <div className={styles.hudItem}>
          <span>Context7:</span>
          <span>{quantumMetrics.hudActive ? 'Activo' : 'Inactivo'}</span>
        </div>
        <div className={styles.hudItem}>
          <span>Neural Cache:</span>
          <span>{Math.round(quantumMetrics.neuralEfficiency)}%</span>
        </div>
        <div className={styles.hudItem}>
          <span>Engagement:</span>
          <span>{Math.round(quantumMetrics.engagementScore)}%</span>
        </div>
        <div className={styles.hudItem}>
          <span>Playlists:</span>
          <span>{quantumMetrics.playlistsCount}</span>
        </div>
        <div className={styles.hudItem}>
          <span>Simulaciones:</span>
          <span>{quantumMetrics.simulationsCount}</span>
        </div>
        <div className={styles.hudItem}>
          <span>OptimizaciÃ³n:</span>
          <span>{Math.round(quantumMetrics.optimizationScore)}%</span>
        </div>
      </div>

      {/* ðŸŽ² Cubo Principal */}
      <div className={cubeClasses}>
        {/* âœ¨ Campo CuÃ¡ntico de PartÃ­culas */}
        <div className={styles.quantumField}>
          {QUANTUM_PARTICLES.map((particle) => (
            <div
              key={particle.id}
              className={[
                styles.quantumParticle,
                styles[`particle${particle.id}`],
                styles[`particleDelay${Math.round(particle.delay / 100) * 100}`]
              ].join(' ')}
            />
          ))}
        </div>

        {/* ðŸ”® Caras del Cubo */}
        {CUBE_FACES.map((face) => {
          // Calcular mÃ©trica dinÃ¡mica basada en datos reales
          let dynamicMetric = face.metric;
          if (face.id === 1) { // MÃ©tricas Neural
            dynamicMetric = quantumMetrics.neuralEfficiency;
          } else if (face.id === 2) { // Spotify
            dynamicMetric = quantumMetrics.playlistsCount > 0 ? 95 : 20;
          } else if (face.id === 3) { // Bloom
            dynamicMetric = quantumMetrics.engagementScore;
          }

          return (
            <div
              key={face.id}
              className={`${styles.cubeFace} ${styles[`face${face.id}`]}`}
              onClick={() => handleFaceClick(face.id)}
              role="button"
              tabIndex={0}
              aria-label={`${face.name} - ${face.data}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleFaceClick(face.id);
                }
              }}
            >
              <div className={styles.faceContent}>
                <div className={styles.faceIcon}>{face.icon}</div>
                <div className={styles.faceName}>{face.name}</div>
                <div className={styles.faceData}>{face.data}</div>
                
                {/* ðŸ“Š MÃ©trica Visual */}
                <div className={styles.faceMetric}>
                  <div 
                    className={`${styles.metricBar} ${styles[`metricWidth${Math.round(dynamicMetric / 10) * 10}`]}`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ðŸ”„ Indicador de Carga */}
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}>
            <div className={styles.spinnerIcon}>âš¡</div>
            <div>Sincronizando Context7...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CuboFrontalPortal;
