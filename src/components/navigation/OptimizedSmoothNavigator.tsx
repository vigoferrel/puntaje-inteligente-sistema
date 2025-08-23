
import React, { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export const OptimizedSmoothNavigator: React.FC = () => {
  const location = useLocation();

  // Función para scroll suave optimizado
  const smoothScrollTo = useCallback((target: string | number) => {
    if (typeof target === 'string') {
      const element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }
    } else {
      window.scrollTo({
        top: target,
        behavior: 'smooth'
      });
    }
  }, []);

  // Manejar scroll entre rutas
  useEffect(() => {
    // Scroll al inicio en cambio de ruta
    setTimeout(() => {
      smoothScrollTo(0);
    }, 100);
  }, [location.pathname, smoothScrollTo]);

  // Interceptar clicks para navegación suave
  useEffect(() => {
    const handleNavClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const navLink = target.closest('[data-smooth-scroll]');
      
      if (navLink) {
        e.preventDefault();
        const scrollTarget = navLink.getAttribute('data-smooth-scroll');
        if (scrollTarget) {
          smoothScrollTo(scrollTarget);
        }
      }
    };

    document.addEventListener('click', handleNavClick);
    return () => document.removeEventListener('click', handleNavClick);
  }, [smoothScrollTo]);

  // Añadir estilos CSS dinámicos
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      html {
        scroll-behavior: smooth;
      }
      
      .dashboard-container {
        scroll-behavior: smooth;
      }
      
      .metrics-card {
        transition: all 0.3s ease;
      }
      
      .metrics-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      }
      
      .section-transition {
        opacity: 0;
        transform: translateY(20px);
        animation: fadeInUp 0.6s ease-out forwards;
      }
      
      @keyframes fadeInUp {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .smooth-scroll-container {
        overflow-y: auto;
        scroll-behavior: smooth;
      }
      
      .card-grid {
        scroll-snap-type: y mandatory;
      }
      
      .card-grid > * {
        scroll-snap-align: start;
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return null;
};
