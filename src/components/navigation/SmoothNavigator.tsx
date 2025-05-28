
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const SmoothNavigator: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll suave al cambiar de ruta
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Añadir clase para transiciones suaves
    document.body.classList.add('smooth-scroll');
    
    return () => {
      document.body.classList.remove('smooth-scroll');
    };
  }, [location.pathname]);

  useEffect(() => {
    // Añadir estilos CSS para scroll suave
    const style = document.createElement('style');
    style.textContent = `
      .smooth-scroll {
        scroll-behavior: smooth;
      }
      
      .messages-container {
        scroll-behavior: smooth;
      }
      
      .exercise-container {
        scroll-behavior: smooth;
      }
      
      /* Transiciones suaves para navegación */
      .fade-transition {
        transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
      }
      
      .fade-transition.entering {
        opacity: 0;
        transform: translateY(20px);
      }
      
      .fade-transition.entered {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
};
