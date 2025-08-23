/* eslint-disable react-refresh/only-export-components */
/**
 * ðŸŽ¯ CleanQuantumBridge - Context7 + Pensamiento Secuencial
 * FilosofÃ­a Miguel Ãngel: Quitar lo innecesario, revelar la esencia
 * Puente minimalista que unifica Mobile + Performance + Spotify-3D
 * Sin magnificencia, solo funcionalidad esencial
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { CentralSpotifyDashboard } from '../spotify-neural/CentralSpotifyDashboard';
import { useAuth } from '../../hooks/useAuth';
import { quantumGuideService } from '../../services/quantum/QuantumGuideService';
import styles from './CleanQuantumBridge.module.css';

// Interfaces para navegador moderno
interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
}

interface PerformanceWithMemory extends Performance {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

// ðŸ“± Context7 - DetecciÃ³n de dispositivo limpia
interface DeviceContext {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  pixelRatio: number;
  maxMemory: number;
}

// ðŸŽ® Context7 - Calidad de renderizado adaptativa
interface RenderQuality {
  level: 'low' | 'medium' | 'high';
  maxNodes: number;
  enableShadows: boolean;
  antialias: boolean;
  pixelRatio: number;
}

// ðŸ§  Context7 - Estado del arsenal educativo
interface EducationalArsenal {
  spotifyActive: boolean;
  cerebroActive: boolean;
  bloomActive: boolean;
  currentFocus: 'spotify' | 'cerebro' | 'bloom' | 'unified';
}

// ðŸ“Š Context7 - MÃ©tricas de performance
interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  renderTime: number;
  isOptimal: boolean;
}

// ðŸŽ¯ Hook para detecciÃ³n de dispositivo (Context7 - Contexto TÃ©cnico)
const useDeviceOptimization = (): DeviceContext => {
  return useMemo(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent);
    const isTablet = /tablet|ipad/i.test(userAgent) && !isMobile;
    const isDesktop = !isMobile && !isTablet;
    
    return {
      isMobile,
      isTablet,
      isDesktop,
      pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      maxMemory: (navigator as NavigatorWithMemory).deviceMemory || 4
    };
  }, []);
};

// ðŸŽ¨ Hook para calidad de renderizado (Context7 - Contexto Performance)
const useCleanRenderer = (device: DeviceContext): RenderQuality => {
  return useMemo(() => {
    if (device.isMobile) {
      return {
        level: 'low',
        maxNodes: 50,
        enableShadows: false,
        antialias: false,
        pixelRatio: 1
      };
    }
    
    if (device.isTablet) {
      return {
        level: 'medium',
        maxNodes: 100,
        enableShadows: false,
        antialias: true,
        pixelRatio: 1.5
      };
    }
    
    return {
      level: 'high',
      maxNodes: 200,
      enableShadows: true,
      antialias: true,
      pixelRatio: 2
    };
  }, [device]);
};

// ðŸ“ˆ Hook para monitoreo de performance (Context7 - Contexto Datos)
const usePerformanceGuard = (): PerformanceMetrics => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    renderTime: 0,
    isOptimal: true
  });

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measurePerformance = () => {
      const currentTime = performance.now();
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        const memoryUsage = (performance as PerformanceWithMemory).memory?.usedJSHeapSize || 0;
        
        setMetrics({
          fps,
          memoryUsage: memoryUsage / 1024 / 1024, // MB
          renderTime: currentTime - lastTime,
          isOptimal: fps >= 30 && memoryUsage < 100 * 1024 * 1024 // 100MB
        });
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measurePerformance);
    };
    
    measurePerformance();
  }, []);

  return metrics;
};

// ðŸ‘† Hook para navegaciÃ³n tÃ¡ctil (Context7 - Contexto UX)
const useTouchNavigation = (device: DeviceContext) => {
  const [touchState, setTouchState] = useState({
    isTouch: false,
    lastTap: 0,
    swipeDirection: null as 'left' | 'right' | 'up' | 'down' | null
  });

  const handleTouch = useCallback((event: TouchEvent) => {
    if (!device.isMobile) return;
    
    const touch = event.touches[0];
    const currentTime = Date.now();
    
    setTouchState(prev => ({
      ...prev,
      isTouch: true,
      lastTap: currentTime
    }));
  }, [device.isMobile]);

  useEffect(() => {
    if (device.isMobile) {
      document.addEventListener('touchstart', handleTouch, { passive: true });
      return () => document.removeEventListener('touchstart', handleTouch);
    }
  }, [device.isMobile, handleTouch]);

  return touchState;
};

// ðŸŽµ Componente 3D limpio para Spotify Neural
const CleanSpotify3D: React.FC<{ quality: RenderQuality }> = ({ quality }) => {
  return (
    <group>
      {/* Grid 3D simple para playlists */}
      <gridHelper args={[10, 10, 0x444444, 0x444444]} />
      
      {/* Cubos simples para tracks */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#667eea" transparent opacity={0.8} />
      </mesh>
      
      {/* LÃ­neas de progreso */}
      <mesh position={[2, 0.1, 0]}>
        <boxGeometry args={[3, 0.1, 0.1]} />
        <meshBasicMaterial color="#4ade80" />
      </mesh>
    </group>
  );
};

// ðŸ§  Componente 3D limpio para Cerebro Visual
const CleanCerebro3D: React.FC<{ quality: RenderQuality }> = ({ quality }) => {
  return (
    <group position={[5, 0, 0]}>
      {/* Esfera simple para cerebro */}
      <mesh>
        <sphereGeometry args={[1, quality.level === 'low' ? 8 : 16, quality.level === 'low' ? 6 : 12]} />
        <meshBasicMaterial color="#8b5cf6" wireframe />
      </mesh>
      
      {/* Conexiones neuronales simples */}
      {Array.from({ length: quality.maxNodes / 10 }, (_, i) => (
        <mesh key={i} position={[Math.sin(i) * 2, Math.cos(i) * 2, 0]}>
          <sphereGeometry args={[0.1, 4, 4]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
      ))}
    </group>
  );
};

// ðŸŒ¸ Componente 3D limpio para Bloom
const CleanBloom3D: React.FC<{ quality: RenderQuality }> = ({ quality }) => {
  const bloomLevels = ['Recordar', 'Comprender', 'Aplicar', 'Analizar', 'Evaluar', 'Crear'];
  
  return (
    <group position={[-5, 0, 0]}>
      {/* PirÃ¡mide de Bloom simplificada */}
      {bloomLevels.map((level, index) => (
        <mesh key={level} position={[0, index * 0.5, 0]}>
          <boxGeometry args={[2 - index * 0.2, 0.3, 2 - index * 0.2]} />
          <meshBasicMaterial color={`hsl(${index * 60}, 70%, 60%)`} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
};

// ðŸŽ¯ Componente principal CleanQuantumBridge
export const CleanQuantumBridge: React.FC = () => {
  const { user } = useAuth();
  const device = useDeviceOptimization();
  const quality = useCleanRenderer(device);
  const performance = usePerformanceGuard();
  const touch = useTouchNavigation(device);
  
  const [arsenal, setArsenal] = useState<EducationalArsenal>({
    spotifyActive: true,
    cerebroActive: false,
    bloomActive: false,
    currentFocus: 'unified'
  });

  // ðŸŽ® Cambio de vista limpio
  const switchView = useCallback((focus: EducationalArsenal['currentFocus']) => {
    setArsenal(prev => ({
      ...prev,
      currentFocus: focus,
      spotifyActive: focus === 'spotify' || focus === 'unified',
      cerebroActive: focus === 'cerebro' || focus === 'unified',
      bloomActive: focus === 'bloom' || focus === 'unified'
    }));
  }, []);

  // ðŸ“± Renderizado adaptativo segÃºn dispositivo
  const renderContent = () => {
    if (device.isMobile) {
      // Vista mobile simplificada
      return (
        <div className={styles.cleanMobileView}>
          <div className={styles.mobileTabs}>
            <button
              onClick={() => switchView('spotify')}
              className={`${styles.tab} ${arsenal.currentFocus === 'spotify' ? styles.active : ''}`}
            >
              ðŸŽµ Spotify
            </button>
            <button
              onClick={() => switchView('cerebro')}
              className={`${styles.tab} ${arsenal.currentFocus === 'cerebro' ? styles.active : ''}`}
            >
              ðŸ§  Cerebro
            </button>
            <button
              onClick={() => switchView('bloom')}
              className={`${styles.tab} ${arsenal.currentFocus === 'bloom' ? styles.active : ''}`}
            >
              ðŸŒ¸ Bloom
            </button>
          </div>
          
          {arsenal.currentFocus === 'spotify' && <CentralSpotifyDashboard />}
          {arsenal.currentFocus === 'cerebro' && (
            <div className={styles.cerebroPlaceholder}>
              <h3>ðŸ§  Cerebro Visual</h3>
              <p>Sistema hologrÃ¡fico de anÃ¡lisis cognitivo</p>
              <div className={styles.placeholderContent}>
                <div className={styles.neuralNode}></div>
                <div className={styles.neuralNode}></div>
                <div className={styles.neuralNode}></div>
              </div>
            </div>
          )}
          {arsenal.currentFocus === 'bloom' && (
            <div className={styles.bloomPlaceholder}>
              <h3>ðŸŒ¸ Bloom Taxonomy</h3>
              <p>NavegaciÃ³n cognitiva adaptativa</p>
              <div className={styles.bloomLevels}>
                {['Crear', 'Evaluar', 'Analizar', 'Aplicar', 'Comprender', 'Recordar'].map((level, index) => (
                  <div key={level} className={`${styles.bloomLevel} ${styles[`bloomLevel${index}`]}`}>
                    {level}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Vista desktop con 3D limpio
    return (
      <div className={styles.cleanDesktopView}>
        <div className={styles.canvasContainer}>
          <Canvas
            camera={{ position: [0, 5, 10], fov: 50 }}
            gl={{
              antialias: quality.antialias,
              powerPreference: device.isMobile ? 'low-power' : 'high-performance'
            }}
            dpr={quality.pixelRatio}
          >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            
            {arsenal.spotifyActive && <CleanSpotify3D quality={quality} />}
            {arsenal.cerebroActive && <CleanCerebro3D quality={quality} />}
            {arsenal.bloomActive && <CleanBloom3D quality={quality} />}
            
            <OrbitControls
              enablePan={!device.isMobile}
              enableZoom={true}
              enableRotate={true}
              maxDistance={20}
              minDistance={5}
            />
          </Canvas>
        </div>
        
        <div className={styles.sidePanel}>
          <div className={styles.performanceIndicator}>
            <span className={performance.isOptimal ? styles.optimal : styles.warning}>
              {performance.fps} FPS | {performance.memoryUsage.toFixed(1)} MB
            </span>
          </div>
          
          <div className={styles.arsenalControls}>
            <button
              onClick={() => switchView('unified')}
              className={arsenal.currentFocus === 'unified' ? styles.active : ''}
            >
              ðŸŒŒ Vista Unificada
            </button>
            <button
              onClick={() => switchView('spotify')}
              className={arsenal.currentFocus === 'spotify' ? styles.active : ''}
            >
              ðŸŽµ Solo Spotify
            </button>
            <button
              onClick={() => switchView('cerebro')}
              className={arsenal.currentFocus === 'cerebro' ? styles.active : ''}
            >
              ðŸ§  Solo Cerebro
            </button>
            <button
              onClick={() => switchView('bloom')}
              className={arsenal.currentFocus === 'bloom' ? styles.active : ''}
            >
              ðŸŒ¸ Solo Bloom
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.cleanQuantumBridge}>
      {renderContent()}
    </div>
  );
};

export default CleanQuantumBridge;
