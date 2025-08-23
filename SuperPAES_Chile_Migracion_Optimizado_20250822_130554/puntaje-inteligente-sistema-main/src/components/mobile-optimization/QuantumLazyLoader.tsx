/* eslint-disable react-refresh/only-export-components */
// QuantumLazyLoader.tsx - Lazy loading inteligente
// Context7 + Modo Secuencial - Optimizado para gama media

import React, { useState, useEffect, useRef, Suspense } from 'react';

interface LazyLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
}

export const QuantumLazyLoader: React.FC<LazyLoaderProps> = ({
  children,
  fallback = <div className="quantum-lazy-loading">Cargando...</div>,
  threshold = 0.1,
  rootMargin = '50px'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // Context7: Intersection Observer para lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
          // Desconectar observer despues de cargar
          if (elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [threshold, rootMargin, hasLoaded]);

  return (
    <div ref={elementRef} className="quantum-lazy-container">
      {isVisible ? (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      ) : (
        <div 
          className="quantum-lazy-placeholder"
          style={{
            minHeight: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--quantum-bg-content)',
            borderRadius: '8px',
            border: '1px solid var(--quantum-border-secondary)'
          }}
        >
          <div className="quantum-lazy-skeleton">
            <div className="quantum-skeleton-line"></div>
            <div className="quantum-skeleton-line short"></div>
            <div className="quantum-skeleton-line"></div>
          </div>
        </div>
      )}
    </div>
  );
};

// Hook para lazy loading de imagenes
export const useQuantumLazyImage = (src: string) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const img = new Image();
ECHO est  desactivado.
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
ECHO est  desactivado.
    img.onerror = () => {
      setIsError(true);
    };
ECHO est  desactivado.
    img.src = src;
  }, [src]);

  return { imageSrc, isLoaded, isError };
};

export default QuantumLazyLoader;

