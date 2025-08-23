/* eslint-disable react-refresh/only-export-components */

import React, { useEffect, useCallback } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { useLocation } from 'react-router-dom';

export const OptimizedSmoothNavigator: React.FC = () => {
  const location = useLocation();

  // FunciÃ³n para scroll suave optimizado con soporte para data-section
  const smoothScrollTo = useCallback((target: string | number) => {
    if (typeof target === 'string') {
      // Primero buscar por data-section attribute
      let element = document.querySelector(`[data-section="${target}"]`);
      
      // Si no existe, buscar por selector CSS normal
      if (!element) {
        element = document.querySelector(target);
      }
      
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
        
        // Notificar scroll completado despuÃ©s de la animaciÃ³n
        setTimeout(() => {
          console.log(`ðŸ“ NavegaciÃ³n completada a secciÃ³n: ${target}`);
        }, 500);
      }
    } else {
      window.scrollTo({
        top: target,
        behavior: 'smooth'
      });
    }
  }, []);

  // FunciÃ³n para navegaciÃ³n automÃ¡tica entre secciones del dashboard
  const navigateToSection = useCallback((sectionName: string) => {
    smoothScrollTo(sectionName);
  }, [smoothScrollTo]);

  // Exponer funciones globalmente para uso desde otros componentes
  useEffect(() => {
    (window as unknown).navigateToSection = navigateToSection;
    (window as unknown).smoothScrollTo = smoothScrollTo;
    
    return () => {
      delete (window as unknown).navigateToSection;
      delete (window as unknown).smoothScrollTo;
    };
  }, [navigateToSection, smoothScrollTo]);

  // Manejar scroll entre rutas
  useEffect(() => {
    // Scroll al inicio en cambio de ruta
    setTimeout(() => {
      smoothScrollTo(0);
    }, 100);
  }, [location.pathname, smoothScrollTo]);

  // Interceptar clicks para navegaciÃ³n suave (mejorado)
  useEffect(() => {
    const handleNavClick = (e: Event) => {
      const target = e.target as HTMLElement;
      
      // Buscar enlaces de navegaciÃ³n suave
      const navLink = target.closest('[data-smooth-scroll]');
      const sectionLink = target.closest('[data-navigate-section]');
      
      if (navLink) {
        e.preventDefault();
        const scrollTarget = navLink.getAttribute('data-smooth-scroll');
        if (scrollTarget) {
          smoothScrollTo(scrollTarget);
        }
      }
      
      // Nuevo: Soporte para navegaciÃ³n por data-section
      if (sectionLink) {
        e.preventDefault();
        const sectionName = sectionLink.getAttribute('data-navigate-section');
        if (sectionName) {
          navigateToSection(sectionName);
        }
      }
    };

    document.addEventListener('click', handleNavClick);
    return () => document.removeEventListener('click', handleNavClick);
  }, [smoothScrollTo, navigateToSection]);

  // AÃ±adir estilos CSS dinÃ¡micos
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* ðŸš€ FASE 3: CSS Scroll Avanzado - Optimizaciones Avanzadas */
      html {
        scroll-behavior: smooth;
        scroll-padding-top: 4rem;
      }
      
      body {
        scroll-behavior: smooth;
        scroll-padding-top: 4rem;
      }
      
      .dashboard-container {
        scroll-behavior: smooth;
        scroll-snap-type: y proximity;
        scroll-padding-top: 4rem;
      }
      
      /* Contenedor principal con scroll optimizado */
      .min-h-screen {
        scroll-behavior: smooth;
        scroll-snap-type: y proximity;
        scroll-padding-top: 4rem;
      }
      
      /* Secciones del dashboard con scroll-snap */
      [data-section] {
        scroll-snap-align: start;
        scroll-margin-top: 4rem;
      }
      
      /* Cards con transiciones mejoradas */
      .metrics-card {
        transition: all 0.3s ease;
        scroll-snap-align: start;
      }
      
      .metrics-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      }
      
      /* Animaciones de entrada */
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
      
      /* Contenedores de scroll suave */
      .smooth-scroll-container {
        overflow-y: auto;
        scroll-behavior: smooth;
        scroll-snap-type: y proximity;
        scroll-padding-top: 4rem;
      }
      
      /* Grid de cards con scroll-snap */
      .card-grid {
        scroll-snap-type: y proximity;
        scroll-padding-top: 4rem;
      }
      
      .card-grid > * {
        scroll-snap-align: start;
        scroll-margin-top: 1rem;
      }
      
      /* Botones de navegaciÃ³n mejorados */
      [data-navigate-section] {
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      [data-navigate-section]:hover {
        transform: scale(1.05);
      }
      
      /* Optimizaciones para mÃ³viles */
      @media (max-width: 768px) {
        html, body {
          scroll-padding-top: 2rem;
        }
        
        [data-section] {
          scroll-margin-top: 2rem;
        }
        
        .smooth-scroll-container {
          scroll-padding-top: 2rem;
        }
      }
      
      /* Indicador de scroll activo */
      .scroll-indicator {
        position: fixed;
        top: 50%;
        right: 1rem;
        transform: translateY(-50%);
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      
      .scroll-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(255,255,255,0.3);
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .scroll-dot.active {
        background: rgba(99, 102, 241, 1);
        transform: scale(1.5);
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // AÃ±adir indicador visual de scroll (opcional)
  useEffect(() => {
    const sections = ['header', 'main-stats', 'tools', 'recommendations', 'system-status', 'user-metrics'];
    
    // Crear indicador de scroll si no existe
    if (!document.querySelector('.scroll-indicator')) {
      const indicator = document.createElement('div');
      indicator.className = 'scroll-indicator';
      
      sections.forEach((section, index) => {
        const dot = document.createElement('div');
        dot.className = 'scroll-dot';
        dot.setAttribute('data-navigate-section', section);
        dot.title = `Ir a ${section.replace('-', ' ')}`;
        
        if (index === 0) dot.classList.add('active');
        
        indicator.appendChild(dot);
      });
      
      document.body.appendChild(indicator);
    }
    
    // Limpiar al desmontar
    return () => {
      const indicator = document.querySelector('.scroll-indicator');
      if (indicator) {
        indicator.remove();
      }
    };
  }, []);

  return null;
};

