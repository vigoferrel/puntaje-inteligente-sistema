/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { OptimizedCinematicWrapper } from './OptimizedCinematicWrapper';
import { ContextWindowProvider, ViewportVirtualizer, LoadPriority } from '../../core/context-windows';
import { usePerformanceMonitor } from '../../core/performance/PerformanceMonitor';
import { useGlobalCinematic } from '../../hooks/useGlobalCinematic';
import type { SafeString, SafeNumber, SafeBoolean } from '../../types/core';
import { supabase } from '../../integrations/supabase/leonardo-auth-client';

interface CinematicSystemIntegrationProps {
  children: React.ReactNode;
  enableOptimizations?: SafeBoolean;
  fallbackToBasic?: SafeBoolean;
}

/**
 * Componente de integraciÃ³n que combina el sistema cinematogrÃ¡fico existente
 * con las nuevas optimizaciones de ventanas de contexto 3D
 */
export const CinematicSystemIntegration: React.FC<CinematicSystemIntegrationProps> = ({
  children,
  enableOptimizations = true,
  fallbackToBasic = true
}) => {
  const { metrics, getPerformanceLevel } = usePerformanceMonitor();
  const { state: cinematicState } = useGlobalCinematic();
  const performanceLevel = getPerformanceLevel();

  // Determinar si usar el sistema optimizado o el bÃ¡sico
  const shouldUseOptimizedSystem = React.useMemo(() => {
    if (!enableOptimizations) return false;
    
    // Si el rendimiento es muy bajo y hay fallback habilitado, usar sistema bÃ¡sico
    if (fallbackToBasic && performanceLevel === 'low' && metrics?.fps && metrics.fps < 20) {
      return false;
    }
    
    return true;
  }, [enableOptimizations, fallbackToBasic, performanceLevel, metrics?.fps]);

  // ConfiguraciÃ³n adaptativa basada en el estado cinematogrÃ¡fico existente
  const adaptiveConfig = React.useMemo(() => {
    const baseConfig = {
      enableParticles: cinematicState?.preferences?.particleIntensity !== 'low',
      enableHolographics: cinematicState?.preferences?.visualMode === 'neural',
      enableTransitions: cinematicState?.preferences?.autoTransitions !== false,
      maxActiveWindows: 5,
      memoryBudget: 512
    };

    // Ajustar segÃºn el nivel de inmersiÃ³n
    switch (cinematicState?.preferences?.immersionLevel) {
      case 'minimal':
        return {
          ...baseConfig,
          enableParticles: false,
          enableHolographics: false,
          maxActiveWindows: 3,
          memoryBudget: 256
        };
      case 'standard':
        return {
          ...baseConfig,
          maxActiveWindows: 4,
          memoryBudget: 384
        };
      case 'full':
      default:
        return baseConfig;
    }
  }, [cinematicState]);

  // Sistema optimizado
  if (shouldUseOptimizedSystem) {
    return (
      <OptimizedCinematicWrapper
        enableParticles={adaptiveConfig.enableParticles}
        enableHolographics={adaptiveConfig.enableHolographics}
        enableTransitions={adaptiveConfig.enableTransitions}
        maxActiveWindows={adaptiveConfig.maxActiveWindows}
        memoryBudget={adaptiveConfig.memoryBudget}
      >
        {children}
      </OptimizedCinematicWrapper>
    );
  }

  // Sistema bÃ¡sico como fallback
  return (
    <div className="cinematic-basic-wrapper">
      <div className="basic-background-effects">
        {adaptiveConfig.enableParticles && (
          <div className="basic-particles">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="basic-particle" />
            ))}
          </div>
        )}
      </div>
      
      <div className="basic-content-container">
        {children}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .cinematic-basic-wrapper {
            position: relative;
            min-height: 100vh;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          }

          .basic-background-effects {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
          }

          .basic-particles {
            width: 100%;
            height: 100%;
          }

          .basic-particle {
            position: absolute;
            width: 1px;
            height: 1px;
            background: rgba(34, 211, 238, 0.3);
            animation: basic-float 3s linear infinite;
          }

          .basic-particle:nth-child(1) { left: 10%; animation-delay: 0s; }
          .basic-particle:nth-child(2) { left: 20%; animation-delay: 0.5s; }
          .basic-particle:nth-child(3) { left: 30%; animation-delay: 1s; }
          .basic-particle:nth-child(4) { left: 40%; animation-delay: 1.5s; }
          .basic-particle:nth-child(5) { left: 50%; animation-delay: 2s; }
          .basic-particle:nth-child(6) { left: 60%; animation-delay: 2.5s; }
          .basic-particle:nth-child(7) { left: 70%; animation-delay: 3s; }
          .basic-particle:nth-child(8) { left: 80%; animation-delay: 3.5s; }
          .basic-particle:nth-child(9) { left: 90%; animation-delay: 4s; }
          .basic-particle:nth-child(10) { left: 95%; animation-delay: 4.5s; }

          @keyframes basic-float {
            0% {
              transform: translateY(100vh);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateY(-100px);
              opacity: 0;
            }
          }

          .basic-content-container {
            position: relative;
            z-index: 10;
          }

          @media (prefers-reduced-motion: reduce) {
            .basic-particle {
              animation: none;
            }
          }
        `
      }} />
    </div>
  );
};

/**
 * Hook para obtener informaciÃ³n del sistema de optimizaciÃ³n
 */
export const useCinematicOptimization = () => {
  const { metrics, getPerformanceLevel } = usePerformanceMonitor();
  const performanceLevel = getPerformanceLevel();

  return {
    metrics,
    performanceLevel,
    isOptimized: performanceLevel !== 'low',
    recommendations: React.useMemo(() => {
      const recs: string[] = [];
      
      if (metrics) {
        if (metrics.fps < 30) {
          recs.push('Considerar reducir efectos de partÃ­culas');
        }
        if (metrics.memoryUsage > 400) {
          recs.push('Memoria alta - reducir componentes activos');
        }
        if (metrics.componentCount > 50) {
          recs.push('Muchos componentes - activar virtualizaciÃ³n');
        }
      }
      
      return recs;
    }, [metrics])
  };
};

export default CinematicSystemIntegration;

