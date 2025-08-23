/* eslint-disable react-refresh/only-export-components */
// QuantumPerformanceMonitor.tsx - Monitor de performance
// Context7 + Modo Secuencial - Monitoreo para gama media

import React, { useState, useEffect, useRef } from 'react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  loadTime: number;
  renderTime: number;
  networkSpeed: string;
}

export const QuantumPerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memoryUsage: 0,
    loadTime: 0,
    renderTime: 0,
    networkSpeed: 'unknown'
  });
ECHO est  desactivado.
  const [isVisible, setIsVisible] = useState(false);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  // Context7: Monitor FPS para detectar performance issues
  useEffect(() => {
    let animationId: number;
ECHO est  desactivado.
    const measureFPS = () => {
      frameCount.current++;
      const currentTime = performance.now();
ECHO est  desactivado.
      if (currentTime - lastTime.current >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current));
ECHO est  desactivado.
        setMetrics(prev => ({ ...prev, fps }));
ECHO est  desactivado.
        frameCount.current = 0;
        lastTime.current = currentTime;
      }
ECHO est  desactivado.
      animationId = requestAnimationFrame(measureFPS);
    };
ECHO est  desactivado.
    measureFPS();
ECHO est  desactivado.
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Context7: Monitor memoria si esta disponible
  useEffect(() => {
    const measureMemory = () => {
      if ((performance as any).memory) {
        const memory = (performance as any).memory;
        const memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024);
        setMetrics(prev => ({ ...prev, memoryUsage }));
      }
    };
ECHO est  desactivado.
    const interval = setInterval(measureMemory, 2000);
    return () => clearInterval(interval);
  }, []);

  // Context7: Detectar velocidad de red
  useEffect(() => {
    const connection = (navigator as any).connection;
    if (connection) {
      const updateNetworkSpeed = () => {
        const speed = connection.effectiveType || 'unknown';
        setMetrics(prev => ({ ...prev, networkSpeed: speed }));
      };
ECHO est  desactivado.
      updateNetworkSpeed();
      connection.addEventListener('change', updateNetworkSpeed);
ECHO est  desactivado.
      return () => connection.removeEventListener('change', updateNetworkSpeed);
    }
  }, []);

  const getPerformanceStatus = () => {
    if (metrics.fps < 30) return { status: 'poor', color: '#ef4444' };
    if (metrics.fps < 50) return { status: 'fair', color: '#f59e0b' };
    return { status: 'good', color: '#22c55e' };
  };

  const performanceStatus = getPerformanceStatus();

  if (!isVisible) {
    return (
      <button
        className="quantum-performance-toggle"
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 9999,
          padding: '8px',
          borderRadius: '50',
          border: 'none',
          backgroundColor: performanceStatus.color,
          color: 'white',
          fontSize: '12px',
          cursor: 'pointer'
        }}
      >
        ðŸ“Š
      </button>
    );
  }

  return (
    <div
      className="quantum-performance-monitor"
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '12px',
        fontFamily: 'monospace',
        minWidth: '200px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span>Performance Monitor</span>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '0'
          }}
        >
          âœ•
        </button>
      </div>
ECHO est  desactivado.
      <div>FPS: <span style={{ color: performanceStatus.color }}>{metrics.fps}</span></div>
      <div>Memoria: {metrics.memoryUsage} MB</div>
      <div>Red: {metrics.networkSpeed}</div>
      <div>Estado: <span style={{ color: performanceStatus.color }}>{performanceStatus.status}</span></div>
    </div>
  );
};

export default QuantumPerformanceMonitor;

